import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { CMS_CATEGORY, CMS_PAGE } from "../../actions/action_constants";
import ContentPage from "../gui/ContentPage";
import ContentIndex from "../gui/ContentIndex";
import Loader from "../gui/Loader";
import { useTranslation } from "react-i18next";
import { FlyoutButton } from "../gui/FlyoutButton";
import { useBreakpoint } from "../../contexts/breakpoints";

const Knowledge = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { category, postSlug } = useParams();
  const { index, successful, pending, hierarchy } = useSelector(state => state.cms.categories);
  const loadedPages = useSelector(state => state.cms.loadedPages);
  const breakpoints = useBreakpoint();
  const relevantPages = !!category && successful ? loadedPages.pages.filter(
    page => page.categories.includes(index.find(cat => cat.slug === category).id)
  ) : []

  useEffect(() => {
    dispatch({
      type: CMS_CATEGORY.INDEX.REQUEST
    })
  }, [])

  useEffect(() => {
    const cat = index.find(cat => cat.slug === category);
    if (!cat) return;
    dispatch({
      type: CMS_PAGE.INDEX.REQUEST,
      payload: { filterCategory: cat.id }
    })
    document.title = t('knowledge:heading') + ': ' + cat.name + ' | tacpic';
  }, [category, index])

  const knowledgeCat = hierarchy.find(cat => cat.slug === 'wissen');
  if (!successful || !knowledgeCat) return <Loader />

  // TODO Dokumententitel

  const contentIndex = <ContentIndex
    hierarchy={hierarchy.find(cat => cat.slug === 'wissen').children}
    active={category}
    aria-landmark={'complementary'}
    pending={loadedPages.pending}
    pages={relevantPages} />

  const page = relevantPages.find(page => page.slug === postSlug);
  return <div className='row'>
    <div className={'col-md-3 col-xs-12'}>
      <div style={{ position: 'sticky', top: 0 }}>

        {breakpoints.md ?
          <>
            <p>
              <strong>{t('knowledge:topics')}</strong>
            </p>
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
      {!!page &&
        <ContentPage {...page} />
      }
    </div>
  </div>
    ;
};

export default Knowledge;