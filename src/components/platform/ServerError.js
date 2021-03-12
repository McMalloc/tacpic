import React from "react";
import {Alert} from "../gui/Alert";
import {useTranslation} from "react-i18next";

export default ({error}) => {
    const { t } = useTranslation();
    
    if (!error) return null;

    if (!!error.error) return <Alert warning>
        {t("account:" + error.error)}
    </Alert>

    if (!!error['field-error']) return <Alert warning>
        {t("account:" + error.error)}<br/>
        {error['field-error'] && t("account:" + error['field-error'][1])}
    </Alert>

    return <Alert warning>
        {t("account:" + error.type)}:<br/>
        {error.message && t("account:" + error.message)}
    </Alert>
}