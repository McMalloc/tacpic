import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Select from "../../gui/Select";
import {Row} from "../../gui/Grid";
import {Checkbox} from "../../gui/Checkbox";
import {Numberinput} from "../../gui/Input";
import styled from 'styled-components/macro';
import {
    A4_HEIGHT,
    A4_MAX_CHARS_PER_ROW,
    A4_MAX_ROWS_PER_PAGE,
    A4_WIDTH,
    PAGE_NUMBER_BOTTOM
} from "../../../config/constants";

const changeBraillePageProperty = (dispatch, key, value) => {
    dispatch({
        type: "CHANGE_BRAILLE_PAGE_PROPERTY",
        key, value
    })
};

const PageGrid = styled.div`
    display: flex;                       /* establish flex container */
    flex-wrap: wrap;                     /* enable flex items to wrap */
    justify-content: space-around;
`;

const GridCell = styled.div`
    flex: 0 0 50%;                       /* don't grow, don't shrink, width */
    margin-bottom: 5px;
    &.page-image-container {
      text-align: center;
      position: relative;
      img {
        width: 70%;
      }
      div.page-number {
        position: absolute;
        bottom: 12px;
        width: 100%;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }
    }
`;

const BraillePageSettings = props => {
    const dispatch = useDispatch();
    const {
        braillePages,
        width,
        height
    } = useSelector(state => state.editor.file.present);

    return (
        <>
            <fieldset>
                {/*<legend>Format</legend>*/}
                <Row>
                    {/* <div className={"col-sm-12"}>
                        <Select label={"editor:label_page-format"} default={"a4"} options={
                            [
                                {label: "A4", value: "a4"},
                                {label: "A3", value: "a3"},
                                {label: "Marburger Format (27 × 34 cm)", value: "marburg"}
                            ]}
                        />
                    </div> */}
                    <div className={"col-sm-12"}>
                        <PageGrid>
                            <GridCell>
                                {/*<Alert info>*/}
                                Für A4-Seiten gilt:<br/>
                                <strong>Max. {A4_MAX_ROWS_PER_PAGE} Zeilen pro Seite<br/>
                                    max. {A4_MAX_CHARS_PER_ROW} Zeichen pro Zeile</strong>
                                {/*</Alert>*/}

                            </GridCell>
                            <GridCell>
                                <Numberinput
                                    onChange={event => {
                                        changeBraillePageProperty(dispatch, 'marginTop', event.currentTarget.value)
                                    }}
                                    value={braillePages.marginTop}
                                    max={Math.min(height === A4_HEIGHT && A4_MAX_ROWS_PER_PAGE - (braillePages.pageNumbers > 0 ? 1 : 0), 10)}
                                    min={0}
                                    sublabel={"in Zeilen"}
                                    label={"Rand oben"}/>

                                <Numberinput
                                    onChange={event => {
                                        changeBraillePageProperty(dispatch, 'rowsPerPage', event.currentTarget.value)
                                    }}
                                    max={height === A4_HEIGHT && A4_MAX_ROWS_PER_PAGE - (braillePages.pageNumbers > 0 ? 1 : 0)}
                                    min={1}
                                    value={braillePages.rowsPerPage}
                                    label={"Zeilen pro Seite"}/>
                            </GridCell>

                            <GridCell><Numberinput
                                onChange={event => {
                                    changeBraillePageProperty(dispatch, 'marginLeft', event.currentTarget.value)
                                }}
                                value={braillePages.marginLeft}
                                max={Math.min(width === A4_WIDTH && A4_MAX_CHARS_PER_ROW, 10)}
                                min={0}
                                sublabel={"in Zellen"}
                                label={"Rand links"}/>

                                <Numberinput
                                    onChange={event => {
                                        changeBraillePageProperty(dispatch, 'cellsPerRow', event.currentTarget.value)
                                    }}
                                    max={width === A4_WIDTH && A4_MAX_CHARS_PER_ROW}
                                    min={1}
                                    value={braillePages.cellsPerRow}
                                    label={"Zeichen pro Zeile"}/>
                            </GridCell>
                            <GridCell className={"page-image-container"}>
                                <img src={"/images/page.svg"}/>
                                {braillePages.pageNumbers > 0 && <div className={"page-number"}>#</div>}
                            </GridCell>

                            <GridCell></GridCell>
                            <GridCell></GridCell>
                        </PageGrid>


                    </div>
                </Row>
                <Row>
                    <div className={"col-sm-6"}>

                    </div>
                    <div className={"col-sm-6"}>

                    </div>
                </Row>
                <Row>
                    <div className={"col-sm-6"}>
                        <Checkbox
                            name={"cb_pagenumbers"}
                            value={braillePages.pageNumbers > 0}
                            onChange={() => {
                                changeBraillePageProperty(dispatch, "pageNumbers", braillePages.pageNumbers === 0 ? PAGE_NUMBER_BOTTOM : 0)
                            }}
                            label={"Seitenzahlen"} sublabel={"verringern die mögliche Anzahl an Zeilen auf 22"}/>
                    </div>
                </Row>
            </fieldset>
        </>
    );
};

export default BraillePageSettings;