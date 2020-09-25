import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const Scrollbar = styled.div`
    position: absolute;
    top: 0;
    left: ${props => props.offset}px;
    width: ${props => props.width}px;
    height: 20px;
    background-color: blue;
`;

const Wrapper = styled.div`

`;

const Scrollbars = ({wrapperRef, minH, maxH, minV, maxV}) => {
    const [canvasHeight, setCanvasHeight] = useState(0);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const {scalingFactor, viewPortX, viewPortY} = useSelector(state => state.editor.ui);

    useEffect(() => {
        const {width, height} = wrapperRef.current.getBoundingClientRect();
        setCanvasHeight(height);
        setCanvasWidth(width);
    })

    const mappedH = Math.abs(minH - maxH);
    const mappedV = Math.abs(minV - maxV);

    const offsetX = 0;//canvasWidth * ((mappedH - viewPortX) / mappedH);
    const width = (mappedH / (canvasWidth * scalingFactor)) * canvasWidth;

    const {t} = useTranslation();
    const [position, setPosition] = useState(0);
    return (
        <>
           {/*<Scrollbar width={width} offset={offsetX} />*/}
        </>
    )
};

export default Scrollbars;