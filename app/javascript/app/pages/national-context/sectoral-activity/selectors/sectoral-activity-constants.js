// slug
export const NO_DATA = 'no-data';

export const ADAPTATION_CODE = 'Adap_13';

export const EMISSIONS_UNIT = `MtCO<sub>2</sub>e`;

// not present in the API
export const PRIMARY_SOURCE_OF_EMISSION_INDICATOR = 'primary-source-of-emissions';

// colors for sections
export const SECTION_COLORS = {
  WASTE: '#06214C',
  AGRICULTURE: '#FC7E4B',
  ENERGY: '#2EC9DF',
  FORESTRY: '#FCA683',
  INDUSTRIAL_PROCESS_AND_PRODUCT_USE: '#FFC735',
  'no-data': '#ffffff'
};

// colors for activities
export const COLORS = [ '#06214C', '#FC7E4B', '#2EC9DF', '#FCA683', '#FFC735' ];

// colors for adaptation
export const YES_NO_COLORS = { no: '#001880', yes: '#2EC9DF' };

export const ISOS_NOT_ALLOWED = [ 'IDN' ];

export const getMapStyles = color => ({
  default: {
    fill: color,
    fillOpacity: 1,
    stroke: '#ffffff',
    strokeWidth: 0.2,
    outline: 'none'
  },
  hover: { fill: color, stroke: '#ffffff', strokeWidth: 0.6, outline: 'none' },
  pressed: { fill: color, stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' }
});

export const LOCATION_ISO_CODE = 'location_iso_code3';
