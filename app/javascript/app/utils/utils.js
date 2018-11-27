import deburr from 'lodash/deburr';

export const lowerDeburr = string => deburr(string.toLowerCase());
