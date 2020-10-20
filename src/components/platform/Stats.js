import React, {useEffect, useState} from 'react';
import {Checkbox} from "../gui/Checkbox";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {Row} from "../gui/Grid";
import moment from 'moment';
import Expander from "../gui/Expander";

// let md = new MarkdownIt();
const Wrapper = styled.ul`
  background-color: white;
  padding: 8px;
  margin-bottom: 12px;
`

const Stats = props => {
    const {frontend, backend} = useSelector(
        state => state.app
    );

    return (
        <Row>
            <div className={"col-xs-12 col-sm-6"}>
                <h1>Backend</h1>
                <p>Aktuelle Version: <span className={"monospace"}>{backend && backend.tag}</span></p>
                <h2>Changelog</h2>
                {backend.commits && backend.commits.map(commit => {
                    return <div key={commit.hash} style={{marginBottom: 6}}><Expander key={commit.hash}>
                        <span><span className={"monospace"}>#{commit.hash}</span> vom <strong>{moment.unix(commit.timestamp).format("DD.MM.YYYYY, HH:mm")}</strong></span>
                        <ul>
                            {commit
                                .subject
                                .split("*")
                                .filter(line=>line.length !== 0)
                                .map(bullet=><li>{bullet.trim()}</li>)
                            }
                        </ul>
                    </Expander></div>
                })}
            </div>
            <div className={"col-xs-12 col-sm-6"}>
                <h1>Frontend</h1>
                <p>Aktuelle Version: <span className={"monospace"}>{frontend && frontend.tag}</span></p>
                <h2>Changelog</h2>
                {frontend.commits && frontend.commits.map(commit => {
                    return <div key={commit.hash} style={{marginBottom: 6}}><Expander key={commit.hash}>
                        <span><span className={"monospace"}>#{commit.hash}</span> vom <strong>{moment.unix(commit.timestamp).format("DD.MM.YYYYY, HH:mm")}</strong></span>
                        <ul>
                            {commit
                                .subject
                                .split("*")
                                .filter(line=>line.length !== 0)
                                .map(bullet=><li>{bullet.trim()}</li>)
                            }
                        </ul>
                    </Expander></div>
                })}
            </div>
        </Row>

    )
};

export default Stats;