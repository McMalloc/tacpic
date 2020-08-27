import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/macro';

// TODO: Anpassen an Viewport / Dokumentengröße
const SVG = styled.svg`
  display: inline-block;
  line-height: 0;
  border: 1px solid ${props => props.theme.grey_4};
  background-color: white;
  transition: border-color 0.2s;
`;

export const GraphicPagePreview = props => {
    const elem = document.getElementById("page-" + props.index);
    let width = 210, height = 297;
    const base = props.base || 60;
    if (elem !== null) {
        const bbox = elem.getBBox()
        width = bbox.width;
        height = bbox.height;
    }
    return (
            <SVG
                current={props.current}
                viewBox={`0 0 ${width} ${height}`}
                width={props.width > props.height ? base : parseInt(base * props.width / props.height)}
                height={props.width < props.height ? base : parseInt(base * props.height / props.width)}>

                {elem !== null ?
                    <use href={"#page-" + props.index}/>
                    :
                    <rect x={0} y={0} width={width} height={height} fill={"white"}/>
                }
            </SVG>
    )
};