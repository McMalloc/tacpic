import styled from 'styled-components';
import React, {Component} from "react";
import AtlSelect from 'react-select'
import {withTranslation} from "react-i18next";
import Label from "./_Label";
// import {Icon} from "./_Icon";

const Wrapper = styled.div`

`;

const customStyles = {
    option: (provided, state) => ({
        ...provided
    })
};

class Select extends Component {
    render() {
        return (
            <Wrapper>
                <Label label={this.props.label} sublabel={this.props.sublabel}>
                <AtlSelect
                    styles={customStyles}
                    placeholder={this.props.t(this.props.placeholder)}
                    menuPortalTarget={document.body}
                    options={this.props.options} /></Label>
            </Wrapper>


        )
    }
}

export default withTranslation()(Select)