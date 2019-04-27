import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "../../gui/Button";
import PagePreview from "../../gui/PagePreview";
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  //align-items: flex-start;
  flex-direction: column;
  height: 100%;
`;

const Upper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
`;

const Lower = styled.div`
  align-self: flex-end;
`;

class Pages extends Component {

    render() {
        return (
            <Wrapper>
                <Upper>
                    {this.props.openedFile.pages.map((page, i) =>
                        <PagePreview
                            width={this.props.width}
                            height={this.props.height}
                            current={i === this.props.currentPage}
                            markup={page.cache}
                            key={i}
                            onClick={() => this.props.changePage(i)}
                            title={page.name} />
                        // TODO: page preview, das neue seite erzeugt
                    )}
                </Upper>

                <Lower>
                    <Button primary icon={"plus"} onClick={() => this.props.addPage()}>Neue Seite</Button>&ensp;
                    <Button icon={"trash-alt"} onClick={() => {}}>Entfernen</Button>
                </Lower>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        openedFile: state.editor.openedFile,
        width: state.editor.width,
        height: state.editor.height,
        currentPage: state.editor.currentPage
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePage: nr => {
            dispatch({
                type: "PAGE_CHANGE",
                number: nr
            })
        },
        addPage: () => {
            dispatch({
                type: "PAGE_ADD"
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Pages);