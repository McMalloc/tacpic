import React, {Component} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import {createFillModeAction, createTextureModeAction} from "../../../../actions";
import TabPane from "../../../gui/Tabs";
import {Numberinput, Textinput} from "../../../gui/Input";
import {Checkbox} from "../../../gui/Checkbox";
import Select from "../../../gui/Select";
import {Button} from "../../../gui/Button";
import {Row} from "../../../gui/Grid";
import Palette from "../../../gui/Palette";
import {find, isUndefined, debounce} from 'lodash';
import TexturePalette from "../../../gui/TexturePalette";
import Tooltip from "../../../gui/Tooltip";
import {findObject} from "../../../../utility/findObject";
import {useTranslation} from "react-i18next";
import {Alert} from "../../../gui/Alert";
import {borderStyles} from "../ReactSVG/constants";

const changePattern = (dispatch, uuid, pattern, offset) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        uuid,
        prop: 'pattern',
        value: {
            template: pattern,
            offset
        }
    });
};

const changeProp = (dispatch, uuid, prop, value) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        uuid,
        prop,
        value
    });
};

const changeFill = fill => {
    this.props.changeProp(this.props.uuid, "fill", fill);
};

const ShapeContext = props => {
    const selectedObject = useSelector(state => findObject(
        state.editor.file.pages[state.editor.ui.currentPage].objects,
        state.editor.ui.selectedObjects[0])
    );
    const t = useTranslation().t;
    const dispatch = useDispatch();
    const nothingSelected = selectedObject === void 0;

    return (
        <>
            <Row>
                <div className={"col-md-12"}>
                    <Textinput value={selectedObject.moniker}
                               disabled={nothingSelected}
                               onChange={moniker => changeProp(dispatch, selectedObject.uuid, 'moniker', moniker)} label={"Bezeichner"}/>
                </div>
            </Row>

            <div>
                {/*<Tooltip/>*/}

                <fieldset>
                    <legend>Relief</legend>

                    <TexturePalette
                        disabled={nothingSelected}
                        textures={[null, "diagonal_lines", "diagonal_lines_wide", "full", "vertical_lines", "horizontal_lines", "dashed_lines", "grid", "stair", "dotted"]}
                        selected={selectedObject.pattern.template}
                        onChange={pattern => changePattern(dispatch, selectedObject.uuid, pattern, selectedObject.pattern.offset)}/>

                    <Checkbox name={"padding"}
                              value={selectedObject.pattern.offset}
                              disabled={!selectedObject.border || selectedObject.pattern.template == null}
                              onChange={() => {
                                  changeProp(
                                      dispatch,
                                      selectedObject.uuid,
                                      'pattern',
                                      {...selectedObject.pattern, offset: !selectedObject.pattern.offset})
                              }}
                              label={"Abstand zwischen Textur und Rand"}/>
                    {!selectedObject.border && false &&
                        <Alert info>Geben Sie der Form eine Kontur, um einen Abstand zwischen Relief und Kontur einzustellen.</Alert>
                    }
                    {/*<Numberinput unit={"mm"}/>*/}
                </fieldset>
                <br/>
                <fieldset>
                    <legend>Farbe</legend>

                    <Palette selected={selectedObject.fill}
                             onChange={fill => changeProp(dispatch, selectedObject.uuid, 'fill', fill)}
                             colours={
                                 [null, '#000000', '#412B82', '#E4120D', '#C2368C', '#018ECC', '#F08000', '#79BA4A', '#FFEC01', '#FFFFFF']
                             } extendedColours={[]}/>
                </fieldset>
                <fieldset>
                    <legend>Kontur</legend>
                    <Checkbox name={"border"}
                              value={selectedObject.border}
                              onChange={() => {
                                  changeProp(
                                      dispatch,
                                      selectedObject.uuid,
                                      'border',
                                      !selectedObject.border)
                              }}
                              label={"Fühl- und sichtbare Kontur"}/>
                    <Select onChange={option => {
                        changeProp(
                            dispatch,
                            selectedObject.uuid,
                            'borderWidth',
                            option.value)
                    }} value={selectedObject.borderWidth} disabled={!selectedObject.border} label={t("Linienstärke")} options={[
                        {
                            value: 0.5,
                            label: t("0,5 mm (Hilfslinie)")
                        },
                        {
                            value: 1.5,
                            label: t("1,5 mm")
                        },
                        {
                            value: 2.5,
                            label: t("2,5 mm (dicke Linie)")
                        }]} />
                    <Checkbox name={"borderStyle"}
                              value={selectedObject.borderStyle === borderStyles.default}
                              onChange={() => {
                                  changeProp(
                                      dispatch,
                                      selectedObject.uuid,
                                      'borderStyle',
                                      selectedObject.borderStyle === borderStyles.default ? 'solid' : borderStyles.default)
                              }}
                              label={t("Gestrichelt")}/>

                    {selectedObject.type === 'path'&&
                        <>
                            <Checkbox name={"arrow-start"}
                                      value={selectedObject.startArrow}
                                      onChange={() => {
                                          changeProp(
                                              dispatch,
                                              selectedObject.uuid,
                                              'startArrow',
                                              !selectedObject.startArrow)
                                      }}
                                      label={"Pfeilspitze am Anfang"}/>
                            <Checkbox name={"arrow-end"}
                                      checked={selectedObject.endArrow}
                                      onChange={() => {
                                          changeProp(
                                              dispatch,
                                              selectedObject.uuid,
                                              'endArrow',
                                              !selectedObject.endArrow)
                                      }}
                                      label={"Pfeilspitze am Ende"}/>
                            <Checkbox name={"closed-path"}
                                      checked={selectedObject.closed}
                                      onChange={() => {
                                          changeProp(
                                              dispatch,
                                              selectedObject.uuid,
                                              'closed',
                                              !selectedObject.closed)
                                      }}
                                      label={"Form schließen"}/>
                        </>
                    }
                </fieldset>

            </div>

            {/*<TabPane tabs={[*/}
            {/*    {*/}
            {/*        label: 'editor:tablist_shape-fill',*/}
            {/*        icon: 'paint-roller',*/}
            {/*        content: fill*/}
            {/*    },*/}
            {/*    {*/}
            {/*        label: 'editor:tablist_shape-contour',*/}
            {/*        icon: 'circle-notch',*/}
            {/*        content: border*/}
            {/*    }*/}
            {/*]}/>*/}
        </>
    );

};

export default ShapeContext;