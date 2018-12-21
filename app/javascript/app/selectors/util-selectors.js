import { createSelector } from 'reselect';
import { lowerDeburr } from 'utils/utils';
import isEmpty from 'lodash/isEmpty';

export const createTextSearchSelector = (getData, getSearch) => createSelector([ getData, getSearch ], (data, search) => {
    if (!data || isEmpty(data)) return [];
    if (!search || isEmpty(search)) return data;
    const updatedData = data;
    return updatedData.filter(
      d => Object.keys(d).some(key => {
        if (Object.prototype.hasOwnProperty.call(d, key) && d[key] !== null) {
          return lowerDeburr(String(d[key])).indexOf(lowerDeburr(search)) > -1;
        }
        return false;
      })
    );
  });
