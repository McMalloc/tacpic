import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { CMS_CATEGORY, CMS_PAGE, CMS_SEARCH, CMS_SEARCH_CLEAR } from "../../actions/action_constants";
import ContentPage from "../gui/ContentPage";
import { Alert } from "../gui/Alert";
import ContentIndex from "../gui/ContentIndex";
import Loader from "../gui/Loader";
import { Textinput } from "../gui/Input";
import { Button } from "../gui/Button";
import { useTranslation } from "react-i18next";
import { FlyoutButton } from "../gui/FlyoutButton";
import { useBreakpoint } from "../../contexts/breakpoints";
import styled from "styled-components";
import { Icon } from "../gui/_Icon";

const Bar = styled.form`
  display: flex;
  width: 100%;
  align-items: flex-end;
  text-align: left;
  justify-content: space-between;

  button {
      border-left: none;
  }
`;

const Knowledge = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { catSlug, postSlug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { index, successful, hierarchy } = useSelector(state => state.cms.categories);
  const { pages } = useSelector(state => state.cms);
  const breakpoints = useBreakpoint();
  const searchResults = useSelector(state => state.cms.searchResults);
  const searchSuccessfull = useSelector(state => state.cms.searchSuccessfull);
  const searchPending = useSelector(state => state.cms.searchPending);

  const category = index.find(cat => cat.slug === catSlug);

  let page = pages.find(p => {
    if (postSlug) return p.slug === postSlug;
    return p.slug === `${props.category}_introduction`
  });

  useEffect(() => {
    index.length === 0 && dispatch({
      type: CMS_CATEGORY.INDEX.REQUEST
    })
    index.length <= 1 && dispatch({
      type: CMS_PAGE.INDEX.REQUEST
    })
  }, [])

  useEffect(() => {
    if (postSlug) {
      dispatch({
        type: CMS_PAGE.GET.REQUEST, payload: { slug: postSlug }
      })
    } else {
      const introPage = pages.find(p => {
        return p.slug === `${props.category}_introduction`
      });
      if (!introPage?.content) dispatch({
        type: CMS_PAGE.GET.REQUEST, payload: { slug: `${props.category}_introduction` }
      })
    }

    document.title = t('knowledge:heading') + ': ' + category?.name + ' | tacpic';
  }, [postSlug, props.category])

  useEffect(() => {
    dispatch({
      type: CMS_SEARCH_CLEAR
    })
  }, [props.category])

  // get the main category
  const parentCategory = hierarchy.find(cat => cat.slug === props.category);

  const contentIndex = <ContentIndex
    hierarchy={!!parentCategory ? parentCategory.children : null}
    active={catSlug}
    onTitleClick={id => dispatch({
      type: CMS_PAGE.GET.REQUEST, id
    })}
    pages={pages}
    parentIndex={props.category}
    aria-landmark={'complementary'} />

  return <>
    <div className='row'>
      <div className={'col-md-3 col-xs-12'} style={{ paddingTop: 120 }}>
        <div style={{ position: 'sticky', top: 0 }}>
          {breakpoints.md ?
            <>
              <Bar onSubmit={event => {
                dispatch({
                  type: CMS_SEARCH.GET.REQUEST,
                  payload: { searchTerm }
                })
                event.preventDefault()
              }} role={'search'}>
                <Textinput
                  name={"search-bar"}
                  className={"attached extra-margin"}
                  onSearch={event => console.log(event)}
                  noMargin
                  type={'search'}
                  style={{ width: '100%' }}
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  externalLabel={"search-bar-label"}
                  placeholder={t("knowledge:search-placeholder")}
                />
                <Button
                  className={"right-attached"}
                  label={""}
                  type={'submit'}
                  icon={"search"}
                  collapsable={'sm'}
                  title={"catalogue:search"}
                  id={"cms-search-btn"}>
                </Button>
              </Bar>
              {searchSuccessfull && <>
                <h2 style={{ fontSize: '1rem', opacity: 0.8 }}>{t('knowledge:searchResults')}</h2>
                {searchResults.length > 0 && <ContentIndex
                  searchResults={searchResults} />
                }
                {searchResults.length === 0 &&
                  <p style={{ fontSize: '0.9rem' }}>&empty; {t('knowledge:noResults')}</p>
                }
                <Button
                  small
                  icon={'broom'}
                  label={'knowledge:searchClear'}
                  onClick={() => {
                    setSearchTerm('');
                    dispatch({ type: CMS_SEARCH_CLEAR });
                  }}></Button>
                <div className="extra-margin" />
              </>}
              {searchPending && <Loader frugal />}
              <h2 style={{ fontSize: '1rem', opacity: 0.8 }}>{t('knowledge:topics')}</h2>
              {contentIndex}
            </>
            :
            <FlyoutButton closeButton={true} label={"knowledge:topics"}>
              {contentIndex}
            </FlyoutButton>
          }
        </div>
      </div>
      <div className={'col-md-9 col-xs-12'}>
        {page && <ContentPage {...page} />}
      </div>
    </div>
  </>
    ;
};

export default Knowledge;