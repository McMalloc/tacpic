import styled from 'styled-components/macro';
import React from "react";
import PropTypes from "prop-types";


const Wrapper = styled.div`
    display: flex;
    justify-content: ${({rightAlign, centerAlign}) => rightAlign ? 'flex-end' : centerAlign ? 'space-evenly' : 'flex-start'};
    flex-wrap: wrap;

    button {
        flex: 0 1 auto;
        margin-bottom: 0.5rem;
        margin-left: ${({rightAlign}) => rightAlign ? '0.5rem' : 0};
        margin-right: ${({leftAlign}) => leftAlign ? '0.5rem' : 0};
    }
`;

const ButtonBar = props => {
    return <Wrapper rightAlign={props.align === 'right'} leftAlign={props.align === 'left'} centerAlign={props.align === 'center'}>
        {props.children}
    </Wrapper>
}

ButtonBar.propTypes = {
    align: PropTypes.oneOf(['center', 'right', 'left']),
};

export default ButtonBar;