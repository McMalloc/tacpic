import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import Divider from "../../gui/Divider";
import {Button} from "../../gui/Button";
import {Padding} from "styled-components-spacing";
import {Icon} from "../../gui/_Icon";

const Dropzone = styled.div`
  width: 100%;
  height: 100%;
  border: 5px dashed ${props => props.theme.background};
  border-radius: 5px;
  box-sizing: border-box;
  padding: ${props => props.theme.spacing[3]};
  background-color: ${props => props.hovering ? props.theme.background : "inherit"};
  cursor: ${props => props.hovering ? "copy" : "inherit"}
  position: relative;
  text-align: center;
  
  transition: background-color 0.2s;
  
  &:hover {
    &:after {
      bottom: ${props => props.theme.spacing[3]};
    }
  }
  
  &:after {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-family: FontAwesome;
    content: "\\f063";
    color: ${props => props.hovering ? props.theme.accent_1 : "transparent"};
    font-size: 6em;
    
    transition: bottom 2s;
  }
`;

const Fileinput = styled.input`
  position: absolute;
  left: -9999px;
`;

const Preview = styled.img`
  width: 300px;
  height: auto;
`;

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing[4]};
  height: 100%;
  box-sizing: border-box;
`;

/* TODO
* Leinwand erst zeigen, wenn etwas importiert worden ist
* */

class Importer extends Component {

    fileRef = React.createRef();
    state = {
        preview: null,
        hoverWithFile: false
    };

    previewFile = file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let _this = this;
        reader.onloadend = event => {
            _this.setState({
                preview: reader.result
            });
            this.props.addOriginal(file.name); // TODO send to server, do not save in memory
            _this.props.toggleCanvas(true);
        }
    };

    onDropHandler = event => {
        event.preventDefault();
        let dt = event.dataTransfer;
        let files = dt.files;
        this.previewFile(files[0], this.state);
        this.setState({
            hoverWithFile: false
        })
    };

    openDialog = () => {
        console.log(this.fileRef);
        this.fileRef.current.click();
    };

    onDragoverHandler = event => {
        event.preventDefault();
        this.setState({
            hoverWithFile: true
        })
    };

    onDragLeave = event => {
        event.preventDefault();
        this.setState({
            hoverWithFile: false
        })
    };

    reset = event => {
        this.setState({
            preview: null
        })
    };

    render() {
        return (
            <Fragment>
                <Wrapper>
                    <Dropzone
                        onDragOver={this.onDragoverHandler}
                        onDragLeave={this.onDragLeave}
                        hovering={this.state.hoverWithFile}
                        onDrop={this.onDropHandler}>
                        <Fileinput onChange={event => this.previewFile(event.currentTarget.files[0])} ref={this.fileRef} type={"file"}/>

                        <Padding top={4}>
                            <Icon icon={"arrow-down"}/> Vorlage hierher ziehen
                        </Padding>

                        <Padding vertical={3}>
                            <Divider label={"gui:or"}/>
                        </Padding>

                        {this.state.preview === null ?
                            <Button primary icon={"upload"} onClick={this.openDialog}>Datei wählen</Button>
                            :
                            <Button primary icon={"upload"} onClick={this.openDialog}>Neu wählen</Button>
                        }
                    </Dropzone>

                </Wrapper>
            </Fragment>

        );
    }
}

const mapStateToProps = state => {
    return {
        file: state.editor.openedFile.backgroundURL
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleCanvas: state => {
            dispatch({
                type: "WIDGET_VISIBILITY_TOGGLED",
                state,
                id: "Canvas"
            })
        },
        addOriginal: filename => {
            dispatch({
                type: "ADD_BACKGROUND",
                filename
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Importer);