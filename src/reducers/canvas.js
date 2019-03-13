import {CANVAS_OBJECT_ADDED, CANVAS_OBJECT_REMOVED} from "../actions/constants";
// import undoable from "./undoable";
import _ from 'lodash';

const initialState = {
    objects: [],
    selectedObjects: [],
    width: 500, //temporär
    height: 500 //temporär
};

let lastObjectsProps = [];

const canvas = (state = initialState, action) => {
    let selectedObjects, objects;
    switch (action.type) {
        case 'OBJECT_ADDED':
            let objects = [...state.objects];
            objects.push(action.object);
            return {...state, objects};

        case 'OBJECT_SELECTED':
            let selectedObjects = [action.uuid];
            return {...state, selectedObjects};

        case 'OBJECT_ROTATED':
            // TODO ordentliche Rotation

            objects = [...state.objects];

            _.filter(objects, {uuid: state.selectedObjects[0]}).forEach(object => {
                let angle = Math.sqrt(Math.pow(action.coords.x1 - action.coords.x0, 2) + Math.pow(action.coords.y1 - action.coords.y0, 2));
                object.angle = angle;
                object.pattern.angle = -angle; //todo Nur einmalig setzen und in der Komponenten weiterreichen bzw. umrechnen.
            });
            return {...state, objects};

        case 'OBJECT_TRANSLATED':
            // TODO sauberer für nested objects

            objects = [...state.objects];

            if (lastObjectsProps.length === 0) {
                _.every(objects, (object, index) => {
                    lastObjectsProps[index] = {};
                    lastObjectsProps[index].x = object.x;
                    lastObjectsProps[index].y = object.y;
                });
            }

            _.filter(objects, {uuid: state.selectedObjects[0]}).forEach((object, index) => {
                object.x = lastObjectsProps[index].x + action.coords.x1 - action.coords.x0;
                object.y = lastObjectsProps[index].y + action.coords.y1 - action.coords.y0;
            });

            return {...state, objects};
        case 'TRANSFORM_END':
            lastObjectsProps = [];
            return state;
        default:
            return state;
    }
};

export default canvas
// export default undoable(canvas)