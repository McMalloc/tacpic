import React, {Component} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import styled from 'styled-components';
import {Treeview} from "../../gui/Treeview";
import {Button} from "../../gui/Button";
import {Row} from "../../gui/Grid";
import {Lower, Upper} from "../../gui/WidgetContainer";

const ButtonSet = styled.div`
  button:first-child {
    margin-bottom: ${props => props.theme.spacing[1]};
  }
  flex: 0 0 40%;
  
  margin-left: ${props => props.theme.spacing[2]};
`;

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
    if (!objects) return null;
    return (
        <>
            <Upper>
                {/*TODO: Eigenschaften als ARIA-Labels mitgeben*/}
                {objects.length === 0 ?
                    <p className={"disabled"}>Keine Objekte auf Seite.</p>
                    :
                    // TODO Treeview sollte keine selected-prop haben, s. unten
                    <Treeview selected={selectedUUID} onSelect={uuid => select(dispatch, uuid)} options={
                        [
                            {
                                label: "Vordergrund", value: "FG", children: objects.map((object, i) => {
                                    return {
                                        label: object.type === "label" ? `Beschriftung: "${object.text}"` : object.moniker,
                                        value: object.uuid,
                                        buttons: [
                                            {label: 'Entfernen', icon: 'trash', action: () => remove(dispatch, object.uuid)}
                                        ]
                                        // active: this.props.selectedUUIDs.includes(object.uuid)
                                    }
                                })
                            }]
                    }/>
                }
            </Upper>
            {/* todo Für Test entfernt*/}
            {/*<Lower>*/}
            {/*    <Button onClick={() => group(selectedObjects)} icon={"object-group"}>Neue Gruppe</Button>*/}
            {/*    /!* TODO nur verfügbar, wenn aös einziges ausgewählte Objekt eine Gruppe zur Verfügung steht*!/*/}
            {/*    <Button onClick={() => ungroup(selectedObjects)} icon={"object-ungroup"}>Gruppe auflösen</Button>*/}
            {/*    /!*<ButtonSet>*!/*/}
            {/*    /!*    <Button icon={"long-arrow-alt-up"} fullWidth>nach vorne</Button>*!/*/}
            {/*    /!*    <Button icon={"long-arrow-alt-down"} fullWidth>nach hinten</Button>*!/*/}
            {/*    /!*</ButtonSet>*!/*/}
            {/*</Lower>*/}
        </>
    );
};

export default Objects;