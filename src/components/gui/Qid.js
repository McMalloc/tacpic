import styled from 'styled-components';
import React, {Component} from "react";
import {Numberinput, Textinput, Multiline} from "./Input";
import {Checkbox} from "./Checkbox";
import {Button} from "./Button";

const Wrapper = styled.div`
  // color: ${props => props.theme.accent_1_light};
  //background-color: ${props => props.theme.brand_secondary};
  //font-size: 0.9em;
`;

class Qid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withUnits: true
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(name, state) {
        console.log({
            [name]: state
        });
        this.setState({
            [name]: state
        })
    }

    render() {
        // let tags = this.props.template.match(/\[\w.+\]/g);
        // let blocks = [];

        // line swerden gleichzeitig angezeigt, wenn alles bisherige ausgefüllt worden ist
        // blocks = this.props.template.split("\n\n").map(block => {
        //     let lines = block.split("\n").map(line => {
        //         return {
        //
        //         }
        //     })
        // });
        //
        // console.log("- - - - - - - - - - - ");

        return (
            <Wrapper>
                {/*<p>*/}
                    {/*Die Grafik ist übertitelt mit <Textinput style={{display: "inline"}} inline name={"title"}/>.*/}
                {/*</p>*/}
                {/*<p>*/}
                    {/*Die horizontale Achse ist beschriftet mit <Textinput inline name={"horizontal"}/>.*/}
                {/*</p>*/}
                {/*{!this.state.withUnits &&*/}
                {/*<p>*/}
                    {/*gemessen in <Textinput inline name={"unit"}/>*/}
                {/*</p>*/}
                {/*}*/}
                {/*<p>*/}
                    {/*und reicht von <Textinput inline name={"min"}/>*/}
                {/*</p>*/}
                {/*<p>*/}
                    {/*bis <Textinput inline name={"max"}/>.*/}
                {/*</p>*/}
                {/*<Checkbox name={"withUnits"} onChange={this.toggle} label={"Keine Einheiten angegeben."}/>*/}
                <Textinput label={"Aussagekräftiger Titel"} />
                <Multiline rows={2} label={"Zusammenfassende Beschreibung"} />
                <Multiline rows={4} label={"Detaillierte Beschreibung"} />
                <Button primary>Einfügen</Button>
            </Wrapper>
        )
    }
}

export {Qid}