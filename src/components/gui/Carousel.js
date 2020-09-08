import React, {Fragment, useState} from 'react';
import styled, {useTheme} from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {Radiobar, RadiobarSegment} from "./Radiobar";
import Toggle from "./Toggle";
import {Icon} from "./_Icon";

const Wrapper = styled.div`
    .icon {
      display: none;
    }
    
    &:hover {.icon {
      display: inline;
    }}
`;

const Navarea = styled.div`
    position: absolute;
    height: 100%;
    width: 10%;
    top: 0;
    align-items: center;
    font-size: 200%;
    display: flex;
    cursor: pointer;
    
    &.left {
        left: 0;
        padding-left: 2%;
        &:hover {
          background: rgb(0,0,0);
          background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
          text-shadow: 0 0 5px white;
        }
    }
    
    &.right {
        right: 0;
        //padding-left: 20%;
        &:hover {
          background: rgb(0,0,0);
          background: linear-gradient(270deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
          text-shadow: 0 0 5px white;
        }
    } 
`;

const Navigation = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
`;

const View = styled.div`
    img {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
    
    position: relative;
    border: 1px solid ${props => props.grey_6};
    box-shadow: ${props => props.distant_shadow};
`

const Carousel = props => {
    const {t} = useTranslation();
    const [position, setPosition] = useState(0);
    const theme = useTheme();
    return (
        <Wrapper>
            <View {...theme}>
                {props.children[position]}

                {position !== 0 &&
                <Navarea onClick={() => setPosition(Math.max(position - 1, 0))} className={"left"}>
                    <Icon icon={"chevron-left"}/>
                </Navarea>
                }
                {position !== props.children.length - 1 &&
                <Navarea onClick={() => setPosition(Math.min(position + 1, props.children.length))} className={"right"}>
                    <Icon icon={"chevron-right"}/>
                </Navarea>
                }
                {/*<Next>rechts</Next>*/}
            </View>
            <Navigation>
                {props.children.length === 1 ?
                    <>{props.single || null}</>
                    :
                    <>
                        Seite&#32;
                        <Radiobar>
                            <RadiobarSegment>
                                {props.children.map((Elem, index) => {
                                    if (Elem === null) return null;
                                    return (
                                        <Toggle toggled={index === position} onClick={() => setPosition(index)}
                                                key={index} label={index + 1}/>
                                    )
                                })
                                }
                            </RadiobarSegment>
                        </Radiobar>
                    </>
                }
            </Navigation>

        </Wrapper>
    )
};

export default Carousel;