import React, {Component, useEffect} from 'react';
import styled from 'styled-components';
import {useSelector} from "react-redux";

// const Widget = styled.div`
//   position: relative;
//   height: 300px;
// `;

const brailleCellWidth = 2.5;
const brailleCellHeight = 5;

const maxRowsPerA4Page = 28; // todo zentralisieren
const maxCellsPerA4Row = 34;

const a4Width = 210;
const a4height = 297;

const Wrapper = styled.div`
  //flex: 1 1 auto;
  z-index: 0;
  
  //padding: 0;
  padding-top: ${props => brailleCellHeight * props.marginTop}mm;
  padding-left: ${props => brailleCellWidth * props.marginLeft}mm;
  padding-right: ${props => a4Width - brailleCellHeight * (props.marginTop + props.rowsPerPage)}mm;
  padding-bottom: ${props => a4height - brailleCellWidth * (props.marginLeft + props.cellsPerRow)}mm;
  margin: ${props => props.theme.large_padding};
  background-color: white;
  box-sizing: border-box;
  
  //width: ${a4Width}mm;
  //height: ${a4height}mm;
  
  font-family: ${props => props.system === 'cb' ? "HBS8" : "HBS6"};
  font-size: 10mm;
  white-space: pre;
`;

const Margin = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid grey;
  box-sizing: border-box;
`;

const BraillePage = props => {
    const currentPageIndex = useSelector(
        state => state.editor.ui.currentPage
    );
    const system = useSelector(
        state => state.editor.file.system
    );
    const page = useSelector(
        state => state.editor.file.pages[currentPageIndex]
    );
    const layout = useSelector(
        state => state.editor.file.braillePages
    );

    return (
        <Wrapper {...layout} system={system}>
            <Margin>
                {page.braille}
            </Margin>
        </Wrapper>
    )

};

export default BraillePage;