import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchFundingOportunitiesInit = createAction(
  'fetchFundingOportunitiesInit'
);
export const fetchFundingOportunitiesReady = createAction(
  'fetchFundingOportunitiesReady'
);
export const fetchFundingOportunitiesFail = createAction(
  'fetchFundingOportunitiesFail'
);

export const fetchFundingOportunities = createThunkAction(
  'fetchFundingOportunities',
  params => (dispatch, state) => {
    const { FundingOportunities } = state();
    if (!FundingOportunities.loading) {
      dispatch(fetchFundingOportunitiesInit());
      INDOAPI
        .get('funding_opportunities', params)
        .then((data = {}) => {
          dispatch(fetchFundingOportunitiesReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchFundingOportunitiesFail(error && error.message));
        });
    }
  }
);
