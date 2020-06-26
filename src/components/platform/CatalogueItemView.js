import React, {useEffect} from "react";
import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router";
import {Modal} from "../gui/Modal";
import {FILE, GRAPHIC} from "../../actions/action_constants";
import {Link} from "react-router-dom";
import VariantView from "./VariantView";
import {Container, Row} from "../gui/Grid";
import styled, {useTheme} from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {TagView} from "./Tag";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import Toolbar from "../gui/Toolbar";

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
    border-right: 1px solid ${props => props.theme.brand_secondary_light};
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
    height: 100%;
    flex-direction: row;
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
    const thumbnailCandidate = document.pages.findIndex(page=>!page.text)
    return (
        <VariantPreviewStyled {...theme} active={id === parseInt(selectedVariantId)}>
            <img src={`http://localhost:9292/thumbnails/${file_name}-THUMBNAIL-xl-p${thumbnailCandidate}.png`}/>
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

const getGraphic = (dispatch, id) => {
    dispatch({
        type: GRAPHIC.GET.REQUEST,
        payload: {id}
    })
};

const CatalogueItemViewModal = props => {
    const {graphicId} = useParams();
    const dispatch = useDispatch();

    const pending = useSelector(
        state => state.catalogue.graphicGetPending
    );

    const graphic = useSelector(
        state => state.catalogue.viewedGraphic
    );

    useEffect(() => {
        getGraphic(dispatch, graphicId);
    }, graphicId);

    return (
        <Modal noPadding={true} title={!pending ? graphic.title : 'Moment...'} dismiss={props.dismiss}>
            {pending && <Placeholder><Icon icon={"spinner fa-spin"}/></Placeholder>}
            {!pending && <CatalogueItemView {...graphic}/>}
        </Modal>
    )
};


const CatalogueItemView = props => {
    let {path, url} = useRouteMatch();
    const theme = useTheme();
    let {graphicId, variantId} = useParams();
    const logged_in = useSelector(state => state.user.logged_in);
    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <Wrapper theme={theme}>
            <Route path={`${path}/variant/:variantId`}>

                {props.variants.length > 1 &&
                <VariantColumn className={"col-xs-12 col-md-4 col-lg-3"}>
                    <div className={'heading'}>
                        <strong>Verfügbare Varianten</strong> ({props.variants.length} gesamt)</div>
                    <div>
                        {props.variants.map((variant, index) => {
                            return (
                                <Link className={'no-styled-link'} key={index} to={`${url}/variant/${variant.id}`}>
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
                        history.push(`/editor/${graphicId}`);
                        dispatch({
                            type: FILE.OPEN.REQUEST,
                            id: variantId, mode: "new"
                        })
                    }}>Neue Variante aus Auswahl</Button>
                    </NewVariantButtonContainer>

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