import { capitalizeFirstLetter } from "@/utils/functions";
import { ILolCharacter, SpeedrundleAnswerClues } from "./speedrundle.types";

function verifyArrayInclusion(array1: string[], array2: string[]) {
  const allGood =
    array1.every((tag) => array2.includes(tag)) &&
    array2.every((tag) => array1.includes(tag));
  if (allGood) return "true";
  const someGood = allGood || array1.some((tag) => array2?.includes(tag));
  if (someGood) return "partial";
  return "false";
}

export function compareLolGuessToAnswer(
  characterToGuess: ILolCharacter,
  currentGuess: ILolCharacter,
  column: string
) : SpeedrundleAnswerClues {
  const arraysColumns = ["tags", "range", "position", "species"];
  const stringColumns = ["ressource", "gender", "region"];


  if (arraysColumns.includes(column)) {
    const guess = currentGuess.data[column as keyof object];
    const toGuess = characterToGuess.data[column as keyof object] ?? [];
    const value = verifyArrayInclusion(toGuess, guess);
    return value
  }

  if (stringColumns.includes(column)) {
    const guess = currentGuess.data[column as keyof object];
    const toGuess = characterToGuess.data[column as keyof object];
    return guess === toGuess ? "true" : "false";
  }

  if(column === "releaseYear") {
    const guess = currentGuess.data.releaseYear;
    const toGuess = characterToGuess.data.releaseYear;
    return guess === toGuess ? "true" : guess > toGuess ? "less" : "more";
  }

  return currentGuess._id === characterToGuess._id ? "true" : "false";
}
export function formatLolCharacter(characterData: ILolCharacter) {
  const sprite = characterData.data.sprite;
  const { ressource, region, releaseYear } = characterData.data;
  const gender =
    characterData.data.gender === "male"
      ? "Masculin"
      : characterData.data.gender === "female"
      ? "Féminin"
      : "Autre";
  const tags = characterData.data.tags.join(", ");
  const species = characterData.data.species.join(", ");
  const ranges = characterData.data.range.map((e) => capitalizeFirstLetter(e));
  const range = ranges.length > 1 ? ranges.join(", ") : ranges[0];
  const position = characterData.data.position
    .map((e) => capitalizeFirstLetter(e))
    .join(", ");

  return {
    id: characterData._id,
    sprite,
    gender,
    tags,
    ressource,
    species,
    range,
    region,
    position,
    releaseYear
  };
}
