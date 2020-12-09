import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {USER} from "../../../actions/action_constants";
import {Checkbox} from "../../gui/Checkbox";
import {useTranslation} from "react-i18next";


const Privacy = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    return (
        <section className={'col-xs-12 col-md-6 '}>
            <Checkbox 
                        value={user.newsletterActive}
                        label={'account:cb-newsletter'}
                        onChange={() => dispatch({
                            type: USER.UPDATE.REQUEST,
                            payload: {...user, newsletterActive: !user.newsletterActive}
                        })} />
        </section>

    );
};

export default Privacy;