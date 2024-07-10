import ITranslations from "../types/translations.types";
import frCommunityTranslations from "./community.translations";
<<<<<<< HEAD
import frConfigTranslations from "./config.translation";
=======
>>>>>>> 027b49d (feat: game history translations)
import frGamesTranslations from "./games/games.translations";
import frHomeTranslations from "./home/home.translations";
import frLobbyTranslations from "./lobby.translations";
import frNavbarTranslations from "./navbar.translations";
import frPremiumTranslations from "./premium.translations";
import frProfileTranslations from "./profile/profile.translations";
import frRoomTranslations from "./room.translations";
import frSharedTranslations from "./shared.translations";

const frTranslations: ITranslations = {
  home: frHomeTranslations,
  navbar: frNavbarTranslations,
  community: frCommunityTranslations,
  premium: frPremiumTranslations,
  shared: frSharedTranslations,
  profile: frProfileTranslations,
<<<<<<< HEAD
  games: frGamesTranslations,
  lobby: frLobbyTranslations,
  config: frConfigTranslations,
  room: frRoomTranslations,
=======
  games: frGamesTranslations
>>>>>>> 027b49d (feat: game history translations)
};

export default frTranslations;
