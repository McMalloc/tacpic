import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from "react-redux";
import TexturePreview from "../../gui/TexturePreview";
import { Textinput } from "../../gui/Input";
import { map, flatten } from "lodash";
import methods from "../ReactSVG";
import { keyedLabelsSelector, patternsInUseSelector } from "../../../reducers/selectors";
import { Checkbox } from "../../gui/Checkbox";
import { useTranslation } from 'react-i18next';
import { OBJECT_PROP_CHANGED } from '../../../actions/action_constants';

const Table = styled.table`
  width: 100%;
  font-size: 0.9rem;
  
  thead {
    font-weight: 700;
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
    const { t } = useTranslation();
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
                            type: OBJECT_PROP_CHANGED,
                            uuid: keyObject.uuid,
                            prop: 'active',
                            value: !keyObject.active
                        })}
                        label={"editor:keyPanel.showKey"} />
                    <Checkbox name={"anchor-key"}
                        value={keyObject.anchored}
                        disabled={!keyObject.active}
                        style={{ marginLeft: '1rem' }}
                        onChange={() => dispatch({
                            type: OBJECT_PROP_CHANGED,
                            uuid: keyObject.uuid,
                            prop: 'anchored',
                            value: !keyObject.anchored
                        })}
                        label={"editor:keyPanel.fixateKey"} />
                    <Checkbox name={"show-key-border"}
                        value={keyObject.border}
                        disabled={!keyObject.active}
                        style={{ marginLeft: '1rem' }}
                        onChange={() => dispatch({
                            type: OBJECT_PROP_CHANGED,
                            uuid: keyObject.uuid,
                            prop: 'border',
                            value: !keyObject.border
                        })}
                        label={"editor:keyPanel.showBorder"} />
                </>
            }


            {labelKeys.length === 0 && patternsInUse.length === 0 ?
                <p className={"disabled"}>{t('editor:keyPanel.noEntriesHint')}</p>
                :
                <Table>
                    <thead>
                        <tr>
                            <td>{t('editor:keyPanel.singleKey')}</td>
                            <td id={"label-column-head"}>{t('editor:keyPanel.label')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {labelKeys.map((entry, index) => {
                            return (
                                <tr key={index}>
                                    <td style={{ width: 60, paddingRight: 10 }}>
                                        <KeyInput
                                            aria-labelledby={"label-column-head"}
                                            onChange={event => changeLabelEntry(dispatch, entry.uuid, "keyVal", event.currentTarget.value)}
                                            value={entry.keyVal || ''}
                                        />

                                    </td>
                                    <td><KeyInput
                                        aria-labelledby={"label-column-head"}
                                        onChange={event => changeLabelEntry(dispatch, entry.uuid, "text", event.currentTarget.value)}
                                        value={entry.text || ''} /></td>

                                </tr>
                            )
                        })}
                        {patternsInUse.map((pattern, index) => {
                            const textureIndex = keyedTextures.findIndex(entry => entry.pattern === pattern);
                            const key = textureIndex !== -1 ? keyedTextures[textureIndex] : {};
                            return (
                                <tr key={index}>
                                    <td><TexturePreview template={pattern} /></td>
                                    <td>
                                        <Textinput
                                            name={'texture-key-' + index}
                                            aria-labelledby={"label-column-head"}
                                            onChange={event => changePatternEntry(
                                                dispatch,
                                                pattern,
                                                event.currentTarget.value)}
                                            value={key.label || ''} />

                                    </td>

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