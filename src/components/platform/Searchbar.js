import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {Textinput} from "../gui/Input";
import {Button} from "../gui/Button";
import {useNavigate, useLocation} from "react-router-dom";
import styled from 'styled-components/macro';

const Bar = styled.form`
  display: flex;
  width: 100%;
  align-items: flex-end;
  text-align: left;
  justify-content: center;
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

    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState(catalogue.filterTerms);

    return (
            <Bar>
                <Textinput value={searchTerm}
                           name={"search-bar"}
                           style={{margin: 0, flex: "1 0 auto"}}
                           label={t("catalogue:searchterm")}
                           onChange={event => setSearchTerm(event.target.value)}
                           externalLabel={"search-bar-label"}
                           placeholder={t("catalogue:search-placeholder")}
                />
                <Button
                    onClick={event => {
                        event.preventDefault();
                        searchChanged(dispatch, searchTerm);
                        if (location.pathname !== "/catalogue") {
                            navigate("catalogue");
                        }
                    }}
                    icon={"search"}
                    id={"catalogue-search-btn"}
                    // disabled={catalogue.filterTerms === searchTerm}
                    type={"submit"} primary>
                    {t("catalogue:search")}
                </Button>
            </Bar>
    );
};

export default Searchbar;