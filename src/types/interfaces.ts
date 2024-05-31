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

export interface IGameConfigProperties {
  maxPlayers: number;
  mode: string;
  theme: string;
  spyCount: number;
  wordsPerTurn: number;
  anonymousMode: boolean;
  roundsNumber: number;
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
