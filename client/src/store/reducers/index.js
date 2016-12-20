import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import error from './error';
import ui from './ui';
import notifications from './notifications';
import authentication from './authentication';
import isomorphic from './isomorphic';
import developer from './developer';
import entityStore from './entityStore';
import entityEditor from './entityEditor';

const routing = routerReducer;
const reducers = combineReducers({
  entityStore,
  entityEditor,
  error,
  ui,
  notifications,
  routing,
  authentication,
  isomorphic,
  developer
});
export default reducers;
