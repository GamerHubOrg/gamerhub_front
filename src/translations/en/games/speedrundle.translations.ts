import { ISpeedrundleTranslations } from "@/translations/types/games.translations.types";

const enSpeedrundleTranslations: ISpeedrundleTranslations = {
  record: {
    rank: "Rank",
    unknown: "Unknown user",
    totalScore: "Total score",
    averageScore: "Average score",
    maxScore: "Max score",
    minScore: "Min score",
    charactersToGuess: "Characters to guess",
  },
  configs: {
    mode: {
      label: "Game mode",
      values: {
        classic: "Classic",
      },
    },
    clues: "Clues",
    theme: "Theme",
    nbRounds: "Number of rounds",
    pokemonGens: "Pokemon generations",
  },
  columns: {
    league_of_legends: {
      sprite: "Champion",
      gender: "Gender",
      species: "Species",
      tags: "Combat",
      ressource: "Ressource",
      range: "Range",
      position: "Position",
      region: "Region",
      releaseYear: "Release year",
    },
  },

  game: {
    giveUp: "Abandon this character",
    abandoned: "Abandoned",
    details: "Score details",
    waitingPlayers: "Waiting for other players...",
    clueValues: {
      shared: {
        gender: {
          male: "Male",
          female: "Female",
          other: "Other",
        },
      },
      league_of_legends: {
        species: {
          aspect: "Aspect",
          brackern: "Brackern",
          cat: "Cat",
          celestial: "Celestial",
          "chemically altered": "Chemically altered",
          cyborg: "Cyborg",
          darkin: "Darkin",
          demon: "Demon",
          dragon: "Dragon",
          god: "God",
          "god-warrior": "God-Warrior",
          golem: "Golem",
          human: "Human",
          iceborn: "Iceborn",
          "magically altered": "Magically altered",
          magicborn: "Magicborn",
          minotaur: "Minotaur",
          revenant: "Revenant",
          spirit: "Spirit",
          spiritualist: "Spiritualist",
          troll: "Troll",
          undead: "Undead",
          unknown: "Unknown",
          vastayan: "Vastayan",
          "void-being": "Void-being",
          yordle: "Yordle",
          rat: "Rat",
          dog: "Dog",
          yeti: "Yeti",
        },
        tags: {
          marksman: "Marksman",
          fighter: "Fighter",
          mage: "Mage",
          support: "Support",
          tank: "Tank",
          assassin: "Assassin",
        },
        ressource: {
          "blood well": "Blood well",
          courage: "Courage",
          "crimson rush": "Crimson rush",
          energy: "Energy",
          ferocity: "Ferocity",
          flow: "Flow",
          fury: "Fury",
          grit: "Grit",
          heat: "Heat",
          mana: "Mana",
          none: "None",
          rage: "Rage",
          shield: "Shield",
        },
        range: {
          melee: "Melee",
          range: "Range",
        },
        region: {
          "shadow isles": "Shadow Isles",
          "the void": "The Void",
          "bandle city": "Bandle",
        },
      },
    },
  },

};

export default enSpeedrundleTranslations;
