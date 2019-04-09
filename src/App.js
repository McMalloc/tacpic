import React from 'react';
import Editor from './components/editor/Editor';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Login from "./components/Login";
import {useTranslation} from 'react-i18next';

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
                So ein Mist!
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
    return (
        <Router>
            <div className="App">
                {/*<small>{t("tacpic:welcome")}</small>*/}
                <nav>
                    <Link to="/login">Login</Link>
                    <Link to="/editor">Editor</Link>
                </nav>
                <ErrorBoundary>
                    <Route path="/login" component={Login}/>
                    <Route path="/editor" component={Editor}/>
                </ErrorBoundary>
            </div>
        </Router>
    );
};

export default App;