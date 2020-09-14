import React, {Component, Fragment, useRef, useState} from 'react';
import {SVG_MIME} from "../../config/constants";

const SVGImage = props => {
    let imageSrc = null;
    if (!!props.src) {
        let blob = new Blob([props.src], {type: SVG_MIME});
        imageSrc = URL.createObjectURL(blob);
    } else {
        return null;
    }
    return <img className={props.className} alt={props.alt} src={imageSrc}/>
}

export default SVGImage;