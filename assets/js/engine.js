(function (root, factory) {
  const questions =
    typeof module === 'object' && module.exports
      ? require('./questions.js')
      : root.CurieuxQuestions;
  const api = factory(questions);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CurieuxEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (content) {
  'use strict';
  const SESSION_LENGTH = 5;
  const STORAGE_KEY = 'les-petits-curieux.v1';
  const defaults = { sound: true, effects: true, rate: 0.9, voice: '' };
  const missionIds = new Set(content.missions.map((m) => m.id));

  function shuffle(items, rng = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function normalise(value) {
    return String(value ?? '')
      .normalize('NFC')
      .toLocaleLowerCase('fr-FR')
      .replace(/[’‘]/g, "'")
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?;:])/g, '$1');
  }
  function withoutAccents(value) {
    return normalise(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  function checkAnswer(question, submitted) {
    const expected = normalise(question.answer);
    const answer = normalise(Array.isArray(submitted) ? submitted.join(' ') : submitted);
    if (!answer) return { correct: false, empty: true, accentOnly: false };
    if (question.type === 'number') {
      const number = answer.replace(/\s/g, '');
      return {
        correct: /^\d+$/.test(number) && Number(number) === Number(question.answer),
        empty: false,
        accentOnly: false
      };
    }
    const correct = answer === expected;
    return {
      correct,
      empty: false,
      accentOnly:
        !correct &&
        question.type === 'dictation' &&
        withoutAccents(answer) === withoutAccents(expected)
    };
  }
  function prepareQuestion(question, rng) {
    const result = { ...question };
    if (question.options) result.options = shuffle(question.options, rng);
    if (question.tokens) {
      result.tiles = shuffle(
        question.tokens.map((text, id) => ({ text, id })),
        rng
      );
      if (result.tiles.every((tile, i) => tile.id === i)) result.tiles.push(result.tiles.shift());
    }
    return result;
  }
  function buildQuestions(missionId, level, { rng = Math.random, avoidIds = [] } = {}) {
    if (!missionIds.has(missionId)) throw new Error('Activité inconnue.');
    if (![1, 2, 3].includes(level)) throw new Error('Niveau inconnu.');
    const bank = content.banks[`${missionId}:${level}`];
    const avoided = new Set(avoidIds);
    let selected;
    if (bank) {
      selected = [
        ...shuffle(
          bank.filter((q) => !avoided.has(q.id)),
          rng
        ),
        ...shuffle(
          bank.filter((q) => avoided.has(q.id)),
          rng
        )
      ].slice(0, SESSION_LENGTH);
    } else {
      const pool = new Map();
      for (let i = 0; i < 100 && pool.size < SESSION_LENGTH * 2; i++) {
        const question = content.generate(missionId, level, rng);
        pool.set(question.id, question);
      }
      const values = [...pool.values()];
      selected = [
        ...values.filter((q) => !avoided.has(q.id)),
        ...values.filter((q) => avoided.has(q.id))
      ].slice(0, SESSION_LENGTH);
      // A degenerate RNG must not freeze a session. Fall back to a deterministic stream.
      let seed = 3749;
      const fallbackRng = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      for (let i = 0; selected.length < SESSION_LENGTH && i < 200; i++) {
        const question = content.generate(missionId, level, fallbackRng);
        if (!selected.some((q) => q.id === question.id)) selected.push(question);
      }
    }
    if (selected.length !== SESSION_LENGTH)
      throw new Error('Pas assez de questions pour cette activité.');
    return selected.map((q) => prepareQuestion(q, rng));
  }
  function recommendation(level, independent, total = SESSION_LENGTH) {
    if (independent / total >= 0.8) return Math.min(3, level + 1);
    if (independent / total <= 0.2) return Math.max(1, level - 1);
    return level;
  }
  function emptyProgress() {
    return { version: 1, settings: { ...defaults }, history: [] };
  }
  function boundedInteger(value, min, max, fallback) {
    return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
  }
  function sanitise(raw) {
    const clean = emptyProgress();
    if (!raw || raw.version !== 1 || typeof raw !== 'object') return clean;
    if (raw.settings && typeof raw.settings === 'object') {
      clean.settings.sound =
        typeof raw.settings.sound === 'boolean' ? raw.settings.sound : defaults.sound;
      clean.settings.effects =
        typeof raw.settings.effects === 'boolean' ? raw.settings.effects : defaults.effects;
      clean.settings.rate = [0.8, 0.9, 1].includes(raw.settings.rate)
        ? raw.settings.rate
        : defaults.rate;
      clean.settings.voice =
        typeof raw.settings.voice === 'string' ? raw.settings.voice.slice(0, 300) : '';
    }
    if (Array.isArray(raw.history)) {
      const seen = new Set();
      clean.history = raw.history
        .filter((entry) => {
          if (
            !entry ||
            typeof entry !== 'object' ||
            !missionIds.has(entry.missionId) ||
            typeof entry.id !== 'string' ||
            seen.has(entry.id)
          )
            return false;
          if (
            ![1, 2, 3].includes(entry.level) ||
            !Number.isFinite(entry.date) ||
            entry.date < 0 ||
            entry.date > 8640000000000000
          )
            return false;
          seen.add(entry.id);
          return true;
        })
        .slice(-200)
        .map((entry) => ({
          id: entry.id.slice(0, 100),
          missionId: entry.missionId,
          level: entry.level,
          date: entry.date,
          independent: boundedInteger(entry.independent, 0, SESSION_LENGTH, 0),
          hints: boundedInteger(entry.hints, 0, SESSION_LENGTH, 0),
          revealed: boundedInteger(entry.revealed, 0, SESSION_LENGTH, 0),
          questionIds: Array.isArray(entry.questionIds)
            ? entry.questionIds
                .filter((id) => typeof id === 'string')
                .map((id) => id.slice(0, 250))
                .slice(0, SESSION_LENGTH)
            : []
        }));
    }
    return clean;
  }
  function loadProgress(storage) {
    try {
      if (!storage) throw new Error('Stockage indisponible');
      const value = storage.getItem(STORAGE_KEY);
      return { data: value ? sanitise(JSON.parse(value)) : emptyProgress(), available: true };
    } catch (error) {
      // Malformed JSON can be replaced on the next save. Blocked storage cannot.
      return { data: emptyProgress(), available: error instanceof SyntaxError };
    }
  }
  function saveProgress(storage, data) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(sanitise(data)));
      return true;
    } catch (_) {
      return false;
    }
  }
  function recordSession(data, result) {
    if (data.history.some((entry) => entry.id === result.id)) return data;
    return sanitise({ ...data, history: [...data.history, result] });
  }
  function missionProgress(data, missionId) {
    const sessions = data.history.filter((entry) => entry.missionId === missionId);
    const last = sessions[sessions.length - 1];
    const mission = content.missions.find((item) => item.id === missionId);
    return {
      sessions: sessions.length,
      last,
      suggested: last ? recommendation(last.level, last.independent) : mission.defaultLevel,
      best: sessions.length ? Math.max(...sessions.map((item) => item.independent)) : 0
    };
  }
  function stats(data) {
    const explored = new Set(data.history.map((entry) => entry.missionId));
    return {
      stars: data.history.length,
      explored: explored.size,
      questions: data.history.length * SESSION_LENGTH
    };
  }
  function dailyMission(date = new Date()) {
    // Use the user's local calendar date, without an UTC midnight crossover.
    const day = Math.floor(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
    );
    return content.missions[
      ((day % content.missions.length) + content.missions.length) % content.missions.length
    ];
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(
      /[&<>"']/g,
      (character) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]
    );
  }

  return {
    SESSION_LENGTH,
    STORAGE_KEY,
    defaults,
    shuffle,
    normalise,
    withoutAccents,
    checkAnswer,
    buildQuestions,
    recommendation,
    emptyProgress,
    sanitise,
    loadProgress,
    saveProgress,
    recordSession,
    missionProgress,
    stats,
    dailyMission,
    escapeHtml
  };
});
