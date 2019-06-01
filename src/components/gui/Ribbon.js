import styled from 'styled-components';
import React, {Component} from "react";
import {Icon} from "./_Icon";
import {withTranslation} from "react-i18next";
import connect from "react-redux/es/connect/connect";
import {layoutChanged, layoutSet} from "../../actions";

const Wrapper = styled.div`
  background-color: ${props => props.theme.accent_1_light};
  width: ${props => props.collapsed ? "50px" : "150px"};
  display: flex;
  flex-direction: column;
  margin-right: 1em;
  padding-top: 15%;
  
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

const Hint = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 140px;
  width: 250px;
  border: 1px solid ${props => props.theme.accent_1};
  box-shado: ${props => props.theme.distant_shadow};
  border-radius: 3px;
  background-color: ${props => props.theme.accent_1_light};
  padding: ${props => props.theme.spacing[2]};
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
        showHints: true, // TODO dirty
    };

    collapse = () => {
        this.setState({collapsed: true});
    };

    expand = () => {
        this.setState({collapsed: false});
    };

    render() {
        // Use a portal to render the children into the element
        return (
            <Wrapper collapsed={this.state.collapsed}>
                {this.props.menus.map((item, index) => {
                    return (
                        <ItemWrapper key={index}>
                            <RibbonItem
                                data-tip={"help:" + item.label}
                                active={index === this.props.activeItem}
                                onClick={() => {
                                    this.props.showHint_layout && this.setState({showHints: false});
                                    item.action();
                                    this.setState({activeItem: index})
                                }}>
                                <Icon icon={item.icon}/> <Label
                                show={!this.state.collapsed}>{index+1}. | {this.props.t(item.label)}</Label>
                            </RibbonItem>
                            {this.props["showHint_" + item.label.slice(7)] && this.state.showHints &&
                                <Hint><Icon icon={"caret-left"}/> {this.props.t(item.label + "_hint")}</Hint>
                            }
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
        showHint_category: false,
        showHint_layout: state.editor.openedFile.category !== null,
        showHint_proofing: false
    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Ribbon));