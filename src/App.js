import React, {useEffect} from 'react';
import Editor from './components/editor/Editor';
import {BrowserRouter, Route, Link, Switch, history} from 'react-router-dom'
import Login from "./components/Login";
import {useTranslation} from 'react-i18next';
import {Navbar, NavbarItem} from "./components/platform/Navbar";
import Catalogue from "./components/platform/Catalogue";
import {useDispatch, useSelector} from "react-redux";
import {TAGS, USER} from "./actions/constants";
import styled from "styled-components";
import SignupForm from "./components/SignupForm";
import {Footer} from "./components/platform/Footer";
import Landing from "./components/platform/Landing";
import Account from "./components/platform/Account";

const ScrollContent = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
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
    // const history = useHistory();
    useEffect(() => {
        if (localStorage.getItem('jwt') === null) return;
        dispatch({
            type: USER.VALIDATE.REQUEST
        });
    });

    const navbarItems = [
        {label: t("general:catalogue"), to: '/catalogue'},
        {label: 'Editor', to: '/editor/new'},
        // {label: 'Wissen', to: '/knowledge'},
        // {label: 'Häufige Fragen', to: '/faq'}
    ];

    return (
        <>
            <Wrapper>
                <Navbar items={navbarItems}/>
                <ScrollContent className="App">

                    <Main>
                        <ErrorBoundary>
                            <Switch>
                                {/*Renders exclusivly*/}
                                {/*<Route path="/register" component={Register}/>*/}
                                <Route path="/login" component={Login}/>
                                <Route path="/account" component={Account}/>
                                <Route path="/editor/:graphic_id?/variants/:variant_id?" component={Editor}/>
                                <Route path="/editor/:graphic_id?" component={Editor}/>
                                <Route path="/editor/new" component={Editor}/>
                                {/*<Route path="/private-catalogue/:graphic_id/variant/:variant_id/edit" component={Editor}/>*/}
                                <Route path="/catalogue" component={Catalogue}/>
                                <Route path="/signup" component={SignupForm}/>
                                <Route path="/catalogue" render={() => <Catalogue private={true}/>}/>

                                <Route path="/" component={Landing}/>
                                <Route component={Blank}/>
                            </Switch>
                        </ErrorBoundary>
                    </Main>
                    <Footer></Footer>
                </ScrollContent>
            </Wrapper>

        </>
    );
};

export default App;