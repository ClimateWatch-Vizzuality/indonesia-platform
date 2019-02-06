import { redirect } from 'redux-first-router';

export const setLanguage = locale => (dispatch, getState) => {
  const { location } = getState();
  const payload = { ...location.payload, locale };
  return dispatch(redirect({ type: location.type, payload }));
};
