import styled from 'styled-components/macro';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

const Wrapper = styled.div`
  margin: 6px;
`;

const Menu = styled.div`
  position:fixed;
  background-color: ${props => props.theme.background};
  border-radius: ${props => props.theme.border_radius};
  //width: 100%;
  box-shadow: -1px 1px 11px 0px rgba(0, 0, 0, 0.87);
  z-index: 101;
  top: 0;
  left: 0;

  .menu-header {
    display: flex;
    justify-content: space-between;
    padding: 6px;
  }
  
  ul {
    display: block;
    list-style-type: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: 6px;
      margin: 0;
    }
  }
`;

const Backdrop = styled.div`
  position:fixed;
  z-index: 100;
  margin: -6px;
  box-sizing: border-box;
  background-color: rgba(3,113,113,0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Burgermenu = props => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Wrapper>
      <Button aria-label={t('openMenu')} title={t('openMenu')} style={{width: 35}} onClick={() => setCollapsed(!collapsed)} icon={"bars"} label={""} />
      {!collapsed &&
        <>
          <Backdrop onClick={() => setCollapsed(true)} />
          <Menu onClick={() => setCollapsed(!collapsed)}>
            <div className={'menu-header'}>
              <Button aria-label={t('closeMenu')} title={t('closeMenu')} style={{width: 35}} icon={"times"} /> 
                  {props.headerAction}
            </div>
            
            <ul>
              {props.children.map((component, index) => {
                if (Array.isArray(component)) {
                  return <React.Fragment key={index}>
                    {component.map((element, i) => <li key={i}>{element}</li>)}
                  </React.Fragment>
                }
                return <li key={index}>{component}</li>
              })}
            </ul>

          </Menu>
        </>
      }
    </Wrapper>
  )
};

export { Burgermenu }