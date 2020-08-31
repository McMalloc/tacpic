import React, {Component} from 'react';
import styled from 'styled-components/macro';
import {Padding, p, px} from 'styled-components-spacing';
import {connect, useDispatch, useSelector} from "react-redux";
import {OBJECT} from "../constants";
import {Button, FlyoutButton} from "../../gui/Button";
import TexturePreview from "../../gui/TexturePreview";
import {Textinput} from "../../gui/Input";
import {Row} from "../../gui/Grid";
import {filter, map, flatten, isUndefined, uniq} from "lodash";
import TexturePalette from "../../gui/TexturePalette";
import Label from "../../gui/_Label";
import {Lower, Upper} from "../../gui/WidgetContainer";
import methods from "./ReactSVG/methods";
import {patternsInUse, patternsInUseSelector} from "../../../reducers/selectors";

const Table = styled.table`
  width: 100%;
  font-size: 0.9em;
  
  thead {
    font-weight: 700;
  }
  
  tr {
      td:nth-child(2) {
        text-align: right;
      }
      
      &:hover {
        background-color: ${props => props.theme.accent_1_light}
      }
  }

  td {
    padding: ${props => props.theme.spacing[1]} 0;
  }
`;

const KeyInput = styled(Textinput)`
  margin: 0;
`;

const changePatternEntry = (dispatch, pattern, label) => {
    dispatch({
        type: "KEY_TEXTURE_CHANGED",
        pattern,
        label
    })
};

const changeLabelEntry = (dispatch, uuid, prop, value) => {
    dispatch({
        type: 'OBJECT_PROP_CHANGED',
        uuid,
        prop,
        value
    });
};

const addKey = (dispatch) => {
    dispatch({
        type: 'OBJECT_UPDATED',
        preview: methods.key.create({
            x: 10,
            y: 10
        })
    });
};

const Keyedit = props => {
    const dispatch = useDispatch();
    const labelKeys = useSelector(state => {
        const allObjects = flatten(map(state.editor.file.pages, page => page.objects));
        return filter(allObjects, "isKey");
    });
    const patternsInUse = useSelector(patternsInUseSelector);
    const keyedTextures = useSelector(state => state.editor.file.keyedTextures);

    return (
        <div className={props.className}>
                {labelKeys.length === 0 && patternsInUse.length === 0 ?
                    <p className={"disabled"}>Keine Einträge vorhanden. Erzeugen Sie eine abgekürzte Beschriftung oder
                        ein texturisiertes Objekt, um hier ihre Bedeutungen zu vermerken.</p>
                    :
                    <Table>
                        <thead>
                        <tr>
                            <td id={"label-column-head"}>Beschriftung</td>
                            <td>Schlüssel</td>
                        </tr>
                        </thead>
                        <tbody>
                        {labelKeys.map((entry, index) => {
                            return (
                                <tr key={index}>
                                    <td><KeyInput
                                        aria-labelledby={"label-column-head"}
                                        onChange={event => changeLabelEntry(dispatch, entry.uuid, "text", event.currentTarget.value)}
                                        value={entry.text || ''}/></td>
                                    <td style={{width: "50px"}}>
                                        <KeyInput
                                            aria-labelledby={"label-column-head"}
                                            onChange={event => changeLabelEntry(dispatch, entry.uuid, "keyVal", event.currentTarget.value)}
                                            value={entry.keyVal || ''}
                                        />

                                    </td>
                                </tr>
                            )
                        })}
                        {patternsInUse.map((pattern, index) => {
                            const textureIndex = keyedTextures.findIndex(entry => entry.pattern === pattern);
                            const key = textureIndex !== -1 ? keyedTextures[textureIndex] : {};
                            return (
                                <tr key={index}>
                                    <td>
                                        <Textinput
                                            aria-labelledby={"label-column-head"}
                                            onChange={event => changePatternEntry(
                                                dispatch,
                                                pattern,
                                                event.currentTarget.value)}
                                            value={key.label || ''}/>

                                    </td>
                                    <td><TexturePreview template={pattern}/></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                }
        </div>
    );
};

export default Keyedit;