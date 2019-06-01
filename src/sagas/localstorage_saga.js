import {takeLatest, select} from 'redux-saga/effects';

export default function* lsWatcher() {
    yield takeLatest('LAYOUT_CHANGED', saveLayout);
}

const getCurrentLayoutIndex = state => state.editor.currentLayout;

function* saveLayout(action) {
    try {
        const currentLayoutIndex = yield select(getCurrentLayoutIndex);
        if (action.layout.length === 0) return;
        console.log("saga: ", action.layout);
        localStorage.setItem('custom_layout_' + currentLayoutIndex, JSON.stringify(action.layout));
    } catch (error) {
        console.error(error);
    }
}