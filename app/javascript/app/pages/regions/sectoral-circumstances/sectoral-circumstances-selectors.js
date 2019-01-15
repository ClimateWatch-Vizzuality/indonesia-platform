import { getTranslate } from 'selectors/translation-selectors';
import { createStructuredSelector } from 'reselect';

export const getSectoralCircumstances = createStructuredSelector({
  t: getTranslate
});
