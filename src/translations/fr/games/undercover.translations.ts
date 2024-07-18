import { IUndercoverTranslations } from "@/translations/types/games.translations.types";

const frUndercoverTranslations: IUndercoverTranslations = {
  record: {
    civilian: "Civil",
    undercover: "Espion",
    civilianWord: "Mot civil",
    spyWord: "Mot espion",
  },
  configs: {
    mode: {
      label: "Mode de jeu",
      values: {
        words: "Mots",
        images: "Images"
      },
    },
    theme: {
      label: "Thème",
      values : {
        classic: "Classique",
      }
    },
    nbSpies: "Nombre d'espions",
    nbWords: "Nombre de mots par tour",
    hiddenMode: "Mode caché",
  },
};

export default frUndercoverTranslations;
