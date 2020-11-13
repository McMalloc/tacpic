import {storiesOf} from "@storybook/react";
import {Button} from "../components/gui/Button";
import {action} from "@storybook/addon-actions";
import Widget from "../components/gui/WidgetContainer";
import React, {Fragment} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import styled from "styled-components/macro";
import {TabPane} from "../components/gui/Tabs";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const widgetA = props => {
    return <p>Widget A</p>;
};

const widgetB = props => {
    return <p>Widget B</p>;
};

const menu = props => {
    return <Button>Menüaktion1</Button>;
};

const Gridbox = styled.div`
  height: 60px;
  width: 100%;
  border: 2px solid #3e90e8;
  border-radius: 3px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 12px;
  padding: 6px;
  box-shadow: 3px 3px 0 rgba(62, 144, 232, 0.4);
  overflow: visible;
  
  code {
    font-family: "Source Code Pro", monospace;
    color: #333;
    font-size: 0.75em;
  }
`;

const Column = styled.div`
  &.tall {
    .column-content {
      height: 100px;
    }
  }
`;

const gridExamples = [
    ["Einfache Spalten mit Breakpoints md und xs", "", "col-md-6 col-xs-12", "col-md-6 col-xs-12"],
    ["", "", "col-md-3 col-xs-6", "col-md-9 col-xs-6"],
    ["Offsets", "", "col-xs-3 col-xs-offset-2", "col-xs-2", "col-xs-3 col-xs-offset-1"],
    ["Automatische Aufteilung über volle Breite", "", "col-xs", "col-xs", "col-xs", "col-xs", "col-xs", "col-xs", "col-xs"],
    ["Anordnung am Ende der Zeile", "end-md", "col-md-5 col-xs-12", "col-md-5 col-xs-12"],
    ["Mittlere Ausrichtung der Spalten", "middle-md", "col-md-6 tall", "col-md-6"],
    ["Untere Ausrichtung der Spalten", "bottom-md", "col-md-3", "col-md-3 tall", "col-md-6"]
].map(row => {
    return (
        <Fragment>
            <div className={"row top-md"}>
                <div className={"col-xs-4"}>
                    <div>{row[0]} <br /><code style={{color: "#3e90e8", fontSize: "0.75em"}}>&lt;div class=&quot;row {row[1]}&quot;&gt;&lt;/div&gt;</code></div>
                </div>
                <div className={"col-xs-8"}>
                    <div className={"row " + row[1]}>
                        {row.slice(2).map((column, index) => {
                            return (
                                <Column className={column} key={index}>
                                    <Gridbox className={"column-content"}><code>{column}</code></Gridbox>
                                </Column>
                            )
                        })}
                    </div>
                </div>
            </div>
            <p>&nbsp;</p>
        </Fragment>
    )
});

storiesOf('Layout', module)
    .add('Grid', () =>
        <section>
            <p><a href={"http://flexboxgrid.com/"}>Offizielle Dokumentation</a></p>
            {gridExamples}
        </section>
    )
    .add('Custom Grid', () =>
        <section>
            <ResponsiveReactGridLayout
                className="layout"
                draggableHandle={'.drag-handle'}
                draggableCancel={'.no-drag'}
                cols={{lg: 12, sm: 8}}
                id={'widget-grid'}
                breakpoints={{lg: 1200, sm: 768}}
                margin={[6, 6]}
                onResizeStop={action('resized')}
                onLayoutChange={action('layout changed')}
                rowHeight={30}>
                <div key={'widget-a'}
                     data-grid={{
                         x: 0,
                         y: 0,
                         w: 4,
                         h: 5,
                         static: false}}>
                    <Widget component={widgetA} title={'Werkzeuge'}/>
                </div>
                <div key={'widget-c'}
                     data-grid={{
                         x: 0,
                         y: 0,
                         w: 4,
                         h: 5,
                         static: false}}>
                    <Widget component={() => {return <div></div>}} title={'Canvas'}/>
                </div>
                <div key={'widget-b'}
                     data-grid={{
                         x: 0,
                         y: 0,
                         w: 6,
                         h: 5,
                         static: false}}>
                    <Widget component={widgetB} title={'Details'} menu={menu}/>
                </div>
            </ResponsiveReactGridLayout>
        </section>,
        {
            notes: {markdown: `Hier die Notizen bitte!`}
        }
    )
    .add('Trennelemente', () =>
        <section>

        </section>
    )
    .add('Tabs', () =>
        <section>
            <TabPane tabs={[
                {
                    label: 'Tab Eins',
                    content: <p>{faker.lorem.paragraphs(2)}</p>
                },
                {
                    label: 'Tab Zwei',
                    content: <p>{faker.lorem.paragraphs(2)}</p>
                },
                {
                    label: 'Tab Drei',
                    icon: 'cog',
                    content: (
                        <div className={"row"}>
                            <div className={"col-xs-6"}><img src={faker.image.abstract()} /></div>
                            <div className={"col-xs-6"}>{faker.lorem.paragraphs(2)}</div>

                        </div>
                    )
                },
                {
                    label: 'Tab Vier',
                    content: <p>{faker.lorem.paragraphs(2)}</p>
                }
            ]} />
        </section>
    );