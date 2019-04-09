const categorise = [ //TODO default aus config laden
    {i: "Canvas",       x: 5, y: 0, w: 6, h: 20,    visible: true,  static: false},
    {i: "Toolbox",      x: 0, y: 1, w: 2, h: 5,     visible: true,  static: false},
    {i: "Objects",      x: 0, y: 0, w: 2, h: 5,     visible: true,  static: false},
    {i: "Context",      x: 0, y: 1, w: 4, h: 7,     visible: true,  static: false},
    {i: "Proofing",     x: 5, y: 1, w: 3, h: 3,     visible: false,  static: false},
    {i: "Pages",        x: 0, y: 0, w: 2, h: 5,     visible: true, static: false}
];

const proofing = [ //TODO default aus config laden
    {i: "Canvas",       x: 5, y: 0, w: 5, h: 20,    visible: true,  static: false},
    {i: "Toolbox",      x: 0, y: 1, w: 2, h: 3,     visible: false, static: false},
    {i: "Objects",      x: 0, y: 0, w: 2, h: 5,     visible: true,  static: false},
    {i: "Context",      x: 0, y: 1, w: 4, h: 5,     visible: false, static: false},
    {i: "Proofing",     x: 0, y: 1, w: 2, h: 8,     visible: true, static: false},
    {i: "Pages",        x: 0, y: 0, w: 2, h: 3,     visible: true,  static: false}
];

const key = [ //TODO default aus config laden
    {i: "Canvas",       x: 5, y: 0, w: 5, h: 20,    visible: true,  static: false},
    {i: "Key",          x: 0, y: 0, w: 3, h: 10,     visible: true,  static: false},
    {i: "Context",      x: 0, y: 1, w: 4, h: 5,     visible: false, static: false}
];

const layouts = {
    key,
    categorise,
    proofing
};

export default layouts;