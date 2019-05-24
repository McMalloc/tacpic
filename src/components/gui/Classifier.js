import styled from 'styled-components';
import React, {Component, Fragment} from "react";
import {p} from 'styled-components-spacing';
import {Tile} from "./Tile";
import {Button} from "./Button";
import {Row} from "./Grid";
import {find, includes, findIndex} from 'lodash';

import {withTranslation} from "react-i18next";
import {Icon} from "./_Icon";


const Container = styled.div`
  // background-color: ${props => props.theme.accent_1_light};
`;

const Tipp = styled.p`

`;

const Query = styled.p`

`;

class Classifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: [] // selected categories
        };
    }

    back = (catId) => {
        console.log(catId);
        let newProgress = this.state.progress;
        let index = findIndex(newProgress, cat => cat === catId);
        this.setState({
            progress: newProgress.slice(0, index)
        })
    };

    progress = (catId) => {
        let newProgress = this.state.progress;
        newProgress.push(catId);
        this.setState({
            progress: newProgress
        })
    };

    renderQuery = query => (
        <Row padded={4}>
            <div className={"col-xs-offset-4 col-md-offset-3 col-xs-8 col-md-9"}>
                <Query>→ {query || "...?"}</Query>
            </div>
        </Row>
    );

    renderSubCategories = step => (
        <Row padded={4}>
            {this.props.categories
                .filter(cat => {
                    if (typeof cat.sub_of === 'object') {
                        return includes(cat.sub_of, step);
                    } else {
                        return cat.sub_of === step
                    }
                })
                .map(cat => {
                    return (<div className={"col-sm-3"}>
                        <Tile
                            onClick={() => this.progress(cat.id)}
                            title={cat.title} imgUrl={cat.imgUrl}/>
                    </div>)
                })
            }
        </Row>
    );

    renderInitialSelection = () => (
        <Row padded={3}>
            {this.props.categories.map((cat, index) => {
                if (cat.sub_of < 0) {
                    return (
                        <div className={"col-sm-3"}>
                            <Tile title={this.props.t("categories:" + cat.title)}
                                  onClick={() => this.progress(cat.id)}
                                  imgUrl={cat.imgUrl}/>
                        </div>
                    )
                }
            })}
        </Row>
    );

    renderDetails = category => (
        <Row padded={4}>
            <div className={"col-sm-3"}>
                <Tile title={this.props.t("categories:" + category.title)}
                      onClick={() => this.back(category.id)}
                      imgUrl={category.imgUrl}/>
                <p><Button
                    onClick={() => this.back(category.id)}
                    fullWidth
                    icon={"arrow-up"}>
                    Ändern
                </Button></p>
            </div>
            <div className={"col-sm-8"}>
                <Tipp>{category.description}</Tipp>
                <strong>Tipps und Richtlinien</strong>
                <ul>
                    {category.guides.map(guide => {
                        return <li>{guide}</li>
                    })}
                </ul>
            </div>
        </Row>
    );

    render() {
        return (
            <Container>
                {this.state.progress.length === 0 && this.renderInitialSelection()}
                {this.state.progress.map(step => {
                    let category = find(this.props.categories, {id: step});
                    return (
                        <section>
                            {this.renderDetails(category)}
                            <hr />
                            {this.state.progress[this.state.progress.length - 1] === step && (
                                <Fragment>
                                    {this.renderQuery(category.query)}

                                    {this.renderSubCategories(step)}
                                    </Fragment>
                            )}
                        </section>
                    )
                })}
            </Container>
        )
    }
}

export default withTranslation()(Classifier)