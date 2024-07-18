export interface IGameTranslations {
  record: Record<string, any>;
  configs: Record<string, any>;
}

export interface ISpeedrundleTranslations extends IGameTranslations {
  record: {
    rank: string;
    unknown: string;
    totalScore: string;
    averageScore: string;
    maxScore: string;
    minScore: string;
    charactersToGuess: string;
  };
  configs: {
    mode: {
      label: string;
      values: {
        classic: string;
      };
    };
    theme: string;
    clues: string;
    nbRounds: string;
    pokemonGens: string;
  };
  columns: {
    league_of_legends: {
      gender: string;
      species: string;
      tags: string;
      ressource: string;
      range: string;
      position: string;
      region: string;
      releaseYear: string;
    };
  };
}

export interface IUndercoverTranslations extends IGameTranslations {
  record: {
    civilian: string;
    undercover: string;
    civilianWord: string;
    spyWord: string;
  };
  configs: {
    mode: {
      label: string;
      values: {
        words: string;
        images: string;
      };
    };
    theme: {
      label: string;
      values: {
        classic: string;
      };
    };
    nbSpies: string;
    nbWords: string;
    hiddenMode: string;
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
