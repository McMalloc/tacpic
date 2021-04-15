import styled from 'styled-components/macro';
import React from "react";
import AtlSelect, { components } from 'react-select'
import AtlCrSelect from 'react-select/creatable'
import Label from "./_Label";
import { useTranslation } from 'react-i18next';
import { standard } from "../../styles/themes";
import { find } from "lodash";

const SingleValue = props => (
    <components.SingleValue {...props}>
        {/* {props.data.chipLabel} */}
        {props.data.display}
    </components.SingleValue>
);

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: standard.elementBorder,
        // borderWidth: '2px',
        fontWeight: 'bold',
        backgroundColor: state.menuIsOpen ? standard.brand_primary : standard.background,
        transition: 'all 50ms',
        outline: state.isFocused ? '4px solid rgba(38, 132, 255, 0.7)' : 'none',
        ':hover': {
            borderColor: standard.grey_2,
            boxShadow: standard.middle_shadow,
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        }
    }),
    option: (provided, state) => ({
        ...provided,
        cursor: 'pointer',
        backgroundColor: state.isSelected ? standard.brand_secondary : state.isFocused ? standard.grey_5 : 'inherit',
        textDecoration:  state.isFocused ? 'underline' : 'none',
        borderBottom: '1px solid ' + standard.midlight,
        padding: '0.5rem',
        ":hover": {
            backgroundColor: state.isSelected ? standard.brand_secondary_lighter : standard.grey_5,
            textDecoration: 'underline'
        }
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        width: '2px',
        backgroundColor: standard.grey_4,
        margin: 0
    })
};

const Combobox = props => {
    const { t } = useTranslation();
    const Component = props.creatable ? AtlCrSelect : AtlSelect;
    // TODO: funktioniert noch nicht für gruppierte options-Arrays
    let value = props.value;
    if (!Array.isArray(props.value)) {
        value = find(props.options, { value: props.value })
    }

    const customOptionDisplay = props.options.length > 0 && props.options[0].hasOwnProperty('display');

    return (
        <div>
            <Label disabled={props.disabled} data-tip={t(props.tip)} label={props.label} sublabel={props.sublabel}>
                {/*TODO: hack beseitigen*/}
                {props.label &&
                    <div style={{ height: 2 }} />
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
                    isMulti={props.isMulti}
                    placeholder={t(props.placeholder)}
                    value={value}
                    isSearchable={props.isSearchable}
                    components={{ SingleValue: customOptionDisplay ? SingleValue : components.SingleValue }}
                    isDisabled={props.disabled}
                    onCreateOption={props.onCreateOption}
                    onChange={props.onChange}
                    // menuIsOpen={true}
                    menuPlacement={props.menuPlacement}
                    // menuPortalTarget={document.getElementById("select-portal-target")}
                    options={props.options} />
            </Label>
        </div>
    )

};

export default Combobox