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
    pokemonGens: "Générations de Pokémon"
  },
  columns: {
    league_of_legends: {
      gender: "Genre",
      species: "Espèce",
      tags: "Combat",
      ressource: "Ressource",
      range : "Range",
      position: "Position",
      region: "Région",
      releaseYear: "Date de sortie",
    },
  },
};

export default frSpeedrundleTranslations;
