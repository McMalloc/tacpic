import React from "react";
import methods, { combineBBoxes } from "./methods/methods";
import { useDispatch, useSelector } from "react-redux";
import transform from "./transform";

const doubleClickHandler = (dispatch, selected, onModeChange) => {
  if (selected.length === 1) {
    let lastSelectedId = selected[0].uuid;
    if (selected[0].type === "label") {
      setTimeout(() => {
        document.getElementById("editable_" + lastSelectedId).focus();
      }, 0);
      startEditing(dispatch, lastSelectedId);
    } else if (selected[0].type === "path") {
      onModeChange(selected[0].uuid);
      startEditing(dispatch, lastSelectedId);
    }
  }
};

const startEditing = (dispatch, uuid) => {
  dispatch({
    type: "OBJECT_PROP_CHANGED",
    prop: "editMode",
    value: true,
    uuid,
  });

  dispatch({
    type: "OBJECT_SELECTED",
    uuids: [null],
  });
};

const RotationGrabber = (props) => (
  <path
    transform={`scale(0.15) translate(${props.offset / 0.15} ${-20})`}
    className={"svg-icon"}
    transform-origin={"inherit"}
    style={{ fill: "#000000", strokeWidth: 1 }}
    d={
      "M0,0 c-0.1563604,-0.74611,-5.9982504,-71.22169,-5.9098204,-71.29515c0.0331,-0.0275,3.92971,1.06426,8.6591404,2.42614c4.7294299,1.36189,8.7652299,2.44871,8.9684399,2.41517c0.20322,-0.0335,0.53686,-0.6563,0.74143,-1.38391c0.95044,-3.38052,2.91514,-9.08551,4.35445,-12.64423c10.3195697,-25.51538,28.6577397,-46.97345,52.2137997,-61.097c4.60132,-2.75883,13.16311,-7.02466,17.69514,-8.81645c20.27967,-8.01779,41.362247,-10.71923,62.862897,-8.055c48.01243,5.9494,88.77113,39.58285,103.92078,85.75379l1.18377,3.60778l2.15413,-0.65889c1.18475,-0.3624,4.77046,-1.47299,7.96822,-2.46798c3.19775,-0.995,5.85316,-1.77002,5.90089,-1.72227c0.13618,0.13617,-4.97514,70.566,-5.18361,71.42584c-0.17433,0.71909,-1.56998,-1.01386,-22.23216,-27.60501c-12.12539,-15.60474,-21.97923,-28.43919,-21.89742,-28.52099c0.0818,-0.0818,3.92028,-1.32076,8.52996,-2.75323c4.60968,-1.43248,8.4461,-2.66937,8.52539,-2.74865c0.0793,-0.0793,-0.24929,-1.36042,-0.73016,-2.84697c-12.3053,-38.04045,-44.84759,-66.68246,-83.89888,-73.84336c-7.64537,-1.40194,-10.34663,-1.6195,-20.10833,-1.6195c-9.7638,0,-12.45956,0.21791,-20.08935,1.62389c-39.527217,7.28391,-72.310807,36.4878,-84.276167,75.07392c-0.67159,2.16578,-1.17325,3.98561,-1.11478,4.04408c0.0585,0.0585,3.5709,1.08444,7.8054,2.27993c4.2345,1.1955,7.73279,2.25365,7.77398,2.35144c0.0412,0.0978,-2.48496,3.54592,-5.61366,7.66251c-3.12869,4.11658,-8.01026,10.5476,-10.84791,14.29116c-9.3126797,12.28568,-26.7984296,35.27812,-27.0128296,35.51982c-0.11548,0.13019,-0.26971,-0.0484,-0.34274,-0.39688"
    }
  />
);

const Manipulator = (props) => {
  const selected = [props.selected];

  const { scalingFactor, viewPortX, viewPortY } = useSelector(
    (state) => state.editor.ui
  );
  const dispatch = useDispatch();

  if (!selected) return null;
  if (!selected[0]) return null;
  // if (Object.keys(selected[0]).length === 0 && selected[0].constructor === Object) return null;

  let width, height, transformProperty;
  if (selected.length === 1) {
    // single objects
    const bbox = methods[selected[0].type].getBBox(selected[0]);
    width = bbox.width * scalingFactor;
    height = bbox.height * scalingFactor;
    transformProperty = transform(
      bbox.x * scalingFactor + viewPortX,
      bbox.y * scalingFactor + viewPortY,
      selected[0].angle,
      width,
      height
    );
  } else if (selected.length > 1 || selected.type === "group") {
    // multiple selected
    const bbox = combineBBoxes(selected);
    width = bbox.width;
    height = bbox.height;
    transformProperty = transform(bbox.x, bbox.y, 0, width, height);
  }
    
    const uiColor = 'rgba(255, 20, 147, 0.8)'

  return (
    <g transform={transformProperty}>
      <rect
        fill={"none"}
        // filter="url(#f1)"
        style={{ outline: "2px dashed " + uiColor }}
        data-transformable={1}
        data-role={"MANIPULATOR"}
        onDoubleClick={() =>
          doubleClickHandler(dispatch, selected, props.onModeChange)
        }
        width={width}
        height={height}
      />
      {selected.length === 1 && (
        <>
          {selected[0].type !== "path" && selected[0].type !== "label" && (
              <g
                transform-origin={"inherit"}
                transform={`scale(0.5) translate(${
                  (width / 2 - 20) / 0.5
                } ${-20})`}
              >
                <path
                  style={{ fill: uiColor, strokeWidth: 1, cursor: "pointer" }}
                  data-role={"ROTATE"}
                  d={
                    "M0,0 c0.0932,-2.43748,0.30751,-8.73942,0.47633,-14.00433c0.16882,-5.2649,0.38924,-9.65484,0.48981,-9.75541c0.10058,-0.10058,1.52367,0.37961,3.16243,1.06708c2.05004,0.86001,3.01316,1.14917,3.08726,0.92688c0.0592,-0.17769,0.80193,-1.36097,1.65044,-2.62951c1.56521,-2.34002,4.25046,-5.1054,6.38048,-6.5709c3.02709,-2.08269,7.44535,-3.8589,11.80745,-4.74678c3.34932,-0.68173,12.71567,-0.66146,16.0555,0.0348c8.55341,1.78301,14.86582,5.77624,18.75505,11.86445l0.97105,1.5201l2.66627,-1.338c1.46645,-0.7359,2.70624,-1.29803,2.75509,-1.24918c0.11268,0.11268,2.44059,28.35529,2.34717,28.47633c-0.0529,0.0686,-15.54135,-14.41347,-20.0595,-18.75606l-0.76695,-0.73715l3.36552,-1.68675l3.36551,-1.68676l-1.16146,-1.5761c-2.41376,-3.27548,-5.72879,-5.56032,-10.12108,-6.97584c-3.34431,-1.07778,-6.01878,-1.44629,-10.45104,-1.44003c-7.69526,0.0109,-13.27954,1.87217,-17.46626,5.8217c-1.69243,1.59656,-3.43583,3.88678,-3.43583,4.5135c0,0.15076,1.27993,0.80616,2.84427,1.45644c1.56435,0.65029,2.84427,1.30319,2.84427,1.45088c0,0.25941,-19.35956,20.45246,-19.60827,20.45246c-0.0676,0,-0.0467,-1.9943,0.0465,-4.43177z"
                  }
                />
                <path
                  style={{ strokeWidth: 2, stroke: uiColor, cursor: "pointer" }}
                  d={`M35,15 v-35`}
                />
                <circle cx={35} cy={-15} fill={uiColor} r={6} />
                <path
                  style={{
                    fill: "transparent",
                    strokeWidth: 1,
                    cursor: "pointer",
                  }}
                  data-role={"ROTATE"}
                  d={
                    "M0,0 l69.18854,-0.66145l-17.4625,-32.94063l-35.85104,0.66146z"
                  }
                />
              </g>
          )}

{selected[0].type !== "path" &&
              <path
                              data-role={"SCALE"}
                              style={{cursor: 'nwse-resize', fill: uiColor}}
                d={`M${width+5},${height+5} h${-25} l${25}${-25} z`}
              />
          }
        </>
      )}
    </g>
  );
};

export default Manipulator;
