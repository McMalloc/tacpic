import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "../../gui/Button";
import PagePreview, {BraillePagePreview, GraphicPagePreview} from "../../gui/PagePreview";
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
                    {this.props.file.pages.map((page, i) => {
                        return (
                            page.text ?
                                <BraillePagePreview
                                    width={this.props.width}
                                    height={this.props.height}
                                    current={i === this.props.currentPage}
                                    key={i} index={i}
                                    onClick={() => this.props.changePage(i)}
                                    title={page.name}/>
                                    :
                            <GraphicPagePreview
                                width={this.props.width}
                                height={this.props.height}
                                current={i === this.props.currentPage}
                                key={i} index={i}
                                onClick={() => this.props.changePage(i)}
                                title={page.name}/>

                        )}
                    )}
                </Upper>

                <Lower style={{flexDirection: "column"}}>
                    <Button icon={"trash-alt"} onClick={() => {}}>Entfernen</Button>
                    <Button primary icon={"image"} onClick={() => this.props.addPage(false)}>Neue Grafik-Seite</Button>
                    <Button primary icon={"braille"} onClick={() => this.props.addPage(true)}>Neue Braille-Seite</Button>
                </Lower>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        file: state.editor.file,
        width: state.editor.file.width,
        height: state.editor.file.height,
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
        addPage: isTextPage => {
            dispatch({
                type: "PAGE_ADD",
                isTextPage
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Pages);