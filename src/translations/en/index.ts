import ITranslations from "../types/translations.types";
import enCommunityTranslations from "./community.translations";
import enConfigTranslations from "./config.translation";
import enGamesTranslations from "./games/games.translations";
import enHomeTranslations from "./home/home.translations";
import enLobbyTranslations from "./lobby.translations";
import enNavbarTranslations from "./navbar.translations";
import enPremiumTranslations from "./premium.translations";
import enProfileTranslations from "./profile/profile.translations";
import enRoomTranslations from "./room.translations";
import enSharedTranslations from "./shared.translations";

const enTranslations: ITranslations = {
  home: enHomeTranslations,
  navbar: enNavbarTranslations,
  community: enCommunityTranslations,
  premium: enPremiumTranslations,
  shared: enSharedTranslations,
  profile: enProfileTranslations,
  games: enGamesTranslations,
  lobby: enLobbyTranslations,
<<<<<<< HEAD
  config: enConfigTranslations,
  room: enRoomTranslations,
=======
>>>>>>> 3b32e5c (feat: GameLobby component on all games + langues in Lobby + Speedrundle config)
};

export default enTranslations;
