interface IPlanTranslations {
  name: string;
  description: string;
  button : string;
}

interface IPremiumTranslations {
    title: string;
    getStarted: string;
    month: string;
    mostPopular : string;
    plans: {
        free: IPlanTranslations;
        premium: IPlanTranslations;
    };
    plansFunctionnalities: {
    accessGames: string;
    defaultModes: string;
    custom: string;
    beta: string;
    config: string;
  };
}

export default IPremiumTranslations;
