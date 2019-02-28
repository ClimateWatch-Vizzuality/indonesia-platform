import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI, CWAPI } from 'services/api';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import mergeWith from 'lodash/mergeWith';

export const fetchMetaInit = createAction('fetchMetaInit');
export const fetchMetaReady = createAction('fetchMetaReady');
export const fetchMetaFail = createAction('fetchMetaFail');

function filterCWMeta(metadata) {
  const CAIT = metadata.data_source.find(d => d.name === 'CAIT');

  return {
    data_source: metadata.data_source.filter(d => d.id === CAIT.id),
    gas: metadata.gas.filter(g => CAIT.gas_ids.includes(g.id)),
    location: metadata.location.filter(l => l.iso_code3 === 'IDN'),
    sector: metadata.sector.filter(s => CAIT.sector_ids.includes(s.id))
  };
}

function concatArrays(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  return undefined;
}

function getDataByMeta(meta, params) {
  switch (meta) {
    case 'ghg':
      return Promise
        .all([
          INDOAPI.get('emissions/meta', params),
          CWAPI.get('emissions/meta', params)
        ])
        .then(
          ([ indoMeta, cwMeta ]) =>
            mergeWith(indoMeta, filterCWMeta(cwMeta), concatArrays)
        );
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
