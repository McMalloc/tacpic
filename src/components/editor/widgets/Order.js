import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components/macro';
import {Qid} from "../../gui/Qid";
import {Row} from "../../gui/Grid";
import {Numberinput} from "../../gui/Input";
import Label from "../../gui/_Label";
import {Button} from "../../gui/Button";
import {Lower, WidgetWrapper} from "../../gui/WidgetContainer";

class Order extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <WidgetWrapper>
                    <Row padded>
                        <div className={"col-md-6"}>
                            <Numberinput label={"Anzahl"} unit={"Stck."}/>
                        </div>
                        <div className={"col-md-6"}>
                            Preis <br/>
                            -,--€
                        </div>
                    </Row>
                    <Row>
                        <div className={"col-md-6"} style={{textAlign: "right"}}>
                            ≙ - Bögen
                        </div>
                    </Row>
                </WidgetWrapper>
                <Lower>
                    <Button>In den Warenkorb</Button>&ensp;
                    <Button primary>Bestellen</Button>
                </Lower>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);