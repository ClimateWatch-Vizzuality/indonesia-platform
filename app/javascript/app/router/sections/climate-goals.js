export default [
  {
    slug: 'overview',
    path: '/:locale/climate-goals',
    exact: true,
    default: true
  },
  { slug: 'mitigation', path: '/:locale/climate-goals/mitigation' },
  { slug: 'adaptation', path: '/:locale/climate-goals/adaptation' },
  {
    slug: 'sectoral-information',
    path: '/:locale/climate-goals/sectoral-information'
  }
];
