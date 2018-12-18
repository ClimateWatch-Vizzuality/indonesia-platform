import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export const fetchMetaInit = createAction('fetchMetaInit');
export const fetchMetaReady = createAction('fetchMetaReady');
export const fetchMetaFail = createAction('fetchMetaFail');

function getDataByMeta(meta, params) {
  switch (meta) {
    case 'ghg':
      return INDOAPI.get('emissions/meta', params);

    default:
      return Promise.reject(new Error(
        `No metadata endpoint found for ${meta}`
      ));
  }
}

export const fetchMeta = createThunkAction('fetchMeta', params =>
  (dispatch, state) => {
    const { metadata = {} } = state();
    const { meta: paramMeta, locale } = params;
    const metas = isArray(paramMeta) ? paramMeta : [ paramMeta ];
    metas.forEach(meta => {
      if (
        metadata[meta] &&
          (isEmpty(metadata[meta].data) || metadata[meta].locale !== locale) &&
          !metadata[meta].loading
      ) {
        dispatch(fetchMetaInit({ meta }));
        getDataByMeta(meta, { locale })
          .then((data = {}) => {
            dispatch(fetchMetaReady({ meta, data, locale }));
          })
          .catch(error => {
            console.warn(error);
            dispatch(fetchMetaFail({ meta, error: error && error.message }));
          });
      }
    });
  });
