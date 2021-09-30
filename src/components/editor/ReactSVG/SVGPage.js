import {useSelector} from "react-redux";
import mapObject from "./index";
import React from "react";
import {determineFormat} from "../../../utility/determineFormat";
import { SAFE_BORDER } from "../../../config/constants";

export const SVGPage = ({page, excludes = [], callbacks}) => {
    const {width, height, pages} = useSelector(state => state.editor.file.present);
    const showSafeArea = useSelector(state => state.editor.ui.showSafeArea);
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
                      width={(width - SAFE_BORDER) + "mm"}
                      height={(height - SAFE_BORDER) + "mm"}
                      className={'editor-ui'}
                      x={(SAFE_BORDER/2) + 'mm'}
                      y={(SAFE_BORDER/2) + 'mm'}
                      style={{pointerEvents: 'none'}}
                      strokeWidth={(SAFE_BORDER) + 'mm'}
                      stroke={'rgba(200,0,0,0.1)'} fill={'none'}/>
                }
            </g>

        </>);
};