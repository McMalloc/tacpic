import methods from "../components/editor/ReactSVG/methods/methods";
import env from "../env.json";

// states
// 0 - false
// 1 - pending
// 2 - success
// 3 - failure
export const editor = {
    ui: {
        tool: 'SELECT',
        texture: 'diagonal_lines',
        fill: "#1f78b4",
        currentPage: 0,
        scalingFactor: 1,
        viewPortX: 0,
        viewPortY: 10,
        previewMode: false,
        preview: null,
        selectedObjects: [],
        defaultTitle: true,
        initialized: true,
        clipboard: [],
        fileOpen: 0,
        showSafeArea: true,
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
    localfiles: {
        index: []
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
            uuid: null,
            category: null,
            variant_id: null,
            graphic_id: null,
            version_id: null,
            lastVersionHash: null,
            derivedFrom: null,
            formatVersion: env.FILE_VERSION,

            keyedStrokes: [],
            keyedTextures: [],
            medium: 'swell',
            system: 'DE:VOLL',
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
                    objects: [
                        methods.label.create(30, 10, 350, 75, '', '', { isTitle: true, editMode: false, pristine: true }),
                        methods.key.create(100, 100)
                    ]
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
    frontend: {},
    idb: false,
    gdpr: !!localStorage.getItem('gdpr')
};

export const catalogue = {
    filterTags: [],
    filterTerms: [],
    filterFormat: [],
    filterSystem: [],
    tags: [],
    limit: 50,
    exhausted: false,
    offset: 0,
    graphics: [],
    viewedGraphic: {},
    graphicGetPending: true,
    searchPending: false,
    searchError: null,
    searchErrorCode: null,
    historyPending: false,
    currentHistory: {
        contributors: [],
        versions: []
    },
    loadMorePending: false,
    quotedVariants: [],
    order: {
        pending: false,
        response: null,
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
    error: null,
    message: null,
    operationPending: false
};

export const admin = {
    users: [],
    frontendErrors: [],
    backendErrors: [],
    orders: [],
    currentOrder: null,
    currentOrderPending: false,
    currentOrderError: null,

    vouchers: [],
    vouchersPending: false,
    vouchersError: null
}

export const cms = {
    pages: [],
    pagesSuccessful: false,
    pagesPending: false,
    pagesError: null,
    categories: {
        index: [],
        hierarchy: [],
    },
    legal: {
        menu: [],
        pages: {
            index: [],
            pending: false,
            successful: false,
            error: null
        }
    }
}