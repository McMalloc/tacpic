import undoable from './undoable'

const editor = (state = {mode: 'rect', width: 0, height: 0}, action) => {
    switch (action.type) {
        case 'SWITCH_CURSOR_MODE':
            return {...state, mode: action.mode};
        case 'CANVAS_UPDATED':
            return {...state, canvas: action.serializedCanvas};
        case 'CANVAS_RESIZED':
            return {...state, width: action.width, height: action.height};
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


export default undoable(editor)
// export default editor