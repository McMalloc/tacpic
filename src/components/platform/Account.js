import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, Navigate, Route, Routes} from "react-router-dom";
import {USER} from "../../actions/action_constants";
import Card from "../gui/Card";
import {Button} from "../gui/Button";
import Addresses from "./Addresses";
import {Footer} from "./Footer";
import {useLocation} from "react-router-dom";
import {Container, Row} from "../gui/Grid";
import Orders from "./account/Orders";
import AccountInfo from "./account/AccountInfo";
import {Outlet} from "react-router";
import {Alert} from "../gui/Alert";
import {Icon} from "../gui/_Icon";

const Account = props => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    let location = useLocation();

    // if (!user.logged_in) {
    //     return <Navigate push to="/login"/>;
    // }
    const menues = [
        // {key: "my_lists", icon: "list"},
        // {key: "my_sub", icon: "retweet"},
        {key: "addresses", icon: "map-marked"},
        {key: "my_account", icon: "user"},
        {key: "orders", icon: "shopping-basket"},
        // {key: "my_payment_options", icon: "credit-card"}
    ];

    const home = <>
        <Row>
            {menues.map(menu => {
                return (
                    <div key={menu.key} className={"col-md-4 col-lg-3 col-sm-6 col-xs-12 extra-margin double"}>
                        <Card
                            description={"account:" + menu.key + "-description"}
                            title={"account:" + menu.key} link={menu.key} icon={menu.icon}>
                        </Card>
                    </div>

                )
            })}
        </Row>
        <Outlet/>
        <Row>
            <div className={"col-sm-12"} style={{textAlign: "center"}}>
                <Button onClick={event => dispatch({type: USER.LOGOUT.REQUEST})}>
                    Ausloggen
                </Button>
            </div>
        </Row>
    </>;
    console.log(location);
    return (
        <>
            {!user.logged_in ?
                <Alert info>Nicht eingeloggt.</Alert>
                // null
                :
                <>
                    <Row>
                        <div className={"col-xs-12 extra-margin"}>
                            <h4>
                                {location.pathname === '/account' ?
                                    <span>Persönlicher Bereich</span>
                                    :
                                    <Link to={"/account"}>Persönlicher Bereich</Link>
                                }
                                <Routes>
                                    <Route path='addresses' element={<span> <Icon icon={"angle-right"} /> Adressen</span>} />
                                    <Route path='my_account' element={<span> <Icon icon={"angle-right"} /> Mein Konto</span>} />
                                    <Route path='orders' element={<span> <Icon icon={"angle-right"} /> Bestellungen</span>} />
                                </Routes>
                            </h4>

                        </div>
                    </Row>

                    {/*<Row>*/}
                    <Routes>
                        <Route path="" element={home}/>
                        <Route path="orders" element={<Orders/>}/>
                        <Route path="my_account" element={<AccountInfo/>}/>
                        <Route path="addresses" element={<Addresses/>}/>
                    </Routes>
                    {/*</Row>*/}
                </>
            }
        </>
    );
};

export default Account;