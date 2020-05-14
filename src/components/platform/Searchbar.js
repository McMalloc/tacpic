import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {Textinput} from "../gui/Input";
import {Button} from "../gui/Button";
import {useHistory, useLocation} from "react-router";
import styled from 'styled-components';

const Bar = styled.form`
  display: flex;
  width: 100%;
`;

const Label = styled.label`
  display: flex;
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

    const history = useHistory();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState(catalogue.filterTerms);

    return (
        <div style={{textAlign: "left"}}>
            <label for={"label-for-search-bar"} id={"label-for-search-bar"}>
                {t("catalogue:searchterm")}
            </label>
            <Bar>
                <Textinput value={searchTerm}
                           name={"search-bar"}
                           noMargin
                           onChange={event => setSearchTerm(event.target.value)}
                           externalLabel={"search-bar-label"}
                           placeholder={t("catalogue:search-placeholder")}
                />
                &ensp;
                <Button
                    onClick={event => {
                        event.preventDefault();
                        searchChanged(dispatch, searchTerm);
                        if (location.pathname !== "/catalogue") {
                            history.push("catalogue");
                        }
                    }}
                    icon={"search"}
                    // disabled={catalogue.filterTerms === searchTerm}
                    type={"submit"} primary>
                    {t("catalogue:search")}
                </Button>
            </Bar>
        </div>
    );
};

export default Searchbar;