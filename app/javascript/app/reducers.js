import { combineReducers } from 'redux';
// import { handleModule } from 'redux-tools';

// Router
import router from './router';

export default combineReducers({
  location: router.reducer
});
