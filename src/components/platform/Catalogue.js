import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {CATALOGUE, TAGS, VARIANT, VERSION} from "../../actions/constants";
import {Button} from "./../gui/Button";
import {Redirect} from "react-router-dom";
import CatalogueItemList from "./CatalogueItemList";
import {Textinput} from "../gui/Input";
import TagList from "./TagList";
import Select from "../gui/Select";

const handleNewGraphic = (dispatch, doRedirect) => {
    doRedirect(true);
    dispatch({
        type: "NEW_GRAPHIC_STARTED"
    });
};

const queryGraphics = (dispatch, tags = [], terms = [], limit = 20, offset = 0) => {
    dispatch({
        type: CATALOGUE.SEARCH.REQUEST,
        payload: {
            tags,
            terms,
            limit,
            offset,
            order_by: "date",
            order_desc: false
        }
    })
};

const searchChanged = (dispatch, value) => {
    dispatch({
        type: 'SEARCH_CHANGED',
        value
    })
};

// const handleInputChange = (e) => setFilter({
//     ...input,
//     [e.currentTarget.name]: e.currentTarget.value
// });

const Catalogue = props => {
    const catalogue = useSelector(
        state => state.catalogue
    );
    const dispatch = useDispatch();
    const [redirect, doRedirect] = useState(false);

    useEffect(() => {
        queryGraphics(dispatch);
    }, []);

    const [input, setInput] = useState({});

    if (redirect) {
        return <Redirect push to="/editor/new"/>;
    }

    return (
        <>
            <h1>Grafiken</h1>
            {/*<Select value={catalogue.searchTerms}*/}
            {/*        isMulti*/}
            {/*        options={catalogue.tags.map(tag => ({label: tag.name, value: tag.tag_id}))}*/}
            {/*        onChange={event => searchChanged(dispatch, event.target.value)}*/}
            {/*/>*/}
            <Textinput value={catalogue.searchTerms}
                       onChange={event => searchChanged(dispatch, event.target.value)} />
            <div className={"row"}>
                <div className={"col-xs-3"}>
                    <TagList/>
                </div>
                <div className={"col-xs-9"}>
                    <CatalogueItemList graphics={catalogue.graphics}/>
                    <Button icon={"plus"} onClick={() => handleNewGraphic(dispatch, doRedirect)}>Neue Grafik</Button>
                </div>
            </div>


        </>
    )
};

export default Catalogue;