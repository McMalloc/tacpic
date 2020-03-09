import React, {useState} from "react";
import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router";
import CatalogueItem, {Wrapper as CatalogueItemWrapper} from "./CatalogueItem";
import {CatalogueItemViewModal} from "./CatalogueItemView";
import styled from "styled-components";
import {Button} from "../gui/Button";
import {useDispatch} from "react-redux";
import {Redirect} from "react-router-dom";

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
`;

const handleNewGraphic = (dispatch, doRedirect) => {
    doRedirect(true);
    dispatch({
        type: "NEW_GRAPHIC_STARTED"
    });
};

const CatalogueItemList = props => {
    let {path, url} = useRouteMatch();
    const history = useHistory();
    const dispatch = useDispatch();
    const [redirect, doRedirect] = useState(false);

    function handleClick() {
        history.push(url);
    }

    if (redirect) {
        return <Redirect push to="/editor/new"/>;
    }

    // TODO hier in der Componente Viewportbreite abfragen und davon abhängig,
    //  auf wieviele Spalten die Grafiken verteilt werden

    return (
        <>
            <FlexRow>
                {props.graphics && props.graphics.map((graphic, index) => {
                    return (
                        <CatalogueItem key={index} {...graphic}
                                       url={`${url}/${graphic.id}/variant/${graphic.variants[0].id}`}/>
                    )
                })}
                <CatalogueItemWrapper style={{padding: '48px'}}>
                    <Button
                        style={{width: '100%', height: '80%'}}
                        icon={"plus"}
                        onClick={() => handleNewGraphic(dispatch, doRedirect)}>Neue Grafik</Button>
                </CatalogueItemWrapper>

            </FlexRow>
            <Switch>
                <Route path={`${path}/:graphicId`}>
                    <CatalogueItemViewModal dismiss={handleClick} graphics={props.graphics}/>
                </Route>
            </Switch>
        </>

    );
};

export default CatalogueItemList;