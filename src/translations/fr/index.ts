import ITranslations from "../types/translations.types";
import frCommunityTranslations from "./community.translations";
import frGamesTranslations from "./games/games.translations";
import frHomeTranslations from "./home/home.translations";
import frLobbyTranslations from "./lobby.translations";
import frNavbarTranslations from "./navbar.translations";
import frPremiumTranslations from "./premium.translations";
import frProfileTranslations from "./profile/profile.translations";
import frSharedTranslations from "./shared.translations";

const frTranslations: ITranslations = {
  home: frHomeTranslations,
  navbar: frNavbarTranslations,
  community: frCommunityTranslations,
  premium: frPremiumTranslations,
  shared: frSharedTranslations,
  profile: frProfileTranslations,
  games: frGamesTranslations,
  lobby : frLobbyTranslations
};

export default frTranslations;
