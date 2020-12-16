import {
    BRAILLE_BULK_TRANSLATED,
    GRAPHIC,
    NEW_GRAPHIC_STARTED,
    SET_PAGE_RENDERINGS, UPDATE_BRAILLE_CONTENT,
    VARIANT, FILE, CHANGE_FILE_PROPERTY, SUPPRESS_BACKUP
} from "../actions/action_constants";

const actionsToIgnore = [
    ...Object.values({...VARIANT.GET}),
    ...Object.values({...VARIANT.UPDATE}),
    ...Object.values({...GRAPHIC.CREATE}),
    ...Object.values({...VARIANT.GET}),
    ...Object.values({...FILE.OPEN}),
    SET_PAGE_RENDERINGS, NEW_GRAPHIC_STARTED, BRAILLE_BULK_TRANSLATED, UPDATE_BRAILLE_CONTENT, CHANGE_FILE_PROPERTY, SUPPRESS_BACKUP
];

const propsToIgnore = ['editMode'];

const undoable = reducer => {
    const initialState = {
        past: [],
        present: reducer(undefined, {}),
        future: []
    }
    return (state = initialState, action) => {
        const { past, present, future } = state;
        switch (action.type) {
            case 'CLEAR':
                return {
                    past: [],
                    present,
                    future: []
                }
            case 'UNDO':
                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);
                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future]
                }
            case 'REDO':
                const next = future[0];
                const newFuture = future.slice(1);
                return {
                    past: [...past, present],
                    present: next,
                    future: newFuture
                }
            default:
                // console.log("in undoable");
                const newPresent = reducer(present, action);
                if (present === newPresent) {
                    return state
                }
                if (actionsToIgnore.includes(action.type) || (!!action.prop && propsToIgnore.includes(action.prop))) { // diese Aktionen nicht der history hinzufügen, aber ausführen
                    // console.log(action.prop + " ignored");
                    return {
                        ...state,
                        present: reducer(present, action)
                    }
                }
                return {
                    past: [...past, present],
                    present: newPresent,
                    future: []
                }
        }
    }
};

export default undoable;