import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import md5 from "blueimp-md5";

import styled from "styled-components/macro";
import { useTranslation } from "react-i18next";
import {
  COPY,
  FILE,
  IMPORT,
  OBJECT_BULK_ADD,
  OBJECT_UPDATED,
  SUPPRESS_BACKUP,
  SWITCH_CURSOR_MODE,
} from "../../actions/action_constants";
import { Prompt, useParams } from "react-router-dom";
import Canvas from "./widgets/Canvas";
import Toggle from "../gui/Toggle";
import { Button } from "../gui/Button";
import Importer from "./widgets/Importer";
import Keyedit from "./widgets/Keyedit";
import Metadata from "./widgets/Metadata";
import Pages from "./widgets/Pages";
import Objects from "./widgets/Objects";
import BraillePage from "./widgets/BraillePage";
import { Radiobar, RadiobarSegment } from "../gui/Radiobar";
import {
  AccordeonPanel,
  AccordeonPanelFlyoutButton,
} from "../gui/Accordeon";
import GraphicPageSettings from "./widgets/GraphicPageSettings";
import BraillePageSettings from "./widgets/BraillePageSettings";
import Document from "./widgets/Document";
import Modal from "../gui/Modal";
import * as moment from "moment";
import { useNavigate } from "react-router";
import methods from "./ReactSVG/methods/methods";
import Loader from "../gui/Loader";
import { SVG_A4_PX_WIDTH, TOOLS } from "../../config/constants";
import { editor } from "../../store/initialState";
import Verbaliser from "./widgets/Verbaliser";
import ErrorBoundary from "../../ErrorBoundary";
import { findObject } from "../../utility/findObject";
import { Alert } from "../gui/Alert";
import { useBreakpoint } from "../../contexts/breakpoints";
import { Icon } from "../gui/_Icon";
import uuidv4 from '../../utility/uuid';

const Wrapper = styled.div`
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: minmax(200px, 350px) 3fr 3fr;
  max-height: 100%;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "toolbar  toolbar toolbar"
    "sidebar canvas braillepage";

  position: relative;
  background-color: ${(props) => props.theme.brand_secondary};

  .editor-toolbar {
    grid-area: toolbar;
  }

  .loader {
    color: white;
    grid-area: canvas;
  }
`;

const CanvasWrapper = styled.div`
  grid-area: ${(props) =>
    props.full ? "canvas / canvas / canvas / braillepage" : "canvas"};
  max-height: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${(props) => props.theme.border_radius} 0 0
    ${(props) => props.theme.border_radius};
  overflow: hidden;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3) inset;
`;

const BraillePageWrapper = styled(BraillePage)`
  grid-area: braillepage;
`;

const SaveIndicator = styled.div`
  visibility: hidden;
  padding: 6px 0;
  font-size: 0.9rem;
  animation: pulsating 0.75s infinite;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  max-height: 100%;
  overflow: auto;
`;

const FlyoutSensitive = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
`;

const Draftinfo = styled.div`
  color: ${(props) => props.theme.background};
  padding: ${(props) => props.theme.large_padding};
  margin-bottom: 6px;
  cursor: pointer;
`;

// const Loading

const switchCursorMode = (dispatch, mode) => {
  dispatch({
    type: SWITCH_CURSOR_MODE,
    mode,
  });
};

const Editor = (props) => {
  const uiSettings = useSelector((state) => state.editor.ui);
  const file = useSelector((state) => state.editor.file.present);
  const page = file.pages;
  const fileHash = file.lastVersionHash;
  const error = useSelector((state) => state.app.error);
  const undoLength = useSelector((state) => state.editor.file.past.length);
  const redoLength = useSelector((state) => state.editor.file.future.length);
  const user = useSelector((state) => state.user);
  const traceImport = useSelector((state) => state.editor.ui.import);
  const ocr = useSelector((state) => state.editor.ui.import.ocr);
  const ocrSelection = useSelector(
    (state) => state.editor.ui.import.ocrSelection
  );
  const selectedObject = useSelector((state) => {
    return findObject(
      state.editor.file.present.pages[state.editor.ui.currentPage].objects,
      state.editor.ui.selectedObjects[0]
    );
  });
  const clipboard = useSelector((state) => state.editor.ui.clipboard);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lg } = useBreakpoint();
  const t = useTranslation().t;
  const [openedPanel, setOpenedPanel] = useState(null);
  const [rerender, rerenderUnrulyComponents] = useState(0);
  const [accordeonStates, setAccordeonStates] = useState(
    JSON.parse(localStorage.getItem("accordeonStates")) || {}
  );
  // todo zu Hook umwandeln, wenn InteractiveSVG eine function component ist
  const [dragging, setDragging] = useState(false);
  const [showBraillePanel, setShowBraillePanel] = useState(false);
  const [handleBackup, setHandleBackup] = useState(
    localStorage.getItem("HAS_EDITOR_CRASHED") === "true"
  );
  const [showImportModal, setShowImportModal] = useState(false);

  let { variantId, graphicId, mode } = useParams();

  const onKeyDownHandler = (event) => {
    switch (event.which) {
      case 67:
        if (event.ctrlKey) {
          dispatch({
            type: COPY,
            objects: [selectedObject],
          });
        }
        break;
      case 86:
        if (event.ctrlKey && clipboard.length > 0) {
          dispatch({
            type: OBJECT_UPDATED,
            preview: {...clipboard[0], uuid: uuidv4(), x: clipboard[0].x + 20, y: clipboard[0].y + 20},
          });
        }
        break;
      case 90:
        if (event.ctrlKey && undoLength > 0) dispatch({ type: "UNDO" });
        break;
      case 89:
        if (event.ctrlKey && redoLength > 0) dispatch({ type: "REDO" });
        break;
    }
  };

  useEffect(() => {
    if (!!variantId) {
      let overrides = {};
      switch (mode) {
        case "edit": // edit an variant, e.g. keep variant_id and graphic_id, assign new version_id
          overrides = { variant_id: variantId };
          break;
        case "copy": // create a new variant, e.g. keep graphic_id, assign new variant_id
          overrides = {
            derivedFrom: variantId,
            variantTitle: "",
            variant_id: null,
          };
          break;
        case "new": // create a new graphic, e.g.assign new variant_id and graphic_id
          overrides = {
            derivedFrom: null,
            variantTitle: "",
            variant_id: null,
            graphic_id: null,
          };
          break;
        default:
          break;
      }
      dispatch({
        type: FILE.OPEN.REQUEST,
        id: variantId,
        mode,
        data: overrides,
      });
    } else {
      dispatch({
        type: FILE.OPEN.SUCCESS,
        data: editor.file.present,
      });
    }
    return () => {
      dispatch({
        type: SUPPRESS_BACKUP,
        flag: false,
      });
    };
  }, [graphicId, variantId, mode]);

  if (!lg) {
    return (
      <div className={"row"}>
        <div
          className={
            "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3"
          }
        >
          <Alert warning>{t("editor:not_available-screen")}</Alert>
        </div>
      </div>
    );
  }

  if (handleBackup) {
    let backup = JSON.parse(localStorage.getItem("EDITOR_BACKUP"));
    const backup_date = moment(
      JSON.parse(localStorage.getItem("EDITOR_BACKUP_DATE"))
    );
    if (!!backup) {
      return (
        <Modal
          fitted
          title={"Sitzung wiederherstellen"}
          dismiss={() => setHandleBackup(false)}
          actions={[
            {
              label: "Nein, Sicherung verwerfen",
              align: "left",
              action: () => {
                setHandleBackup(false);
                localStorage.removeItem("HAS_EDITOR_CRASHED");
                dispatch({
                  type: SUPPRESS_BACKUP,
                  flag: true,
                });
              },
            },
            {
              label: "Ja, Sicherung öffnen",
              align: "right",
              template: "primary",
              action: () => {
                setHandleBackup(false);
                localStorage.removeItem("HAS_EDITOR_CRASHED");
                dispatch({
                  type: FILE.OPEN.SUCCESS,
                  data: backup,
                  mode: "edit",
                });
                dispatch({
                  type: SUPPRESS_BACKUP,
                  flag: true,
                });
              },
            },
          ]}
        >
          <Alert info>Es liegt die Sicherung einer früheren Sitzung vor.</Alert>
          <div className={"some-extra-padding"}>
            <table>
              <tbody>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "1em" }}>
                    Datum der Sicherung:
                  </td>
                  <td>
                    <strong>
                      {backup_date.format("DD. MMM YYYY, HH:mm")} Uhr
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "1em" }}>
                    Entwurfstitel:
                  </td>
                  <td>
                    <strong>{backup.graphicTitle}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", paddingRight: "1em" }}>
                    Variantentitel:
                  </td>
                  <td>
                    <strong>{backup.variantTitle}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Möchten Sie das Backup laden?</p>
        </Modal>
      );
    }
  }

  // LOGIC REGARDING ACCORDEON PANEL
  const toggleAccordeon = (title, override) => {
    const newState = {
      ...accordeonStates,
      [title]: override || !accordeonStates[title],
    };
    setAccordeonStates(newState);
    localStorage.setItem("accordeonStates", JSON.stringify(newState));
  };

  if (!accordeonStates.key && selectedObject && selectedObject.type === "key")
    toggleAccordeon("key", true);

  const resetImportModal = () => {
    dispatch({ type: IMPORT.TRACE.FAILURE, message: null });
    setShowImportModal(false);
  };

  return (
    <ErrorBoundary>
      {uiSettings.fileOpenSuccess ? (
        <>
          <Wrapper onKeyDown={onKeyDownHandler}>
            <Radiobar className={"editor-toolbar"}>
              <RadiobarSegment>
                {Object.keys(TOOLS).map(
                  (tool, index) => {
                    return (
                      <Toggle
                        label={"editor:toggle_tools-" + tool}
                        primary
                        key={index}
                        icon={TOOLS[tool].cssClass}
                        toggled={uiSettings.tool === tool}
                        onClick={() => {
                          if (
                            uiSettings.tool === "SELECT" &&
                            tool !== "SELECT"
                          ) {
                            dispatch({
                              type: "OBJECT_SELECTED",
                              uuids: [null],
                            });
                          }
                          switchCursorMode(
                            dispatch,
                            uiSettings.tool === tool ? "SELECT" : tool
                          );
                        }}
                      />
                    );
                  }
                )}
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
                  title={"editor:undo-hint"}
                  disabled={undoLength === 0}
                  icon={"undo"}
                  onClick={() => {
                    dispatch({ type: "UNDO" });
                  }}
                />
                <Button
                  label={"editor:redo"}
                  primary
                  title={"editor:redo-hint"}
                  disabled={redoLength === 0}
                  icon={"redo"}
                  onClick={() => {
                    dispatch({ type: "REDO" });
                  }}
                />
              </RadiobarSegment>
              {/*<Toggle primary onClick={() => {*/}
              {/*}} label={"Neu"}/>*/}
            </Radiobar>
            <Sidebar>
              <Draftinfo
                onClick={() => {
                  toggleAccordeon("draft", true);
                  setOpenedPanel("publish");
                  // setTimeout(() => {
                  //     document.getElementById("label-for-graphic-title").focus();
                  // }, 100);
                }}
              >
                <strong>
                  {file.graphicTitle.length === 0 ? (
                    <span className={"disabled"}>Noch kein Titel</span>
                  ) : (
                    file.graphicTitle
                  )}
                </strong>
                <br />
                {file.graphicTitle.length !== 0 ? (
                  <span>Variante: {file.variantTitle}</span>
                ) : (
                  <Button fullWidth primary label={"Titel ändern"} />
                )}
                <br />
                <SaveIndicator id={"save-indicator"}>
                  <Icon icon={"save"} /> Wird gespeichert ...
                </SaveIndicator>
              </Draftinfo>
              <AccordeonPanel
                collapsed={!accordeonStates.draft}
                onClick={() => toggleAccordeon("draft")}
                title={"Entwurf"}
              >
                {/* <AccordeonPanelFlyoutButton flownOut={openedPanel === 'document'}
                                                        hideFlyout={dragging}
                                                        className={"padded"}
                                                        onClick={() => setOpenedPanel(openedPanel === 'document' ? null : 'document')}
                                                        label={"Einrichten"} icon={"cog"}> */}
                <Document className={"padded"} />
                {/* </AccordeonPanelFlyoutButton> */}
                <AccordeonPanelFlyoutButton
                  flownOut={openedPanel === "publish"}
                  className={"padded"}
                  primary
                  hideFlyout={dragging}
                  onClick={() =>
                    setOpenedPanel(openedPanel === "publish" ? null : "publish")
                  }
                  label={"Veröffentlichen"}
                  icon={"upload"}
                >
                  <Metadata />
                </AccordeonPanelFlyoutButton>
              </AccordeonPanel>
              <AccordeonPanel
                collapsed={!accordeonStates.graphicPages}
                onClick={() => toggleAccordeon("graphicPages")}
                title={"Grafikseiten"}
              >
                <AccordeonPanelFlyoutButton
                  flownOut={openedPanel === "graphicSettings"}
                  className={"padded"}
                  hideFlyout={dragging}
                  onClick={() =>
                    setOpenedPanel(
                      openedPanel === "graphicSettings"
                        ? null
                        : "graphicSettings"
                    )
                  }
                  label={"Einrichten"}
                  icon={"cog"}
                >
                  <GraphicPageSettings />
                </AccordeonPanelFlyoutButton>
                <Pages />
              </AccordeonPanel>
              <AccordeonPanel
                collapsed={!accordeonStates.key}
                onClick={() => toggleAccordeon("key")}
                title={"Legende"}
              >
                <Keyedit className={"padded"} />
              </AccordeonPanel>
              <AccordeonPanel
                collapsed={!accordeonStates.braillePages}
                onClick={() => toggleAccordeon("braillePages")}
                title={"Brailleseiten"}
              >
                <AccordeonPanelFlyoutButton
                  flownOut={showBraillePanel}
                  className={"padded"}
                  onClick={() => setShowBraillePanel(!showBraillePanel)}
                  label={"Einblenden"}
                  icon={"mag"}
                />
                <AccordeonPanelFlyoutButton
                  flownOut={openedPanel === "brailleSettings"}
                  className={"padded"}
                  hideFlyout={dragging}
                  onClick={() =>
                    setOpenedPanel(
                      openedPanel === "brailleSettings"
                        ? null
                        : "brailleSettings"
                    )
                  }
                  label={"Einrichten"}
                  icon={"braille"}
                >
                  <BraillePageSettings />
                </AccordeonPanelFlyoutButton>
                <AccordeonPanelFlyoutButton
                  flownOut={openedPanel === "imagedescription"}
                  forcedRerender={rerender}
                  className={"padded"}
                  hideFlyout={dragging}
                  onClick={() =>
                    setOpenedPanel(
                      openedPanel === "imagedescription"
                        ? null
                        : "imagedescription"
                    )
                  }
                  label={"Bildbeschreibung"}
                  icon={"image"}
                >
                  <Verbaliser
                    style={{ maxHeight: "100%", height: "100%" }}
                    redrawCallback={() => {
                      rerenderUnrulyComponents(rerender + 1);
                    }}
                    closeSelf={() => {
                      setOpenedPanel(null);
                      setShowBraillePanel(true);
                    }}
                  />
                </AccordeonPanelFlyoutButton>
              </AccordeonPanel>
              <AccordeonPanel
                collapsed={!accordeonStates.objects}
                onClick={() => toggleAccordeon("objects")}
                title={"Objekte"}
              >
                <Objects hideFlyout={dragging} />
              </AccordeonPanel>
            </Sidebar>
            <CanvasWrapper full={!showBraillePanel}>
              <Canvas
                isDragging={(dragging) => setDragging(dragging)}
                hide={page.text}
              />
              {openedPanel !== null && (
                <FlyoutSensitive onClick={() => setOpenedPanel(null)} />
              )}
            </CanvasWrapper>
            {showBraillePanel && <BraillePageWrapper />}
          </Wrapper>

          {/*TODO auslagern? nimmt ziemlich viele Zeilen in Editor.js*/}
          {showImportModal && (
            <Modal
              title={"Grafik importieren"}
              fitted
              actions={[
                {
                  label: t("editor:Platzieren"),
                  disabled: traceImport.error || !traceImport.preview,
                  template: "primary",
                  align: "right",
                  action: () => {
                    // TODO nach Mausklick platzieren, also an InteractiveSVG weitergeben
                    dispatch({
                      type: OBJECT_UPDATED,
                      preview: methods.embedded.create(
                        0,
                        0,
                        traceImport.preview,
                        traceImport.previewName
                      ),
                    });
                    dispatch({
                      type: OBJECT_BULK_ADD,
                      objects: ocrSelection.map((ocrIndex, index) => {
                        return methods.label.create(
                          SVG_A4_PX_WIDTH + 5,
                          index * 50,
                          200,
                          50,
                          ocr[index],
                          undefined,
                          { editMode: false }
                        );
                      }),
                    });
                    resetImportModal();
                  },
                },
                { label: "Abbrechen", action: resetImportModal },
              ]}
              dismiss={resetImportModal}
            >
              <Importer />
            </Modal>
          )}
          <Prompt
            when={!uiSettings.suppressBackup}
            message={t("editor:unsaved_changes_prompt")}
          />
        </>
      ) : (
        <Wrapper>
          <Loader large message={"Bitte warten, wir bereiten alles vor."} />
        </Wrapper>
      )}
    </ErrorBoundary>
  );
};

export default Editor;
