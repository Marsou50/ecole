const { test } = require('node:test');
const assert = require('node:assert/strict');
const A = require('../assets/js/audio.js');

function mockedEnvironment(voices) {
  const spoken = [];
  let cancelled = 0;
  const environment = {
    SpeechSynthesisUtterance: class {
      constructor(text) {
        this.text = text;
      }
    },
    speechSynthesis: {
      getVoices: () => voices,
      addEventListener() {},
      removeEventListener() {},
      cancel() {
        cancelled++;
      },
      speak(message) {
        spoken.push(message);
        if (message.onstart) message.onstart();
      }
    }
  };
  return {
    environment,
    spoken,
    get cancelled() {
      return cancelled;
    }
  };
}
const settings = { sound: true, effects: true, rate: 0.9, voice: '' };
const voices = [
  { name: 'English', lang: 'en-US', voiceURI: 'en', localService: true },
  { name: 'Français distant', lang: 'fr-FR', voiceURI: 'remote', localService: false },
  { name: 'Français local', lang: 'fr-FR', voiceURI: 'local', localService: true }
];

test('seules les voix françaises sont proposées, avec les voix locales en premier', () => {
  assert.deepEqual(
    A.frenchVoices(voices).map((voice) => voice.voiceURI),
    ['local', 'remote']
  );
});

test('aucune lecture automatique ; voix choisie et débit appliqués', () => {
  const mock = mockedEnvironment(voices);
  const controller = A.createAudio(
    { ...settings, voice: 'remote', rate: 0.8 },
    { environment: mock.environment }
  );
  assert.equal(mock.spoken.length, 0);
  assert.ok(controller.speak('Bonjour !'));
  assert.equal(mock.spoken[0].text, 'Bonjour !');
  assert.equal(mock.spoken[0].voice.voiceURI, 'remote');
  assert.equal(mock.spoken[0].lang, 'fr-FR');
  assert.equal(mock.spoken[0].rate, 0.8);
  assert.ok(controller.state().speaking);
  mock.spoken[0].onend();
  assert.equal(controller.state().speaking, false);
  controller.dispose();
});

test('couper le son arrête la lecture et empêche toute nouvelle voix', () => {
  const mock = mockedEnvironment(voices);
  const errors = [];
  const controller = A.createAudio(settings, {
    environment: mock.environment,
    onError: (error) => errors.push(error)
  });
  controller.speak('Une histoire.');
  controller.configure({ sound: false });
  assert.equal(controller.state().speaking, false);
  assert.equal(controller.speak('Une autre histoire.'), false);
  assert.equal(mock.spoken.length, 1);
  assert.match(errors[0], /coupé/);
  assert.ok(mock.cancelled >= 2);
  controller.dispose();
});

test('un ancien événement ne doit pas interrompre une nouvelle lecture', () => {
  const mock = mockedEnvironment(voices);
  const controller = A.createAudio(settings, { environment: mock.environment });
  controller.speak('Première.');
  controller.speak('Deuxième.');
  mock.spoken[0].onend();
  assert.equal(controller.state().speaking, true);
  mock.spoken[1].onend();
  assert.equal(controller.state().speaking, false);
  controller.dispose();
});

test('l’absence de synthèse ou de voix française est expliquée sans erreur', () => {
  const errors = [];
  const missing = A.createAudio(settings, {
    environment: {},
    onError: (message) => errors.push(message)
  });
  assert.equal(missing.speak('Bonjour.'), false);
  assert.match(errors[0], /pas disponible/);
  missing.dispose();
  const mock = mockedEnvironment([voices[0]]);
  const controller = A.createAudio(settings, {
    environment: mock.environment,
    onError: (message) => errors.push(message)
  });
  assert.equal(controller.speak('Bonjour.'), false);
  assert.equal(mock.spoken.length, 0);
  assert.match(errors.at(-1), /Aucune voix française/);
  controller.dispose();
});
