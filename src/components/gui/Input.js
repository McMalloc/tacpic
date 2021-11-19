import styled from 'styled-components/macro';
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
    width: ${props => props.inline ? '100px' : props.width};
  }
`;

const Input = styled.input`
  font-size: 1em;
  font-weight: 700;
  margin: 0;
  color: ${props => props.disabled ? props.theme.middark : props.theme.brand_secondary};
  -webkit-appearance: none;
 
  display: ${props => props.inline ? "inline" : "block"};
  width: ${props => props.inline ? "inherit" : "100%"};
  box-sizing: border-box;
  border: ${props => props.theme.elementBorder};
  border-radius: ${props => props.theme.border_radius};
  background-color: ${props => props.disabled ? "transparent" : props.theme.background};
  padding: 4px ${props => props.theme.spacing[1]};
  cursor: ${props => props.disabled ? "not-allowed" : "text"};
  transition: outline 0.1s;

  &.attached {
    border-radius: ${props => props.theme.border_radius} 0 0 ${props => props.theme.border_radius};
  }
  
  &.dirty:invalid {
    border-radius: ${props => props.theme.border_radius} ${props => props.theme.border_radius} 0 0;
    //box-shadow: 0 0 5px 2px red;
  }
  
  &::placeholder {
    font-style: italic;
  }
  
  &:focus, &:active {
     outline: 4px solid rgba(38, 132, 255, 0.7);
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
  border: 2px solid ${props => props.theme.grey_4};
  border-radius: ${props => props.theme.border_radius};
  background-color: ${props => props.disabled ? "transparent" : props.theme.background};
  cursor: ${props => props.disabled ? "not-allowed" : "text"};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[1]};
    transition: outline 0.1s;
  
  &.dirty:invalid {
    border-radius: ${props => props.theme.border_radius} ${props => props.theme.border_radius} 0 0;
    //box-shadow: 0 0 5px 2px red;
  }
  
  &::placeholder {
    font-style: italic;
  }
  
  &:focus, &:active {
     outline: 4px solid rgba(38, 132, 255, 0.7);
  }
  
  &:after {
    content: "mm";
    display: block; 
  }
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
    if (validations.length === 0) return [];
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
    props.required && validations.push({
        fn: val => /.+/.test(val), message: "account:required", callback: () => {}
    })

    const [validities, setValidities] = useState(validations.map(() => false));
    const [pristine, setPristine] = useState(true);

    const {t} = useTranslation();
    const messages = getMessages(validities, t, validations);

    return (
        <Label
            tip={props.tip}
            sublabel={props.sublabel}
            required={props.required}
            style={props.style}
            label={props.label}
            noMargin={props.noMargin}
            disabled={props.disabled}
            id={props.name ? "label-for-" + props.name : ''}
            inline={props.inline}>
            <Input
                disabled={props.disabled}
                inline={props.inline}
                id={props.name ? "input-for-" + props.name : ''}
                autocomplete={props.autocomplete}
                className={props.className + (pristine ? " pristine" : " dirty")}
                required={props.required}
                placeholder={t(props.placeholder) || ""}
                onInput={event => {
                    setValidities(validate(validations, event.currentTarget.value));
                }}
                onBlur={event => {
                    setPristine(false);
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
            {!pristine && messages.map((message, index) => <Alert key={index} style={{borderRadius: '0 0 3px 3px', marginTop: 0}} warning>{message}</Alert>)}
        </Label>
    )
};

const Numberinput = props => {
    return (
        <Label tip={props.tip} inline={props.inline} required={props.required} noMargin={props.noMargin} disabled={props.disabled} label={props.label}
               sublabel={props.sublabel}>
            <Numberwrapper inline={props.inline}>
                <Input disabled={props.disabled}
                       inline={props.inline}
                       type={"number"}
                        min={props.min || 0}
                        inputmode={"numeric"} pattern={"[0-9]*"}
                       max={props.max}
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
        <Label style={props.style} tip={props.tip} sublabel={props.sublabel} required={props.required} disabled={props.disabled} label={props.label}>
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