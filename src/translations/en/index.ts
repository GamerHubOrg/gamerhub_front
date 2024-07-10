import ITranslations from "../types/translations.types";
import enCommunityTranslations from "./community.translations";
import enGamesTranslations from "./games/games.translations";
import enHomeTranslations from "./home/home.translations";
import enNavbarTranslations from "./navbar.translations";
import enPremiumTranslations from "./premium.translations";
import enProfileTranslations from "./profile/profile.translations";
import enSharedTranslations from "./shared.translations";

const enTranslations: ITranslations = {
  home: enHomeTranslations,
  navbar: enNavbarTranslations,
  community: enCommunityTranslations,
  premium: enPremiumTranslations,
  shared: enSharedTranslations,
  profile: enProfileTranslations,
  games: enGamesTranslations
};

export default enTranslations;
