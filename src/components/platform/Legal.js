import styled, {useTheme} from 'styled-components/macro';
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Outlet, useLocation, useParams} from "react-router";
import axios from "axios";

const Content = props => {
    const [content, setContent] = useState("");
    useEffect(() => {
        props.title && axios(`/legal/${props.lang}/${props.title}`).then(response => {
            console.log(response);
            setContent(response.data)
        });
    }, [props.title])
    return <section className={"legal-text"}>
        {/*<h2>{props.title}</h2>*/}
        <div dangerouslySetInnerHTML={{__html: content}}/>
    </section>
}

const Index = props => {
    return (
        <>
            <h2>Übersicht</h2>
            <ul>
                {props.index.map(text => {
                    return <li key={text.title}>
                        <NavLink to={`/legal/de/${text.title}`}>{text.title}</NavLink>
                    </li>
                })}
            </ul>
        </>
    )
}

const LegalIndex = props => {
    const {t} = useTranslation();
    const {lang, textTitle} = useParams();
    const dispatch = useDispatch();
    const legalTexts = useSelector(state=>state.app.legalTexts);

    // useEffect(() => {
    //     axios(`/legal/${lang}/${textTitle}`).then(response => null);
    // }, [lang, textTitle])

    return (<>
        <div className={"row"}>
            <div className={"col-md-4"}>
                <Index index={legalTexts} />
            </div>
            <div className={"col-md-8"}>
                <Content lang={lang} title={textTitle}/>
            </div>


        </div>
    </>)
};

export default LegalIndex