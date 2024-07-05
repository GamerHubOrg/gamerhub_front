import {
  ICharacter,
  IColumn,
  ISpeedrundleAnswer,
} from "@/components/games/speedrundle/speedrundle.types";
import { IMinifiedUser } from "./user";
import { IUndercoverVote, IUndercoverWords } from "@/components/games/undercover/undercover.types";

export interface IGameRecord {
  _id: string;
  gameName: "speedrundle" | "werewolves" | "undercover";
  users: string[];
  usersData: IMinifiedUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpeedrundleRecord extends IGameRecord {
  columns: IColumn[];
  charactersToGuess: string[];
  usersAnswers: ISpeedrundleAnswer[];
  charactersData: Partial<ICharacter>[];
}

export interface IUndercoverRecord extends IGameRecord {
  words: IUndercoverWords[];
  votes: IUndercoverVote[];
  civilianWord: string;
  spyWord: string;
  undercoverPlayerIds: string[];
  campWin: string;
}


export type GameRecord = IGameRecord | ISpeedrundleRecord | IUndercoverRecord;
