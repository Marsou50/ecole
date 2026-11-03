(function () {
  'use strict';
  const Q = window.CurieuxQuestions;
  const E = window.CurieuxEngine;
  // Keep the HTML title as the single source of the public name, before routing changes it.
  const siteName = document.title.split(' — ')[0].trim();
  const esc = E.escapeHtml;
  const main = document.getElementById('main');
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const dialog = document.getElementById('confirm-dialog');
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    book: '<path d="M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-2-10 1Zm0 0v16"/><path d="M5 8c2 0 3 0 4 1m6 0c1-1 2-1 4-1M5 12c2 0 3 0 4 1m6 0c1-1 2-1 4-1"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    sound: '<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
    mute: '<path d="m11 4-6 5H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="3"/>',
    headphones:
      '<path d="M3 13v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="11" width="5" height="10" rx="2"/><rect x="17" y="11" width="5" height="10" rx="2"/>',
    star: '<path d="m12 2 3 6.5 7 1-5 5 1.2 7-6.2-3.4-6.2 3.4 1.2-7-5-5 7-1L12 2Z"/>',
    sparkles:
      '<path d="m9 3 2.5 6.5L18 12l-6.5 2.5L9 21l-2.5-6.5L0 12l6.5-2.5L9 3Zm11-2 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    settings:
      '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    lightbulb:
      '<path d="M8 16c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7M8 17h8m-7 4h6m-3-4v-5l-3-2m3 2 3-2"/>',
    leaf: '<path d="M20 3c-1 9 2 16-9 17C1 19 0 9 9 7c5-1 8-1 11-4Z"/><path d="M4 22 15 11"/>',
    bookmark: '<path d="M6 3h12v19l-6-4-6 4V3Z"/>',
    flag: '<path d="M5 22V3m0 0c5-4 9 4 15 0v11c-6 4-10-4-15 0"/>',
    numbers: '<path d="m5 5 3-2v14m-3 0h6m4-11c0-5 7-4 7 0 0 3-7 5-7 9h7M2 22h20"/>',
    blocks:
      '<rect x="3" y="3" width="7" height="18" rx="1"/><path d="M3 9h7M3 15h7"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>',
    calculator:
      '<rect x="4" y="2" width="16" height="20" rx="3"/><path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1"/>',
    map: '<path d="m2 5 6-3 8 3 6-3v17l-6 3-8-3-6 3V5Zm6-3v17m8-14v17"/>',
    puzzle: '<path d="M4 4h5c-1-4 7-4 6 0h5v5c4-1 4 7 0 6v5h-5c1-4-7-4-6 0H4v-5c4 1 4-7 0-6V4Z"/>',
    shapes:
      '<path d="m7 2 5 9H2l5-9Z"/><circle cx="18" cy="6" r="4"/><rect x="3" y="15" width="7" height="7" rx="1"/><path d="m18 13 5 5-5 5-5-5 5-5Z"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7M7 8h6m-6 4h4"/>',
    tiles:
      '<rect x="2" y="4" width="8" height="8" rx="2"/><rect x="14" y="4" width="8" height="8" rx="2"/><path d="M3 19h18m-4-3 4 3-4 3"/>',
    pencil: '<path d="m15 3 6 6-12 12-7 1 1-7L15 3Zm-1 1 6 6M3 15l6 6"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
    link: '<path d="m10 14 4-4m-5 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-2 2" transform="translate(0 -1) scale(.95)"/>',
    shield: '<path d="m12 2 9 4v6c0 5-5 9-9 11-4-2-9-6-9-11V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    refresh: '<path d="M20 8a8 8 0 1 0 0 8m0-13v5h-5"/>'
  };
  function icon(name, className = '') {
    return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkles}</svg>`;
  }
  function plural(number, singular, multiple = singular + 's') {
    return `${number} ${number > 1 ? multiple : singular}`;
  }
  function findMission(id) {
    return Q.missions.find((mission) => mission.id === id);
  }
  function subjectClass(subject) {
    return subject === 'francais' ? 'theme-purple' : 'theme-green';
  }
  function storageObject() {
    try {
      return window.localStorage;
    } catch (_) {
      return null;
    }
  }
  const storage = storageObject();
  const loaded = E.loadProgress(storage);
  let progress = loaded.data;
  let storageAvailable = loaded.available;
  let warnedStorage = false;
  let session = null;
  let toastTimer;
  let dialogCallback = null;
  const chosenLevels = new Map();
  let audio;
  audio = window.CurieuxAudio.createAudio(progress.settings, {
    onChange: updateAudioUI,
    onError: showToast
  });

  function showToast(message) {
    const toast = document.getElementById('toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 6500);
  }
  function persist() {
    progress = E.sanitise(progress);
    storageAvailable = E.saveProgress(storage, progress);
    if (!storageAvailable && !warnedStorage) {
      warnedStorage = true;
      showToast(
        'Les progrès restent en mémoire pour cette visite, mais ce navigateur ne permet pas de les enregistrer.'
      );
    }
    renderFooter();
  }
  function updateSetting(name, value) {
    progress.settings[name] = value;
    audio.configure(progress.settings);
    persist();
    updateAudioUI(audio.state());
  }
  function updateAudioUI(state) {
    const sound = document.getElementById('sound-toggle');
    if (sound) {
      sound.innerHTML = `${icon(progress.settings.sound ? 'sound' : 'mute')}<span>${progress.settings.sound ? 'Son activé' : 'Son coupé'}</span>`;
      sound.setAttribute('aria-pressed', String(progress.settings.sound));
      sound.setAttribute(
        'aria-label',
        progress.settings.sound ? 'Son activé — couper le son' : 'Son coupé — activer le son'
      );
    }
    const stop = document.getElementById('stop-playback');
    if (stop) stop.hidden = !state.speaking;
    document
      .querySelectorAll('[data-speak]')
      .forEach((button) => button.classList.toggle('voice-active', state.speaking));
    const soundSetting = document.getElementById('setting-sound');
    if (soundSetting) soundSetting.checked = progress.settings.sound;
    const effectsSetting = document.getElementById('setting-effects');
    if (effectsSetting) {
      effectsSetting.checked = progress.settings.effects;
      effectsSetting.disabled = !progress.settings.sound;
    }
    const select = document.getElementById('voice-select');
    if (select && document.activeElement !== select) {
      select.innerHTML = `<option value="">Voix française automatique</option>${state.voices.map((voice) => `<option value="${esc(voice.voiceURI)}">${esc(voice.name)} · ${esc(voice.lang)}</option>`).join('')}`;
      select.value = progress.settings.voice;
      if (select.selectedIndex === -1) select.value = '';
      select.disabled = !state.supported || state.voices.length === 0;
    }
    const note = document.getElementById('voice-note');
    if (note)
      note.textContent = !state.supported
        ? 'La lecture vocale n’est pas prise en charge par ce navigateur. Toutes les activités restent accessibles avec l’aide d’un adulte.'
        : state.voices.length
          ? `${plural(state.voices.length, 'voix française disponible', 'voix françaises disponibles')}. Les voix dépendent de l’appareil et peuvent nécessiter une connexion.`
          : 'Aucune voix française n’est encore chargée. Essaie la voix ou actualise la liste. Si nécessaire, ajoute une voix française dans les réglages de l’appareil.';
  }
  function askConfirmation(title, description, label, callback) {
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-description').textContent = description;
    document.getElementById('dialog-confirm').textContent = label;
    dialogCallback = callback;
    dialog.showModal();
  }
  document.getElementById('dialog-cancel').addEventListener('click', () => {
    dialogCallback = null;
    dialog.close();
  });
  document.getElementById('dialog-confirm').addEventListener('click', () => {
    const callback = dialogCallback;
    dialogCallback = null;
    dialog.close();
    if (callback) callback();
  });
  dialog.addEventListener('cancel', () => {
    dialogCallback = null;
  });

  function renderHeader() {
    const route = location.hash.slice(1) || '/';
    header.innerHTML = `<div class="header-inner">
      <a class="brand" href="#/" aria-label="${esc(siteName)}, accueil"><img src="./assets/favicon.svg" width="43" height="43" alt=""><span>${esc(siteName)}</span></a>
      <nav class="main-nav" aria-label="Navigation principale">
        <a href="#/" ${route === '/' ? 'aria-current="page"' : ''}>${icon('home')}<span>Mon espace</span></a>
        <a href="#/carnet" ${route === '/carnet' ? 'aria-current="page"' : ''}>${icon('bookmark')}<span>Mon carnet</span></a>
        <a href="#/parents" ${route === '/parents' ? 'aria-current="page"' : ''}>${icon('settings')}<span>Espace parent</span></a>
      </nav>
      <div class="header-audio"><button type="button" class="audio-stop" data-action="stop" id="stop-playback" aria-label="Arrêter la lecture" hidden>${icon('stop')}</button><button type="button" class="sound-toggle" data-action="toggle-sound" id="sound-toggle"></button></div>
    </div>`;
    updateAudioUI(audio.state());
  }
  function renderFooter() {
    footer.innerHTML = `<div class="footer-inner"><span class="footer-motto">${icon('leaf')} Les grandes idées commencent par la curiosité.</span><a href="#/parents">Sans compte · À ton rythme ${icon('arrow')}</a></div>${!storageAvailable ? '<p class="storage-notice">Le stockage est indisponible : les progrès de cette visite ne seront pas conservés après fermeture de la page.</p>' : ''}`;
  }
  function pageTitle(title) {
    document.title = `${title} · ${siteName}`;
  }
  function backLink(subject) {
    return `<a class="back-link" href="#/${subject || ''}">${icon('back')}${subject ? `Les aventures de ${subject === 'maths' ? 'maths' : 'français'}` : 'Mon espace'}</a>`;
  }
  function renderHome() {
    pageTitle('À toi les découvertes !');
    const stats = E.stats(progress);
    const today = E.dailyMission();
    const active = session && !session.completed;
    main.innerHTML = `<div class="container home-page">
      <section class="hero" aria-labelledby="home-title">
        <div class="hero-copy"><div class="eyebrow"><span class="eyebrow-star">${icon('sparkles')}</span> POUR LES ESPRITS CURIEUX</div>
          <h1 id="home-title" data-page-title>À toi les grandes<br><span class="hand-underline">découvertes !</span></h1>
          <p class="hero-description">Des mots, des nombres et plein de «&nbsp;ah, j’ai compris&nbsp;!&nbsp;».<br class="desktop-break"> Choisis ton aventure. On explore ensemble ?</p>
          <div class="hero-actions"><a href="#/${active ? `jouer/${session.missionId}` : `activite/${today.id}`}" class="button button-primary">${icon(active ? 'flag' : 'sparkles')}${active ? 'Reprendre mon aventure' : 'Mon défi du jour'}${icon('arrow')}</a><button type="button" class="listen-link" data-speak="welcome">${icon('sound')}Écouter l’accueil</button></div>
          <div class="hero-assurance"><span class="tiny-check">${icon('check')}</span> Pas de chrono. Le droit d’essayer. Le plaisir de comprendre.</div>
        </div>
        <div class="hero-visual" aria-hidden="true"><div class="hero-orbit-label"><span></span> La curiosité, ça se cultive.</div><img src="./assets/illustrations/explorer.svg" width="560" height="440" alt="" class="hero-illustration"><div class="hero-note">Un petit défi,<br><strong>une grande idée.</strong>${icon('sparkles')}</div></div>
      </section>
      <section class="universes" aria-labelledby="universes-title"><div class="section-heading"><div><span class="section-kicker">LE DÉBUT DE L’AVENTURE</span><h2 id="universes-title">Quel univers explores-tu ?</h2></div><span class="subtle-pill">12 aventures, mille découvertes</span></div>
        <div class="universe-grid">
          <a class="universe-card universe-maths" href="#/maths"><div class="universe-text"><span class="subject-label"><span class="subject-dot"></span>MATHÉMATIQUES</span><h3>Le monde<br>des nombres</h3><p>Calculer, raisonner, trouver<br>des solutions.</p><span class="universe-cta">Explorer les maths ${icon('arrow')}</span></div><img src="./assets/illustrations/numbers.svg" alt="" width="200" height="170"><span class="card-count">6 aventures ${icon('sparkles')}</span></a>
          <a class="universe-card universe-french" href="#/francais"><div class="universe-text"><span class="subject-label"><span class="subject-dot"></span>FRANÇAIS</span><h3>La fabrique<br>des mots</h3><p>Lire, écouter, écrire.<br>Et faire grandir ses idées.</p><span class="universe-cta">Explorer le français ${icon('arrow')}</span></div><img src="./assets/illustrations/words.svg" alt="" width="200" height="170"><span class="card-count">6 aventures ${icon('sparkles')}</span></a>
        </div>
      </section>
      <section class="home-bottom" aria-label="Apprendre à son rythme">
        <div class="curiosity-card"><span class="curiosity-icon">${icon('star')}</span><div><span class="section-kicker">TON CARNET DE CURIOSITÉ</span><h3>${stats.stars ? `${plural(stats.stars, 'étoile')} et tant d’idées !` : 'Chaque petit pas compte.'}</h3><p>${stats.stars ? `${plural(stats.explored, 'aventure découverte')} sur 12. Continue à explorer à ton rythme.` : 'Une étoile pour chaque séance terminée, même avec un coup de pouce.'}</p></div><a href="#/carnet" class="circle-link" aria-label="Ouvrir mon carnet">${icon('arrow')}</a></div>
        <div class="listen-card"><span class="listen-card-icon">${icon('headphones')}</span><div><h3>Ça s’écoute aussi !</h3><p>Les consignes se lisent à voix haute,<br>seulement quand tu le demandes.</p><button type="button" class="text-link" data-speak="welcome">Essaie la voix ${icon('arrow')}</button></div></div>
      </section>
    </div>`;
  }
  function missionCard(mission) {
    const record = E.missionProgress(progress, mission.id);
    return `<a class="mission-card ${subjectClass(mission.subject)}" href="#/activite/${mission.id}" data-mission="${mission.id}"><div class="mission-card-top"><span class="mission-icon">${icon(mission.icon)}</span><span class="mission-status ${record.sessions ? 'is-explored' : ''}">${record.sessions ? `${icon('check')} Déjà explorée` : 'À découvrir'}</span></div><span class="mission-tags">${mission.tags}</span><h2>${mission.title}</h2><p>${mission.description}</p><div class="mission-card-bottom"><span>5 questions <span aria-hidden="true">·</span> 3 niveaux</span><span class="small-arrow">${icon('arrow')}</span></div></a>`;
  }
  function renderSubject(subject) {
    const meta = Q.subjects[subject];
    pageTitle(meta.short);
    main.innerHTML = `<div class="container subject-page ${subjectClass(subject)}">${backLink()}<div class="page-intro illustrated-intro"><div><div class="eyebrow">${icon(meta.icon)} ${meta.short.toLocaleUpperCase('fr-FR')}</div><h1 data-page-title>${meta.title}</h1><p>${meta.description}</p></div><img src="./assets/illustrations/${subject === 'maths' ? 'numbers' : 'words'}.svg" width="180" height="153" alt=""></div><div class="subject-tip">${icon('lightbulb')}<p><strong>Le bon niveau, c’est celui qui te fait réfléchir.</strong> Tous les défis sont ouverts : tu peux choisir, essayer et changer d’avis.</p></div><div class="missions-grid">${Q.missions
      .filter((mission) => mission.subject === subject)
      .map(missionCard)
      .join('')}</div></div>`;
  }
  function renderBriefing(mission) {
    pageTitle(mission.title);
    const record = E.missionProgress(progress, mission.id);
    const selected = chosenLevels.get(mission.id) || record.suggested;
    chosenLevels.set(mission.id, selected);
    main.innerHTML = `<div class="container narrow-page ${subjectClass(mission.subject)}">${backLink(mission.subject)}<section class="briefing-card"><div class="briefing-top"><span class="mission-icon large-icon">${icon(mission.icon)}</span><div class="eyebrow">${Q.subjects[mission.subject].short.toLocaleUpperCase('fr-FR')} · À TOI DE CHOISIR</div><h1 data-page-title>${mission.title}</h1><p>${mission.description}</p></div>
      <div class="session-facts"><span>${icon('flag')} 5 questions</span><span>${icon('headphones')} Consignes audio</span><span>${icon('leaf')} Sans chrono</span></div>
      ${session && !session.completed && session.missionId === mission.id ? `<div class="resume-strip">Une séance est déjà en cours. <a href="#/jouer/${mission.id}">La reprendre ${icon('arrow')}</a></div>` : ''}
      <h2 class="level-heading">Quel défi te tente ?</h2><div class="level-picker" role="group" aria-label="Choisir la difficulté">${Q.levels.map((name, i) => `<button type="button" class="level-option ${selected === i + 1 ? 'is-selected' : ''}" data-level="${i + 1}" data-mission="${mission.id}" aria-pressed="${selected === i + 1}"><span class="level-dots" aria-hidden="true">${[0, 1, 2].map((dot) => `<i class="${dot <= i ? 'filled' : ''}"></i>`).join('')}</span><strong>${name}</strong><span>${i === 0 ? 'Prendre ses repères' : i === 1 ? 'Aller un peu plus loin' : 'Faire chauffer ses idées'}</span>${record.last && record.suggested === i + 1 ? '<span class="recommendation-tag">Proposé pour toi</span>' : ''}</button>`).join('')}</div>
      <p class="level-description">${icon('lightbulb')} ${esc(mission.details[selected - 1])}</p>
      ${mission.id === 'f-dictee' ? '<p class="dictation-notice">Pour la dictée, active le son. Si la voix ne fonctionne pas, un adulte pourra lire les mots à dicter.</p>' : ''}
      <button type="button" class="button button-primary start-button" data-action="start" data-mission="${mission.id}">C’est parti ! ${icon('arrow')}</button><p class="small-reassurance">Un indice si tu en as besoin. Une explication pour comprendre.</p></section></div>`;
  }
  function freshAnswer() {
    return {
      value: '',
      order: [],
      attempts: 0,
      hinted: false,
      revealed: false,
      locked: false,
      correct: false,
      feedback: '',
      accentOnly: false,
      showAdult: false
    };
  }
  function startSession(missionId, level, force = false) {
    const mission = findMission(missionId);
    if (!mission) return;
    if (session && !session.completed && !force) {
      askConfirmation(
        'Commencer une nouvelle aventure ?',
        'La séance en cours n’a pas encore été enregistrée. Tu peux la reprendre, ou la remplacer par ce nouveau défi.',
        'Commencer le nouveau défi',
        () => startSession(missionId, level, true)
      );
      return;
    }
    audio.cancel();
    const previous = [...progress.history]
      .reverse()
      .find((item) => item.missionId === missionId && item.level === level);
    session = {
      id:
        window.crypto && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      missionId,
      level,
      questions: E.buildQuestions(missionId, level, {
        avoidIds: previous ? previous.questionIds : []
      }),
      index: 0,
      results: [],
      current: freshAnswer(),
      completed: false
    };
    const nextRoute = `#/jouer/${missionId}`;
    if (location.hash === nextRoute) renderRoute(true);
    else location.hash = nextRoute;
  }
  function shapeVisual(shape) {
    const shapes = {
      triangle: '<path d="m110 18 85 135H25l85-135Z"/>',
      square: '<rect x="43" y="17" width="134" height="134" rx="3"/>',
      'diamond-square':
        '<rect x="57" y="32" width="107" height="107" rx="3" transform="rotate(45 110 85)"/>',
      'diagonal-square':
        '<rect x="43" y="17" width="134" height="134" rx="3"/><path d="m43 17 134 134" fill="none" stroke-dasharray="7 6"/>',
      circle: '<circle cx="110" cy="85" r="68"/>',
      rectangle: '<rect x="15" y="40" width="190" height="95" rx="3"/>',
      pentagon: '<path d="m110 10 78 57-30 91H62L32 67l78-57Z"/>',
      hexagon: '<path d="m67 15 86 0 43 70-43 70H67L24 85l43-70Z"/>'
    };
    return `<div class="shape-visual" aria-hidden="true"><svg viewBox="0 0 220 170" fill="var(--subject-tint)" stroke="var(--subject-color)" stroke-width="4" stroke-linejoin="round">${shapes[shape] || ''}</svg></div>`;
  }
  function questionVisual(question) {
    if (question.expression)
      return `<div class="math-expression">${esc(question.expression)}</div>`;
    const visual = question.visual;
    if (!visual) return '';
    if (visual.shape) return shapeVisual(visual.shape);
    if (visual.sequence)
      return `<div class="number-sequence" aria-label="Suite : ${esc(visual.sequence.join(', '))}">${visual.sequence.map((number) => `<span class="${number === '?' ? 'missing-number' : ''}">${esc(number)}</span>`).join('')}</div>`;
    if (visual.numeral !== undefined) return `<div class="big-number">${visual.numeral}</div>`;
    return `<div class="base-ten" role="img" aria-label="${visual.hundreds || 0} centaines, ${visual.tens || 0} dizaines et ${visual.ones || 0} unités">${visual.hundreds ? `<div class="block-group"><div class="hundreds">${Array.from({ length: visual.hundreds }, () => '<i class="hundred-block"></i>').join('')}</div><span>1 carré = 100</span></div>` : ''}<div class="block-group"><div class="tens">${Array.from({ length: visual.tens || 0 }, () => '<i class="ten-block"></i>').join('') || '<span>0</span>'}</div><span>1 barre = 10</span></div><div class="block-group"><div class="ones">${Array.from({ length: visual.ones || 0 }, () => '<i class="one-block"></i>').join('') || '<span>0</span>'}</div><span>1 point = 1</span></div></div>`;
  }
  function currentQuestion() {
    return session.questions[session.index];
  }
  function canCheck() {
    if (!session || session.completed) return false;
    if (session.current.locked) return true;
    const q = currentQuestion();
    return q.type === 'order'
      ? session.current.order.length === q.tokens.length
      : session.current.value.trim().length > 0;
  }
  function renderAnswers(question, current) {
    if (question.type === 'choice')
      return `<fieldset class="answer-choices" ${current.locked ? 'disabled' : ''}><legend class="sr-only">Choisis une réponse</legend>${question.options.map((option, index) => `<div class="choice-row"><label class="choice-option ${current.locked && option === question.answer ? 'correct-option' : ''}"><input type="radio" name="answer" value="${esc(option)}" ${current.value === option ? 'checked' : ''}><span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span class="option-text">${esc(option)}</span><span class="option-mark" aria-hidden="true">${icon(current.locked && option === question.answer ? 'check' : 'check')}</span></label>${question.choiceAudio ? `<button type="button" class="option-audio" data-speak="option" data-index="${index}" aria-label="Écouter le mot ${esc(option)}">${icon('sound')}</button>` : ''}</div>`).join('')}</fieldset>`;
    if (question.type === 'order')
      return `<div class="order-exercise"><p class="input-instruction" id="order-instruction">${question.orderKind === 'numbers' ? 'Choisis les nombres dans le bon ordre.' : 'Choisis les mots dans le bon ordre.'} Clique sur un élément placé pour le retirer.</p><div class="sentence-tray ${!current.order.length ? 'is-empty' : ''}" aria-label="Ta proposition" aria-describedby="order-instruction">${current.order.length ? current.order.map((id, index) => `<button type="button" class="word-tile placed-tile" data-action="remove-tile" data-index="${index}" ${current.locked ? 'disabled' : ''} aria-label="Retirer ${esc(question.tokens[id])}">${esc(question.tokens[id])}${icon('close')}</button>`).join('') : `<span>${question.orderKind === 'numbers' ? 'Les nombres se placeront ici…' : 'Ta phrase se construit ici…'}</span>`}</div><div class="word-bank" aria-label="Éléments à placer">${question.tiles.map((tile) => `<button type="button" class="word-tile ${current.order.includes(tile.id) ? 'is-used' : ''}" data-action="add-tile" data-tile="${tile.id}" ${current.locked || current.order.includes(tile.id) ? 'disabled' : ''}>${esc(tile.text)}</button>`).join('')}</div><button type="button" class="text-link order-reset" data-action="reset-tiles" ${current.locked || !current.order.length ? 'disabled' : ''}>${icon('refresh')}Tout remettre</button></div>`;
    const dictation = question.type === 'dictation';
    return `${dictation ? `<div class="dictation-player"><span class="dictation-symbol">${icon('headphones')}</span><div><strong>À toi de tendre l’oreille.</strong><p>Tu peux écouter le mot autant de fois que tu veux.</p></div><button type="button" class="button button-soft" data-speak="dictation">${icon('sound')}Écouter le mot</button></div>` : ''}<div class="written-answer ${dictation ? 'text-answer' : 'number-answer'}"><label for="answer-input">${dictation ? 'Le mot que tu as entendu' : 'Ta réponse'}</label><div class="input-shell"><input id="answer-input" name="answer" type="text" ${dictation ? 'inputmode="text" maxlength="60"' : 'inputmode="numeric" pattern="[0-9 ]*" maxlength="6"'} autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" value="${esc(current.value)}" placeholder="${dictation ? 'Écris le mot ici…' : '?'}" ${current.locked ? 'readonly' : ''} ${current.feedback ? 'aria-describedby="feedback"' : ''}><span aria-hidden="true">${icon(dictation ? 'pencil' : 'numbers')}</span></div>${dictation && !current.locked ? `<div class="accent-toolbar" aria-label="Lettres accentuées"><span>Un accent ?</span>${['é', 'è', 'ê', 'à', 'ù', 'ç'].map((letter) => `<button type="button" data-accent="${letter}" aria-label="Insérer ${letter}">${letter}</button>`).join('')}</div>` : ''}</div>${dictation && !current.locked ? `<details class="adult-help" ${current.showAdult ? 'open' : ''}><summary>Aide d’un adulte · si la voix ne fonctionne pas</summary><p>Un adulte peut afficher le mot pour le lire à voix haute, sans montrer l’écran à l’enfant.</p><button type="button" class="text-link" data-action="adult-word">${current.showAdult ? 'Masquer le mot' : 'Afficher le mot à dicter'}</button>${current.showAdult ? `<p class="adult-word"><strong>${esc(question.answer)}</strong> — ${esc(question.context)}</p>` : ''}</details>` : ''}`;
  }
  function renderFeedback(question, current) {
    if (!current.feedback) return '';
    const success = current.locked;
    return `<div class="answer-feedback ${success ? 'feedback-success' : 'feedback-retry'}" id="feedback" role="status" tabindex="-1"><span class="feedback-symbol">${icon(success && !current.revealed ? 'check' : 'lightbulb')}</span><div><strong>${current.revealed ? 'Regardons ensemble.' : success ? 'Bien trouvé !' : current.accentOnly ? 'Tu as trouvé le mot. Vérifie les accents.' : 'Pas tout à fait. On cherche encore ?'}</strong><p>${esc(current.feedback)}</p>${success ? `<button type="button" class="text-link" data-speak="explanation">${icon('sound')}Écouter l’explication</button>` : ''}</div></div>`;
  }
  function renderQuestion() {
    const mission = findMission(session.missionId);
    const question = currentQuestion();
    const current = session.current;
    const { total, completed, remaining } = E.questionProgress(
      session.index,
      session.questions.length,
      current.locked
    );
    pageTitle(`${mission.title} — Question ${session.index + 1}`);
    main.innerHTML = `<div class="container exercise-page ${subjectClass(mission.subject)}"><div class="exercise-back-row">${backLink(mission.subject)}<span class="session-level">${Q.levels[session.level - 1]}</span></div><div class="exercise-heading"><span class="mission-icon">${icon(mission.icon)}</span><div><span class="section-kicker">${Q.subjects[mission.subject].short}</span><p>${mission.title}</p></div><span class="exercise-star">${icon('star')}</span></div><div class="session-progress" role="progressbar" aria-label="Questions terminées" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${completed}" aria-valuetext="${plural(completed, 'question terminée', 'questions terminées')} sur ${total}">${Array.from({ length: total }, (_, index) => `<span class="${index < completed ? 'is-done' : index === session.index ? 'is-current' : ''}"></span>`).join('')}</div><div class="question-counter"><strong>Question ${session.index + 1} <span>sur ${total}</span></strong><span class="questions-remaining" aria-live="polite" aria-atomic="true">${plural(remaining, 'question restante', 'questions restantes')}</span></div>
      <form id="answer-form" novalidate><section class="question-card" aria-labelledby="question-title"><div class="question-card-top"><span class="question-eyebrow">${question.type === 'dictation' ? 'LES OREILLES GRANDES OUVERTES' : question.story ? 'UNE HISTOIRE À EXPLORER' : 'À TOI DE JOUER'}</span><button type="button" class="listen-button" data-speak="question" aria-label="${question.story ? 'Écouter l’histoire et la question' : 'Écouter la consigne'}">${icon('sound')}<span>${question.story ? 'Écouter l’histoire' : 'Écouter'}</span></button></div>${question.story ? `<div class="story-block"><span class="story-quote" aria-hidden="true">“</span><p>${esc(question.story)}</p></div>` : ''}<h1 id="question-title" data-page-title>${esc(question.prompt)}</h1>${questionVisual(question)}${renderAnswers(question, current)}${current.hinted ? `<aside class="hint-box" id="hint-box"><span>${icon('lightbulb')}</span><div><strong>Un petit coup de pouce</strong><p>${esc(question.hint)}</p><button type="button" class="text-link" data-speak="hint">${icon('sound')}Écouter l’indice</button></div></aside>` : ''}${renderFeedback(question, current)}<div class="question-actions"><div>${!current.locked ? `<button type="button" class="hint-button" data-action="hint" ${current.hinted ? 'disabled' : ''}>${icon('lightbulb')}${current.hinted ? 'Indice affiché' : 'Un petit indice'}</button>` : `<span class="keep-going">${icon('leaf')} Chaque essai fait avancer.</span>`}${current.attempts >= 2 && !current.locked ? '<button type="button" class="text-link reveal-button" data-action="reveal">Comprendre la réponse</button>' : ''}</div><button type="submit" class="button button-primary" id="check-answer" ${canCheck() ? '' : 'disabled'}>${current.locked ? (session.index === total - 1 ? 'Voir mon bilan' : 'La suite !') : 'Vérifier ma réponse'}${icon(current.locked ? 'arrow' : 'check')}</button></div></section></form><p class="exercise-footnote">${icon('shield')} Tu as le droit d’essayer, de te tromper et de recommencer.</p></div>`;
    updateAudioUI(audio.state());
  }
  function validateAnswer() {
    if (!session || session.completed) return;
    const current = session.current;
    const question = currentQuestion();
    if (current.locked) {
      nextQuestion();
      return;
    }
    if (!canCheck()) return;
    const submitted =
      question.type === 'order' ? current.order.map((id) => question.tokens[id]) : current.value;
    const checked = E.checkAnswer(question, submitted);
    if (checked.empty) return;
    audio.cancel();
    current.attempts++;
    current.correct = checked.correct;
    current.accentOnly = checked.accentOnly;
    current.locked = checked.correct;
    current.feedback = checked.correct
      ? question.explanation
      : checked.accentOnly
        ? 'L’orthographe comprend aussi les accents. Tu peux utiliser les lettres juste sous la zone de réponse.'
        : 'Tu peux modifier ta réponse, prendre un indice et essayer de nouveau.';
    if (checked.correct) audio.effect();
    renderQuestion();
    document.getElementById('feedback').focus({ preventScroll: true });
  }
  function nextQuestion() {
    if (!session.current.locked) return;
    const current = session.current;
    session.results.push({
      independent:
        current.correct && current.attempts === 1 && !current.hinted && !current.revealed,
      hinted: current.hinted,
      revealed: current.revealed
    });
    audio.cancel();
    if (session.index < session.questions.length - 1) {
      session.index++;
      session.current = freshAnswer();
      renderQuestion();
      focusPage();
    } else {
      session.completed = true;
      const result = {
        id: session.id,
        missionId: session.missionId,
        level: session.level,
        date: Date.now(),
        independent: session.results.filter((item) => item.independent).length,
        hints: session.results.filter((item) => item.hinted).length,
        revealed: session.results.filter((item) => item.revealed).length,
        questionIds: session.questions.map((question) => question.id)
      };
      progress = E.recordSession(progress, result);
      persist();
      audio.effect('complete');
      renderResults();
      focusPage();
    }
  }
  function renderResults() {
    const mission = findMission(session.missionId);
    const independent = session.results.filter((result) => result.independent).length;
    const nextLevel = E.recommendation(session.level, independent);
    const nextMessage =
      nextLevel > session.level
        ? 'Tu sembles à l’aise ! Si tu en as envie, essaie le niveau suivant.'
        : nextLevel < session.level
          ? 'Tu peux prendre de nouveaux repères au niveau précédent, ou refaire celui-ci à ton rythme.'
          : 'Encore envie de chercher ? Tu peux refaire ce niveau avec une nouvelle série.';
    pageTitle('Une découverte de plus !');
    main.innerHTML = `<div class="container narrow-page results-page ${subjectClass(mission.subject)}">${backLink(mission.subject)}<section class="results-card"><div class="result-celebration" aria-hidden="true"><span class="result-small-star one">${icon('sparkles')}</span><span class="result-big-star">${icon('star')}</span><span class="result-small-star two">${icon('sparkles')}</span></div><span class="eyebrow">UNE ÉTOILE DE CURIOSITÉ EN PLUS</span><h1 data-page-title>Une découverte de plus !</h1><p class="result-intro">${independent >= 4 ? 'Tu as trouvé de belles solutions. Garde cette envie de chercher !' : 'Tu as pris le temps de chercher et d’apprendre. Chaque essai compte.'}</p><div class="result-metrics"><div><strong>5</strong><span>questions explorées</span></div><div><strong>${independent}<small> / 5</small></strong><span>réussites sans aide*</span></div><div><strong>+1 ${icon('star')}</strong><span>étoile de curiosité</span></div></div><p class="metric-note">* Au premier essai, sans indice ni réponse affichée. Écouter une consigne n’enlève rien !</p><div class="next-recommendation">${icon('lightbulb')}<p>${nextMessage}</p></div><div class="results-actions"><button type="button" class="button button-primary" data-action="restart" data-level="${nextLevel}">${nextLevel > session.level ? 'Essayer le niveau suivant' : nextLevel < session.level ? 'Reprendre mes repères' : 'Un nouveau défi'}${icon('arrow')}</button><a class="button button-soft" href="#/activite/${mission.id}">Choisir mon niveau</a></div></section><section class="review-section"><h2>Le carnet de cette aventure</h2><p>Tu peux revoir chaque explication, tranquillement.</p><div class="review-list">${session.questions.map((question, index) => `<details class="review-item"><summary><span class="review-bullet ${session.results[index].independent ? 'independent' : ''}">${icon(session.results[index].independent ? 'check' : 'lightbulb')}</span><span><strong>Question ${index + 1}</strong><span>${esc(question.expression || (question.type === 'dictation' ? 'Le mot à l’oreille' : question.prompt))}</span></span>${icon('chevron')}</summary><div class="review-explanation"><p>${esc(question.explanation)}</p><button type="button" class="text-link" data-speak="review" data-index="${index}">${icon('sound')}Écouter l’explication</button></div></details>`).join('')}</div><a href="#/carnet" class="text-link view-notebook">Ouvrir mon carnet de découvertes ${icon('arrow')}</a></section></div>`;
  }
  function renderNotebook() {
    pageTitle('Mon carnet de découvertes');
    const stats = E.stats(progress);
    const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
    main.innerHTML = `<div class="container notebook-page">${backLink()}<div class="page-intro"><div class="eyebrow">${icon('bookmark')} MON CARNET DE CURIOSITÉ</div><h1 data-page-title>Chaque découverte compte.</h1><p>Pas de course, pas de classement. Juste le chemin que tu construis.</p></div><div class="stats-grid"><div class="stat-card"><span class="stat-icon gold">${icon('star')}</span><div><strong>${stats.stars}</strong><span>${stats.stars > 1 ? 'étoiles de curiosité' : 'étoile de curiosité'}</span></div></div><div class="stat-card"><span class="stat-icon sage">${icon('compass')}</span><div><strong>${stats.explored}<small> / 12</small></strong><span>aventures découvertes</span></div></div><div class="stat-card"><span class="stat-icon lilac">${icon('lightbulb')}</span><div><strong>${stats.questions}</strong><span>questions explorées</span></div></div></div>
      ${
        stats.stars
          ? `<section class="recent-sessions"><div class="section-heading"><h2>Tes dernières découvertes</h2><span class="subtle-pill">Une étoile par séance terminée</span></div><div class="history-list">${[
              ...progress.history
            ]
              .reverse()
              .slice(0, 6)
              .map((entry) => {
                const mission = findMission(entry.missionId);
                return `<a class="history-item ${subjectClass(mission.subject)}" href="#/activite/${mission.id}"><span class="mission-icon">${icon(mission.icon)}</span><div><strong>${mission.title}</strong><span>${Q.levels[entry.level - 1]} · ${dateFormat.format(entry.date)}</span></div><span class="history-star">+1 ${icon('star')}</span>${icon('chevron')}</a>`;
              })
              .join('')}</div></section>`
          : `<section class="empty-notebook"><div class="empty-notebook-icon">${icon('leaf')}</div><h2>Les premières pages t’attendent.</h2><p>Termine une séance de 5 questions pour gagner ta première étoile.<br>Les indices et les essais font partie de l’aventure.</p><a class="button button-primary" href="#/">Choisir une aventure ${icon('arrow')}</a></section>`
      }
      <section class="exploration-section"><div class="section-heading"><h2>Ta carte des découvertes</h2><span class="small-muted">Les points indiquent les niveaux déjà explorés.</span></div><div class="exploration-grid">${Object.entries(
        Q.subjects
      )
        .map(
          ([subject, meta]) =>
            `<div class="exploration-card ${subjectClass(subject)}"><h3>${icon(meta.icon)}${meta.short}</h3>${Q.missions
              .filter((mission) => mission.subject === subject)
              .map((mission) => {
                const done = new Set(
                  progress.history
                    .filter((entry) => entry.missionId === mission.id)
                    .map((entry) => entry.level)
                );
                return `<a class="exploration-row" href="#/activite/${mission.id}"><span>${mission.title}</span><span class="exploration-dots" aria-label="${done.size} niveaux explorés sur 3">${[1, 2, 3].map((level) => `<i class="${done.has(level) ? 'is-complete' : ''}" title="${Q.levels[level - 1]}"></i>`).join('')}</span></a>`;
              })
              .join('')}</div>`
        )
        .join(
          ''
        )}</div></section><p class="local-note">${icon('shield')} Ce carnet reste dans ce navigateur et conserve les 200 dernières séances. Pour le réinitialiser, ouvre l’espace parent.</p></div>`;
  }
  function renderParents() {
    pageTitle('Le coin des parents');
    main.innerHTML = `<div class="container parent-page">${backLink()}<div class="page-intro"><div class="eyebrow">${icon('leaf')} APPRENDRE, EN CONFIANCE</div><h1 data-page-title>Le coin des parents.</h1><p>Des réglages simples pour accompagner une grande curiosité.</p></div><div class="parent-grid"><section class="settings-card"><div class="settings-heading"><span class="stat-icon lilac">${icon('headphones')}</span><div><h2>Une voix pour l’accompagner</h2><p>Écouter, réécouter, puis chercher à son rythme.</p></div></div><label class="switch-row" for="setting-sound"><span><strong>Activer le son</strong><small>La voix ne démarre qu’en appuyant sur Écouter.</small></span><span class="switch"><input type="checkbox" id="setting-sound" ${progress.settings.sound ? 'checked' : ''}><span class="switch-track"></span></span></label><label class="switch-row" for="setting-effects"><span><strong>Petits sons d’encouragement</strong><small>Des notes discrètes après une réponse juste.</small></span><span class="switch"><input type="checkbox" id="setting-effects" ${progress.settings.effects ? 'checked' : ''}><span class="switch-track"></span></span></label><div class="voice-settings"><label for="voice-select">Voix française</label><select id="voice-select" aria-describedby="voice-note"><option value="">Voix française automatique</option></select><p id="voice-note" class="field-note"></p><button class="text-link" type="button" data-action="refresh-voices">${icon('refresh')}Actualiser les voix</button></div><fieldset class="rate-picker"><legend>Vitesse de lecture</legend>${[
      [0.8, 'Tranquille'],
      [0.9, 'Naturelle'],
      [1, 'Un peu plus vive']
    ]
      .map(
        ([value, label]) =>
          `<label><input type="radio" name="speech-rate" value="${value}" ${progress.settings.rate === value ? 'checked' : ''}><span>${label}</span></label>`
      )
      .join(
        ''
      )}</fieldset><button type="button" class="button button-soft test-voice" data-speak="test">${icon('sound')}Essayer la voix</button><p class="field-note">Si la voix est indisponible, les consignes restent visibles. Pour les dictées, un bouton réservé à l’adulte affiche le mot à lire.</p></section>
      <div class="parent-side"><section class="parent-note"><span class="stat-icon sage">${icon('lightbulb')}</span><h2>Des défis, pas des étiquettes.</h2><p>Savoir compter et savoir calculer sont des compétences différentes. Chaque activité a ses propres niveaux, tous accessibles dès le départ.</p><p>Après cinq questions, un niveau est proposé selon les réussites au premier essai sans indice. Cette proposition n’impose rien : votre fille garde le choix.</p><p><strong>Les consignes audio ne comptent pas comme une aide.</strong> Elles permettent de réfléchir sans être bloquée par le déchiffrage.</p><p>Le carnet s’enregistre à la fin des cinq questions. Une séance en cours peut être reprise depuis l’accueil, mais pas après avoir actualisé ou fermé la page.</p></section><section class="privacy-note"><span class="stat-icon gold">${icon('shield')}</span><h2>Un petit espace tranquille.</h2><ul><li>Pas de compte, de publicité ou de classement.</li><li>Aucun micro, prénom ou enregistrement demandé.</li><li>Les réponses saisies ne sont pas conservées.</li><li>Les progrès restent sur cet appareil.</li></ul><p>Les voix sont fournies par le navigateur ou le système. Certaines utilisent un service vocal en ligne pour lire les consignes.</p></section></div></div>
      <section class="learning-guide"><h2>Trois façons d’explorer</h2><div class="guide-grid">${Q.levels.map((level, index) => `<div><span class="guide-number">0${index + 1}</span><h3>${level}</h3><p>${['Prendre des repères avec des mots familiers, des nombres et des problèmes courts.', 'Approfondir, relier deux étapes et aller au-delà des automatismes.', 'Explorer des raisonnements et des notions plus avancés, sans plafond lié à l’âge.'][index]}</p></div>`).join('')}</div><p class="field-note">Une étoile récompense une séance menée au bout, avec ou sans indices. Ces activités ne remplacent pas l’accompagnement de l’enseignant et ne constituent pas une évaluation du niveau scolaire.</p></section><section class="reset-section"><div><h2>Repartir avec un carnet neuf</h2><p>Efface uniquement les progrès de ce navigateur. Les réglages audio seront conservés.</p></div><button type="button" class="button button-outline" data-action="reset-progress">Effacer le carnet</button></section></div>`;
    updateAudioUI(audio.state());
  }
  function focusPage() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const title = main.querySelector('[data-page-title]');
    if (title) {
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }
  }
  function renderRoute(shouldFocus = false) {
    audio.cancel();
    const route = location.hash.slice(1) || '/';
    if (route === '/') renderHome();
    else if (route === '/maths' || route === '/francais') renderSubject(route.slice(1));
    else if (route === '/carnet') renderNotebook();
    else if (route === '/parents') renderParents();
    else if (/^\/(activite|jouer)\/[a-z-]+$/.test(route)) {
      const [, kind, id] = route.split('/');
      const mission = findMission(id);
      if (!mission) renderNotFound();
      else if (kind === 'jouer' && session && session.missionId === id) {
        if (session.completed) renderResults();
        else renderQuestion();
      } else {
        if (kind === 'jouer') history.replaceState(null, '', `#/activite/${id}`);
        renderBriefing(mission);
      }
    } else renderNotFound();
    renderHeader();
    renderFooter();
    if (shouldFocus) focusPage();
  }
  function renderNotFound() {
    pageTitle('Un autre chemin');
    main.innerHTML = `<div class="container empty-notebook not-found"><div class="empty-notebook-icon">${icon('compass')}</div><h1 data-page-title>On prend un autre chemin ?</h1><p>Cette aventure n’existe pas. Toutes les découvertes t’attendent à l’accueil.</p><a class="button button-primary" href="#/">Retour à mon espace ${icon('arrow')}</a></div>`;
  }
  function speakFor(button) {
    const kind = button.dataset.speak;
    if (kind === 'welcome') {
      audio.speak(
        `Bienvenue dans ${siteName} ! Des mots, des nombres et de grandes découvertes t’attendent. Choisis les mathématiques ou le français. Prends ton temps : ici, tu as le droit de chercher, d’essayer et de recommencer.`
      );
      return;
    }
    if (kind === 'test') {
      audio.speak(
        'Bonjour ! Prête à faire une découverte ? Prends le temps de réfléchir. Tu peux écouter les consignes autant de fois que tu le souhaites.'
      );
      return;
    }
    if (!session) return;
    if (kind === 'review') {
      const question = session.questions[Number(button.dataset.index)];
      if (question) audio.speak(question.explanation);
      return;
    }
    const question = currentQuestion();
    if (kind === 'question')
      audio.speak(
        question.type === 'dictation'
          ? question.prompt
          : question.speech || `${question.story ? question.story + ' ' : ''}${question.prompt}`
      );
    else if (kind === 'dictation') audio.speak(question.speech);
    else if (kind === 'hint') audio.speak(question.hint);
    else if (kind === 'explanation') audio.speak(question.explanation);
    else if (kind === 'option') audio.speak(question.options[Number(button.dataset.index)]);
  }

  document.addEventListener('click', (event) => {
    const skip = event.target.closest('.skip-link');
    if (skip) {
      event.preventDefault();
      main.focus();
      main.scrollIntoView();
      return;
    }
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.speak) {
      speakFor(button);
      return;
    }
    if (button.dataset.level && button.dataset.mission) {
      chosenLevels.set(button.dataset.mission, Number(button.dataset.level));
      renderBriefing(findMission(button.dataset.mission));
      main.querySelector(`[data-level="${button.dataset.level}"]`).focus({ preventScroll: true });
      return;
    }
    if (button.dataset.accent) {
      const input = document.getElementById('answer-input');
      if (input && session && !session.current.locked) {
        input.setRangeText(button.dataset.accent, input.selectionStart, input.selectionEnd, 'end');
        session.current.value = input.value;
        input.focus();
        document.getElementById('check-answer').disabled = !canCheck();
      }
      return;
    }
    const action = button.dataset.action;
    if (action === 'toggle-sound') {
      updateSetting('sound', !progress.settings.sound);
      return;
    }
    if (action === 'stop') {
      audio.cancel();
      return;
    }
    if (action === 'refresh-voices') {
      audio.refreshVoices();
      showToast('La liste des voix de cet appareil a été actualisée.');
      return;
    }
    if (action === 'start') {
      startSession(button.dataset.mission, chosenLevels.get(button.dataset.mission) || 1);
      return;
    }
    if (action === 'restart') {
      startSession(session.missionId, Number(button.dataset.level));
      return;
    }
    if (action === 'reset-progress') {
      askConfirmation(
        'Effacer le carnet de découvertes ?',
        'Les étoiles et les séances enregistrées dans ce navigateur seront effacées. Les réglages audio seront conservés. Cette action ne peut pas être annulée.',
        'Oui, effacer le carnet',
        () => {
          progress = { ...E.emptyProgress(), settings: { ...progress.settings } };
          persist();
          renderParents();
          showToast('Le carnet est prêt pour de nouvelles découvertes.');
          document.querySelector('[data-action="reset-progress"]').focus();
        }
      );
      return;
    }
    if (!session || session.completed || session.current.locked) return;
    const current = session.current;
    if (action === 'hint') {
      current.hinted = true;
      renderQuestion();
      document.getElementById('hint-box').scrollIntoView({ block: 'nearest' });
      main.querySelector('[data-speak="hint"]').focus({ preventScroll: true });
    } else if (action === 'reveal') {
      audio.cancel();
      current.revealed = true;
      current.locked = true;
      current.correct = false;
      current.feedback = currentQuestion().explanation;
      renderQuestion();
      document.getElementById('feedback').focus({ preventScroll: true });
    } else if (action === 'adult-word') {
      current.showAdult = !current.showAdult;
      renderQuestion();
      main.querySelector('[data-action="adult-word"]').focus({ preventScroll: true });
    } else if (action === 'add-tile') {
      current.order.push(Number(button.dataset.tile));
      renderQuestion();
      const next =
        main.querySelector('.word-bank button:not(:disabled)') ||
        document.getElementById('check-answer');
      next.focus({ preventScroll: true });
    } else if (action === 'remove-tile') {
      const tile = current.order.splice(Number(button.dataset.index), 1)[0];
      renderQuestion();
      main.querySelector(`[data-tile="${tile}"]`).focus({ preventScroll: true });
    } else if (action === 'reset-tiles') {
      current.order = [];
      renderQuestion();
      main.querySelector('.word-bank button').focus({ preventScroll: true });
    }
  });
  document.addEventListener('input', (event) => {
    if (event.target.id === 'answer-input' && session && !session.current.locked) {
      session.current.value = event.target.value;
      document.getElementById('check-answer').disabled = !canCheck();
    }
  });
  document.addEventListener('change', (event) => {
    const input = event.target;
    if (input.name === 'answer' && input.type === 'radio' && session && !session.current.locked) {
      session.current.value = input.value;
      document.getElementById('check-answer').disabled = !canCheck();
    } else if (input.id === 'setting-sound') updateSetting('sound', input.checked);
    else if (input.id === 'setting-effects') updateSetting('effects', input.checked);
    else if (input.id === 'voice-select') updateSetting('voice', input.value);
    else if (input.name === 'speech-rate') updateSetting('rate', Number(input.value));
  });
  document.addEventListener('submit', (event) => {
    if (event.target.id === 'answer-form') {
      event.preventDefault();
      validateAnswer();
    }
  });
  window.addEventListener('hashchange', () => renderRoute(true));
  window.addEventListener('pagehide', () => audio.cancel());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.cancel();
  });
  renderRoute();
})();
