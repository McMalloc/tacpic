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

const changePattern = (dispatch, uuid, pattern) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        uuid,
        prop: 'pattern',
        value: {
            template: pattern,
            angle: 0,
            scaleX: 1,
            scaleY: 1
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
                <div className={"col-md-6"}>
                    <Textinput value={selectedObject.moniker}
                               disabled={nothingSelected}
                               onChange={moniker => changeProp(dispatch, selectedObject.uuid, 'moniker', moniker)} label={"Bezeichner"}/>
                </div>
                <div className={"col-md-6"}>
                    <Checkbox disabled={nothingSelected} name={"visible"} label={"Aktiv"}/>
                    <Checkbox disabled={nothingSelected} name={"locked"} label={"Sperren"}/>
                </div>
            </Row>

            <div>
                <Tooltip/>

                <fieldset>
                    <legend>Relief</legend>

                    <TexturePalette
                        disabled={nothingSelected}
                        textures={[null, "striped", "bigdots", "dashed"]}
                        selected={selectedObject.pattern.template}
                        onChange={pattern => changePattern(dispatch, selectedObject.uuid, pattern)}/>

                    <Checkbox name={"padding"}
                              checked={selectedObject.pattern.offset}
                              disabled={!selectedObject.border || selectedObject.pattern.template == null}
                              onChange={() => {
                                  changeProp(
                                      dispatch,
                                      selectedObject.uuid,
                                      'pattern',
                                      {...selectedObject.pattern, offset: !selectedObject.pattern.offset})
                              }}
                              label={"Abstand zwischen Textur und Rand"}/>
                    {!selectedObject.border &&
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
                                 [null, '#000000', '#1f78b4', '#b2df8a', '#e31a1c', '#ff7f00', '#cab2d6', '#b15928']
                             } extendedColours={
                        ['#a6cee3', '#33a02c', '#fb9a99', '#fdbf6f', '#6a3d9a', '#ffff99']
                    }/>
                </fieldset>
                <fieldset>
                    <legend>Kontur</legend>
                    <Checkbox name={"border"}
                              checked={selectedObject.border}
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
                            value: 1,
                            label: t("1 mm (Hilfslinie)")
                        },
                        {
                            value: 2,
                            label: t("2 mm")
                        }]} />
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