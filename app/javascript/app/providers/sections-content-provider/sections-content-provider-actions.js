import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

import isEmpty from 'lodash/isEmpty';

export const fetchSectionsContentInit = createAction(
  'fetchSectionsContentInit'
);
export const fetchSectionsContentReady = createAction(
  'fetchSectionsContentReady'
);
export const fetchSectionsContentFail = createAction(
  'fetchSectionsContentFail'
);

export const fetchSectionsContent = createThunkAction(
  'fetchSectionsContent',
  () => (dispatch, state) => {
    const { SectionsContent } = state();
    const locale = state().location &&
      state().location.payload &&
      state().location.payload.locale;
    const params = { locale };
    if (
      SectionsContent &&
        SectionsContent.data &&
        isEmpty(SectionsContent.data[locale]) &&
        !SectionsContent.loading
    ) {
      dispatch(fetchSectionsContentInit());
      INDOAPI
        .get('section_content', params)
        .then(data => {
          if (data) {
            const sectionsContentMapped = {};
            data.forEach(section => {
              sectionsContentMapped[section.locale] = {
                ...sectionsContentMapped[section.locale],
                [section.slug]: {
                  title: section.title,
                  description: section.description
                }
              };
            });
            dispatch(fetchSectionsContentReady({ sectionsContentMapped }));
          } else {
            dispatch(fetchSectionsContentReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchSectionsContentFail(error && error.message));
        });
    }
  }
);
