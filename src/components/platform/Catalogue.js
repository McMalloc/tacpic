import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {CATALOGUE} from "../../actions/constants";
import CatalogueItemList from "./CatalogueItemList";
import {Textinput} from "../gui/Input";
import TagList from "./TagList";
import {Row} from "../gui/Grid";

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

    useEffect(() => {
        queryGraphics(dispatch);
    }, []);

    return (
        <div className={"container container-fluid"} style={{width: '100%'}}>
            <Row>
                <div className={"col-xs-10 col-xs-offset-2"}>
                    <h1>Katalog</h1>
                </div>
            </Row>
            <Row>
                <div className={"col-xs-10 col-xs-offset-2"}>
                    <Textinput value={catalogue.searchTerms}
                               label={"Suche"}
                               onChange={event => searchChanged(dispatch, event.target.value)} />
                </div>
            </Row>
            <Row>
                <div className={"col-xs-2 col-lg-1"}>
                    <TagList/>
                </div>
                <div className={"col-xs-10 col-lg-11"}>
                    <CatalogueItemList graphics={catalogue.graphics}/>
                </div>
            </Row>
            {/*<Select value={catalogue.searchTerms}*/}
            {/*        isMulti*/}
            {/*        options={catalogue.tags.map(tag => ({label: tag.name, value: tag.tag_id}))}*/}
            {/*        onChange={event => searchChanged(dispatch, event.target.value)}*/}
            {/*/>*/}

        </div>
    )
};

export default Catalogue;