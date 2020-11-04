import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import md5 from 'blueimp-md5';

import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {FILE, IMPORT, OBJECT_BULK_ADD, OBJECT_UPDATED, SWITCH_CURSOR_MODE} from "../../actions/action_constants";
import {useParams} from "react-router-dom";
import Canvas from "./widgets/Canvas";
import Toggle from "../gui/Toggle";
import {Button} from "../gui/Button";
import Importer from "./widgets/Importer";
import Keyedit from "./widgets/Keyedit";
import Metadata from "./widgets/Metadata";
import Pages from "./widgets/Pages";
import Objects from "./widgets/Objects";
import BraillePage from "./widgets/BraillePage";
import {Radiobar, RadiobarSegment} from "../gui/Radiobar";
import {AccordeonPanel, AccordeonPanelFlyoutButton, useRedraw} from "../gui/Accordeon";
import GraphicPageSettings from "./widgets/GraphicPageSettings";
import BraillePageSettings from "./widgets/BraillePageSettings";
import Document from "./widgets/Document";
import {Modal} from "../gui/Modal";
import {useNavigate} from "react-router";
import methods from "./ReactSVG/methods/methods";
import Loader from "../gui/Loader";
import {SVG_A4_PX_WIDTH} from "../../config/constants";
import {editor} from "../../store/initialState";
import Verbaliser from "./widgets/Verbaliser";
import ErrorBoundary from "../../ErrorBoundary";
import {findObject} from "../../utility/findObject";

const Wrapper = styled.div`
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: minmax(200px, 350px) 3fr;
  max-height: 100%;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
      "toolbar  toolbar"
      "sidebar canvas";
  
  position: relative;
  background-color: ${props => props.theme.brand_secondary};
  
  .editor-toolbar {
    grid-area: toolbar;
  }
  
  .loader {
    color: white;
  }
`;

const CanvasWrapper = styled.div`
  grid-area: canvas;
  max-height: 100%;
  position: relative;
  background-color: rgba(0,0,0,0.1);
  border-radius: ${props => props.theme.border_radius} 0 0 ${props => props.theme.border_radius};
  overflow: hidden;
  box-shadow: 5px 5px 10px rgba(0,0,0,0.3) inset;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  max-height: 100%;
  overflow: auto;
`;

const FlyoutSensitive = styled.div`
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background-color: rgba(0,0,0,0);
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
    const [rerender] = useRedraw();
    const [openedPanel, setOpenedPanel] = useState(null);
    // todo zu Hook umwandeln, wenn InteractiveSVG eine function component ist
    const [dragging, setDragging] = useState(false);
    const [showBraillePanel, setShowBraillePanel] = useState(false);
    const [handleError, setHandleError] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    let {variantId, graphicId, mode} = useParams();

    useEffect(() => {
        if (!!variantId) {
            dispatch({
                type: FILE.OPEN.REQUEST,
                id: variantId,
                data: mode === 'edit' ? {variant_id: variantId} : {
                    derivedFrom: variantId,
                    variantTitle: '',
                    variant_id: null
                }
            })
        } else if (mode === 'copy') { // new graphic
            dispatch({
                type: FILE.OPEN.SUCCESS,
                data: {
                    variant_id: null,
                    graphic_id: null,
                    derivedFrom: null,
                    version_id: null,
                    variantTitle: 'Basis',
                    graphicTitle: ''
                }
            })
        } else {
            dispatch({
                type: FILE.OPEN.SUCCESS,
                data: editor.file.present
            })
        }
    }, [graphicId, variantId, mode]);

    // LOGIC REGARDING ACCORDEON PANEL
    const [accordeonStates, setAccordeonStates] = useState(JSON.parse(localStorage.getItem('accordeonStates')) || {});
    const toggleAccordeon = (title, override) => {
        const newState = {
            ...accordeonStates,
            [title]: override || !accordeonStates[title]
        };
        setAccordeonStates(newState);
        localStorage.setItem("accordeonStates", JSON.stringify(newState));
    }

    const selectedObject = useSelector(state => {
        return findObject(
            state.editor.file.present.pages[state.editor.ui.currentPage].objects,
            state.editor.ui.selectedObjects[0])
    })
    if (!accordeonStates.key && selectedObject && selectedObject.type === 'key') {
        console.log("toggle");
        toggleAccordeon('key', true);
    }
    ;


    // ERROR HANDLING
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

    return <ErrorBoundary>
        {uiSettings.fileOpenSuccess ?
            <>
                <Wrapper>
                    <Radiobar className={"editor-toolbar"}>
                        <RadiobarSegment>
                            {["SELECT", "RECT", "ELLIPSE", "LABEL", "PATH"].map((tool, index) => {
                                return (
                                    <Toggle
                                        label={"editor:toggle_tools-" + tool}
                                        primary
                                        key={index}
                                        icon={iconMap[tool]}
                                        toggled={uiSettings.tool === tool}
                                        onClick={() => {
                                            switchCursorMode(dispatch, uiSettings.tool === tool ? "SELECT" : tool);
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
                    <Sidebar>
                        <Draftinfo onClick={() => {
                            toggleAccordeon('draft', true);
                            setOpenedPanel('publish');
                            // setTimeout(() => {
                            //     document.getElementById("label-for-graphic-title").focus();
                            // }, 100);
                        }}>
                            <strong>{file.graphicTitle.length === 0 ? <span
                                className={'disabled'}>Noch kein Titel</span> : file.graphicTitle}</strong><br/>
                            {file.graphicTitle.length !== 0 ?
                                <span>Variante: {file.variantTitle}</span>
                                :
                                <Button fullWidth primary label={"Titel ändern"}/>
                            }

                            {/*<pre style={{*/}
                            {/*    border: '2px solid green',*/}
                            {/*    textShadow: '1px 1px 0 black',*/}
                            {/*    color: 'lightgreen',*/}
                            {/*    fontSize: '11px',*/}
                            {/*    padding: '2px 3px'*/}
                            {/*}}>*/}
                            {/*        Derived from: {file.derivedFrom + ""}<br/>*/}
                            {/*        Mode: {mode}<br/>*/}
                            {/*        Graphic ID: {file.graphic_id + " (" + graphicId + ")"}<br/>*/}
                            {/*        Variant ID: {file.variant_id + " (" + variantId + ")"}<br/>*/}
                            {/*    {openedPanel + ''}*/}
                            {/*    </pre>*/}
                        </Draftinfo>
                        <AccordeonPanel
                            collapsed={!accordeonStates.draft}
                            onClick={() => toggleAccordeon('draft')}
                            title={"Entwurf"}>
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
                        <AccordeonPanel collapsed={!accordeonStates.graphicPages}
                                        onClick={() => toggleAccordeon('graphicPages')} title={"Grafikseiten"}>
                            <AccordeonPanelFlyoutButton flownOut={openedPanel === 'graphicSettings'}
                                                        className={"padded"}
                                                        hideFlyout={dragging}
                                                        onClick={() => setOpenedPanel(openedPanel === 'graphicSettings' ? null : 'graphicSettings')}
                                                        label={"Einrichten"} icon={"cog"}>
                                <GraphicPageSettings/>
                            </AccordeonPanelFlyoutButton>
                            <Pages/>
                        </AccordeonPanel>
                        <AccordeonPanel collapsed={!accordeonStates.key}
                                        onClick={() => toggleAccordeon('key')} title={"Legende"}>

                            <Keyedit className={"padded"}/>
                        </AccordeonPanel>
                        <AccordeonPanel collapsed={!accordeonStates.braillePages}
                                        onClick={() => toggleAccordeon('braillePages')} title={"Brailleseiten"}>
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
                        <AccordeonPanel collapsed={!accordeonStates.objects}
                                        onClick={() => toggleAccordeon('objects')} title={"Objekte"}>
                            <Objects hideFlyout={dragging}/>
                        </AccordeonPanel>
                    </Sidebar>
                    <CanvasWrapper>
                        <Canvas isDragging={dragging => setDragging(dragging)} hide={page.text}/>
                        {showBraillePanel &&
                        <BraillePage/>
                        }
                        {openedPanel !== null &&
                        <FlyoutSensitive onClick={() => setOpenedPanel(null)}/>
                        }
                    </CanvasWrapper>
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
            :
            <Wrapper><Loader large message={<>Bitte warten, <br/>wir bereiten alles vor.</>}/></Wrapper>
        }
    </ErrorBoundary>
};

export default Editor;