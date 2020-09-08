import React from "react";
import {Alert} from "../../gui/Alert";
import {useTranslation} from "react-i18next";

export default ({error}) => {
    const {t} = useTranslation();
    if (error === null) return null;
    return <Alert warning>
        {t("auth:" + error.error)}<br/>
        {error['field-error'] && t("auth:" + error['field-error'][1])}
    </Alert>
}