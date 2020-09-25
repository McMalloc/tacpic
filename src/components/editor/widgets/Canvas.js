import React, {useRef} from 'react';
import styled from 'styled-components/macro';
import InteractiveSVG from "../ReactSVG/InteractiveSVG";
import Scrollbars from "../../gui/Scrollbars";

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
  position: relative;
  // display: ${props => props.hide ? "none" : "block"};
  max-height: ${props => props.hide ? 0 : "auto"};
  max-width: ${props => props.hide ? 0 : "auto"};
`;

const Ruler = styled.div``;

const Canvas = props => {
    const wrapperRef = useRef();
    const minH = -50, maxH = 1000, minV = -50, maxV = 1400;
    return (
        <Wrapper ref={wrapperRef} {...props}>
            <InteractiveSVG bounds={{minH, maxH, minV, maxV}} isDragging={props.isDragging}/>
            <Scrollbars wrapperRef={wrapperRef} minH={minH} maxH={maxH} minV={minV} maxV={maxV}/>
        </Wrapper>
    )

};

export default Canvas;