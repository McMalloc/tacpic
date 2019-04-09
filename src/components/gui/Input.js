import styled from 'styled-components';
import React, {Component} from "react";

const Label = styled.label`
  font-size: 0.9em;
`;

const Unit = styled.span`
  font-size: 0.9em;
  align-self: center;
  padding-left: 1em;
`;

const Numberwrapper = styled.div`
  display: flex;
`;

const Input = styled.input`
  font-size: 1em;
  font-weight: 700;
  color: ${props => props.theme.accent_1};
  display: ${props => props.inline? "inline" : "block"};
  width: ${props => props.inline? "inherit" : "100%"};
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid ${props => props.theme.accent_1};
  background-color: ${props => props.theme.accent_1_light};
  padding: ${props => props.theme.base_padding};
  
  &:after {
    content: "mm";
    display: block;
    
  }
`;

class Textinput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <Label>{this.props.label}
                <Input inline={this.props.inline} type="text" name={this.props.name} value={this.state.value} onChange={this.handleChange}/>
            </Label>
        )
    }
}

class Numberinput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <Label>{this.props.label}
                <Numberwrapper inline={this.props.inline}>
                    <Input inline={this.props.inline} type="number" name={this.props.name} value={this.state.value} onChange={this.handleChange} />
                    <Unit>{this.props.unit}</Unit>
                </Numberwrapper>
            </Label>
        )
    }
}

export {Textinput, Numberinput}