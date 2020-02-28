import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  flex: 1 0 25%;
  border: 1px solid teal;
  margin: 3px;
  padding: 2px; 
  background-color: turquoise;
`;

const Preview = styled.div`
  background-image:url('${props => props.thumbnailURL}');
  background-repeat:no-repeat;
  background-size:contain;
  height: 200px;
`;

export default props => {
    return (
        <Wrapper>
            <Link className={'no-styled-link'} to={props.url}>
                <div onClick={props.onClick}
                     style={{border: "1px solid teal", margin: 3, padding: 2, backgroundColor: "turquoise"}}>
                    {props.id}: {props.title} ({props.variants.length} Varianten)
                </div>

                <Preview thumbnailURL={"http://localhost:9292/static/thumbnails/thumbnail-" + props.variants[0].id + "-sm.png"}>

                </Preview>
            </Link>
        </Wrapper>
    )
};