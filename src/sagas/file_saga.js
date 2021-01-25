import {put, takeLatest, take, race, select} from "redux-saga/effects";
import { FILE, VARIANT } from "../actions/action_constants";
import uuidv4 from "../utility/uuid";

export function* openFileWatcher() {
    yield takeLatest(FILE.OPEN.REQUEST, function* (action) {
        let mode = action.mode;

        yield put({ type: 'CLEAR' })

        // new graphic
        if (!action.id) {
            yield put({ type: FILE.OPEN.SUCCESS, data: {uuid: uuidv4()} });
            return;
        }

        // const localfiles = yield select(state=>state.editor.localfiles.index);
        // TODO: fertigstellen und abstrahieren

        // !!! wenn eine variante bereits in localfiles geöffnet ist, daraus laden

        // let localBackup = localfiles.find(file => file.variant_id === action.id);
        // console.log(localBackup);

        // graphic based on existing variant, so get variant data first
        yield put({
            type: VARIANT.GET.REQUEST,
            payload: {id: action.id}
        });

        const { success, failure } = yield race({
            success: take(VARIANT.GET.SUCCESS),
            failure: take(VARIANT.GET.FAILURE)
        });

        if (success) {
            // version_id auf null setzen verhindert, dass die geladene Variante mit einer lokalen Datei verglichen
            // werden kann. version_id wird ohnehin nicht in der API genutzt, da jeder API call eine neue Version
            // erzeugt. Wenn variant_id übereinstimmt, kann sogar vorm Öffnen ermittelt werden, ob es bereits eine 
            // neue Version gibt
            // let dataObject = {...success.data, version_id: null};
            let dataObject = {...success.data, uuid: (action.data && action.data.uuid) || uuidv4()};

            if (mode === 'new') {
                dataObject.derivedFrom = null;
                dataObject.variant_id = null;
                dataObject.graphic_id = null;

                dataObject.graphicTitle = "";
                dataObject.currentFileName = "";
                dataObject.variantTitle = "Basis";
                dataObject.variantDescription = "";
                dataObject.graphicDescription = "";
            } else if (mode === 'copy') {
                dataObject.derivedFrom = dataObject.variant_id;
                dataObject.variant_id = null;
            }

            yield put({
                type: FILE.OPEN.SUCCESS,
                data: dataObject
            });
        } else {
            yield put({
                type: FILE.OPEN.FAILURE,
                error: failure
            });
        }
    });
}

