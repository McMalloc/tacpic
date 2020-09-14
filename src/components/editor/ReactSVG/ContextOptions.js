import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Palette from "../../gui/Palette";
import TexturePalette from "../../gui/TexturePalette";
import styled from 'styled-components/macro';
import {find, isUndefined} from 'lodash';

const Container = styled.div`
  background-color: ${props => props.theme.accent_1_light};
  position: absolute;
  padding: ${props => props.theme.spacing[2]};
  border-radius: 3px;
  border: 1px solid ${props => props.theme.midlight};
  box-shadow: ${props => props.theme.distant_shadow};
  left: ${props => props.left + "px"};
  top: ${props => props.top + "px"};
`;

// TODO ist genau das Gleiche wie im ShapeContext. Sollte eine Komponente werden
// TODO Componente sollte ein PopupMenu werden
class ContextOptions extends Component {
    changeTexture = texture => {
        this.props.changeProp(this.props.uuid, "pattern", {
            template: texture,
            angle: 0,
            scaleX: 1,
            scaleY: 1
        });
    };

    changeFill = fill => {
        this.props.changeProp(this.props.uuid, "fill", fill);
    };

    render() {
        return (
            <Container left={this.props.x || 0} top={this.props.y || 0}>
                <legend>Relief</legend>
                <TexturePalette
                    disabled={this.props.nothingSelected}
                    textures={[null]}
                    selected={this.props.selectedTexture}
                    onChange={this.changeTexture}/>

                <legend>Farbe</legend>

                <Palette selected={this.props.selectedFill}
                         onChange={this.changeFill}
                         colours={
                             [null, '#000000', '#1f78b4', '#b2df8a', '#e31a1c', '#ff7f00', '#cab2d6', '#b15928']
                         } extendedColours={
                    ['#a6cee3', '#33a02c', '#fb9a99', '#fdbf6f', '#6a3d9a', '#ffff99']
                }/>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    const selectedObject = find(state.editor.file.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]});
    if (isUndefined(selectedObject)) {
        return {
            nothingSelected: true
        }
    } else {
        return {
            selectedFill: selectedObject.fill,
            selectedTexture: selectedObject.pattern.template
        }
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeProp: (uuid, prop, value) => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                uuid,
                prop,
                value
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextOptions);