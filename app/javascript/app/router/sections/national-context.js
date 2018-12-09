export default [
  {
    slug: 'socioeconomic',
    path: '/:locale/national-context',
    exact: true,
    default: true
  },
  {
    slug: 'historical-emissions',
    path: '/:locale/national-context/historical-emissions'
  },
  {
    slug: 'sectoral-activity',
    path: '/:locale/national-context/sectoral-activity'
  },
  { slug: 'climate-funding', path: '/:locale/national-context/climate-funding' }
];
