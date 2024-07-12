import ICommunityTranslations from "./community.translations.types";
import IGamesTranslations from "./games.translations.types";
import IHomePageTranslations from "./home.translations.types";
import ILobbyTranslations from "./lobby.translations.types";
import INavbarTranslations from "./navbar.translations.types";
import IPremiumTranslations from "./premium.translations.types";
import IProfileTranslations from "./profile.translations.types";
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
}

export default ITranslations;
