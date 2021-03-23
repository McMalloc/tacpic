import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components/macro';
import { Icon } from "../../gui/_Icon";
import { AccordeonMenuEntry, AccordeonPanelFlyoutButton } from "../../gui/Accordeon";
import { Button } from "../../gui/Button";
import Context from "./Context/Context";
import { useDrag, useDrop } from "react-dnd";
import { OBJECT_ENTRY, OBJECTS_SWAPPED } from "../../../actions/action_constants";
import methods from '../ReactSVG/methods/methods';
import { useTranslation } from 'react-i18next';

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

const iconMap = {
    // rect: 'vector-square',
    // ellipse: 'circle',
    label: 'braille',
    key: 'key',
    // path: 'bezier-curve'
}

const keyDownHandler = (event, selectedUUIDs, dispatch) => {
    switch (event.which) {// TODO use constants instead of magic numbers
        case 46: // DEL
            if (!!selectedUUIDs) return;
            dispatch({
                type: 'OBJECT_SELECTED',
                uuids: [null]
            });
            dispatch({
                type: 'OBJECT_REMOVED',
                selectedUUIDs
            });
            break;
        default:
            break;
    }
    return false;
};

const ObjectPreview = props => {
    if (props.type === 'key') return <Icon style={{width: 45}} icon={'key'} />
    if (props.type === 'label') return <Icon style={{width: 45}} icon={'braille'} />
    const object = document.getElementById(props.uuid);
    if (object === null) return null;
    const {width, height, x, y} = methods[props.type].getBBox(props);
    return <svg viewBox={`0 0 ${width} ${height}`} style={{height: '35px', width: '35px', marginRight: '10px'}}>
        <use transform={`translate(${-x} ${-y})`} href={"#" + props.uuid} />
    </svg>
}

const ObjectEntry = props => {
    const ref = useRef(null);
    const dispatch = useDispatch();
    const singleSelection = useSelector(
        state => state.editor.ui.selectedObjects
    ).length === 1;

    const [{ isDragging }, drag] = useDrag({
        item: { type: OBJECT_ENTRY, index: props.index },
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
        style={{ justifyContent: "space-between" }}
        ref={ref}
        onClick={() => select(dispatch, props.selected && singleSelection ? null : props.uuid)}>

        <div style={{ display: 'flex', alignItems: 'center', height: 35 }}>
            <ObjectPreview {...props} />
            {props.type === "label" ? `Beschriftung: "${props.text}"` : props.moniker}</div>
        <Button onClick={event => {
            event.stopPropagation();
            !!props.selected && dispatch({
                type: 'OBJECT_SELECTED',
                uuids: [null]
            });
            dispatch({
                type: 'OBJECT_REMOVED',
                uuids: [props.uuid]
            });
         }}
            className={'hover-button'} small title={'delete'} icon={"trash-alt"} />
    </AccordeonMenuEntry>
}

const Objects = props => {
    const {t} = useTranslation();
    const objects = useSelector(
        state => state.editor.file.present.pages[state.editor.ui.currentPage].objects
    )
    const dispatch = useDispatch();
    const selectedUUIDs = useSelector(
        state => state.editor.ui.selectedObjects
    );

    if (!objects || objects.length === 0) return <p className={"disabled"}>
        {t('editor:objectPanel.noObjects')}
    </p>;

    return (
        <>
            {/*<div>Vordergrund</div>*/}
            <Wrapper onKeyDown={event => keyDownHandler(event, selectedUUIDs, dispatch)}>
                {objects.map((object, index) => {
                    const selected = selectedUUIDs.includes(object.uuid);
                    return <AccordeonPanelFlyoutButton
                        flownOut={object.type !== 'key' && selected && selectedUUIDs.length === 1}
                        hideFlyout={props.hideFlyout}
                        key={index}
                        genericButton={<ObjectEntry selected={selected} {...object} index={index} />}>
                        <Context />
                    </AccordeonPanelFlyoutButton>
                })}
            </Wrapper>
            {/*Dummy Object, makes drag-and-dropping easier*/}
            <ObjectEntry selected={false} index={-1} />
        </>
    );
};

export default Objects;