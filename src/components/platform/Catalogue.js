import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { CATALOGUE, GRAPHIC, LOAD_MORE, TAGS } from "../../actions/action_constants";
import CatalogueItemList from "./CatalogueItemList";
import TagList from "./TagList";
import styled from "styled-components/macro";
import { Row } from "../gui/Grid";
import { Checkbox } from "../gui/Checkbox";
import Searchbar from "./Searchbar";
import Modal from "../gui/Modal";
import { CatalogueItemView } from "./CatalogueItemView";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { FlyoutButton } from "../gui/FlyoutButton";
import { useBreakpoint } from "../../contexts/breakpoints";
import { BRAILLE_SYSTEMS, MD_SCREEN } from '../../config/constants';
import { useTranslation } from 'react-i18next';

const TagSidebar = styled.aside`
  position: sticky;
  top: ${(props) => props.theme.large_padding};

  .tag-wrapper {
    padding: 2px 0 2px 4px;
    box-sizing: border-box;
    margin-top: 2px;
    border-radius: ${(props) => props.theme.border_radius};
    border: 1px solid ${(props) => props.theme.grey_4};
  }

  .custom-tag-list {
    overflow-y: auto;

    ${MD_SCREEN} {
        max-height: 50vh;
    }
  }
`;

const SearchFilterBar = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 2em;
`;

const queryGraphics = (dispatch, tags = [], terms = [], format = [], system = [], limit = 30, offset = 0) => {
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

const Catalogue = () => {
    const catalogue = useSelector(
        state => state.catalogue
    );
    const dispatch = useDispatch();
    const breakpoints = useBreakpoint();

    const navigate = useNavigate();
    const { graphicId } = useParams();

    const location = useLocation();
    const {t} = useTranslation();


    // const graphicOverview = catalogue.graphics.find(graphic => graphic.id == graphicId);
    const graphicOverview = catalogue.viewedGraphic;

    useEffect(() => {
        // TODO default to saved state
        !catalogue.searchPending && queryGraphics(dispatch);
        dispatch({
            type: TAGS.GET.REQUEST,
            payload: { limit: 30 }
        })
    }, []);

    useEffect(() => {
        const view = new URLSearchParams(location.search).get('view');
        if (!graphicOverview.title || !graphicId) {
            document.title = `${t('glossary:catalogue')} \u23D0 ${t('glossary:brand')}`
        } else if (view === 'history') {
            document.title = 
                `${t('glossary:catalogue')}: 
                ${graphicOverview.title} 
                (${t('glossary:history')}) 
                \u23D0 ${t('glossary:brand')}`
        } else {
            document.title = `${t('glossary:catalogue')}: ${graphicOverview.title} \u23D0 ${t('glossary:brand')}`
        }
    }, [graphicOverview.id, location.pathname, location.search]);

    const tagSidebar = <TagSidebar>
        <strong>{t('catalogue:formatHeading')}</strong>
        <div className={"tag-wrapper"}>

            <Checkbox onChange={() => toggleFormat(dispatch, 'a4')}
                name={'format-toggle-a4'}
                value={catalogue.filterFormat.includes('a4')}
                label={'catalogue:a4'} />
            <Checkbox onChange={() => toggleFormat(dispatch, 'a3')}
                name={'format-toggle-a3'}
                value={catalogue.filterFormat.includes('a3')}
                label={'catalogue:a3'} />
        </div>
        <br />
        <strong>{t('catalogue:systemHeading')}</strong>
        <div className={"tag-wrapper"}>
            {Object.keys(BRAILLE_SYSTEMS).map(lang =>
                <div key={lang}>{Object.keys(BRAILLE_SYSTEMS[lang]).map(system =>
                    <Checkbox onChange={() => toggleSystem(dispatch, lang + ':' + system)}
                        key={system}
                        name={'system-toggle-' + system}
                        value={catalogue.filterSystem.includes(lang + ':' + system)}
                        label={'catalogue:' + system} />
                )}</div>
            )}

        </div>
        <br />

        <TagList />
    </TagSidebar>

    return (
        <>
            <Row>
                <div className={"col-xs-12 col-md-8 col-md-offset-2"}>
                    <h1>{t('catalogue:heading')}</h1>
                </div>
            </Row>

            {breakpoints.md ?
                <>
                    <Row>
                        <div className={"col-md-6 col-md-offset-2 extra-margin double"}>
                            <Searchbar />
                        </div>
                    </Row>
                    <Row>
                        <div className={"col-md-2"}>
                            {tagSidebar}
                        </div>
                        <div className={"col-md-10"}>
                            <CatalogueItemList graphics={catalogue.graphics} />
                        </div>
                    </Row>
                </>

                : <>
                    <Row>
                        <SearchFilterBar className={"col-xs-12"}>
                            <Searchbar />
                            &emsp;
                            <FlyoutButton closeButton={true} label={"catalogue:filter"}>
                                {tagSidebar}
                            </FlyoutButton>
                        </SearchFilterBar>
                    </Row>
                    <Row>
                        <div className={"col-xs-12"}>
                            <CatalogueItemList graphics={catalogue.graphics} />
                        </div>
                    </Row>
                </>
            }

            {!!graphicId &&
                <Modal title={graphicOverview && graphicOverview.title} noPadding={true} fitted
                    dismiss={() => navigate("/catalogue")}>

                    <CatalogueItemView variantsOverview={graphicOverview.variants || []} />

                </Modal>}
        </>
    )
};

export default Catalogue;