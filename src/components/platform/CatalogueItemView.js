import React, {useEffect} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import {FILE, GRAPHIC} from "../../actions/action_constants";
import {Link} from "react-router-dom";
import VariantView from "./VariantView";
import {Container, Row} from "../gui/Grid";
import styled, {useTheme} from "styled-components/macro";
import {useDispatch, useSelector} from "react-redux";
import {TagView} from "./Tag";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import Toolbar from "../gui/Toolbar";
import {API_URL} from "../../env.json";
import Loader from "../gui/Loader";
import useMediaQuery from "react-responsive";

const VariantPreviewStyled = styled.div`
  display: flex;
  border: 4px solid transparent;
  position: relative;
  text-decoration: ${props => props.active ? 'underline' : 'none'};
  border: 2px solid ${props => props.active ? props.brand_secondary_light : 'transparent'};
  padding: ${props => props.large_padding};
  
  background-color: ${props => props.active ? props.grey_6 : "inherit"};
  color: ${props => props.active ? props.foreground : "inherit"};
  
  transition: background-color 0.1s, color 0.1s;
  
  img {
    opacity: ${props => props.active ? 1 : 0.7};
    transition: opacity 0.2s;
  }
  
  &:hover {
    img {opacity: 1;}
    strong {
      text-decoration: underline;
    }
  }
  
  &:focus {
    opacity: 1;
    border: 2px solid ${props => props.grey_5};
    outline: none;
  }

  img {
    width: 30%;
    height: auto;
    align-self: center;
    box-shadow: ${props => props.distant_shadow};
  }
  
  .variant-info {
    flex: 1 1 100%;
    padding: ${props => props.large_padding};
    color: ${props => props.active ? props.brand_secondary : 'inherit'};
  }
`;

const VariantColumn = styled.div`
    overflow-y: auto;
    padding: 0;
    flex-direction: column;
    display: flex;
    position: relative;
    background-color: ${props => props.theme.brand_secondary};
    color: ${props => props.theme.background};
    //box-shadow: 3px 0 5px rgba(0,0,0,0.4);
    
    .heading {
      position: sticky;
      padding:  ${props => props.theme.large_padding};
      background-color: ${props => props.theme.brand_secondary};
      color: ${props => props.theme.background};
    }
`;

const DetailsColumn = styled.div`
    //flex: 0 0 auto;
    overflow: auto;
    //height: 100%;
    background-color: ${props => props.theme.grey_6};
    padding: ${props => props.theme.large_padding};
`;

const Wrapper = styled.div`
    background-color: ${props => props.theme.grey_6};
    display: flex;
    min-width: 400px;
    max-width: 1400px;
    flex: 1 1 auto;
    overflow: hidden;
`;

const VariantPreview = ({title, id, description, tags, document, file_name, derivedTitle}) => {
    let selectedVariantId = useParams().variantId;
    let graphicId = useParams().graphicId;
    const theme = useTheme();
    const allTags = useSelector(
        state => state.catalogue.tags
    );
    return (
        <VariantPreviewStyled {...theme} active={id === parseInt(selectedVariantId)}>
            <img src={`${API_URL}/thumbnails/${file_name}-THUMBNAIL-xl-p0.png`}/>
            {/*<VariantListingPreview bgUrl={`http://localhost:9292/static/thumbnails/thumbnail-${id}-sm.png`} />*/}
            <div className={'variant-info'}>
                <strong>{title}</strong><br/>
                {derivedTitle && <small>abgeleitet aus {derivedTitle}</small>}
                <div>
                    {tags.length !== 0 && tags.map(t => {
                        let completeTag = allTags.find(_t => _t.tag_id === t);
                        return <TagView title={"Schlagwort"} key={t}>{completeTag && completeTag.name}</TagView>
                    })}
                </div>
            </div>
        </VariantPreviewStyled>
    )
};

const CatalogueItemView = ({variantsOverview}) => {
    const theme = useTheme();
    let {graphicId, variantId} = useParams();
    const logged_in = useSelector(state => state.user.logged_in);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pending = useSelector(state => state.catalogue.graphicGetPending);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });


    const viewedGraphic = useSelector(state => state.catalogue.viewedGraphic);
    const viewedVariant = viewedGraphic.variants && viewedGraphic.variants.find(variant => variant.id == variantId);

    useEffect(() => {
        dispatch({
            type: GRAPHIC.GET.REQUEST,
            payload: {id: graphicId}
        });
    }, [graphicId]);

    return (
        <Wrapper>
            {pending ?
                <Loader timeout={1000} message={"Variante wird geladen, einen Moment noch."}/>
                :
                <>
                    <VariantColumn className={"col-xs-12 col-md-3 col-lg-2"}>
                        <div className={'heading'}>
                            <strong>Verfügbare Varianten</strong> ({variantsOverview.length} gesamt)
                        </div>
                        <div>
                            {variantsOverview.map((variant, index) => {
                                const derivedFrom = variantsOverview.find(v => v.id == variant.derived_from);
                                return (
                                    <Link className={'no-styled-link'} key={index}
                                          to={`/catalogue/${graphicId}/variant/${variant.id}`}>
                                        <VariantPreview derivedTitle={derivedFrom && derivedFrom.title} {...variant} />
                                    </Link>
                                )
                            })}
                        </div>
                    </VariantColumn>
                    {/*}*/}
                    <DetailsColumn className={"col-xs-12 col-md-9 col-lg-10"}>
                        <VariantView graphicTitle={viewedGraphic.title} {...viewedVariant} />
                    </DetailsColumn>
                </>
            }
        </Wrapper>
    );
};

export {CatalogueItemView};