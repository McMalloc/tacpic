import styled from 'styled-components';
import React from "react";
import AtlSelect from 'react-select'
import AtlCrSelect from 'react-select/lib/Creatable'
import Label from "./_Label";
import {useTranslation} from 'react-i18next';
import {standard} from "../../styles/themes";
import {find} from "lodash";

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: standard.midlight
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: "0.9em",
        backgroundColor: state.isSelected ? standard.accent_1 : 'inherit',
        borderBottom: '1px solid ' + standard.midlight,
        padding: standard.spacing[2],
        ":hover": {
            backgroundColor: state.isSelected ? standard.accent_1 : standard.accent_1_light,
            textDecoration: 'underline'
        }
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        margin: 0
    })
};

const Select = props => {
    const { t } = useTranslation();
    const Component = props.creatable ? AtlCrSelect : AtlSelect;
    // TODO: funktioniert noch nicht für gruppierte options-Arrays
    let dflt = props.default ? find(props.options, {value: props.default}) : null;
    return (
            <div>
                <Label data-tip={t(props.tip)} label={props.label} sublabel={props.sublabel}>
                    {/*TODO: hack beseitigen*/}
                    {props.label &&
                        <div style={{height: 2}} />
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
                        defaultValue={dflt}
                        onChange={props.onChange}
                        menuPortalTarget={document.body}
                        options={props.options}/></Label>
            </div>
    )
    
};

export default Select