export interface IGameTranslations {
  record: Record<string, any>;
}

export interface ISpeedrundleTranslations extends IGameTranslations {
  record: {
    rank: string;
    me: string;
    unknown: string;
    totalScore: string;
    averageScore: string;
    maxScore: string;
    minScore: string;
    charactersToGuess: string;
  };
}

export interface IUndercoverTranslations extends IGameTranslations {
  record: {
    civilian: string;
    undercover: string;
    civilianWord: string;
    spyWord: string;
  };
}

export interface IWerewolvesTranslations extends IGameTranslations {
  record: {
    deadCount: string;
    composition: string;
  };
  roles: {
    cupidon: string;
    hunter: string;
    psychic: string;
    thief: string;
    villager: string;
    witch: string;
    wolf: string;
  };
  camps: {
    wolves: string;
    village: string;
    solo: string;
    couple: string;
  };
}

interface IGamesTranslations {
  speedrundle: ISpeedrundleTranslations;
  undercover: IUndercoverTranslations;
  werewolves: IWerewolvesTranslations;
  shared: {
    victory: string;
    defeat: string;
  };
}

export default IGamesTranslations;
