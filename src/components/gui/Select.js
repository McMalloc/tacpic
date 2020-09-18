import styled from 'styled-components/macro';
import React from "react";
import AtlSelect from 'react-select'
import AtlCrSelect from 'react-select/creatable'
import Label from "./_Label";
import {useTranslation} from 'react-i18next';
import {standard} from "../../styles/themes";
import {find} from "lodash";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: standard.midlight,
        fontWeight: 'bold',
        ":active": {
            outline: '4px solid rgba(38, 132, 255, 0.7)'
        }
    }),
    container: (provided, state) => ({
        ":focus": {
            outline: '4px solid rgba(38, 132, 255, 0.7)'
        }
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: "0.9em",
        backgroundColor: state.isSelected ? standard.brand_secondary : 'inherit',
        borderBottom: '1px solid ' + standard.midlight,
        padding: standard.spacing[2],
        ":hover": {
            backgroundColor: state.isSelected ? standard.brand_secondary_lighter : standard.grey_5,
            textDecoration: 'underline'
        }
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        margin: 0
    })
};

const Select = props => {
    const {t} = useTranslation();
    const Component = props.creatable ? AtlCrSelect : AtlSelect;
    // TODO: funktioniert noch nicht für gruppierte options-Arrays
    let value = props.value;
    if (!Array.isArray(props.value)) {
        value = find(props.options, {value: props.value})
    }

    return (
        <div>
            <Label data-tip={t(props.tip)} label={props.label} sublabel={props.sublabel}>
                {/*TODO: hack beseitigen*/}
                {props.label &&
                <div style={{height: 2}}/>
                }
                <Component
                    styles={customStyles}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 3,
                        spacing: {
                            baseUnit: 2,
                            controlHeight: 29,
                            menuGutter: 2
                        }
                    })}
                    // components={{ Input: CustomInput }}
                    isMulti={props.isMulti}
                    placeholder={t(props.placeholder)}
                    value={value}
                    isDisabled={props.disabled}
                    onCreateOption={props.onCreateOption}
                    onChange={props.onChange}
                    // menuIsOpen={true}
                    menuPortalTarget={document.getElementById("select-portal-target")}
                    options={props.options}/>
            </Label>
        </div>
    )

};

export default Select