import methods from "../components/editor/ReactSVG/methods/methods";
import i18n from 'i18next';

export const editor = {
    ui: {
        tool: 'RECT',
        texture: 'diagonal_lines',
        fill: "#1f78b4",
        currentPage: 0,
        scalingFactor: 1,
        viewPortX: 0,
        viewPortY: 0,
        previewMode: false,
        selectedObjects: [],
        defaultTitle: true,
        initialized: true,
        import: {
            preview: null,
            previewName: '',
            ocr: '',
            ocrSelection: [],
            pending: false,
            error: null
        },
        fileState: null
    },
    file: {
        past: [],
        present: {
            title: "",
            graphicTitle: "",
            graphicDescription: "",
            variantTitle: "Basis",
            transcribersNotes: "",
            tags: [],
            category: null,
            variant_id: null,
            graphic_id: null,
            version_id: null,
            lastVersionHash: null,
            derivedFrom: null,
            formatVersion: "0.9",

            keyedStrokes: [],
            keyedTextures: [],
            medium: 'swell',
            system: 'de-de-g2.ctb', // name of the liblouis translation table
            width: 210,
            height: 297,
            verticalGridSpacing: 10, // TODO: Dateieigenschaften sollten in 'openedFile'
            horizontalGridSpacing: 10,
            showVerticalGrid: false,
            showHorizontalGrid: false,

            braillePages: {
                width: 210,
                height: 297,
                marginLeft: 1,
                marginTop: 1,
                cellsPerRow: 33,
                rowsPerPage: 27,
                pageNumbers: 0,
                imageDescription: {
                  type: "",
                  summary: "",
                  details: ""
                },
                content: '',
                concatinated: '',
                braille: '',
                formatted: [[]]
            },
            pages: [
                {
                    name: "Seite 1",
                    text: false,
                    rendering: '',
                    objects: [methods.label.create(10, 10, 350, 75, i18n.t('editor:title_placeholder'), '', {isTitle: true, editMode: false, pristine: true})]
                }
            ]
        },
        future: []
    },
}

export const app = {
    version: '',
    error: null,
    legalTexts: [],
    backend: {},
    frontend: {}
};

export const catalogue = {
    filterTags: [],
    filterTerms: [],
    filterFormat: [],
    filterSystem: [],
    tags: [],
    limit: 50,
    offset: 0,
    graphics: [],
    viewedGraphic: {},
    graphicGetPending: true,
    searchPending: false,
    loadMorePending: false,
    quotedVariants: [],
    order: {
        pending: false,
        key: null,
        successful: false,
        error: null
    },
    quote: {
        items: [],
        pending: false,
        successfull: false,
        error: null
    }, // quote is the basket with added prices and packaging and postage items
    basket: JSON.parse(localStorage.getItem("basket")) || []
};

export const user = {
    logged_in: false,
    email: '',
    login_pending: false,
    // 0: waiting for the server to initialise created account
    // 1: waiting for user to click on link and enter password
    // 2: waiting for server to finalise account
    // 3: verified account
    verification_state: -1,
    // 0: requested password reset
    // 1: email sent, waiting for user to click on link and enter new password
    // 2: waiting for server to reset password
    // 3: password reset
    reset_state: -1,
    addresses: [],
    error: null
};