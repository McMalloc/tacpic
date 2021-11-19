import React from "react";
import {Alert} from "../gui/Alert";
import {useTranslation} from "react-i18next";

export default ({error, i18nKey}) => {
    const { t } = useTranslation();
    
    if (!error) return null;

    if (!!error.error && !error['field-error']) return <Alert warning>
        {t(i18nKey + ":" + error.error)}
    </Alert>

    console.log(error);

    if (!!error['field-error']) return <Alert warning>
        {t(i18nKey + ":" + error.error)}<br/>
        {error['field-error'] && t(i18nKey + ":" + error['field-error'][1])}
    </Alert>

    return <Alert warning>
        {t(i18nKey + ":" + error.type)}:<br/>
        {error.message && t(i18nKey + ":" + error.message)}
    </Alert>
}