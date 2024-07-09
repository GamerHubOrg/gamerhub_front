import IHomepageTranslations from "./homepage.translations.types";
import INavbarTranslations from "./navbar.translations.types";

interface ITranslations extends Record<string, any> {
  homepage: IHomepageTranslations;
  navbar: INavbarTranslations;
}

export default ITranslations;
