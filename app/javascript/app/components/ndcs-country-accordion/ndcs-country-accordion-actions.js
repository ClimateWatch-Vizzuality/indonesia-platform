import { createAction, createThunkAction } from 'redux-tools';
import { CWAPI } from 'services/api';

const fetchNdcsCountryAccordionInit = createAction(
  'fetchNdcsCountryAccordionInit'
);
const fetchNdcsCountryAccordionReady = createAction(
  'fetchNdcsCountryAccordionReady'
);
const fetchNdcsCountryAccordionFailed = createAction(
  'fetchNdcsCountryAccordionFailed'
);

const fetchNdcsCountryAccordion = createThunkAction(
  'fetchNdcsCountryAccordion',
  params => dispatch => {
    const { locations, category, compare } = params;
    if (locations) {
      dispatch(fetchNdcsCountryAccordionInit());
      const url = `ndcs?location=${locations}&category=${category}${!compare
        ? '&filter=overview'
        : ''}`;
      CWAPI
        .get(url)
        .then(data => dispatch(fetchNdcsCountryAccordionReady(data)))
        .catch(error => {
          dispatch(fetchNdcsCountryAccordionFailed());
          console.info(error);
        });
    }
  }
);

export default {
  fetchNdcsCountryAccordion,
  fetchNdcsCountryAccordionInit,
  fetchNdcsCountryAccordionReady,
  fetchNdcsCountryAccordionFailed
};
