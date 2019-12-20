import React, {Component} from 'react';
import {connect} from "react-redux";
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



class Objects extends Component {
    render() {
        return (
            <>
                <Upper>
                    {/*TODO: Eigenschaften als ARIA-Labels mitgeben*/}
                    {this.props.objects.length === 0 ?
                        <p className={"disabled"}>Keine Objekte auf Seite.</p>
                    :
                        // TODO Treeview sollte keine selected-prop haben, s. unten
                    <Treeview selected={this.props.selectedUUID} onSelect={this.props.select} options={
                        [
                            {
                                label: "Vordergrund", value: "FG", children: this.props.objects.map((object, i) => {
                                    return {
                                        label: object.type === "label" ? `Beschriftung: "${object.text}"` : object.moniker + " " + object.uuid.slice(0,3) + "..." +
                                            "",
                                        value: object.uuid,
                                        // active: this.props.selectedUUIDs.includes(object.uuid)
                                    }
                                })
                            }]
                    }/>
                    }
                </Upper>
                {/* todo Für Test entfernt*/}
                <Lower>
                    <Button onClick={() => this.props.group(this.props.selectedObjects)} icon={"object-group"}>Neue Gruppe</Button>
                    {/* TODO nur verfügbar, wenn aös einziges ausgewählte Objekt eine Gruppe zur Verfügung steht*/}
                    <Button onClick={() => this.props.ungroup(this.props.selectedObjects)} icon={"object-ungroup"}>Gruppe auflösen</Button>
                    {/*<ButtonSet>*/}
                    {/*    <Button icon={"long-arrow-alt-up"} fullWidth>nach vorne</Button>*/}
                    {/*    <Button icon={"long-arrow-alt-down"} fullWidth>nach hinten</Button>*/}
                    {/*</ButtonSet>*/}
                </Lower>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        objects: state.editor.file.pages[state.editor.ui.currentPage].objects,
        selectedUUID: state.editor.ui.selectedObjects[0],
        selectedObjects: state.editor.ui.selectedObjects,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        select: uuid => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuids: [uuid]
            });
        },
        group: uuids => {
            dispatch({
                type: 'OBJECTS_GROUPED',
                uuids
            })
        },
        ungroup: uuid => {
            dispatch({
                type: 'OBJECTS_UNGROUPED',
                uuid
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Objects);