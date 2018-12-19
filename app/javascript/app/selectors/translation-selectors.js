import { getTranslation } from 'utils/translations';
import { createSelector } from 'reselect';
import get from 'lodash/get';

import { DEFAULT_LANGUAGE } from 'constants/languages';

const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

export const getTranslations = ({ translations }) =>
  translations && translations.data;

export const getTranslate = createSelector(
  [ getTranslations ],
  translations => function(key) {
    return get(translations, key);
  }
);

export const getTranslatedContent = requestedTranslations =>
  createSelector([ getSectionsContent ], data => {
    if (!data) return null;
    const translatedKeys = {};
    requestedTranslations.forEach(translation => {
      translatedKeys[translation.label] = getTranslation(
        data,
        translation.slug,
        translation.key
      );
    });
    return translatedKeys;
  });

export const getLocale = ({ location }) =>
  get(location, 'payload.locale', DEFAULT_LANGUAGE);
