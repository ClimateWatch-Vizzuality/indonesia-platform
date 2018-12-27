import { createStructuredSelector, createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { getTranslate } from 'selectors/translation-selectors';
import { createTextSearchSelector } from 'selectors/util-selectors';

const getQuery = ({ location }) => location && (location.query || null);
const getData = ({ FundingOportunities }) =>
  FundingOportunities && (FundingOportunities.data || null);

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

export const getLinkableColumnsSchema = createSelector(getData, getTranslate, (
  data,
  t
) =>
  {
    if (!data || isEmpty(data)) return null;
    return data.map(() => [
      {
        columnName: 'website_link',
        url: 'self',
        label: t('pages.national-context.climate-funding.view-more-link')
      }
    ]);
  });

export const mapStateToProps = createStructuredSelector({
  data: createTextSearchSelector(getData, getSearch),
  titleLinks: getLinkableColumnsSchema,
  t: getTranslate
});
