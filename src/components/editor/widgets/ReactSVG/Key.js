import React, {useEffect, useState} from 'react'
import transform from "./transform";
import {createPattern} from "./Patterns";
import {useSelector} from "react-redux";
import {filter, flatten, map, uniq} from "lodash";
import Rect from "./Rect";
import styled from "styled-components";
import {patternsInUseSelector} from "../../../../reducers/selectors";

const Braille = styled.text`
  line-height: 12mm;
  font-family: ${props => props.system === 'cb' ? "HBS8" : "HBS6"};
  white-space: pre-wrap;
  color: ${props => props.preview ? 'black' : 'lightgrey'};
  font-size: 10mm;
  overflow: visible;
  fill: black;
`;

const Black = styled.text`
  line-height: 12mm;
  font-size: 14pt;
  margin-top: -4mm;
  font-family: Arial, Helvetica, sans-serif;
  fill: blue;
`;

export default props => {
    const patternsInUse = useSelector(patternsInUseSelector);
    const keyedTextures = useSelector(state => state.editor.file.keyedTextures);
    const keyedLabels = useSelector(state => {
        const allObjects = flatten(state.editor.file.pages.map(page => page.objects));
        return allObjects.filter(object => object && object.isKey).map(({braille, keyVal, text}) => ({keyVal, braille, text}));
    });

    const longestKey = Math.max(...keyedLabels.map(entry=>entry.keyVal.length));
    const texturePreviewWidth = Math.max(15, 6*longestKey); // 6 ist der Zeichenabstand TODO in Konstanten sammeln
    const texturePreviewHeight = 10;
    const padding = 3;
    const boxPadding = 10;
    const lineHeightOffset = 27; // SVG text 0,0 ist at lower right, while geometry's 0,0 is at upper right

    const [bbox, setBbox] = useState(null);
    useEffect(() => {
        setBbox(document.querySelector(`#container-${props.uuid}`).getBBox());
    }, [keyedLabels.length]);

    let skippedPatterns = 0;

    return (
        <g>
            <g id={`container-${props.uuid}`} transform={`translate(${props.x}, ${props.y + lineHeightOffset})`}>
                <Braille>
                    Legende
                </Braille>
                <Black y={8}>Legende</Black>
                {keyedTextures.map((entry, index) => {
                    if (patternsInUse.indexOf(entry.pattern) === -1) {
                        skippedPatterns++;
                        return null
                    }
                    const idx = index - skippedPatterns;
                    return (
                        <>
                            <Rect
                                inactive={true}
                                pattern={{template: entry.pattern}}
                                x={0} y={((texturePreviewHeight + padding) * idx + 5) + "mm"}
                                width={texturePreviewWidth + "mm"} height={texturePreviewHeight + "mm"}/>
                            <Braille
                                x={(texturePreviewWidth + padding) + "mm"}
                                y={((texturePreviewHeight + padding) * idx) + 12 + "mm"}>
                                {entry.label}
                            </Braille>
                            <Black
                                x={(texturePreviewWidth + padding) + "mm"}
                                y={((texturePreviewHeight + padding) * idx) + 15 + "mm"}>
                                {entry.label}
                            </Black>
                        </>
                    )
                })}
                {keyedLabels.map((entry, index) => {
                    const offsetIndex = index + keyedTextures.length - skippedPatterns;
                    return (
                        <>
                            <Braille
                                x={0}
                                y={((texturePreviewHeight + padding) * offsetIndex) + texturePreviewHeight + "mm"}>
                                {entry.keyVal}
                            </Braille>
                            <Black
                                x={0}
                                y={((texturePreviewHeight + padding) * offsetIndex) + texturePreviewHeight + 2 + "mm"}>
                                {entry.keyVal}
                            </Black>
                            <Braille
                                x={(texturePreviewWidth + padding) + "mm"}
                                y={((texturePreviewHeight + padding) * offsetIndex) + texturePreviewHeight + "mm"}>
                                {entry.braille}
                            </Braille>
                            <Black
                                x={(texturePreviewWidth + padding) + "mm"}
                                y={((texturePreviewHeight + padding) * offsetIndex) + texturePreviewHeight + 2 + "mm"}>
                                {entry.text}
                            </Black>
                        </>
                    )
                })}
            </g>
            {bbox &&
            <rect
                x={props.x - boxPadding}
                y={props.y - boxPadding}
                width={bbox.width + boxPadding*2}
                data-transformable={!props.inactive}
                data-selectable={true}
                data-uuid={props.uuid}
                height={bbox.height + boxPadding*2}
                fill={"transparent"} strokeWidth={"1mm"}
                stroke={"black"}/>
            }
        </g>

    )
}