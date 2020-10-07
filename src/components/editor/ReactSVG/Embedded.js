import React, {useEffect, useRef} from 'react'
import transform from "./transform";
import {createPattern} from "./Patterns";
import methods from "./methods/methods";

const Embedded = props => {
    const parent = useRef();
    useEffect(() => {
        parent.current.innerHTML = props.markup
    }, [props.markup])

    const bbox = methods.embedded.getBBox(props);
    const transformProperty = transform(props.x, props.y,
        props.angle, bbox.width, bbox.height, props.width / props.originalWidth, props.height / props.originalHeight);

    return (
        <g  data-uuid={props.uuid}
            id={props.uuid}
            data-group={true}
            data-transformable={true}
            data-selectable={true}
            transform={transformProperty}
            ref={parent} />
    )
}

export default Embedded;