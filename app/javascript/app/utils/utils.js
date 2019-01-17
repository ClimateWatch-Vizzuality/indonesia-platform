import deburr from 'lodash/deburr';

export const lowerDeburr = string => deburr(string.toLowerCase());
export const upperDeburr = string => deburr(String(string).toUpperCase());
