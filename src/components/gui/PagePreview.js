import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/macro';

// TODO: Anpassen an Viewport / Dokumentengröße
const SVG = styled.svg`
  display: inline-block;
  line-height: 0;
  border: 2px solid ${props => props.current ? props.theme.brand_secondary : props.theme.background};
  background-color: white;
  transition: border-color 0.2s;
`;

const Placeholder = styled.div`
  display: inline-block;
  overflow: hidden;
  border: ${props => props.current ? props.theme.brand_secondary : props.theme.background};
  background-color: white;
  //font-size: 70%;
  user-select: none;
  transition: border-color 0.2s;
  margin-right: -8px;
  box-shadow: ${props => props.first ? 'none' : '-2px 0px 4px rgba(0,0,0,0.3)'};
  text-align: center;
  content: "_";
`;

const Title = styled.label`
  font-size: 0.9em;
  width: 100%;
  display: block;
  //margin-top: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[1]};
  
  color: ${props => props.current ? props.theme.brand_secondary : "inherit"};
  font-weight: ${props => props.current ? "700" : "inherit"};
  
  text-decoration: ${props => props.current ? "underline" : "inherit"};
`;

const Wrapper = styled.div`
  display: block;
  flex: 1 1 auto;
  // flex: 1 1 ${props => props? "100%" : "50%"};
  text-align: center;
  //flex-direction: column;
  // margin-right: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[2]};
  position: relative;
  cursor: pointer;
   
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
  opacity: 0.5;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.brand_secondary};
`;

export const GraphicPagePreview = props => {
    const elem = document.getElementById("page-" + props.index);
    let width = 210, height = 297;
    if (elem !== null) {
        const bbox = elem.getBBox()
        width = bbox.width;
        height = bbox.height;
    }
    return (
        <Wrapper onClick={props.onClick}>
            <SVG
                current={props.current}
                viewBox={`0 0 ${width} ${height}`}
                width={props.width > props.height ? 60 : parseInt(60 * props.width / props.height)}
                height={props.width < props.height ? 60 : parseInt(60 * props.height / props.width)}>

                {elem !== null ?
                    <use href={"#page-" + props.index}/>
                    :
                    <rect x={0} y={0} width={width} height={height} fill={"white"}/>
                }
            </SVG>
            <Title current={props.current}>{props.title}</Title>
        </Wrapper>
    )
};

export const BraillePagePreview = props => {
    // TODO placeholder, auch wenn noch kein formatierter Text vorhanden ist
    return (
        <Wrapper onClick={props.onClick}>

            {props.formatted && props.formatted.length > 0 && props.formatted.map((page, index) => {
                return <a href={`#braillepage_preview_${props.index}_${index}`}>
                    <Placeholder current={props.current}
                                 first={index===0}
                                 style={{
                                     width: props.width > props.height ? 60 : parseInt(60 * props.width / props.height),
                                     height: props.width < props.height ? 60 : parseInt(60 * props.height / props.width)
                                 }}>
                        #{index+1} <br /><i className={"fa fa-braille"}/>
                    </Placeholder></a>
            })}

            {/*<Indicator>*/}
            {/*    */}
            {/*</Indicator>*/}

            <Title current={props.current}>Brailleseiten</Title>
        </Wrapper>
    )
};