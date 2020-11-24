import styled from 'styled-components/macro';
import React, {Component} from "react";
import TexturePreview from "./TexturePreview";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  
  opacity: ${props => props.disabled ? 0.2 : 1};
`;

const TexturePalette = props => {
    return (
        <Wrapper disabled={props.disabled}>
            {props.textures.map((texture, index) => {
                return <TexturePreview
                    active={props.selected === texture}
                    key={index}
                    id={"texture-select-" + texture}
                    label={"textures:" + texture}
                    onClick={() => {
                        props.onChange(texture);
                    }}
                    template={texture}/>
            })}
        </Wrapper>
    )
};

export default TexturePalette;