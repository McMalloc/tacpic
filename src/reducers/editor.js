import _ from "lodash"

const initialState = {
    mode: 'rect',
    texture: 'striped',
    width: 500,
    fill: '#ccc',
    height: 500,
    mouseOffset: {
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0
    },
    currentPage: 0,
    objects: [],
    selectedObjects: [],
    openedFile: {
        title: "Eine Datei",
        pages: [
            {
                name: "Seite 1"
            },
            {
                name: "Seite 2"
            }
        ]
    },
    initialized: false,
    widgetConfig: [ //TODO aus config laden
        {
            i: "Canvas",
            x: 0,
            y: 0,
            w: 8,
            h: 15,
            visible: true,
            static: false
        }, {
            i: "Toolbox",
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            visible: true,
            static: false
        }, {
            i: "History",
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            visible: true,
            static: false
        }, {
            i: "Navigator",
            x: 0,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        },
        {
            i: "Objects",
            x: 3,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        },
        {
            i: "Context",
            x: 0,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        },
        {
            i: "Pages",
            x: 5,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        }
    ]
};

let lastMode = initialState.mode;

const editor = (state = initialState, action) => {
    let selectedObjects;
    switch (action.type) {
        case 'OBJECT_ADDED':
            let objects = [...state.objects];
            objects.push(action.object);
            return {...state, objects};

        case 'OBJECT_SELECTED':
            selectedObjects = [action.uuid];
            return {...state, selectedObjects};

        case 'OBJECT_ROTATED':
            // TODO für Mittwoch hier muss doch der angle für alle berechnet werden

            var objects = [...state.objects];

            _.filter(objects, {uuid: state.selectedObjects[0]}).forEach(object => {
                object.angle = Math.sqrt(Math.pow(action.coords.x1 - action.coords.x0, 2) + Math.pow(action.coords.y1 - action.coords.y0, 2));
            });
            return {...state, objects};
        case 'TRANSFORM_START':
            lastMode = state.mode;
            return {...state, mode: action.transform};

        case 'TRANSFORM_END':
            return {...state, mode: lastMode};

        case 'SWITCH_CURSOR_MODE':
            return {...state, mode: action.mode};
        case 'SWITCH_TEXTURE_MODE':
            return {...state, texture: action.mode};
        case 'SWITCH_FILL_MODE':
            return {...state, fill: action.colour};
        case 'PATTERNS_INIT_DONE':
            return {...state, initialized: true};
        case 'PAGE_CHANGE':
            return {...state, currentPage: action.number};
        case 'PAGE_ADD':
            let openedFile = {...state.openedFile};
            openedFile.pages.push({name: 'Seite ' + (openedFile.pages.length + 1)});
            return {...state, openedFile};
        case 'WIDGET_VISIBILITY_TOGGLED':
            return {
                ...state,
                widgetConfig: state.widgetConfig.map(widget => {
                    if (widget.i !== action.id) { return widget; } else {
                        widget.visible = action.value;
                        return widget;
                    }
                })
            };
        default:
            return state;
    }
};

export default editor
// export default editor