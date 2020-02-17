import React from "react";
import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router";
import {Link} from "react-router-dom";
import CatalogueItem from "./CatalogueItem";
import {Button} from "../gui/Button";
import {Modal} from "../gui/Modal";
import CatalogueItemView, {CatalogueItemViewModal} from "./CatalogueItemView";

const CatalogueItemList = props => {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { path, url } = useRouteMatch();
    const history = useHistory();

    function handleClick() {
        history.push(url);
    }

    return (
        <div>
            {props.graphics.map((graphic, index) => {
                return (
                    <Link key={index} to={`${url}/${graphic.id}`}>
                        <CatalogueItem key={index} {...graphic}/>
                    </Link>
                )
            })}

            <Switch>
                <Route path={`${path}/:graphicId`}>
                    <CatalogueItemViewModal dismiss={handleClick} graphics={props.graphics}/>
                </Route>
            </Switch>

        </div>
    );
};

export default CatalogueItemList;