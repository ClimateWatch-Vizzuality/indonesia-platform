import deburr from 'lodash/deburr';
import isEmpty from 'lodash/isEmpty';
import qs from 'query-string';

export const lowerDeburr = string => deburr(string.toLowerCase());
export const upperDeburr = string => deburr(String(string).toUpperCase());

export const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

export const appendParamsToURL = (url, params) => {
  const [ bareUrl, currentSearch ] = url.split('?');
  const newSearch = qs.stringify({ ...qs.parse(currentSearch), ...params });

  if (isEmpty(newSearch)) return url;

  return `${bareUrl}?${newSearch}`;
};
