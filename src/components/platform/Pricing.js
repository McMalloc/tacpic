import styled, { useTheme } from "styled-components/macro";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import { Row } from "../gui/Grid";
import { Button } from "../gui/Button";
import Tile from "../gui/_Tile";
import { Icon } from "../gui/_Icon";
import { NavLink } from "react-router-dom";
import { ORDER_RESET } from "../../actions/action_constants";

const PrintserviceTable = styled.table`
  max-width: 600px;
  margin: 0 auto;
`;

const ProductCardWrapper = styled(Tile)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  padding: ${(props) => props.theme.large_padding};

  &:hover {
    .product-card-heading {
      text-decoration: underline;
    }
    .product-card-icon img {
      box-shadow: 0 0 0 5px ${(props) => props.theme.brand_primary};
    }
  }

  .product-card-copy {
    flex: 1 0 100px;
  }

  .product-card-icon img {
    border-radius: 100%;
    min-height: 100px;
    transition: box-shadow 0.8s;
  }

  .product-card-heading {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .product-card-subheading {
    margin-bottom: 0.8rem;
  }

  .product-card-buttons,
  .product-card-price-label {
    display: flex;
    flex-direction: column;
    flex: 1 1 50px;

    button {
      margin-bottom: 0.5rem;
    }
  }

  .product-card-price-label {
    font-weight: bold;
    margin-top: 0.5rem;
    font-size: 1.1rem;

    .price-special {
      color: ${(props) => props.theme.warning};
      text-shadow: 1px 1px 0 ${(props) => props.theme.brand_secondary_light};
    }
  }
`;

const ProductCard = (props) => {
  return (
    <ProductCardWrapper>
      <h2 className={"product-card-heading"}>{props.heading}</h2>
      <div className={"product-card-subheading"}>{props.subheading}</div>
      <div className={"product-card-icon"}>
        <img src={"images/" + props.icon} />
      </div>
      <div className={"product-card-price-label"}>
        {!!props.priceLabels[1] ? (
          <>
            <div className={"price-special"}>{props.priceLabels[0]}</div>
            <small>{props.priceLabels[1]}</small>
          </>
        ) : (
          <>{props.priceLabels[0]}</>
        )}
      </div>
      <p className={"product-card-copy"}>
        <small>{props.copy}</small>
      </p>
      <div className={"product-card-buttons"}>{props.buttons}</div>
    </ProductCardWrapper>
  );
};

const Pricing = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = useSelector((state) => state.user.logged_in);

  const products = [
    {
      name: "Nutzung des Editors",
      description:
        "Nutzen Sie den tacpic Online-Editor dauerhaft kostenlos, um Ihre Vorlagen für Ihre Taktilen Grafiken zu entwerfen.",
      duration: "unbegrenzt",
      icon: "icon_guenstig.svg",
      price: "kostenlos",
      priceHint: null,
      buttons: [
        loggedIn ? (
          "Sie haben sich bereits registriert!"
        ) : (
          <Button
            onClick={() => navigate("/signup")}
            icon={"user-plus"}
            label={"Konto anlegen"}
            primary
          />
        ),
        <Button
          onClick={() => navigate("/editor/new")}
          icon={"pen"}
          label={"Editor testen"}
        />,
      ],
    },
    {
      name: "Download-Lizenz",
      description: "30 Tage nach Erwerb der Lizenz stehen Ihnen sämtliche Entwürfe aus dem tacpic Katalog in zahlreichen Formaten zum Download zur Verfügung.",
      duration: "1 Monat",
      icon: "icon_guenstig.svg",
      price: "aktuell kostenlos",
      priceHint: "nach Beta-Phase 19,99€ inkl. MwSt.",
      buttons: [
        <Button
          icon={"shopping-cart"}
          label={"In den Warenkorb"}
          disabled
          primary
        />,
        <Button icon={"file"} label={"Angebot anfordern"} />,
      ],
    },
    {
      name: "Download-Lizenz",
      description:
        "365 Tage nach Erwerb der Lizenz stehen Ihnen sämtliche Entwürfe aus dem tacpic Katalog in zahlreichen Formaten zum Download zur Verfügung.",
      duration: "1 Jahr",
      icon: "icon_guenstig.svg",
      price: "aktuell kostenlos",
      priceHint: "nach Beta-Phase 19,99€ inkl. MwSt.",
      buttons: [
        <Button
          icon={"shopping-cart"}
          label={"In den Warenkorb"}
          disabled
          primary
        />,
        <Button icon={"file"} label={"Angebot anfordern"} />,
      ],
    },
  ];

  return (
    <>
      <Row>
        <div className={"col-xs-12 col-sm-12 col-lg-3"}>
          <h1>{t("general:pricing")}</h1>
        </div>
        <div className={"col-xs-12"}>
          <h2>Druckservice</h2>
          <p>
            Der Preis für eine Tastgrafik ergibt sich aus der Anzahl an Grafik-
            und Brailleseiten und dem gewünschten Format.
          </p>
          <PrintserviceTable>
            <thead>
              <th>Produkt</th>
              <th>Preis pro Seite</th>
            </thead>
            <tbody>
              <tr>
                <td>Schwellpapierdruck DIN A4</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Schwellpapierdruck DIN A3</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Brailleprägung DIN A4</td>
                <td>-</td>
              </tr>
            </tbody>
          </PrintserviceTable>
          <br />
          <br />
        </div>
      </Row>

      <Row>
        <div className={"col-xs-12 col-sm-12 col-lg-12"}>
          <h2>tacpic Online-Editor und Downloads aus dem tacpic Katalog</h2>
          <p>Der tacpic Online-Editor steht Ihnen dauerhaft kostenlos zur Verfügung und wird fortlaufend verbessert. Wenn Sie Entwürfe aus dem sich stetig erweiternden tacpic Katalog für die eigene Produktion herunterladen wollen, wird es zukünftig notwendig sein eine der angebotenen Download Lizenzen zu erwerben. Da sich tacpic.de momentan noch in der Beta-Phase befindet, steht Ihnen die Möglichkeit zum Download aktuell kostenlos zur Verfügung.</p>
        </div>
      </Row>
      <Row style={{ padding: "2rem 0" }}>
        {products.map((product) => {
          return (
            <div className={"col-xs-12 col-sm-4"}>
              <ProductCard
                heading={product.name}
                subheading={product.duration}
                icon={product.icon}
                priceLabels={[product.price, product.priceHint]}
                copy={product.description}
                buttons={product.buttons}
              />
            </div>
          );
        })}
      </Row>
      <Row>
        <div className={"col-xs-12 col-sm-4"}>
          <strong>Funktionen des tacpic Editors</strong>
          <ul>
            
            <li>Braillekonverter</li>
            <li>Basis- Voll- und Kurzschrift</li>
            <li>wissenschaftlich geprüfte Texturen</li>
            <li>Unterstützte Erstellung von Legenden</li>
            <li>Bildbeschreibungsassistent</li>
            <li>Importieren und Nachzeichen Funktion</li>
            <li>Automatische Texterkennung</li>

          </ul>
        </div>
        <div className={"col-xs-12 col-sm-8"}>
          <strong>Zum Download verfügbare Formate</strong>
          <ul>
            
            <li>PDF (Grafik)</li>
            <li>RTF (Klartext für Textverarbeitungsprogramme)</li>
            <li>RTF (codiert nach jeweiligem Braillesystem) (falls wir das anbieten werden, vorsichtshalber mal weg lassen)</li>
            <li>BRF (codiert für Brailledrucker Index Everest)</li>
            <li>ZIP-Ordner (alle Formate in einem komprimierten Ordner)</li>

          </ul>
        </div>
      </Row>
    </>
  );
};

export { Pricing };
