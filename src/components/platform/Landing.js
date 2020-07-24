import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from "react-redux";
import styled from "styled-components/macro";
import Searchbar from "./Searchbar";
import {Button} from "../gui/Button";
import {useHistory} from "react-router";
import CenterWrapper from "../gui/_CenterWrapper";

const Form = styled.div`
  //width: 500px;
  box-sizing: border-box;
  //max-width: 100%;
  padding: ${props=>props.theme.large_padding};
`;

const BigLogo = styled.img`
  width: 300px;
`;

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center";

const Landing = () => {
    const t = useTranslation().t;

    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <div className={layout}>
            <Form>
                <div>
                    <BigLogo src={"/images/logo.svg"} alt={"tapic Logo"} />
                </div>

                <Searchbar/>
<br /><br /><br />
                <div style={{marginBottom: "50%"}}>
                    <Button onClick={event => {
                        history.push("/catalogue");
                    }}>{t("catalogue:grub")}</Button>&ensp;
                    <Button onClick={event => {
                        event.preventDefault();
                        history.push("/editor/new");
                    }}>{t("catalogue:create")}</Button>
                </div>
            </Form>


        </div>
    );
};

export default Landing;