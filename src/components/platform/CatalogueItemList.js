import React from "react";
import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router";
import CatalogueItem from "./CatalogueItem";
import {CatalogueItemViewModal} from "./CatalogueItemView";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CatalogueItemList = props => {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { path, url } = useRouteMatch();
    const history = useHistory();

    function handleClick() { history.push(url); }

    return (
        <>
            <Wrapper>
                {props.graphics && props.graphics.map((graphic, index) => {
                    return (
                        <CatalogueItem key={index} url={`${url}/${graphic.id}/variant/${graphic.variants[0].id}`} {...graphic}/>
                    )
                })}
            </Wrapper>
            <Switch>
                <Route path={`${path}/:graphicId`}>
                    <CatalogueItemViewModal dismiss={handleClick} graphics={props.graphics}/>
                </Route>
            </Switch>
        </>

    );
};

export default CatalogueItemList;