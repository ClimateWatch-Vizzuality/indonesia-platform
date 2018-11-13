import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export const fetchMetaInit = createAction('fetchMetaInit');
export const fetchMetaReady = createAction('fetchMetaReady');
export const fetchMetaFail = createAction('fetchMetaFail');

function getDataByMeta(meta) {
  switch (meta) {
    case 'ghg':
      return INDOAPI.get('emissions/meta');

    default:
      return Promise.reject(new Error(
        `No metadata endpoint found for ${meta}`
      ));
  }
}

export const fetchMeta = createThunkAction('fetchMeta', payload =>
  (dispatch, state) => {
    const { metadata = {} } = state();
    const metas = isArray(payload) ? payload : [ payload ];
    metas.forEach(meta => {
      if (
        metadata[meta] &&
          isEmpty(metadata[meta].data) &&
          !metadata[meta].loading
      ) {
        dispatch(fetchMetaInit({ meta }));
        getDataByMeta(meta)
          .then((data = {}) => {
            dispatch(fetchMetaReady({ meta, data }));
          })
          .catch(error => {
            console.warn(error);
            dispatch(fetchMetaFail({ meta, error: error && error.message }));
          });
      }
    });
  });
