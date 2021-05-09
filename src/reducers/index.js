
import { combineReducers } from 'redux';
import { membersReducer } from './members';

export default combineReducers({
    members: membersReducer
});
