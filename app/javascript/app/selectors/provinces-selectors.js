import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { createSelector, createStructuredSelector } from 'reselect';

export const getProvince = ({ location }) => get(location, 'payload.region');

export const getLocations = ({ provinces }) =>
  provinces && provinces.data || null;

export const getProvinceDetails = createSelector(
  [ getProvince, getLocations ],
  (provinceIso, provinces) => {
    if (!provinceIso || !provinces || isEmpty(provinces)) return null;

    return provinces.find(province => province.iso_code3 === provinceIso);
  }
);

export const provincesDetails = createStructuredSelector({
  provinceInfo: getProvinceDetails
});
