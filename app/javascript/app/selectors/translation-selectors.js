import { createSelector } from 'reselect';
import get from 'lodash/get';

const getTranslations = ({ translations }) => translations && translations.data;

export const getTranslate = createSelector(
  [ getTranslations ],
  translations => function(key, options = {}) {
    return get(translations, key, options.default || '');
  }
);

export const getLocale = ({ location }) => get(location, 'payload.locale');
