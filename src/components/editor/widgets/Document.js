import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Select from "../../gui/Select";
import {Textinput} from "../../gui/Input";

const changeFileProperty = (dispatch, key, value) => {
    dispatch({
        type: "CHANGE_FILE_PROPERTY",
        key, value
    })
};

const Document = props => {
    const dispatch = useDispatch();
    const {
        title,
        system
    } = useSelector(state => state.editor.file);

    return (
        <>
                    <Textinput
                        onChange={event => {
                            changeFileProperty(dispatch, 'title', event.currentTarget.value)
                        }}
                        value={title}
                        label={"Titel"}/>

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
        </>
    );
};

export default Document;