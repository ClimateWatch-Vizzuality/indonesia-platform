export default [
  {
    slug: 'regions-ghg-emissions',
    path: '/:locale/regions/:region/regions-ghg-emissions',
    exact: true,
    province: true,
    default: true
  },
  {
    slug: 'sectoral-circumstances',
    path: '/:locale/regions/:region/sectoral-circumstances',
    province: true
  },
  {
    slug: 'vulnerability-adaptivity',
    path: '/:locale/regions/:region/vulnerability-adaptivity',
    province: true
  },
  {
    slug: 'climate-sectoral-plan',
    path: '/:locale/regions/:region/sectoral-plan',
    province: true
  }
];
