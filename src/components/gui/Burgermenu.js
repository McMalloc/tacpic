import styled from 'styled-components/macro';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Icon} from "./_Icon";

const Button = styled.div`
    color: ${props => props.theme.brand_secondary};
    text-decoration: none;
    border-radius: ${props => props.theme.border_radius};
    padding: ${props => props.theme.base_padding};
    display: block;
    border: 1px solid transparent;
    font-size: 18px;
`;

const Menu = styled.div`
  position:fixed;
  background-color: ${props => props.theme.background};
  width: 100%;
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
  background-color: rgba(3,113,113,0.5);
  width: 100%;
  height: 100%;
`;

const Burgermenu = props => {
    const {t} = useTranslation();
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>
            <Button onClick={() => setCollapsed(!collapsed)}><Icon icon={"bars"}/></Button>
            {!collapsed &&
                <>
                    <Backdrop onClick={() => setCollapsed(true)}/>
                    <Menu onClick={() => setCollapsed(!collapsed)}>
                        <Button><Icon icon={"times"}/></Button>
                        <ul>
                            {props.children.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>

                    </Menu>
                </>
            }
        </>
    )
};

export {Burgermenu}