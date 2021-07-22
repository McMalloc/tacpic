import styled from 'styled-components/macro';
import React from "react";
import PropTypes from "prop-types";


const Wrapper = styled.div`
    display: flex;
    justify-content: ${({rightAlign, centerAlign}) => rightAlign ? 'flex-end' : centerAlign ? 'center' : 'flex-start'};
    flex-wrap: wrap;

    button {
        flex: 0 1 auto;
        margin-bottom: 0.5rem;
        margin-left: ${({rightAlign}) => rightAlign ? '0.5rem' : '1rem'};
        margin-right: ${({leftAlign}) => leftAlign ? '0.5rem' : '1rem'};
    }
`;

const ButtonBar = props => {
    return <Wrapper className={'button-bar'} rightAlign={props.align === 'right'} leftAlign={props.align === 'left'} centerAlign={props.align === 'center'}>
        {props.children}
    </Wrapper>
}

ButtonBar.propTypes = {
    align: PropTypes.oneOf(['center', 'right', 'left']),
};

export default ButtonBar;