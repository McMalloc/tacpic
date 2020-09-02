import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../../gui/Button";
import {GraphicPagePreview} from "../../gui/PagePreview";
import styled from 'styled-components/macro';
import {AccordeonMenuEntry, AccordeonPanelFlyoutButton} from "../../gui/Accordeon";

const changePage = (dispatch, nr) => {
    dispatch({
        type: "PAGE_CHANGE",
        number: nr
    })
};
const addPage = (dispatch, isTextPage, pageLength) => {
    dispatch({
        type: "PAGE_ADD",
        isTextPage
    });
    dispatch({
        type: "PAGE_CHANGE",
        number: pageLength - 1
    });
};
const removePage = (dispatch, index) => {
    dispatch({
        type: "PAGE_CHANGE",
        number: Math.max(index - 1, 0)
    })
    dispatch({
        type: "PAGE_REMOVE",
        index
    })
}

const ButtonBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.base_padding};
  border-top: 1px solid ${props => props.theme.grey_4};
`;

const PageTitle = styled.div`
  padding: ${props => props.theme.large_padding};
`;

const Pages = props => {
    const {width, height, pages} = useSelector(state => state.editor.file);
    const currentPage = useSelector(state => state.editor.ui.currentPage);
    const dispatch = useDispatch();
    return (
        <>
            <>
                {pages.filter(page => !page.text).map((page, index) => {
                    const active = index === currentPage;
                    return <AccordeonMenuEntry
                        active={active} onClick={() => changePage(dispatch, index)} key={index}>
                        <GraphicPagePreview base={50} index={index} width={width} height={height}/>
                        <PageTitle>{page.name}</PageTitle>
                    </AccordeonMenuEntry>
                })}
            </>

            <ButtonBar>
                <Button icon={"trash-alt"} onClick={() => removePage(dispatch, currentPage)}>Entfernen</Button>
                <Button primary icon={"image"} onClick={() => addPage(dispatch, false, pages.length)}>Neue Grafik-Seite</Button>
            </ButtonBar>
        </>
    );
}

export default Pages;