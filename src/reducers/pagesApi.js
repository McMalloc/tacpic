import {PAGE} from '../actions/constants';

const pagesApi = (state = {}, action) => {
    switch (action.type) {
        case PAGE.GET.REQUEST:
            return {
                ...state
            };
        case PAGE.GET.SUCCESS:
            return {
                ...state, [action.page.id]: action.page.content.rendered
            };
        case PAGE.GET.FAILURE:
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


export default pagesApi