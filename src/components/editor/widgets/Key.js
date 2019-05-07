import React, {Component} from 'react';
import styled from 'styled-components';
import {Padding, p, px} from 'styled-components-spacing';
import {connect} from "react-redux";
import {OBJECT} from "../constants";
import {Button, FlyoutButton} from "../../gui/Button";
import TexturePreview from "../../gui/TexturePreview";
import {Textinput} from "../../gui/Input";
import {Row} from "../../gui/Grid";
import {filter, map, flatten, isUndefined, uniq} from "lodash";
import TexturePalette from "../../gui/TexturePalette";
import Label from "../../gui/_Label";
import {Lower, Upper} from "../../gui/WidgetContainer";

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

class Key extends Component {
    render() {
        return (
            <>
                <Upper>
                    {this.props.labelKeys.length === 0 && this.props.textureKeys.length === 0 ?
                        <p className={"disabled"}>Keine Einträge vorhanden. Erzeugen Sie eine abgekürzte Beschriftung oder ein texturisiertes Objekt, um hier ihre Bedeutungen zu vermerken.</p>
                        :
                        <Table>
                            <thead>
                            <tr>
                                <td id={"label-column-head"}>Beschriftung</td>
                                <td>Schlüssel</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.labelKeys.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td><KeyInput
                                            aria-labelledby={"label-column-head"}
                                            onChange={event => this.props.changeLabelEntry(entry.uuid, "text", event.currentTarget.value)}
                                            value={entry.text || ''}/></td>
                                        <td style={{width: "50px"}}>
                                            <KeyInput
                                                aria-labelledby={"label-column-head"}
                                                onChange={event => this.props.changeLabelEntry(entry.uuid, "keyVal", event.currentTarget.value)}
                                                value={entry.keyVal || ''}
                                            />

                                        </td>
                                    </tr>
                                )
                            })}
                            {this.props.textureKeys.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Textinput
                                                aria-labelledby={"label-column-head"}
                                                onChange={event => this.props.addEntry(entry, event.currentTarget.value)}
                                                // für Test
                                                value={this.props.keyedTextures[entry] || ''}/>

                                        </td>
                                        <td><TexturePreview template={entry}/></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    }
                </Upper>

                <Lower>
                    <Button icon={"redo-alt"}>Aktualisieren</Button> &ensp;
                    <Button icon={"arrow-alt-circle-right"} primary>Erstellen</Button>

                </Lower>

            </>
        );
    }
}

const mapStateToProps = state => {
    const allObjects = flatten(map(state.editor.openedFile.pages, page => page.objects));

    return {
        labelKeys: filter(allObjects, "isKey"),
        textureKeys: uniq(map(filter(allObjects, obj => !isUndefined(obj.pattern)), objWithPattern => objWithPattern.pattern.template)), // TODO könnte effizienter sein
        keyedTextures: state.editor.openedFile.keyedTextures
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addEntry: (texture, label) => {
            dispatch({
                type: "KEY_TEXTURE_ADDED",
                texture,
                label
            })
        },
        changeLabelEntry: (uuid, prop, value) => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                uuid,
                prop,
                value
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Key);