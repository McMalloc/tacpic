import React from "react";
import {Route, Switch, useParams, useRouteMatch} from "react-router";
import {Modal} from "../gui/Modal";
import {Link} from "react-router-dom";
import VariantView from "./VariantView";
import {Container, Row} from "../gui/Grid";
import styled, {useTheme} from "styled-components";
import {useSelector} from "react-redux";

const VariantPreviewStyled = styled.div`
  display: flex;
  border: 4px solid transparent;
  position: relative;
  color: ${props => props.foreground};
  opacity: ${props => props.active ? 1 : 0.7};
  border: 4px solid ${props => props.active ? props.brand_secondary_light : 'transparent'};
  background-color: ${props => props.active ? props.grey_6 : 'transparent'};
  
  &:hover {
    opacity: 1;
  }
  
  &:focus {
    opacity: 1;
    border: 2px solid ${props => props.grey_5};
    outline: none;
  }

  img {
    width: 50%;
    height: auto;
    border: 1px solid ${props => props.grey_6};
    box-shadow: ${props => props.middle_shadow};
  }
  
  .variant-info {
    flex: 1 1 100%;
    padding: ${props => props.large_padding};
    color: ${props => props.active ? props.brand_secondary : 'inherit'};
  }
`;

const VariantColumn = styled.div`
    flex: 0 0 auto;
    overflow-y: auto;
    height: 100%;
    padding: 0;
    flex-direction: column;
    border-right: 1px solid ${props => props.theme.grey_5};
    position: relative;
    
    .heading {
      position: sticky;
      padding:  ${props => props.theme.large_padding};
      background-color: ${props => props.theme.brand_secondary};
      color: ${props => props.theme.background};
    }
`;

const DetailsColumn = styled.div`
    flex: 0 0 auto;
    overflow: auto;
    background-color: ${props => props.theme.background};
    padding: ${props => props.theme.large_padding};
`;

const Wrapper = styled.div`
    background-color: ${props => props.theme.grey_6};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1 1 auto;
    overflow: hidden;
`;

const VariantPreview = ({title, id, description, tags}) => {
    let selectedVariantId = useParams().variantId;
    const theme = useTheme();
    const allTags = useSelector(
        state => state.catalogue.tags
    );
    return (
        <VariantPreviewStyled {...theme} active={id === parseInt(selectedVariantId)}>
            <img src={`http://localhost:9292/static/thumbnails/thumbnail-${id}-sm.png`}/>
            {/*<VariantListingPreview bgUrl={`http://localhost:9292/static/thumbnails/thumbnail-${id}-sm.png`} />*/}
            <div className={'variant-info'}>
                <strong>{title}</strong><br/>
                <small>{!!description && description.slice(0, 80)}{!!description && description.length > 80 && ' …'}</small>
                <div>
                    {tags.length !== 0 && tags.map(t => {
                        let completeTag = allTags.find(_t => _t.tag_id === t);
                        return <span key={t}>{completeTag && completeTag.name}</span>
                    })}
                </div>
            </div>
        </VariantPreviewStyled>
    )
};

const CatalogueItemViewModal = props => {
    let {graphicId} = useParams();
    const graphic = props.graphics.find(g => g.id === graphicId);
    if (!graphic) return null;

    return (
        <Modal noPadding={true} title={graphic.title} dismiss={props.dismiss}>
            <CatalogueItemView {...graphic}/>
        </Modal>
    )
};

const CatalogueItemView = props => {
    let {path, url} = useRouteMatch();
    const theme = useTheme();
    return (
        <Wrapper theme={theme}>
            <Route path={`${path}/variant/:variantId`}>

                {props.variants.length > 1 &&
                <VariantColumn className={"col-xs-12 col-md-4 col-lg-3"}>
                    <div className={'heading'}><strong>Verfügbare Varianten</strong> ({props.variants.length} gesamt)
                    </div>
                    <div>
                        {props.variants.map((variant, index) => {
                            return (
                                <Link className={'no-styled-link'} key={index} to={`${url}/variant/${variant.id}`}>
                                    <VariantPreview {...variant} />
                                </Link>
                            )
                        })}
                    </div>
                </VariantColumn>
                }
                <DetailsColumn className={props.variants.length > 1 && "col-xs-12 col-md-8 col-lg-9"} theme={theme}>
                    <Switch>
                        <VariantView {...props}/>
                    </Switch>
                </DetailsColumn>
            </Route>
        </Wrapper>
    );
};

export {CatalogueItemView, CatalogueItemViewModal};