import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchTranslationsInit = createAction('fetchTranslationsInit');
export const fetchTranslationsReady = createAction('fetchTranslationsReady');
export const fetchTranslationsFail = createAction('fetchTranslationsFail');

export const fetchTranslations = createThunkAction(
  'fetchTranslations',
  params => (dispatch, state) => {
    const { translations } = state();
    if (translations && translations.data && !translations.loading) {
      dispatch(fetchTranslationsInit());
      INDOAPI
        .get('translations', params)
        .then((data = {}) => {
          dispatch(fetchTranslationsReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchTranslationsFail(error && error.message));
        });
    }
  }
);
