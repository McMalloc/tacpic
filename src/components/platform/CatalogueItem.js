import React from "react";
import styled, {useTheme} from "styled-components";
import {Link} from "react-router-dom";
import Tile from "../gui/_Tile";

const Wrapper = styled.div`
  padding: 6px;
  flex: 0 1 20%;
  box-sizing: border-box;
  
  @media (max-width: 1280px) {
    flex: 0 1 25%;
  }  
  
  @media (max-width: 900px) {
    flex: 0 1 50%;
  }
  
  &:before {
    content:'';
    float:left;
    padding-top:100%;
}
`;

export {Wrapper};

const Preview = styled.div`
  border-radius: ${props => props.theme.border_radius};
  background-image:url('${props => props.thumbnailURL}');
  background-repeat:no-repeat;
  background-position: center;
  height: 100%;
  background-size: contain;
  background-color: ${props => props.theme.background};
`;

const Info = styled.div`
  background-color: ${props => props.theme.background};
  padding: 8px;
  color: ${props => props.theme.foreground};
  border-radius: 0 0 ${props => props.theme.border_radius} ${props => props.theme.border_radius};
`;

export default props => {
    const theme = useTheme();
    const thumbnailURL =
        `/thumbnails/${props.variants[0].file_name}-THUMBNAIL-sm-p0.png`
    return (
        <Wrapper theme={theme}>
            <Link className={'no-styled-link'} to={props.url}>
                <Tile>
                    <Preview
                        thumbnailURL={thumbnailURL} />
                    <Info>
                        <strong>{props.title}</strong> <br/>
                        <small>
                            {props.variants.length}
                            {props.filtered ? ' zutreffende ' : ' '}
                            Variante{props.variants.length !== 1 && 'n'}
                        </small>
                    </Info>
                </Tile>
            </Link>
        </Wrapper>
    )
};