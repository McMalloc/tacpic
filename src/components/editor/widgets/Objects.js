import React, {Component} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Treeview} from "../../gui/Treeview";
import {Button} from "../../gui/Button";
import {Row} from "../../gui/Grid";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-content: space-between;
`;

const Upper = styled.div`
  flex: 1 1 auto;
`;

const Lower = styled.div`
  //align-self: ;
`;

class Objects extends Component {
    render() {
        return (
            <Wrapper>
                <Upper>
                    <Treeview options={
                        [
                            {label: "Vordergrund", value: "FG", children: this.props.objects.map((object, i) =>{
                                    return {
                                        label: object.moniker,
                                        value: object.uuid
                                    }
                                })}]
                    }/>
                </Upper>
                <Lower>
                    <Row padded={2}>
                        <div className={"col-md-6 col-md-offset-6"}>

                            <Button fullWidth icon={"long-arrow-alt-up"}>nach vorne</Button>
                        </div>
                    </Row>
                    <Row>
                        <div className={"col-md-6"}>
                            <Button icon={"folder-open"} fullWidth>Neue Gruppe</Button>
                        </div>
                        <div className={"col-md-6"}>
                            <Button fullWidth icon={"long-arrow-alt-down"}>nach hinten</Button>
                        </div>
                    </Row>
                </Lower>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        objects: state.editor.openedFile.pages[state.editor.currentPage].objects
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Objects);