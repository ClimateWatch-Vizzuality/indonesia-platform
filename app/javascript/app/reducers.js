import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Components
import { reduxModule as modalMetadata } from 'components/modal-metadata';

// Router
import router from './router';

const componentsReducers = { modalMetadata: handleModule(modalMetadata) };

export default combineReducers({
  location: router.reducer,
  ...componentsReducers
});
