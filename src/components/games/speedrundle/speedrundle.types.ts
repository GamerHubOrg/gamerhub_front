import { IRoomConfig, IRoomData, IGameData } from "@/types/interfaces";

export type SpeedrundleMode = "classic" | "less_trials";

export type SpeedrundleTheme = "league_of_legends" | "pokemon";

export interface ISpeedrundleConfig extends IRoomConfig {
  mode: SpeedrundleMode;
  theme: SpeedrundleTheme;
  nbRounds: number;
}

export interface ICharacterData extends Record<string, any> {
  dataType: SpeedrundleTheme;
}

export interface ICharacter {
  _id: string;
  name: string;
  lang: string;
  apiId: string;
  data: ICharacterData;
}


export interface ILolCharacterData extends ICharacterData {
  dataType: "league_of_legends";
  splash: string;
  sprite: string;
  title: string;
  tags: string[];
  gender: string;
  ressource: string;
  range: string[];
  position: string[];
  region: string;
  releaseYear: number;
}

export interface IPokemonCharacterData extends ICharacterData {
  dataType: "pokemon";
  splash: string;
  sprite: string;
  types: string[];
  height: number;
  weight: number;
  evolutionStage: number;
  fullyEvolved: boolean;
  color: string;
  habitat: string;
  generation: number;
  status : string;
}

export interface IPokemonCharacter extends ICharacter {
  data: IPokemonCharacterData;
}

export interface ILolCharacter extends ICharacter {
  data: ILolCharacterData;
}

export type ISpeedrundleGameState = "guess";

export interface ISpeedrundleRoomData extends IRoomData {
  config?: ISpeedrundleConfig;
  gameData?: ISpeedrundleGameData;
}

export interface ISpeedrundleGameData extends IGameData {
  columns: IColumn[];
  allCharacters: ICharacter[];
  charactersToGuess: ICharacter[];
  usersAnswers: ISpeedrundleAnswer[];
}

export interface ISpeedrundleAnswer {
  playerId: string;
  currentRound: number;
  roundsData: ISpeedrundleRoundData[];
  state : "playing" | "finished"
}

export interface ISpeedrundleRoundData {
  guesses : string[];
  score : number;
  hasFound : boolean;
  startDate : Date;
}

export interface IColumn {
  name: string;
  key: string;
  type? : string
  isIcon? : boolean
}

export interface ISpeedrundleScore {
  playerId: string;
  points: number;
}

export interface ISpeedrundleSendCharacter {
  roomId: string;
  userId: string;
  character: string;
}

export type SpeedrunCharacter = ILolCharacter;

export interface ISpeedrundleSendVote {
  roomId: string;
  vote: string;
  userId: string;
}

export interface ISpeedrundleGuess {
  playerId: string;
  guess: string;
}

export interface ISpeedrundleConfig extends IRoomConfig {
  nbRounds: number;
  theme: SpeedrundleTheme;
  selectedGenerations: number[]
  selectedColumns: string[]
}

const LEAGUE_OF_LEGENDS_COLUMNS: IColumn[] = [
  { name: "Champion", key: "sprite", type: "image", isIcon : true },
  { name: "Gender", key: "gender" },
  { name: "Species", key: "species" },
  { name: "Combat", key: "tags" },
  { name: "Ressource", key: "ressource" },
  { name: "Range", key: "range" },
  { name: "Position", key: "position" },
  { name: "Region", key: "region" },
  { name: "Release year", key: "releaseYear", type: "comparison" },
];

const POKEMON_COLUMNS: IColumn[] = [
  { name: "Pokemon", key: "sprite", type: "image" },
  { name: "Type 1", key: "type1" },
  { name: "Type 2", key: "type2" },
  { name: "Generation", key: "generation" },
  { name: "Color", key: "color" },
  { name: "Evolution Stage", key: "evolutionStage", type : "comparison" },
  { name: "Fully Evolved ?", key: "fullyEvolved" },
  { name: "Status", key: "status" },
  // { name: "Habitat", key: "habitat" },
  { name: "Height", key: "height", type : "comparison" },
  { name: "Weight", key: "weight", type : "comparison" },
];

export const speedrundleColumns: Record<SpeedrundleTheme, IColumn[]> = {
  league_of_legends: LEAGUE_OF_LEGENDS_COLUMNS,
  pokemon: POKEMON_COLUMNS,
};


export type SpeedrundleAnswerClues = "true" | "false" | "partial" | "more" | "less"