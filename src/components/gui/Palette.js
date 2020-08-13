import styled from 'styled-components/macro';
import React, {Component} from "react";
import Swatch from "./Swatch";
import {Icon} from "./_Icon";
import {Button} from "./Button";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  //margin: 0 -${props => props.theme.spacing[1]};
`;

class Palette extends Component {
    state = {
        showExtended: false
    };

    render() {
        return (
            <Wrapper>
                {this.props.colours.map((code, index) => {
                    return <Swatch active={this.props.selected === code} onClick={this.props.onChange} code={code} key={index}/>
                })}
                {this.props.extendedColours.length && (this.props.extendedColours.length > 0) &&
                    <>
                        {!this.state.showExtended &&
                        <Button onClick={() => this.setState({showExtended: true})}>mehr</Button>
                            // <Swatch onClick={() => this.setState({showExtended: true})}><Icon icon={"plus-square"} /></Swatch>
                        }
                        {this.state.showExtended && this.props.extendedColours.map((code, index) => {
                            return <Swatch active={this.props.selected === code} onClick={this.props.onChange} code={code} key={index}/>
                        })}
                        {this.state.showExtended &&
                        <Button onClick={() => this.setState({showExtended: false})}>weniger</Button>
                        }
                    </>
                }

            </Wrapper>
        )
    }
}

export default Palette;