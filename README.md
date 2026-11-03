# Les petits curieux

Un espace de **mathématiques et de français pour le CP**, avec des défis plus avancés accessibles librement. Conçu pour une enfant de 6 ans qui lit déjà des mots et compte jusqu’à 100 : la difficulté dépend de chaque compétence, pas uniquement de l’âge.

Cette version **remplace l’ancien exercice unique** situé dans `exercices/CP/francais/lecture-ecriture/index.html`. La nouvelle entrée du site est **`index.html` à la racine** ; le fichier `index` sans extension n’est pas recréé.

## Démarrer

Avec Node.js 18 ou plus récent :

```sh
npm start
```

Ouvrir **http://localhost:4173**. Le serveur écoute sur `0.0.0.0`, accepte les hôtes d’aperçu et ne sert que la page d’accueil et ses ressources publiques. Aucun paquet d’exécution, compte, service distant ou clé API n’est nécessaire.

Pour choisir un autre port :

```sh
npm run dev -- --port 8080
```

Le site est entièrement statique : `index.html` et `assets/` peuvent aussi être hébergés sur un serveur statique, y compris dans un sous-dossier. Les liens internes utilisent des fragments `#/…` ; aucune réécriture de routes côté hébergeur n’est nécessaire. Les polices et illustrations sont locales, sans CDN.

## Les 12 aventures

| Mathématiques                                                         | Français                                                       |
| --------------------------------------------------------------------- | -------------------------------------------------------------- |
| Les nombres malins : comparer, ranger, trouver un nombre              | Les mots à la loupe : lire et comprendre des indices           |
| Le secret des dizaines : unités, dizaines, regroupements et centaines | L’atelier des sons : écouter, distinguer des sons et des rimes |
| Le labo du calcul : additions, soustractions, nombres manquants       | Les phrases en chantier : remettre les mots dans l’ordre       |
| À toi de résoudre ! : problèmes d’une ou plusieurs étapes             | Les mots à l’oreille : dictées de mots                         |
| La piste des suites : suites croissantes, décroissantes et alternées  | Les petits détectives : compréhension et déductions            |
| Géométrie en vadrouille : formes, propriétés et premiers périmètres   | Les mots font équipe : pluriels, accords et verbes             |

- **Trois niveaux par activité**, toujours ouverts : _Je découvre_, _Je progresse_, _Je me dépasse_.
- **Cinq questions par séance**, sans chronomètre ni classement.
- Le **compteur de questions restantes** et la barre de progression se mettent à jour dès qu’une question est terminée (bonne réponse validée ou correction demandée), sans attendre le clic sur _La suite !_ et sans double décompte. Les erreurs, indices et écoutes ne consomment pas de question.
- **153 questions rédigées** pour le français et la géométrie, plus des questions de maths générées avec des valeurs renouvelées.
- Questions sans doublon dans une séance ; les questions non vues lors de la dernière séance du même niveau sont privilégiées.
- Indices facultatifs, nouveaux essais et corrections expliquées. Après deux erreurs, l’enfant peut demander à comprendre la réponse plutôt que rester bloquée.
- Les lettres accentuées sont disponibles pour les dictées. La correction accepte la casse et les espaces de bord, mais vérifie les accents et explique une erreur d’accent.
- Une **étoile par séance terminée**, quel que soit le nombre d’indices ou d’essais.

### Proposition de difficulté

À la fin d’une séance, une réussite au premier essai sans indice ni réponse affichée est comptée comme une réussite « sans aide ».

- 4 ou 5 réussites sur 5 : proposer le niveau suivant, sans dépasser le niveau 3.
- 0 ou 1 réussite sur 5 : proposer le niveau précédent, sans descendre sous le niveau 1.
- 2 ou 3 réussites : proposer une nouvelle série au même niveau.

Cette proposition reste facultative et propre à chaque activité. **Écouter une consigne, un mot à dicter ou un choix dans l’atelier des sons ne pénalise pas la réussite.** Une lecture par un adulte en remplacement de la voix n’est pas un indice. Ce fonctionnement est un repère ludique, pas une évaluation scolaire ou un diagnostic.

## Voix et sons

La lecture s’appuie sur l’API **Web Speech Synthesis** du navigateur ; les encouragements sonores sont de courts sons produits par **Web Audio**.

- La voix ne démarre **jamais automatiquement** : cliquer sur _Écouter_, _Écouter le mot_ ou _Écouter l’histoire_.
- Le bouton d’arrêt apparaît dans l’en-tête pendant la lecture. Une navigation ou le passage de la page en arrière-plan arrête la voix.
- Le bouton de son coupe la voix **et** les effets. Les effets peuvent aussi être désactivés séparément.
- Dans **Espace parent**, choisir une voix française installée, un débit de lecture et tester la voix.
- Les voix françaises sont filtrées par langue. La disponibilité, la prononciation et le besoin éventuel d’une connexion dépendent du navigateur et du système. Le site ne prétend pas fournir des enregistrements vocaux intégrés.
- En cas d’absence de synthèse, d’absence de voix française ou d’erreur de lecture, un message explique le problème. Les consignes restent affichées.
- Pour une dictée sans voix disponible, ouvrir **Aide d’un adulte**, puis **Afficher le mot à dicter**. L’adulte peut lire le mot sans montrer l’écran à l’enfant, puis le masquer. Le mot n’est pas affiché dans la consigne ordinaire.
- Aucun accès au microphone et aucune reconnaissance vocale ne sont utilisés.

Certaines voix système utilisent un service de synthèse en ligne pour lire le texte de la consigne. Aucune voix n’est enregistrée par ce site ; aucun texte saisi par l’enfant n’est transmis à la synthèse.

## Carnet et confidentialité

La clé locale `les-petits-curieux.v1` conserve les réglages audio et les **200 dernières séances terminées**, avec leur activité, niveau, date, nombre de réussites sans aide, indices et identifiants des questions. Aucun prénom, réponse saisie ou enregistrement audio n’est conservé.

- Les progrès restent dans ce navigateur, sans synchronisation entre appareils, sans compte et sans outils d’analyse d’audience.
- Une séance en cours peut être reprise depuis l’accueil tant que la page reste ouverte. **Une actualisation ferme la séance non terminée** ; seules les séances terminées sont enregistrées.
- En cas de stockage bloqué, corrompu ou plein, les exercices restent utilisables. Les progrès restent en mémoire pour la visite si la sauvegarde est impossible ; un message le signale.
- **Effacer le carnet** demande confirmation et conserve les réglages audio.

## Structure

```text
index.html                     Page et points de montage
assets/
  styles.css                   Interface responsive, focus, contraste, mouvements réduits
  favicon.svg
  fonts/                       Polices Outfit et Nunito Sans + licences SIL OFL
  illustrations/               Illustrations SVG locales
  js/
    questions.js               Activités, questions et générateurs
    engine.js                  Correction, séries, recommandations et sauvegarde validée
    audio.js                   Voix françaises et effets sonores
    app.js                     Navigation et interactions
scripts/serve.mjs              Petit serveur statique de développement
tests/                         Tests unitaires et parcours navigateur
```

Les scripts utilisent un format compatible avec les scripts classiques du navigateur et avec les tests Node.js. Il n’y a ni compilation de l’application ni dépendance JavaScript distante dans le navigateur.

## Vérifications

### Tests unitaires

```sh
npm test
```

Ils vérifient notamment les 36 combinaisons activité/niveau, **7 500 questions de maths générées**, les accents, les séries sans doublon, les recommandations, la sauvegarde et les erreurs de synthèse vocale. Ils ne nécessitent aucune dépendance de test externe.

### Parcours dans Chromium

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

Le serveur est lancé automatiquement si nécessaire. Les tests couvrent les parcours maths/français, les trois niveaux, la correction, les mots à déplacer au clavier, la persistance, la confirmation d’effacement, le mode silencieux, les réglages audio, le repli sans synthèse, le mobile et les vérifications automatisées d’accessibilité avec axe.

Pour un environnement qui fournit déjà Chromium, utiliser `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Des arguments de lancement supplémentaires peuvent être passés dans `PLAYWRIGHT_CHROMIUM_ARGS` sous forme de tableau JSON. Aucune configuration propre au bac à sable n’est nécessaire au fonctionnement du site.

Les tests de voix utilisent un moteur simulé pour vérifier les interactions. **La qualité et la disponibilité réelles des voix doivent être essayées à l’oreille sur l’appareil de l’enfant** via le bouton _Essayer la voix_.

Les captures, rapports, dépendances et traces de test sont ignorés par Git.
