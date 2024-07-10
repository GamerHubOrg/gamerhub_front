import IGamesTranslations from "@/translations/types/games.translations.types";
import enSpeedrundleTranslations from "./speedrundle.translations";
import enUndercoverTranslations from "./undercover.translations";
import enWerewolvesTranslations from "./werewolves.translations";

const enGamesTranslations: IGamesTranslations = {
  speedrundle: enSpeedrundleTranslations,
  undercover: enUndercoverTranslations,
  werewolves: enWerewolvesTranslations,
  shared: {
    victory: "Victory",
    defeat: "Defeat"
  }
};

export default enGamesTranslations;
