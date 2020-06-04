import styled from 'styled-components/macro';
import React, {Component} from "react";
import {times, uniq, without, indexOf} from 'lodash';
import {Icon} from "./_Icon";
import {Button} from "./Button";

const Wrapper = styled.div`
  //font-size: 0.9em;
  
  &>ul { // top-level node
    margin: 0;
  }
`;

const Tree = styled.ul`
  //transition: width 0.5s;
  list-style: none;
  margin: 0.5em 0;
  padding-left: 1em;
`;

const TreeItem = styled.li`
  display: flex;
  min-height: 30px;
  
  .treeitem-button {
    display: none;
  }
  
  &:hover .treeitem-button {
    display: inline;
  }
`;

const TreeLabel = styled.button`
  font-size: inherit;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: left;
  
  color: ${props => props.selected ? props.theme.brand_secondary : "inherit"};
  font-weight: ${props => props.selected ? 700 : "inherit"};
  text-decoration: ${props => props.selected ? 'underline' : "none"};

   position: relative;
   padding: ${props => props.theme.base_padding};
   
   &:hover {
    text-decoration: underline;
    // background-color: ${props => props.theme.background};
   }
`;

const TreeIcon = styled.span`
  position: absolute;
  left: ${props => props.expanded ? "-1em" : "-0.9em"};
  width: 1em;
  height: 1.2em;
  
  &:hover {
    background-color: ${props => props.theme.background};
  }
`;

class Treeview extends Component {
    state = {
        expandedValues: [],
        selected: null
    };

    toggle = (value) => {
        let position = indexOf(this.state.expandedValues, value);
        if (position < 0) {
            this.setState({expandedValues: uniq([...this.state.expandedValues, value])});
        } else {
            let newExpanded = [...this.state.expandedValues];
            newExpanded.splice(position, 1);
            this.setState({expandedValues: newExpanded});
        }
    };

    renderNode(nodes, depth) {
        if (typeof depth === 'number')
            depth++;
        else
            depth = 0;
        return nodes.map((node, index) => {
            let expanded = !(indexOf(this.state.expandedValues, node.value) >= 0);
            return (
                <>
                    <TreeItem depth={depth} key={index}>

                        <TreeLabel selected={this.props.selected === node.value} tabIndex={0}
                                   onClick={() => this.props.onSelect && this.props.onSelect(node.value)}>
                            {node.children && node.children.length > 0 &&
                            <TreeIcon onClick={() => this.toggle(node.value)} expanded={expanded}><Icon
                                icon={expanded ? "caret-down" : "caret-right"}/></TreeIcon>
                            }
                            {node.label}
                        </TreeLabel>
                        {node.buttons && node.buttons.map(button =>
                            <Button className={'treeitem-button'} aria-label={button.label} icon={button.icon}
                                    onClick={button.action}>
                            </Button>)}

                    </TreeItem>
                    {node.children && node.children.length > 0 && expanded &&
                    <Tree>
                        {this.renderNode(node.children, depth)}
                    </Tree>
                    }

                </>
            )
        })
    }

    render() {
        return (
            <Wrapper>
                <Tree depth={0}>
                    {this.renderNode(this.props.options)}
                </Tree>
            </Wrapper>
        )
    }
}

export {Treeview}