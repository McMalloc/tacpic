import React from "react";
import styled from 'styled-components';

const Wrapper = styled.span`
  margin-right: ${props => props.theme.base_padding};
`;

/*TODO: Padding sollte auch links sein können
*
* */

const Icon = props => {
    return (
        typeof props.icon !== 'undefined' && props.icon !== null ?
                <Wrapper><i className={"fas fa-" + props.icon}/></Wrapper> : null
    )

};

export {Icon}