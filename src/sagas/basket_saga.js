import {takeLatest, select} from 'redux-saga/effects';
import {ITEM_ADDED_TO_BASKET, ITEM_REMOVED_FROM_BASKET} from "../actions/action_constants";

export function* basketChangeSaga() {
    yield takeLatest([ITEM_ADDED_TO_BASKET, ITEM_REMOVED_FROM_BASKET], function* (action) {
        try {
            const basket = yield select(state=>state.catalogue.basket);
            localStorage.setItem('basket', JSON.stringify(basket));
        } catch (error) {
            console.error(error);
        }
    });
}