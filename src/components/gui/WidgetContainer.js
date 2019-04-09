import React, {Component} from 'react';
import styled from 'styled-components';
import {Button, FlyoutButton} from "./Button";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  box-sizing: border-box;
  //font-size: 0.9em;
  //border: 3px solid ${props => props.theme.accent_1_light};
  // border-radius: ${props => props.theme.border_radius};
  box-shadow: ${props => props.theme.middle_shadow};
`;

const TitleBar = styled.div`
  //height: 1.5em;
  background-color: ${props => props.theme.accent_1_light};
  flex: 1.6em 0 0;
  border-bottom: 2px solid ${props => props.theme.accent_1};
  cursor: move;
  font-size: 0.9em;
  align-items: stretch;
 
  display: flex;
  //justify-content: flex-start;
  //align-items: center;
`;

const Content = styled.div`
  flex: 1 1 100%;
  background-color: ${props => props.theme.background};
  padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
  overflow: hidden;
  border: 2px solid ${props => props.theme.accent_1_light};
  
  // border: ${props => props.theme.base_padding} solid ${props => props.theme.accent_1_light};
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
  padding: ${props => props.theme.base_padding} 0 ${props => props.theme.base_padding} ${props => props.theme.large_padding};
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
    render() {
        const Component = this.props.component;
        const Menu = this.props.menu || null;
        return (
            <Wrapper id={'widget-container-' + this.props.title}>
                <TitleBar className="drag-handle">
                    <Title>{this.props.title}</Title>
                    {/*<TitleButtons>*/}
                        {/*{Menu !== null &&*/}
                        {/*<MenuButton className={'no-drag'} rightAlign={true} label={<i className="fas fa-bars"></i>}><Menu /></MenuButton>*/}
                        {/*}*/}
                        {/*<ClosingButton className={'no-drag'} icon={"times"} />*/}
                    {/*</TitleButtons>*/}

                    {Menu !== null &&
                        <TitleFlyout className={'no-drag'} noPad rightAlign={true} label={<i className="fas fa-bars" />}><Menu /></TitleFlyout>
                    }
                        <TitleButton className={'no-drag'} noPad icon={"times"} />
                </TitleBar>
                <Content className={'widget-content'}>
                    {/*{this.props.menu}*/}
                    <Component/>
                </Content>
            </Wrapper>
        );
    }
}

export default WidgetContainer;