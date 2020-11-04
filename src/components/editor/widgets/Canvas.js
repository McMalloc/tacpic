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
  
  ::-webkit-scrollbar-corner {
    background-color: rgba(255,255,255,.1);
  }
  
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background-color: rgba(255,255,255,.08);
    }
   
    
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        border: 1px solid rgba(0,0,0,0.2);
        background-color: ${props => props.theme.brand_primary};
        &:hover {
          background-color: rgba(252,228,0, 0.8);
        }
        //-webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
    }
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