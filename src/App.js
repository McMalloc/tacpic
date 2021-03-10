import React, { useEffect, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { useTranslation } from "react-i18next";
import { Navbar } from "./components/platform/Navbar";
import Catalogue from "./components/platform/Catalogue";
import { useDispatch, useSelector } from "react-redux";
import { USER, APP, LOCALFILES, CMS_LEGAL } from "./actions/action_constants";
import styled from "styled-components/macro";
import SignupForm from "./components/SignupForm";
import { Footer } from "./components/platform/Footer";
import Landing from "./components/platform/Landing";
import Account from "./components/platform/account/Account";
import Basket from "./components/platform/Basket";
import Checkout from "./components/platform/Checkout";
import { OrderCompleted } from "./components/platform/OrderCompleted";
import Stats from "./components/platform/Stats";
import AccountVerification from "./components/platform/account/AccountVerification";
import { useLocation } from "react-router";
import ResetPassword from "./components/platform/account/ResetPassword";
import NotFound from "./components/NotFound";
import ResetPasswordRequest from "./components/platform/account/ResetPasswordRequest";
import LegalIndex from "./components/platform/Legal";
import { Pricing } from "./components/platform/Pricing";
import EditorSplash from "./components/editor/EditorSplash";
import { useMatomo } from '@datapunt/matomo-tracker-react'
import Consent from "./components/platform/Consent";
import Knowledge from "./components/platform/Knowledge";
import { initLanguage } from "./i18n/i18n";
import Loader from "./components/gui/Loader";

const Editor = React.lazy(() => import("./components/editor/Editor"));
const AdminIndex = React.lazy(() => import("./components/admin/AdminIndex"));

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
  background-color: ${(props) => props.theme.grey_7};
  flex-direction: column;
`;

const AppContainer = styled.div`
  flex: 1 ${(props) => (props.inEditor || props.inEditorSplash ? 1 : 0)} 100%;
  overflow-y: ${(props) => (props.inEditor ? "hidden" : "visible")};

  display: flex;
  flex-direction: column;

  padding-top: ${(props) => (props.inEditor ? 0 : "1em")};
`;

const App = () => {
  const t = useTranslation().t;
  const dispatch = useDispatch();
  const location = useLocation();
  const inEditor = /editor\/app/.test(location.pathname) || location.pathname === '/'; // TODO in footer packen, nervt hier
  const inEditorSplash = /splash/.test(location.pathname);
  const { trackPageView, trackEvent } = useMatomo()
  const gdpr = useSelector(state => state.app.gdpr);

  useEffect(() => {
    dispatch({ type: APP.FRONTEND.REQUEST });
    dispatch({ type: APP.BACKEND.REQUEST });
    dispatch({ type: CMS_LEGAL.INDEX.REQUEST });
    dispatch({ type: LOCALFILES.INDEX.REQUEST });

    initLanguage();
    if (localStorage.getItem("jwt") === null) return;
    dispatch({ type: USER.VALIDATE.REQUEST });
  }, []);

  useEffect(() => {
    if (!(/catalogue/.test(location.pathname) || /info/.test(location.pathname) || /knowledge\/.+/.test(location.pathname))) {
      document.title = t('region:' + location.pathname) + ' | tacpic';
    }
    document.getElementById("scroll-content").scrollTo(0, 0);
    trackPageView();
    // trackEvent({category: 'page change', action: location.pathname});
  }, [location.pathname]);

  const navbarItems = [
    { label: t("navigation.catalogue"), to: "/catalogue" },
    { label: t("navigation.editor"), to: "/editor/splash" },
    { label: t("navigation.pricing"), to: "/pricing" },
    { label: t("navigation.knowledge"), to: '/knowledge' },
  ];

  return (
    <Wrapper>
      {!gdpr &&
        <Consent />
      }

      <Navbar items={navbarItems} />
      <ScrollContent id={"scroll-content"}>
        <AppContainer
          id={"app-container"}
          inEditor={inEditor}
          inEditorSplash={inEditorSplash}
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
              path="/editor/splash"
              element={<EditorSplash />}
            />
            <Route path="/editor/app" element={<Suspense fallback={<Loader />}>
              <Editor />
            </Suspense>} />
            <Route path="/admin" element={<Suspense fallback={<Loader />}>
              <AdminIndex />
            </Suspense>} />
            {/* <Route path="/editor/app" element={<Editor />} /> */}
            <Route path="/stats" element={<Stats />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/:category" element={<Knowledge />} />
            <Route path="/knowledge/:category/:postSlug" element={<Knowledge />} />
            <Route
              path="/info/:lang/:textId"
              element={<LegalIndex />}
            ></Route>
            <Route exact path="/" element={null} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>

        </AppContainer>
        <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes>
        <Footer small={inEditor && !(location.pathname === '/')} />
      </ScrollContent>

      <div id={"dropdown-portal-target"} />

    </Wrapper>
  );
};

export default App;
