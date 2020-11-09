import React from "react";

import {storiesOf} from "@storybook/react";
import { StateDecorator, Store } from "@sambego/storybook-state";

import {Button} from "../components/gui/Button";
import Modal from "../components/gui/Modal";

let store = new Store({
    showModal: false
});

storiesOf('Modal', module)
    .addDecorator(StateDecorator(store))
    .add('Standard', () =>
        <section>
            <Button onClick={() => store.set({ showModal: true })}>Modal öffnen</Button> <hr />
            <div className={"row"}>
                <div className={"col-xs-6"}><p><img src={faker.image.abstract()} /></p></div>
                <div className={"col-xs-6"}><p><img src={faker.image.abstract()} /></p></div>
            </div>
            {store.get("showModal") || true ? (
                <Modal title={"Modalfenster"} dismiss={() => store.set({ showModal: false })} actions={[
                    {label: "Ok", template: "primary", align: "right"}, {label: "Abbrechen"}
                ]}>
                    <p>{faker.lorem.paragraphs(20)}</p>
                </Modal>
            ) : null}
        </section>
    );