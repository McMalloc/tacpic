import {useSelector} from "react-redux";
import mapObject from "./index";
import React from "react";
import {determineFormat} from "../../../utility/determineFormat";

export const SVGPage = ({page, excludes = [], callbacks}) => {
    const {width, height, pages} = useSelector(state => state.editor.file.present);
    const showSafeArea = useSelector(state => state.editor.ui.showSafeArea);
    const {format} = determineFormat(width, height);
    const offset = format === 'a4' ? 1 : 5;
    return (
        <>
            <g id={"page-" + page}>
                <rect data-role={'CANVAS'} id={'CANVAS-' + page} data-pageidx={page} x={0} y={0}
                      width={width + "mm"}
                      height={height + "mm"}
                      stroke={'rgba(0,0,0,0.0)'} fill={'white'}/>

                {!!pages[page] && pages[page].objects.map((object, index) => {
                    if (excludes.includes(object.uuid)) return null;
                    return mapObject(object, index, page, callbacks);
                })}

                {showSafeArea &&
                <rect data-role={'SAFEAREA'}
                      width={(width - offset * 2) + "mm"}
                      height={(height - offset * 2) + "mm"}
                      className={'editor-ui'}
                      x={offset + 'mm'}
                      y={offset + 'mm'}
                      style={{pointerEvents: 'none'}}
                      strokeWidth={(offset * 2) + 'mm'}
                      stroke={'rgba(200,0,0,0.1)'} fill={'none'}/>
                }
            </g>

        </>);
};