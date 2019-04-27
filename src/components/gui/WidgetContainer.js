import React, {Component} from 'react';
import styled from 'styled-components';
import {Button, FlyoutButton} from "./Button";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
`;

const TitleBar = styled.div`
  background-color: ${props => props.theme.background};
  flex: 1.6em 0 0;
  border-bottom: 1px solid ${props => props.theme.accent_1};;
  cursor: move;
  font-size: 0.8em;
  align-items: stretch;
  font-weight: 700;
  color: ${props => props.theme.accent_1};
  z-index: 0;
  display: flex;
  
  box-shadow: ${props => props.showShadow ? "0 8px 8px -8px rgba(0,0,0,0.3);" : "none"};
  transition: box-shadow 0.2s;
`;

const Content = styled.div`
  flex: 1 1 100%;
  position: relative;
  background-color: ${props => props.theme.accent_1_light};
  padding: ${props => props.theme.spacing[2]};
  overflow-x: auto; // eigentlich hidden, aber für das Canvas ganz gut
  overflow-y: auto; 
  border-top: none;
`;

// const TitleButtons = styled.div`
//   margin-left: auto;
// `;
// const MenuButton = styled(FlyoutButton)`
//   margin-right: ${props => props.theme.large_padding};
//   &>button {
//     padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
//     //box-shadow: none;
//     //background-color: white;
//     //border: 1px solid ${props => props.theme.accent_1};
//   }
// `;
// const ClosingButton = styled(Button)`
//   //box-shadow: none;
//   padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
// `;

const Title = styled.div`
  flex: 1 1 0;
  padding: ${props => props.theme.spacing[1]} 0 ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  // padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
`;

const TitleButton = styled(Button)`
  flex: 0 0 auto;
  box-shadow: none;
  
  &:active {
    box-shadow: inset 2px 2px 3px rgba(0,0,0,0.15);
  }
  
  padding: 0 ${props => props.theme.large_padding};
  border: none;
  border-left: 1px solid ${props => props.theme.accent_3};
`;

const TitleFlyout = styled(FlyoutButton)`
  flex: 0 0 auto;
  
  &>button {
      box-shadow: none;
      &:active {
        box-shadow: inset 2px 2px 3px rgba(0,0,0,0.15);
      }
      //width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: none;
      padding: 0 ${props => props.theme.large_padding};
  }
  
  border-left: 1px solid ${props => props.theme.accent_3};
`;

class WidgetContainer extends Component {
    state = {
        scrolled: false
    };

    containerRef = React.createRef();

    scrollCallback = () => {
        if (this.containerRef.current.scrollTop > 5 && !this.state.scrolled) {
            this.setState({
                scrolled: true
            })
        }
        if (this.containerRef.current.scrollTop === 0) {
            this.setState({
                scrolled: false
            })
        }
    };


    render() {
        const Component = this.props.component;
        const Menu = this.props.menu || null;
        return (
            <Wrapper id={'widget-container-' + this.props.title}>
                <TitleBar showShadow={this.state.scrolled} className="drag-handle">
                    <Title>{this.props.title}</Title>
                    {/*<TitleButtons>*/}
                    {/*{Menu !== null &&*/}
                    {/*<MenuButton className={'no-drag'} rightAlign={true} label={<i className="fas fa-bars"></i>}><Menu /></MenuButton>*/}
                    {/*}*/}
                    {/*<ClosingButton className={'no-drag'} icon={"times"} />*/}
                    {/*</TitleButtons>*/}

                    {Menu !== null &&
                    <TitleFlyout className={'no-drag'} noPad rightAlign={true}
                                 label={<i className="fas fa-bars"/>}><Menu/></TitleFlyout>
                    }
                    {/*<TitleButton className={'no-drag'} noPad icon={"times"}/>*/}
                </TitleBar>
                <Content ref={this.containerRef} onScroll={this.scrollCallback}
                         className={'widget-content'}>
                    {/*{this.props.menu}*/}
                    <Component/>
                </Content>
            </Wrapper>
        );
    }
}

export default WidgetContainer;