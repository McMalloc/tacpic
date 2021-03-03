import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Radio} from "../../gui/Radio";
import Select from "../../gui/Select";
import {Checkbox} from "../../gui/Checkbox";
import {Numberinput} from "../../gui/Input";
import { CHANGE_FILE_FORMAT } from '../../../actions/action_constants';
import { determineDimensions, determineFormat } from '../../../utility/determineFormat';
import { useTranslation } from 'react-i18next';

const changeFileProperty = (dispatch, key, value) => {
    dispatch({
        type: "CHANGE_FILE_PROPERTY",
        key, value
    })
};

const changeFileFormat = (dispatch, {width, height}) => {
    dispatch({
        type: CHANGE_FILE_FORMAT,
        width, height
    })
};

const GraphicPageSettings = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {
        verticalGridSpacing,
        horizontalGridSpacing,
        showVerticalGrid,
        showHorizontalGrid,
        width,
        height
    } = useSelector(state => state.editor.file.present);

    return <>
        <fieldset>

            <legend>{t('editor:graphicPanel.format')}</legend>
            {/* <Row> */}
                <div>
                    <Select label={"editor:label_page-format"} 
                        value={determineFormat(width, height).format} 
                        onChange={selection => changeFileFormat(dispatch, determineDimensions(selection.value, width > height))} 
                        options={
                            [
                                {label: t('glossary:a4'), value: "a4"},
                                {label: t('glossary:a3'), value: "a3"}
                            ]}
                    />


                </div>
                <div>
                    <Radio name={"orientation"} onChange={event => {
                        if (width > height && event === 'portrait' || width < height && event === 'landscape') changeFileFormat(dispatch, {height: width, width: height});
                    }} value={width > height ? 'landscape' : 'portrait'} options={[
                        {label: "portrait", value: "portrait"},
                        {label: "landscape", value: "landscape"}]}/>
                </div>
        </fieldset>
        <fieldset>
            <legend>{t('editor:graphicPanel.grid')}</legend>

                    <Checkbox
                        name={"cb_vertical-grid"}
                        value={showVerticalGrid}
                        onChange={() => {
                            changeFileProperty(dispatch, 'showVerticalGrid', !showVerticalGrid)
                        }}
                        label={'editor:graphicPanel.showVertical'}/>

                    <img style={{width: 80, height: "auto"}} src={"/images/vertical_grid.svg"}/>

                    <Numberinput
                        disabled={!showVerticalGrid}
                        onChange={event => {
                            changeFileProperty(dispatch, 'verticalGridSpacing', event.currentTarget.value)
                        }}
                        value={verticalGridSpacing}
                        label={'editor:graphicPanel.distance'}
                        sublabel={'editor:graphicPanel.distanceVertical'}
                        unit={"mm"}/>

                    <Checkbox
                        name={"cb_horizontal-grid"}
                        value={showHorizontalGrid}
                        onChange={() => {
                            changeFileProperty(dispatch, 'showHorizontalGrid', !showHorizontalGrid)
                        }}
                        label={'editor:graphicPanel.showHorizontal'}/>

                    <img style={{width: 80, height: "auto"}} src={"/images/horizontal_grid.svg"}/>

                    <Numberinput
                        disabled={!showHorizontalGrid}
                        onChange={event => {
                            changeFileProperty(dispatch, 'horizontalGridSpacing', event.currentTarget.value)
                        }}
                        value={horizontalGridSpacing}
                        label={'editor:graphicPanel.distance'}
                        sublabel={'editor:graphicPanel.distanceHorizontal'}
                        unit={"mm"}/>
        </fieldset>

    </>;
};

export default GraphicPageSettings;