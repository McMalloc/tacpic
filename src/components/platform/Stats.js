import React, {useEffect, useState} from 'react';
import {Checkbox} from "../gui/Checkbox";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {Row} from "../gui/Grid";


const Stats = props => {
    const {frontend, backend} = useSelector(
        state => state.app
    );

    return (
        <Row>
            <pre className={"col-xs-6"}>
                {JSON.stringify(frontend)}
            </pre>
            <pre className={"col-xs-6"}>
                {JSON.stringify(backend)}
            </pre>
        </Row>

    )
};

export default Stats;