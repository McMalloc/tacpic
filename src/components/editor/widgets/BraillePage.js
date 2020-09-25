import React, {Component, useEffect} from 'react';
import styled from 'styled-components/macro';
import {useSelector} from "react-redux";
import {toBrailleNumbers} from "../../../utility/toBrailleNumber";

const brailleCellWidth = 2.5;
const brailleCellHeight = 5;

const maxRowsPerA4Page = 28; // TODO zentralisieren
const maxCellsPerA4Row = 34;

const a4Width = 210;
const a4height = 297;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1 1 auto;
`;

const Page = styled.div`
  z-index: 0;
  
  //padding: 5mm 2.5mm;
  padding-top: ${props => brailleCellHeight * props.marginTop}mm;
  padding-left: ${props => brailleCellWidth * props.marginLeft}mm;
  padding-right: ${props => brailleCellWidth * (maxCellsPerA4Row - props.cellsPerRow)}mm;
  padding-bottom: ${props => brailleCellHeight * (maxRowsPerA4Page - props.rowsPerPage)}mm;
  margin: ${props => props.theme.large_padding};
  background-color: white;
  box-sizing: border-box;
  width: fit-content;
  
  //width: ${a4Width}mm;
  //height: ${a4height}mm;
  
   font-family: ${props => props.system === 'cb' ? "HBS8" : "tacpic swell braille"};
  font-size: 10mm;
  white-space: pre;
  position: relative;
`;

const PageTitle = styled.div`
  margin: ${props => props.theme.large_padding};
  color: ${props => props.theme.background};
`;

const Pagenumber = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
`;

const BraillePage = props => {
    const currentPageIndex = useSelector(state => state.editor.ui.currentPage);
    const system = useSelector(state => state.editor.file.present.system);
    const braillePages = useSelector(state => state.editor.file.present.braillePages);
    // TODO in props stecken, der Editor weiß ohnehin Bescheid

    return (
        <Wrapper>
            {/*<h1>&emsp;Vorschau</h1>*/}
            <div>
                {braillePages.formatted && braillePages.formatted.map((pageChunk, index) => {
                    return (<a key={index}>
                            <PageTitle id={`braillepage_preview_${currentPageIndex}_${index}`}>Seite #{index + 1}</PageTitle>
                            <Page {...braillePages} system={system}>

                                {pageChunk.map((line) => <><div>{line}&ensp;</div></>)}

                                {braillePages.pageNumbers > 0 &&
                                <Pagenumber>{toBrailleNumbers(index + 1)}</Pagenumber>
                                }
                            </Page></a>
                    )
                })}
            </div>
        </Wrapper>

    )

};

export default BraillePage;