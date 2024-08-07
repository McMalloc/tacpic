import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { Textinput } from "../gui/Input";
import { Button } from "../gui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components/macro';
import {useMatomo} from "@datapunt/matomo-tracker-react";

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

const searchChanged = (dispatch, value) => {
    dispatch({
        type: 'SEARCH_CHANGED',
        value
    })
};

const Searchbar = () => {
    const t = useTranslation().t;
    const catalogue = useSelector(
        state => state.catalogue
    );
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    const { trackPageView, trackEvent } = useMatomo()

    const [searchTerm, setSearchTerm] = useState(catalogue.filterTerms);

    return (
        <Bar role={'search'}>
            <Textinput value={searchTerm}
                name={"search-bar"}
                className={"attached"}
                noMargin
                type={'search'}
                style={{ width: '100%' }}
                label={t('landing:searchNow')}
                onChange={event => {
                    setSearchTerm(event.target.value)
                    if (event.target.value.trim().length === 0) searchChanged(dispatch, "")
                }}
                externalLabel={"search-bar-label"}
                placeholder={t("catalogue:search-placeholder")}
            />
            <Button
                onClick={event => {
                    event.preventDefault();
                    trackEvent({category: 'catalogue', action: 'search', name: searchTerm});
                    searchChanged(dispatch, searchTerm);
                    if (location.pathname !== "/catalogue") {
                        navigate("catalogue");
                    }
                }}
                className={"right-attached"}
                label={""}
                icon={"search"}
                collapsable={'sm'}
                id={"catalogue-search-btn"}
                // disabled={catalogue.filterTerms === searchTerm}
                type={"submit"} primary>
                {t("catalogue:search")}
            </Button>
        </Bar>
    );
};

export default Searchbar;