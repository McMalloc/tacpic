import React, {Component} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import styled from 'styled-components/macro';
import {Treeview} from "../../gui/Treeview";
import {Button} from "../../gui/Button";
import {Row} from "../../gui/Grid";
import {Lower, Upper} from "../../gui/WidgetContainer";
import {Icon} from "../../gui/_Icon";
import {AccordeonMenuEntry, AccordeonPanelFlyoutButton} from "../../gui/Accordeon";
import Context from "./Context/Context";

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

const Objects = props => {
    const objects = useSelector(
        state => state.editor.file.pages[state.editor.ui.currentPage].objects
    );
    const dispatch = useDispatch();
    const selectedUUID = useSelector(
        state => state.editor.ui.selectedObjects[0]
    );
    if (!objects || objects.length === 0) return <p className={"disabled"}>Keine Objekte auf Seite.</p>;
    return (
        <>
            {objects.map((object, index) => {
                const active = selectedUUID === object.uuid;
                const button = <AccordeonMenuEntry active={active}
                                                   onClick={() => select(dispatch, active ? null : object.uuid)}
                                                   key={object.uuid}>
                    <Icon icon={"vector-square"}/>
                    {object.type === "label" ? `Beschriftung: "${object.text}"` : object.moniker}
                </AccordeonMenuEntry>
                return <AccordeonPanelFlyoutButton
                    flownOut={active}
                    key={index}
                    genericButton={button}>
                    <Context/>
                </AccordeonPanelFlyoutButton>
            })}
        </>
    );
};

export default Objects;