import { IGameData, IRoomConfig, IRoomData, SocketUser } from "@/types/interfaces";

export type IUndercoverGameState = 'vote' | 'words';

export type IUndercoverCamp = 'undercover' | 'civilian'; 

export type UndercoverTheme = 'classic';

export type UndercoverMode = 'words' | 'images' | 'songs';

export interface IUndercoverConfig extends IRoomConfig {
  mode: UndercoverMode;
  theme: UndercoverTheme;
  spyCount: number;
  wordsPerTurn: number;
  anonymousMode: boolean;
}

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

export interface IUndercoverVote {
    playerId: string;
    vote: string;
    turn: number;
}

export interface IUndercoverWords {
    playerId: string;
    word: string;
}

export interface IUndercoverGameData extends IGameData {
  words?: IUndercoverWords[];
  votes: IUndercoverVote[],
  playerTurn?: string;
  state: IUndercoverGameState;
  civilianWord?: string;
  spyWord?: string;
  undercoverPlayerIds?: string[];
  campWin?: IUndercoverCamp;
  turn: number;
}

