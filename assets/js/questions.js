(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CurieuxQuestions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const levels = ['Je découvre', 'Je progresse', 'Je me dépasse'];
  const subjects = {
    maths: {
      title: 'Le monde des nombres',
      short: 'Mathématiques',
      description:
        'Des nombres à apprivoiser, des énigmes à résoudre et plein de façons de réfléchir.',
      icon: 'shapes',
      color: 'green'
    },
    francais: {
      title: 'La fabrique des mots',
      short: 'Français',
      description: 'Des sons, des mots et des histoires. À toi de jouer avec la langue !',
      icon: 'book',
      color: 'purple'
    }
  };
  const missions = [
    {
      id: 'm-nombres',
      subject: 'maths',
      title: 'Les nombres malins',
      description: 'Compare, range et trouve les nombres cachés.',
      icon: 'numbers',
      defaultLevel: 2,
      tags: 'Nombres · Comparaison',
      details: [
        'Se repérer jusqu’à 50.',
        'Comparer et ranger jusqu’à 100.',
        'Explorer les nombres jusqu’à 500.'
      ]
    },
    {
      id: 'm-dizaines',
      subject: 'maths',
      title: 'Le secret des dizaines',
      description: 'Construis de grands nombres avec de petites briques.',
      icon: 'blocks',
      defaultLevel: 1,
      tags: 'Dizaines · Unités',
      details: [
        'Construire des nombres avec des barres et des points.',
        'Distinguer les dizaines et les unités jusqu’à 99.',
        'Regrouper les unités et découvrir les centaines.'
      ]
    },
    {
      id: 'm-calcul',
      subject: 'maths',
      title: 'Le labo du calcul',
      description: 'Ajoute, enlève et découvre tes propres astuces.',
      icon: 'calculator',
      defaultLevel: 1,
      tags: 'Addition · Soustraction',
      details: [
        'Additionner et soustraire jusqu’à 20.',
        'Calculer jusqu’à 70 et chercher un nombre manquant.',
        'Calculer jusqu’à 100, même avec un nombre caché.'
      ]
    },
    {
      id: 'm-problemes',
      subject: 'maths',
      title: 'À toi de résoudre !',
      description: 'De petites histoires pour de grandes réflexions.',
      icon: 'map',
      defaultLevel: 1,
      tags: 'Problèmes · Raisonnement',
      details: [
        'Résoudre un problème en une étape.',
        'Relier deux étapes dans une petite histoire.',
        'Raisonner avec des groupes et plusieurs étapes.'
      ]
    },
    {
      id: 'm-logique',
      subject: 'maths',
      title: 'La piste des suites',
      description: 'Repère la règle et trouve ce qui vient après.',
      icon: 'puzzle',
      defaultLevel: 2,
      tags: 'Suites · Logique',
      details: [
        'Avancer de 2 en 2 ou de 5 en 5.',
        'Avancer, reculer et changer de pas.',
        'Découvrir des suites qui alternent deux règles.'
      ]
    },
    {
      id: 'm-formes',
      subject: 'maths',
      title: 'Géométrie en vadrouille',
      description: 'Observe les formes et découvre leurs secrets.',
      icon: 'shapes',
      defaultLevel: 1,
      tags: 'Formes · Géométrie',
      details: [
        'Reconnaître les formes et compter leurs sommets.',
        'Observer les côtés et les propriétés des formes.',
        'Raisonner sur les contours et les formes.'
      ]
    },
    {
      id: 'f-mots',
      subject: 'francais',
      title: 'Les mots à la loupe',
      description: 'Lis les indices et trouve le mot qui va bien.',
      icon: 'search',
      defaultLevel: 1,
      tags: 'Lecture · Vocabulaire',
      details: [
        'Lire des mots familiers et comprendre un indice.',
        'Reconnaître des mots plus longs et plus précis.',
        'Distinguer des mots proches dans une phrase.'
      ]
    },
    {
      id: 'f-sons',
      subject: 'francais',
      title: 'L’atelier des sons',
      description: 'Tends l’oreille : les mots ont des points communs.',
      icon: 'headphones',
      defaultLevel: 1,
      tags: 'Écoute · Sons',
      details: [
        'Repérer les sons ou, ch, on et an.',
        'Explorer les sons oi, in, eu et o.',
        'Écouter finement les sons gn, ill et les rimes.'
      ]
    },
    {
      id: 'f-phrases',
      subject: 'francais',
      title: 'Les phrases en chantier',
      description: 'Remets les mots en ordre pour construire une phrase.',
      icon: 'tiles',
      defaultLevel: 1,
      tags: 'Lecture · Phrases',
      details: [
        'Construire des phrases de 3 à 5 mots.',
        'Organiser des phrases un peu plus longues.',
        'Construire des phrases complexes et des négations.'
      ]
    },
    {
      id: 'f-dictee',
      subject: 'francais',
      title: 'Les mots à l’oreille',
      description: 'Écoute un mot, puis essaie de l’écrire.',
      icon: 'pencil',
      defaultLevel: 1,
      tags: 'Dictée · Orthographe',
      details: [
        'Écrire de petits mots familiers.',
        'Écrire des mots avec plusieurs sons complexes.',
        'Relever des défis d’orthographe plus longs.'
      ]
    },
    {
      id: 'f-histoires',
      subject: 'francais',
      title: 'Les petits détectives',
      description: 'Écoute une histoire et lis entre les lignes.',
      icon: 'compass',
      defaultLevel: 2,
      tags: 'Compréhension · Déduction',
      details: [
        'Comprendre une courte histoire, lue ou écoutée.',
        'Déduire ce qui n’est pas dit directement.',
        'Relier des indices et comprendre les personnages.'
      ]
    },
    {
      id: 'f-accords',
      subject: 'francais',
      title: 'Les mots font équipe',
      description: 'Choisis les mots qui s’accordent dans la phrase.',
      icon: 'link',
      defaultLevel: 1,
      tags: 'Singulier · Pluriel · Accords',
      details: [
        'Repérer un ou plusieurs objets.',
        'Accorder les adjectifs avec les noms.',
        'Choisir la forme du verbe qui convient.'
      ]
    }
  ];

  const banks = {};
  function addChoices(id, level, rows) {
    banks[`${id}:${level}`] = rows.map((row, i) => {
      const [prompt, answer, distractors, hint, explanation, extra = {}] = row;
      return {
        id: `${id}-${level}-${i + 1}`,
        type: 'choice',
        prompt,
        answer: String(answer),
        options: [String(answer), ...distractors.map(String)],
        hint,
        explanation,
        ...extra
      };
    });
  }

  addChoices('f-mots', 1, [
    [
      'Il miaule et aime se blottir. Quel est ce mot ?',
      'chat',
      ['chien', 'lapin'],
      'Lis bien la fin de chaque mot.',
      'Le chat est l’animal qui miaule.'
    ],
    [
      'On y dort la nuit. Quel est ce mot ?',
      'lit',
      ['lac', 'loup'],
      'Le mot recherché a trois lettres.',
      'On dort dans un lit.'
    ],
    [
      'Elle brille dans le ciel la nuit. Quel est ce mot ?',
      'lune',
      ['rue', 'roue'],
      'Son nom commence par la lettre l.',
      'La lune est visible dans le ciel la nuit, et parfois le jour.'
    ],
    [
      'On le lit et on tourne ses pages. Quel est ce mot ?',
      'livre',
      ['lièvre', 'lit'],
      'Attention : un des mots est le nom d’un animal.',
      'Un livre contient des pages que l’on peut lire.'
    ],
    [
      'Il vit dans l’eau et a des nageoires. Quel est ce mot ?',
      'poisson',
      ['poussin', 'pomme'],
      'Regarde bien les lettres au milieu du mot.',
      'Un poisson nage avec ses nageoires.'
    ],
    [
      'On la mange. Elle peut être rouge ou verte. Quel est ce fruit ?',
      'pomme',
      ['porte', 'plume'],
      'Le mot contient deux m.',
      'Une pomme est un fruit.'
    ],
    [
      'Il a deux roues et des pédales. Quel est ce mot ?',
      'vélo',
      ['vent', 'verre'],
      'Son nom commence par vé.',
      'On fait avancer un vélo en pédalant.'
    ],
    [
      'Elle pousse dans le jardin et a des pétales. Quel est ce mot ?',
      'fleur',
      ['four', 'feu'],
      'Écoute le début : fl.',
      'Une fleur a des pétales.'
    ]
  ]);
  addChoices('f-mots', 2, [
    [
      'Où peut-on emprunter des livres ?',
      'bibliothèque',
      ['boulangerie', 'piscine'],
      'Emprunter, c’est prendre pour rendre plus tard.',
      'La bibliothèque prête des livres.'
    ],
    [
      'Quel objet protège de la pluie ?',
      'parapluie',
      ['parasol', 'panier'],
      'Regarde le mot pluie caché dans la réponse.',
      'Un parapluie protège de la pluie. Un parasol protège du soleil.'
    ],
    [
      'Quel animal porte sa maison sur son dos ?',
      'escargot',
      ['écureuil', 'éléphant'],
      'Sa maison est une coquille.',
      'La coquille de l’escargot le protège.'
    ],
    [
      'Quel objet permet d’observer les étoiles de plus près ?',
      'télescope',
      ['téléphone', 'thermomètre'],
      'On regarde dedans avec un œil.',
      'Un télescope sert à observer les objets lointains dans le ciel.'
    ],
    [
      'Quelle partie de l’arbre est généralement sous la terre ?',
      'racine',
      ['branche', 'feuille'],
      'Elle permet à l’arbre de prendre de l’eau.',
      'Les racines fixent l’arbre au sol et absorbent l’eau.'
    ],
    [
      'Quel mot signifie le contraire de minuscule ?',
      'immense',
      ['rapide', 'silencieux'],
      'Cherche un mot qui parle de la taille.',
      'Minuscule signifie très petit ; immense signifie très grand.'
    ],
    [
      'Où prépare-t-on le pain ?',
      'boulangerie',
      ['bijouterie', 'librairie'],
      'Le métier correspondant est boulanger ou boulangère.',
      'Le pain est préparé dans une boulangerie.'
    ],
    [
      'Quel objet mesure la température ?',
      'thermomètre',
      ['télescope', 'chronomètre'],
      'La température indique s’il fait chaud ou froid.',
      'Un thermomètre mesure la température.'
    ]
  ]);
  addChoices('f-mots', 3, [
    [
      'Choisis le mot : « Le … éclaire le jardin. »',
      'soleil',
      ['sommeil', 'souvenir'],
      'Un mot peut ressembler à un autre sans avoir le même sens.',
      'Le soleil éclaire le jardin. Le sommeil, c’est quand on dort.'
    ],
    [
      'Choisis le mot : « Le bateau entre dans le … »',
      'port',
      ['porc', 'pot'],
      'Le mot finit par une lettre que l’on n’entend pas.',
      'Un port accueille des bateaux. Le porc est un animal.'
    ],
    [
      'Choisis le mot : « Elle colle un timbre sur l’… »',
      'enveloppe',
      ['écharpe', 'escalier'],
      'C’est ce qui contient la lettre.',
      'On colle le timbre sur l’enveloppe avant d’envoyer la lettre.'
    ],
    [
      'Quel mot désigne quelqu’un qui cherche à comprendre ?',
      'curieux',
      ['furieux', 'frileux'],
      'Il pose beaucoup de questions.',
      'Être curieux, c’est avoir envie de découvrir et de comprendre.'
    ],
    [
      'Choisis le mot : « La … du vélo est à plat. »',
      'roue',
      ['rue', 'rouille'],
      'C’est une partie ronde du vélo.',
      'La roue porte le pneu du vélo.'
    ],
    [
      'Quel mot a le sens le plus proche de « observer » ?',
      'examiner',
      ['oublier', 'cacher'],
      'Observer, c’est regarder avec attention.',
      'Examiner et observer veulent tous deux dire regarder attentivement.'
    ],
    [
      'Choisis le mot : « Pour traverser la rivière, nous passons sur le … »',
      'pont',
      ['point', 'poing'],
      'Ce mot contient le son que l’on entend dans rond.',
      'Un pont permet de franchir une rivière.'
    ],
    [
      'Quel mot désigne une petite pousse qui deviendra une plante ?',
      'plantule',
      ['planète', 'plafond'],
      'Cherche le mot plante dans la réponse.',
      'Une plantule est une très jeune plante.'
    ]
  ]);

  addChoices('f-sons', 1, [
    [
      'Quel mot contient le son « ou », comme dans « roue » ?',
      'poule',
      ['pile', 'pâle'],
      'Écoute les mots avec les petits haut-parleurs.',
      'Dans roue et poule, on entend le même son « ou ».'
    ],
    [
      'Quel mot commence par le même son que « chat » ?',
      'chou',
      ['seau', 'joue'],
      'Écoute bien le tout début des mots.',
      'Chat et chou commencent tous deux par le son « ch ».'
    ],
    [
      'Quel mot contient le son « on », comme dans « pont » ?',
      'mouton',
      ['moto', 'matin'],
      'Le son peut se trouver à la fin du mot.',
      'On entend « on » à la fin de mouton et de pont.'
    ],
    [
      'Quel mot contient le son « an », comme dans « banc » ?',
      'maman',
      ['mamie', 'moto'],
      'Écoute la deuxième partie de maman.',
      'Maman et banc contiennent le même son « an ».'
    ],
    [
      'Quel mot commence par le même son que « lapin » ?',
      'lune',
      ['rue', 'mur'],
      'Écoute le premier son, pas la première syllabe entière.',
      'Lapin et lune commencent par le son de la lettre l.'
    ],
    [
      'Quel mot rime avec « moto » ?',
      'vélo',
      ['tapis', 'lapin'],
      'Deux mots riment quand leur fin sonne de la même façon.',
      'Moto et vélo se terminent tous deux par le son « o ».'
    ],
    [
      'Quel mot contient le son « ou », comme dans « loup » ?',
      'soupe',
      ['jupe', 'sac'],
      'Écoute bien : ou et u sont deux sons différents.',
      'Loup et soupe contiennent le son « ou ».'
    ],
    [
      'Quel mot commence par le même son que « four » ?',
      'fée',
      ['vélo', 'poule'],
      'Écoute le son au tout début.',
      'Four et fée commencent par le son de la lettre f.'
    ]
  ]);
  addChoices('f-sons', 2, [
    [
      'Quel mot contient le son « oi », comme dans « roi » ?',
      'poire',
      ['poule', 'porte'],
      'Écoute chaque mot lentement.',
      'Roi et poire contiennent le même son « oi ».'
    ],
    [
      'Quel mot contient le son « in », comme dans « lapin » ?',
      'jardin',
      ['joli', 'jouet'],
      'Le son recherché se trouve à la fin du mot.',
      'Lapin et jardin se terminent par le son « in ».'
    ],
    [
      'Quel mot rime avec « feu » ?',
      'jeu',
      ['joue', 'chat'],
      'Écoute surtout la dernière partie du mot.',
      'Feu et jeu se terminent par le même son.'
    ],
    [
      'Quel mot contient le même son « o » que « bateau » ?',
      'chapeau',
      ['chemin', 'chou'],
      'Un même son peut s’écrire avec plusieurs lettres.',
      'Le son « o » s’écrit eau dans bateau et chapeau.'
    ],
    [
      'Quel mot commence par le même son que « girafe » ?',
      'jouet',
      ['gâteau', 'carotte'],
      'Écoute le son : ne te fie pas seulement à la première lettre.',
      'Le g de girafe fait le même son que le j de jouet.'
    ],
    [
      'Quel mot contient le même son « an » que « maman » ?',
      'dent',
      ['dos', 'dé'],
      'Le son « an » peut aussi s’écrire en.',
      'On entend le même son dans maman et dent, malgré une écriture différente.'
    ],
    [
      'Quel mot rime avec « panier » ?',
      'papier',
      ['piano', 'panda'],
      'Écoute la fin : ier.',
      'Panier et papier se terminent par le même son.'
    ],
    [
      'Quel mot commence par le même son que « cerise » ?',
      'soleil',
      ['cabane', 'girafe'],
      'La lettre c peut faire des sons différents.',
      'Le c de cerise fait le même son que le s de soleil.'
    ]
  ]);
  addChoices('f-sons', 3, [
    [
      'Quel mot contient le même son « gn » que « montagne » ?',
      'champignon',
      ['camion', 'chapeau'],
      'Écoute le milieu du mot.',
      'On entend le même son écrit gn dans montagne et champignon.'
    ],
    [
      'Quel mot rime avec « fille » ?',
      'bille',
      ['ville', 'fil'],
      'Attention : les mêmes lettres ne font pas toujours les mêmes sons.',
      'Fille et bille riment. Dans ville, on n’entend pas le même son final.'
    ],
    [
      'Quel mot commence par le même son que « guitare » ?',
      'gâteau',
      ['girafe', 'géant'],
      'Compare les sons, pas seulement les lettres.',
      'Dans guitare et gâteau, le g fait le même son. Dans girafe et géant, il change.'
    ],
    [
      'Quel mot contient le son « s », comme dans « soleil » ?',
      'poisson',
      ['poison', 'maison'],
      'Écoute la différence entre s et z.',
      'Les deux s de poisson font le son « s ». Dans poison et maison, on entend « z ».'
    ],
    [
      'Quel mot rime avec « grenouille » ?',
      'citrouille',
      ['grenier', 'roule'],
      'Écoute la fin du mot : ouille.',
      'Grenouille et citrouille se terminent par les mêmes sons.'
    ],
    [
      'Quel mot commence par le même son que « phare » ?',
      'fourmi',
      ['papa', 'vélo'],
      'Deux lettres peuvent ensemble faire un seul son.',
      'Les lettres ph de phare font le son f, comme au début de fourmi.'
    ],
    [
      'Quel mot contient le même son « z » que « zèbre » ?',
      'maison',
      ['mousse', 'sac'],
      'Un s entre deux voyelles peut faire le son z.',
      'Dans maison, le s entre deux voyelles fait le son z.'
    ],
    [
      'Quel mot rime avec « abeille » ?',
      'soleil',
      ['ballon', 'arbre'],
      'Écoute la dernière partie des deux mots.',
      'Abeille et soleil se terminent par le même son.'
    ]
  ]);
  for (let level = 1; level <= 3; level++)
    banks[`f-sons:${level}`].forEach((q) => {
      q.choiceAudio = true;
    });

  const sentences = {
    1: [
      'Le chat dort.',
      'Mila lit un livre.',
      'Le lapin saute.',
      'La lune brille.',
      'Noé mange une pomme.',
      'Le soleil se lève.',
      'Le bébé sourit.'
    ],
    2: [
      'Le lapin mange une carotte.',
      'La lune brille dans le ciel.',
      'Mila range ses crayons rouges.',
      'Le chien court dans le jardin.',
      'Les oiseaux construisent un nid.',
      'La tortue avance très lentement.',
      'Noé arrose les fleurs du jardin.'
    ],
    3: [
      'Le chat ne veut pas sortir sous la pluie.',
      'Les enfants observent les étoiles avec un télescope.',
      'La grenouille saute pour attraper une mouche.',
      'Le vent fait tomber les feuilles des arbres.',
      'Mila ferme la fenêtre parce que le vent souffle.',
      'Les graines ont besoin d’eau pour pouvoir pousser.',
      'Noé met ses bottes pour marcher dans les flaques.'
    ]
  };
  for (const [level, list] of Object.entries(sentences)) {
    banks[`f-phrases:${level}`] = list.map((sentence, i) => ({
      id: `f-phrases-${level}-${i + 1}`,
      type: 'order',
      prompt: 'Remets les mots dans l’ordre pour construire une phrase.',
      answer: sentence,
      tokens: sentence.split(' '),
      hint: 'Commence par le mot avec une majuscule. Le mot avec le point vient à la fin.',
      explanation: `La phrase est : « ${sentence} »`
    }));
  }

  const dictations = {
    1: [
      ['moto', 'La moto roule.'],
      ['lune', 'La lune brille.'],
      ['vélo', 'Je roule à vélo.'],
      ['papa', 'Papa lit un livre.'],
      ['salade', 'La salade est verte.'],
      ['tomate', 'La tomate est rouge.'],
      ['domino', 'Je pose un domino.'],
      ['pirate', 'Le pirate regarde la mer.']
    ],
    2: [
      ['lapin', 'Le lapin mange une carotte.'],
      ['jardin', 'Les fleurs poussent dans le jardin.'],
      ['mouton', 'Le mouton a de la laine.'],
      ['bateau', 'Le bateau flotte sur la mer.'],
      ['soleil', 'Le soleil brille.'],
      ['maison', 'Je rentre dans la maison.'],
      ['chemin', 'Nous suivons le chemin.'],
      ['chapeau', 'Je porte un chapeau.']
    ],
    3: [
      ['grenouille', 'La grenouille saute dans la mare.'],
      ['papillon', 'Le papillon se pose sur une fleur.'],
      ['chocolat', 'Je mange un morceau de chocolat.'],
      ['montagne', 'Nous marchons dans la montagne.'],
      ['escargot', 'L’escargot avance lentement.'],
      ['bibliothèque', 'J’emprunte un livre à la bibliothèque.'],
      ['champignon', 'Un champignon pousse sous l’arbre.'],
      ['citrouille', 'La citrouille pousse au potager.']
    ]
  };
  for (const [level, list] of Object.entries(dictations)) {
    banks[`f-dictee:${level}`] = list.map(([word, context], i) => ({
      id: `f-dictee-${level}-${i + 1}`,
      type: 'dictation',
      prompt: 'Écoute le mot, puis écris-le.',
      answer: word,
      context,
      speech: `Le mot à écrire est : ${word}. ${context} Le mot est : ${word}.`,
      hint: `Ce mot commence par « ${word[0]} » et contient ${word.length} lettres.`,
      explanation: `Le mot s’écrit « ${word} ». ${context}`
    }));
  }

  addChoices('f-histoires', 1, [
    [
      'Que va probablement faire Milo ?',
      'Dormir',
      ['Aller nager', 'Préparer un gâteau'],
      'Cherche ce que l’on fait avec un lit et une couverture.',
      'La lampe éteinte et la couverture indiquent que Milo se prépare à dormir.',
      { story: 'Milo ferme son livre. Il éteint la lampe et se glisse sous la couverture.' }
    ],
    [
      'Où va probablement Lina ?',
      'À la piscine',
      ['À la montagne', 'À la bibliothèque'],
      'À quoi servent un maillot et des lunettes de natation ?',
      'Le maillot et les lunettes de natation sont des indices : Lina va nager.',
      {
        story:
          'Lina met son maillot et ses lunettes de natation dans son sac. Elle n’oublie pas sa serviette.'
      }
    ],
    [
      'Quel temps fait-il probablement ?',
      'Il pleut',
      ['Il neige', 'Il fait très chaud'],
      'Observe ce que choisit Sami pour se protéger.',
      'Le parapluie et les flaques nous indiquent qu’il pleut.',
      { story: 'Sami ouvre son parapluie. Dans la rue, il évite les flaques.' }
    ],
    [
      'Pourquoi Noé ouvre-t-il la fenêtre ?',
      'Il a trop chaud',
      ['Il cherche ses chaussures', 'Il veut dormir'],
      'Relis la première phrase.',
      'Noé dit qu’il a chaud : il ouvre la fenêtre pour faire entrer de l’air.',
      { story: '« Il fait chaud ici ! » dit Noé. Il ouvre la fenêtre et enlève son pull.' }
    ],
    [
      'Que prépare probablement Alma ?',
      'Un gâteau',
      ['Une cabane', 'Une lettre'],
      'Les ingrédients donnent un indice.',
      'La farine, les œufs et le moule servent ici à préparer un gâteau.',
      { story: 'Alma mélange des œufs et de la farine. Elle verse la pâte dans un moule.' }
    ],
    [
      'Pourquoi le chat s’approche-t-il ?',
      'Pour manger',
      ['Pour lire', 'Pour se laver'],
      'Écoute ce qu’il y a dans la gamelle.',
      'Le chat vient manger les croquettes.',
      { story: 'Léa verse des croquettes dans la gamelle. Le chat arrive aussitôt en miaulant.' }
    ]
  ]);
  addChoices('f-histoires', 2, [
    [
      'Quelle saison est suggérée par ces indices ?',
      'L’automne',
      ['Le printemps', 'L’été'],
      'Pense aux feuilles qui changent de couleur et tombent.',
      'Les feuilles orange tombent et l’on ramasse des marrons : ces indices évoquent l’automne.',
      {
        story:
          'Zoé ramasse des marrons. Autour d’elle, les feuilles orange tombent des arbres. Elle resserre son écharpe.'
      }
    ],
    [
      'Que ressent probablement Adam ?',
      'De l’impatience joyeuse',
      ['De l’ennui', 'De la colère'],
      'Il sourit et attend quelque chose avec beaucoup d’envie.',
      'Adam a hâte de voir sa cousine : son sourire et ses allers-retours montrent son impatience joyeuse.',
      {
        story:
          'La cousine d’Adam arrive aujourd’hui. Il sourit, regarde l’horloge puis court à la fenêtre pour la troisième fois.'
      }
    ],
    [
      'Pourquoi Inès parle-t-elle tout doucement ?',
      'Pour ne pas réveiller le bébé',
      ['Parce qu’elle a perdu son livre', 'Pour faire tomber la pluie'],
      'Quelle personne dort dans la pièce ?',
      'Le bébé dort : Inès baisse la voix pour le laisser se reposer.',
      {
        story:
          'Dans son berceau, le bébé dort enfin. Inès entre sur la pointe des pieds et parle tout doucement.'
      }
    ],
    [
      'Pourquoi la plante allait-elle mal ?',
      'Elle manquait d’eau',
      ['Elle avait trop de fleurs', 'Elle était trop grande'],
      'Observe ce qui change après l’arrosage.',
      'La terre était sèche. Après l’arrosage, la plante se redresse : elle manquait d’eau.',
      {
        story:
          'La terre du pot est très sèche et les feuilles pendent. Maël arrose la plante. Plus tard, les feuilles se redressent.'
      }
    ],
    [
      'Qui a probablement laissé les traces ?',
      'Un chien',
      ['Un vélo', 'Un escargot'],
      'Relie les pattes mouillées aux traces.',
      'Le chien a les pattes mouillées et les traces ont leur forme : il a probablement traversé la cuisine.',
      {
        story:
          'Des traces de pattes traversent la cuisine. Le chien est près de la porte, les pattes encore mouillées.'
      }
    ],
    [
      'Que comprend-on à la fin ?',
      'Le vent a emporté le dessin',
      ['Le dessin a été mangé', 'Le dessin a été lavé'],
      'Quel événement précède la disparition du dessin ?',
      'La fenêtre ouverte et le coup de vent expliquent que le dessin s’envole.',
      {
        story:
          'Lila pose son dessin près de la fenêtre ouverte. Une rafale entre dans la pièce. La feuille tourbillonne dehors.'
      }
    ]
  ]);
  addChoices('f-histoires', 3, [
    [
      'De qui parle le mot « elle » dans la dernière phrase ?',
      'De Nora',
      ['De la chienne', 'De la voisine'],
      'Qui vient de recevoir le panier ?',
      'La voisine donne le panier à Nora. C’est donc Nora qui le pose sur la table.',
      {
        story:
          'La voisine tend un panier à Nora. La chienne regarde le panier avec curiosité. Nora remercie sa voisine. Puis elle pose le panier sur la table.'
      }
    ],
    [
      'Pourquoi Émile ne semble-t-il pas fâché ?',
      'Il comprend que c’était un accident',
      ['Il n’a pas vu ce qui est arrivé', 'Il voulait casser sa tour'],
      'Écoute ce qu’il propose après la chute.',
      'En proposant de reconstruire ensemble, Émile montre qu’il accepte l’accident.',
      {
        story:
          'En passant, Aya fait tomber la tour de cubes d’Émile. Elle s’excuse aussitôt. Émile sourit : « Ce n’est pas grave. On la reconstruit ensemble ? »'
      }
    ],
    [
      'Quelle action a dû avoir lieu avant le repas ?',
      'La pâte a cuit au four',
      ['Les assiettes ont été rangées', 'La farine a poussé dans le jardin'],
      'On ne mange pas habituellement une pâte à gâteau encore crue.',
      'Entre la préparation de la pâte et le gâteau prêt à manger, il a fallu le cuire.',
      {
        story:
          'Le matin, Sam mélange la pâte et la verse dans un moule. À midi, toute la famille partage un gâteau doré encore tiède.'
      }
    ],
    [
      'Pourquoi Jade prend-elle aussi une lampe ?',
      'Elle prévoit qu’il fera sombre au retour',
      ['Elle veut arroser les arbres', 'Elle veut peser son sac'],
      'La balade commence en fin de journée.',
      'Comme la balade commence tard, Jade prévoit que la nuit pourra tomber avant le retour.',
      {
        story:
          'La balade commence en fin d’après-midi. Jade prend de l’eau et un pull. Après avoir regardé l’heure du coucher du soleil, elle ajoute une lampe dans son sac.'
      }
    ],
    [
      'Comment le lecteur sait-il que le cadeau plaît à Lou ?',
      'Ses gestes montrent sa joie',
      ['Elle le dit directement', 'Elle quitte la pièce'],
      'Observe son sourire et ce qu’elle fait du livre.',
      'Lou ne le dit pas, mais son grand sourire et le livre serré contre elle montrent sa joie.',
      {
        story:
          'Lou ouvre le paquet sans un mot. En découvrant le livre qu’elle voulait, elle sourit jusqu’aux oreilles et le serre contre elle.'
      }
    ],
    [
      'Quelle conclusion est la mieux soutenue par les indices ?',
      'Quelqu’un est passé récemment',
      ['La maison est abandonnée depuis des années', 'Il n’y a jamais eu personne'],
      'La tasse est encore chaude : que nous apprend ce détail ?',
      'Une tasse encore chaude et un manteau mouillé suggèrent une présence récente, sans nous dire exactement qui est là.',
      {
        story:
          'Personne ne répond quand Malo entre. Pourtant, une tasse de tisane est encore chaude sur la table et un manteau mouillé pend à l’entrée.'
      }
    ]
  ]);

  addChoices('f-accords', 1, [
    [
      'Complète : « un chat → des … »',
      'chats',
      ['chat', 'chatte'],
      'Des annonce plusieurs animaux.',
      'Au pluriel, on ajoute généralement un s : des chats.'
    ],
    [
      'Complète : « une fleur → trois … »',
      'fleurs',
      ['fleur', 'fleuri'],
      'Trois signifie qu’il y en a plusieurs.',
      'Il y a plusieurs fleurs : on ajoute un s.'
    ],
    [
      'Complète : « Je vois deux … »',
      'lapins',
      ['lapin', 'lapine'],
      'Le mot deux indique le pluriel.',
      'Deux lapins : le nom lapin prend un s.'
    ],
    [
      'Complète : « … pomme »',
      'une',
      ['un', 'des'],
      'Pomme est un nom féminin au singulier.',
      'On dit une pomme.'
    ],
    [
      'Complète : « … livre »',
      'un',
      ['une', 'des'],
      'Livre est ici un nom masculin au singulier.',
      'On dit un livre.'
    ],
    [
      'Complète : « un bateau → des … »',
      'bateaux',
      ['bateau', 'bateaus'],
      'Les noms en eau prennent généralement un x au pluriel.',
      'On écrit un bateau, des bateaux.'
    ],
    [
      'Complète : « … arbres »',
      'des',
      ['un', 'une'],
      'Le s à la fin du nom est un indice.',
      'Arbres est au pluriel : on dit des arbres.'
    ],
    [
      'Complète : « une étoile → cinq … »',
      'étoiles',
      ['étoile', 'étoilé'],
      'Cinq indique qu’il y en a plusieurs.',
      'Au pluriel, étoile devient étoiles.'
    ]
  ]);
  addChoices('f-accords', 2, [
    [
      'Complète : « La fleur est … »',
      'jolie',
      ['joli', 'jolis'],
      'L’adjectif s’accorde avec la fleur.',
      'Fleur est féminin singulier : on écrit jolie.'
    ],
    [
      'Complète : « Les chats sont … »',
      'noirs',
      ['noir', 'noire'],
      'Il y a plusieurs chats.',
      'Chats est masculin pluriel : noirs prend un s.'
    ],
    [
      'Complète : « La tortue est … »',
      'lente',
      ['lent', 'lents'],
      'On dit une tortue.',
      'Tortue est féminin singulier : l’adjectif est lente.'
    ],
    [
      'Complète : « Les pommes sont … »',
      'rouges',
      ['rouge', 'rougi'],
      'Il y a plusieurs pommes.',
      'L’adjectif rouge prend un s quand il accompagne pommes au pluriel.'
    ],
    [
      'Complète : « Un … ballon »',
      'petit',
      ['petite', 'petits'],
      'Ballon est masculin singulier.',
      'On écrit un petit ballon.'
    ],
    [
      'Complète : « Deux … maisons »',
      'grandes',
      ['grande', 'grand'],
      'Maisons est féminin et pluriel.',
      'L’adjectif s’accorde au féminin pluriel : grandes.'
    ],
    [
      'Complète : « La fillette est … »',
      'curieuse',
      ['curieux', 'curieuses'],
      'Il s’agit d’une seule fillette.',
      'Au féminin singulier, curieux devient curieuse.'
    ],
    [
      'Complète : « Les livres sont … »',
      'ouverts',
      ['ouvert', 'ouverte'],
      'Livres est masculin pluriel.',
      'On écrit les livres sont ouverts, avec un s à ouverts.'
    ]
  ]);
  addChoices('f-accords', 3, [
    [
      'Complète : « Les enfants … dans la cour. »',
      'jouent',
      ['joue', 'joues'],
      'Remplace les enfants par ils.',
      'Avec ils ou les enfants, on écrit jouent. La terminaison ent ne se prononce pas.'
    ],
    [
      'Complète : « Tu … une histoire. »',
      'racontes',
      ['raconte', 'racontent'],
      'Avec tu, cherche la terminaison es.',
      'On écrit tu racontes, avec es.'
    ],
    [
      'Complète : « Nous … contents. »',
      'sommes',
      ['sont', 'êtes'],
      'Récite : je suis, tu es, il est, nous…',
      'Avec nous, le verbe être devient sommes.'
    ],
    [
      'Complète : « Les oiseaux … un nid. »',
      'ont',
      ['a', 'as'],
      'Remplace les oiseaux par ils.',
      'On écrit ils ont, donc les oiseaux ont un nid.'
    ],
    [
      'Complète : « La petite fille … les étoiles. »',
      'observe',
      ['observent', 'observes'],
      'Qui observe ? Une seule fille.',
      'Le sujet est la petite fille, au singulier : elle observe.'
    ],
    [
      'Complète : « Vous … une question. »',
      'posez',
      ['posons', 'posent'],
      'Avec vous, cherche la terminaison ez.',
      'On écrit vous posez, avec ez.'
    ],
    [
      'Complète : « Mon frère et ma sœur … ensemble. »',
      'dessinent',
      ['dessine', 'dessines'],
      'Deux personnes font l’action : remplace-les par ils.',
      'Mon frère et ma sœur forment un sujet pluriel : ils dessinent.'
    ],
    [
      'Complète : « J’… un nouveau livre. »',
      'ai',
      ['as', 'a'],
      'Il s’agit du verbe avoir avec je.',
      'On écrit j’ai un livre.'
    ]
  ]);

  addChoices('m-formes', 1, [
    [
      'Comment s’appelle cette forme à 3 côtés ?',
      'Un triangle',
      ['Un carré', 'Un cercle'],
      'Compte les côtés droits.',
      'Un triangle possède 3 côtés et 3 sommets.',
      { visual: { shape: 'triangle' } }
    ],
    [
      'Cette forme n’a aucun sommet. Comment s’appelle-t-elle ?',
      'Un cercle',
      ['Un triangle', 'Un carré'],
      'Un sommet est un coin où deux côtés se rencontrent.',
      'Un cercle n’a pas de sommet.',
      { visual: { shape: 'circle' } }
    ],
    [
      'Cette forme a 4 côtés égaux et 4 angles droits. Quel est son nom le plus précis ?',
      'Un carré',
      ['Un triangle', 'Un cercle'],
      'Ses quatre côtés ont la même longueur.',
      'Un carré possède 4 côtés égaux et 4 angles droits.',
      { visual: { shape: 'square' } }
    ],
    [
      'Combien de sommets a ce triangle ?',
      '3',
      ['2', '4'],
      'Un sommet est un coin de la forme.',
      'Le triangle possède 3 sommets.',
      { visual: { shape: 'triangle' } }
    ],
    [
      'Combien de côtés possède ce carré ?',
      '4',
      ['3', '5'],
      'Fais le tour de la forme avec ton doigt.',
      'Un carré a 4 côtés.',
      { visual: { shape: 'square' } }
    ],
    [
      'Cette forme a 4 angles droits, deux côtés longs et deux côtés courts. Comment s’appelle-t-elle ?',
      'Un rectangle',
      ['Un triangle', 'Un cercle'],
      'Les côtés opposés ont la même longueur.',
      'Ce rectangle possède 4 angles droits et ses côtés opposés sont égaux.',
      { visual: { shape: 'rectangle' } }
    ]
  ]);
  addChoices('m-formes', 2, [
    [
      'Une forme à 5 côtés s’appelle…',
      'Un pentagone',
      ['Un hexagone', 'Un triangle'],
      'Compte les côtés en suivant le contour.',
      'Un pentagone possède 5 côtés et 5 sommets.',
      { visual: { shape: 'pentagon' } }
    ],
    [
      'Combien de sommets possède cet hexagone ?',
      '6',
      ['5', '8'],
      'Compte les coins sans en oublier.',
      'Un hexagone a 6 côtés et 6 sommets.',
      { visual: { shape: 'hexagon' } }
    ],
    [
      'Si on tourne un carré sur sa pointe, quelle forme obtient-on ?',
      'Toujours un carré',
      ['Un triangle', 'Un cercle'],
      'Tourner une forme ne change ni ses côtés ni ses angles.',
      'Un carré reste un carré quand on le tourne.',
      { visual: { shape: 'diamond-square' } }
    ],
    [
      'Quelle propriété est vraie pour tous les rectangles ?',
      'Ils ont 4 angles droits',
      ['Ils ont 3 côtés', 'Ils ont toujours 4 côtés égaux'],
      'Un carré est un rectangle particulier, mais tous les rectangles ne sont pas carrés.',
      'Tous les rectangles ont 4 angles droits. Leurs côtés ne sont pas forcément tous égaux.',
      { visual: { shape: 'rectangle' } }
    ],
    [
      'Quelle forme n’a aucun côté droit ?',
      'Le cercle',
      ['Le carré', 'Le triangle'],
      'Pense au contour de chaque forme.',
      'Le contour d’un cercle est courbe, sans côté droit.'
    ],
    [
      'Je suis un polygone à 3 sommets. Qui suis-je ?',
      'Un triangle',
      ['Un pentagone', 'Un carré'],
      'Dans un polygone, il y a autant de sommets que de côtés.',
      'Un polygone à 3 sommets a 3 côtés : c’est un triangle.'
    ]
  ]);
  addChoices('m-formes', 3, [
    [
      'Un carré a des côtés de 3 cm. Quelle est la longueur totale de son contour ?',
      '12 cm',
      ['6 cm', '9 cm'],
      'Additionne les longueurs de ses quatre côtés.',
      '3 + 3 + 3 + 3 = 12. Le contour du carré mesure 12 cm.',
      { visual: { shape: 'square' } }
    ],
    [
      'Un rectangle mesure 4 cm de long et 2 cm de large. Quel est son périmètre ?',
      '12 cm',
      ['6 cm', '8 cm'],
      'Le périmètre est la longueur de tout le contour, soit quatre côtés.',
      '4 + 2 + 4 + 2 = 12. Son périmètre est de 12 cm.',
      { visual: { shape: 'rectangle' } }
    ],
    [
      'Quel énoncé est vrai ?',
      'Tous les carrés sont des rectangles',
      ['Tous les rectangles sont des carrés', 'Un carré a 3 côtés'],
      'Un rectangle possède 4 angles droits. Est-ce aussi vrai pour un carré ?',
      'Un carré a 4 angles droits : c’est un rectangle particulier, dont les quatre côtés sont égaux.'
    ],
    [
      'Un triangle a des côtés de 3 cm, 4 cm et 5 cm. Quel est son périmètre ?',
      '12 cm',
      ['9 cm', '15 cm'],
      'Additionne les trois longueurs.',
      '3 + 4 + 5 = 12. Son périmètre est de 12 cm.',
      { visual: { shape: 'triangle' } }
    ],
    [
      'On coupe un carré le long d’une diagonale, d’un coin au coin opposé. Qu’obtient-on ?',
      'Deux triangles',
      ['Deux cercles', 'Trois carrés'],
      'Imagine le trait qui relie deux sommets opposés.',
      'Chaque morceau possède trois côtés : on obtient deux triangles.',
      { visual: { shape: 'diagonal-square' } }
    ],
    [
      'Un hexagone a 6 côtés de 2 cm chacun. Quel est son périmètre ?',
      '12 cm',
      ['8 cm', '10 cm'],
      'Additionne six fois 2.',
      '2 + 2 + 2 + 2 + 2 + 2 = 12. Son périmètre est de 12 cm.',
      { visual: { shape: 'hexagon' } }
    ]
  ]);

  function integer(min, max, rng) {
    return min + Math.floor(rng() * (max - min + 1));
  }
  function take(items, rng) {
    return items[integer(0, items.length - 1, rng)];
  }
  function generated(id, level, data) {
    return {
      id: `${id}-${level}-${data.key}`,
      type: 'number',
      ...data,
      answer: String(data.answer)
    };
  }
  function generate(id, level, rng = Math.random) {
    if (id === 'm-nombres') {
      const max = [50, 100, 500][level - 1];
      const kind = integer(0, level === 1 ? 2 : 4, rng);
      const n = integer(2, max - 1, rng);
      if (kind === 0 || kind === 4) {
        const values = [n];
        // Bounded, deterministic generation also works with a constant test RNG.
        for (let i = 0; values.length < (kind === 4 ? 4 : 3); i++) {
          const value = ((n + integer(3, 29, rng) * (i + 1)) % max) + 1;
          if (!values.includes(value)) values.push(value);
          if (i > 30) {
            for (let v = 1; values.length < 4; v++) if (!values.includes(v)) values.push(v);
          }
        }
        if (kind === 4) {
          const sorted = [...values].sort((a, b) => a - b).map(String);
          return generated(id, level, {
            key: `order-${values.join('-')}`,
            type: 'order',
            orderKind: 'numbers',
            prompt: 'Range les nombres du plus petit au plus grand.',
            tokens: sorted,
            answer: sorted.join(' '),
            hint: 'Compare d’abord les centaines, puis les dizaines, puis les unités.',
            explanation: `Dans l’ordre croissant : ${sorted.join(' < ')}.`,
            meta: { kind: 'order', values }
          });
        }
        const answer = Math.max(...values);
        return generated(id, level, {
          key: `max-${values.join('-')}`,
          type: 'choice',
          prompt: 'Quel est le plus grand nombre ?',
          options: values.map(String),
          answer,
          hint:
            level === 3
              ? 'Compare d’abord les centaines, puis les dizaines et enfin les unités.'
              : 'Compare d’abord les dizaines, puis les unités.',
          explanation: `${answer} est plus grand que ${values.filter((v) => v !== answer).join(' et ')}.`,
          meta: { kind: 'max', values }
        });
      }
      const before = kind === 2;
      const answer = kind === 3 ? n : before ? n - 1 : n + 1;
      const prompt =
        kind === 3
          ? `Quel nombre se cache entre ${n - 1} et ${n + 1} ?`
          : `Quel nombre vient juste ${before ? 'avant' : 'après'} ${n} ?`;
      return generated(id, level, {
        key: `${kind}-${n}`,
        prompt,
        answer,
        hint:
          kind === 3
            ? 'Avance d’un petit pas à partir du premier nombre.'
            : `Pour trouver le nombre ${before ? 'précédent' : 'suivant'}, ${before ? 'enlève' : 'ajoute'} 1.`,
        explanation: `${n - 1}, ${n}, ${n + 1} : chaque nombre vaut 1 de plus que le précédent.`,
        meta: { kind: kind === 3 ? 'between' : before ? 'before' : 'after', n }
      });
    }
    if (id === 'm-dizaines') {
      const tens = integer(1, level === 1 ? 5 : 9, rng);
      const ones = integer(0, 9, rng);
      const n = tens * 10 + ones;
      const kind = level === 1 ? 0 : integer(0, 2, rng);
      if (level === 3) {
        if (kind < 2) {
          const loose = integer(10, 24, rng);
          const answer = tens * 10 + loose;
          return generated(id, level, {
            key: `regroup-${tens}-${loose}`,
            prompt: `${tens} dizaines et ${loose} unités : quel nombre cela fait-il ?`,
            answer,
            hint: 'Regroupe 10 unités pour fabriquer une nouvelle dizaine.',
            explanation: `${tens} dizaines = ${tens * 10}. ${tens * 10} + ${loose} = ${answer}.`,
            meta: { kind: 'tens', tens, ones: loose, hundreds: 0 }
          });
        }
        const hundreds = integer(1, 4, rng);
        return generated(id, level, {
          key: `hundreds-${hundreds}-${tens}-${ones}`,
          prompt: 'Quel nombre représentent ces blocs ?',
          speech: `Il y a ${hundreds} centaines, ${tens} dizaines et ${ones} unités. Quel nombre cela représente-t-il ?`,
          answer: hundreds * 100 + n,
          visual: { hundreds, tens, ones },
          hint: 'Un grand carré vaut 100, une barre vaut 10 et un point vaut 1.',
          explanation: `${hundreds * 100} + ${tens * 10} + ${ones} = ${hundreds * 100 + n}.`,
          meta: { kind: 'tens', hundreds, tens, ones }
        });
      }
      if (kind === 1 || kind === 2) {
        const units = kind === 2;
        return generated(id, level, {
          key: `digit-${kind}-${n}`,
          prompt: units
            ? `Dans ${n}, quel chiffre représente les unités ?`
            : `Combien de dizaines entières y a-t-il dans ${n} ?`,
          answer: units ? ones : tens,
          visual: { numeral: n },
          hint: 'Dans un nombre à deux chiffres, les dizaines sont à gauche et les unités à droite.',
          explanation: `${n} = ${tens} dizaine${tens > 1 ? 's' : ''} et ${ones} unité${ones > 1 ? 's' : ''}.`,
          meta: { kind: units ? 'ones-digit' : 'tens-digit', n }
        });
      }
      return generated(id, level, {
        key: `blocks-${tens}-${ones}`,
        prompt: 'Quel nombre représentent ces blocs ?',
        speech: `Il y a ${tens} dizaines et ${ones} unités. Quel nombre cela représente-t-il ?`,
        answer: n,
        visual: { tens, ones },
        hint: 'Une barre vaut 10 et un petit point vaut 1. Compte les barres, puis les points.',
        explanation: `${tens} dizaine${tens > 1 ? 's' : ''} et ${ones} unité${ones > 1 ? 's' : ''} donnent ${tens * 10} + ${ones} = ${n}.`,
        meta: { kind: 'tens', hundreds: 0, tens, ones }
      });
    }
    if (id === 'm-calcul') {
      const kind = integer(0, level === 1 ? 1 : 3, rng);
      const max = [20, 70, 100][level - 1];
      const a = integer(level === 1 ? 3 : 12, max - 5, rng);
      const b = integer(
        1,
        kind === 1 ? Math.min(a, level === 1 ? 9 : 25) : Math.min(max - a, level === 1 ? 9 : 30),
        rng
      );
      const sum = a + b;
      let expression, answer, speech, hint, explanation;
      if (kind === 1) {
        expression = `${a} − ${b} = ?`;
        answer = a - b;
        speech = `Combien font ${a} moins ${b} ?`;
        hint = 'Tu peux reculer par petits pas ou passer par la dizaine.';
        explanation = `Pars de ${a} et enlève ${b} : ${a} − ${b} = ${answer}.`;
      } else if (kind === 2) {
        expression = `${a} + ? = ${sum}`;
        answer = b;
        speech = `${a} plus quel nombre égale ${sum} ?`;
        hint = `Cherche combien il faut ajouter à ${a} pour arriver à ${sum}.`;
        explanation = `${sum} − ${a} = ${b}. Donc ${a} + ${b} = ${sum}.`;
      } else if (kind === 3) {
        expression = `? − ${b} = ${a}`;
        answer = sum;
        speech = `Quel nombre moins ${b} égale ${a} ?`;
        hint = 'Fais l’opération inverse : ajoute ce qui a été enlevé.';
        explanation = `${a} + ${b} = ${sum}. Donc ${sum} − ${b} = ${a}.`;
      } else {
        expression = `${a} + ${b} = ?`;
        answer = sum;
        speech = `Combien font ${a} plus ${b} ?`;
        hint = 'Tu peux décomposer les nombres ou avancer jusqu’à la prochaine dizaine.';
        explanation = `Pars de ${a} et ajoute ${b} : ${a} + ${b} = ${sum}.`;
      }
      return generated(id, level, {
        key: `${kind}-${a}-${b}`,
        prompt: kind >= 2 ? 'Trouve le nombre caché.' : 'À toi de calculer !',
        expression,
        speech,
        answer,
        hint,
        explanation,
        meta: { kind: ['add', 'subtract', 'missing-addend', 'missing-minuend'][kind], a, b }
      });
    }
    if (id === 'm-problemes') {
      const kind = integer(0, 2, rng);
      let story, prompt, answer, explanation, hint, meta;
      const a = integer(level === 1 ? 5 : 10, level === 1 ? 12 : 25, rng);
      const b = integer(2, level === 1 ? 7 : 12, rng);
      const c = integer(1, Math.min(6, a), rng);
      if (level === 1) {
        if (kind === 0) {
          story = `Mila a ${a} coquillages. Elle en trouve encore ${b} sur la plage.`;
          prompt = 'Combien de coquillages a-t-elle maintenant ?';
          answer = a + b;
          meta = { kind: 'add', a, b };
          explanation = `On réunit les coquillages : ${a} + ${b} = ${answer}. Mila a ${answer} coquillages.`;
        } else if (kind === 1) {
          story = `Noé a ${a} autocollants. Il en donne ${c} à son amie.`;
          prompt = 'Combien d’autocollants lui reste-t-il ?';
          answer = a - c;
          meta = { kind: 'subtract', a, b: c };
          explanation = `On retire les autocollants donnés : ${a} − ${c} = ${answer}.`;
        } else {
          story = `Dans le jardin, il y a ${a} tulipes et ${b} roses.`;
          prompt = 'Combien y a-t-il de fleurs en tout ?';
          answer = a + b;
          meta = { kind: 'add', a, b };
          explanation = `On compte toutes les fleurs : ${a} + ${b} = ${answer}.`;
        }
        hint =
          meta.kind === 'add'
            ? 'Il faut réunir les deux quantités : quelle opération les rassemble ?'
            : 'Une partie a été donnée : il faut l’enlever de la quantité de départ.';
      } else if (level === 2) {
        const stories = [
          [
            `Mila a ${a} billes. Elle en reçoit ${b}, puis en donne ${c}.`,
            'Combien de billes lui reste-t-il ?',
            'billes'
          ],
          [
            `Il y a ${a} livres sur une étagère. On en ajoute ${b}, puis on en emprunte ${c}.`,
            'Combien de livres restent sur l’étagère ?',
            'livres'
          ],
          [
            `Un bus transporte ${a} personnes. Au premier arrêt, ${b} personnes montent. Au suivant, ${c} personnes descendent.`,
            'Combien de personnes sont dans le bus à la fin ?',
            'personnes'
          ]
        ];
        [story, prompt] = stories[kind];
        answer = a + b - c;
        meta = { kind: 'add-subtract', a, b, c };
        hint = 'Il y a deux étapes : ajoute d’abord ce qui arrive, puis enlève ce qui part.';
        explanation = `D’abord : ${a} + ${b} = ${a + b}. Ensuite : ${a + b} − ${c} = ${answer}. Il reste ${answer} ${stories[kind][2]}.`;
      } else {
        const groups = integer(3, 5, rng),
          each = integer(3, 8, rng),
          extra = integer(1, 6, rng);
        if (kind === 1) {
          story = `Alma prépare ${groups} sachets contenant chacun ${each} graines. Elle donne ensuite ${extra} graines à son voisin.`;
          prompt = 'Combien de graines lui reste-t-il en tout ?';
          answer = groups * each - extra;
          meta = { kind: 'groups-subtract', groups, each, extra };
        } else {
          story = `Pour un goûter, Noé prépare ${groups} assiettes avec ${each} fraises dans chacune. Il ajoute aussi ${extra} fraises dans un bol.`;
          prompt = 'Combien de fraises a-t-il préparées en tout ?';
          answer = groups * each + extra;
          meta = { kind: 'groups-add', groups, each, extra };
        }
        hint = `Compte d’abord les ${groups} groupes de ${each}, puis traite la dernière étape.`;
        explanation = `${Array(groups).fill(each).join(' + ')} = ${groups * each}. Puis ${groups * each} ${kind === 1 ? '−' : '+'} ${extra} = ${answer}.`;
      }
      return generated(id, level, {
        key: `${kind}-${Object.values(meta).join('-')}`,
        story,
        prompt,
        answer,
        hint,
        explanation,
        meta
      });
    }
    if (id === 'm-logique') {
      const start = integer(0, 12, rng);
      let values, hint, explanation;
      if (level === 3) {
        const a = integer(2, 5, rng),
          b = a + integer(2, 4, rng);
        values = [start];
        for (let i = 0; i < 5; i++) values.push(values[i] + (i % 2 === 0 ? a : b));
        hint = 'Observe les écarts : deux pas différents se répètent à tour de rôle.';
        explanation = `On ajoute ${a}, puis ${b}, et on recommence. Après ${values[4]}, on ajoute ${a} : on obtient ${values[5]}.`;
      } else {
        const step = level === 1 ? take([2, 5], rng) : take([3, 10, -2, -5], rng);
        const first = step < 0 ? integer(40, 90, rng) : start;
        values = Array.from({ length: 5 }, (_, i) => first + i * step);
        hint = 'Compare deux voisins : de combien avance-t-on ou recule-t-on ?';
        explanation = `On ${step < 0 ? 'recule' : 'avance'} de ${Math.abs(step)} à chaque fois. Après ${values[3]}, on trouve ${values[4]}.`;
      }
      const answer = values[values.length - 1];
      return generated(id, level, {
        key: values.join('-'),
        prompt: 'Quel nombre continue cette suite ?',
        speech: `Quel nombre vient ensuite ? ${values.slice(0, -1).join(', ')}.`,
        visual: { sequence: [...values.slice(0, -1), '?'] },
        answer,
        hint,
        explanation,
        meta: { kind: 'sequence', values }
      });
    }
    throw new Error(`Aucun générateur pour ${id}.`);
  }

  return { levels, subjects, missions, banks, generate };
});
