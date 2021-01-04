import React from "react";
import { Button } from "./components/gui/Button";
import {connect} from "react-redux";
import { ERROR_THROWN } from "./actions/action_constants";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null};
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error) {
        this.props.throwError(error);
        localStorage.setItem("HAS_EDITOR_CRASHED", "true");
    }

    render() {
        if (this.state.hasError) {
            return <div style={{
                backgroundColor: "#f06595",
                color: "white",
                height: '100%',
                padding: "12px"
            }}><h1 style={{
                textAlign: 'center',
                fontSize: '72px',
                padding: "12px"
            }}>
                {["Herrjemine", "Hoppla", "Hossa", "Ach du grüne Neune"][Math.floor(Math.random() * 4)]}
                <br/>
                <span className={"fas fa-skull fa-xs fa-pulse"}/>
            </h1>
                <p style={{maxWidth: 600, margin: 'auto'}}>Tut uns Leid, es ist ein <strong>Fehler</strong> aufgetreten. Ihre bisherigen
                    Arbeitsschritte wurden gespeichert. Ein Fehlerbericht wurde anonym an uns gesendet.
                </p>
                <br/>
                <br/>
                <div style={{textAlign: 'center', maxWidth: 600, margin: 'auto'}}>
                    <Button primary onClick={() => window.location.reload()}>Seite neuladen</Button>
                </div>
                <br/>
                <br/>
                <p style={{maxWidth: 600, margin: 'auto'}}>
                    Der Fehlerbericht meldet Folgendes:
                </p>
                <pre style={{
                    maxWidth: 800,
                    margin: 'auto',
                    borderRadius: 5,
                    fontSize:'70%',
                    color: '#eeeeee',
                    backgroundColor: "#02333e",
                    padding: 12
                }}>{this.state.error.message} <br/>{this.state.error.stack}</pre>

            </div>
        }

        return this.props.children;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        throwError: error => {
            dispatch({
                type: ERROR_THROWN, error
            });
        }
    }
}
export default connect(null, mapDispatchToProps)(ErrorBoundary);