import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Textinput } from "../../../gui/Input";
import { Checkbox } from "../../../gui/Checkbox";
import Select from "../../../gui/Select";
import Palette from "../../../gui/Palette";
import TexturePalette from "../../../gui/TexturePalette";
import { findObject } from "../../../../utility/findObject";
import { useTranslation } from "react-i18next";
import { Alert } from "../../../gui/Alert";
import Tooltip from "../../../gui/Tooltip";
import { borderStyles } from "../../ReactSVG/constants";
import { COLOURS } from "../../../../config/constants";
import { TEXTURES } from "../../../../config/constants";

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
        state.editor.file.present.pages[state.editor.ui.currentPage].objects,
        state.editor.ui.selectedObjects[0])
    );
    const t = useTranslation().t;
    const dispatch = useDispatch();
    const nothingSelected = selectedObject === void 0;

    return (
        <>
            <Textinput value={selectedObject.moniker}
                disabled={nothingSelected}
                onChange={event => changeProp(dispatch, selectedObject.uuid, 'moniker', event.currentTarget.value)} 
                label={"editor:objectPanel.moniker"} />
            <div>
                <fieldset>
                    <legend>{t('editor:objectPanel.texture')}</legend>

                    {/* <Tooltip content={'hii'}> */}
                    <TexturePalette
                        disabled={nothingSelected}
                        textures={TEXTURES}
                        selected={selectedObject.pattern.template}
                        onChange={pattern => changePattern(dispatch, selectedObject.uuid, pattern, selectedObject.pattern.offset)} />
                        {/* </Tooltip> */}

                    <Checkbox name={"padding"}
                        value={selectedObject.pattern.offset}
                        disabled={!selectedObject.border || selectedObject.pattern.template === null}
                        onChange={() => {
                            changeProp(
                                dispatch,
                                selectedObject.uuid,
                                'pattern',
                                { ...selectedObject.pattern, offset: !selectedObject.pattern.offset })
                        }}
                        label={t("editor:objectPanel.texture_offset")} />
                    {!selectedObject.border && false &&
                        <Alert info>{t("editor:objectPanel.borderOffsetHint")}</Alert>
                    }
                    {/*<Numberinput unit={"mm"}/>*/}
                </fieldset>
                <fieldset>
                    <legend>{t('editor:objectPanel.colourHeading')}</legend>

                    <Palette selected={selectedObject.fill}
                        onChange={fill => changeProp(dispatch, selectedObject.uuid, 'fill', fill)}
                        colours={Object.values(COLOURS)} extendedColours={null} />
                </fieldset>
                <fieldset>
                    <legend>{t('editor:objectPanel.borderHeading')}</legend>
                    <Checkbox name={"border"}
                        value={selectedObject.border}
                        onChange={() => {
                            changeProp(
                                dispatch,
                                selectedObject.uuid,
                                'border',
                                !selectedObject.border)
                        }}
                        label={'editor:objectPanel.showBorder'} />
                    <Select onChange={option => {
                        changeProp(
                            dispatch,
                            selectedObject.uuid,
                            'borderWidth',
                            option.value)
                    }} value={selectedObject.borderWidth} 
                       menuPlacement={'top'} 
                       disabled={!selectedObject.border} 
                       label={"editor:objectPanel.borderWidth"} options={[
                        {
                            value: 0.5,
                            label: t("editor:objectPanel.05")
                        },
                        {
                            value: 1.5,
                            label: t("editor:objectPanel.15")
                        },
                        {
                            value: 2.5,
                            label: t("editor:objectPanel.25")
                        }]} />
                    <Checkbox name={"borderStyle"}
                        value={selectedObject.borderStyle === borderStyles.default}
                        disabled={!selectedObject.border}
                        onChange={() => {
                            changeProp(
                                dispatch,
                                selectedObject.uuid,
                                'borderStyle',
                                selectedObject.borderStyle === borderStyles.default ? 'solid' : borderStyles.default)
                        }}
                        label={t("editor:objectPanel.dotted")} />

                    {selectedObject.type === 'path' &&
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
                                label={"editor:objectPanel.arrowheadStart"} />
                            <Checkbox name={"arrow-end"}
                                value={selectedObject.endArrow}
                                onChange={() => {
                                    changeProp(
                                        dispatch,
                                        selectedObject.uuid,
                                        'endArrow',
                                        !selectedObject.endArrow)
                                }}
                                label={"editor:objectPanel.arrowheadEnd"} />
                            <Checkbox name={"closed-path"}
                                value={selectedObject.closed}
                                onChange={() => {
                                    changeProp(
                                        dispatch,
                                        selectedObject.uuid,
                                        'closed',
                                        !selectedObject.closed)
                                }}
                                label={"editor:objectPanel.closeShape"} />
                        </>
                    }
                </fieldset>

            </div>
        </>
    );

};

export default ShapeContext;