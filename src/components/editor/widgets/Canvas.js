import React from 'react';
import styled from 'styled-components';
import InteractiveSVG from "./ReactSVG/InteractiveSVG";

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
  opacity: ${props => props.hide ? 0 : 100};
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