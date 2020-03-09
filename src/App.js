import React, {useEffect} from 'react';
import Editor from './components/editor/Editor';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom'
import Login from "./components/Login";
import {useTranslation} from 'react-i18next';
import {Navbar, NavbarItem} from "./components/platform/Navbar";
import Catalogue from "./components/platform/Catalogue";
import Register from "./components/Register";
import {useDispatch} from "react-redux";
import {TAGS} from "./actions/constants";
import AccountWidget from "./components/platform/AccountWidget";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  flex: 1 1 100%;
  display: flex;
  overflow: auto;
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

const App = () => {
    const t = useTranslation().t;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: TAGS.GET.REQUEST,
            payload: {limit: 30}
        })
    });

    const navbarItems = [
        {label: 'Grafiken', to: '/private-catalogue'},
        {label: 'Editor', to: '/editor/new'},
        {label: 'Wissen', to: '/knowledge'},
        {label: 'Häufige Fragen', to: '/faq'}
    ];

    return (
        <BrowserRouter>
            <Wrapper className="App">
                <Navbar items={navbarItems}/>
                <Main>
                    <ErrorBoundary>
                        <Switch>
                            {/*Renders exclusivly*/}
                            {/*<Route path="/login" component={Login}/>*/}
                            <Route path="/register" component={Register}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/editor/:graphic_id?/variants/:variant_id?" component={Editor}/>
                            <Route path="/editor/:graphic_id?" component={Editor}/>
                            <Route path="/editor/new" component={Editor}/>
                            {/*<Route path="/private-catalogue/:graphic_id/variant/:variant_id/edit" component={Editor}/>*/}
                            <Route path="/catalogue" component={Catalogue}/>
                            <Route path="/private-catalogue" render={() => <Catalogue private={true}/>}/>
                        </Switch>
                    </ErrorBoundary>
                </Main>
            </Wrapper>
        </BrowserRouter>
    );
};

export default App;