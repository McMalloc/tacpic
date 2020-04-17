import React, {Component} from 'react';
import {connect} from "react-redux";
import {canvasUpdated} from "../../../actions/index";
import styled from 'styled-components';
import InteractiveSVG from "./ReactSVG/InteractiveSVG";
import {FlyoutButton} from "../../gui/Button";
import Popover from "react-popover";
import Hint from "../../gui/Popover";

// const Widget = styled.div`
//   position: relative;
//   height: 300px;
// `;

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
`;

const Ruler = styled.div``;

const Canvas = props => {

        return (
            <Wrapper>
                <InteractiveSVG/>
            </Wrapper>
        )

};

export default Canvas;