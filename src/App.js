import React, {Component} from 'react';
import './App.css';
import Editor from './components/editor/Editor';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Login from "./components/Login";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        console.dir(error);
        console.dir(info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div><h1>Something went wrong.</h1></div>;
        }
        return this.props.children;
    }
}

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <nav>
                        <Link to="/login">Login</Link>
                        <Link to="/editor">Editor</Link>
                    </nav>
                    <ErrorBoundary>
                        <Route path="/login" component={Login}/>
                        <Route path="/editor" component={Editor}/>
                    </ErrorBoundary>
                    <button onClick={() => {
                        this.props.fetch()
                    }}>Fetch!
                    </button>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {
        fetch: () => {
            console.log("fetch!");
            dispatch({type: 'API_CALL_REQUEST'});
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
