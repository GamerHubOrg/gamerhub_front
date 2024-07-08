export const areObjectsEquals = (obj1: object, obj2: object): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  if (keys1.some((key) => !keys2.includes(key))) return false;
  for (const key of keys1) {
    const val1 : any = obj1[key as keyof object]
    const val2 : any = obj2[key as keyof object]   
    if (val1.toString() !== val2.toString()) return false;
  }
  return true;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};