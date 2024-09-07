import ITranslations from "../types/translations.types";
import frColorsTranslations from "./colors.translations";
import frCommunityTranslations from "./community.translations";
import frConfigTranslations from "./config.translation";
import frGamesTranslations from "./games/games.translations";
import frHomeTranslations from "./home/home.translations";
import frLobbyTranslations from "./lobby.translations";
import frNavbarTranslations from "./navbar.translations";
import frNotificationsTranslations from "./notifications.translations";
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
  games: frGamesTranslations,
  lobby: frLobbyTranslations,
  config: frConfigTranslations,
  room: frRoomTranslations,
  colors: frColorsTranslations,
  notifications: frNotificationsTranslations,
};

export default frTranslations;
