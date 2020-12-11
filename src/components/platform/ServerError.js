import React from "react";
import {Alert} from "../gui/Alert";
import {useTranslation} from "react-i18next";

export default ({error}) => {
    const { t } = useTranslation();
    if (!error) return null;
    if (!!error['field-error']) return <Alert warning>
        {t("auth:" + error.error)}<br/>
        {error['field-error'] && t("auth:" + error['field-error'][1])}
    </Alert>

    debugger;

    return <Alert warning>
        {t("error:" + error.type)}:<br/>
        {error.message && t("error:" + error.message)}
    </Alert>
}