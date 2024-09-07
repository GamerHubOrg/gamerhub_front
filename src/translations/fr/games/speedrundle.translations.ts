import { ISpeedrundleTranslations } from "@/translations/types/games.translations.types";

const frSpeedrundleTranslations: ISpeedrundleTranslations = {
  record: {
    rank: "Rang",
    unknown: "Utilisateur inconnu",
    totalScore: "Score total",
    averageScore: "Score moyen",
    maxScore: "Score maximal",
    minScore: "Score minimal",
    charactersToGuess: "Personnages à deviner",
  },
  configs: {
    mode: {
      label: "Mode de jeu",
      values: {
        classic: "Classique",
      },
    },
    clues: "Indices",
    theme: "Thème",
    nbRounds: "Nombre de rounds",
    pokemonGens: "Générations de Pokémon",
  },
  columns: {
    league_of_legends: {
      sprite: "Champion",
      gender: "Genre",
      species: "Espèce",
      tags: "Combat",
      ressource: "Ressource",
      range: "Range",
      position: "Position",
      region: "Région",
      releaseYear: "Date de sortie",
    },
    pokemon: {
      sprite: "Pokémon",
      type1: "Type 1",
      type2: "Type 2",
      generation: "Génération",
      color: "Couleur",
      evolutionStage: "Stade d'évolution",
      fullyEvolved: "Évolution finale ?",
      status: "Statut",
      height: "Taille",
      weight: "Poids",
    },
  },
  game: {
    giveUp: "Abandonner ce personnage",
    abandoned: "Abandonné",
    details: "Détails des scores",
    waitingPlayers: "En attente des autres joueurs...",
    clueValues: {
      shared: {
        gender: {
          male: "Masculin",
          female: "Féminin",
          other: "Autre",
        },
        none: "Aucun | Aucune",
      },
      league_of_legends: {
        species: {
          aspect: "Hôte",
          brackern: "Brackern",
          cat: "Chat",
          celestial: "Céleste",
          "chemically altered": "Altéré chimiquement",
          cyborg: "Cyborg",
          darkin: "Darkin",
          demon: "Démon",
          dragon: "Dragon",
          god: "Dieu",
          "god-warrior": "Dieu-guerrier",
          golem: "Golem",
          human: "Humain",
          iceborn: "Né de glace",
          "magically altered": "Altéré magiquement",
          magicborn: "Né magique",
          minotaur: "Minotaure",
          revenant: "Revenant",
          spirit: "Esprit",
          spiritualist: "Spiritualiste",
          troll: "Troll",
          undead: "Mort-vivant",
          unknown: "Inconnu",
          vastayan: "Vastaya",
          "void-being": "Être du néant",
          yordle: "Yordle",
          rat: "Rat",
          dog: "Chien",
          yeti: "Yéti",
        },
        tags: {
          marksman: "Tireur",
          fighter: "Combattant",
          mage: "Mage",
          support: "Support",
          tank: "Tank",
          assassin: "Assassin",
        },
        ressource: {
          "blood well": "Puits de sang",
          courage: "Courage",
          "crimson rush": "Afflux sanguin",
          energy: "Énergie",
          ferocity: "Férocité",
          flow: "Impulsion",
          fury: "Fureur",
          grit: "Agressivité",
          heat: "Vapeur",
          mana: "Mana",
          rage: "Rage",
          shield: "Bouclier",
        },
        range: {
          melee: "Mêlée",
          range: "À distance",
        },
        region: {
          "shadow isles": "Îles obscures",
          "the void": "Le Néant",
          "bandle city": "Bandle",
        },
      },
      pokemon: {
        status: {
          baby: "Bébé",
          legendary: "Légendaire",
          mythical: "Mythique",
          common: "Commun",
        },
        types: {
          normal: "Normal",
          fire: "Feu",
          water: "Eau",
          electric: "Électrik",
          grass: "Plante",
          ice: "Glace",
          fighting: "Combat",
          poison: "Poison",
          ground: "Sol",
          flying: "Vol",
          psychic: "Psy",
          bug: "Insecte",
          rock: "Roche",
          ghost: "Spectre",
          dragon: "Dragon",
          dark: "Ténèbres",
          steel: "Acier",
          fairy: "Fée"
        }
      },
    },
  },
};

export default frSpeedrundleTranslations;