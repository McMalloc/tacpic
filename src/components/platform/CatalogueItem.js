import React from "react";
import styled from "styled-components/macro";
import {Link} from "react-router-dom";
import Tile from "../gui/_Tile";
import env from "../../env.json"
import {LG_SCREEN, MD_SCREEN, SM_SCREEN} from "../../config/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "../gui/_Icon";

const Wrapper = styled.div`
  padding: 6px;
  box-sizing: border-box;
  flex: 0 1 50%;

  ${SM_SCREEN} { flex: 0 1 50%; }  
  ${MD_SCREEN} { flex: 0 1 33%; }  
  ${LG_SCREEN} { flex: 0 1 33%; }
  
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

const Title = styled.div`
  font-weight: bold;
  max-height: 2.8em;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Info = styled.div`
  background-color: ${props => props.theme.background};
  padding: 8px;
  color: ${props => props.theme.foreground};
  border-radius: 0 0 ${props => props.theme.border_radius} ${props => props.theme.border_radius};
`;

export default props => {
    const {t} = useTranslation();
    const thumbnailURL =
        `${env.API_URL}/thumbnails/${props.variants[0].current_file_name}-THUMBNAIL-sm-p0.png`
    
    const hiddenVariants = props.variants.filter(variant => !variant.public);
    return (
        <Wrapper data-pom={'catalogueItem'} aria-labelledby={'catalogue-title-' + props.id} role={'link'} id={"catalogue-item-" + props.id}>
            <Link aria-hidden={true} className={'no-styled-link'} to={props.id + "/variant/" + props.variants[0].id}>
                <Tile>
                    <Preview
                        id={"catalogue-item-" + props.id + "-thumbnail"} thumbnailURL={thumbnailURL} />
                    <Info className={'breakable-long-lines'}>
                        <Title title={props.title} id={'catalogue-title-' + props.id} className={"hover-sensitive"}>{props.title}</Title><br/>
                        <small>
                            {t('catalogue:variants', {count: props.variants.filter(variant => variant.public).length, context: props.filtered ? 'filtered' : 'all'})}
                            {hiddenVariants.length > 0 &&
                                <><span style={{backgroundColor: 'yellow', float:'right'}}>{hiddenVariants.length} <Icon icon={'eye-slash'}/></span></>
                            }
                        </small>
                    </Info>
                </Tile>
            </Link>
        </Wrapper>
    )
};