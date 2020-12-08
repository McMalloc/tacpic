import React, { useEffect } from "react";
import Editor from "./components/editor/Editor";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { useTranslation } from "react-i18next";
import { Navbar } from "./components/platform/Navbar";
import Catalogue from "./components/platform/Catalogue";
import { useDispatch, useSelector } from "react-redux";
import { USER, APP } from "./actions/action_constants";
import styled from "styled-components/macro";
import SignupForm from "./components/SignupForm";
import { Footer } from "./components/platform/Footer";
import Landing from "./components/platform/Landing";
import Account from "./components/platform/account/Account";
import Basket from "./components/platform/Basket";
import Checkout from "./components/platform/Checkout";
import { OrderCompleted } from "./components/platform/OrderCompleted";
import { APP_TITLE } from "./env";
import Stats from "./components/platform/Stats";
import AccountVerification from "./components/platform/account/AccountVerification";
import { useLocation } from "react-router";
import ResetPassword from "./components/platform/account/ResetPassword";
import NotFound from "./components/NotFound";
import ResetPasswordRequest from "./components/platform/account/ResetPasswordRequest";
import LegalIndex from "./components/platform/Legal";
import { Pricing } from "./components/platform/Pricing";


const ScrollContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  //flex: 1 1 100%;
  background-color: ${(props) => props.theme.grey_6};
  flex-direction: column;
`;

const AppContainer = styled.div`
  flex: 1 ${(props) => (props.inEditor ? 1 : 0)} 100%;
  overflow-y: ${(props) => (props.inEditor ? "hidden" : "visible")};

  display: flex;
  flex-direction: column;

  padding-top: ${(props) => (props.inEditor ? 0 : "1em")};
`;

const App = () => {
  const t = useTranslation().t;
  const dispatch = useDispatch();
  const location = useLocation();
  const inEditor = /editor/.test(location.pathname);
  const appError = useSelector((state) => state.app.error);

  useEffect(() => {
    dispatch({ type: APP.FRONTEND.REQUEST });
    dispatch({ type: APP.BACKEND.REQUEST });
         dispatch({ type: APP.LEGAL.REQUEST });
         
         

    document.title = APP_TITLE;

    if (localStorage.getItem("jwt") === null) return;
    dispatch({ type: USER.VALIDATE.REQUEST });
  }, [APP_TITLE]);

  const navbarItems = [
    { label: t("general:catalogue"), to: "/catalogue" },
    { label: t("general:editor"), to: "/editor/new" },
    { label: t("general:pricing"), to: "/pricing" },
    // {label: 'Wissen', to: '/knowledge'},
    // {label: 'Häufige Fragen', to: '/faq'}
  ];

  return (
    <Wrapper>
      <Navbar items={navbarItems} />
      <ScrollContent id={"scroll-content"}>
        <AppContainer
          id={"app-container"}
          inEditor={inEditor}
          className={!inEditor ? " container" : ""}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/verify-account" element={<AccountVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/reset-password-request"
              element={<ResetPasswordRequest />}
            />
            <Route path="/basket" element={<Basket />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-completed" element={<OrderCompleted />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route
              path="/catalogue/:graphicId/variant/:variantId"
              element={<Catalogue />}
            />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/editor/:graphicId/variant/:variantId/:mode"
              element={<Editor />}
            />
            <Route path="/editor/:mode" element={<Editor />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/info/:lang/:textTitle"
              element={<LegalIndex />}
            ></Route>
            <Route exact path="/" element={<Landing />} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </AppContainer>
        <Footer small={inEditor} />
      </ScrollContent>
      <div id={"dropdown-portal-target"} />
    </Wrapper>
  );
};

export default App;
