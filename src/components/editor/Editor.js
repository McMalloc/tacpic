import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import md5 from 'blueimp-md5';

import '../../styles/Editor.css';
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {FILE, IMPORT, OBJECT_BULK_ADD, OBJECT_UPDATED, SWITCH_CURSOR_MODE} from "../../actions/action_constants";
import {useParams} from "react-router-dom";
import Canvas from "./widgets/Canvas";
import Toggle from "../gui/Toggle";
import {Button} from "../gui/Button";
import Importer from "./widgets/Importer";
import Key from "./widgets/Keyedit";
import Metadata from "./widgets/Metadata";
import Pages from "./widgets/Pages";
import Objects from "./widgets/Objects";
import Writer from "./widgets/Writer";
import BraillePage from "./widgets/BraillePage";
import {Radiobar, RadiobarSegment} from "../gui/Radiobar";
import {AccordeonPanel, AccordeonPanelFlyoutButton} from "../gui/Accordeon";
import GraphicPageSettings from "./widgets/GraphicPageSettings";
import BraillePageSettings from "./widgets/BraillePageSettings";
import Document from "./widgets/Document";
import Error from "../Error";
import {Modal} from "../gui/Modal";
import {useNavigate} from "react-router";
import methods from "./ReactSVG/methods";
import Loader from "../gui/Loader";
import {SVG_A4_PX_WIDTH} from "../../config/constants";
import {editor} from "../../store/initialState";
import Verbaliser from "./widgets/Verbaliser";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1 1 auto;
  height: 100%;
  background-color: ${props => props.theme.brand_secondary};
  
  .loader {
    color: white;
  }
`;

const PanelWrapper = styled.div`
  display: flex;
  flex: 0 1 100%;
  flex-direction: row;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
`;

const CanvasWrapper = styled.div`
  display: flex;
  flex: 1 0 auto;
  position: relative;
  background-color: rgba(0,0,0,0.1);
  border-radius: ${props => props.theme.border_radius} 0 0 ${props => props.theme.border_radius};
  overflow: hidden;
  box-shadow: 5px 5px 10px rgba(0,0,0,0.3) inset;
`;

const Sidebar = styled.div`
  flex: 0 1 25%;
  //height: 100%;
  overflow: auto;
  min-width: 200px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ModalSidebar = styled(Sidebar)`
    border-left: 2px solid ${props => props.theme.brand_secondary_light};
    border-right: none;
    box-shadow: -3px 0 6px rgba(0,0,0,0.3);
    max-width: 500px;
    position: absolute;
    right: -500px; top: 0; bottom: 0;
    transition: right 0.2s;
    border-radius: ${props => props.theme.border_radius} 0 0 0;
`;

const FixedSidebar = styled(Sidebar)`
    min-width: 300px;
    max-width: 400px;
    border-radius: 0 ${props => props.theme.border_radius}  0 0;
`;

const SidebarPanel = styled.div`
  flex: ${props => props.flexGrow}  1 30%;
  display: flex;
  overflow: auto;
  flex-direction: column;
  border-bottom: 2px solid ${props => props.theme.brand_secondary_light};
`;

const Draftinfo = styled.div`
  color: ${props => props.theme.background};
  padding: ${props => props.theme.large_padding};
  margin-bottom: 6px;
  cursor: pointer;
`;

// const Loading

const iconMap = {
    SELECT: 'hand-pointer',
    RECT: 'vector-square',
    ELLIPSE: 'circle',
    PATH: 'bezier-curve',
    KEY: 'key',
    QUADRATIC: 'bezier-curve',
    LABEL: 'font'
};

const switchCursorMode = (dispatch, mode) => {
    dispatch({
        type: SWITCH_CURSOR_MODE, mode
    })
}

const Editor = props => {
    const uiSettings = useSelector(state => state.editor.ui);
    const file = useSelector(state => state.editor.file.present);
        const page = file.pages;
        const fileHash = file.lastVersionHash;
    const error = useSelector(state => state.app.error);
    const undoLength = useSelector(state => state.editor.file.past.length);
    const redoLength = useSelector(state => state.editor.file.future.length);
    const user = useSelector(state => state.user);
    const traceImport = useSelector(state => state.editor.ui.import);
    const ocr = useSelector(state => state.editor.ui.import.ocr);
    const ocrSelection = useSelector(state => state.editor.ui.import.ocrSelection);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const t = useTranslation().t;
    let {variantId, graphicId, mode} = useParams();

    useEffect(() => {
        if (!!variantId) {
            dispatch({
                type: FILE.OPEN.REQUEST,
                id: variantId,
                data: mode === 'edit' ? {variant_id: variantId} : {derivedFrom: variantId, variantTitle: '', variant_id: null}
            })
        } else if (mode === 'copy') { // new graphic
            dispatch({
                type: FILE.OPEN.SUCCESS,
                data: {variant_id: null, graphic_id: null, derivedFrom: null, version_id: null, variantTitle: 'Basis', graphicTitle: ''}
            })
        } else {
            dispatch({
                type: FILE.OPEN.SUCCESS,
                data: editor.file.present
            })
        }
    }, [graphicId, variantId, mode]);

    const [openedPanel, setOpenedPanel] = useState(null);
    // const [openedPanel, setOpenedPanel] = useState(null);
    // todo zu Hook umwandeln, wenn InteractiveSVG eine function component ist
    const [dragging, setDragging] = useState(false);
    const [showBraillePanel, setShowBraillePanel] = useState(false);
    const [handleError, setHandleError] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // if (!user.logged_in) navigate("/login")

    if (localStorage.getItem("HAS_EDITOR_CRASHED") === 'true') {
        console.log("crashed");
        if (uiSettings.fileOpenSuccess) {
            const backup = localStorage.getItem("EDITOR_BACKUP");
            const backupHash = md5(backup);
            const parsed = JSON.parse(backup);
            if (fileHash !== backupHash && parsed.variant_id === parseInt(variantId)) {
                setHandleError(true)
                localStorage.setItem("HAS_EDITOR_CRASHED", "false");
            }
        }
    }

    if (handleError) {
        return <Modal fitted title={'Sitzung wiederherstellen'} dismiss={() => setHandleError(false)}
                      actions={[
                          {
                              label: "Nein",
                              align: "left",
                              action: () => setHandleError(false)
                          },
                          {
                              label: "Ja",
                              align: "right",
                              template: 'primary',
                              action: () => {
                                  dispatch({
                                      type: FILE.OPEN.SUCCESS,
                                      data: JSON.parse(localStorage.getItem("EDITOR_BACKUP")),
                                      mode: "edit"
                                  })
                                  setHandleError(false);
                              }
                          }
                      ]}>
            Der Editor scheint beim letzten Mal abgestürzt zu sein. <br/>
            <strong>Möchten Sie das Backup laden?</strong>
        </Modal>
    }

    const resetImportModal = () => {
        dispatch({type: IMPORT.TRACE.FAILURE, message: null});
        setShowImportModal(false);
    }

    try {
        if (uiSettings.fileOpenSuccess) {
            // throw("boom")
            return (
                <><Wrapper>
                    <Radiobar>
                        <RadiobarSegment>
                            {["SELECT", "KEY", "RECT", "ELLIPSE", /*"CUBIC", "QUADRATIC",*/ "LABEL", "PATH", /*"LINE"*/].map((tool, index) => {
                                return (
                                    <Toggle
                                        label={"editor:toggle_tools-" + tool}
                                        primary
                                        key={index}
                                        icon={iconMap[tool]}
                                        toggled={uiSettings.tool === tool}
                                        onClick={() => {
                                            switchCursorMode(dispatch, tool);
                                        }}
                                    />
                                )
                            })}
                            <Toggle
                                label={"editor:toggle_tools-IMPORT"}
                                primary
                                icon={"file-import"}
                                toggled={showImportModal}
                                onClick={() => {
                                    setShowImportModal(true);
                                }}
                            />
                        </RadiobarSegment>
                        <RadiobarSegment>
                            <Button
                                label={"editor:undo"}
                                primary
                                disabled={undoLength === 0}
                                icon={'undo'}
                                onClick={() => {
                                    dispatch({type: 'UNDO'});
                                }}/>
                            <Button
                                label={"editor:redo"}
                                primary
                                disabled={redoLength === 0}
                                icon={'redo'}
                                onClick={() => {
                                    dispatch({type: 'REDO'});
                                }}/>

                        </RadiobarSegment>
                        {/*<Toggle primary onClick={() => {*/}
                        {/*}} label={"Neu"}/>*/}
                    </Radiobar>

                    <PanelWrapper>
                        <Sidebar>
                            <Draftinfo onClick={() => {
                                setOpenedPanel('publish');
                                setTimeout(() => {
                                    document.getElementById("label-for-graphic-title").focus();
                                }, 100);
                            }}>
                                <strong>{file.graphicTitle.length === 0 ? <span
                                    className={'disabled'}>Noch kein Titel</span> : file.graphicTitle}</strong><br/>
                                {file.graphicTitle.length !== 0 ?
                                <span>Variante: {file.variantTitle}</span>
                                    :
                                    <Button fullWidth primary label={"Titel ändern"} />
                                }

                                <pre style={{border: '2px solid green', textShadow: '1px 1px 0 black', color: 'lightgreen', fontSize: '11px', padding: '2px 3px'}}>
                                    Derived from: {file.derivedFrom + ""}<br />
                                    Mode: {mode}<br />
                                    Graphic ID: {file.graphic_id + " (" + graphicId + ")"}<br />
                                    Variant ID: {file.variant_id + " (" + variantId + ")"}<br />
                                </pre>
                            </Draftinfo>

                            <AccordeonPanel title={"Entwurf"}>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'document'}
                                                            hideFlyout={dragging}
                                                            className={"padded"}
                                                            onClick={() => setOpenedPanel(openedPanel === 'document' ? null : 'document')}
                                                            label={"Einrichten"} icon={"cog"}>
                                    <Document/>
                                </AccordeonPanelFlyoutButton>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'publish'}
                                                            className={"padded"}
                                                            hideFlyout={dragging}
                                                            onClick={() => setOpenedPanel(openedPanel === 'publish' ? null : 'publish')}
                                                            label={"Veröffentlichen"} icon={"upload"}>
                                    <Metadata/>
                                </AccordeonPanelFlyoutButton>
                            </AccordeonPanel>
                            <AccordeonPanel title={"Grafikseiten"}>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'graphicSettings'}
                                                            className={"padded"}
                                                            hideFlyout={dragging}
                                                            onClick={() => setOpenedPanel(openedPanel === 'graphicSettings' ? null : 'graphicSettings')}
                                                            label={"Einrichten"} icon={"cog"}>
                                    <GraphicPageSettings/>
                                </AccordeonPanelFlyoutButton>
                                <Pages/>
                            </AccordeonPanel>
                            <AccordeonPanel title={"Legende"}>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'key'}
                                                            className={"padded"}
                                                            hideFlyout={dragging}
                                                            onClick={() => setOpenedPanel(openedPanel === 'key' ? null : 'key')}
                                                            label={"Einfügen"} icon={"key"}>

                                </AccordeonPanelFlyoutButton>
                                <Key className={"padded"}/>
                            </AccordeonPanel>
                            <AccordeonPanel title={"Brailleseiten"}>
                                <AccordeonPanelFlyoutButton flownOut={showBraillePanel}
                                                            className={"padded"}
                                                            onClick={() => setShowBraillePanel(!showBraillePanel)}
                                                            label={"Einblenden"} icon={"mag"}/>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'brailleSettings'}
                                                            className={"padded"}
                                                            hideFlyout={dragging}
                                                            onClick={() => setOpenedPanel(openedPanel === 'brailleSettings' ? null : 'brailleSettings')}
                                                            label={"Einrichten"} icon={"braille"}>
                                    <BraillePageSettings/>
                                </AccordeonPanelFlyoutButton>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'imagedescription'}
                                                            className={"padded"}
                                                            hideFlyout={dragging}
                                                            onClick={() => setOpenedPanel(openedPanel === 'imagedescription' ? null : 'imagedescription')}
                                                            label={"Bildbeschreibung"} icon={"image"}>
                                    {/*<Writer/>*/}
                                    <Verbaliser style={{maxHeight: "100%", height: "100%"}} closeSelf={() => {
                                        setOpenedPanel(null);
                                        setShowBraillePanel(true);
                                    }}/>
                                </AccordeonPanelFlyoutButton>
                            </AccordeonPanel>
                            <AccordeonPanel title={"Objekte"}>
                                <Objects hideFlyout={dragging}/>
                            </AccordeonPanel>
                        </Sidebar>

                        <CanvasWrapper>
                            <Canvas isDragging={dragging => setDragging(dragging)} hide={page.text}/>
                            {showBraillePanel &&
                            <BraillePage/>
                            }
                        </CanvasWrapper>
                    </PanelWrapper>
                </Wrapper>

                    {/*TODO auslagern? nimmt ziemlich viele Zeilen in Editor.js*/}
                    {showImportModal &&
                    <Modal title={"Grafik importieren"} fitted actions={
                        [{
                            label: t("editor:Platzieren"),
                            disabled: traceImport.error || !traceImport.preview,
                            template: "primary",
                            align: "right",
                            action: () => {
                                // TODO nach Mausklick platzieren, also an InteractiveSVG weitergeben
                                dispatch({
                                    type: OBJECT_UPDATED,
                                    preview: methods.embedded.create(0, 0, traceImport.preview, traceImport.previewName)
                                });
                                dispatch({
                                    type: OBJECT_BULK_ADD,
                                    objects: ocrSelection.map((ocrIndex, index) => {
                                        return methods.label.create(SVG_A4_PX_WIDTH + 5, index * 50, 200, 50, ocr[index], undefined, {editMode: false});
                                    })
                                })
                                resetImportModal();
                            }
                        },
                            {label: "Abbrechen", action: resetImportModal}]}
                           dismiss={resetImportModal}>
                        <Importer/>
                    </Modal>
                    }
                </>
            );
        } else {
            return (<Wrapper><Loader large message={<>Bitte warten, <br/>wir bereiten alles vor.</>}/></Wrapper>)
        }
    } catch (error) {
        localStorage.setItem("HAS_EDITOR_CRASHED", "true");
        return <Error {...error} />
    }

};

export default Editor;