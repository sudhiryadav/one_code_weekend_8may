import { takeEvery, call, put, fork } from 'redux-saga/effects';
import * as actions from '../actions/members';
import * as api from '../api/members';

function* getMembers() {
    try {
        const result = yield call(api.getMembers);
        yield put(actions.getMembersSuccess(result.data));
    } catch (error) {
        console.error(error);
    }
}

function* watchGetMembersRequest() {
    yield takeEvery(actions.Types.GET_MEMBERS_REQUEST, getMembers);
}

const userSagas = [fork(watchGetMembersRequest)];

export default userSagas;
