import { createStructuredSelector, createSelector } from 'reselect';
import { isEmpty } from 'lodash';

const getQuery = ({ location }) => location && (location.query || null);
const getData = ({ FundingOportunities }) =>
  FundingOportunities && (FundingOportunities.data || null);

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

export const getFilteredDataBySearch = createSelector([ getData, getSearch ], (
  data,
  search
) =>
  {
    if (!data || isEmpty(data)) return [];
    if (!search || isEmpty(search)) return data;
    const updatedData = data;
    return updatedData.filter(
      d => Object.keys(d).some(key => {
        if (Object.prototype.hasOwnProperty.call(d, key) && d[key] !== null) {
          return d[key].toString().indexOf(search) > -1;
        }
        return false;
      })
    );
  });

export const getLinkableColumnsSchema = createSelector(getData, data => {
  if (!data || isEmpty(data)) return null;
  return data.map(() => [
    { columnName: 'website_link', url: 'self', label: 'View more' }
  ]);
});

export const mapStateToProps = createStructuredSelector({
  data: getFilteredDataBySearch,
  titleLinks: getLinkableColumnsSchema
});
