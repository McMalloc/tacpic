import styled from 'styled-components';
import React, {Component, Fragment} from "react";

const Label = styled.label`
  font-size: 0.9em;
  //display: flex;
  margin-bottom: 0.5em;
  padding-left: 1.4em;
  transition: font-weight 0.1s, color 0.1s;
  position: relative;
  align-items: center;
  color: ${props => props.disabled ? props.theme.middark : "inherit"};
  
  &:last-child {
  margin-bottom: inherit;
  }
  
  &:before {
      left: 0.1em;
      top: 0.1em;
      width: 1em;
      height: 1em;
      position: absolute;
      margin-right: 0.5em;
      align-self: center;
      box-sizing: border-box;
      content: "";
      border-radius: ${props => props.theme.border_radius};
      border: 1px solid ${props => props.disabled ? props.theme.middark : props.active ? props.theme.accent_1 : props.theme.midlight};
      background-color: ${props => props.disabled ? "transparent" : props.active ? props.theme.accent_1 : "white"};
      transition: background-color 0.1s;
  }
  
  &:after {
    position: absolute;
    transition: opacity 0.1s;
    display: inline-block;
    color: white;
    height: 0;
    font-size: 14px;
    left: 0.3em;
    top: 0;
  }
  
  &:hover {
    text-decoration: ${props => props.disabled ? "none" : "underline"};
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
    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing[1]};
  //height: 26px;
`;

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {checked: props.default ? props.default : false};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) { // TODO: Soll sich der Parent Container um den State kümmern? Ja: für alles andere gibt es 0 use cases
        this.setState({checked: event.target.checked});
        if (this.props.onChange) this.props.onChange(this.props.name, event.target.checked);
    }

    render() {
        return (
            <Wrapper>
                 <Input
                     onChange={this.handleChange}
                     name={this.props.name}
                     disabled={this.props.disabled}
                     aria-disabled={this.props.disabled}
                     id={this.props.name + "-cb"}
                     // tabIndex={0}
                     checked={this.state.checked}
                     type={"checkbox"} />
                 <Label disabled={this.props.disabled} active={this.state.checked} htmlFor={this.props.name + "-cb"}>
                     {this.props.label}
                 </Label>
            </Wrapper>


        )
    }
}

export {Checkbox}