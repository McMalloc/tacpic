import styled from 'styled-components';
import React, {Component} from "react";
// import {debounce} from 'lodash';
import Label from "./_Label";

const Unit = styled.span`
  //font-size: 0.9em;
  align-self: center;
  padding-left: ${props => props.theme.spacing[1]};
`;

const Numberwrapper = styled.div`
  display: flex;
  
  input {
    text-align: right;
  }
`;

const Input = styled.input`
  font-size: 1em;
  font-weight: 700;
  color: ${props => props.disabled ? props.theme.middark : props.theme.brand_secondary};;
  display: ${props => props.inline ? "inline" : "block"};
  width: ${props => props.inline ? "inherit" : "100%"};
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.midlight};
  border-radius: 3px;
  background-color: ${props => props.disabled ? "transparent" : props.theme.background};
  padding: 5px ${props => props.theme.spacing[1]};
  cursor: ${props => props.disabled ? "not-allowed" : "text"};
  
  &:after {
    content: "mm";
    display: block; 
  }
`;

const Textarea = styled.textarea`
  font-size: 1em;
  font-weight: 700;
  color: ${props => props.theme.brand_secondary};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.midlight};
  border-radius: 3px;
  background-color: ${props => props.disabled ? "transparent" : props.theme.background};
  cursor: ${props => props.disabled ? "not-allowed" : "text"};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[1]};
`;

const Textinput = props => {
    return (
        <Label tip={props.tip} sublabel={props.sublabel} label={props.label} disabled={props.disabled} inline={props.inline}>
            <Input
                disabled={props.disabled}
                inline={props.inline}
                type={"text"}
                name={props.name}
                value={props.value}
                // onChange={console.log}
                onChange={props.onChange}
            />
        </Label>
    )
};

const Numberinput = props => {

    return (
        <Label tip={props.tip} inline={props.inline} disabled={props.disabled} label={props.label} sublabel={props.sublabel}>
            <Numberwrapper inline={props.inline}>
                <Input disabled={props.disabled}
                       inline={props.inline}
                       type={"number"}
                       name={props.name}
                       value={props.value}
                       onChange={props.onChange}/>
                <Unit>{props.unit}</Unit>
            </Numberwrapper>
        </Label>
    )

};

const Multiline = props => {
    return (
        <Label tip={props.tip} sublabel={props.sublabel} disabled={props.disabled} label={props.label}>
                <Textarea
                    rows={props.rows || 3}
                    disabled={props.disabled}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}/>
        </Label>
    )
};

export {Textinput, Numberinput, Multiline}