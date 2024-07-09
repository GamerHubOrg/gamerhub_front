import IPremiumTranslations from "@/translations/types/premium.translations.types";

const enPremiumTranslations: IPremiumTranslations = {
  title: "Pricing",
  getStarted: "Get started with our free plan and upgrade when you are ready !",
  month: "month",
  mostPopular : "Most popular",
  plans: {
    free: {
      name: "Free",
      description: "You just want to discover",
      button : "Default plan"
    },
    premium: {
      name: "Premium",
      description: "You want the full experience",
      button : "Select this plan | Already subscribed"
    },
  },
  plansFunctionnalities: {
    accessGames: "Play published games",
    defaultModes: "Play default game modes",
    custom: "Extensive customisation of game settings",
    beta: "Beta access to new games",
    config: "Publish configurations to the community",
  },
};

export default enPremiumTranslations;
