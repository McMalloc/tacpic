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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: content-box;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
`;

const Background = styled.img`
  position: absolute;
  top: 12px;
  bottom: 12px;
  right: 12px;
  width: auto;   
  max-height: 95%;
  left: 12px;
  opacity: 0.6;
`;

const Ruler = styled.div``;

class Canvas extends Component {
    hintTimer = null;
    state = {showHint: false};
    render() {
        if (this.props.currentLayout === 4 && this.hintTimer === null) {
            this.hintTimer = setTimeout(
                () => this.setState({showHint: true}),
                2000
            );
        }

        return (
            <Wrapper>
                {/*<Ruler/>*/}
                {this.props.openedFile.backgroundURL &&
                    <Background src={"images/beispiele/" + this.props.openedFile.backgroundURL}/>
                }
                <Popover
                    preferPlace={"above"}
                    tipSize={12}
                    onOuterAction={() => this.setState({showHint: false})}
                    isOpen={this.state.showHint}
                    body={<Hint>Ziehen Sie hier ein Rechteck mit der linken Maustaste auf, um zu beginnen.</Hint>}>
                    <InteractiveSVG/>
                </Popover>
            </Wrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.editor
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateCanvas: (serializedCanvas) => {
            dispatch(canvasUpdated(serializedCanvas));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);