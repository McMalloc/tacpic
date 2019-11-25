import styled from 'styled-components';
import React, {Component} from "react";
import {Icon} from "./_Icon";
import {withTranslation} from "react-i18next";
import connect from "react-redux/es/connect/connect";
import {layoutChanged, layoutSet} from "../../actions";
import {Modal} from "./Modal";
import Popover from "react-popover";
import Hint from "./Popover";

const Wrapper = styled.div`
  background-color: ${props => props.theme.accent_1_light};
  width: ${props => props.collapsed ? "50px" : "150px"};
  display: flex;
  flex-direction: column;
  margin-right: 1em;
  padding-top: 5%;
  
  &:hover > button {
    opacity: 1;
  }
`;

const Label = styled.span`
  font-size: 0.9em;
  margin-top: 0.5em;
  display: ${props => props.show ? "flex" : "none"};
`;

const RibbonItem = styled.button`
  border: none;
  border-bottom: 1px solid ${props => props.theme.accent_1};
  
  background-color: ${props => props.active ? props.theme.accent_1 : "transparent"};
  color: ${props => props.active ? props.theme.accent_1_light : props.theme.dark};
  height: 60px;
  display: flex;
  width: 100%;
  position: relative;
  flex-direction: column;
  align-items: center;
  font-size: 0.9em;
  font-weight: 700;
  padding: ${props => props.theme.spacing[2]} 0;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.accent_1 : props.theme.background};
  }  
  
  &:focus {
    background-color: ${props => props.theme.accent_1};
  }
`;

const ItemWrapper = styled.div`
position: relative;
    &:first-child {
        border-top: 1px solid ${props => props.theme.accent_1};
      }
`;

class Ribbon extends Component {
    state = {
        collapsed: false,
        showHint_original: true,
        showHint_category: true,
        showHint_layout: true,
        showHint_proofing: true
    };

    collapse = () => this.setState({collapsed: true});
    expand = () => this.setState({collapsed: false});

    hideHint = label => this.setState({["showHint_" + label]: false});

    render() {

        return (
            <Wrapper collapsed={this.state.collapsed}>
                {this.props.menus.map((item, index) => {
                    let simpleLabel = item.label.slice(7);
                    return (
                        <ItemWrapper key={index}>
                            <Popover
                                preferPlace={"right"}
                                tipSize={12}
                                onOuterAction={() => this.hideHint(simpleLabel)}
                                isOpen={this.props["showHint_" + simpleLabel] && this.state["showHint_" + simpleLabel]}
                                body={<Hint>{this.props.t(item.label + "_hint")}</Hint>}>
                                <RibbonItem
                                    // data-tip={this.props.t(item.label + "_tooltip")}
                                    title={this.props.t(item.label + "_tooltip")}
                                    active={index === this.props.activeItem}
                                    onClick={() => {
                                        item.action();
                                    }}>

                                    <Icon icon={item.icon}/> <Label
                                    show={!this.state.collapsed}>{index+1}. | {this.props.t(item.label)}</Label>
                                </RibbonItem>
                            </Popover>
                        </ItemWrapper>
                    )
                })}
                {this.props.children}

                {/*{!this.state.collapsed &&*/}
                {/*<button onClick={this.collapse}>Einklappen</button>*/}
                {/*}*/}
                {/*{this.state.collapsed &&*/}
                {/*<button onClick={this.expand}>Ausklappen</button>*/}
                {/*}*/}
            </Wrapper>


        )
    }
}

const mapStateToProps = state => {
    return {
        showHint_original: false,
        showHint_category: state.editor.file.backgroundURL.length !== 0,
        showHint_layout: state.editor.file.category !== null,
        showHint_proofing: false
    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Ribbon));