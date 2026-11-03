const { test } = require('node:test');
const assert = require('node:assert/strict');
const Q = require('../assets/js/questions.js');
const E = require('../assets/js/engine.js');

function seeded(seed = 42) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
function storageWith(value) {
  const values = new Map(value ? [[E.STORAGE_KEY, value]] : []);
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, item) => values.set(key, item)
  };
}
function expectedFromMeta(meta) {
  switch (meta.kind) {
    case 'max':
      return Math.max(...meta.values);
    case 'order':
      return [...meta.values].sort((a, b) => a - b).join(' ');
    case 'after':
      return meta.n + 1;
    case 'before':
      return meta.n - 1;
    case 'between':
      return meta.n;
    case 'tens':
      return 100 * meta.hundreds + 10 * meta.tens + meta.ones;
    case 'ones-digit':
      return meta.n % 10;
    case 'tens-digit':
      return Math.floor(meta.n / 10);
    case 'add':
    case 'missing-minuend':
      return meta.a + meta.b;
    case 'subtract':
      return meta.a - meta.b;
    case 'missing-addend':
      return meta.b;
    case 'add-subtract':
      return meta.a + meta.b - meta.c;
    case 'groups-add':
      return meta.groups * meta.each + meta.extra;
    case 'groups-subtract':
      return meta.groups * meta.each - meta.extra;
    case 'sequence':
      return meta.values.at(-1);
    default:
      throw new Error(`Unknown meta: ${meta.kind}`);
  }
}

test('12 activités, chacune avec trois niveaux complets, sans choix ambigu dupliqué', () => {
  assert.equal(Q.missions.length, 12);
  assert.equal(Q.missions.filter((item) => item.subject === 'maths').length, 6);
  assert.equal(Q.missions.filter((item) => item.subject === 'francais').length, 6);
  const allIds = new Set();
  for (const mission of Q.missions) {
    assert.ok([1, 2, 3].includes(mission.defaultLevel));
    assert.equal(mission.details.length, 3);
    for (const level of [1, 2, 3]) {
      const bank = Q.banks[`${mission.id}:${level}`];
      if (bank) {
        assert.ok(bank.length >= E.SESSION_LENGTH);
        for (const question of bank) {
          assert.ok(!allIds.has(question.id), question.id);
          allIds.add(question.id);
          assert.ok(question.hint && question.explanation && question.prompt, question.id);
          assert.equal(E.checkAnswer(question, question.answer).correct, true, question.id);
          if (question.type === 'choice') {
            assert.equal(
              new Set(question.options.map(E.normalise)).size,
              question.options.length,
              question.id
            );
            assert.equal(
              question.options.filter((answer) => E.checkAnswer(question, answer).correct).length,
              1,
              question.id
            );
          }
          if (question.type === 'order') assert.equal(question.tokens.join(' '), question.answer);
          if (question.type === 'dictation') {
            assert.ok(question.speech.includes(question.answer));
            assert.ok(!E.normalise(question.prompt).includes(question.answer));
          }
        }
      }
      const series = E.buildQuestions(mission.id, level, { rng: seeded(level * 123) });
      assert.equal(series.length, 5);
      assert.equal(new Set(series.map((q) => q.id)).size, 5);
      for (const q of series) {
        assert.equal(E.checkAnswer(q, q.answer).correct, true);
        if (q.tiles)
          assert.notDeepEqual(
            q.tiles.map((tile) => tile.id),
            q.tokens.map((_, index) => index)
          );
      }
    }
  }
  assert.ok(allIds.size >= 150);
});

test('les générateurs de maths produisent des solutions exactes et non négatives', () => {
  for (const mission of Q.missions.filter((m) => m.subject === 'maths' && m.id !== 'm-formes')) {
    for (const level of [1, 2, 3]) {
      const random = seeded(level * 985 + 91);
      for (let i = 0; i < 500; i++) {
        const question = Q.generate(mission.id, level, random);
        assert.equal(question.answer, String(expectedFromMeta(question.meta)), question.id);
        assert.equal(E.checkAnswer(question, question.answer).correct, true, question.id);
        if (question.type === 'number') assert.ok(Number(question.answer) >= 0, question.id);
        if (mission.id === 'm-calcul')
          assert.ok(Number(question.answer) <= [20, 70, 100][level - 1], question.id);
        if (question.options) assert.equal(new Set(question.options).size, question.options.length);
      }
    }
  }
});

test('sélection : cinq questions uniques, déterministes et renouvelées en priorité', () => {
  const first = E.buildQuestions('f-mots', 1, { rng: seeded(17) });
  assert.deepEqual(first, E.buildQuestions('f-mots', 1, { rng: seeded(17) }));
  const seen = first.map((q) => q.id);
  const next = E.buildQuestions('f-mots', 1, { rng: seeded(18), avoidIds: seen });
  assert.equal(next.filter((q) => !seen.includes(q.id)).length, 3);
  assert.notDeepEqual(
    first.map((q) => q.id),
    next.map((q) => q.id)
  );
  for (const mission of Q.missions.filter((m) => m.subject === 'maths' && m.id !== 'm-formes')) {
    assert.equal(
      new Set(E.buildQuestions(mission.id, 2, { rng: () => 0 }).map((q) => q.id)).size,
      5
    );
  }
  assert.throws(() => E.buildQuestions('inconnue', 1));
  assert.throws(() => E.buildQuestions('m-calcul', 4));
});

test('correction : espaces et casse acceptés, accents enseignés, nombres stricts', () => {
  const word = { type: 'dictation', answer: 'vélo' };
  assert.ok(E.checkAnswer(word, '  VÉLO ').correct);
  assert.ok(E.checkAnswer(word, 've\u0301lo').correct);
  assert.ok(E.checkAnswer(word, 'velo').accentOnly);
  assert.equal(E.checkAnswer(word, 'velo').correct, false);
  assert.equal(E.checkAnswer(word, '').empty, true);
  assert.ok(E.checkAnswer({ type: 'number', answer: '20' }, '020').correct);
  assert.ok(E.checkAnswer({ type: 'number', answer: '100' }, '1 00').correct);
  for (const value of ['2e1', '0x14', '20 pommes', '20.0', 'vingt'])
    assert.equal(E.checkAnswer({ type: 'number', answer: '20' }, value).correct, false);
  assert.ok(
    E.checkAnswer({ type: 'order', answer: 'L’oiseau chante.' }, ["L'oiseau", 'chante.']).correct
  );
  assert.equal(
    E.checkAnswer({ type: 'order', answer: 'Le chat dort.' }, ['Le', 'dort.', 'chat']).correct,
    false
  );
});

test('compteur : une question terminée compte avant le passage à la suivante', () => {
  for (const total of [1, 3, E.SESSION_LENGTH]) {
    for (let index = 0; index < total; index++) {
      assert.deepEqual(E.questionProgress(index, total, false), {
        total,
        completed: index,
        remaining: total - index
      });
      const finished = E.questionProgress(index, total, true);
      assert.deepEqual(finished, {
        total,
        completed: index + 1,
        remaining: total - index - 1
      });
      // Rendering again or moving to the next question must not count twice.
      assert.deepEqual(E.questionProgress(index, total, true), finished);
      assert.deepEqual(E.questionProgress(index + 1, total, false), finished);
    }
  }
});

test('compteur : la progression reste bornée entre zéro et le nombre de questions', () => {
  assert.deepEqual(E.questionProgress(0, 0), { total: 0, completed: 0, remaining: 0 });
  assert.deepEqual(E.questionProgress(-1, 5), { total: 5, completed: 0, remaining: 5 });
  assert.deepEqual(E.questionProgress(5, 5, true), { total: 5, completed: 5, remaining: 0 });
});

test('recommandations bornées, aucune difficulté verrouillée', () => {
  assert.equal(E.recommendation(1, 5), 2);
  assert.equal(E.recommendation(2, 4), 3);
  assert.equal(E.recommendation(3, 5), 3);
  assert.equal(E.recommendation(2, 3), 2);
  assert.equal(E.recommendation(2, 0), 1);
  assert.equal(E.recommendation(1, 0), 1);
});

test('progression locale : validation, doublons, statistiques et limitation de taille', () => {
  let data = E.emptyProgress();
  const result = {
    id: 'session-1',
    missionId: 'm-calcul',
    level: 1,
    date: 1000,
    independent: 5,
    hints: 0,
    revealed: 0,
    questionIds: ['a', 'b', 'c', 'd', 'e']
  };
  const before = JSON.stringify(data);
  data = E.recordSession(data, result);
  assert.equal(JSON.stringify(E.emptyProgress()), before);
  data = E.recordSession(data, result);
  assert.equal(data.history.length, 1);
  assert.deepEqual(E.stats(data), { stars: 1, explored: 1, questions: 5 });
  assert.equal(E.missionProgress(data, 'm-calcul').suggested, 2);
  assert.equal(E.missionProgress(data, 'f-mots').suggested, 1);
  for (let i = 2; i <= 220; i++)
    data = E.recordSession(data, { ...result, id: `session-${i}`, date: 1000 + i });
  assert.equal(data.history.length, 200);
  assert.equal(data.history[0].id, 'session-21');
  const clean = E.sanitise({
    version: 1,
    settings: { sound: 'yes', effects: false, rate: 9, voice: 'a'.repeat(500) },
    history: [
      { ...result, independent: -10 },
      result,
      { ...result, id: 'bad-level', level: 5 },
      { ...result, id: 'bad-date', date: 1e99 },
      { ...result, id: 'bad-mission', missionId: '<script>' }
    ]
  });
  assert.equal(clean.history.length, 1);
  assert.equal(clean.history[0].independent, 0);
  assert.equal(clean.settings.sound, true);
  assert.equal(clean.settings.effects, false);
  assert.equal(clean.settings.rate, 0.9);
  assert.equal(clean.settings.voice.length, 300);
});

test('stockage absent, corrompu ou plein : les exercices peuvent continuer', () => {
  const storage = storageWith();
  assert.ok(E.loadProgress(storage).available);
  const data = E.emptyProgress();
  data.settings.sound = false;
  assert.ok(E.saveProgress(storage, data));
  assert.equal(E.loadProgress(storage).data.settings.sound, false);
  assert.deepEqual(E.loadProgress(storageWith('pas du JSON')).data, E.emptyProgress());
  assert.deepEqual(E.loadProgress(storageWith('{"version":99}')).data, E.emptyProgress());
  const blocked = {
    getItem() {
      throw new Error('SecurityError');
    },
    setItem() {
      throw new Error('QuotaExceededError');
    }
  };
  assert.equal(E.loadProgress(blocked).available, false);
  assert.equal(E.saveProgress(blocked, data), false);
  assert.equal(E.loadProgress(null).available, false);
});

test('le défi du jour reste stable pendant la journée locale', () => {
  assert.equal(
    E.dailyMission(new Date(2026, 10, 2, 1)).id,
    E.dailyMission(new Date(2026, 10, 2, 23)).id
  );
  assert.notEqual(
    E.dailyMission(new Date(2026, 10, 2)).id,
    E.dailyMission(new Date(2026, 10, 3)).id
  );
});

test('le contenu injecté dans les vues est échappé', () => {
  assert.equal(
    E.escapeHtml('<img src="x" onerror=\'alert(1)\'> &'),
    '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp;'
  );
});
