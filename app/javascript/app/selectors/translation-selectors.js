import { createSelector } from 'reselect';
import get from 'lodash/get';

import { DEFAULT_LANGUAGE } from 'constants/languages';

export const getTranslations = ({ translations }) =>
  translations && translations.data;

export const getTranslate = createSelector(
  [ getTranslations ],
  translations => function(key) {
    return get(translations, key);
  }
);

export const getLocale = ({ location }) =>
  get(location, 'payload.locale', DEFAULT_LANGUAGE);
