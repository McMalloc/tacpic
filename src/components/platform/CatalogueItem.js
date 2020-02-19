import React from "react";

export default props => {
    return (
        <p onClick={props.onClick} style={{border:"1px solid teal",margin:3, padding: 2, backgroundColor: "turquoise"}}>
            {props.id}: {props.title} ({props.variants.length} Varianten)
            <img style={{width:200,height:'auto'}} src={"http://localhost:9292/static/thumbnails/thumbnail-" + props.variants[0].id + "-sm.png"}/>
        </p>
    )
};