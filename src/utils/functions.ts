export const areObjectsEquals = (obj1: object, obj2: object): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  if (keys1.some((key) => !keys2.includes(key))) return false;
  for (const key of keys1) {
    if (obj1[key as keyof object] !== obj2[key as keyof object]) return false;
  }
  return true;
};
