import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Radio} from "../../gui/Radio";
import Select from "../../gui/Select";
import {Row} from "../../gui/Grid";
import {Checkbox} from "../../gui/Checkbox";
import {Numberinput, Textinput} from "../../gui/Input";
import {Upper} from "../../gui/WidgetContainer";
import Tooltip from "../../gui/Tooltip";
import Tabs from "../../gui/Tabs";
import styled from 'styled-components';
import {Alert} from "../../gui/Alert";

const changeFileProperty = (dispatch, key, value) => {
    dispatch({
        type: "CHANGE_FILE_PROPERTY",
        key, value
    })
};

const changeBraillePageProperty = (dispatch, key, value) => {
    dispatch({
        type: "CHANGE_BRAILLE_PAGE_PROPERTY",
        key, value
    })
};

const toggleDefaultTitle = (dispatch, state) => {
    dispatch({
        type: "DEFAULT_TITLE_TOGGLE",
        state
    })
};

const PageGrid = styled.div`
    display: flex;                       /* establish flex container */
    flex-wrap: wrap;                     /* enable flex items to wrap */
    justify-content: space-around;
`;

const GridCell = styled.div`
    flex: 0 0 50%;                       /* don't grow, don't shrink, width */
    //height: 50px;
    margin-bottom: 5px;
    &.page-image-container {
      text-align: center;
      img {
        width: 70%;
      }
    }
`;

const Document = props => {
    const dispatch = useDispatch();
    const {
        verticalGridSpacing,
        horizontalGridSpacing,
        showVerticalGrid,
        showHorizontalGrid,
        title,
        width,
        height,
        system,
        defaultTitle,
        braillePages
    } = useSelector(state => state.editor.file);

    const graphicPageSettings =
        <>
            <fieldset>
                <legend>Format</legend>
                <Row>
                    <div className={"col-sm-6"}>
                        <Select label={"editor:label_page-format"} default={"a4"} options={
                            [
                                {label: "A4", value: "a4"},
                                {label: "A3", value: "a3"},
                                {label: "Marburger Format (27 × 34 cm)", value: "marburg"}
                            ]}
                        />


                    </div>
                    <div className={"col-sm-6"}>
                        <Radio name={"orientation"} default={"landscape"} options={[
                            {label: "Hochformat", value: "portrait"},
                            {label: "Querformat", value: "landscape"}]}/>
                    </div>
                </Row>
                {/*<Row>*/}
                {/*    <div className={"col-sm-6"}>*/}
                {/*        <Select tip={"help:select_medium"}*/}
                {/*                label={"editor:select_medium"}*/}
                {/*                options={*/}
                {/*                    [*/}
                {/*                        {label: "Schwellpapier", value: "swell"},*/}
                {/*                        {label: "3D-Druck", value: "3d", isDisabled: true},*/}
                {/*                        {label: "Thermoform", value: "thermo", isDisabled: true},*/}
                {/*                        {label: "Schnittcollage", value: "cut", isDisabled: true}*/}
                {/*                    ]*/}
                {/*                } default={"swell"}/>*/}
                {/*    </div>*/}
                {/*    <div className={"col-sm-6"}>*/}
                {/*        /!*todo: erst zeigen, nachdem etwas anderes als Schwellpapier ausgewählt worden ist*!/*/}
                {/*        /!*<Alert info>*!/*/}
                {/*        /!*    Die Wahl des Mediums hat einen Einfluss auf die angebotenen Bearbeitungsfunktionen des*!/*/}
                {/*        /!*    Editors. <a href={"#"}>Mehr erfahren</a>*!/*/}
                {/*        /!*</Alert>*!/*/}
                {/*    </div>*/}
                {/*</Row>*/}
            </fieldset>
            <fieldset>
                <legend>Grundraster</legend>
                <Row>
                    <div className={"col-sm-6"}>
                        <Checkbox
                            name={"cb_vertical-grid"}
                            checked={showVerticalGrid}
                            onChange={() => {
                                changeFileProperty(dispatch, 'showVerticalGrid', !showVerticalGrid)
                            }}
                            label={"Vertikales Gitternetz zeigen"}/>

                        <img style={{width: 80, height: "auto"}} src={"/images/vertical_grid.svg"}/>
                    </div>

                    <div className={"col-sm-6"}>
                        <Numberinput
                            disabled={!showVerticalGrid}
                            onChange={event => {
                                changeFileProperty(dispatch, 'verticalGridSpacing', event.currentTarget.value)
                            }}
                            value={verticalGridSpacing}
                            label={"Abstand"}
                            sublabel={"vertikaler Gitternetzlinien"}
                            unit={"mm"}/>
                    </div>
                </Row>
                <Row>
                    <div className={"col-sm-6"}>
                        <Checkbox
                            name={"cb_horizontal-grid"}
                            checked={showHorizontalGrid}
                            onChange={() => {
                                changeFileProperty(dispatch, 'showHorizontalGrid', !showHorizontalGrid)
                            }}
                            label={"Horizontales Gitternetz zeigen"}/>

                        <img style={{width: 80, height: "auto"}} src={"/images/horizontal_grid.svg"}/>
                    </div>

                    <div className={"col-sm-6"}>
                        <Numberinput
                            disabled={!showHorizontalGrid}
                            onChange={event => {
                                changeFileProperty(dispatch, 'horizontalGridSpacing', event.currentTarget.value)
                            }}
                            value={horizontalGridSpacing}
                            label={"Abstand"}
                            sublabel={"horizontaler Gitternetzlinien"}
                            unit={"mm"}/>
                    </div>
                </Row>
            </fieldset>
            <fieldset>
                <legend>Startelemente</legend>
                <Row>
                    <div className={"col-sm-6"}>
                        <Select label={"editor:label_page-binding"} default={"none"} options={
                            [
                                {label: "Keine Bindung", value: "none"},
                                {label: "Ringbindung oben", value: "ro"},
                                {label: "Ringbindung unten", value: "ru"}
                            ]}
                        />
                    </div>
                    <div className={"col-sm-6"}>
                        <Checkbox
                            name={"cb_title"}
                            checked={defaultTitle}
                            onChange={() => {
                                toggleDefaultTitle(!defaultTitle)
                            }}
                            label={"Titel"}/>
                    </div>
                </Row>
            </fieldset>
        </>;
    const braillePageSettings =
        <>
            <fieldset>
                {/*<legend>Format</legend>*/}
                <Row>
                    <div className={"col-sm-12"}>
                        <Select label={"editor:label_page-format"} default={"a4"} options={
                            [
                                {label: "A4", value: "a4"},
                                {label: "A3", value: "a3"},
                                {label: "Marburger Format (27 × 34 cm)", value: "marburg"}
                            ]}
                        />
                    </div>
                    <div className={"col-sm-12"}>
                        <PageGrid>
                            <GridCell>
                                {/*<Alert info>*/}
                                Für A4-Seiten gilt:<br/>
                                <strong>Max. 28 Zeilen pro Seite<br/>
                                    max. 34 Zeichen pro Zeile</strong>
                                {/*</Alert>*/}

                            </GridCell>
                            <GridCell>
                                <Numberinput
                                onChange={event => {
                                    changeBraillePageProperty(dispatch, 'marginTop', event.currentTarget.value)
                                }}
                                value={braillePages.marginTop}
                                max={Math.min(height === 297 && 28, 10)}
                                min={0}
                                sublabel={"in Zeilen"}
                                label={"Rand oben"}/>

                                <Numberinput
                                    onChange={event => {
                                        changeBraillePageProperty(dispatch, 'rowsPerPage', event.currentTarget.value)
                                    }}
                                    max={height === 297 && 28}
                                    min={1}
                                    value={braillePages.rowsPerPage}
                                    label={"Zeilen pro Seite"}/>
                            </GridCell>

                            <GridCell><Numberinput
                                onChange={event => {
                                    changeBraillePageProperty(dispatch, 'marginLeft', event.currentTarget.value)
                                }}
                                value={braillePages.marginLeft}
                                max={Math.min(width === 210 && 34, 10)}
                                min={0}
                                sublabel={"in Zellen"}
                                label={"Rand links"}/>

                                <Numberinput
                                    onChange={event => {
                                        changeBraillePageProperty(dispatch, 'cellsPerRow', event.currentTarget.value)
                                    }}
                                    max={width === 210 && 34}
                                    min={1}
                                    value={braillePages.cellsPerRow}
                                    label={"Zeichen pro Zeile"}/>
                            </GridCell>
                            <GridCell className={"page-image-container"}><img src={"/images/page.svg"}/></GridCell>

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
                            checked={defaultTitle}
                            onChange={() => {
                                toggleDefaultTitle(!defaultTitle)
                            }}
                            label={"Seitenzahlen"}/>
                    </div>
                </Row>
            </fieldset>
        </>;

    return (
        <Upper>
            <Tooltip/>

            <Row style={{minWidth: 500}}>
                <div className={"col-sm-12"}>
                    <Textinput
                        onChange={event => {
                            changeFileProperty(dispatch, 'title', event.currentTarget.value)
                        }}
                        value={title}
                        label={"Titel"}/>
                </div>
            </Row>

            <Row>
                <div className={"col-sm-12"}>
                    <Select tip={"help:select_braille-system"} default={"de-de-g0.utb"}
                            value={system}
                            onChange={selection => changeFileProperty(dispatch, 'system', selection.value)}
                            label={"editor:select_braille-system"} options={
                        [
                            {label: "Deutsch Kurzschrift", value: "de-de-g2.ctb"},
                            {label: "Deutsch Langschrift", value: "de-de-g1.ctb"},
                            {label: "Deutsch Vollschrift", value: "de-de-g0.utb"},
                            {label: "Computerbraille 8-Punkt DE Kurzschrift", value: "cb"}
                        ]
                    }/>
                </div>
            </Row>

            <Tabs tabs={[
                {
                    label: "Grafikseiten",
                    content: graphicPageSettings
                },
                {
                    label: "Brailleseiten",
                    content: braillePageSettings
                }
            ]}>

            </Tabs>
        </Upper>
    );
};

export default Document;