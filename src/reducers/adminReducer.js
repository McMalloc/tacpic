import { USER_ADMIN, ADMIN, ORDER_ADMIN } from '../actions/action_constants';
import { admin } from '../store/initialState';
import createReducer from './createReducer';

const reducerMapping = {
    [USER_ADMIN.INDEX.SUCCESS]: (prevState, action) => ({ ...prevState, users: action.data }),

    [USER_ADMIN.GET.REQUEST]: (prevState, action) => ({ ...prevState, currentUser: null, currentUserPending: true }),
    [USER_ADMIN.GET.SUCCESS]: (prevState, action) => ({ ...prevState, currentUser: action.data, currentUserError: null, currentUserPending: false }),
    [USER_ADMIN.GET.FAILURE]: (prevState, action) => ({ ...prevState, currentUser: null, currentUserError: action.message, currentUserPending: false }),

    [ADMIN.BACKEND_ERRORS.SUCCESS]: (prevState, action) => ({ ...prevState, backendErrors: action.data }),
    [ADMIN.LOG_INDEX.SUCCESS]: (prevState, action) => ({ ...prevState, logfiles: action.data }),
    [ADMIN.LOG.SUCCESS]: (prevState, action) => ({ ...prevState, currentLogfile: action.data }),
    [ADMIN.FRONTEND_ERRORS.SUCCESS]: (prevState, action) => ({ ...prevState, frontendErrors: action.data }),
    [ORDER_ADMIN.INDEX.SUCCESS]: (prevState, action) => ({ ...prevState, orders: action.data }),

    [ORDER_ADMIN.GET.REQUEST]: (prevState, action) => ({ ...prevState, currentOrder: null, currentOrderPending: true }),
    [ORDER_ADMIN.GET.SUCCESS]: (prevState, action) => ({ ...prevState, currentOrder: action.data, currentOrderError: null, currentOrderPending: false }),
    [ORDER_ADMIN.GET.FAILURE]: (prevState, action) => ({ ...prevState, currentOrder: null, currentOrderError: action.message, currentOrderPending: false }),

    [ADMIN.VOUCHER_INDEX.REQUEST]: (prevState, action) => ({ ...prevState, vouchers: [], vouchersPending: true }),
    [ADMIN.VOUCHER_INDEX.SUCCESS]: (prevState, action) => ({ ...prevState, vouchers: action.data, vouchersError: null, vouchersPending: false }),
    [ADMIN.VOUCHER_INDEX.FAILURE]: (prevState, action) => ({ ...prevState, vouchers: [], vouchersError: action.message, vouchersPending: false })
}

export default createReducer(admin, reducerMapping)