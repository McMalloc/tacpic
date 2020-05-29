import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';

// TODO: Anpassen an Viewport / Dokumentengröße
const SVG = styled.svg`
  display: inline-block;
  line-height: 0;
  border: 2px solid ${props => props.current ? props.theme.brand_secondary : props.theme.background};
  background-color: white;
  transition: border-color 0.2s;
`;

const Title = styled.label`
  font-size: 0.9em;
  width: 100%;
  display: block;
  text-align: center;
  margin-top: ${props => props.theme.spacing[1]};
  
  color: ${props => props.current ? props.theme.brand_secondary : "inherit"};
  font-weight: ${props => props.current ? "700" : "inherit"};
  
  text-decoration: ${props => props.current ? "underline" : "inherit"};
`;

const Wrapper = styled.div`
  display: inline-block;
  //flex-direction: column;
  margin-right: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
  position: relative;
   
  &:hover ${Title} {
     text-decoration: underline;
  }
`;

const Indicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  padding: 2px;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.brand_secondary};
`;

export const GraphicPagePreview = props => {
    const elem = document.getElementById("page-" + props.index);
    if (elem === null) return null;
    const { width, height} = elem.getBBox();
    return (
        <Wrapper onClick={props.onClick}>
            <SVG
                current={props.current}
                viewBox={`0 0 ${width} ${height}`}
                width={props.width > props.height ? 60 : parseInt(60 * props.width / props.height)}
                height={props.width < props.height ? 60 : parseInt(60 * props.height / props.width)}>

                <use href={"#page-" + props.index}/>
            </SVG>
            <Title current={props.current}>{props.title}</Title>
        </Wrapper>
    )
};

export const BraillePagePreview = props => {
    return (
        <Wrapper onClick={props.onClick}>
            <SVG
                width={props.width > props.height ? 60 : parseInt(60 * props.width / props.height)}
                height={props.width < props.height ? 60 : parseInt(60 * props.height / props.width)}>
            </SVG>

            <Indicator>
                <i className={"fa fa-braille"}/>
            </Indicator>

            <Title current={props.current}>{props.title}</Title>
        </Wrapper>
    )
};