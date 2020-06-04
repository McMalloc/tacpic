import React from 'react';
import styled from 'styled-components/macro';
import InteractiveSVG from "./ReactSVG/InteractiveSVG";

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
  // display: ${props => props.hide ? "none" : "block"};
  max-height: ${props => props.hide ? 0 : "auto"};
  max-width: ${props => props.hide ? 0 : "auto"};
`;

const Ruler = styled.div``;

const Canvas = props => {
        return (
            <Wrapper {...props}>
                <InteractiveSVG/>
            </Wrapper>
        )

};

export default Canvas;