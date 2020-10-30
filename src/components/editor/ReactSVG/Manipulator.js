import React from 'react'
import methods, {combineBBoxes} from "./methods/methods";
import {useDispatch, useSelector} from "react-redux";
import transform from "./transform";

const doubleClickHandler = (dispatch, selected, onModeChange) => {
    if (selected.length === 1) {
        let lastSelectedId = selected[0].uuid;
        if (selected[0].type === 'label') {
            setTimeout(() => {
                document.getElementById("editable_" + lastSelectedId).focus();
            }, 0);
            startEditing(dispatch, lastSelectedId);
        } else if (selected[0].type === 'path') {
            onModeChange(selected[0].uuid);
            startEditing(dispatch, lastSelectedId);
        }
    }
};

const startEditing = (dispatch, uuid) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        prop: 'editMode',
        value: true,
        uuid
    });

    dispatch({
        type: 'OBJECT_SELECTED',
        uuids: [null]
    });
};

const Manipulator = props => {
    const selected = [props.selected];

    const {scalingFactor, viewPortX, viewPortY} = useSelector(state => state.editor.ui);
    const dispatch = useDispatch();

    if (!selected) return null;
    if (!selected[0]) return null;
    // if (Object.keys(selected[0]).length === 0 && selected[0].constructor === Object) return null;

    let width, height, transformProperty;
    if (selected.length === 1) { // single objects
        const bbox = methods[selected[0].type].getBBox(selected[0]);
        width = bbox.width * scalingFactor;
        height = bbox.height * scalingFactor;
        transformProperty = transform(
            bbox.x * scalingFactor + viewPortX,
            bbox.y * scalingFactor + viewPortY,
            selected[0].angle,
            width,
            height
        );

    } else if (selected.length > 1 || selected.type === 'group') { // multiple selected
        const bbox = combineBBoxes(selected);
        width = bbox.width;
        height = bbox.height;
        transformProperty = transform(
            bbox.x,
            bbox.y,
            0,
            width,
            height
        );
    }


    return (
        <g transform={transformProperty}>
            <rect
                fill={"none"}
                // filter="url(#f1)"
                style={{outline: "2px dashed rgba(255, 20, 147, 0.8)"}}
                data-transformable={1}
                data-role={"MANIPULATOR"}
                onDoubleClick={() => doubleClickHandler(dispatch, selected, props.onModeChange)}
                width={width}
                height={height}
            />
            {selected.length === 1 &&
            <>
                {selected[0].type !== 'path' &&
                <>
                    <rect
                        x={width / 2 - 5}
                        style={{cursor: "pointer"}}
                        data-role={"ROTATE"}
                        y={-10}
                        width={10} height={10}/>
                    <rect
                        x={width - 5}
                        y={height - 5}
                        data-role={"SCALE"}
                        width={10} height={10}/>
                </>

                }


            </>
            }
        </g>

    )
};

export default Manipulator;