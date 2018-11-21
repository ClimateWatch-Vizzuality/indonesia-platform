import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Components
import { reduxModule as ghgEmissions } from 'providers/ghg-emissions-provider';
import {
  reduxModule as ghgTargetEmissions
} from 'providers/ghg-target-emissions-provider';
import { reduxModule as modalMetadata } from 'components/modal-metadata';
import { reduxModule as metadata } from 'providers/metadata-provider';
import { reduxModule as worldBank } from 'providers/world-bank-provider';

// Providers
import {
  reduxModule as sectionsContent
} from 'providers/sections-content-provider';

// Router
import router from './router';

const componentsReducers = {
  GHGEmissions: handleModule(ghgEmissions),
  GHGTargetEmissions: handleModule(ghgTargetEmissions),
  modalMetadata: handleModule(modalMetadata),
  metadata: handleModule(metadata),
  WorldBank: handleModule(worldBank)
};

const providerReducers = { SectionsContent: handleModule(sectionsContent) };

export default combineReducers({
  location: router.reducer,
  ...componentsReducers,
  ...providerReducers
});
