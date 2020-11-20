import React from 'react';
import {useSelector} from "react-redux";
import ShapeContext from "./ShapeContext";
import LabelContext from "./LabelContext";
import {find} from 'lodash';
import Keyedit from "../Keyedit";
import styled from 'styled-components/macro';

const Wrapper = styled.div`
    width: 230px;
`;

// to refactor to function component
const Context = () => {
    const type = useSelector(state => find(state.editor.file.present.pages[state.editor.ui.currentPage].objects, { uuid: state.editor.ui.selectedObjects[0] }) || {}).type
    let content = null;
    switch (type) {
        case "path":
        case "ellipse":
        case "rect":
            content = <ShapeContext />;
            break;
        case "label":
            content = <LabelContext />;
            break;
        case "key":
            content = <Keyedit />;
            break;
    }

    return <Wrapper>
        <p><strong>Eigenschaften</strong></p>
        {content}
    </Wrapper>
}

export default Context;