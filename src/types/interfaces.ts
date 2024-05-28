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
  config: IRoomConfig;
  gameState: GameState;
  gameData?: IGameData;
  logs: IRoomLog[];
}

export interface IRoomConfig {
  maxPlayers?: number;
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
  turn: number;
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

export interface IUndercoverGameData extends IGameData {
  words?: IUndercoverWords[];
  votes: IUndercoverVote[],
  playerTurn?: string;
  state: IUndercoverGameState;
  turn: number;
}
