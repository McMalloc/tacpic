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
    width: 30%;
    height: auto;
    align-self: center;
    border: 1px solid ${props => props.grey_6};
    box-shadow: ${props => props.middle_shadow};
  }
  
  .variant-info {
    flex: 1 1 100%;
    padding: ${props => props.large_padding};
    color: ${props => props.active ? props.brand_secondary : 'inherit'};
  }
`;

const NewVariantButtonContainer = styled.div`
  padding: 6px;
`;

const VariantColumn = styled.div`
    //flex: 0 0 auto;
    overflow-y: auto;
    height: 100%;
    padding: 0;
    flex-direction: column;
    display: flex;
    //border-right: 1px solid ${props => props.theme.brand_secondary_light};
    position: relative;
    
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
    height: 100%;
    background-color: ${props => props.theme.grey_6};
    padding: ${props => props.theme.large_padding};
`;

const Wrapper = styled.div`
    background-color: ${props => props.theme.grey_6};
    display: flex;
    flex-direction: row;
    max-width: 1280px;
    flex-wrap: wrap;
    flex: 1 1 auto;
    overflow: hidden;
`;

const VariantPreview = ({title, id, description, tags, document, file_name}) => {
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
                <small>{!!description && description.slice(0, 80)}{!!description && description.length > 80 && ' …'}</small>
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

const Placeholder = styled.div`
  height: 30%;
  min-height: 200px;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  display: flex;
  text-align: center;
  font-size: 200%;
`;

const CatalogueItemView = ({variantsOverview}) => {
    const theme = useTheme();
    let {graphicId, variantId} = useParams();
    const logged_in = useSelector(state => state.user.logged_in);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pending = useSelector(state => state.catalogue.graphicGetPending);

    const viewedGraphic = useSelector(state => state.catalogue.viewedGraphic);
    const viewedVariant = viewedGraphic.variants && viewedGraphic.variants.find(variant => variant.id == variantId);

    useEffect(() => {
        dispatch({
            type: GRAPHIC.GET.REQUEST,
            payload: {id: graphicId}
        });
    }, [graphicId]);

    return (
        <Wrapper theme={theme}>
        {/*<Wrapper theme={theme}>*/}
                {/*{props.variants.length > 1 &&*/}
                <VariantColumn className={"col-xs-12 col-md-4 col-lg-3"}>
                    <div className={'heading'}>
                        <strong>Verfügbare Varianten</strong> ({variantsOverview.length} gesamt)
                    </div>
                    <div>
                        {variantsOverview.map((variant, index) => {
                            return (
                                <Link className={'no-styled-link'} key={index} to={`/catalogue/${graphicId}/variant/${variant.id}`}>
                                    <VariantPreview {...variant} />
                                </Link>
                            )
                        })}
                    </div>
                    <NewVariantButtonContainer>
                        <Button className={'extra-margin'}
                                disabled={!logged_in}
                                fullWidth icon={'copy'}
                                onClick={() => {
                                    navigate(`/editor/${graphicId}`);
                                    dispatch({
                                        type: FILE.OPEN.REQUEST,
                                        id: variantId, mode: "new"
                                    })
                                }}>Neue Variante aus Auswahl</Button>
                    </NewVariantButtonContainer>

                </VariantColumn>
                {/*}*/}
                <DetailsColumn className={"col-xs-12 col-md-8 col-lg-9"} theme={theme}>
                    {pending && <Placeholder><Icon icon={"spinner fa-spin"}/></Placeholder>}
                    {!pending && <VariantView {...viewedVariant} />}
                </DetailsColumn>
        </Wrapper>
    );
};

export {CatalogueItemView};