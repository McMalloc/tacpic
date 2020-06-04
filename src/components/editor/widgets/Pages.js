import React, {Component} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import {Button} from "../../gui/Button";
import {BraillePagePreview, GraphicPagePreview} from "../../gui/PagePreview";
import styled from 'styled-components/macro';
import {Lower, Upper} from "../../gui/WidgetContainer";

const changePage = (dispatch, nr) => {
    dispatch({
        type: "PAGE_CHANGE",
        number: nr
    })
};
const addPage = (dispatch, isTextPage) => {
    dispatch({
        type: "PAGE_ADD",
        isTextPage
    })
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

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Pages = props => {
    const {width, height, pages} = useSelector(state=>state.editor.file);
    const currentPage = useSelector(state=>state.editor.ui.currentPage);
    const dispatch = useDispatch();
    return (
        <>
            <Upper>
                <Wrapper>
                {pages.map((page, i) => {
                        return (
                            page.text ?
                                <BraillePagePreview
                                    width={width}
                                    height={height}
                                    current={i === currentPage}
                                    key={i} index={i}
                                    onClick={() => changePage(dispatch, i)}
                                    {...page}/>
                                :
                                <GraphicPagePreview
                                    width={width}
                                    height={height}
                                    current={i === currentPage}
                                    key={i} index={i}
                                    onClick={() => changePage(dispatch, i)}
                                    title={page.name}/>
                        )
                    }
                )}
                </Wrapper>
            </Upper>

            <Lower style={{flexDirection: "column"}}>
                <Button icon={"trash-alt"} onClick={() => removePage(dispatch, currentPage)}>Entfernen</Button>
                <Button primary icon={"image"} onClick={() => addPage(dispatch, false)}>Neue Grafik-Seite</Button>
                {/*<Button primary icon={"braille"} onClick={() => addPage(dispatch, true)}>Neue Braille-Seite</Button>*/}
            </Lower>
        </>
    );
}

export default Pages;