import { capitalizeFirstLetter } from "@/utils/functions";
import { ICharacter, SpeedrundleTheme } from "./speedrundle.types";
import {
  ILolCharacter,
  IPokemonCharacter,
  SpeedrundleAnswerClues,
} from "./speedrundle.types";

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
): SpeedrundleAnswerClues {
  const arraysColumns = ["tags", "range", "position", "species"];
  const stringColumns = ["ressource", "gender", "region"];

  if (arraysColumns.includes(column)) {
    const guess = currentGuess.data[column as keyof object];
    const toGuess = characterToGuess.data[column as keyof object] ?? [];
    const value = verifyArrayInclusion(toGuess, guess);
    return value;
  }

  if (stringColumns.includes(column)) {
    const guess = currentGuess.data[column as keyof object];
    const toGuess = characterToGuess.data[column as keyof object];
    return guess === toGuess ? "true" : "false";
  }

  if (column === "releaseYear") {
    const guess = currentGuess.data.releaseYear;
    const toGuess = characterToGuess.data.releaseYear;
    return guess === toGuess ? "true" : guess > toGuess ? "less" : "more";
  }

  return currentGuess._id === characterToGuess._id ? "true" : "false";
}

export function comparePokemonGuessToAnswer(
  characterToGuess: IPokemonCharacter,
  currentGuess: IPokemonCharacter,
  column: string
): SpeedrundleAnswerClues {
  const stringColumns = [
    "generation",
    "color",
    "fullyEvolved",
    "habitat",
    "status",
  ];
  const comparisonColumns = ["evolutionStage", "height", "weight"];

  if (stringColumns.includes(column)) {
    const guess = currentGuess.data[column];
    const toGuess = characterToGuess.data[column];
    return guess === toGuess ? "true" : "false";
  }

  if (comparisonColumns.includes(column)) {
    const guess = currentGuess.data[column];
    const toGuess = characterToGuess.data[column];
    return guess === toGuess ? "true" : guess > toGuess ? "less" : "more";
  }

  if (["type1", "type2"].includes(column)) {
    const n = parseInt(column.split("type")[1]);
    const guess = currentGuess.data.types[n - 1];
    const toGuess = characterToGuess.data.types[n - 1];

    return guess === toGuess ? "true" : "false";
  }

  return currentGuess._id === characterToGuess._id ? "true" : "false";
}

export function formatPokemonCharacter(characterData: IPokemonCharacter) {
  const sprite = characterData.data.sprite;
  const { generation, evolutionStage, fullyEvolved, color, habitat, status } =
    characterData.data;
  const type1 = characterData.data.types[0] || "none";
  const type2 = characterData.data.types[1] || "None";
  const height = `${characterData.data.height} m`;
  const weight = `${characterData.data.weight} kg`;

  return {
    id: characterData._id,
    sprite,
    type1: capitalizeFirstLetter(type1),
    type2: capitalizeFirstLetter(type2),
    generation,
    color,
    evolutionStage,
    fullyEvolved: fullyEvolved ? "Yes" : "No",
    habitat,
    height,
    weight,
    status,
  };
}

export function formatLolCharacter(
  { _id, data }: ILolCharacter,
  t: (val: string) => string
) {
  const lolT = (val: string) => t("league_of_legends." + val.toLowerCase());
  const sprite = data.sprite;
  const { releaseYear } = data;

  const gender = ["male", "female"].includes(data.gender)
    ? t("shared.gender." + data.gender)
    : t("shared.gender.other");
  const ressource = lolT("ressource." + data.ressource);
  const tags = data.tags.map((e) => lolT("tags." + e)).join(", ");
  const species = data.species.map((e) => lolT("species." + e)).join(", ");
  const ranges = data.range.map((e) =>
    capitalizeFirstLetter(lolT("range." + e))
  );
  const range = ranges.length > 1 ? ranges.join(", ") : ranges[0];
  const position = data.position
    .map((e) => capitalizeFirstLetter(e))
    .join(", ");

  const region = (() => {
    const lowerRegion = data.region.toLowerCase();
    if (["shadow isles", "bandle city", "the void"].includes(lowerRegion))
      return lolT("region." + lowerRegion);
    return data.region;
  })();

  return {
    id: _id,
    sprite,
    gender,
    tags,
    ressource,
    species,
    range,
    region,
    position,
    releaseYear,
  };
}

export function formatCharacter(
  allCharacters: ICharacter[],
  theme: SpeedrundleTheme,
  id: string,
  t: (val: string) => string
) {
  const characterData = allCharacters.find(({ _id }) => _id === id);
  if (!characterData) return undefined;

  switch (theme) {
    case "league_of_legends":
      return formatLolCharacter(characterData as ILolCharacter, t);
    case "pokemon":
      return formatPokemonCharacter(characterData as IPokemonCharacter);

    default:
      break;
  }
}
