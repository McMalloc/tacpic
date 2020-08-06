import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {Icon} from "./_Icon";

const Heading = styled.span`
  cursor: pointer;
  text-decoration: ${props=>props.expanded ? 'underline' : 'none'};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  height: ${props=>props.expanded ? 'auto' : 0};
  overflow: hidden;
`;



const Expander = props => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <Icon icon={expanded ? "caret-down" : "caret-right"} />&emsp;
            <Heading expanded={expanded} onClick={() => setExpanded(!expanded)}>{props.children[0]}</Heading>
            <Content expanded={expanded}>{props.children[1]}</Content>
        </>
    )
};

export default Expander;