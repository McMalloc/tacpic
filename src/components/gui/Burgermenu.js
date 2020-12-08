import styled from 'styled-components/macro';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Icon} from "./_Icon";
import { Button } from "./Button";

const Menu = styled.div`
  position:fixed;
  background-color: ${props => props.theme.background};
  border-radius: ${props => props.theme.border_radius};
  //width: 100%;
  box-shadow: -1px 1px 11px 0px rgba(0, 0, 0, 0.87);
  z-index: 101;
  
  ul {
    display: block;
    list-style-type: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: 6px;
    }
  }
`;

const Backdrop = styled.div`
  position:fixed;
  z-index: 100;
  margin: -6px;
  box-sizing: border-box;
  background-color: rgba(3,113,113,0.5);
  width: 100%;
  height: 100%;
`;

const Burgermenu = props => {
    const {t} = useTranslation();
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>
            <Button large onClick={() => setCollapsed(!collapsed)} icon={"bars"} label={""} />
            {!collapsed &&
                <>
                    <Backdrop onClick={() => setCollapsed(true)}/>
                    <Menu onClick={() => setCollapsed(!collapsed)}>
                        <Button large icon={"times"} />
                        <ul>
              {props.children.map((component, index) => {
                if (Array.isArray(component)) {
                  return <>
                    {component.map((element, i) => <li key={i}>{element}</li>)}
                  </>
                }
                return <li key={index}>{component}</li>
              })}
                        </ul>

                    </Menu>
                </>
            }
        </>
    )
};

export {Burgermenu}