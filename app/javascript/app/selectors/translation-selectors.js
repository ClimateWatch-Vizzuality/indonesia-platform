import { getTranslation } from 'utils/translations';
import { createSelector } from 'reselect';

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
