import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { CMS_CATEGORY, CMS_PAGE } from "../../actions/action_constants";
import ContentPage from "../gui/ContentPage";
import {Alert} from "../gui/Alert";
import ContentIndex from "../gui/ContentIndex";
import Loader from "../gui/Loader";
import { useTranslation } from "react-i18next";
import { FlyoutButton } from "../gui/FlyoutButton";
import { useBreakpoint } from "../../contexts/breakpoints";
import i18n from 'i18next';
import styled from "styled-components";

const fetchPages = (category, dispatch) => {
  !category.pages && dispatch({
    type: CMS_PAGE.INDEX.REQUEST,
    payload: { filterCategory: category.id }
  })
}

const Infotext = styled.div`
  padding: 3rem;
`

const Knowledge = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { catSlug, postSlug } = useParams();
  const { index, successful, hierarchy } = useSelector(state => state.cms.categories);
  const breakpoints = useBreakpoint();

  const category = index.find(cat => cat.slug === catSlug);
  let page = null;
  index.forEach(category => {
    if (!!page) return;
    if (postSlug) {
      page = category.pages?.find(p => p.slug === postSlug)
    }
  })

  useEffect(() => {
    index.length === 0 && dispatch({
      type: CMS_CATEGORY.INDEX.REQUEST
    })
  }, [])

  useEffect(() => {
    if (!postSlug) {
      fetch(`/api/cms/posts?slug=${props.category}_introduction`).then(response => page = response)
    }
    if (!category) return;
    fetchPages(category, dispatch)
    document.title = t('knowledge:heading') + ': ' + category.name + ' | tacpic';
  }, [catSlug, index.length])

  if (!successful) return <Loader />

  // TODO Dokumententitel

  const parentCategory = hierarchy.find(cat => cat.slug === props.category);
  const contentIndex = <ContentIndex
    hierarchy={!!parentCategory ? parentCategory.children : null}
    active={catSlug}
    parentIndex={props.category}
    onCategoryClick={(category) => fetchPages(category, dispatch)}
    index={index}
    aria-landmark={'complementary'} />

  return <>
    <div className='row'>
      <div className={'col-md-3 col-xs-12'} style={{ paddingTop: 120 }}>
        <div style={{ position: 'sticky', top: 0 }}>
          {breakpoints.md ?
            <>
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
        {page ?
          <ContentPage {...page} />
          :
          i18n.language === 'de' ? <Infotext>
            {t('knowledge:introduction')}
            {/* {t(props.category + ':introduction')} */}
          </Infotext> : <Infotext>
            <Alert info>{t('knowledge:notAvailable')}</Alert>
          </Infotext>
        }
      </div>
    </div>
  </>
    ;
};

export default Knowledge;