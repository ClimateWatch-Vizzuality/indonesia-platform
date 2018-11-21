export default [
  {
    slug: 'overview',
    label: 'Overview',
    path: '/:locale/climate-goals',
    exact: true,
    default: true
  },
  {
    slug: 'mitigation',
    label: 'Mitigation',
    path: '/:locale/climate-goals/mitigation'
  },
  {
    slug: 'adaptation',
    label: 'Adaptation',
    path: '/:locale/climate-goals/adaptation'
  },
  {
    slug: 'sectoral-information',
    label: 'Sectoral information',
    path: '/:locale/climate-goals/sectoral-information'
  }
];
