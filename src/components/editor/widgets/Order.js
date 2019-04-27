import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Qid} from "../../gui/Qid";
import {Row} from "../../gui/Grid";
import {Numberinput} from "../../gui/Input";
import Label from "../../gui/_Label";
import {Button} from "../../gui/Button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

class Order extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Wrapper>
                <Row padded>
                    <div className={"col-md-6"}>
                        <Numberinput label={"Anzahl"} unit={"Stck."}/>
                    </div>
                    <div className={"col-md-6"}>
                        Preis <br />
                        12,30€
                    </div>
                </Row>
                <Row>
                    <div className={"col-md-6"} style={{textAlign: "right"}}>
                        ≙ 12 Bögen
                    </div>
                </Row>
                <Row>
                    <div className={"col-md-12"}>
                        <Button fullWidth primary>Zur Bestellübersicht & Editor verlassen</Button>
                    </div>

                </Row>
            </Wrapper>
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

export default connect(mapStateToProps, mapDispatchToProps)(Order);