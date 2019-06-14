const intro = [
    {
        w: 6,
        h: 25,
        x: 0,
        y: 0,
        i: 'Intro',
        moved: false,
        visible: true,
        'static': false
    }
];

const original = [
    {
        w: 8,
        h: 25,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
        visible: false,
        'static': false
    },
    {
        w: 4,
        h: 13,
        x: 8,
        y: 0,
        i: 'Importer',
        moved: false,
        visible: true,
        'static': false
    }
];

const categorise = [
    {
        w: 6,
        h: 25,
        x: 0,
        y: 0,
        i: 'Category',
        moved: false,
        visible: true,
        'static': false
    }
];

const layout = [
    {
        w: 4,
        h: 25,
        x: 8,
        y: 0,
        i: 'Pages',
        moved: false,
        visible:false,
        'static': false
    },
    {
        w: 8,
        h: 15,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
visible:false,
        'static': false
    },
    {
        w: 8,
        h: 25,
        x: 0,
        y: 7,
        i: 'Document',
        moved: false,
        visible: true,
        'static': false
    }
];

const drawing = [
    {
        w: 8,
        h: 23,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 15,
        x: 8,
        y: 16,
        i: 'Context',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 8,
        h: 2,
        x: 0,
        y: 23,
        i: 'Toolbox',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 5,
        x: 8,
        y: 0,
        i: 'Pages',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 5,
        x: 8,
        y: 5,
        i: 'Objects',
        moved: false,
        visible: true,
        'static': false
    }
];

// index 4
const key = [
    {
        w: 8,
        h: 23,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 10,
        x: 8,
        y: 16,
        i: 'Context',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 8,
        h: 2,
        x: 0,
        y: 23,
        i: 'Toolbox',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 5,
        x: 8,
        y: 0,
        i: 'Pages',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 10,
        x: 8,
        y: 5,
        i: 'Key',
        moved: false,
        visible: true,
        'static': false
    }
];

const verbalizing = [
    {
        w: 7,
        h: 25,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 5,
        h: 15,
        x: 7,
        y: 0,
        i: 'Verbalizer',
        moved: false,
        visible: true,
        'static': false
    }
];

const proofing = [
    {
        w: 8,
        h: 25,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 8,
        x: 8,
        y: 0,
        i: 'Proofing',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 8,
        x: 8,
        y: 9,
        i: 'Simulator',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 9,
        x: 8,
        y: 18,
        i: 'Comments',
        moved: false,
        visible: true,
        'static': false
    }
];

const finishing = [
    {
        w: 8,
        h: 25,
        x: 0,
        y: 0,
        i: 'Canvas',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 15,
        x: 8,
        y: 0,
        i: 'Metadata',
        moved: false,
        visible: true,
        'static': false
    },
    {
        w: 4,
        h: 10,
        x: 8,
        y: 18,
        i: 'Order',
        moved: false,
        visible: true,
        'static': false
    }
];

const layouts = [
    intro,
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