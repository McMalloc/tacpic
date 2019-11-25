import {takeLatest, select} from 'redux-saga/effects';

export default function* lsWatcher() {
    yield takeLatest('LAYOUT_CHANGED', saveLayout);
}

const getCurrentLayoutIndex = state => state.editor.ui.currentLayout;

function* saveLayout(action) {
    try {
        const currentLayoutIndex = yield select(getCurrentLayoutIndex);
        if (action.layout.length === 0) return;
        localStorage.setItem('custom_layout_' + currentLayoutIndex, JSON.stringify(action.layout));
    } catch (error) {
        console.error(error);
    }
}