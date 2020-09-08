import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from "react-redux";
import styled from "styled-components/macro";
import Searchbar from "./Searchbar";
import {Button} from "../gui/Button";
import {useNavigate} from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import {FILE} from "../../actions/action_constants";
import {Row} from "../gui/Grid";

const Form = styled.div`
  //width: 500px;
  box-sizing: border-box;
  //max-width: 100%;
  padding: ${props => props.theme.large_padding};
`;

const BigLogo = styled.img`
  width: 300px;
`;

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center";

const Landing = () => {
    const t = useTranslation().t;
    const navigate = useNavigate();

    return (
        <>
            <Row>
                <div className={layout}>
                    <Form>
                        <div>
                            <BigLogo src={"/images/logo.svg"} alt={"tapic Logo"}/>
                        </div>

                        <Searchbar/>
                        <br/><br/><br/>
                        <div style={{marginBottom: "50%"}}>
                            <Button onClick={() => {
                                navigate("/catalogue");
                            }}>{t("catalogue:grub")}</Button>&ensp;
                            <Button onClick={() => {
                                navigate("/editor/new");
                            }}>{t("catalogue:create")}</Button>
                        </div>
                    </Form>
                </div>
            </Row>
            {/*<Row>*/}
            {/*    <div className={"col-md-4"}>*/}
            {/*        <img src={"/images/200902_Konzept-02.svg"}/>*/}
            {/*    </div>*/}
            {/*    <div className={"col-md-4"}>*/}
            {/*        <img src={"/images/200902_Konzept-03.svg"}/>*/}
            {/*    </div>*/}
            {/*    <div className={"col-md-4"}>*/}
            {/*        <img src={"/images/200902_Konzept-04.svg"}/>*/}
            {/*    </div>*/}
            {/*</Row>*/}
        </>

    );
};

export default Landing;