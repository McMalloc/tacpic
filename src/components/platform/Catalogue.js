import React, {Component} from 'react';
import {connect} from "react-redux";
import {CATALOGUE} from "../../actions/constants";
import {Button} from "./../gui/Button";

class Catalogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unameField: {
                value: ''
            },
            pwdField: {
                value: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.props.queryGraphics();
        this.props.queryTags();
    }

    handleChange(event) {
        switch (event.target.name) {
            case 'searchTerm':
                this.setState({
                    searchTermField: {
                        value: event.target.value
                    }
                });
                break;
            default: break;
        }
    }

    render() {
        return (
            <React.Fragment>
                {/*<input value={this.state.searchTermField.value} onChange={this.handleChange} name={'searchTerm'}/>*/}
                {/*<Button onClick={this.props.createVersion}>Post version</Button>*/}
                <h1>Grafiken</h1>
                {this.props.graphics.map(graphic => {
                   return <p>
                       {graphic.id}: {graphic.title} ({graphic.variants_count} Varianten)
                   </p>
                })}
                <p>Zeige {this.props.limit} Grafiken</p>
            </React.Fragment>
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
        // createVersion: () => {
        //     return dispatch({
        //         type: VERSION.CREATE.REQUEST,
        //         payload: {
        //             title: "Grafik",
        //             document: "<svg />"
        //         }});
        // }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);