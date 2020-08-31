import React, {Component, Fragment} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import {Row} from "../../../gui/Grid";
import Select from "../../../gui/Select";
import {Checkbox} from "../../../gui/Checkbox";
import {Multiline, Numberinput, Textinput} from "../../../gui/Input";
import {find} from "lodash";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

const BraillePreview = styled.p`
  font-family: "tacpic swell braille";
  margin-top: 6px;
  font-size: 28pt;
  white-space: pre-wrap;
  line-height: 18pt;
`;

const CodePreview = styled.p`
  font-family: Monospace;
  margin-top: 0;
  font-size: 14pt;
  white-space: pre-wrap;
  line-height: 18pt;
`;

const changeProp = (dispatch, uuid, prop, value) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        uuid,
        prop,
        value
    });
};

// const toggleKey = event => {
//     this.props.changeProp(selectedObject.uuid, "isKey", !selectedObject.isKey)
// };

const LabelContext = props => {
    const selectedObject = useSelector(
        state => find(state.editor.file.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]}) || {}
    );
    const dispatch = useDispatch();
    const t = useTranslation().t;

    const onChangeHandler = event => {
        changeProp(dispatch, selectedObject.uuid, "text", event.currentTarget.value);
    };

    return (
        <>
            {/*<Row>*/}
            {/*    <div className={"col-md-6"}>*/}
            {/*        <Select label={"editor:presets"} options={*/}
            {/*            [*/}
            {/*                {label: "Aubergine", value: "A", children: []}*/}
            {/*            ]*/}
            {/*        }/>*/}
            {/*    </div>*/}
            {/*    <div className={"col-md-6"}>*/}
            {/*        <Button>Neue Vorgabe</Button>*/}
            {/*    </div>*/}
            {/*</Row>*/}

            {/*<hr />*/}

            {/*<Row>*/}
                <div>
                    {/*<legend>Beschriftung</legend>*/}
                    <Multiline onChange={onChangeHandler} value={selectedObject.text}
                               label={"Text"}/>
                </div>
                <div>
                    <div>Vorschau</div>
                    <BraillePreview>{selectedObject.braille}</BraillePreview>
                </div>
                <div>
                    <div>Braillecode in Schwarzschrift</div>
                    <CodePreview>{selectedObject.braille}</CodePreview>
                </div>
            {/*</Row>*/}


            {/*<Row>*/}
            {/*    <div className={"col-xs-6"}>*/}
                    <Checkbox name={"is-key"}
                              value={selectedObject.isKey}
                              onChange={() => changeProp(
                                  dispatch,
                                  selectedObject.uuid,
                                  "isKey",
                                  !selectedObject.isKey)
                              }
                              label={"Schlüssel"}/>

                    <Textinput disabled={!selectedObject.isKey}
                               onChange={event => changeProp(
                                   dispatch,
                                   selectedObject.uuid,
                                   "keyVal",
                                   event.currentTarget.value)}
                               value={selectedObject.keyVal}
                               aria-labelledby={"is-key"}/>
                {/*</div>*/}
                {/*<div className={"col-xs-6"}>*/}
                    <p>{t("editor:cb_braille-key-explanation")}</p>
                    {/*<Checkbox name={"leading"}*/}
                    {/*          label={"Führungslinie"}/>*/}
            {/*    </div>*/}
            {/*</Row>*/}

            {/*<Row>*/}
                <fieldset>
                    <legend>Punktschrift</legend>
                    {/*<Checkbox default={this.props.texture !== null} name={"relief"} label={"Füllung fühlbar reliefieren"}/>*/}
                    <Checkbox name={"display-dots"}
                              value={selectedObject.displayDots}
                              onChange={() => changeProp(dispatch, selectedObject.uuid, "displayDots", !selectedObject.displayDots)}
                              label={"Beschriftung in Punktschrift"}/>

                    <Checkbox name={"full-character"}
                              value={selectedObject.fullCharPrefix}
                              onChange={() => changeProp(dispatch, selectedObject.uuid, "fullCharPrefix", !selectedObject.fullCharPrefix)}
                              label={"editor:cb_braille-full-character"}/>

                    {/*<Checkbox name={"dot-grid"}*/}
                    {/*          label={"editor:cb_braille-dot-grid"}/>*/}

                    <Checkbox name={"show-border"}
                              value={selectedObject.border}
                              onChange={() => changeProp(dispatch, selectedObject.uuid, "border", !selectedObject.border)}
                              label={"editor:cb_braille-show-border"}/>
                </fieldset>

                <fieldset>
                    <legend>Schwarzschrift</legend>
                    {/*<Checkbox default={this.props.texture !== null} name={"relief"} label={"Füllung fühlbar reliefieren"}/>*/}
                    <Checkbox name={"black-letter"}
                              checked={selectedObject.displayLetters}
                              onChange={() => changeProp(dispatch, selectedObject.uuid, "displayLetters", !selectedObject.displayLetters)}
                              label={"Beschriftung in Schwarzschrift"}/>

                    {/*<Select label={"editor:Schriftgröße"} options={*/}
                    {/*    [*/}
                    {/*        {label: "14 pt", value: 14},*/}
                    {/*        {label: "18 pt", value: 18},*/}
                    {/*        {label: "22 pt", value: 22},*/}
                    {/*        {label: "30 pt", value: 30}*/}
                    {/*    ]*/}
                    {/*}/>*/}

                    {/*<PositionSelect*/}
                    {/*selected={selectedObject.position}*/}
                    {/*onChange={this.onChangeHandler}/>*/}
                </fieldset>
            {/*</Row>*/}



        </>
    );
};

export default LabelContext;