export function objectsAreEquivalent(obj1, obj2) {
  const obj1Props = Object.getOwnPropertyNames(obj1);
  const obj2Props = Object.getOwnPropertyNames(obj2);

  if (obj1Props.length != obj2Props.length) {
    return false;
  }

  for (let i = 0; i < obj1Props.length; i += 1) {
    const propName = obj1Props[i];

    if (obj1[propName] !== obj2[propName]) {
      return false;
    }
  }

  return true;
}
