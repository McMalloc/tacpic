import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import Rect from "./Rect";
import styled from "styled-components/macro";
import {keyedLabelsSelector, patternsInUseSelector} from "../../../reducers/selectors";
import {mmToPx, pixelToPx} from "../../../utility/mmToPx";
import {SAFE_BORDER} from "../../../config/constants";

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

const Labelrow = styled.tr`
  cursor: pointer;
  &:hover td {
    background-color: lightgrey;
  }
`;

export default props => {
    const keyedTextures = useSelector(state => state.editor.file.present.keyedTextures);
    const {scalingFactor, currentPage} = useSelector(state => state.editor.ui);
    const keyedLabels = useSelector(keyedLabelsSelector);
    const dispatch = useDispatch();
    // const {}

    const texturePreviewWidth = 15;
    const texturePreviewHeight = 10;

    const [internalCoords, setInternalCoords] = useState({x: 0, y: 0});
    const keyElem = useRef();

    useEffect(() => {
        if (!props.anchored) return;
        // throw "error";
        const keyBBox = keyElem.current.getBoundingClientRect();
        const pageBBox = document.getElementById("page-" + currentPage).getBoundingClientRect();

        setInternalCoords({
            x: (pageBBox.width - pixelToPx(keyBBox.width) - pixelToPx(mmToPx(SAFE_BORDER))) / scalingFactor,
            y: (pageBBox.height - pixelToPx(keyBBox.height) - pixelToPx(mmToPx(SAFE_BORDER))) / scalingFactor
        })
    }, [props.anchored, props.width, keyedLabels, keyedTextures]);

    // TODO eingetragene labels müssen auch von liblouis übersetzt werden
    return (
        <g>
            <foreignObject x={props.anchored ? internalCoords.x : props.x} y={props.anchored ? internalCoords.y : props.y} style={{overflow: 'visible'}}
                           width={1} height={1} id={props.uuid}>
                {/*width={props.width} height={props.height}>*/}
                <table className={'initial'} style={{backgroundColor: 'white', border: '1mm solid black', width: props.width}}
                       ref={keyElem}
                       id={"container-" + props.uuid}
                       data-internal-x={internalCoords.x}
                       data-internal-y={internalCoords.y}
                       data-uuid={props.uuid}
                       xmlns={"http://www.w3.org/1999/xhtml"}>
                    <tbody data-selectable={true} data-uuid={props.uuid}>
                    <tr>
                        <td style={{padding: "2mm 6mm 0 2mm"}} colSpan={2}>
                            <Black className={"key-label-black"} data-selectable={true} data-transformable={true} data-uuid={props.uuid}>Legende</Black>
                            <Braille className={"key-label-braille"} data-selectable={true} data-transformable={true} data-uuid={props.uuid}>legende</Braille>
                        </td>
                    </tr>
                    {keyedTextures.map((entry, index) => {
                        return (
                            <tr key={index}>
                                <td style={{padding: "2mm 6mm 0 2mm", verticalAlign: 'top',
                                    minWidth: texturePreviewWidth + 'mm',
                                    maxWidth: texturePreviewWidth + 'mm',
                                    width: texturePreviewWidth + 'mm'
                                }}>
                                    <svg width={texturePreviewWidth + "mm"} height={texturePreviewHeight + "mm"}
                                         xmlns={"http://www.w3.org/2000/svg"}><Rect
                                            inactive={true}
                                            data-selectable={true} data-uuid={props.uuid}
                                        pattern={{template: entry.pattern}}
                                        x={0} y={0}
                                        width={texturePreviewWidth + "mm"} height={texturePreviewHeight + "mm"}/>
                                    </svg>
                                </td>
                                <td style={{padding: '0 2mm 2mm 0', verticalAlign: 'top'}}>
                                    <Black className={"key-label-black"} data-selectable={true} data-uuid={props.uuid}>{entry.label}</Black>
                                    <Braille className={"key-label-braille"} data-selectable={true} data-uuid={props.uuid}>{entry.braille}</Braille>
                                </td>
                            </tr>
                        )
                    })}
                    {keyedLabels.map((entry, index) => {
                        return (
                            <Labelrow key={index} onClick={() => dispatch({type: 'OBJECT_SELECTED', uuids: [entry.uuid]})}>
                                <td style={{verticalAlign: 'top', padding: "0 6mm 0 2mm"}}>
                                    <Black className={"key-label-black"}>{entry.keyVal}</Black>
                                    <Braille className={"key-label-braille"}>{entry.keyVal}</Braille>
                                </td>
                                <td style={{padding: '0 2mm 2mm 0'}}>
                                    <Black className={"key-label-black"}>{entry.text}</Black>
                                    <Braille className={"key-label-braille"}>{entry.braille}</Braille>
                                </td>
                            </Labelrow>
                        )
                    })}
                    </tbody>
                </table>
            </foreignObject>
        </g>
    )
}