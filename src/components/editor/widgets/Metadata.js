import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from 'styled-components';
import {Multiline, Textinput} from "../../gui/Input";
import Select from "../../gui/Select";
import {Button} from "../../gui/Button";
import {Upper} from "../../gui/WidgetContainer";
import {GRAPHIC, VERSION, VARIANT} from "../../../actions/constants";
import {Modal} from "../../gui/Modal";

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

const uploadVersion = (dispatch, file) => {
    if (file.graphic_id === null) {
        dispatch({
            type: GRAPHIC.CREATE.REQUEST,
            payload: file
        })
    } else if (file.isNew) {
        dispatch({
            type: VARIANT.CREATE.REQUEST,
            payload: file
        })
    } else {
        dispatch({
            type: VARIANT.UPDATE.REQUEST,
            payload: file
        })
    }
};

const Metadata = props => {
    const file = useSelector(state => state.editor.file);
    const tags = useSelector(
        state => state.catalogue.tags.map(tag => {
            return {
                label: tag.name,
                value: tag.tag_id
            }
        })
    );
    const variantTags = useSelector(state => state.editor.file.tags);
    const dispatch = useDispatch();
    const [input, setInput] = useState({});

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    return (
        <>
        <Upper>
            <div>
                <Textinput
                    value={file.graphicTitle}
                    onChange={event => {
                        dispatch({
                            type: "CHANGE_FILE_PROPERTY",
                            key: 'graphicTitle',
                            value: event.currentTarget.value
                        });
                    }}
                    tip={"help:input_graphic-title"}
                    disabled={file.graphic_id !== null}
                    label={"editor:input_graphic-title"}
                    sublabel={"editor:input_graphic-title-sub"}/>
                <Textinput
                    value={file.variantTitle}
                    onChange={event => {
                        dispatch({
                            type: "CHANGE_FILE_PROPERTY",
                            key: 'variantTitle',
                            value: event.currentTarget.value
                        });
                    }}
                    tip={"help:input_variant-title"}
                    disabled={file.graphic_id === null}
                    label={"editor:input_variant-title"}
                    sublabel={"editor:input_variant-title-sub"}/>

                <Select
                    label={"editor:input_catalogue-tags"}
                    tip={"help:input_catalogue-tags"}
                    isMulti
                    creatable
                    onChange={selection => {
                        if (selection === null) selection = [];
                        dispatch({
                            type: "CHANGE_FILE_PROPERTY",
                            key: 'tags',
                            value: selection.map(tag => {return {tag_id: tag.value, name: tag.label}})
                        })
                    }}
                    onCreateOption={(option) => {
                        let taglist = [...variantTags];
                        taglist.push({tag_id: null, name: option});
                        dispatch({
                            type: "CHANGE_FILE_PROPERTY",
                            key: 'tags',
                            value: taglist
                        })
                    }}
                    options={tags}
                    value={variantTags.map(tag => {return {value: tag.tag_id, label: tag.name}})}
                    sublabel={"editor:input_catalogue-tags-sub"}/>

                <Multiline
                    value={file.graphicDescription}
                    onChange={event => {
                        dispatch({
                            type: "CHANGE_FILE_PROPERTY",
                            key: 'graphicDescription',
                            value: event.currentTarget.value
                        });
                    }}
                    disabled={file.graphic_id !== null}
                    label={"editor:input_graphic-desc"}
                    sublabel={"editor:input_graphic-desc-sub"}/>

                <Multiline
                    value={file.variantDescription}
                    onChange={event => {
                        dispatch({
                            type: "CHANGE_FILE_PROPERTY",
                            key: 'variantDescription',
                            value: event.currentTarget.value
                        });
                    }}
                    disabled={file.graphic_id === null}
                    label={"editor:input_variant-desc"}
                    sublabel={"editor:input_variant-desc-sub"}/>

            </div>

            <div>
                <hr/>
                <Status>
                    <span>Status:</span>
                    <Indicator state={file.documentState}>
                        {/*editor:catalogue-state-{this.props.documentState}*/}
                        Entwurf
                    </Indicator>
                </Status>
                TODO: CC-lizensiertes Material unterbindet technische Schutzmaßnahmen.
                <p>Ich stimme der Veröffentlichung unter der liberalen <a target={"blank"}
                                                                          href={"https://creativecommons.org/licenses/by/4.0/deed.de"}>CC-BY-SA
                    3.0 Lizenz</a> zu.</p>
                <Button onClick={() => uploadVersion(dispatch, file)}
                        primary fullWidth
                        label={file.graphic_id === null ?
                            "editor:input_catalogue-publish" :
                            (file.isNew ? "editor:input_catalogue-create" : "editor:input_catalogue-update")
                        }>
                </Button>
            </div>
        </Upper>
            </>
    );
};

export default Metadata;