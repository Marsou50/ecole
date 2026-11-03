const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const Q = require('../../assets/js/questions.js');
const E = require('../../assets/js/engine.js');

function seeded(seed = 83) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const pageErrors = new WeakMap();
test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__resetRandom = (seed = 83) => {
      Math.random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
    };
    window.__resetRandom();
  });
});
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

async function mockVoice(page, available = true) {
  await page.addInitScript((available) => {
    window.__spoken = [];
    window.__cancelCount = 0;
    const voices = [
      { name: 'Voix française locale', lang: 'fr-FR', voiceURI: 'fr-local', localService: true },
      { name: 'Autre voix française', lang: 'fr-FR', voiceURI: 'fr-other', localService: true }
    ];
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: available
        ? class {
            constructor(text) {
              this.text = text;
            }
          }
        : undefined
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: available
        ? {
            getVoices: () => voices,
            addEventListener() {},
            removeEventListener() {},
            cancel() {
              window.__cancelCount++;
            },
            speak(message) {
              window.__spoken.push({
                text: message.text,
                lang: message.lang,
                rate: message.rate,
                voice: message.voice && message.voice.voiceURI
              });
              if (message.onstart) message.onstart();
              setTimeout(() => {
                if (message.onend) message.onend();
              }, 100);
            }
          }
        : undefined
    });
  }, available);
}
async function begin(page, missionId, level, seed = 83) {
  await page.goto(`/#/activite/${missionId}`);
  // A hash-only navigation intentionally preserves a draft session. Reload for an isolated scenario.
  await page.reload();
  await page.locator(`[data-mission="${missionId}"][data-level="${level}"]`).click();
  await page.evaluate((seed) => window.__resetRandom(seed), seed);
  await page.locator('[data-action="start"]').click();
  const series = E.buildQuestions(missionId, level, { rng: seeded(seed) });
  await expect(page.locator('#question-title')).toHaveText(series[0].prompt);
  return series;
}
async function answer(page, question) {
  if (question.type === 'choice')
    await page.locator('.choice-option').nth(question.options.indexOf(question.answer)).click();
  else if (question.type === 'order') {
    for (let id = 0; id < question.tokens.length; id++)
      await page.locator(`[data-action="add-tile"][data-tile="${id}"]`).click();
  } else await page.locator('#answer-input').fill(question.answer);
  await page.locator('#check-answer').click();
  await expect(page.locator('.feedback-success')).toContainText('Bien trouvé');
}
async function complete(page, series) {
  for (const question of series) {
    await expect(page.locator('#question-title')).toHaveText(question.prompt);
    await answer(page, question);
    await page.locator('#check-answer').click();
  }
  await expect(page.getByRole('heading', { name: 'Une découverte de plus !' })).toBeVisible();
}
async function a11y(page) {
  const report = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    report.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary }))
    }))
  ).toEqual([]);
}

test('accueil, navigation, illustrations locales et six aventures par univers', async ({
  page
}) => {
  const external = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173/') && !request.url().startsWith('data:'))
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /À toi les grandes/ })).toBeVisible();
  await expect(page.locator('.hero-illustration')).toBeVisible();
  await page.getByRole('link', { name: /Explorer les maths/ }).click();
  await expect(page.locator('.mission-card')).toHaveCount(6);
  await page.getByRole('link', { name: 'Mon espace', exact: true }).first().click();
  await page.getByRole('link', { name: /Explorer le français/ }).click();
  await expect(page.locator('.mission-card')).toHaveCount(6);
  expect(external).toEqual([]);
});

for (const mission of Q.missions) {
  test(`${mission.title} : les trois niveaux sont accessibles et corrigent une réponse juste`, async ({
    page
  }) => {
    for (const level of [1, 2, 3]) {
      const series = await begin(page, mission.id, level, level * 83);
      await answer(page, series[0]);
      await page.locator('#check-answer').click();
      await expect(page.locator('.question-counter')).toContainText('Question 2');
    }
  });
}

test('une séance complète est enregistrée une seule fois et reste après actualisation', async ({
  page
}) => {
  const series = await begin(page, 'm-calcul', 1);
  await complete(page, series);
  await expect(page.getByRole('button', { name: 'Essayer le niveau suivant' })).toBeVisible();
  let data = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), E.STORAGE_KEY);
  expect(data.history).toHaveLength(1);
  expect(data.history[0].independent).toBe(5);
  expect(data.history[0].questionIds).toHaveLength(5);
  expect(data.history[0]).not.toHaveProperty('answers');
  await page.getByRole('link', { name: 'Mon carnet', exact: true }).click();
  await page.reload();
  await expect(page.locator('.stat-card').nth(0)).toContainText('1');
  await expect(page.locator('.stat-card').nth(1)).toContainText('1 / 12');
  await expect(page.locator('.stat-card').nth(2)).toContainText('5');
  await page.getByRole('link', { name: 'Espace parent', exact: true }).click();
  await page.getByRole('button', { name: 'Effacer le carnet', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Annuler', exact: true }).click();
  data = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), E.STORAGE_KEY);
  expect(data.history).toHaveLength(1);
  await page.getByRole('button', { name: /couper le son/i }).click();
  await page.getByRole('button', { name: 'Effacer le carnet', exact: true }).click();
  await page.getByRole('button', { name: 'Oui, effacer le carnet', exact: true }).click();
  data = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), E.STORAGE_KEY);
  expect(data.history).toHaveLength(0);
  expect(data.settings.sound).toBe(false);
});

test('une erreur ne fait pas avancer ; indices et explication restent disponibles', async ({
  page
}) => {
  const series = await begin(page, 'm-calcul', 1);
  await expect(page.locator('#check-answer')).toBeDisabled();
  await page.locator('#answer-input').fill('999');
  await page.locator('#check-answer').click();
  await expect(page.locator('.feedback-retry')).toContainText('Pas tout à fait');
  await expect(page.locator('.question-counter')).toContainText('Question 1');
  await page.getByRole('button', { name: 'Un petit indice', exact: true }).click();
  await expect(page.locator('.hint-box')).toContainText(series[0].hint);
  await page.locator('#check-answer').click();
  await page.getByRole('button', { name: 'Comprendre la réponse', exact: true }).click();
  await expect(page.locator('.feedback-success')).toContainText('Regardons ensemble');
  await expect(page.locator('.feedback-success')).toContainText(series[0].explanation);
  await page.locator('#check-answer').click();
  await complete(page, series.slice(1));
  const data = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), E.STORAGE_KEY);
  expect(data.history[0].independent).toBe(4);
  expect(data.history[0].hints).toBe(1);
  expect(data.history[0].revealed).toBe(1);
});

test('les mots se déplacent au clavier et peuvent être retirés ou remis à zéro', async ({
  page
}) => {
  const [question] = await begin(page, 'f-phrases', 2);
  const first = page.locator('[data-action="add-tile"][data-tile="0"]');
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.sentence-tray')).toContainText(question.tokens[0]);
  await page.locator('[data-action="remove-tile"]').click();
  await expect(page.locator('.sentence-tray')).toContainText('Ta phrase se construit ici');
  await first.click();
  await page.locator('[data-action="reset-tiles"]').click();
  await expect(page.locator('.word-bank button:disabled')).toHaveCount(0);
  await answer(page, question);
});

test('dictée : aucune lecture automatique, mot caché et voix à la demande', async ({ page }) => {
  await mockVoice(page);
  const series = await begin(page, 'f-dictee', 1, 130);
  const question = series[0];
  expect(await page.evaluate(() => window.__spoken)).toEqual([]);
  await expect(page.locator('.adult-word')).toHaveCount(0);
  expect((await page.locator('main').innerText()).toLowerCase()).not.toContain(question.answer);
  await page.getByRole('button', { name: 'Écouter le mot', exact: true }).click();
  const spoken = await page.evaluate(() => window.__spoken);
  expect(spoken[0].text).toContain(question.answer);
  expect(spoken[0].lang).toBe('fr-FR');
  await page.getByRole('button', { name: /couper le son/i }).click();
  await page.getByRole('button', { name: 'Écouter le mot', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('Le son est coupé');
  expect((await page.evaluate(() => window.__spoken)).length).toBe(1);
  await page.getByRole('button', { name: /activer le son/i }).click();
  await answer(page, question);
});

test('la dictée accepte une lecture par un adulte si la synthèse vocale est absente', async ({
  page
}) => {
  await mockVoice(page, false);
  const [question] = await begin(page, 'f-dictee', 2);
  await page.getByRole('button', { name: 'Écouter le mot', exact: true }).click();
  await expect(page.locator('#toast')).toContainText('pas disponible');
  await page.locator('.adult-help summary').click();
  await page.getByRole('button', { name: 'Afficher le mot à dicter', exact: true }).click();
  await expect(page.locator('.adult-word')).toContainText(question.answer);
  await page.getByRole('button', { name: 'Masquer le mot', exact: true }).click();
  await expect(page.locator('.adult-word')).toHaveCount(0);
  await answer(page, question);
});

test('les réglages de voix, débit et sons sont appliqués et conservés', async ({ page }) => {
  await mockVoice(page);
  await page.goto('/#/parents');
  await page.locator('#voice-select').selectOption('fr-other');
  await page
    .locator('label')
    .filter({ has: page.locator('[name="speech-rate"][value="0.8"]') })
    .click();
  await page.locator('label[for="setting-effects"]').click();
  await page.getByRole('button', { name: 'Essayer la voix', exact: true }).click();
  const spoken = await page.evaluate(() => window.__spoken);
  expect(spoken.at(-1).rate).toBe(0.8);
  expect(spoken.at(-1).voice).toBe('fr-other');
  await page.reload();
  await expect(page.locator('#voice-select')).toHaveValue('fr-other');
  await expect(page.locator('[name="speech-rate"][value="0.8"]')).toBeChecked();
  await expect(page.locator('#setting-effects')).not.toBeChecked();
});

test('on peut quitter une vue, reprendre une séance et confirmer son remplacement', async ({
  page
}) => {
  await begin(page, 'm-calcul', 2);
  await page.locator('#answer-input').fill('23');
  await page.getByRole('link', { name: 'Mon espace', exact: true }).click();
  await page.getByRole('link', { name: 'Reprendre mon aventure', exact: false }).click();
  await expect(page.locator('#answer-input')).toHaveValue('23');
  await page.getByRole('link', { name: /Les aventures de maths/ }).click();
  await page.locator('[data-mission="m-logique"]').click();
  await page.getByRole('button', { name: 'C’est parti !', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Annuler', exact: true }).click();
  await page.getByRole('button', { name: 'C’est parti !', exact: true }).click();
  await page.getByRole('button', { name: 'Commencer le nouveau défi', exact: true }).click();
  await expect(page).toHaveURL(/jouer\/m-logique/);
  await page.reload();
  await expect(page).toHaveURL(/activite\/m-logique/);
  await expect(page.getByRole('button', { name: 'C’est parti !', exact: true })).toBeVisible();
});

test('le site fonctionne et termine une séance même avec un stockage bloqué', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('Blocked', 'SecurityError');
    };
    Storage.prototype.setItem = () => {
      throw new DOMException('Blocked', 'SecurityError');
    };
  });
  const series = await begin(page, 'm-calcul', 1);
  await expect(page.locator('.storage-notice')).toBeVisible();
  await complete(page, series);
  await page.getByRole('link', { name: 'Mon carnet', exact: true }).click();
  await expect(page.locator('.stat-card').first()).toContainText('1');
});

test('les anciens fichiers et les fichiers privés ne sont pas servis', async ({
  request,
  page
}) => {
  for (const pathname of [
    '/index',
    '/exercices/CP/francais/lecture-ecriture/index.html',
    '/.git/config',
    '/package.json',
    '/node_modules/@playwright/test/package.json'
  ]) {
    expect((await request.get(pathname)).status()).toBe(404);
  }
  await page.goto('/#/une-aventure-inconnue');
  await expect(page.getByRole('heading', { name: 'On prend un autre chemin ?' })).toBeVisible();
});

test('accessibilité des pages, des questions et du dialogue de confirmation', async ({ page }) => {
  test.setTimeout(90000);
  await mockVoice(page);
  for (const route of [
    '/',
    '/#/maths',
    '/#/francais',
    '/#/carnet',
    '/#/parents',
    '/#/activite/f-dictee'
  ]) {
    await page.goto(route);
    await a11y(page);
  }
  for (const id of ['m-calcul', 'm-dizaines', 'f-mots', 'f-phrases', 'f-dictee', 'f-histoires']) {
    await begin(page, id, 1);
    await a11y(page);
  }
  const finishedSeries = await begin(page, 'm-calcul', 1);
  await complete(page, finishedSeries);
  await a11y(page);
  await page.getByRole('link', { name: 'Mon carnet', exact: true }).click();
  await a11y(page);
  await page.goto('/#/parents');
  await page.getByRole('button', { name: 'Effacer le carnet', exact: true }).click();
  await a11y(page);
});

test('mobile : pas de débordement, toutes les réponses et commandes restent utilisables', async ({
  page
}) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  fs.mkdirSync(path.resolve('.artifacts'), { recursive: true });
  await page.screenshot({ path: '.artifacts/home-mobile.png', fullPage: true });
  for (const missionId of ['m-logique', 'm-dizaines', 'f-phrases', 'f-dictee', 'f-histoires']) {
    const [question] = await begin(page, missionId, 3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    await answer(page, question);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  }
  await page.goto('/#/parents');
  await a11y(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await begin(page, 'm-logique', 3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.artifacts/exercise-mobile.png', fullPage: true });
});

test('dictée : un accent manquant est expliqué et le clavier d’accents permet de le corriger', async ({
  page
}) => {
  const seed = Array.from({ length: 500 }, (_, index) => index + 1).find(
    (value) => E.buildQuestions('f-dictee', 1, { rng: seeded(value) })[0].answer === 'vélo'
  );
  expect(seed).toBeTruthy();
  const [question] = await begin(page, 'f-dictee', 1, seed);
  await page.locator('#answer-input').fill('velo');
  await page.locator('#check-answer').click();
  await expect(page.locator('.feedback-retry')).toContainText('Vérifie les accents');
  await expect(page.locator('.question-counter')).toContainText('Question 1');
  await page.locator('#answer-input').fill('vlo');
  await page.locator('#answer-input').evaluate((input) => input.setSelectionRange(1, 1));
  await page.getByRole('button', { name: 'Insérer é', exact: true }).click();
  await expect(page.locator('#answer-input')).toHaveValue(question.answer);
  await page.locator('#check-answer').click();
  await expect(page.locator('.feedback-success')).toContainText('Bien trouvé');
});

test('des données locales invalides sont ignorées sans casser le carnet', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.setItem(key, '{invalid'), E.STORAGE_KEY);
  await page.reload();
  await page.getByRole('link', { name: 'Mon carnet', exact: true }).click();
  await expect(page.locator('.empty-notebook')).toBeVisible();
  await page.evaluate(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          settings: {},
          history: [{ id: 'invalid', missionId: 'm-calcul', level: 1, date: 1e99 }]
        })
      ),
    E.STORAGE_KEY
  );
  await page.reload();
  await expect(page.locator('.empty-notebook')).toBeVisible();
});
