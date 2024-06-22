import { IRoomConfig, IRoomData, IGameData } from "@/types/interfaces";

export type SpeedrundleMode = "classic" | "less_trials";

export type SpeedrundleTheme = "league_of_legends" | "pokemon" | "marvel";

export interface ISpeedrundleConfig extends IRoomConfig {
  mode: SpeedrundleMode;
  theme: SpeedrundleTheme;
  nbRounds: number;
}

export type CharacterDataType = "league_of_legends" | "pokemon";

export interface ICharacterData extends Record<string, any> {
  dataType: CharacterDataType;
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

export interface ICharacter {
  _id: string;
  name: string;
  lang: string;
  apiId?: string;
  data: ICharacterData;
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

interface IColumn {
  name: string;
  key: string;
  type? : string
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
}

export type SpeedrundleAnswerClues = "true" | "false" | "partial" | "more" | "less"