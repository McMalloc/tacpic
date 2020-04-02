import styled from 'styled-components';
import React, {useState} from "react";
import Label from "./_Label";
import {useTranslation} from "react-i18next";
import {Alert} from "./Alert";

const Unit = styled.span`
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
  
  &:invalid {
    border-radius: 3px 3px 0 0;
  }
  
  &::placeholder {
    font-style: italic;
  }
  
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

const validate = (validations, value) => {
    return validations.map(validation => {
        const isValid = validation.fn(value);
        validation.callback(isValid);
        return isValid;
    })
};

const getMessages = (validities, t, validations) => {
    let invalidityMessages = [];
    validities.forEach((validity, index) => {
        if (!validity) invalidityMessages.push(t(validations[index].message));
    });
    return invalidityMessages;
};

const report = (element, messages) => {
    element.setCustomValidity(messages.join(" "));
    element.checkValidity();
};

const Textinput = props => {
    let validations = !!props.validations ? [...props.validations] : [];

    const [validities, setValidities] = useState(validations.map(() => false));
    const [pristine, setPristine] = useState(true);

    const {t} = useTranslation();
    const messages = getMessages(validities, t, validations);

    const Wrapping = props.label ? Label : React.Fragment;

    return (
        <Wrapping
            tip={props.tip}
            sublabel={props.sublabel}
            label={props.label}
            noMargin={props.noMargin}
            disabled={props.disabled}
            id={props.label ? "label-for-" + props.name : ""}
            inline={props.inline}>
            <Input
                disabled={props.disabled}
                inline={props.inline}
                autocomplete={props.autocomplete}
                required={props.required}
                placeholder={t(props.placeholder) || ""}
                onInput={event => {
                    setValidities(validate(validations, event.currentTarget.value));
                }}
                onBlur={event => {
                    event.target.value.length !== 0 && setPristine(false);
                    report(event.target, getMessages(validities, t, validations));
                    props.onBlur && props.onBlur(event);
                }}
                aria-invalid={messages.length !== 0 && !pristine}
                aria-labelledby={"label-for-" + props.name}
                type={props.type || "text"}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            />
            {!pristine && messages.map(message => <Alert style={{borderRadius: '0 0 3px 3px', marginTop: 0}} warning>{message}</Alert>)}
        </Wrapping>
    )
};

const Numberinput = props => {

    return (
        <Label tip={props.tip} inline={props.inline} disabled={props.disabled} label={props.label}
               sublabel={props.sublabel}>
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