import get from 'lodash/get';

export const getProvince = ({ location }) => get(location, 'payload.region');
