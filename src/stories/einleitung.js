import {storiesOf} from "@storybook/react";
import React from "react";
import component_list from "./component_list.csv";
import {keysIn, without} from 'lodash';
import LinkTo from '@storybook/addon-links/react';

console.log(component_list);
console.log("hi!");
const headers = without(keysIn(component_list[0]), "Link");

storiesOf('Einleitung', module)
    .add('Übersicht der Komponenten', () =>
            <section>
                <table>
                    <thead>
                        <tr>
                        {headers.map(header => {
                            return <th>{header}</th>
                        })}
                        </tr>
                    </thead>
                    <tbody>
                    {component_list.map(row => {
                        return (<tr>
                            {headers.map(header => {
                                let cellContent;
                                switch (header) {
                                    case "Name":
                                        if (row["Link"]) {
                                            const [kind, story] = row["Link"].split(",");
                                            cellContent = <LinkTo kind={kind} story={story}>{row[header]}</LinkTo>
                                        } else {
                                            cellContent = row[header];
                                        }
                                        return <td>{cellContent}</td>;
                                    case "Features":
                                        return (<td>
                                            <ul>
                                            {row["Features"].split("|").map(f => {
                                                return <li>{f}</li>;
                                            })}
                                            </ul>
                                        </td>);
                                    case "Fortschritt":
                                        switch (row["Fortschritt"]) {
                                            case 1: cellContent = <td style={{backgroundColor: "#bf6870"}}>todo</td>; break;
                                            case 2: cellContent = <td style={{backgroundColor: "#72a5bf"}}>doing</td>; break;
                                            case 3: cellContent = <td style={{backgroundColor: "#90bf7d"}}>done</td>; break;
                                        }
                                        console.log(row["Fortschritt"]);
                                        return cellContent;
                                    default: return <td>{row[header]}</td>;
                                }
                            })}
                        </tr>)
                    })}
                    </tbody>
                </table>
            </section>,
        {
            notes: {
                // markdown: typographie_notes
            }
        }
    );