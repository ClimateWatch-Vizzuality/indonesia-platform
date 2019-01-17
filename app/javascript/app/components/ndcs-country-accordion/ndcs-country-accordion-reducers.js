import actions from './ndcs-country-accordion-actions';

export const initialState = { loading: false, loaded: false, data: {} };

const setLoading = (loading, state) => ({ ...state, loading });
const setLoaded = (loaded, state) => ({ ...state, loaded });

export default {
  [actions.fetchNdcsCountryAccordionInit]: state => setLoading(true, state),
  [actions.fetchNdcsCountryAccordionReady]: (state, { payload }) => {
    const newState = { ...state, data: payload };

    return setLoaded(true, setLoading(false, newState));
  },
  [actions.fetchNdcsCountryAccordionFailed]: state => {
    const newState = { ...state, data: {} };

    return setLoaded(true, setLoading(false, newState));
  }
};
