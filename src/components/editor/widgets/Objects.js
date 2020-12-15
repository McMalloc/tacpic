import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from 'styled-components/macro';
import {Icon} from "../../gui/_Icon";
import {AccordeonMenuEntry, AccordeonPanelFlyoutButton} from "../../gui/Accordeon";
import Context from "./Context/Context";
import {useDrag, useDrop} from "react-dnd";
import {OBJECT_ENTRY, OBJECTS_SWAPPED} from "../../../actions/action_constants";

const select = (dispatch, uuid) => {
    dispatch({
        type: 'OBJECT_SELECTED',
        uuids: [uuid]
    });
};
const group = (dispatch, uuids) => {
    dispatch({
        type: 'OBJECT_SELECTED',
        uuids: [null]
    });

    dispatch({
        type: 'OBJECTS_GROUPED',
        uuids
    })
};
const ungroup = (dispatch, uuid) => {
    dispatch({
        type: 'OBJECTS_UNGROUPED',
        uuid
    })
};

const remove = (dispatch, uuid) => {
    dispatch({
        type: 'OBJECT_SELECTED',
        uuids: [null]
    });
    dispatch({
        type: 'OBJECT_REMOVED',
        uuids: [uuid]
    });
};

const ObjectPreview = styled.svg`
  height: 35px;
  max-width: 35px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

const iconMap = {
    rect: 'vector-square',
    ellipse: 'circle',
    label: 'braille',
    key: 'key',
    path: 'bezier-curve'
}

const keyDownHandler = (event, selectedUUID, dispatch) => {
    console.log("keydown");
    switch (event.which) {// TODO use constants instead of magic numbers
        case 46: // DEL
            if (!!selectedUUID) return;
            dispatch({
                type: 'OBJECT_SELECTED',
                uuids: [null]
            });
            dispatch({
                type: 'OBJECT_REMOVED',
                selectedUUID
            });
            break;
        default:
            break;
    }
    return false;
};

const ObjectEntry = props => {
    const ref = useRef(null);
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(false);

    const [{isDragging}, drag] = useDrag({
        item: {type: OBJECT_ENTRY, index: props.index},
        // beginDrag: () => ({...props}),
        collect: (monitor) => {
            return {
                isDragging: !!monitor.isDragging()
            }
        }
    });

    const [{ isOver }, drop] = useDrop({
        accept: OBJECT_ENTRY,
        drop: (item, monitor) => {
            const from = item.index,
                  to = props.index;

            console.log(`from: ${from}, to:${to}, corrected: ${(from > to || Math.abs(from - to) <= 1) ? to : to - 1}`);
            dispatch({
                type: OBJECTS_SWAPPED,
                from, to: (from < to || Math.abs(from - to) <= 1) ? to : to + 1
            });
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    drag(drop(ref));
    if (props.index === -1) return <AccordeonMenuEntry hovered={isOver} ref={ref} />
    return <AccordeonMenuEntry selected={props.selected}
                               hovered={isOver}
                               ref={ref}
                               onClick={() => select(dispatch, props.selected ? null : props.uuid)}>
        <Icon icon={iconMap[props.type]}/>
        <Icon icon={"grip-lines"} style={{cursor: 'move!important', marginLeft: '8px', color: '#cccccc'}}/>
        <ObjectPreview>
            <use href={"#" + props.uuid}/>
        </ObjectPreview>
        {props.type === "label" ? `Beschriftung: "${props.text}"` : props.moniker}
    </AccordeonMenuEntry>
}

const Objects = props => {
    const objects = useSelector(
        state => state.editor.file.present.pages[state.editor.ui.currentPage].objects
    )
    const dispatch = useDispatch();
    const selectedUUID = useSelector(
        state => state.editor.ui.selectedObjects[0]
    );

    if (!objects || objects.length === 0) return <p className={"disabled"}>Keine Objekte auf Seite.</p>;

    return (
        <>
            {/*<div>Vordergrund</div>*/}
            <Wrapper onKeyDown={event => keyDownHandler(event, selectedUUID, dispatch)}>
                {objects.map((object, index) => {
                    const selected = selectedUUID === object.uuid;
                    return <AccordeonPanelFlyoutButton
                        flownOut={object.type !== 'key' && selected}
                        hideFlyout={props.hideFlyout}
                        key={index}
                        genericButton={<ObjectEntry selected={selected} {...object} index={index}/>}>
                        <Context/>
                    </AccordeonPanelFlyoutButton>
                })}
            </Wrapper>
            {/*Dummy Object, makes drag-and-dropping easier*/}
            <ObjectEntry selected={false}  index={-1}/>
        </>
    );
};

export default Objects;