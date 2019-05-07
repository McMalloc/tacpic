import styled from 'styled-components';
import React, {Component} from "react";
import AtlSelect from 'react-select'
import {withTranslation} from "react-i18next";
import Label from "./_Label";
import {standard} from "../../styles/themes";

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

class Select extends Component {
    render() {
        return (
            <>
                <Label label={this.props.label} sublabel={this.props.sublabel}>
                    {/*TODO: hack beseitigen*/}
                    {this.props.label &&
                        <div style={{height: 2}} />
                    }
                    <AtlSelect
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
                        placeholder={this.props.t(this.props.placeholder)}
                        menuPortalTarget={document.body}
                        options={this.props.options}/></Label>
            </>


        )
    }
}

export default withTranslation()(Select)