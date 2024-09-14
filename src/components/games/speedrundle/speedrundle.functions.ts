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

export function formatPokemonCharacter(
  characterData: IPokemonCharacter,
  t: (val: string, nb?: number) => string
) {
  const pokeT = (val: string) =>
    t("games.speedrundle.game.clueValues.pokemon." + val.toLowerCase());
  const sprite = characterData.data.sprite;
  const { generation, evolutionStage, fullyEvolved, color, habitat, status } =
    characterData.data;
  const none = (genre: "m" | "f") =>
    t("games.speedrundle.game.clueValues.shared.none", genre === "f" ? 2 : 1);
  const type1 = characterData.data.types[0];
  const type2 = characterData.data.types[1];
  const height = `${characterData.data.height} m`;
  const weight = `${characterData.data.weight} kg`;

  return {
    id: characterData._id,
    sprite,
    type1: type1 ? pokeT("types." + type1.toLowerCase()) : none("m"),
    type2: type2 ? pokeT("types." + type2.toLowerCase()) : none("m"),
    generation,
    color: t("colors." + color.toLowerCase()),
    evolutionStage,
    fullyEvolved: fullyEvolved ? t("shared.yes") : t("shared.no"),
    habitat,
    height,
    weight,
    status: pokeT("status." + status.toLowerCase()),
  };
}

export function formatLolCharacter(
  { _id, data }: ILolCharacter,
  t: (val: string, nb?: number) => string
) {
  const lolT = (val: string) => t("league_of_legends." + val.toLowerCase());
  const { releaseYear, sprite } = data;
  const gender = ["male", "female"].includes(data.gender)
    ? t("shared.gender." + data.gender)
    : t("shared.gender.other");
  const ranges = data.range.map((e) =>
    capitalizeFirstLetter(lolT("range." + e))
  );
  const region = (() => {
    const lowerRegion = data.region.toLowerCase();
    if (["shadow isles", "bandle city", "the void"].includes(lowerRegion))
      return lolT("region." + lowerRegion);
    return data.region;
  })();
  const ressource =
    data.ressource.toLowerCase() === "none"
      ? t("shared.none", 2)
      : lolT("ressource." + data.ressource);

  return {
    id: _id,
    sprite,
    gender,
    tags: data.tags.map((e) => lolT("tags." + e)).join(", "),
    ressource,
    species: data.species.map((e) => lolT("species." + e)).join(", "),
    range: ranges.length > 1 ? ranges.join(", ") : ranges[0],
    region,
    position: data.position.map((e) => capitalizeFirstLetter(e)).join(", "),
    releaseYear,
  };
}

export function formatCharacter(
  allCharacters: ICharacter[],
  theme: SpeedrundleTheme,
  id: string,
  t: (val: string, nb?: number) => string
) {
  const characterData = allCharacters.find(({ _id }) => _id === id);
  if (!characterData) return undefined;

  switch (theme) {
    case "league_of_legends": {
      const translate = (str: string) =>
        t(`games.speedrundle.game.clueValues.${str}`);
      return formatLolCharacter(characterData as ILolCharacter, translate);
    }
    case "pokemon":
      return formatPokemonCharacter(characterData as IPokemonCharacter, t);

    default:
      break;
  }
}
