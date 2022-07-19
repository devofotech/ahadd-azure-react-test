/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-syntax */
// As Ref to https://dmitripavlutin.com/how-to-compare-objects-in-javascript/
// 1 - shallowEqual is for single layer object comparison {} = {}
// 2 - deepEqual is for multi layer object comparison { {} } = { {} }

export function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}

export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2)
        || !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}
