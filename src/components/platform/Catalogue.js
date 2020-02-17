import React, {Component} from 'react';
import {connect} from "react-redux";
import {CATALOGUE, VARIANT, VERSION} from "../../actions/constants";
import {Button} from "./../gui/Button";
import CatalogueItem from "./CatalogueItem";
import {Modal} from "../gui/Modal";
import {Link, Redirect, Route, useRouteMatch} from "react-router-dom";
import CatalogueItemList from "./CatalogueItemList";

class Catalogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectedGraphicIndex: null,
            selectedVariantIndex: 0
        };

        if (props.private) {
            this.props.getVersions();
        } else {
            this.props.queryGraphics();
            this.props.queryTags();
        }
    }

    handleChange = (event) => {
        switch (event.target.name) {
            case 'searchTerm':
                this.setState({
                    searchTermField: {
                        value: event.target.value
                    }
                });
                break;
            default:
                break;
        }
    };

    handleClickOnGraphic = index => {
        this.setState({
            selectedGraphicIndex: index
        });
    };

    handleClickOnVariant = index => {
        this.setState({
            selectedVariantIndex: index
        });
    };

    handleModalClose = () => {
        this.setState({
            selectedGraphicIndex: null,
            selectedVariantIndex: 0
        });
    };

    editVariant = id => {
        this.setState({
            redirect: true
        });
        this.props.editVariant(id);
    };

    handleNewGraphic = () => {
        this.setState({
            redirect: true
        });
        this.props.newGraphic();
    };

    render() {
        if (this.state.redirect) {
            return <Redirect push to="/editor/new"/>;
        }

        return (
            <>
                {/*<input value={this.state.searchTermField.value} onChange={this.handleChange} name={'searchTerm'}/>*/}
                <h1>Grafiken</h1>

                <CatalogueItemList graphics={this.props.graphics} />

                <Button icon={"plus"} onClick={this.handleNewGraphic}>Neue Grafik</Button>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.catalogue
    }
};

const mapDispatchToProps = dispatch => {
    return {
        queryGraphics: (tags = [], terms = [], limit = 20, offset = 0) => {
            return dispatch({
                type: CATALOGUE.SEARCH.REQUEST,
                payload: {
                    tags,
                    terms,
                    limit,
                    offset,
                    order: {
                        by: "date",
                        desc: false
                    }
                }
            })
        },
        changeLimit: limit => {
            return dispatch({
                type: "CATALOGUE_LIMIT_CHANGE", // DOMAIN_VARIABLE_EVENT
                limit
            })
        },
        getVersions: () => {
            return dispatch({
                type: VERSION.GET.REQUEST
            })
        },
        changeOffset: offset => {
            return dispatch({
                type: "CATALOGUE_OFFSET_CHANGE",
                offset
            })
        },
        queryTags: () => {
            // return dispatch({
            //
            // })
        },
        newGraphic: () => {
            dispatch({
                type: "NEW_GRAPHIC_STARTED"
            })
        },
        editVariant: id => {
            dispatch({
                type: VARIANT.GET.REQUEST,
                payload: {id}
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);