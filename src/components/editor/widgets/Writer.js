import React, {Component, useEffect} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {Upper} from "../../gui/WidgetContainer";
import {Multiline} from "../../gui/Input";
import {wrapLines} from "../../../utility/wrapLines";

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
`;

const Textarea = styled(Multiline)`
  //height: 100%;
  resize: none;
  width: 100%;
  height: 90%;
  box-sizing: border-box;
`;

const changeText = (dispatch, text, pageIndex, cellsPerRow) => {
    let wrapped = [];
    wrapLines(text, cellsPerRow, true, wrapped);
    dispatch({
        type: 'CHANGE_PAGE_CONTENT',
        content: text,
        formattedContent: wrapped.join("\n"),
        pageIndex
    });
};

const Writer = props => {
    const dispatch = useDispatch();
    const currentPageIndex = useSelector(
        state => state.editor.ui.currentPage
    );
    const page = useSelector(
        state => state.editor.file.pages[currentPageIndex]
    );
    const layout = useSelector(
        state => state.editor.file.braillePages
    );
    let wrapped = [];
    wrapLines(page.braille, layout.cellsPerRow, true, wrapped);
    return (
        <>
            <Upper>
                <Textarea
                    value={page.content}
                    onChange={event => changeText(dispatch, event.target.value, currentPageIndex, layout.cellsPerRow)}
                    id={"writer-textarea"}/>
                <pre>
                    {wrapped.join("\n")}
                </pre>
            </Upper>
        </>
    )
};

export default Writer;