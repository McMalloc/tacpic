import React from "react";
import {useHistory, useParams, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {VARIANT, FILE} from "../../actions/constants";

const VariantView = props => {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { path, url } = useRouteMatch();
    const history = useHistory();
    let {graphicId, variantId} = useParams();
    let variant = props.variants.find(variant => variant.id == variantId);
    const dispatch = useDispatch();

    return (
        <div style={{border: "2px solid green", margin: 5, padding: 3}}>
            {variant.title}
            <Button onClick={() => {
                history.push(`/editor/${graphicId}/variants/${variantId}`);
                dispatch({
                    type: FILE.OPEN.REQUEST,
                    id: variant.id, mode: "edit"
                })
            }}>
                Bearbeiten</Button>
            <Button onClick={() => {
                history.push(`/editor/${graphicId}/variants/${variantId}`);
                dispatch({
                    type: FILE.OPEN.REQUEST,
                    id: variant.id, mode: "new"
                })
            }}>Neue Variante aus dieser</Button>

            <Button onClick={() => {
                window.location = 'http://localhost:9292/variants/' + variantId + '/pdf';
            }}>
                Herunterladen</Button>

            <img
                style={{width:200,height:'auto'}}
                src={"http://localhost:9292/static/thumbnails/thumbnail-" + variantId + "-xl.png"}/>
        </div>
    );
};

export default VariantView;