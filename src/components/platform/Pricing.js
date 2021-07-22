import styled, { useTheme } from "styled-components/macro";
import React, { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import { Row } from "../gui/Grid";
import { Button } from "../gui/Button";
import Tile from "../gui/_Tile";

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
      box-shadow: 0 0 0 10px ${(props) => props.theme.brand_primary};
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
        <img alt={''} src={"images/" + props.icon} />
      </div>
      <div className={"product-card-price-label"}>
        {!!props.priceLabels[1] ? (
          <>
            <div className={"price-special"}>{props.priceLabels[0]}</div>
            <p className={'smallprint'}>{props.priceLabels[1]}</p>
          </>
        ) : (
          <>{props.priceLabels[0]}</>
        )}
      </div>
      <p className={"product-card-copy"}>
        <p className={'smallprint'}>{props.copy}</p>
      </p>
      <div className={"product-card-buttons"}>{props.buttons}</div>
    </ProductCardWrapper>
  );
};

const Pricing = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = useSelector((state) => state.user.logged_in);

  const products = [
    {
      name: "products:editorHeading",
      description: "products:editorDescription",
      duration: "products:forever",
      icon: "icon_guenstig.svg",
      price: "products:free",
      priceAmount: 0,
      priceHint: null,
      buttons: [
        loggedIn ? (
          null
        ) : (
          <Button
            onClick={() => navigate("/signup")}
            icon={"user-plus"}
            label={"account:signup"}
            primary
          />
        ),
        <Button
          onClick={() => navigate("/editor/app")}
          icon={"pen"}
          label={"products:editorTest"}
        />,
      ],
    },
    {
      name: "products:subHeading",
      description: "products:subDescription",
      durationText: "products:1Month",
      duration: 30,
      icon: "icon_guenstig.svg",
      price: "products:currentlyFree",
      priceAmount: 1999,
      priceHint: "products:priceHint",
      buttons: [
        <Button
          icon={"shopping-cart"}
          label={"catalogue:addToCart"}
          disabled
          primary
        />,
        // <Button icon={"file"} label={"products:requestOffer"} />,
      ],
    },
    {
      name: "products:subHeading",
      description: "products:subDescription",
      durationText: "products:1Year",
      duration: 365,
      icon: "icon_guenstig.svg",
      price: "products:currentlyFree",
      priceAmount: 19900,
      priceHint: "products:priceHint",
      buttons: [
        <Button
          icon={"shopping-cart"}
          label={"catalogue:addToCart"}
          disabled
          primary
        />,
        // <Button icon={"file"} label={"products:requestOffer"} />,
      ],
    },
  ];

  return (
    <>
      <Row>
        <div className={"col-xs-12 col-sm-12 col-lg-3"}>
          <h1>{t("products:pricing")}</h1>
        </div>
        <div className={"col-xs-12"}>
          <h2>{t("products:printing")}</h2>
          <p>{t("products:printingDescription")}</p>
          <PrintserviceTable>
            <thead>
              <th>{t("product")}</th>
              <th>{t("products:pricePerPage")}</th>
            </thead>
            <tbody>
              <tr>
                <td>{t("products:swellA4")}</td>
                <td>
                  {
                    t('{{amount, currency}}',
                      { amount: 290 }
                    )
                  }
                </td>
              </tr>
              <tr>
                <td>{t("products:swellA3")}</td>
                <td>
                  {
                    t('{{amount, currency}}',
                      { amount: 590 }
                    )
                  }
                </td>
              </tr>
              <tr>
                <td>{t("products:braille")}</td>
                <td>
                  {
                    t('{{amount, currency}}',
                      { amount: 60 }
                    )
                  }
                </td>
              </tr>
            </tbody>
            <br />
            <a target={"_blank"} rel ={"noopener noreferrer"} href={"https://tacpic.de/info/de/62?Zahlung%20und%20Versand"}>{t("products:paymentAndShippingInfo")}</a>
          </PrintserviceTable>
          <br />
          <br />
        </div>
      </Row >

      <Row>
        <div className={"col-xs-12 col-sm-12 col-lg-12"}>
          <h2>{t("products:heading")}</h2>
          <p>{t("products:description")}</p>
        </div>
      </Row>
      <Row style={{ padding: "2rem 0" }}>
        {products.map((product) => {
          return (
            <div className={"col-xs-12 col-sm-4"}>
              <ProductCard
                heading={t(product.name)}
                subheading={t(product.durationText)}
                icon={product.icon}
                priceLabels={[t(product.price), t(product.priceHint, { price: product.priceAmount })]}
                copy={t(product.description, { count: product.duration })}
                buttons={product.buttons}
              />
            </div>
          );
        })}
      </Row>
      <Row>
        <div role={'list'} className={"col-xs-12 col-sm-4"}>
          <strong>{t("products:editorFeaturesHeading")}:</strong>
          <ul>

            <Trans i18nKey={'products:editorFeatures'}>
              <li>0</li>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>6</li>
            </Trans>

          </ul>
        </div>
        <div className={"col-xs-12 col-sm-8"}>
          <strong>{t("products:formatsHeading")}:</strong>
          <ul>

            <Trans i18nKey={'products:formats'}>
              <li>0</li>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </Trans>

          </ul>
        </div>
      </Row>
    </>
  );
};

export { Pricing };
