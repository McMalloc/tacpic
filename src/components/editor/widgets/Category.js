import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Classifier from "../../gui/Classifier";
import cats from "../../../content/categories.json";
import {Button} from "../../gui/Button";
import styled from 'styled-components';
import Select from "../../gui/Select";
import Divider from "../../gui/Divider";
import {Row} from "../../gui/Grid"; //TODO aus Datenbank laden

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {assistant: false};
    }

    showAssistent = () => this.setState({assistant: true});
    hideAssistant = () => this.setState({assistant: false});

    render() {
        return (
            <React.Fragment>
                {this.state.assistant ?
                    <Classifier categories={cats}/>
                :
                    <Wrapper>
                        <Row modifier={"center-sm middle-sm"} fullHeight>
                            <div style={{textAlign: "left"}} className={"col-sm-4 col-sm-offset-1"}>
                                <Select placeholder={"editor:placeholder_choose_category"}
                                        label={"editor:label_choose_category"} />
                            </div>
                            <div className={"col-sm-6"}>
                                <Button onClick={this.showAssistent} primary>Hilfe erhalten</Button>
                            </div>

                            {/*<Divider vertical label={"gui:or"} />*/}
                        </Row>
                    </Wrapper>

                }


                {/*<Button onClick={this.openModal} primary>Hilfe erhalten</Button>*/}

                {/*{this.state.showModal &&*/}
                    {/*<Modal title={"editor:Category"} dismiss={this.closeModal} actions={[*/}
                        {/*{label: "Ok", template: "primary", align: "right", action: this.closeModal}, {label: "Abbrechen"}*/}
                    {/*]}>*/}
                        {/**/}
                    {/*</Modal>*/}
                {/*}*/}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);