import React, { useEffect, useState } from "react";

const blocks = [
    // '▀', // Upper half block
    // '▁', // one eighth block
    '▂', // one quarter block
    // '▃', // three eighths block
    '▄', // half block
    // '▅', // five eighths block
    '▆', // three quarters block
    // '▇', // seven eighths block
    '█', // block
    // '▉', // seven eighths block
    // '▊', // three quarters block
    // '▋', // five eighths block
    // '▌', // half block
    // '▍', // three eighths block
    // '▎', // one quarter block
    // '▏', // one eighth block
    '▐', // half block
    '░', // shade
    '▒', // shade
    '▓', // shade
    // '▔', // one eighth block
    // '▕', // one eighth block
    '▖', // lower left
    '▗', // lower right
    '▘', // upper left
    '▙', // upper left and lower left and lower right
    '▚', // upper left and lower right
    '▛', // upper left and upper right and lower left
    '▜', // upper left and upper right and lower right
    '▝', // upper right
    '▞', // upper right and lower left
    '▟'
]



function seededRandom(seed) {
    const x = Math.sin(seed % 99999999) * 10000;
    return x - Math.floor(x);
}

// displays a secret from jwt
const Secret = props => {
    // let bytes = [];

    // const [intcode, setIntcode] = useState(0);
    
    // useEffect(() => {
    //     const jwt = localStorage.getItem("jwt");
    //     for (let i = 0; i < jwt.length; i++) {
    //         bytes.push(jwt.charCodeAt(i));
    //     }
    //     setIntcode(parseInt(bytes.slice(88,93).join("")));
    // }, []);

    // let max = props.max || 8;
    // let randomArray = Array.from(Array(max).keys()).map(index => {
    //     return seededRandom(intcode+index);
    // })
    return (
        <span>
            ••••••
            {/* {Array.from(Array(max).keys()).map(index => {
                return <span key={index}>{blocks[Math.floor(randomArray[index] * blocks.length)]}</span>
            })} */}
        </span>
    )
};

export { Secret }