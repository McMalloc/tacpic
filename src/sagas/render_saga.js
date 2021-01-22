import { put, select, debounce, call } from "redux-saga/effects";
import { FILE } from "../actions/action_constants";
import { extractSVG } from "../components/editor/ReactSVG";

// TODO pauschal auch Durchführen vor dem Speichern
export function* renderWatcher() {
    yield debounce(1000, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED', FILE.OPEN.SUCCESS], function* (action) {
        try {
            let file = yield select(state => state.editor.file);
            const extractedSVGs = file.present.pages.map((page, index) => extractSVG(index));

            // https://web.archive.org/web/20141224130708/https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
            // var canvas = document.getElementById('preview-canvas');
            // var ctx = canvas.getContext('2d');

            // var data = document.getElementById('MAIN-CANVAS').outerHTML;

            // var DOMURL = window.URL || window.webkitURL || window;

            // var img = new Image();
            // var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            // var url = DOMURL.createObjectURL(svg);

            // img.onload = function () {
            //     ctx.drawImage(img, 0, 0);
            //     DOMURL.revokeObjectURL(url);
            // }

            // img.src = url;

            yield put({
                type: 'SET_PAGE_RENDERINGS',
                renderings: extractedSVGs
            });
        } catch (error) {
            console.log(error);
        }

    })
}