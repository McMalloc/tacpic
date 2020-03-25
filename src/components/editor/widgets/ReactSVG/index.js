import SVGRect from "./Rect";
import SVGGroup from "./Group";
import SVGPath from "./Path";
import Label from "./Label";
import React from "react";
import Ellipse from "./Ellipse";
import SVGLine from "./Line";

// TODO props.uuid als index?
export default function mapObject(props, index) {
    switch (props.type) {
        case "rect":
            return <SVGRect key={index} {...props} />;
        case "group":
            return (
                <SVGGroup key={index} {...props}>
                    {props.objects.map((object, index) => {
                        return mapObject(object, index);
                    })}
                </SVGGroup>
            );
        case "path":
            return <SVGPath key={index} {...props} />;
        case "line":
            return <SVGLine key={index} {...props} />;
        case "ellipse":
            return <Ellipse key={index} {...props} />;
        case "label":
            return <Label key={index} {...props} />;
    }
};