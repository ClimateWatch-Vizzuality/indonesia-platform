export default [
  {
    slug: 'socioeconomic',
    label: 'Socioeconomic indicators',
    path: '/:locale/national-context',
    exact: true,
    default: true
  },
  {
    slug: 'historical-emissions',
    label: 'Historical emissions',
    path: '/:locale/national-context/historical-emissions'
  },
  {
    slug: 'climate-funding',
    label: 'Climate funding',
    path: '/:locale/national-context/climate-funding'
  }
];
