import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {CATALOGUE, TAGS} from "../../actions/constants";
import CatalogueItemList from "./CatalogueItemList";
import {Textinput} from "../gui/Input";
import TagList from "./TagList";
import {Row} from "../gui/Grid";
import Tag from "./Tag";
import {Checkbox} from "../gui/Checkbox";
import Searchbar from "./Searchbar";

const queryGraphics = (dispatch, tags = [], terms = [], format = [], system = [], limit = 50, offset = 0) => {
    dispatch({
        type: CATALOGUE.SEARCH.REQUEST,
        payload: {
            tags,
            terms,
            format,
            system,
            limit,
            offset,
            order_by: "date",
            order_desc: false
        }
    })
};

const toggleFormat = (dispatch, format) => {
    dispatch({
        type: 'FORMAT_TOGGLED',
        format
    })
};
const toggleSystem = (dispatch, system) => {
    dispatch({
        type: 'SYSTEM_TOGGLED',
        system
    })
};

const Catalogue = props => {
    const catalogue = useSelector(
        state => state.catalogue
    );
    const dispatch = useDispatch();

    useEffect(() => {
        // TODO default to saved state
        !catalogue.searchPending && queryGraphics(dispatch);
        dispatch({
            type: TAGS.GET.REQUEST,
            payload: {limit: 30}
        })
    }, []);

    return (
        <div className={"container container-fluid"} style={{width: '100%'}}>
            <Row>
                <div className={"col-xs-10 col-xs-offset-2"}>
                    <h1>Katalog</h1>
                </div>
            </Row>
            <Row style={{marginBottom: 24}}>
                <div className={"col-xs-10 col-xs-offset-2"}>
                    <Searchbar />
                </div>
            </Row>
            <Row>
                <div className={"col-xs-2 col-lg-2"}>
                    <div>
                        <strong>Format</strong>
                                <Checkbox onChange={event => toggleFormat(dispatch, 'a4')}
                                          name={'format-toggle-a4'}
                                          checked={catalogue.filterFormat.includes('a4')}
                                          label={'DIN A4'}/>
                                <Checkbox onChange={event => toggleFormat(dispatch, 'a3')}
                                          name={'format-toggle-a3'}
                                          checked={catalogue.filterFormat.includes('a3')}
                                          label={'DIN A3'}/>
                    </div>
                    <div>
                        <strong>Schriftsystem</strong>
                                <Checkbox onChange={() => toggleSystem(dispatch, 'de-de-g0.utb')}
                                          name={'system-toggle-de-de-g0.utb'}
                                          checked={catalogue.filterSystem.includes('de-de-g0.utb')}
                                          label={'Vollschrift'}/>
                                <Checkbox onChange={() => toggleSystem(dispatch, 'de-de-g1.ctb')}
                                          name={'system-toggle-de-de-g1.ctb'}
                                          checked={catalogue.filterSystem.includes('de-de-g1.ctb')}
                                          label={'Langschrift'}/>
                                <Checkbox onChange={() => toggleSystem(dispatch, 'de-de-g2.ctb')}
                                          name={'system-toggle-de-de-g2.ctb'}
                                          checked={catalogue.filterSystem.includes('de-de-g2.ctb')}
                                          label={'Kurzschrift'}/>
                    </div>

                    <TagList/>
                </div>
                <div className={"col-xs-10 col-lg-10"}>
                    <CatalogueItemList graphics={catalogue.graphics}/>
                </div>
            </Row>

        </div>
    )
};

export default Catalogue;