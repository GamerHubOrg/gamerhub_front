import ITranslations from "../types/translations.types";
import enColorsTranslations from "./colors.translations";
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
  config: enConfigTranslations,
  room: enRoomTranslations,
  colors: enColorsTranslations,
};

export default enTranslations;
