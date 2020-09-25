import React, {useState} from "react";
import styled, {useTheme} from "styled-components";
import PropTypes from "prop-types";
import StepIndicator from "./StepIndicator";

const Wrapper = styled.div`
  height: ${props=>props.collapsed ? props.height + 'em': 'auto'};
  overflow: hidden;
  transition: height 0.2s;
  position: relative;
  text-overflow: ellipsis;

  &:before {
    position: absolute;
    content: "";
    display: ${props=>props.collapsed ? 'block': 'none'};
    bottom: 0; left: 0; right: 0;
    height: 70%;
    background: linear-gradient(180deg, ${props=>props.background}00 0%, ${props=>props.background}cc 50%, ${props=>props.background}ff 90%, ${props=>props.background}ff 100%);
`;

const Hint = styled.div`
  position: absolute;
  width: 100%;
  font-size: 90%;
  text-shadow: 1px 1px 0 white;
  text-align: center;
  bottom: 0;
`;

const More = props => {
    const [collapsed, setCollapsed] = useState(true);
    const theme = useTheme();
    const background = theme[props.background] || theme.grey_6;
    return (
        <Wrapper height={props.height || 5} background={background} onClick={() => setCollapsed(!collapsed)} collapsed={collapsed}>
           {props.children}
           {collapsed && <Hint>Klicken, um mehr zu zeigen</Hint> }
        </Wrapper>
    );
};

More.propTypes = {
    background: PropTypes.string, // #xxxxxx. default: theme.grey_6
    height: PropTypes.number // in em. default: 5
};

export default More;