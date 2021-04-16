import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom";
import { USER } from "../../../actions/action_constants";
import Card from "../../gui/Card";
import { Button } from "../../gui/Button";
import Addresses from "../Addresses";
import { useLocation } from "react-router-dom";
import Orders from "./Orders";
import AccountInfo from "./AccountInfo";
import { Outlet } from "react-router";
import { Alert } from "../../gui/Alert";
import { Icon } from "../../gui/_Icon";
import { useTranslation } from "react-i18next";
import Privacy from "./Privacy";

const Account = props => {
    const user = useSelector(state => state.user);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    let location = useLocation();

    useEffect(() => {
        document.title = `${t('region:' + location.pathname)} | tacpic`;
    }, [location.pathname])

    const menues = [
        { key: "addresses", icon: "map-marked" },
        { key: "my_account", icon: "user" },
        { key: "orders", icon: "shopping-basket" },
        { key: "newsletter", icon: "info" },
    ];

    const home = <>
        <div className={'row'}>
            {menues.map(menu => {
                return (
                    <div key={menu.key} className={"col-md-4 col-lg-3 col-sm-6 col-xs-12 extra-margin double"}>
                        <Card
                            description={"account:" + menu.key + "-description"}
                            title={"account:" + menu.key} link={menu.key} icon={menu.icon}>
                        </Card>
                    </div>

                )
            })}
        </div>
        <Outlet />
        <div className={'row'}>
            <div className={"col-xs-12"} style={{ textAlign: "center" }}>
                <Button icon={"sign-out-alt"} onClick={event => dispatch({ type: USER.LOGOUT.REQUEST })} label={t("account:logoff")} />
            </div>
        </div>
    </>;
    return (
        <>
            {!user.logged_in ?
                <Alert info>{t('account:notLoggedin')}</Alert>
                // null
                :
                <>
                    <div className={'row'}>
                        <div className={"col-xs-12 extra-margin"}>
                            <h1>{t('account:private')}</h1>
                            <p>
                                {location.pathname !== '/account' &&
                                    <Link to={"/account"}>{t('account:private')}</Link>
                                }
                                <Routes>
                                    {['addresses', 'my_account', 'orders', 'newsletter'].map(section => 
                                        <Route path={section} element={
                                            <span aria-current={location.pathname === '/account/' + section}> <Icon icon={"angle-right"} /> {t('account:' + section)}</span>} />
                                        )}
                                </Routes>
                            </p>

                        </div>
                    </div>

                    <Routes>
                        <Route path="" element={home} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="my_account" element={<AccountInfo />} />
                        <Route path="addresses" element={<Addresses />} />
                        <Route path="newsletter" element={<Privacy />} />
                    </Routes>
                </>
            }
        </>
    );
};

export default Account;