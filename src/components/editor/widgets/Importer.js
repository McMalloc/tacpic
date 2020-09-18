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
import Toggle from "../../gui/Toggle";

const Dropzone = styled.div`
  width: 100%;
  height: 100%;
  border: 5px dashed ${props => props.theme.brand_secondary_light};
  border-radius: 5px;
  box-sizing: border-box;
  padding: ${props => props.theme.spacing[3]};
  background-color: ${props => props.hovering ? props.theme.brand_secondary_verylight : "inherit"};
  cursor: ${props => props.hovering ? "copy" : "inherit"}
  position: relative;
  text-align: center;
  
  transition: background-color 0.2s;
 
`;

const Fileinput = styled.input`
  position: absolute;
  left: -9999px;
`;

const ImageContainer = styled.img`
  border-radius: ${props => props.theme.border_radius};
  max-width: 500px;
  display: block;
  height: auto;
  border: 1px solid ${props => props.theme.grey_4};
`
const SVGImageContainer = styled(SVGImage)`
  border-radius: ${props => props.theme.border_radius};
  max-width: 500px;
  display: block;
  height: auto;
  border: 1px solid ${props => props.theme.grey_4};
`

const Preview = styled.img`
  width: 300px;
  height: auto;
`;

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing[4]};
  height: 100%;
  //max-width: 800px;
  box-sizing: border-box;
`;

const OCRWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const OCRLabel = styled(Toggle)`
  flex: 1 0 auto;
  margin: ${props => props.theme.base_padding};
  
  &:last-child {
    flex-grow: 0;
  }
`;

/* TODO
* Leinwand erst zeigen, wenn etwas importiert worden ist
* */

const requestTrace = (dispatch, file, callback) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = event => {
        callback(reader.result);
        let formData = new FormData();
        formData.append("image", file);
        dispatch({
            type: IMPORT.TRACE.REQUEST,
            // payload: fileRef.current.files[0]
            payload: formData
        })
    }
}

const setOCRSelection = (dispatch, selection) => {
    dispatch({
        type: 'OCR_SELECT',
        selection
    })
}

const Importer = props => {
    const fileRef = useRef();
    const dispatch = useDispatch();
    const [upload, setUpload] = useState(null);
    const [hoverWithFile, setHoverWithFile] = useState(false);
    const {preview, pending, error, previewName, ocr, ocrSelection} = useSelector(state => state.editor.ui.import);
    const t = useTranslation().t;

    const onDropHandler = event => {
        event.preventDefault();
        requestTrace(dispatch, event.dataTransfer.files[0], setUpload);
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
    const reset = event => setHoverWithFile(null);

    return (
        <>
            <Wrapper>
                <Dropzone
                    onDragOver={onDragoverHandler}
                    onDragLeave={onDragLeave}
                    hovering={hoverWithFile}
                    onDrop={onDropHandler}>
                    <Fileinput onChange={event => requestTrace(dispatch, event.currentTarget.files[0], setUpload)}
                               ref={fileRef}
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
                    <>
                        <ImageContainer alt={t("editor:Hochgeladene Bilddatei")} src={upload}/>
                        <div>Titel: <strong>{previewName}</strong></div>
                    </>
                    }
                </div>
                <div className={"col-md-6"}>
                    {error && <Alert danger>Es ist ein Fehler aufgetreten: <br/>{error.message}</Alert>}
                    <SVGImageContainer alt={t("editor:Nachgezeichnete Vorschau")} src={preview}/>
                    {pending &&
                    <Loader message={"Bild wird nachgezeichnet..."}/>
                    }
                </div>
            </Row>
            {ocr.length > 0 &&
            <Row>
                <hr />
                <div className={"col-md-12"}>
                    Zudem wurden folgende Beschriftungen gefunden:
                    <OCRWrapper>
                        <Button primary label={ocr.length === ocrSelection.length ? "Alle abwählen" : "Alle auswählen"}
                                toggled={ocr.length === ocrSelection.length}
                                onClick={() => {
                                    ocr.length === ocrSelection.length ?
                                        setOCRSelection(dispatch, [])
                                        :
                                        setOCRSelection(dispatch, ocr.map((_, index) => index))
                                }}/>&emsp;
                        {ocr.map((label, index) => {
                            const active = ocrSelection.includes(index);
                            return <OCRLabel toggled={active} onClick={() => {
                                let labels = [...ocrSelection];
                                if (active) {
                                    setOCRSelection(dispatch, labels.filter(i => i !== index));
                                } else {
                                    labels.push(index);
                                    setOCRSelection(dispatch, labels);
                                }
                            }} label={label} />
                        })}
                    </OCRWrapper>
                </div>
            </Row>
            }
        </>

    );
}

export default Importer;