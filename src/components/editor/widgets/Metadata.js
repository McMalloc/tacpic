import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Multiline, Textinput} from "../../gui/Input";
import Select from "../../gui/Select";
import {Button} from "../../gui/Button";
import {Upper} from "../../gui/WidgetContainer";
import Tooltip from "../../gui/Tooltip";
import {GRAPHIC, VERSION} from "../../../actions/constants";

const Status = styled.div`
  display: flex;
  justify-content: space-between;
    align-items: baseline;
  margin: ${props => props.theme.spacing[3]} 0;
`;

const Indicator = styled.span`
  display: inline-block;
  text-transform: uppercase;
  color: ${props => props.theme.background};
  font-size: 0.8em;
  letter-spacing: 2px;
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background-color: ${props => {
    switch (props.state) {
        case 0:
            return props.theme.info;
        case 1:
            return props.theme.success;
        case 2:
            return props.theme.warning;
        default:
            return props.theme.midlight;
    }
}};
  
`;

class Metadata extends Component {
    state = {
        changedOnce: false
    };

    render() {
        return (
            <Upper>
                <div>
                    <Textinput
                        value={this.state.changedOnce ? this.props.catalogueTitle : this.props.title}
                        onChange={event => {
                            !this.state.changedOnce && this.setState({changedOnce: true});
                            this.props.changeCatalogueTitle(event.currentTarget.value)
                        }}
                        tip={"help:input_catalogue-title"}
                        label={"editor:input_catalogue-title"}
                        sublabel={"editor:input_catalogue-title-sub"}/>

                    <Select
                        label={"editor:input_catalogue-tags"}
                        tip={"help:input_catalogue-tags"}
                        isMulti
                        creatable
                        options={[
                            {label: "Sek 1", value: 0}, // value entspricht id
                            {label: "Sek 2", value: 1},
                            {label: "Biologie", value: 2},
                            {label: "Physik", value: 3},
                            {label: "Geographie", value: 4}]}
                        sublabel={"editor:input_catalogue-tags-sub"}/>
                    <Multiline label={"editor:input_catalogue-desc"} sublabel={"editor:input_catalogue-desc-sub"}/>

                </div>

                <div>
                    <hr/>
                    <Status>
                        <span>Status:</span>
                        <Indicator state={this.props.documentState}>
                            {/*editor:catalogue-state-{this.props.documentState}*/}
                            Entwurf
                        </Indicator>
                    </Status>
                    TODO: CC-lizensiertes Material unterbindet technische Schutzmaßnahmen.
                    <p>Ich stimme der Veröffentlichung unter der liberalen <a target={"blank"}
                                                                              href={"https://creativecommons.org/licenses/by/4.0/deed.de"}>CC-BY-SA
                        3.0 Lizenz</a> zu.</p>
                    <Button onClick={() => this.props.uploadVersion(this.props.file)}
                            primary fullWidth
                            label={this.props.graphic_id === null && this.props.variant_id === null ?
                                "editor:input_catalogue-publish" :
                                (this.props.variant_id !== null && "editor:input_catalogue-save")
                            }>
                    </Button>
                </div>
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {
        documentState: 0, // 0 = draft, 1 = published, 2 = published with new draft
        title: state.editor.file.title,
        catalogueTitle: state.editor.file.catalogueTitle,
        file: state.editor.file,
        graphic_id: state.editor.file.graphic_id,
        variant_id: state.editor.file.variant_id
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeCatalogueTitle: title => {
            dispatch({
                type: "CHANGE_CATALOGUE_TITLE",
                title
            })
        },
        uploadVersion: file => {
            if (file.graphic_id === null) {
                dispatch({
                    type: GRAPHIC.CREATE.REQUEST,
                    payload: file
                })
            } else if (file.variant_id !== null) {
                dispatch({
                    type: VERSION.CREATE.REQUEST,
                    payload: file
                })
            }

        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);