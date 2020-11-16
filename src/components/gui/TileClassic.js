import styled from 'styled-components/macro';
import React, {Component} from "react";
import {p} from 'styled-components-spacing';

// DEPRECATED

// TODO Polyfill für object-fit
const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  transition: transform 0.2s;
`;

const ImageWrapper = styled.div`
  flex: 1 0 200px;
  width: 100%;
  overflow: hidden;
  position: relative;
  
  &:after {
    position: absolute;
    content: "\f061";
    font-family: 'Font Awesome 5 Free';
    font-size: 2rem;
    ${p(2)};
    bottom: 0;
    right: 50px;
    opacity: 0;
    transition: opacity 0.2s, right 0.2s;
    color: ${props => props.theme.brand_primary_light};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 255px;
  overflow: hidden;
  
  // sieht komisch aus, wie ein zweiter Rahmen
  //border: 1px solid ${props => props.theme.accent_1_light};
  box-shadow: ${props => props.theme.distant_shadow};
  border-radius: 3px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  
  &:hover {
    //box-shadow: ${props => props.theme.distant_shadow};
    color: ${props => props.theme.accent_1};
    
    ${Image} {
      transform: scale(1.05);
    }
    
    ${ImageWrapper}:after {
      opacity: 1;
      right: 0;
    }
  }
`;

const Title = styled.div`
    background-color: ${props => props.theme.brand_secondary};
    color: ${props => props.theme.brand_primary_light};
    flex: 1 0 55px;
    ${p(2)};
    //font-weight: 700;
    box-sizing: border-box;
`;

const TileClassic = props => {
    return (
        <Container>
            <ImageWrapper>
                <Image src={props.imgUrl} />
            </ImageWrapper>
            <Title>{props.title}</Title>
        </Container>
    )
};

export {TileClassic}