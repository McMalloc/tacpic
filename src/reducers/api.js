import {USER} from '../actions/constants';

const api = (state = {user: {logged_in: false, login_pending: false, error: null}}, action) => {
    switch (action.type) {
        case USER.LOGIN.REQUEST:
            return {
                ...state, user:
                    {
                        login_pending: true
                    }
            };
        case USER.LOGIN.SUCCESS:
            return {
                ...state, user:
                    {
                        login_pending: false,
                        logged_in: true
                    }
            };
        case USER.LOGIN.FAILURE:
            return {
                ...state, user:
                    {
                        login_pending: false,
                        logged_in: false,
                        error: action.error
                    }
            };
        default:
            return state;
    }
};

// add object
// moved object
// removed object

/*
Wann kann sich etwas am Canvas ändern und wie wird das kommuniziert?
- Mausklick                         Klickevent, fabric Event
- Redo / Undo                       Dispatcher, fabric Events (mitunter sehr viele)
- Laden einer Grafik                Dispatcher, fabric Events (mitunter sehr viele)
- Neuladen der Seite                Dispatcher, fabric Events (mitunter sehr viele)
- programmatisch / automatisiert    Dispatcher, fabric Events

*/


export default api