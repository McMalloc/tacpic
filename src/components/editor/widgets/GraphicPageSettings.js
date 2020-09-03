import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Radio} from "../../gui/Radio";
import Select from "../../gui/Select";
import {Row} from "../../gui/Grid";
import {Checkbox} from "../../gui/Checkbox";
import {Numberinput, Textinput} from "../../gui/Input";
import styled from 'styled-components/macro';

const changeFileProperty = (dispatch, key, value) => {
    dispatch({
        type: "CHANGE_FILE_PROPERTY",
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

const GraphicPageSettings = props => {
    const dispatch = useDispatch();
    const {
        verticalGridSpacing,
        horizontalGridSpacing,
        showVerticalGrid,
        showHorizontalGrid,
        title,
        width,
        defaultTitle,
        height,
        system
    } = useSelector(state => state.editor.file.present);

    return <>
        <fieldset>
            <Textinput
                onChange={event => {
                    changeFileProperty(dispatch, 'title', event.currentTarget.value)
                }}
                value={title}
                label={"Titel"}/>
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
                        value={showVerticalGrid}
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
                        value={showHorizontalGrid}
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
                        value={defaultTitle}
                        onChange={() => {
                            toggleDefaultTitle(!defaultTitle)
                        }}
                        label={"Titel"}/>
                </div>
            </Row>
        </fieldset>
    </>;
};

export default GraphicPageSettings;