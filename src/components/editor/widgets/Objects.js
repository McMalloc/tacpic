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
                    <Treeview selected={this.props.selectedUUID} onSelect={this.props.select} options={
                        [
                            {
                                label: "Vordergrund", value: "FG", children: this.props.objects.map((object, i) => {
                                    return {
                                        label: object.moniker,
                                        value: object.uuid
                                    }
                                })
                            }]
                    }/>
                    }
                </Upper>
                {/* todo Für Test entfernt*/}
                {/*<Lower>*/}
                    {/*<Button icon={"object-group"}>Neue Gruppe</Button>*/}

                    {/*<ButtonSet>*/}
                        {/*<Button icon={"long-arrow-alt-up"} fullWidth>nach vorne</Button>*/}
                        {/*<Button icon={"long-arrow-alt-down"} fullWidth>nach hinten</Button>*/}
                    {/*</ButtonSet>*/}

                {/*</Lower>*/}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        objects: state.editor.openedFile.pages[state.editor.currentPage].objects,
        selectedUUID: state.editor.selectedObjects[0]
    }
};

const mapDispatchToProps = dispatch => {
    return {
        select: uuid => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuid
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Objects);