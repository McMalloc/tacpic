import styled from 'styled-components';
import React, {Component, Fragment} from "react";

const Label = styled.label`
  font-size: 0.9em;
  position: relative;
  display: flex;
  align-self: center;
  margin-bottom: 0.5em;
  transition: font-weight 0.2s, color 0.2s;
  
  &:checked {
    text-decoration: underline;
  }
  
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
      border-radius: 100%;
      border: 1px solid ${props => props.active ? props.theme.accent_1 : props.theme.midlight};
      background-color: ${props => props.theme.background};
      // background-color: ${props => props.active ? props.theme.accent_1 : props.theme.background};
      transition: background-color 0.1s;
  }  
  
  &:after {
      width: 0.5em;
      height: 0.5em;
      left: 0.25em;
      position: absolute;
      margin-right: 0.5em;
      align-self: center;
      box-sizing: border-box;
      content: "";
      border-radius: 100%;
      opacity: ${props => props.active ? 1 : 0};
      background-color: ${props => props.theme.accent_1};
      transition: opacity 0.1s;
  }
  
  &:hover {
    text-decoration: underline;
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
    content: "";
  }  
  
  &:focus + label {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 26px;
`;

class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.default ? props.default : ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        // Use a portal to render the children into the element
        return (
            <Fragment>
                {this.props.options ? this.props.options.map((option, index) => {
                    return (
                        <Wrapper key={index}>
                            <Input
                                onChange={this.handleChange}
                                name={this.props.name}
                                id={this.props.name + "-" + option.value}
                                checked={option.value === this.state.value}
                                value={option.value}
                                type={"radio"}/>
                            <Label active={option.value === this.state.value} htmlFor={this.props.name + "-" + option.value}>
                                {option.label}
                            </Label>
                        </Wrapper>

                    )
                }) : null}
            </Fragment>


        )
    }
}

export {Radio}