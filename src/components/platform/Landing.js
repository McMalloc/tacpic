import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from "react-redux";
import styled from "styled-components";
import Searchbar from "./Searchbar";
import {Button} from "../gui/Button";
import {useHistory} from "react-router";

const ScrollContent = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const BigLogo = styled.img`
  width:300px;
`;

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4";


const Landing = () => {
    const t = useTranslation().t;

    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <Wrapper className={layout}>
            <div>
                <BigLogo src={"/images/logo.svg"} alt={"tapic Logo"} />
            </div>

            <Searchbar/>

            <div style={{marginTop: 36}}>
                <Button onClick={event => {
                    history.push("/catalogue");
                }}>{t("catalogue:grub")}</Button>&ensp;
                <Button onClick={event => {
                    event.preventDefault();
                    history.push("/editor/new");
                }}>{t("catalogue:create")}</Button>
            </div>

        </Wrapper>
    );
};

export default Landing;