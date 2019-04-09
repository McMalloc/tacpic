import styled from 'styled-components';
import React, {Component, Fragment} from "react";

const Label = styled.label`
  font-size: 0.9em;
  display: flex;
  margin-bottom: 0.5em;
  transition: font-weight 0.1s, color 0.1s;
  position: relative;
  align-items: center;
  
  &:last-child {
  margin-bottom: inherit;
  }
  
  &:before {
      width: 1em;
      height: 1em;
      position: relative;
      margin-right: 0.5em;
      align-self: center;
      box-sizing: border-box;
      content: "";
      border: 2px solid ${props => props.active ? props.theme.accent_1 : props.theme.dark};
      background-color: ${props => props.active ? props.theme.accent_1 : "transparent"};
      transition: background-color 0.1s;
  }
  
  &:after {
    position: absolute;
    transition: opacity 0.1s;
    display: inline-block;
    color: white;
    height: 0;
    font-size: 14px;
    left: 0.2em;
    top: 0.2em;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  margin: 0;
  
  &:checked+label {
    font-weight: 700;
    color: ${props => props.theme.accent_1};
  }  
  
  &:checked + label:after {
    content: "✔";
  }  
  
  &:focus + label {
    box-shadow: 0 0 0 2px rgba(0,0,0,0.4);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 26px;
`;

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {checked: props.default ? props.default : false};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({checked: event.target.checked});
        this.props.onChange(this.props.name, event.target.checked)
    }

    render() {
        // Use a portal to render the children into the element
        return (
            <Wrapper>
                 <Input
                     onChange={this.handleChange}
                     name={this.props.name}
                     id={this.props.name + "-cb"}
                     // tabIndex={0}
                     checked={this.state.checked}
                     type={"checkbox"} />
                 <Label active={this.state.checked} htmlFor={this.props.name + "-cb"}>
                     {this.props.label}
                 </Label>
            </Wrapper>


        )
    }
}

export {Checkbox}