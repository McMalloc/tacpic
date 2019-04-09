import React from 'react';
import styled from 'styled-components';
import patternTemplates from "../editor/widgets/ReactSVG/Patterns.js";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  display: inline-block;
  line-height: 0;
  width: ${props => (props.width || 50) + "px"};
  border: 2px solid ${props => props.active ? props.theme.accent_1 : props.theme.background};
  height: ${props => (props.height || 50) + "px"};
  transition: border-color 0.2s;
  background-color: ${props => props.theme.background};
  
  &:hover {
     border-color: ${props => props.theme.accent_1};
     background-color: ${props => props.theme.accent_1_light};
  }
`;

const TexturePreview = props => {
    return (
        <Wrapper height={props.height || 50} width={props.width || 50}>
            <svg width={props.width || 50}
                 height={props.height || 50}>
                <rect
                    fill={'url(#pattern-preview-' + props.template}
                    width={props.width || 50}
                    height={props.height || 50}
                />
                {patternTemplates[props.template]({scaleX: 1, scaleY: 1, angle: 0}, "preview-" + props.template)}
            </svg>
        </Wrapper>
    )
};

export default TexturePreview;