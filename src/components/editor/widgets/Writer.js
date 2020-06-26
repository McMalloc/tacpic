import React, {Component, useEffect} from 'react';
import styled from 'styled-components/macro';
import {useDispatch, useSelector} from "react-redux";
import {Lower, Upper} from "../../gui/WidgetContainer";
import {Multiline} from "../../gui/Input";
import {Alert} from "../../gui/Alert";

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
`;

const changeText = (dispatch, text, pageIndex) => {
    dispatch({
        type: 'CHANGE_PAGE_CONTENT',
        content: text,
        pageIndex
    });
};

// TODO Ladespinner während Übersetzung, vllt. globale Lösung als Notification
const Writer = props => {
    const dispatch = useDispatch();
    const currentPageIndex = useSelector(
        state => state.editor.ui.currentPage
    );
    const page = useSelector(
        state => state.editor.file.pages[currentPageIndex]
    );
    return (
        <>
            <Upper>
                <Multiline
                    rows={20}
                    // style={{height: "100%", margin: 0}}
                    label={"Inhalt der Braille-Seiten"}
                    value={page.content}
                    onChange={event => changeText(dispatch, event.target.value, currentPageIndex)}
                    id={"writer-textarea"}/>
                {page.formatted && page.formatted.length <= 1 &&
                <Alert info>Brailleseiten werden automatisch angefügt, sobald die Textlänge dies nötig macht.</Alert>
                }
            </Upper>
            <Lower>
                {page.content.split(" ").length} Wörter</Lower>
        </>
    )
};

export default Writer;