import {cloneDeep, filter, includes, find, compact} from "lodash"
import {
    VARIANT,
    FILE,
    GRAPHIC,
    OBJECTS_SWAPPED,
    SET_PAGE_RENDERINGS,
    BRAILLE_BULK_TRANSLATED,
    UPDATE_BRAILLE_CONTENT,
    CHANGE_FILE_PROPERTY,
    CHANGE_PAGE_CONTENT,
    OBJECT_UPDATED, OBJECT_BULK_ADD, CHANGE_IMAGE_DESCRIPTION
} from "../actions/action_constants";
import methods from "../components/editor/ReactSVG/methods/methods";
import uuidv4 from "../utility/uuid";
import deepPull from "../utility/deepPull";
import {editor as initialEditor} from "../store/initialState";
import {produce} from "immer";
import {A4_HEIGHT, A4_MAX_CHARS_PER_ROW, A4_MAX_ROWS_PER_PAGE, A4_WIDTH, PAGE_NUMBER_BOTTOM} from "../config/constants";
import {wrapAndChunk} from "../utility/wrapLines";
import move from "../utility/move";

// let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so || rausnehmen, da jetzt vom internen State des Editors verwaltet, ODER?
const getSelectedObjects = (objects, selected) => {
    if (selected.length === 1) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].uuid === selected[0]) return [objects[i]];
        }
    } else {
        return objects.filter(object => selected.includes(object.uuid));
    }
};

const file = (state = {}, action) => {
    let objects, oldState, index;
    switch (action.type) {
        case VARIANT.UPDATE.REQUEST:
            return {...state, state: 'updating'};
        case VARIANT.UPDATE.SUCCESS:
            return {...state, state: 'success'};
        case VARIANT.UPDATE.FAILURE:
            return {...state, state: 'failure'};

        case GRAPHIC.CREATE.REQUEST:
        case VARIANT.CREATE.REQUEST:
            return {...state, state: 'updating'};
        case GRAPHIC.CREATE.SUCCESS:
            return {
                ...state,
                state: 'success',
                variant_id: action.data.default_variant.id,
                graphic_id: action.data.created_graphic.id
            };
        case VARIANT.CREATE.SUCCESS:
            console.log(action);
            return {...state, state: 'success', variant_id: action.data.variant_id};
        case GRAPHIC.CREATE.FAILURE:
        case VARIANT.CREATE.FAILURE:
            return {...state, state: 'failure'};

        case OBJECTS_SWAPPED:
            return produce(state, draftState => {
                draftState.pages[action.shared_currentPage].objects =
                    move(draftState.pages[action.shared_currentPage].objects, action.from, action.to);
            });
        case 'OBJECT_ROTATED':
            oldState = {...state};
            objects = getSelectedObjects(oldState.pages[action.shared_currentPage].objects, action.uuids);

            if (objects.length === 1) {
                methods[objects[0].type].rotate(
                    objects[0],
                    action.coords.x,
                    action.coords.y
                );
            } else if (objects.length > 1) {
                methods.selection.rotate(objects, action.coords.x, action.coords.y)
            }

            return oldState;
        case OBJECT_UPDATED:
            return produce(state, draftState => {
                index = draftState
                    .pages[action.shared_currentPage]
                    .objects
                    .findIndex(obj => obj.uuid === action.preview.uuid);
                if (index === -1) { // add if not present TODO: delete old adding method
                    draftState.pages[action.shared_currentPage].objects.push(action.preview);
                } else {
                    draftState.pages[action.shared_currentPage].objects[index] = action.preview;
                }
            });
        case OBJECT_BULK_ADD:
            return produce(state, draftState => {
                draftState
                    .pages[action.shared_currentPage].objects.push(...action.objects)
            });
        case 'OBJECT_TRANSLATED':
            // TODO sauberer für nested objects
            oldState = {...state};

            oldState.pages[action.shared_currentPage].objects.forEach(object => {
                if (!includes(action.uuids, object.uuid)) return;
                methods[object.type].translate(object, action.coords.x, action.coords.y);
            });

            return oldState;
        case 'OBJECT_SCALED':
            // TODO sauberer für nested objects
            oldState = {...state};

            oldState.pages[action.shared_currentPage].objects.forEach(object => {
                if (!includes(action.uuids, object.uuid)) return;
                methods[object.type].scale(object, action.coords.x, action.coords.y);
            });

            return oldState;
        case 'OBJECT_PROP_CHANGED':
            // TODO nested Objects / andere ausgewählte Seite
            return produce(state, draftState => {
                filter(draftState.pages[action.shared_currentPage].objects,
                    {uuid: action.uuid}).forEach(object => {
                    object[action.prop] = action.value;

                    if (action.prop === "isKey") {// && object.keyVal.length === 0) {
                        object.keyVal = object.text.slice(0, 3).toLowerCase();
                    }
                });
            });
        case BRAILLE_BULK_TRANSLATED:
            return produce(state, draftState => {
                draftState.pages.forEach((page, index) => {
                    page.objects.forEach(object => {
                        if (object.type === 'label') {
                            let translated = action.labels.find(label => label.uuid === object.uuid);
                            if (translated) {
                                object.braille = translated.braille;
                            }
                        }
                    })
                });
                const pages = action.labels.find(label => label.uuid === '_BRAILLE_PAGES');
                if (pages) {
                    draftState.braillePages.braille = pages.braille;
                    draftState.braillePages.formatted = wrapAndChunk(pages.braille, draftState.braillePages.cellsPerRow, draftState.braillePages.rowsPerPage);
                }
            });
        case CHANGE_FILE_PROPERTY:
            return {
                ...state,
                [action.key]: action.value
            };
        case 'CHANGE_BRAILLE_PAGE_PROPERTY':
            let value = parseInt(action.value);
            const {marginTop, marginLeft, rowsPerPage, cellsPerRow, width, height, pageNumbers} = state.braillePages;

            return produce(state, draftState => {
                draftState.braillePages[action.key] = value;

                if (width === A4_WIDTH && height === A4_HEIGHT) {
                    switch (action.key) {
                        case "marginTop":
                            if (value + rowsPerPage > A4_MAX_ROWS_PER_PAGE) draftState.braillePages.rowsPerPage = A4_MAX_ROWS_PER_PAGE - value;
                            break;
                        case "rowsPerPage":
                            if (marginTop + value > A4_MAX_ROWS_PER_PAGE) draftState.braillePages.marginTop = A4_MAX_ROWS_PER_PAGE - value;
                            break;
                        case "marginLeft":
                            if (value + cellsPerRow > A4_MAX_CHARS_PER_ROW) draftState.braillePages.cellsPerRow = A4_MAX_CHARS_PER_ROW - value;
                            break;
                        case "cellsPerRow":
                            if (marginLeft + value > A4_MAX_CHARS_PER_ROW) draftState.braillePages.marginLeft = A4_MAX_CHARS_PER_ROW - value;
                            break;
                        case "pageNumbers":
                            if (value === PAGE_NUMBER_BOTTOM && rowsPerPage + marginTop >= A4_MAX_ROWS_PER_PAGE) { // one more row for space when page numbering at the bottom is enabled
                                draftState.braillePages.rowsPerPage = draftState.braillePages.rowsPerPage - 1;
                            }
                            break;
                    }
                }
            });
        case CHANGE_PAGE_CONTENT:
            return produce(state, draftState => {
                draftState.braillePages.content = action.content;
            });
        case CHANGE_IMAGE_DESCRIPTION:
            return produce(state, draftState => {
                draftState.braillePages.imageDescription = action.imageDescription;
            });
        case UPDATE_BRAILLE_CONTENT:
            // called when the saga has finished processing the remote braille translation
            return produce(state, draftState => {
                draftState.braillePages.braille = action.braille;
                draftState.braillePages.formatted = action.formatted;
            });
        case FILE.OPEN.REQUEST:
            return {...initialEditor.file.present, ...action.data};
        case FILE.OPEN.SUCCESS:
            let current_file = {...state};
            if (current_file.variant_id === null) {
                delete action.data.derivedFrom;
                if (current_file.graphic_id !== null) {
                    delete action.data.variant_id;
                    delete action.data.variantTitle;
                }
            }
            for (let [key, value] of Object.entries(action.data)) { // assign new values, keep defaults
                current_file[key] = value;
            }
            return current_file;
        case 'OBJECT_REMOVED':
            oldState = cloneDeep(state);

            // TODO make possible for objects in groups
            action.uuids.forEach(uuid => {
                let index = oldState.pages[action.shared_currentPage].objects.findIndex(object => {
                    return object.uuid === uuid
                });
                oldState.pages[action.shared_currentPage].objects.splice(index, 1);
            });

            return oldState;
        case 'PAGE_ADD':
            let title, braille = "";
            state.pages.forEach((page, index) => {
                page.objects.forEach(object => {
                    if (object.type === 'label' && object.isTitle) {
                        title = object.text;
                        braille = object.braille;
                    }
                })
            });
            return produce(state, draftState => {
                draftState.pages.push({
                    name: 'Seite ' + (state.pages.length + 1),
                    objects: [methods.label.create(10, 10, 350, 75, title, braille, {isTitle: true, editMode: false, pristine: false})],
                    render: '',
                });
            });
        case 'PAGE_REMOVE':
            return produce(state, draftState => {
                draftState.pages.splice(action.index, 1);
            });
        case 'KEY_TEXTURE_CHANGED':
            return produce(state, draftState => {
                const index = draftState.keyedTextures.findIndex(entry => entry.pattern === action.pattern);
                if (index !== -1) {
                    // Texture is already added, update label
                    draftState.keyedTextures[index].label = action.label;
                } else {
                    // add new texture
                    draftState.keyedTextures.push({pattern: action.pattern, label: action.label, braille: ""});
                }
            });
        case 'KEY_TEXTURE_TRANSLATED':
            return produce(state, draftState => {
                const index = draftState.keyedTextures.findIndex(entry => entry.pattern === action.pattern);
                if (index !== -1) {
                    draftState.keyedTextures[index].braille = action.braille;
                }
            });
        case 'OBJECTS_GROUPED':
            oldState = {...state};

            objects = oldState.pages[action.shared_currentPage].objects;
            let groupedObjects = deepPull(objects, action.uuids);
            objects.push({
                uuid: uuidv4(),
                x: 0,
                y: 0,
                objects: groupedObjects,
                moniker: "Gruppe",
                type: 'group'
            });

            oldState.pages[action.shared_currentPage].objects = compact(objects);
            return oldState;
        case 'OBJECTS_UNGROUPED':
            oldState = cloneDeep(state);
            objects = oldState.pages[action.shared_currentPage].objects;

            let groupIndex = objects.findIndex(o => o.uuid === action.uuid[0]);

            // apply transformations of the group to all children
            objects[groupIndex].objects.forEach(object => {
                // TODO: andere außer translate()
                methods[object.type].translate(object, objects[groupIndex].x, objects[groupIndex].y);
            });

            // add children to root, then delete group
            objects[groupIndex].objects.forEach(object => {
                objects.push(object);
            });
            objects.splice(groupIndex, 1);
            return oldState;
        case SET_PAGE_RENDERINGS:
            return produce(state, draftState => {
                draftState.pages.map((page, index) => {
                    if (page.text) return page;
                    page.rendering = action.renderings[index];
                })
            });
        default:
            return state;
    }
};

export default file