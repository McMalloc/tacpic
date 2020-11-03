import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/macro';
import InteractiveSVG from "../ReactSVG/InteractiveSVG";

const Wrapper = styled.div`
  z-index: 0;
  position: relative;
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
  touch-action: none;
`;

const Ruler = styled.div``;

const Canvas = props => {
    const wrapperRef = useRef();
    // const minH = -50, maxH = 1000, minV = -50, maxV = 1400;
    useEffect(() => {
        // workaround so the default can be prevented
        wrapperRef.current.addEventListener("wheel", event => event.preventDefault(), {passive: false})
    })
    return (
        <Wrapper onKeyDown={event => event.preventDefault()} ref={wrapperRef} {...props}>
            <InteractiveSVG
                // bounds={{minH, maxH, minV, maxV}}
                wrapperRef={wrapperRef} isDragging={props.isDragging}/>
            {/*<Scrollbars wrapperRef={wrapperRef} minH={minH} maxH={maxH} minV={minV} maxV={maxV}/>*/}
        </Wrapper>
    )

};

export default Canvas;