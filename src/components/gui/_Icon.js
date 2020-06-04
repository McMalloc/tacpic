import React from "react";
import styled from 'styled-components/macro';

const Wrapper = styled.span`
  //margin-right: ${props => props.theme.spacing[2]};
  
  &>i {
    transform: ${props => props.rotation ? "rotate(" + props.rotation + "deg)" : "none"};
  }
`;

/*TODO: Padding sollte auch links sein können
*
* */

const Icon = props => {
    return (
        typeof props.icon !== 'undefined' && props.icon !== null ?
                <Wrapper title={props.title} rotation={props.rotation}><i className={"fas fa-" + props.icon}/></Wrapper> : null
    )

};

export {Icon}