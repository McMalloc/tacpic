import SVGRect from "./Rect";
import SVGGroup from "./Group";
import SVGPath from "./Path";
import Label from "./Label";
import React from "react";
import Ellipse from "./Ellipse";
import SVGLine from "./Line";
import Key from "./Key";
import { renderToStaticMarkup } from 'react-dom/server'
import {SVGPage} from "./SVGPage";
import {store} from "../../../../store";
import {Provider} from "react-redux";

export function renderSVG(page) {
    return renderToStaticMarkup(
        <Provider store={store}>
            <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100}><SVGPage page={page} /></svg>
        </Provider>
    )
}

export const extractSVG = index => document.getElementById("page-" + index).outerHTML;

// TODO props.uuid als index?
export default function mapObject(props, index) {
    if (!props) return null;
    switch (props.type) {
        case "rect":
            return <SVGRect key={index} {...props} />;
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
            return <SVGPath key={index} {...props} inPreview={index === -1}/>;
        case "line":
            return <SVGLine key={index} {...props} />;
        case "ellipse":
            return <Ellipse key={index} {...props} />;
        case "label":
            return <Label key={index} {...props} />;
    }
};