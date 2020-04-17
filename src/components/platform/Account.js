import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import {USER} from "../../actions/constants";
import Card from "../gui/Card";
import {Button} from "../gui/Button";
import Login from "../Login";
import Editor from "../editor/Editor";
import Catalogue from "./Catalogue";
import SignupForm from "../SignupForm";
import Landing from "./Landing";

const Account = props => {
    const user = useSelector(
        state => state.user
    );
    const dispatch = useDispatch();

    if (!user.logged_in) {
        return <Redirect push to="/login"/>;
    }

    const menues = [
        // {key: "my_lists", icon: "list"},
        // {key: "my_sub", icon: "retweet"},
        // {key: "my_adresses", icon: "map-marked"},
        {key: "my_account", icon: "user"},
        // {key: "my_orders", icon: "shopping-basket"},
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
                <Button onClick={event => {dispatch({type: USER.LOGOUT.REQUEST})}}>
                    Ausloggen
                </Button>
            </div>
        </div>
    </>;

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-md-12"}>
                    <h1>Mein Konto</h1>
                </div>
            </div>

            <Switch>
                <Route path="/account" exact render={() => home}/>
                {/*<Route path="/account/my_lists" component={}/>*/}
            </Switch>



        </div>

    );
};

export default Account;