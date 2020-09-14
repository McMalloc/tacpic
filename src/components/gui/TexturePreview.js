import React from 'react';
import styled from 'styled-components/macro';
import patternTemplates from "../editor/ReactSVG/Patterns.js";
import {useTranslation} from "react-i18next";
import {createPattern} from "../editor/ReactSVG/Patterns";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  display: inline-block;
  line-height: 0;
  cursor: pointer;
  width: ${props => props.width};
  border: 2px solid ${props => props.active ? props.theme.brand_secondary : "transparent"};
  height: ${props => props.height};
  transition: border-color 0.2s, background-color 0.1s;
  background-color: ${props => props.active ? props.theme.background : 'transparent'};
  padding: 2px;
  border-radius: ${props => props.theme.border_radius};
  
  &:hover {
     //border-color: ${props => props.theme.brand_secondary};
     background-color: ${props => props.theme.background};
  }
`;

const TexturePreview = props => {
    const { t } = useTranslation();
    const label = props.template === null ? t("gui:none") : t(props.label);
    return (
        <Wrapper role={"button"}
                 active={props.active}
                 title={label}
                 aria-label={label} onClick={props.onClick} height={props.height || 50} width={props.width || 50}>
            <svg width={props.width || 42}
                 height={props.height || 42}>
                {props.template !== null ?
                <>
                    <rect
                        fill={'url(#pattern-'+props.template+'-preview-' + props.template}
                        width={props.width || 42}
                        height={props.height || 42}
                    />
                    {createPattern(props.template, "preview-" + props.template)}
                    </>
                    :
                    <>
                        <rect
                            fill={"#e9f5f7"}
                            width={props.width || 42}
                            height={props.height || 42}
                        /><text style={{fontSize: 15,}} x={0} y={25}>{label}</text>
                    </>
                }

            </svg>

        </Wrapper>
    )
};

export default TexturePreview;