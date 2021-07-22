import React, {Component, Fragment, useRef, useState} from 'react';
import {CONTENT_TYPE} from "../../config/constants";

const SVGImage = props => {
    let imageSrc = null;
    if (!!props.src) {
        let blob = new Blob([props.src], {type: CONTENT_TYPE.SVG});
        imageSrc = URL.createObjectURL(blob);
    } else {
        return null;
    }
    return <img className={props.className} alt={props.alt} src={imageSrc}/>
}

export default SVGImage;