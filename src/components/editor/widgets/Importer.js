import React, {Component, Fragment, useRef, useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import styled from 'styled-components/macro';
import Divider from "../../gui/Divider";
import {Button} from "../../gui/Button";
import {Icon} from "../../gui/_Icon";
import ReactTooltip from 'react-tooltip'
import {IMPORT} from "../../../actions/action_constants";
import {Row} from "../../gui/Grid";
import {SVG_MIME} from "../../../config/constants";
import SVGImage from "../../gui/SVGImage";
import {useTranslation} from "react-i18next";
import {Alert} from "../../gui/Alert";
import Loader from "../../gui/Loader";

const Dropzone = styled.div`
  width: 100%;
  height: 100%;
  border: 5px dashed ${props => props.theme.brand_secondary_light};
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
    font-family: 'Font Awesome 5 Free';
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

const ImageContainer = styled.img`
  border-radius: ${props => props.theme.border_radius};
  max-height: 50vh;
  border: 1px solid ${props => props.theme.grey_4};
`
const SVGImageContainer = styled(SVGImage)`
  border-radius: ${props => props.theme.border_radius};
  max-height: 50vh;
  border: 1px solid ${props => props.theme.grey_4};
`

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

const Importer = props => {
    const fileRef = useRef();
    const dispatch = useDispatch();
    const [upload, setUpload] = useState(null);
    const [hoverWithFile, setHoverWithFile] = useState(false);
    const {preview, pending, error} = useSelector(state => state.editor.ui.import);
    const importPending = useSelector(state => state.editor.ui.importPending);
    const importError = useSelector(state => state.editor.ui.importError);
    const t = useTranslation().t;

    const previewFile = file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = event => {
            setUpload(reader)
        }
    };

    const onDropHandler = event => {
        event.preventDefault();
        let dt = event.dataTransfer;
        let files = dt.files;
        setUpload(files[0]);
        setHoverWithFile(false);
    };
    const openDialog = () => fileRef.current.click();
    const onDragoverHandler = event => {
        event.preventDefault();
        setHoverWithFile(true);
    };
    const onDragLeave = event => {
        event.preventDefault();
        setHoverWithFile(false);
    };
    const reset = event => {
        setHoverWithFile(null);
    };

    return (
        <>
            <Wrapper>
                <Dropzone
                    onDragOver={onDragoverHandler}
                    onDragLeave={onDragLeave}
                    hovering={hoverWithFile}
                    onDrop={onDropHandler}>
                    <Fileinput onChange={event => {
                        let reader = new FileReader();
                        reader.readAsDataURL(event.currentTarget.files[0]);
                        reader.onloadend = event => {
                            setUpload(reader.result);
                            let formData = new FormData();
                            formData.append("image", fileRef.current.files[0]);
                            dispatch({
                                type: IMPORT.TRACE.REQUEST,
                                // payload: fileRef.current.files[0]
                                payload: formData
                            })
                        }
                    }} ref={fileRef}
                               type={"file"}/>
                    <Icon icon={"arrow-down"}/> Vorlage hierher ziehen
                    <Divider label={"gui:or"}/>
                    {preview === null ?
                        <Button primary icon={"upload"} onClick={openDialog}>Datei wählen</Button>
                        :
                        <Button primary icon={"upload"} onClick={openDialog}>Neu wählen</Button>
                    }
                </Dropzone>
                <small>Mögliche Dateiformate: JPEG und PNG</small>
            </Wrapper>
            <Row>
                <div className={"col-md-6"}>
                    {upload &&
                        <ImageContainer alt={t("editor:Hochgeladene Bilddatei")} src={upload}/>
                    }
                </div>
                <div className={"col-md-6"}>
                    {error && <Alert danger>Es ist ein Fehler aufgetreten: <br />{error.message}</Alert>}
                    <SVGImageContainer alt={t("editor:Nachgezeichnete Vorschau")} src={preview} />
                    {pending &&
                        <Loader message={"Bild wird nachgezeichnet..."} />
                    }
                </div>
            </Row>
        </>

    );
}

export default Importer;