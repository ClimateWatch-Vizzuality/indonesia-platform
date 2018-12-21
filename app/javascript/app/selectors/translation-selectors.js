import { getTranslation } from 'utils/translations';
import { createSelector } from 'reselect';
import get from 'lodash/get';

const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

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

export const getLocale = ({ location }) => get(location, 'payload.locale');
