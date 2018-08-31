import undoable from './undoable'

const initialState = {
    mode: 'rect',
    texture: 'striped',
    width: 0,
    height: 0,
    initialized: false
};

const editor = (state = initialState, action) => {
    switch (action.type) {
        case 'SWITCH_CURSOR_MODE':
            return {...state, mode: action.mode};
        case 'SWITCH_TEXTURE_MODE':
            return {...state, texture: action.mode};

        case 'CANVAS_UPDATED':
            return {...state, canvas: action.serializedCanvas};
        case 'CANVAS_RESIZED':
            return {...state, width: action.width, height: action.height};

        case 'PATTERNS_INIT_DONE':
            return {...state, initialized: true};
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