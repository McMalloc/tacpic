import React from "react";
import Well from "./gui/Well";
import {Container, Row} from "./gui/Grid";
import {Alert} from "./gui/Alert";

export default props => {
    return <Container>
        <Row><br /></Row>
        <Row>
            <Well warning className={"col-md-6 col-md-offset-3 extra-margin"}>404: Seite nicht gefunden :(</Well>
        </Row>
    </Container>
}