import { IWerewolvesCouple } from "./werewolves.types";

export function getCoupleFromUser(couples: IWerewolvesCouple, userId: string) {
  const users = Object.values(couples).reduce((acc: string[], couple: string[]) => {
    if (!couple?.includes(userId)) return acc;
    return [
      ...acc,
      ...couple,
    ]
  }, []);

  return [...new Set(users.map((u) => u))];
}