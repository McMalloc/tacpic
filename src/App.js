import React, { useEffect, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { useTranslation } from "react-i18next";
import { Navbar } from "./components/platform/Navbar";
import Catalogue from "./components/platform/Catalogue";
import { useDispatch, useSelector } from "react-redux";
import { USER, APP, LOCALFILES, CMS_LEGAL, BASKET_NEEDS_REFRESH } from "./actions/action_constants";
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
import LoginChangeVerification from "./components/platform/account/LoginChangeVerification";
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

const AppContainer = styled.main`
  flex: 1 1 100%;
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
  const inAdmin = /admin/.test(location.pathname);
  const inEditorSplash = /splash/.test(location.pathname);
  const { trackPageView, trackEvent } = useMatomo()
  const gdpr = useSelector(state => state.app.gdpr);

  useEffect(() => {
    dispatch({ type: APP.FRONTEND.REQUEST });
    dispatch({ type: APP.BACKEND.REQUEST });
    dispatch({ type: CMS_LEGAL.INDEX.REQUEST });
    dispatch({ type: LOCALFILES.INDEX.REQUEST });

    window.addEventListener('focus', () => dispatch({ type: BASKET_NEEDS_REFRESH }));

    initLanguage();
    if (localStorage.getItem("jwt") === null) return;
    dispatch({ type: USER.VALIDATE.REQUEST });
  }, []);

  useEffect(() => {
    // messy routing related code
    if (!(/catalogue/.test(location.pathname) || /info/.test(location.pathname) || /knowledge\/.+/.test(location.pathname) || /support\/.+/.test(location.pathname))) {
      document.title = t('region.' + location.pathname) + ' | tacpic';
    }
    // scroll to top at page change, if it is not the catalogue
    !/\/catalogue/.test(location.pathname) && document.getElementById("scroll-content").scrollTo(0, 0);

    // track page changes and let some time pass so components down the hierarchy can change the title
    setTimeout(() => trackPageView(document.title), 500);
  }, [location.pathname]);

  const navbarItems = [
    { label: t("navigation.catalogue"), to: "/catalogue" },
    { label: t("navigation.editor"), to: "/editor/splash" },
    // { label: t("navigation.pricing"), to: "/pricing" },
    { label: t("navigation.support"), to: '/support' },
    // { label: t("navigation.knowledge"), to: '/wissen' },
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
          className={!inEditor && !inAdmin ? " container" : inAdmin ? "container-fluid" : ""}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/verify-account" element={<AccountVerification />} />
            <Route path="/verify-login-change" element={<LoginChangeVerification />} />
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

            <Route path="/admin">
              <Route path=":section" element={<Suspense fallback={<Loader />}>
              <AdminIndex />
            </Suspense>} />
              <Route path=":section/:view" element={<Suspense fallback={<Loader />}>
              <AdminIndex />
            </Suspense>} />
            </Route>

            <Route path="/stats" element={<Stats />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/wissen" element={<Knowledge category={'wissen'} />} />
            <Route path="/wissen/:catSlug" element={<Knowledge category={'wissen'} />} />
            <Route path="/wissen/:catSlug/:postSlug" element={<Knowledge category={'wissen'} />} />
            <Route path="/support" element={<Knowledge category={'support'} />} />
            <Route path="/support/:catSlug" element={<Knowledge category={'support'} />} />
            <Route path="/support/:catSlug/:postSlug" element={<Knowledge category={'support'} />} />
            <Route
              path="/info/:lang/:textId"
              element={<LegalIndex />}
            ></Route>
            <Route exact path="/" element={<Landing />} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>

        </AppContainer>
        {/* <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes> */}
        <Footer small={inEditor && !(location.pathname === '/')} />
      </ScrollContent>

      <div id={"dropdown-portal-target"} />

    </Wrapper>
  );
};

export default App;
