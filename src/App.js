import React, {useEffect} from 'react';
import Editor from './components/editor/Editor';
import {Route, Switch} from 'react-router-dom'
import Login from "./components/Login";
import {useTranslation} from 'react-i18next';
import {Navbar} from "./components/platform/Navbar";
import Catalogue from "./components/platform/Catalogue";
import {useDispatch, useSelector} from "react-redux";
import {USER, APP} from "./actions/action_constants";
import styled from "styled-components/macro";
import SignupForm from "./components/SignupForm";
import {Footer} from "./components/platform/Footer";
import Landing from "./components/platform/Landing";
import Account from "./components/platform/Account";
import Basket from "./components/platform/Basket";
import Checkout from "./components/platform/Checkout";
import {OrderCompleted} from "./components/platform/OrderCompleted";
import {useHistory} from "react-router";
import {APP_TITLE} from "./env";

const ScrollContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  background-color: ${props=>props.theme.grey_6};
  flex-direction: column;
`;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div><h1 style={{
                textAlign: 'center',
                fontSize: '72px',
                backgroundColor: "#f06595",
                color: "white",
                padding: "12px"
            }}>
                Herrjemine!
                <br/>
                <span className={"fas fa-skull fa-xs fa-pulse"}></span>
            </h1></div>;
        }
        return this.props.children;
    }
}

const Blank = () => {
    return null;
};

const App = () => {
    const t = useTranslation().t;
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        if (localStorage.getItem('jwt') === null) return;
        dispatch({
            type: USER.VALIDATE.REQUEST
        });
        dispatch({
            type: APP.VERSION.REQUEST
        })
        document.title = APP_TITLE

        // let heidelpay = new window.heidelpay('s-pub-xxxxxxxxxx', {locale: 'de-DE'});
    }, []);

    console.log(history);

    const navbarItems = [
        {label: t("general:catalogue"), to: '/catalogue'},
        {label: 'Editor', to: '/editor/new'},
        // {label: 'Wissen', to: '/knowledge'},
        // {label: 'Häufige Fragen', to: '/faq'}
    ];

    return (
            <Wrapper>
                <Navbar items={navbarItems}/>
                <ScrollContent>
                    <div className={"App" + (!/editor/.test(history.location.pathname) ? " padded-top container container-fluid" : "")}>
                        <ErrorBoundary>
                            <Switch>
                                {/*Renders exclusivly*/}
                                {/*<Route path="/register" component={Register}/>*/}
                                <Route path="/login" component={Login}/>
                                <Route path="/account" component={Account}/>
                                <Route path="/basket" component={Basket}/>
                                <Route path="/checkout" component={Checkout}/>
                                <Route path="/order-completed" component={OrderCompleted}/>
                                <Route path="/catalogue" component={Catalogue}/>
                                <Route path="/signup" component={SignupForm}/>
                                {/*<Route path="/catalogue" render={() => <Catalogue private={true}/>}/>*/}

                                <Route path="/editor/:graphic_id?/variants/:variant_id?" component={Editor}/>
                                <Route path="/editor/:graphic_id?" component={Editor}/>
                                <Route path="/editor/new" component={Editor}/>

                                <Route path="/" component={Landing}/>
                                <Route component={Blank}/>
                            </Switch>
                        </ErrorBoundary>
                    </div>
                </ScrollContent>
                <Footer />

                <div id="modal-portal-target"></div>
            </Wrapper>
    );
};

export default App;