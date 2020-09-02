import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import '../../styles/Editor.css';
import styled, {useTheme} from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {FILE, SWITCH_CURSOR_MODE} from "../../actions/action_constants";
import {useParams} from "react-router-dom";
import Canvas from "./widgets/Canvas";
import Toggle from "../gui/Toggle";
import {Button} from "../gui/Button";
import Importer from "./widgets/Importer";
import Key from "./widgets/Keyedit";
import Verbalizer from "./widgets/Verbalizer";
import Metadata from "./widgets/Metadata";
import Pages from "./widgets/Pages";
import Objects from "./widgets/Objects";
import Context from "./widgets/Context/Context";
import Writer from "./widgets/Writer";
import BraillePage from "./widgets/BraillePage";
import {Radiobar, RadiobarSegment} from "../gui/Radiobar";
import Intro from "./widgets/Intro";
import Category from "./widgets/Category";
import {Accordeon, AccordeonPanel, AccordeonPanelFlyoutButton} from "../gui/Accordeon";
import GraphicPageSettings from "./widgets/GraphicPageSettings";
import BraillePageSettings from "./widgets/BraillePageSettings";
import Document from "./widgets/Document";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1 1 auto;
  height: 100%;
  background-color: ${props => props.theme.brand_secondary};
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
  overflow: hidden;
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
    const uiSettings = useSelector(
        state => state.editor.ui
    );
    const page = useSelector(
        state => state.editor.file.pages[uiSettings.currentPage]
    );
    const dispatch = useDispatch();
    const t = useTranslation().t;
    const theme = useTheme();
    let {variantId} = useParams();

    useEffect(() => {
        if (!!variantId) {
            dispatch({
                type: FILE.OPEN.REQUEST,
                id: variantId, mode: "edit"
            })
        }
    }, []);

    const [openedPanel, setOpenedPanel] = useState(null);
    // todo zu Hook umwandeln, wenn InteractiveSVG eine function component ist
    const [dragging, setDragging] = useState(false);
    const [showBraillePanel, setShowBraillePanel] = useState(false);

    if (uiSettings.initialized) {
        return (
            <Wrapper>
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
                    </RadiobarSegment>
                    <Toggle primary onClick={() => {
                    }} label={"Neu"}/>
                </Radiobar>

                <PanelWrapper>
                    <Sidebar>
                            <AccordeonPanel title={"Entwurf"}>
                                <AccordeonPanelFlyoutButton flownOut={openedPanel === 'document'}
                                                            hideFlyout={dragging}
                                                            className={"padded"}
                                                            onClick={() => setOpenedPanel(openedPanel === 'document' ? null : 'document')}
                                                            label={"Einrichten"} icon={"cog"}>
                                    <Document />
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
                                    <GraphicPageSettings />
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
                                <Key className={"padded"} />
                            </AccordeonPanel>
                            <AccordeonPanel title={"Brailleseiten"}>
                                <AccordeonPanelFlyoutButton flownOut={showBraillePanel}
                                                            className={"padded"}
                                                            onClick={() => setShowBraillePanel(!showBraillePanel)}
                                                            label={"Einblenden"} icon={"mag"} />
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
                                    <Verbalizer/>
                                </AccordeonPanelFlyoutButton>
                            </AccordeonPanel>
                            <AccordeonPanel title={"Objekte"}>
                                <Objects hideFlyout={dragging}/>
                            </AccordeonPanel>
                    </Sidebar>
                    }

                    <CanvasWrapper>
                        <Canvas isDragging={dragging => setDragging(dragging)} hide={page.text}/>
                        {showBraillePanel &&
                            <BraillePage/>
                        }
                    </CanvasWrapper>
                </PanelWrapper>
            </Wrapper>
        );
    } else {
        return (<div>Bitte warten.</div>)
    }
};

export default Editor;