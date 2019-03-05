import { createStructuredSelector, createSelector } from 'reselect';
import { get, isEmpty } from 'lodash';

const getData = ({ metadata }) => get(metadata, 'modal.data', null);
const getActive = ({ modalMetadata }) => modalMetadata.active || null;
const getTitle = ({ modalMetadata }) => modalMetadata.customTitle || '';
const getIsOpen = ({ modalMetadata }) => modalMetadata.isOpen || false;
const getLoading = ({ metadata }) => get(metadata, 'modal.loading', false);

const getModalData = createSelector([ getData, getActive ], (data, active) => {
  if (isEmpty(data) || !active) return null;

  return active
    .map(source => data.find(d => d.short_title === source))
    .filter(a => a);
});

const getModalTitle = createSelector([ getTitle, getModalData ], (
  customTitle,
  data
) =>
  {
    if (!data || isEmpty(data)) return null;
    return data.length > 1 ? customTitle : data[0].title;
  });

const getTabTitles = createSelector(
  getModalData,
  data => data && data.length > 1 ? data.map(d => d.title) : null
);

export const getModalMetadata = createStructuredSelector({
  isOpen: getIsOpen,
  loading: getLoading,
  title: getModalTitle,
  tabTitles: getTabTitles,
  data: getModalData
});
