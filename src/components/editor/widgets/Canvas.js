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

            // <Wrapper>
            //     {/*<Ruler/>*/}
            //     {this.props.file.backgroundURL &&
            //         <Background src={"images/beispiele/" + this.props.file.backgroundURL}/>
            //     }
            //     <Popover
            //         preferPlace={"above"}
            //         tipSize={12}
            //         onOuterAction={() => this.setState({showHint: false})}
            //         isOpen={this.state.showHint}
            //         body={<Hint>Ziehen Sie hier ein Rechteck mit der linken Maustaste auf, um zu beginnen.</Hint>}>
            //         <InteractiveSVG/>
            //     </Popover>
            // </Wrapper>
        )

};

export default Canvas;