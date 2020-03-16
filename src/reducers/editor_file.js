import {cloneDeep, filter, includes, find, compact} from "lodash"
import {VARIANT, FILE} from "../actions/constants";
import methods from "../components/editor/widgets/ReactSVG/methods";
import uuidv4 from "../utility/uuid";
import deepPull from "../utility/deepPull";
import {initialEditor} from "../store";

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
    let objects, oldState;
    switch (action.type) {
        case VARIANT.UPDATE.REQUEST:
            return {...state, state: 'updating'};
        case VARIANT.UPDATE.SUCCESS:
            return {...state, state: 'success'};
        case VARIANT.UPDATE.FAILURE:
            return {...state, state: 'failure'};

        case VARIANT.CREATE.REQUEST:
            return {...state, state: 'updating'};
        case VARIANT.CREATE.SUCCESS:
            console.log(action);
            return {...state, state: 'success', variant_id: action.data.variant_id};
        case VARIANT.CREATE.FAILURE:
            return {...state, state: 'failure'};

        case 'OBJECT_ADDED':
            oldState = cloneDeep(state);
            oldState.pages[action.shared_currentPage].objects.push(action.object);

            return oldState;
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
            oldState = cloneDeep(state);

            // TODO nested Objects / andere ausgewählte Seite
            filter(oldState.pages[action.shared_currentPage].objects,
                {uuid: action.uuid}).forEach(object => {
                object[action.prop] = action.value;

                if (action.prop === "isKey") {// && object.keyVal.length === 0) {
                    object.keyVal = object.text.slice(0, 3);
                }
            });
            return oldState;
        case 'BRAILLE_BULK_TRANSLATED':
            oldState = cloneDeep(state);

            oldState.pages.forEach(page => {
                page.objects.forEach(object => {
                    if (object.type === 'label') {
                        let translated = action.labels.find(label => label.uuid === object.uuid);
                        object.braille = translated.braille;
                    }
                })
            });

            return oldState;
        case 'CHANGE_FILE_PROPERTY':
            return {
                ...state,
                [action.key]: action.value
            };
        case FILE.OPEN.SUCCESS:
            let current_file = {...initialEditor.file};
            for (let [key, value] of Object.entries(action.data)) { // assign new values, keep defaults
                current_file[key] = value;
            }
            current_file.isNew = action.mode === 'new';
            // debugger;
            return current_file;
        case FILE.OPEN.REQUEST:

            return state;
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
            oldState = {...state};
            oldState.pages.push({name: 'Seite ' + (oldState.pages.length + 1), objects: []});
            return {...state, file};
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
        case 'CACHE_SVG':
            oldState = {...state};
            oldState.pages[action.pageNumber].cache = action.markup;
            return {
                ...state,
                file: oldState
            };
        case 'NEW_GRAPHIC_STARTED':
            return {...initialEditor.file};
        case 'DOCUMENT_PROP_CHANGED':
            return {...state, [action.prop]: action.value};
        default:
            return state;
    }
};

export default file