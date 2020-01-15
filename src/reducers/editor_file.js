import {cloneDeep, filter, includes, find, compact} from "lodash"
import {VERSION} from "../actions/constants";
import methods from "../components/editor/widgets/ReactSVG/methods";
import uuidv4 from "../utility/uuid";
import deepPull from "../utility/deepPull";

let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so

const file = (state = {}, action) => {
    let objects, oldState;
    switch (action.type) {
        case 'OBJECT_ADDED':
            oldState = cloneDeep(state);
            oldState.pages[action.shared_currentPage].objects.push(action.object);

            return oldState;
        case 'PATH_POINT_ADDED':
            oldState = cloneDeep(state);
            let currentPath = find(oldState.pages[0].objects, {uuid: action.uuid});

            if (action.point.kind.length === 0) { // control point, prepend to coords
                let currentPoint = currentPath.points[currentPath.points.length - 1].coords;

                // TODO: M wird beim Schließend es Pfades mit dem letzten Vertex in diesem Block gleichgesetzt, obwohl das dazugehörige Objekt nicht angefasst wird.
                let backup = cloneDeep(currentPath.points[0]);
                if (currentPath.points[currentPath.points.length - 1].kind === 'M') return;

                currentPoint[2] = currentPoint[0];
                currentPoint[3] = currentPoint[1];
                currentPoint[0] = action.point.coords[0];
                currentPoint[1] = action.point.coords[1];

                currentPath.points[0] = backup;
            } else { // new vertex
                if (action.circular) { // last point will be at the same position as M
                    action.point.coords = currentPath.points[0].coords;
                }
                currentPath.points.push(action.point);
            }

            return oldState;
        case 'OBJECT_ROTATED':
            oldState = {...state};

            oldState.pages[action.shared_currentPage].objects.forEach(object => { // refactor selective function
                if (!includes(action.uuids, object.uuid)) return;

                methods[object.type].rotate(
                    object,
                    action.coords.x,
                    action.coords.y
                );
            });

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

            filter(oldState.pages[action.shared_currentPage].objects,
                {uuid: action.uuid}).forEach(object => {
                object[action.prop] = action.value;

                if (action.prop === "isKey" && object.keyVal === '') {
                    object.keyVal = object.text.slice(0, 3);
                }
            });
            return oldState;
        case 'CHANGE_TITLE':
            return {...state, file: {
                    ...state,
                    title: action.title
                }};
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
        case 'CHANGE_CATALOGUE_TITLE':
            return {...state, file: {
                    ...state,
                    catalogueTitle: action.title
                }};
        case 'CHANGE_CATEGORY':
            return {...state, file: {
                    ...state,
                    category: action.catID
                }};
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
            objects[groupIndex].objects.forEach(object => { objects.push(object); });
            objects.splice(groupIndex, 1);
            return oldState;
        case 'CACHE_SVG':
            oldState = {...state};
            oldState.pages[action.pageNumber].cache = action.markup;
            return {
                ...state,
                file: oldState
            };
        default:
            return state;
    }
};

export default file