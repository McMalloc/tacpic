import {takeLatest, select, put} from 'redux-saga/effects';
import {
    ITEM_ADDED_TO_BASKET,
    ITEM_REMOVED_FROM_BASKET,
    UPDATE_BASKET,
    BASKET_NEEDS_REFRESH,
    ITEM_UPDATED_IN_BASKET,
    ERROR_THROWN,
    CLEAR_BASKET
} from "../actions/action_constants";
import {differenceWith, isEqual} from 'lodash';

export function* basketChangeSaga() {
    yield takeLatest([ITEM_ADDED_TO_BASKET, ITEM_REMOVED_FROM_BASKET, UPDATE_BASKET, ITEM_UPDATED_IN_BASKET, CLEAR_BASKET], function* () {
        try {
            const basket = yield select(state=>state.catalogue.basket);
            console.log(basket)
            localStorage.setItem('basket', JSON.stringify(basket));
        } catch (error) {
            put({type: ERROR_THROWN, error})
        }
    });
}

export function* basketCheckSaga() {
    yield takeLatest(BASKET_NEEDS_REFRESH, function* () {
        try {
            const basket = yield select(state=>state.catalogue.basket);
            const cachedBasket = JSON.parse(localStorage.getItem('basket')) || [];
            const diff = differenceWith(basket, cachedBasket, isEqual);
            if (diff.length > 0) {
                yield put({type: UPDATE_BASKET, basket: cachedBasket})
            }
        } catch (error) {
            put({type: ERROR_THROWN, error})
        }
    });
}