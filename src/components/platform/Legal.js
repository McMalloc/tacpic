import styled, { useTheme } from "styled-components/macro";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useParams } from "react-router";
import axios from "axios";
import licenses from "../../content/licenses.json";

const normalizeLink = link => /^git\+/.test(link) ? link.substring(4) : /^git\:/.test(link) ? link.replace(/^git/, 'https') : link

const RemoteContent = (props) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    props.title &&
      axios(`/legal/${props.lang}/${props.title}`).then((response) => {
        setContent(response.data);
      });
    document.getElementById("scroll-content").scrollTo(0, 0);
  }, [props.title]);
  return (
    <section className={"legal-text"}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

const LocalContent = (props) => {
  console.log(licenses);
  return (
      <section className={"legal-text"}>
          <h2>Lizenzen</h2>
          <p>Die Texte der angegeben Lizenzen sind unter folgenden Links einzusehen:&nbsp;
              <a target={'blank'} href={"/documents/mit.txt"}>MIT</a>,&nbsp;
              <a target={'blank'} href={"/documents/sil.txt"}>SIL</a>, &nbsp;
              <a target={'blank'} href={"/documents/bds.txt"}>BDS</a>, &nbsp;
              <a target={'blank'} href={"/documents/mpl.html"}>MPL</a> und &nbsp;
              <a target={'blank'} href={"/documents/cc-by.html"}>CC-BY</a>.
          </p>
          <table className={"full-width" }>
        <thead>
          <tr>
            <th>Package</th>
            <th>Author</th>
            <th>Version&emsp;</th>
            <th>License</th>
          </tr>
              </thead>
              <tbody>
                  {licenses.map(row => {
                      return <tr>
                          <td><a target={"blank"} href={normalizeLink(row.link)}>{ row.name }</a></td>
                          <td>{ row.author }</td>
                          <td>{ row.installedVersion }</td>
                          <td>{ row.licenseType }</td>
                      </tr>
                  })}
              </tbody>
      </table>
    </section>
  );
};

const IndexWrapper = styled.div`
  position: sticky;
  top: ${(props) => props.theme.large_padding};

  ul {
    list-style: none;
    padding-left: 0;

    li {
      padding: 1rem
        ${(props) => props.theme.base_padding};
    }
  }
`;

const Index = (props) => {
  return (
    <IndexWrapper>
      <h2>Übersicht</h2>
      <ul>
        {props.index.map((text) => {
          return (
            <li key={text.title}>
              <NavLink to={`/info/de/${text.title}`}>{text.title}</NavLink>
            </li>
          );
        })}
        <li>
          <NavLink to={`/info/de/Lizenzen`}>Lizenzen</NavLink>
        </li>
      </ul>
    </IndexWrapper>
  );
};

const LegalIndex = (props) => {
  const { t } = useTranslation();
  const { lang, textTitle } = useParams();
  const dispatch = useDispatch();
  const legalTexts = useSelector((state) => state.app.legalTexts);

  // useEffect(() => {
  //     axios(`/legal/${lang}/${textTitle}`).then(response => null);
  // }, [lang, textTitle])

  return (
    <>
      <div className={"row"}>
        <div style={{ position: "relative" }} className={"col-xs-12 col-md-4"}>
          <Index index={legalTexts} />
        </div>
              <div className={"col-xs-12 col-md-8"}>
          {textTitle === "Lizenzen" ? (
            <LocalContent />
          ) : (
            <RemoteContent lang={lang} title={textTitle} />
          )}
        </div>
      </div>
    </>
  );
};

export default LegalIndex;
