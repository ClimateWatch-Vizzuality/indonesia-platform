import { createStructuredSelector } from 'reselect';

const getSource = ({ location }) =>
  location.query ? location.query.source : null;

export const getGHGEmissions = createStructuredSelector({
  selectedSource: getSource
});
