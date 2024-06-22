import { capitalizeFirstLetter } from "@/utils/functions";
import { ILolCharacter } from "./speedrundle.types";

export function formatLolCharacter(characterData: ILolCharacter) {
  const sprite = characterData.data.sprite;
  const { ressource } = characterData.data;
  const gender =
    characterData.data.gender === "male"
      ? "Masculin"
      : characterData.data.gender === "female"
        ? "Féminin"
        : "Autre";
  const tags = characterData.data.tags.join(", ");
  const ranges = characterData.data.range.map((e) => capitalizeFirstLetter(e));
  const range = ranges.length > 1 ? ranges.join(", ") : ranges[0];
  const position = characterData.data.position
    .map((e) => capitalizeFirstLetter(e))
    .join(", ");

  return { id: characterData._id, sprite, gender, tags, ressource, range, position };
}