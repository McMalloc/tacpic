import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";


const AccountInfo = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const {t} = useTranslation();

    return (
        <section>
            E-Mail-Adresse: {user.email}
        </section>

    );
};

export default AccountInfo;