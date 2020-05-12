import React from "react";
import transform from "./transform";

const filledRect = (colour) => {
    if (colour === undefined) return null;
    if (colour === null) colour = "transparent";
    return <rect x={0} y={0} width={"100%"} height={"100%"} fill={colour}/>
};

// TODO Muster sollten nicht mittransformiert werden
export default {
    diagonal_lines: ({scaleX, scaleY, angle}, uuid, fill) => {
        return (

            <pattern patternUnits={"userSpaceOnUse"} id={'pattern-diagonal_lines-' + uuid}
                     patternTransform={transform(0, 0, angle)} width={"5.08mm"} height={"5.08mm"}>
                {filledRect(fill)}
                <line x1={"7.12mm"} y1={"-1.27mm"} x2={"-0.5mm"}
                      y2={"6.35mm"} stroke={"black"} strokeWidth={"0.8mm"}/>
                <line x1={"2.04mm"} y1={"-1.27mm"} x2={"-1.77mm"} y2={"2.54mm"} stroke={"black"} strokeWidth={"0.8mm"}/>
            </pattern>
        )
    },
    full: ({scaleX, scaleY, angle}, uuid, fill) => {
        return (

            <pattern id={"pattern-full-" + uuid} width={"2.5mm"}
                     height={"2.5mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <circle cx={"1.25mm"} cy={"1.25mm"}
                        r={"0.6mm"} fill={"black"} stroke={"none"}/>
            </pattern>
        )
    },
    bigdots: ({scaleX, scaleY, angle}, uuid, fill) => {
        return (
            <pattern patternUnits={"userSpaceOnUse"} id={'pattern-bigdots-' + uuid}
                     patternTransform={transform(0, 0, angle)} width={20} height={20}>
                {filledRect(fill)}
                <circle cx={11} cy={11} r={6}/>
            </pattern>
        )
    },
    dotted: (object, uuid, fill) => {
        return (
            <pattern id={"pattern-dotted-" + uuid} width={"10mm"}
                     height={"10mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <circle cx={"1.25mm"} cy={"1.25mm"} r={"1mm"} fill={"black"} stroke={"none"}/>
                <circle cx={"6.25mm"} cy={"6.25mm"} r={"1mm"} fill={"black"} stroke={"none"}/>
            </pattern>
        )
    },
    stair: (object, uuid, fill) => {
        return (
            <pattern id={"pattern-stair-" + uuid}
                     width={"15mm"} height={"15mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <svg xmlns={"http://www.w3.org/2000/svg"}
                     version={"1.1"} width={"15mm"}
                     height={"15mm"} viewBox={"0 0 15 15"}>
                    <polyline points={"-1,3.75 3.75,3.75 3.75,-1"} stroke={"black"} strokeWidth={"1.8"}
                              fill={"none"} />
                    <polyline points={"3.75,15.8 3.75,11.25 11.25,11.25 11.25,3.75 15.8,3.75"}
                              stroke={"black"} strokeWidth={"1.8"}
                              fill={"none"} />
                </svg>
            </pattern>
        )
    },
    dashed: ({scaleX, scaleY, angle}, uuid, fill) => {
        return (
            <pattern patternUnits={"userSpaceOnUse"} id={'pattern-dashed-' + uuid}
                     patternTransform={transform(0, 0, angle)} width={20} height={20}>
                {filledRect(fill)}
                <line style={{stroke: 'rgb(0,0,0)', strokeWidth: 2}} x1={0} y1={0} x2={5} y2={5}/>
                <line style={{stroke: 'rgb(0,0,0)', strokeWidth: 2}} x1={10} y1={10} x2={15} y2={15}/>
            </pattern>
        )
    },
    blank: (object, uuid, fill) => {
        return (
            <pattern patternUnits={"userSpaceOnUse"} id={'pattern-blank-' + uuid} width={20} height={20}>
                {filledRect(fill)}
            </pattern>
        )
    },
    vertical_lines: (object, uuid, fill) => {
        return (
            <pattern id={"pattern-vertical_lines-" + uuid}
                     width={"5mm"}
                     height={"0.5mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <line x1={"1.25mm"} y1={"-1mm"} x2={"1.25mm"}
                      y2={"1.5mm"} stroke={"black"} strokeWidth={"1.3mm"}/>
            </pattern>
        )
    },
    horizontal_lines: (object, uuid, fill) => {
        return (
            <pattern id={"pattern-horizontal_lines-" + uuid}
                     width={"0.5mm"}
                     height={"5mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <line y1={"1.25mm"} x1={"-1mm"} y2={"1.25mm"}
                      x2={"1.5mm"} stroke={"black"} strokeWidth={"1.3mm"}/>
            </pattern>
        )
    },
    dashed_lines: (object, uuid, fill) => {
        return (
            <pattern id={"pattern-dashed_lines-" + uuid}
                     width={"7.62mm"} height={"7.62mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <line x1={"1.25mm"} y1={"1.1mm"} x2={"1.25mm"}
                      y2={"6mm"} stroke={"black"} strokeWidth={"1mm"}/>
                <line x1={"6.28mm"} y1={"1.1mm"} x2={"6.28mm"}
                      y2={"6mm"} stroke={"black"} strokeWidth={"1mm"}/>
            </pattern>
        )
    },
    grid: (object, uuid, fill) => {
        return (
            <pattern id={"pattern-grid-" + uuid} width={"7.5mm"}
                     height={"7.5mm"}
                     patternUnits={"userSpaceOnUse"}>
                {filledRect(fill)}
                <line x1={"3.75mm"} y1={"-1mm"} x2={"3.75mm"}
                      y2={"8.5mm"} stroke={"black"} strokeWidth={"1mm"}/>
                <line x1={"-1mm"} y1={"3.75mm"} x2={"8.5mm"}
                      y2={"3.75mm"} stroke={"black"} strokeWidth={"1mm"}/>
            </pattern>
        )
    }
};