import React from "react";
import Well from "./gui/Well";
import {Container, Row} from "./gui/Grid";
import {Alert} from "./gui/Alert";
import { useTranslation } from "react-i18next";

const NotFound = props => {
    const {t} = useTranslation();
    return <Container>
        {/* <Row>
            <div className={"col-md-6 col-md-offset-3"}>
                <Alert danger>
                    Die Plattform befindet sich in der Alpha-Phase, d.h. sie wird noch getestet.
                    <strong>Es können keine Verträge mit uns, der tacpic UG (haftungsbeschränkt), über die Software geschlossen werden.</strong>
                </Alert>
            </div>

        </Row> */}
        <Row>
            <div className={"col-md-6 col-md-offset-3 extra-margin"}>
                <Alert warning>{t("404NotFound")}</Alert>
            </div>
        </Row>
    </Container>
}

export default NotFound;