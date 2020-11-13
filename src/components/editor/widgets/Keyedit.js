import React, {Component} from 'react';
import styled from 'styled-components/macro';
import {Padding, p, px} from 'styled-components-spacing';
import {connect, useDispatch, useSelector} from "react-redux";
import TexturePreview from "../../gui/TexturePreview";
import {Textinput} from "../../gui/Input";
import {Row} from "../../gui/Grid";
import {filter, map, flatten, isUndefined, uniq} from "lodash";
import methods from "../ReactSVG";
import {keyedLabelsSelector, patternsInUse, patternsInUseSelector} from "../../../reducers/selectors";
import {Checkbox} from "../../gui/Checkbox";

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
    const labelKeys = useSelector(keyedLabelsSelector);
    const patternsInUse = useSelector(patternsInUseSelector);
    const keyedTextures = useSelector(state => state.editor.file.present.keyedTextures);
    const keyObject = useSelector(state => flatten(map(state.editor.file.present.pages, page => page.objects)).find(object => object.type === 'key'));

    return (
        <div className={props.className}>
            {!!keyObject &&
            <>
                <Checkbox name={"show-key"}
                          value={keyObject.active}
                          onChange={() => dispatch({
                              type: 'OBJECT_PROP_CHANGED',
                              uuid: keyObject.uuid,
                              prop: 'active',
                              value: !keyObject.active
                          })}
                          label={"Zeige Legende"}/>
                <Checkbox name={"anchor-key"}
                          value={keyObject.anchored}
                          onChange={() => dispatch({
                              type: 'OBJECT_PROP_CHANGED',
                              uuid: keyObject.uuid,
                              prop: 'anchored',
                              value: !keyObject.anchored
                          })}
                          label={"Legende fixieren"}/>
            </>
            }


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
                                <td style={{width: 60, paddingLeft: 10}}>
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