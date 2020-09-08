import React from "react";

export default props => (<div style={{
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
    <p style={{maxWidth: 600, margin: 'auto'}}>Tut uns Leid, es ist ein Fehler aufgetreten. Ihre bisherigen
        Arbeitsschritte wurden gespeichert. Ein Fehlerbericht wurde anonym an uns gesendet.</p><br/>
    <pre style={{
        maxWidth: 600,
        margin: 'auto',
        borderRadius: 5,
        backgroundColor: "#e4276f",
        padding: 5
    }}>{props.message} {props.stack}</pre>
</div>)