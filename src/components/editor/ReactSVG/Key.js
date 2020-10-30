import React, {useEffect, useState} from 'react'
import transform from "./transform";
import {createPattern} from "./Patterns";
import {useSelector} from "react-redux";
import {filter, flatten, map, uniq} from "lodash";
import Rect from "./Rect";
import styled from "styled-components";
import {keyedLabelsSelector, patternsInUseSelector} from "../../../reducers/selectors";

const Braille = styled.span`
  font-family: ${props => props.system === 'cb' ? "HBS8" : "tacpic swell braille"};
  white-space: pre-wrap;
  font-size: 10mm;
  display: block;
  user-select: none;
  overflow: visible;
  color: black;
  line-height: 12mm;
`;

const Black = styled.span`
  font-size: 14pt;
  user-select: none;
  display: block;
  font-family: Arial, Helvetica, sans-serif;
  color: blue;
`;

export default props => {
    const patternsInUse = useSelector(patternsInUseSelector);
    const keyedTextures = useSelector(state => state.editor.file.present.keyedTextures);
    const keyedLabels = useSelector(keyedLabelsSelector);

    const longestKey = Math.max(...keyedLabels.map(entry => entry.keyVal.length));
    const texturePreviewWidth = Math.max(15, 6 * longestKey); // 6 ist der Zeichenabstand TODO in Konstanten sammeln
    const texturePreviewHeight = 10;
    const padding = 3;
    const boxPadding = 10;
    const lineHeightOffset = 27; // SVG text 0,0 ist at lower right, while geometry's 0,0 is at upper right

    const [height, setHeight] = useState(0);

    useEffect(() => {
        const elem = document.querySelector(`#container-${props.uuid}`);
        elem && setHeight(elem.getBoundingClientRect().height);
    }, [])

    let skippedPatterns = 0;

    // TODO eingetragene labels müssen auch von liblouis übersetzt werden
    return (
        <g>
            {/*<rect*/}
            {/*    x={props.x}*/}
            {/*    y={props.y}*/}
            {/*    width={props.width}*/}
            {/*    data-transformable={!props.inactive}*/}
            {/*    data-selectable={true}*/}
            {/*    data-uuid={props.uuid}*/}
            {/*    height={props.height}*/}
            {/*    fill={"transparent"} strokeWidth={"1mm"}*/}
            {/*    stroke={"black"}/>*/}
            <foreignObject x={props.x} y={props.y} style={{overflow: 'visible'}}
                           width={1} height={1}>
                {/*width={props.width} height={props.height}>*/}
                <table className={'initial'} style={{backgroundColor: 'white', border: '1mm solid black', width: props.width}}
                       data-transformable={true}
                       data-selectable={true}
                       data-uuid={props.uuid}
                       xmlns={"http://www.w3.org/1999/xhtml"}>
                    <tbody>
                    <tr>
                        <td data-selectable={true} data-uuid={props.uuid} style={{padding: "2mm 6mm 0 2mm"}} colSpan={2}>
                            <Braille data-selectable={true} data-uuid={props.uuid}>legende</Braille>
                            <Black data-selectable={true} data-uuid={props.uuid}>Legende</Black>
                        </td>
                    </tr>
                    {keyedTextures.map((entry, index) => {
                        return (
                            <tr key={index}>
                                <td style={{padding: "2mm 6mm 0 2mm", verticalAlign: 'top'}}>
                                    <svg width={texturePreviewWidth + "mm"} height={texturePreviewHeight + "mm"}
                                         xmlns={"http://www.w3.org/2000/svg"}><Rect
                                        inactive={true}
                                        pattern={{template: entry.pattern}}
                                        x={0} y={0}
                                        width={texturePreviewWidth + "mm"} height={texturePreviewHeight + "mm"}/>
                                    </svg>
                                </td>
                                <td style={{paddingBottom: '2mm', verticalAlign: 'top'}}>
                                    <Braille className={"label-braille"}>{entry.braille}</Braille>
                                    <Black className={"label-black"}>{entry.label}</Black>
                                </td>
                            </tr>
                        )
                    })}
                    {keyedLabels.map((entry, index) => {
                        const offsetIndex = index + keyedTextures.length - skippedPatterns;
                        return (
                            <tr key={index}>
                                <td style={{verticalAlign: 'top', padding: "2mm 6mm 0 2mm"}}>
                                    <Braille className={"label-braille"}>{entry.keyVal}</Braille>
                                    <Black className={"label-black"}>{entry.keyVal}</Black>
                                </td>
                                <td style={{padding: "2mm 6mm 0 2mm"}}>
                                    <Braille className={"label-braille"}>{entry.braille}</Braille>
                                    <Black className={"label-black"}>{entry.text}</Black>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </foreignObject>
        </g>
    )
}