import IColorsTranslations from "./colors.translations.types";
import ICommunityTranslations from "./community.translations.types";
import IConfigTranslations from "./config.translations.types";
import IGamesTranslations from "./games.translations.types";
import IHomePageTranslations from "./home.translations.types";
import ILobbyTranslations from "./lobby.translations.types";
import INavbarTranslations from "./navbar.translations.types";
import IPremiumTranslations from "./premium.translations.types";
import IProfileTranslations from "./profile.translations.types";
import IRoomTranslations from "./room.translations.types";
import ISharedTranslations from "./shared.translations.types";

interface ITranslations extends Record<string, any> {
  home: IHomePageTranslations;
  navbar: INavbarTranslations;
  community: ICommunityTranslations;
  premium: IPremiumTranslations;
  shared: ISharedTranslations;
  profile: IProfileTranslations;
  games: IGamesTranslations;
  lobby: ILobbyTranslations;
  config: IConfigTranslations;
  room: IRoomTranslations;
  colors: IColorsTranslations;
}

export default ITranslations;
