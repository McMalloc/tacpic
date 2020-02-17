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
    // Hook. https://react.i18next.com/latest/usetranslation-hook
    // Alternative withTranslation HOC

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: TAGS.GET.REQUEST,
            payload: {limit: 30}
        })
    });

    return (
        <BrowserRouter>
            <div className="App">
                <Navbar>
                    <NavbarItem to={"home"}/>
                    <NavbarItem to={"home"}/>
                </Navbar>
                <nav>
                    {/*<Link to="/login">Login</Link>*/}
                    <Link to="/register">Registrieren</Link>
                    <Link to="/editor">Editor</Link>
                    <Link to="/private-catalogue">Stöbern</Link>
                </nav>
                <ErrorBoundary>
                    <Switch>
                        {/*Renders exclusivly*/}
                        {/*<Route path="/login" component={Login}/>*/}
                        <Route path="/register" component={Register}/>
                        <Route path="/editor/:graphic_id?/variants/:variant_id?" component={Editor}/>
                        <Route path="/editor/new" component={Editor}/>
                        {/*<Route path="/private-catalogue/:graphic_id/variant/:variant_id/edit" component={Editor}/>*/}
                        <Route path="/catalogue" component={Catalogue}/>
                        <Route path="/private-catalogue" render={() => <Catalogue private={true}/>}/>
                    </Switch>
                </ErrorBoundary>
            </div>
        </BrowserRouter>
    );
};

export default App;