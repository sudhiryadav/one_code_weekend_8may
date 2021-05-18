import { all } from 'redux-saga/effects';
import userSagas from './members';

export default function* rootSaga() {
    yield all([...userSagas]);
}
