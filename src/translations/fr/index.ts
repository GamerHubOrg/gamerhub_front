import ITranslations from "../types/translations.types";
import frCommunityTranslations from "./community.translations";
import frHomeTranslations from "./home/home.translations";
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
};

export default frTranslations;
