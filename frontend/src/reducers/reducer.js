import { combineReducers } from 'redux';
import statisticReducer from './statisticReducer';
import conversationsReducer from './conversationsReducer';
import currentUserReducer from './currentUserReducer';
import selectionReducer from './selectionReducer';
import faqReducer from './faqReducer';
import appReducer from './appReducer';

export default combineReducers({
  statistics: statisticReducer,
  conversationsInfo: conversationsReducer,
  currentUser: currentUserReducer,
  selection: selectionReducer,
  faq: faqReducer,
  app: appReducer,
});
