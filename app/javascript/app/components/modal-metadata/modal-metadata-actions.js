import { createAction, createThunkAction } from 'redux-tools';

const { API_URL } = process.env;

export const setModalMetadataParams = createAction('setModalMetadataParams');

// Requires payload params:
// slugs: array of slugs to fetch
// customTitle: custom title if there is more than one slug
export const setModalMetadata = createThunkAction(
  'setModalMetadata',
  payload => dispatch => {
    dispatch(setModalMetadataParams(payload));
    let { slugs } = payload;
    if (slugs) {
      if (typeof slugs === 'string') slugs = [ slugs ];
      dispatch(fetchModalMetaData(slugs));
    }
  }
);

export const fetchModalMetaDataInit = createAction('fetchModalMetaDataInit');
export const fetchModalMetaDataFail = createAction('fetchModalMetaDataFail');
export const fetchModalMetaDataReady = createAction('fetchModalMetaDataReady');

export const fetchModalMetaData = createThunkAction(
  'fetchModalMetaDataData',
  () => (dispatch, state) => {
    const { modalMetadata } = state();

    if (!modalMetadata.loaded) {
      dispatch(fetchModalMetaDataInit());

      fetch(`${API_URL}/metadata`)
        .then(response => {
          if (response.ok) return response.json();
          throw Error(response.statusText);
        })
        .then(data => {
          dispatch(fetchModalMetaDataReady({ data }));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchModalMetaDataFail({ data: 'error' }));
        });
    }
  }
);
