import styled from 'styled-components';
import React, {Component} from "react";
import _Select from 'react-select'
// import {Icon} from "./_Icon";

const Wrapper = styled.div`

`;

const customStyles = {
    option: (provided, state) => ({
        ...provided
    })
};

class Select extends Component {
    constructor(props) {
        super(props);
        // this.state = {activeItem: 0, collapsed: false};
        // this.collapse = this.collapse.bind(this);
        // this.expand = this.expand.bind(this);
    }

    // collapse() {
    //     this.setState({collapsed: true});
    // }
    //
    // expand() {
    //     this.setState({collapsed: false});
    // }

    render() {
        // Use a portal to render the children into the element
        return (
            <Wrapper>
                <_Select
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    options={this.props.options} />
            </Wrapper>


        )
    }
}

export {Select}