import deburr from 'lodash/deburr';

export const lowerDeburr = string => deburr(string.toLowerCase());
export const upperDeburr = string => deburr(String(string).toUpperCase());

export const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};
