import React, {useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import { TOOLS } from '../../config/constants';

const Wrapper = styled.text`
  visibility: hidden;
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
`;

const ToolIndicator = props => {
    console.log("indicator rendered");
    if (!!props.hide || props.tool === 'SELECT') return null;
    return (
            <Wrapper x={props.coords[0] + 20} y={props.coords[1] + 30} id={'tool-indicator'}>
                {TOOLS[props.tool].unicode}
            </Wrapper>
    );

}

export default ToolIndicator;