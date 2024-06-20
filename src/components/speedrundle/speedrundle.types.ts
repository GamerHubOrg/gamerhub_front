import { IRoomConfig, IRoomData, IGameData } from "@/types/interfaces";

export type SpeedrundleMode = "classic" | "less_trials";

export type SpeedrundleTheme = "league_of_legends" | "pokemon" | "marvel";

export interface ISpeedrundleConfig extends IRoomConfig {
  mode: SpeedrundleMode;
  theme: SpeedrundleTheme;
  nbRounds: number;
}

export interface ILolData {
  dataType: "Lol";
  splash: string;
  sprite: string;
  title: string;
  tags: string[];
  gender: string;
  ressource: string;
  range: string[];
  position: string[];
}

export interface ICharacter {
  _id: string;
  name: string;
  lang: string;
  apiId?: string;
  data: Record<any, any>;
}

export interface ILolCharacter extends ICharacter {
  data: ILolData;
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
  guesses: string[][];
  score: number;
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
