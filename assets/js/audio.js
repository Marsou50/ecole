(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CurieuxAudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function frenchVoices(voices) {
    return voices
      .filter((voice) => /^fr(?:[-_]|$)/i.test(voice.lang))
      .sort(
        (a, b) =>
          Number(Boolean(b.localService)) - Number(Boolean(a.localService)) ||
          a.name.localeCompare(b.name, 'fr')
      );
  }
  function createAudio(
    settings,
    { environment = globalThis, onChange = () => {}, onError = () => {} } = {}
  ) {
    const synth = environment.speechSynthesis;
    const supported = Boolean(synth && environment.SpeechSynthesisUtterance);
    let voices = [],
      speaking = false,
      utterance = null,
      watchdog = null,
      context = null,
      generation = 0;
    let options = { ...settings };
    const state = () => ({ supported, voices: [...voices], speaking });
    const notify = () => onChange(state());
    function refreshVoices() {
      try {
        voices = supported ? frenchVoices(synth.getVoices()) : [];
      } catch (_) {
        voices = [];
      }
      notify();
    }
    function cancel() {
      generation++;
      clearTimeout(watchdog);
      watchdog = null;
      if (supported) {
        try {
          synth.cancel();
        } catch (_) {
          /* No active engine. */
        }
      }
      utterance = null;
      speaking = false;
      notify();
    }
    function fail(message) {
      onError(message);
      return false;
    }
    function speak(text) {
      cancel();
      if (!options.sound)
        return fail('Le son est coupé. Active-le avec le bouton en haut de la page pour écouter.');
      if (!supported)
        return fail(
          'La lecture vocale n’est pas disponible dans ce navigateur. Un adulte peut lire les consignes et utiliser l’aide des dictées.'
        );
      refreshVoices();
      let allVoices = [];
      try {
        allVoices = synth.getVoices();
      } catch (_) {
        /* A browser may load its voices later. */
      }
      if (allVoices.length && !voices.length)
        return fail(
          'Aucune voix française n’est disponible sur cet appareil. Ajoute une voix française dans les réglages de l’appareil, ou utilise l’aide d’un adulte.'
        );
      const currentGeneration = generation;
      const message = new environment.SpeechSynthesisUtterance(String(text));
      message.lang = 'fr-FR';
      const chosen =
        voices.find((voice) => voice.voiceURI === options.voice) ||
        voices.find((voice) => /^fr[-_]FR$/i.test(voice.lang)) ||
        voices[0];
      if (chosen) message.voice = chosen;
      message.rate = options.rate;
      message.pitch = 1;
      message.volume = 1;
      utterance = message; // Retain a reference until playback ends (needed in some browsers).
      const done = () => {
        if (currentGeneration !== generation) return;
        clearTimeout(watchdog);
        speaking = false;
        utterance = null;
        notify();
      };
      message.onstart = () => {
        if (currentGeneration !== generation) return;
        clearTimeout(watchdog);
        speaking = true;
        notify();
      };
      message.onend = done;
      message.onerror = (event) => {
        if (currentGeneration !== generation) return;
        done();
        if (!['interrupted', 'canceled'].includes(event.error))
          fail(
            'La voix n’a pas pu démarrer. Réessaie, vérifie les voix françaises dans l’espace parent, ou demande à un adulte de lire.'
          );
      };
      speaking = true;
      notify();
      try {
        watchdog = setTimeout(() => {
          if (utterance !== message || currentGeneration !== generation) return;
          cancel();
          fail(
            'La voix ne répond pas sur cet appareil. Tu peux réessayer ou utiliser l’aide d’un adulte.'
          );
        }, 8000);
        synth.speak(message);
      } catch (_) {
        done();
        return fail(
          'La lecture vocale est indisponible. Toutes les consignes restent affichées à l’écran.'
        );
      }
      return true;
    }
    function effect(kind = 'success') {
      if (!options.sound || !options.effects) return;
      try {
        const AudioContext = environment.AudioContext || environment.webkitAudioContext;
        if (!AudioContext) return;
        if (!context) context = new AudioContext();
        const play = () => {
          if (!options.sound || !options.effects) return;
          const notes = kind === 'complete' ? [523.25, 659.25, 783.99] : [587.33, 783.99];
          notes.forEach((frequency, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const start = context.currentTime + index * 0.13;
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.045, start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(start);
            oscillator.stop(start + 0.24);
            oscillator.onended = () => {
              oscillator.disconnect();
              gain.disconnect();
            };
          });
        };
        if (context.state === 'suspended')
          context
            .resume()
            .then(play)
            .catch(() => {});
        else play();
      } catch (_) {
        /* Sound effects are optional and never block an exercise. */
      }
    }
    function configure(next) {
      options = { ...options, ...next };
      if (!options.sound) {
        cancel();
        if (context && context.state === 'running') context.suspend().catch(() => {});
      }
      notify();
    }
    if (supported && typeof synth.addEventListener === 'function')
      synth.addEventListener('voiceschanged', refreshVoices);
    refreshVoices();
    return {
      speak,
      cancel,
      effect,
      configure,
      state,
      refreshVoices,
      dispose() {
        cancel();
        if (supported && typeof synth.removeEventListener === 'function')
          synth.removeEventListener('voiceschanged', refreshVoices);
        if (context) context.close().catch(() => {});
      }
    };
  }
  return { frenchVoices, createAudio };
});
