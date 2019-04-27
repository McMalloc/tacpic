import {BrowserRouter, Link, Switch} from "react-router-dom";
import {Route} from "react-router";

function Home() {
    return <div> Home </div>;
}

function MyRoute() {
    return (
        <div>
            <h1>MyRoute</h1>
            <Link to="/myroute/edit"> Edit </Link>
            <Route
                path="/myroute/edit"
                render={({ history }) => (
                    <ModalComponent history={history}>
                        Welcome to the MyRoute edit screen
                    </ModalComponent>
                )}
            />
        </div>
    );
}

class ModalComponent extends React.Component {
    onClick = e => {
        e.preventDefault();
        this.props.history.goBack();
    };

    render() {
        return (
            <Modal isOpen>
                <h1> {this.props.children} </h1>
                <Link to="/myroute" onClick={this.onClick}>
                    Back
                </Link>
            </Modal>
        );
    }
}

function App() {
    return (
        <BrowserRouter>
            <div>
                <Link to="/"> Home </Link>
                <Link to="/myroute"> My Route </Link>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/myroute" component={MyRoute} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("root");
Modal.setAppElement(rootElement);
ReactDOM.render(<App />, rootElement);