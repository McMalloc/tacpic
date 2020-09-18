import React, {Component, useEffect} from 'react';
import styled from 'styled-components/macro';
import {useDispatch, useSelector} from "react-redux";
import {Lower, WidgetWrapper} from "../../gui/WidgetContainer";
import {Multiline} from "../../gui/Input";
import {Alert} from "../../gui/Alert";
import {CHANGE_PAGE_CONTENT} from "../../../actions/action_constants";

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
`;

const changeText = (dispatch, text) => {
    dispatch({
        type: CHANGE_PAGE_CONTENT,
        content: text
    });
};

// TODO Ladespinner während Übersetzung, vllt. globale Lösung als Notification
const Writer = props => {
    const dispatch = useDispatch();
    const braillePages = useSelector(
        state => state.editor.file.present.braillePages
    );
    return (
        <>
            <>
                <Multiline
                    rows={20}
                    // style={{height: "100%", margin: 0}}
                    label={"Inhalt der Braille-Seiten"}
                    value={braillePages.content}
                    onChange={event => changeText(dispatch, event.target.value)}
                    id={"writer-textarea"}/>
                {braillePages.formatted && braillePages.formatted.length <= 1 &&
                <Alert info>Brailleseiten werden automatisch angefügt, sobald die Textlänge dies nötig macht.</Alert>
                }
            </>
            <p>
                {braillePages.content.split(" ").length} Wörter, {braillePages.formatted.length} Seiten
            </p>
        </>
    )
};

export default Writer;