import {useSelector} from "react-redux";
import mapObject from "./index";
import React from "react";

export const SVGPage = ({page, excludes = []}) => {
    const { width, height, pages } = useSelector(state => state.editor.file);
    if (pages[page].text) return null;
    return (
        <g id={"page-" + page}>
            <rect data-role={"CANVAS"} data-pageidx={page} x={0} y={0}
                  width={width + "mm"}
                  height={height + "mm"}
                  stroke={'rgba(0,0,0,0.0)'} fill={'white'}/>
            {pages[page].objects.map((object, index) => {
                if (excludes.includes(object.uuid)) return null;
                return mapObject(object, index);
            })}
        </g>);
};