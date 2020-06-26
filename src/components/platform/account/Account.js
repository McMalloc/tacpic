import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import {USER} from "../../../actions/action_constants";
import Card from "../../gui/Card";
import {Button} from "../../gui/Button";
import Addresses from "./Addresses";
import {Footer} from "../Footer";
import {useLocation} from "react-router";

const Account = props => {
    const user = useSelector(
        state => state.user
    );
    const dispatch = useDispatch();

    // if (!user.logged_in) {
    //     return <Redirect push to="/login"/>;
    // }

    let location = useLocation();
    console.log(location);

    const menues = [
        // {key: "my_lists", icon: "list"},
        // {key: "my_sub", icon: "retweet"},
        {key: "addresses", icon: "map-marked"},
        {key: "my_account", icon: "user"},
        {key: "orders", icon: "shopping-basket"},
        // {key: "my_payment_options", icon: "credit-card"}
    ];

    const home = <>
        <div className={"row"}>
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
        </div>
        <div className={"row"}>
            <div className={"col-sm-12"} style={{textAlign: "center"}}>
                <Button onClick={event => dispatch({type: USER.LOGOUT.REQUEST})}>
                    Ausloggen
                </Button>
            </div>
        </div>
    </>;

    return (
        <>
            {!user.logged_in ?
                // <Alert info>Nicht eingeloggt.</Alert>
                null
                :
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-md-12"}>
                            <h1>Mein Konto</h1>
                        </div>
                    </div>

                    <Switch>
                        <Route exact path="/account" render={() => home}/>
                        <Route path="/account/orders" render={() => <span>hii</span>}/>
                        <Route path="/account/addresses" component={Addresses}/>
                    </Switch>
                </div>
            }
        </>
    );
};

export default Account;