import React, {Fragment, useState} from 'react';
import styled, {useTheme} from 'styled-components';
import {useTranslation} from "react-i18next";
import {Radiobar, RadiobarSegment} from "./Radiobar";
import Toggle from "./Toggle";

const Wrapper = styled.div`
    
`;

const Navigation = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
`;

const Navpill = styled.div`
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background-color: transparent;
  border: 1px solid ${theme => theme.brand_secondary_lighter};
  border-radius: 50%;
  
  &:not(:last-child) {
  margin-right: 8px;  
  }
`

const View = styled.div`
    img {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
    
        
    border: 1px solid ${props => props.grey_6};
    box-shadow: ${props => props.distant_shadow};
`

const Carousel = props => {
    const {t} = useTranslation();
    const [position, setPosition] = useState(0);
    const theme = useTheme();
    return (
        <Wrapper>
            <View {...theme}>{props.children[position]}</View>
            <Navigation>
                Seite&#32;
                <Radiobar>
                    <RadiobarSegment>
                        {props.children.map((Elem, index) => {
                            return (
                                <Toggle toggled={index === position} onClick={() => setPosition(index)} label={index + 1}/>
                            )
                        })
                        }
                    </RadiobarSegment>
                </Radiobar>

            </Navigation>

        </Wrapper>
    )
};

export default Carousel;