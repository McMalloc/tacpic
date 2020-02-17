import React from "react";
import {Route, Switch, useParams, useRouteMatch} from "react-router";
import {Modal} from "../gui/Modal";
import {Link} from "react-router-dom";
import VariantView from "./VariantView";
import {Button} from "../gui/Button";

const CatalogueItemViewModal = props => {
    let { graphicId } = useParams();
    const graphic = props.graphics.find(g => g.id === graphicId);
    if (!graphic) return null;

    return (
        <Modal title={graphic.title} dismiss={props.dismiss}
               actions={[
                   {
                       label: "Ok",
                       template: "primary",
                       align: "right",
                       action: props.dismiss
                   }, {label: "Abbrechen"}
               ]}>
            <CatalogueItemView {...graphic}/>
        </Modal>
    )
};

const CatalogueItemView = props => {
    let { path, url } = useRouteMatch();
    return (
        <div>
            <ul>
                {props.variants.map((variant, index) => {
                    return (
                        <Link key={index} to={`${url}/variant/${variant.id}`}>
                            <li>{variant.title} ({variant.id})</li>
                        </Link>
                    )
                })}
            </ul>

            <Switch>
                <Route path={`${path}/variant/:variantId`}>
                    <VariantView {...props}/>
                </Route>
            </Switch>
        </div>
    );
};

export {CatalogueItemView, CatalogueItemViewModal};