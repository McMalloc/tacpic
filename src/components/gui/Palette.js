import styled from 'styled-components/macro';
import React, { Component } from "react";
import Swatch from "./Swatch";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  //margin: 0 -${props => props.theme.spacing[1]};
`;

const Palette = props => {
    return (
        <Wrapper>
            {props.colours.map((code, index) => {
                return <Swatch active={props.selected === code} onClick={props.onChange} code={code} key={index} />
            })}
            {/* {this.props.extendedColours &&
                    <>
                        {!this.state.showExtended &&
                            <Button onClick={() => this.setState({ showExtended: true })}>mehr</Button>
                            // <Swatch onClick={() => this.setState({showExtended: true})}><Icon icon={"plus-square"} /></Swatch>
                        }
                        {this.state.showExtended && this.props.extendedColours.map((code, index) => {
                            return <Swatch active={this.props.selected === code} onClick={this.props.onChange} code={code} key={index} />
                        })}
                        {this.state.showExtended &&
                            <Button onClick={() => this.setState({ showExtended: false })}>weniger</Button>
                        }
                    </>
                } */}

        </Wrapper>
    )

}

export default Palette;