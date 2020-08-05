import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import {USER} from "../../actions/action_constants";
import Card from "../gui/Card";
import {Button} from "../gui/Button";
import Addresses from "./Addresses";
import {Footer} from "./Footer";
import {useLocation} from "react-router";
import {Container, Row} from "../gui/Grid";
import Orders from "./account/Orders";

const Account = props => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    let location = useLocation();

    if (!user.logged_in) {
        // return <Redirect push to="/login"/>;
    }
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
                    <div className={"col-md-4 col-lg-3 col-sm-6 col-xs-12 extra-margin double"}>
                        <Card
                            description={"account:" + menu.key + "-description"}
                            title={"account:" + menu.key} link={menu.key} icon={menu.icon}>
                        </Card>
                    </div>

                )
            })}
        </Row>
        <Row>
            <div className={"col-sm-12"} style={{textAlign: "center"}}>
                <Button onClick={event => dispatch({type: USER.LOGOUT.REQUEST})}>
                    Ausloggen
                </Button>
            </div>
        </Row>
    </>;

    return (
        <>
            {!user.logged_in ?
                // <Alert info>Nicht eingeloggt.</Alert>
                null
                :
                <>
                    <Row>
                        <div className={"col-xs-12"}>
                            <h1>Persönlicher Bereich<Switch>
                                <Route path='/account/addresses'>: Adressen</Route>
                                <Route path='/account/orders'>: Bestellungen</Route>
                            </Switch> </h1>

                        </div>
                    </Row>

                    {/*<Row>*/}
                        <Switch>
                            <Route exact path="/account" render={() => home}/>
                            <Route path="/account/orders" component={Orders}/>
                            <Route path="/account/addresses" component={Addresses}/>
                        </Switch>
                    {/*</Row>*/}
                </>
            }
        </>
    );
};

export default Account;