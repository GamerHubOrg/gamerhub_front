export interface IGameTranslations {
  record: Record<string, any>;
  configs: Record<string, any>;
  game?: Record<string, any>;
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
  game: {
    giveUp: string;
    abandoned: string;
    details: string;
    waitingPlayers: string;
    clueValues: {
      shared: {
        gender: {
          male: string;
          female: string;
          other: string;
        };
        none: string;
      };
      league_of_legends: {
        species: {
          aspect: string;
          brackern: string;
          cat: string;
          celestial: string;
          "chemically altered": string;
          cyborg: string;
          darkin: string;
          demon: string;
          dragon: string;
          god: string;
          "god-warrior": string;
          golem: string;
          human: string;
          iceborn: string;
          "magically altered": string;
          magicborn: string;
          minotaur: string;
          revenant: string;
          spirit: string;
          spiritualist: string;
          troll: string;
          undead: string;
          unknown: string;
          vastayan: string;
          "void-being": string;
          yordle: string;
          rat: string;
          dog: string;
          yeti: string;
        };
        tags: {
          marksman: string;
          fighter: string;
          mage: string;
          support: string;
          tank: string;
          assassin: string;
        };
        ressource: {
          "blood well": string;
          courage: string;
          "crimson rush": string;
          energy: string;
          ferocity: string;
          flow: string;
          fury: string;
          grit: string;
          heat: string;
          mana: string;
          rage: string;
          shield: string;
        };
        range: {
          melee: string;
          range: string;
        };
        region: {
          "shadow isles": string;
          "the void": string;
          "bandle city": string;
        };
      };
      pokemon: {
        status: {
          baby: string;
          legendary: string;
          mythical: string;
          common: string;
        };
        types: {
          normal: string;
          fire: string;
          water: string;
          electric: string;
          grass: string;
          ice: string;
          fighting: string;
          poison: string;
          ground: string;
          flying: string;
          psychic: string;
          bug: string;
          rock: string;
          ghost: string;
          dragon: string;
          dark: string;
          steel: string;
          fairy: string;
        };
      };
    };
  };
  columns: {
    league_of_legends: {
      sprite: string;
      gender: string;
      species: string;
      tags: string;
      ressource: string;
      range: string;
      position: string;
      region: string;
      releaseYear: string;
    };
    pokemon: {
      sprite: string;
      type1: string;
      type2: string;
      generation: string;
      color: string;
      evolutionStage: string;
      fullyEvolved: string;
      status: string;
      height: string;
      weight: string;
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
  roles: Record<string, any>;
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
