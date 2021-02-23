import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { CMS_LEGAL } from "../../actions/action_constants";
import ContentPage from "../gui/ContentPage";
import ContentIndex from "../gui/ContentIndex";
import Loader from "../gui/Loader";

const Legal = props => {
  const dispatch = useDispatch();
  const {lang, textId} = useParams();
  const menu = useSelector(state => state.cms.legal.menu)
  const pages = useSelector(state => state.cms.legal.pages)

  useEffect(() => {
    dispatch({
      type: CMS_LEGAL.GET.REQUEST,
      payload: {id: textId}
    })
  }, [textId])

  const currentPage = pages.index.find(page => page.id === parseInt(textId));

  return <div className='row'>
    <div className={'col-md-3 col-xs-12'}>
      <div style={{position: 'sticky', top: 0}}>
      <ContentIndex
        pages={menu}
        articlesOnly />
      </div>
      
    </div>
    <div className={'col-md-9 col-xs-12'}>
      {pages.pending && <Loader />}
      {!!currentPage &&
        <ContentPage noWhistles {...currentPage} />
      }
    </div>
  </div>
    ;
};

export default Legal;