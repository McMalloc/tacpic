import SVGRect from "./Rect";
import SVGGroup from "./Group";
import SVGPath from "./Path";
import Label, {Title} from "./Label";
import React from "react";
import Ellipse from "./Ellipse";
import Key from "./Key";
import Embedded from "./Embedded";

export const extractSVG = index => document.getElementById("page-" + index).outerHTML;

// TODO props.uuid als index?
export default function mapObject(props, index, pageIndex = -1, callbacks) {
    if (!props || (props.hasOwnProperty('active') && !props.active)) return null;
    switch (props.type) {
        case "rect":
            return <SVGRect key={index} {...props} />;
        case "embedded":
            return <Embedded key={index} {...props} />;
        case "key":
            return <Key key={index} {...props} />;
        case "group":
            return (
                <SVGGroup key={index} {...props}>
                    {props.objects.map((object, index) => {
                        return mapObject(object, index);
                    })}
                </SVGGroup>
            );
        case "path":
            return <SVGPath callbacks={callbacks} key={index} {...props} inPreview={index === -1}/>;
        case "ellipse":
            return <Ellipse key={index} {...props} />;
        case "label":
            return <Label key={index} {...props} pageIndex={pageIndex} />;
    }
};