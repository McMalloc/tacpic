const original = [
    {i: "Canvas",       x: 0, y: 0, w: 12, h: 12,    visible: true,  static: false},
    {i: "Importer",     x: 0, y: 0, w: 12, h: 12,     visible: true,  static: false}
];

const categorise = [ //TODO default aus config laden
    // {i: "Canvas",       x: 5, y: 0, w: 6, h: 25,    visible: true,  static: false},
    {i: "Category",     x: 0, y: 0, w: 12, h: 25,     visible: true,  static: false}
];

const layout = [
    {i: "Pages",        x: 0, y: 0, w: 6, h: 10,     visible: true,  static: false},
    {i: "Canvas",       x: 0, y: 0, w: 6, h: 10,     visible: true,  static: false},
    {i: "Document",     x: 6, y: 0, w: 6, h: 20,     visible: true,  static: false}
];

const drawing = [
    {
        i: 'Pages',
        x: 9,
        y: 0,
        w: 3,
        h: 5,
        visible: true,
        'static': false
    },
    {
        i: 'Objects',
        x: 0,
        y: 0,
        w: 4,
        h: 11,
        visible: true,
        'static': false
    },
    {
        i: 'Toolbox',
        x: 4,
        y: 0,
        w: 5,
        h: 5,
        visible: true,
        'static': false
    },
    {
        i: 'Context',
        x: 0,
        y: 0,
        w: 4,
        h: 17,
        visible: true,
        'static': false
    },
    {
        i: 'Canvas',
        x: 4,
        y: 0,
        w: 8,
        h: 23,
        visible: true,
        'static': false
    }
];

const key = [
    {i: "Canvas",       x: 0, y: 0, w: 5, h: 20,    visible: true,  static: false},
    {i: "Key",          x: 6, y: 0, w: 3, h: 14,    visible: true,  static: false},
    {i: "Context",      x: 0, y: 1, w: 4, h: 5,     visible: false, static: false}
];

const verbalizing = [
    {i: "Canvas",       x: 0, y: 0, w: 5, h: 20,    visible: true,  static: false},
    {i: "Verbalizer",          x: 6, y: 0, w: 3, h: 14,    visible: true,  static: false}
];

const proofing = [
    {
        i: 'Canvas',
        x: 3,
        y: 0,
        w: 8,
        h: 23,
        visible: true,
        'static': false
    },
    {
        i: 'Proofing',
        x: 0,
        y: 0,
        w: 3,
        h: 9,
        visible: true,
        'static': false
    },
    {
        i: 'Simulator',
        x: 0,
        y: 0,
        w: 3,
        h: 8,
        visible: true,
        'static': false
    },
    {
        i: 'Comments',
        x: 0,
        y: 0,
        w: 3,
        h: 6,
        visible: true,
        'static': false
    }
];

const finishing = [
    {
        i: 'Canvas',
        x: 4,
        y: 0,
        w: 8,
        h: 23,
        visible: true,
        'static': false
    },
    {
        i: 'Metadata',
        x: 0,
        y: 0,
        w: 4,
        h: 13,
        visible: true,
        'static': false
    },
    {
        i: 'Order',
        x: 0,
        y: 0,
        w: 4,
        h: 10,
        visible: true,
        'static': false
    }
];

const layouts = [
    original,
    categorise,
    layout,
    drawing,
    key,
    verbalizing,
    proofing,
    finishing
];

export default layouts;