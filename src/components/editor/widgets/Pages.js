import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "../../gui/Button";
import PagePreview from "../../gui/PagePreview";
import styled from 'styled-components';
import {Lower, Upper} from "../../gui/WidgetContainer";

// const Wrapper = styled.div`
//   display: flex;
//   //align-items: flex-start;
//   flex-direction: column;
//   height: 100%;
// `;
//
// const Upper = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   flex: 1 1 auto;
// `;
//
// const Lower = styled.div`
//   align-self: flex-end;
//   display: flex;
// `;

class Pages extends Component {

    render() {
        return (
            <>
                <Upper>
                    {this.props.file.pages.map((page, i) =>
                        <PagePreview
                            width={this.props.uiwidth}
                            height={this.props.uiheight}
                            current={i === this.props.uicurrentPage}
                            markup={page.cache}
                            key={i}
                            onClick={() => this.props.changePage(i)}
                            title={page.name} />
                        // TODO: page preview, das neue seite erzeugt
                    )}
                </Upper>

                <Lower>
                    <Button icon={"trash-alt"} onClick={() => {}}>Entfernen</Button> &ensp;
                    <Button primary icon={"plus"} onClick={() => this.props.addPage()}>Neue Seite</Button>
                </Lower>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        file: state.editor.file,
        width: state.editor.ui.width,
        height: state.editor.ui.height,
        currentPage: state.editor.ui.currentPage
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