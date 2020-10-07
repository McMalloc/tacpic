import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Well from "../../gui/Well";


const AccountInfo = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const {t} = useTranslation();

    return (
        <section>
            <Well>
                E-Mail-Adresse: {user.email} <br />
                Anzeigename: {user.displayName}
            </Well>

        </section>

    );
};

export default AccountInfo;