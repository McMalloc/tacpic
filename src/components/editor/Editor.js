import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import '../../styles/Editor.css';
import styled, {useTheme} from 'styled-components';
import {useTranslation} from "react-i18next";
import {FILE} from "../../actions/constants";
import {useParams} from "react-router";
import Canvas from "./widgets/Canvas";
import Toggle from "../gui/Toggle";
import {Button} from "../gui/Button";
import Document from "./widgets/Document";
import Importer from "./widgets/Importer";
import Key from "./widgets/Keyedit";
import Verbalizer from "./widgets/Verbalizer";
import Metadata from "./widgets/Metadata";
import Pages from "./widgets/Pages";
import Objects from "./widgets/Objects";
import Toolbox from "./widgets/Toolbox";
import Context from "./widgets/Context/Context";
import Writer from "./widgets/Writer";
import BraillePage from "./widgets/BraillePage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1 1 auto;
  background-color: ${props => props.theme.brand_secondary};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
  padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
`;

const ToolbarSegment = styled.div`
  display: flex;
  
  button {
    
    &:not(:first-child) {
      border-left: 0;
    }
        
    &:first-child {
      border-radius: ${props => props.theme.border_radius} 0 0 ${props => props.theme.border_radius};
    }
    
    &:last-child {
      border-radius: 0 ${props => props.theme.border_radius} ${props => props.theme.border_radius} 0;
    }
    
    border-radius: 0;
  }
`;

const PanelWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
`;

const Sidebar = styled.div`
  display: flex;
  flex: 0 1 25%;
  min-width: 200px;
  flex-direction: column;
  border-top: 2px solid ${props => props.theme.brand_secondary_light};
  border-right: 2px solid ${props => props.theme.brand_secondary_light};
  background-color: ${props => props.theme.grey_6};
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
  flex: ${props => props.flex};
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid ${props => props.theme.brand_secondary_light};
`;


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
    let {variant_id} = useParams();

    useEffect(() => {
        if (!!variant_id) {
            dispatch({
                type: FILE.OPEN.REQUEST,
                id: variant_id, mode: "edit"
            })
        }
    }, []);

    const [openedModalSidebar, toggleModalSidebar] = useState(null);
    const handleModalSidebar = index => {
        index === openedModalSidebar ? toggleModalSidebar(null) : toggleModalSidebar(index);
    };

    const [showPages, togglePages] = useState(false);
    const [showObjects, toggleObjects] = useState(false);

    if (uiSettings.initialized) {
        return (
            <Wrapper>
                <Toolbar>
                    <ToolbarSegment>
                        <Toggle toggled={showPages} onClick={() => togglePages(!showPages)} label={"Seiten"}/>
                        <Toggle toggled={showObjects} onClick={() => toggleObjects(!showObjects)} label={"Objekte"}/>
                    </ToolbarSegment>
                    {/*<ToolbarSegment>*/}
                    <Toggle primary onClick={() => alert('hi')} label={"Neu"}/>
                    {/*</ToolbarSegment>*/}
                    <ToolbarSegment>
                        <Toggle primary toggled={openedModalSidebar === 0} onClick={() => handleModalSidebar(0)}
                                label={"Einrichten"}/>
                        <Toggle primary toggled={openedModalSidebar === 1} onClick={() => handleModalSidebar(1)}
                                label={"Importieren"}/>
                        {/*<Toggle primary toggled={openedModalSidebar === 2} onClick={() => handleModalSidebar(2)}*/}
                        {/*        label={"Legende"}/>*/}
                        <Toggle primary toggled={openedModalSidebar === 3} onClick={() => handleModalSidebar(3)}
                                label={"Bildbeschreibung"}/>
                        <Toggle primary toggled={openedModalSidebar === 4} onClick={() => handleModalSidebar(4)}
                                label={"Veröffentlichen"}/>
                    </ToolbarSegment>
                </Toolbar>
                <PanelWrapper>

                    {/*<ToggleSidebar>*/}
                    {/*    */}
                    {/*</ToggleSidebar>*/}

                    {(showPages || showObjects) &&
                    <Sidebar>
                        {showPages && <SidebarPanel flex={'1 0 auto'}><Pages/></SidebarPanel>}
                        {showObjects && <SidebarPanel flex={'4 0 auto'}><Objects/></SidebarPanel>}
                    </Sidebar>
                    }


                    {page.text ?
                        <>
                            <FixedSidebar>
                                <Writer/>
                            </FixedSidebar>
                            <BraillePage />
                        </>
                        :
                        <>
                            <FixedSidebar>
                                <SidebarPanel flex={'0 1 auto'}><Toolbox/></SidebarPanel>
                                <SidebarPanel flex={'1 1 100%'}><Context/></SidebarPanel>
                            </FixedSidebar>
                            <Canvas/>
                        </>
                    }


                    <ModalSidebar style={{right: openedModalSidebar === null ? '-500px' : 0}} theme={theme}>
                        {openedModalSidebar === 0 && <Document/>}
                        {openedModalSidebar === 1 && <Importer/>}
                        {openedModalSidebar === 2 && <Key/>}
                        {openedModalSidebar === 3 && <Verbalizer/>}
                        {openedModalSidebar === 4 && <Metadata/>}
                    </ModalSidebar>

                </PanelWrapper>

            </Wrapper>
        );
    } else {
        return (<div>Bitte warten.</div>)
    }
};

export default Editor;