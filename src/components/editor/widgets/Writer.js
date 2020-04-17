import React, {Component, useEffect} from 'react';
import styled from 'styled-components';

// const Widget = styled.div`
//   position: relative;
//   height: 300px;
// `;

const Wrapper = styled.div`
  flex: 1 1 auto;
  z-index: 0;
`;

const Textarea = styled.textarea`
  height: 100%;
  padding-right: ${(21/29) * 100}%;
  resize: none;
`;

const Writer = props => {
    let textAreaHeight = 0;
    useEffect(() => {
        textAreaHeight = document.getElementById("writer-textarea").offsetHeight;
    }, []);

    console.log(textAreaHeight * (210 / 290));
    return (
        <Wrapper>
            <Textarea height={textAreaHeight} id={"writer-textarea"} />
        </Wrapper>
    )

};

export default Writer;