import styled from 'styled-components';
import React, {Component} from "react";
import {times, uniq, without, indexOf} from 'lodash';
import {Icon} from "./_Icon";

const Wrapper = styled.div`
  font-size: 0.9em;
  
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
  
`;

const TreeLabel = styled.button`
  font-size: inherit;
  border: none;
  background-color: inherit;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: left;

   position: relative;
   padding: ${props => props.theme.base_padding};
   
   &:hover {
    background-color: ${props => props.theme.accent_1_light}
   }
`;

const TreeIcon = styled.span`
  position: absolute;
  left: ${props => props.expanded ? "-1em" : "-0.9em"};
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
                <TreeItem depth={depth} key={index}>

                    <TreeLabel tabIndex={0} onClick={() => this.toggle(node.value)}>
                        {node.children && node.children.length > 0 &&
                        <TreeIcon expanded={expanded}><Icon icon={expanded ? "caret-down" : "caret-right"} /></TreeIcon>
                        }
                        {node.label}
                    </TreeLabel>

                    {node.children && node.children.length > 0 && expanded &&
                    <Tree>
                        {this.renderNode(node.children, depth)}
                    </Tree>
                    }
                </TreeItem>
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