import React from "react";
import {Route, Switch, useParams, useRouteMatch} from "react-router";
import {Modal} from "../gui/Modal";
import {Link} from "react-router-dom";
import VariantView from "./VariantView";

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
            <p>{props.description}</p>
            <ul>
                {props.variants.map((variant, index) => {
                    return (
                        <Link key={index} to={`${url}/variant/${variant.id}`}>
                            <li>{variant.title} ({variant.id})</li>
                            <img
                                style={{width:50,height:'auto', border: '1px solid red'}}
                                src={"http://localhost:9292/static/thumbnails/thumbnail-" + variant.id + "-sm.png"}/>
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