import {
  ICharacter,
  IColumn,
  ISpeedrundleAnswer,
} from "@/components/games/speedrundle/speedrundle.types";
import { IMinifiedUser } from "./user";

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


export type GameRecord = IGameRecord | ISpeedrundleRecord;
