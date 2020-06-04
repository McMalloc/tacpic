import {storiesOf, forceReRender} from "@storybook/react";
import React from "react";
import {Ribbon} from "../components/gui/Ribbon";
import styled from 'styled-components/macro';
import {StateDecorator, State, Store} from "@sambego/storybook-state";

const Content = styled.div`
  flex: 1 1 100%;
  //columns: 100px 4;
  //text-align: justify;
  //hyphens: auto;
  //column-gap: 2em;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const store = new Store({
    type: "food"
});

store.subscribe(forceReRender);

storiesOf('Navigation', module)
    .add('Brotkrumen', () =>
        <section>

        </section>
    )
    .add('Hauptnavigation', () =>
        <section>

        </section>
    )
    // .addDecorator(StateDecorator(store))
    .add('Ribbon', () =>
            <Wrapper>
                <Ribbon menus={[
                    {label: "Essen",    icon: "utensils",   action: () => {store.set({type: "food"})}},
                    {label: "Tiere",    icon: "dove",       action: () => {store.set({type: "animals"})}},
                    {label: "Stadt",    icon: "city",       action: () => {store.set({type: "city"})}},
                    {label: "Business", icon: "suitcase",   action: () => {store.set({type: "business"})}},
                    {label: "Mode",     icon: "tshirt",     action: () => {store.set({type: "fashion"})}},
                    {label: "Verkehr",  icon: "subway",     action: () => {store.set({type: "transport"})}}]}>
                    <p>Optionaler Inhalt</p>
                </Ribbon>
                <Content>
                    <h1>{store.get("type")}</h1>
                </Content>
            </Wrapper>
    );