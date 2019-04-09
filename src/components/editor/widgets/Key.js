import React, {Component} from 'react';
import styled from 'styled-components';
import {Padding, p, px} from 'styled-components-spacing';
import {connect} from "react-redux";
import {OBJECT} from "../constants";
import {Button, FlyoutButton} from "../../gui/Button";
import TexturePreview from "../../gui/TexturePreview";
import Grid from "styled-components-grid";
import {Textinput} from "../../gui/Input";

const ListHeading = styled.span` // TODO: eigentlich nur ein Label
  font-weight: 700;
`;

const Entry = styled.div`

`;

const Table = styled.table`
  width: 100%;
  font-size: 0.9em;
  
  thead {
    font-weight: 700;
  }
  
  tr {
      td:nth-child(2) {
        text-align: right;
      }
      
      &:hover {
        background-color: ${props => props.theme.accent_1_light}
      }
  }

  td {
    ${p(1)};
    border-bottom: ${props => props.theme.divider_line}
  }
`;

const LabelKey = styled.span`
  border: 2px solid ${props => props.theme.accent_1};
  ${px(1)};
`;

class Key extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <React.Fragment>
                <Padding vertical={1}>
                    {/*<ListHeading>Legendeneinträge</ListHeading>*/}
                    <Table>
                        <thead>
                            <tr>
                                <td>Beschriftung</td>
                                <td>Schlüssel</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.labelKeys.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{entry.text}</td>
                                        <td><LabelKey>{entry.key}</LabelKey></td>
                                    </tr>
                                )
                            })}
                            {this.props.textureKeys.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{entry.label}</td>
                                        <td><TexturePreview height={20} template={entry.patternTemplate}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Padding>
                <Padding vertical={2}>
                    <FlyoutButton icon={"plus"} label={"Eintrag hinzufügen"}>
                        Menü
                    </FlyoutButton>
                </Padding>
                <Grid>
                    <Grid.Unit size={1/2}>
                        <Button icon={"redo-alt"} fullWidth>Aktualisieren</Button>
                    </Grid.Unit>
                    <Grid.Unit size={1/2}>
                        <Button icon={"arrow-alt-circle-right"} primary fullWidth>Erstellen</Button>
                    </Grid.Unit>
                </Grid>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        labelKeys: [
            {
                type:   OBJECT.LABEL,
                uuid:   null,
                text:   "Linke Herzkammer.",
                x:      0,
                y:      0,
                angle:  0,
                isKey:  true,
                key:    "Lhk",
                width:  0,
                height: 0
            },
            {
                type:   OBJECT.LABEL,
                uuid:   null,
                text:   "Rechte Herzkammer",
                x:      0,
                y:      0,
                angle:  0,
                isKey:  true,
                key:    "Rhk",
                width:  0,
                height: 0
            }
        ], // TODO: aus State holen, wenn es funktioniert
        textureKeys: [
            {
                patternTemplate: "striped",
                label: "" // TODO wo wird die gespeichert??
            }, {
                patternTemplate: "bigdots",
                label: ""
            }
        ]
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Key);