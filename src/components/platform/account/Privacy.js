import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {USER} from "../../../actions/action_constants";
import {Button} from "../../gui/Button";
import {useTranslation} from "react-i18next";


const Privacy = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const {t} = useTranslation();
    console.log(user);

    return (
        <section>
            {user.newsletterActive ?
                <>
                    <p>t{("account:newsletter_is_active")}</p>
                    <Button onClick={() => dispatch({
                        type: USER.UPDATE.REQUEST,
                        payload: {...user, newsletterActive: false}
                    })} label={"account:deactivate_newsletter"}/>
                </>
                :
                <>
                    <p>t{("account:newsletter_is_inactive")}</p>
                    <Button onClick={() => dispatch({
                        type: USER.UPDATE.REQUEST,
                        payload: {...user, newsletterActive: true}
                    })} label={"account:activate_newsletter"}/>
                </>
            }
        </section>

    );
};

export default Privacy;