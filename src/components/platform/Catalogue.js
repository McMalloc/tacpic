import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {CATALOGUE, GRAPHIC, LOAD_MORE, TAGS} from "../../actions/action_constants";
import CatalogueItemList from "./CatalogueItemList";
import TagList from "./TagList";
import styled from "styled-components";
import {Row} from "../gui/Grid";
import {Checkbox} from "../gui/Checkbox";
import Searchbar from "./Searchbar";
import {Modal} from "../gui/Modal";
import {CatalogueItemView} from "./CatalogueItemView";
import {Route, useNavigate} from "react-router-dom";
import {Routes, useParams} from "react-router";
import {Button} from "../gui/Button";
import {Icon} from "../gui/_Icon";

const TagSidebar = styled.aside`
  position: sticky;
  top: ${props=>props.theme.large_padding};
  
  .tag-wrapper {
    padding: 2px 0 2px 4px;
    margin-top: 2px;
    border-radius: ${props => props.theme.border_radius};
    border: 1px solid ${props => props.theme.grey_4};
  }
  
  .custom-tag-list {
    max-height: 50vh;
    overflow-y: auto;
  }
`;

const queryGraphics = (dispatch, tags = [], terms = [], format = [], system = [], limit = 50, offset = 0) => {
    dispatch({
        type: CATALOGUE.SEARCH.REQUEST,
        payload: {
            tags,
            terms,
            format,
            system,
            limit,
            offset,
            order_by: "date",
            order_desc: false
        }
    })
};

const loadMore = (dispatch, catalogue) => {
    dispatch({
        type: LOAD_MORE
    })
};

const toggleFormat = (dispatch, format) => {
    dispatch({
        type: 'FORMAT_TOGGLED',
        format
    })
};
const toggleSystem = (dispatch, system) => {
    dispatch({
        type: 'SYSTEM_TOGGLED',
        system
    })
};

const Catalogue = props => {
    const catalogue = useSelector(
        state => state.catalogue
    );
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const {graphicId} = useParams();

    // const graphicOverview = catalogue.graphics.find(graphic => graphic.id == graphicId);
    const graphicOverview = catalogue.viewedGraphic;

    useEffect(() => {
        // TODO default to saved state
        !catalogue.searchPending && queryGraphics(dispatch);
        dispatch({
            type: TAGS.GET.REQUEST,
            payload: {limit: 30}
        })
    }, []);

    return (
        <>
            <Row>
                <div className={"col-xs-8 col-xs-offset-2"}>
                    <h1>Katalog</h1>
                </div>
            </Row>
            <Row style={{marginBottom: 24}}>
                <div className={"col-xs-8 col-xs-offset-2"}>
                    <Searchbar/>
                </div>
            </Row>
            <Row>
                <div className={"col-xs-2 col-lg-2"}>
                    <TagSidebar>
                        <strong>Format</strong>
                        <div className={"tag-wrapper"}>

                            <Checkbox onChange={event => toggleFormat(dispatch, 'a4')}
                                      name={'format-toggle-a4'}
                                      checked={catalogue.filterFormat.includes('a4')}
                                      label={'DIN A4'}/>
                            <Checkbox onChange={event => toggleFormat(dispatch, 'a3')}
                                      name={'format-toggle-a3'}
                                      checked={catalogue.filterFormat.includes('a3')}
                                      label={'DIN A3'}/>
                        </div>
                        <br/>
                        <strong>Schriftsystem</strong>
                        <div className={"tag-wrapper"}>
                            <Checkbox onChange={() => toggleSystem(dispatch, 'de-de-g0.utb')}
                                      name={'system-toggle-de-de-g0.utb'}
                                      checked={catalogue.filterSystem.includes('de-de-g0.utb')}
                                      label={'Vollschrift'}/>
                            <Checkbox onChange={() => toggleSystem(dispatch, 'de-de-g1.ctb')}
                                      name={'system-toggle-de-de-g1.ctb'}
                                      checked={catalogue.filterSystem.includes('de-de-g1.ctb')}
                                      label={'Langschrift'}/>
                            <Checkbox onChange={() => toggleSystem(dispatch, 'de-de-g2.ctb')}
                                      name={'system-toggle-de-de-g2.ctb'}
                                      checked={catalogue.filterSystem.includes('de-de-g2.ctb')}
                                      label={'Kurzschrift'}/>
                        </div>
                        <br/>

                        <TagList />
                    </TagSidebar>
                </div>
                <div className={"col-xs-10 col-lg-10"}>
                    <CatalogueItemList graphics={catalogue.graphics}/>
                    {!!graphicId &&
                    <Modal title={graphicOverview && graphicOverview.title} noPadding={true} fitted
                           dismiss={() => navigate("/catalogue")}>

                        <CatalogueItemView variantsOverview={graphicOverview.variants || []}/>

                    </Modal>}
                    <div className={"align-center padded-top"}>
                        <Button primary label={"Mehr laden"} large disabled={catalogue.loadMorePending}
                                icon={catalogue.loadMorePending ? "cog fa-spin" : "ellipsis-h"} onClick={() => {
                            loadMore(dispatch, catalogue);
                        }}/>
                    </div>

                </div>
            </Row>
            <br/>

        </>
    )
};

export default Catalogue;