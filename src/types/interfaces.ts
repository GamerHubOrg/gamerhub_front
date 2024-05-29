import { User } from "@/modules/auth/user";

export interface SocketUser extends User {
  socket_id: string;
  isOwner?: boolean;
}

export type GameState = "started" | "lobby" | "results";

export interface IRoomLog {
  date: Date;
  message: string;
}

export interface IRoomData {
  users: SocketUser[];
  config?: IRoomConfig;
  gameState: GameState;
  gameData?: IGameData;
  logs: IRoomLog[];
  gameName: string;
}

export interface IRoomConfig {
  maxPlayers?: number;
}

export type UndercoverTheme = 'classic';

export type UndercoverMode = 'words';

export interface IUndercoverConfig extends IRoomConfig {
  mode: UndercoverMode;
  theme: UndercoverTheme;
  spyCount: number;
  wordsPerTurn: number;
  anonymousMode: boolean;
}

export interface IGameData {}

export interface IPlayerData {
  playerId: number;
  answer: any;
  points: number;
}

export interface IUndercoverVote {
  playerId: string;
  vote: string;
}

export interface IUndercoverWords {
  playerId: string;
  word: string;
}

export interface ITestGameData extends IGameData {
  rounds?: number[];
  playersData?: IPlayerData[];
}

export type IUndercoverGameState = 'vote' | 'words';

export type IUndercoverCamp = 'undercover' | 'civilian'; 

export interface IUndercoverPlayer extends SocketUser {
  isEliminated?: boolean
}

export interface IUndercoverConfig extends IRoomConfig {
  wordsPerTurn: number;
}

export interface IUndercoverRoomData extends IRoomData {
  users: IUndercoverPlayer[];
  config?: IUndercoverConfig;
  gameData?: IUndercoverGameData;
}

export interface IUndercoverGameData extends IGameData {
  words?: IUndercoverWords[];
  votes: IUndercoverVote[],
  playerTurn?: string;
  state: IUndercoverGameState;
  civilianWord?: string;
  spyWord?: string;
  undercoverPlayerIds?: string[];
  campWin?: IUndercoverCamp
}
