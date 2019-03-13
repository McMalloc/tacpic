import React, {Component} from 'react';
import {connect} from "react-redux";
import {canvasUpdated} from "../../../actions/index";
import styled from 'styled-components';
import InteractiveSVG from "./ReactSVG/InteractiveSVG";
import {FlyoutButton} from "../../gui/Button";

const Widget = styled.div`
  position: relative;
  height: 300px;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: 0 -50% 0 0;
  transform: translate(-50%, -50%);
`;

class Canvas extends Component {
    render() {
        // let currentPage = <InteractiveSVG />;
        return (<Widget>
            <FlyoutButton label={'Titel des Buttons'}>
                <label><input type="checkbox" /> Check me</label>
                <p><button>Klick mich</button></p>
            </FlyoutButton>
            <FlyoutButton label={'Und noch einer!'}>
                <pre>In the above examples, it is important to read the scrollHeight property in getSnapshotBeforeUpdate because there may be delays between “render” phase lifecycles (like render) and “commit” phase lifecycles (like getSnapshotBeforeUpdate and componentDidUpdate).</pre>
            </FlyoutButton>
            <Wrapper>
                <InteractiveSVG style={{margin: 0,
                    background: 'yellow',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)'}}/>
            </Wrapper>
            </Widget>)
    }
}

const mapStateToProps = state => {
    return {
        ...state.editor,
        canvasWidth: state.editor.width,
        canvasHeight: state.editor.height
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