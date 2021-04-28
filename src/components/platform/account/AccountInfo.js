import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Well from "../../gui/Well";


const AccountInfo = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const { t } = useTranslation();

    return (
        <section>
            <Well>
                {t("account:email")}: {user.email} <br />
                {t("account:display_name")}: {user.displayName}
            </Well>

        </section>

    );
};

export default AccountInfo;