import IGamesTranslations from "@/translations/types/games.translations.types";
import frSpeedrundleTranslations from "./speedrundle.translations";
import frUndercoverTranslations from "./undercover.translations";
import frWerewolvesTranslations from "./werewolves.translations";

const frGamesTranslations: IGamesTranslations = {
  speedrundle: frSpeedrundleTranslations,
  undercover: frUndercoverTranslations,
  werewolves: frWerewolvesTranslations,
  shared: {
    victory: "Victoire",
    defeat: "Défaite"
  }
};

export default frGamesTranslations;
