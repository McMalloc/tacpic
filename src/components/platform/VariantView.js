import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import { FlyoutButton, FlyoutEntry } from "../gui/FlyoutButton";
import { ITEM_ADDED_TO_BASKET } from "../../actions/action_constants";
import styled, { useTheme } from "styled-components/macro";
import { useTranslation } from "react-i18next";
import { Icon } from "../gui/_Icon";
import { TagView } from "./Tag";
import { Alert } from "../gui/Alert";
import { NavLink } from "react-router-dom";
import Carousel from "../gui/Carousel";
import Toolbar from "../gui/Toolbar";
import { Radio } from "../gui/Radio";
import { Numberinput } from "../gui/Input";
import { Currency } from "../gui/Currency";
import { template } from "lodash";
import * as moment from "moment";
import { APP_URL, API_URL } from "../../env.json";
import Well from "../gui/Well";
import More from "../gui/More";
import { MD_SCREEN, SM_SCREEN, DB_DATE_FORMAT } from "../../config/constants";
import useIntersect from "../../contexts/intersections";
import { useBreakpoint } from "../../contexts/breakpoints";

const mapFormat = (width, height) => {
  width = parseInt(width);
  height = parseInt(height);
  if (width === 210 && height === 297) return "a4-portrait";
  if (width === 297 && height === 210) return "a4-landscape";
  if (width === 297 && height === 420) return "a3-portrait";
  if (width === 420 && height === 297) return "a3-landscape";
};

const addToBasket = (dispatch, variantId, quantity, product, index = null) => {
  dispatch({
    type: ITEM_ADDED_TO_BASKET,
    productId: product,
    contentId: parseInt(variantId),
    quantity: parseInt(quantity),
    index,
  });
};

const Details = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  grid-area: details;
  //justify-content: space-between;
`;

const Title = styled.h2`
  grid-area: title;
  margin-top: 0;
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  position: relative;
  max-height: 100%;
  grid-template-columns: 1fr;
  column-gap: 0.5rem;
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    "title"
    "preview"
    "details"
    "order";

  .order {
    grid-area: order;
  }

  flex: 0 1 auto;
  box-sizing: border-box;
  padding: ${(props) => props.theme.large_padding};

  min-width: 100vw;

  ${SM_SCREEN} {
    min-width: calc(100vw - 40px); // subtraction of modal window margins
  }
  height: 100%;
  overflow-y: auto;
  scroll-snap-align: start;

  ${MD_SCREEN} {
    min-width: auto;
    padding: 0;
    height: auto;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 2fr 1fr;
    grid-template-areas:
      "preview  title"
      "preview  details"
      "preview  order";
  }
`;

const Preview = styled.div`
  grid-area: preview;
  padding: 0 20%;

  ${MD_SCREEN} {
    padding: 0 ${(props) => props.theme.large_padding};

    & > div {
      position: sticky;
      top: 0;
    }
  }
`;

const BraillePageWrapper = styled.div`
  background: white;
  box-sizing: border-box;
  overflow: auto;
  /* padding-bottom: 70.7%; // A4 aspect ratio */
  max-width: 100%;
  position: relative;
`;

const BraillePagePreview = styled.div`
  background-color: white;
  padding: 6px;
  min-height: 200px;
  /* position: absolute; */
  /* top: 0; bottom: 0; left: 0; right: 0; */
`;

const OrderWidget = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;

  & > * {
    flex: 1 1 auto;
    &:last-child {
      margin-top: 6px;
    }
  }
`;
const scrollThreshold = 0.9;

const VariantView = (props) => {
  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` lets
  // us build relative links.
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const { lg, md } = useBreakpoint();
  let { graphicId, variantId } = useParams();
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.catalogue.tags);
  const logged_in = useSelector((state) => state.user.logged_in);
  const [product, setProduct] = useState("graphic");
  const [quantity, setQuantity] = useState(1);
  const [ref, entry] = useIntersect({ threshold: scrollThreshold });
  const [searchParams, setSearchParams] = useSearchParams();
  const showHistory = searchParams.get("view") === "history";
  // TODO Suchbegriff aus Store holen und in Variantenbeschreibung hervorheben

  if (!md && entry.intersectionRatio > scrollThreshold) {
    // TODO
    window.history.replaceState(
      null,
      null,
      `/catalogue/${graphicId}/variant/${props.id}`
    );
  }

  if (!props.id) return null;

  const pagePreviews = props.document.pages
    .map((page, index) => {
      return (
        <img
          key={index}
          src={`${API_URL}/thumbnails/${props.current_file_name}-THUMBNAIL-xl-p${index}.png`}
        />
      );
    })
    .concat(
      props.braille_no_of_pages > 0 && (
        // <BraillePageWrapper>
        <BraillePagePreview>
          {Object.keys(props.document.braillePages.imageDescription).reduce(
            (accumulator, blockKey) =>
              accumulator +
              props.document.braillePages.imageDescription[blockKey] +
              "\n\n",
            ""
          ) + props.document.braillePages.content}
        </BraillePagePreview>
        // </BraillePageWrapper>
      )
    );

  return (
    <Wrapper ref={ref}>
      <Preview>
        <Carousel
          single={
            <span className={"disabled"}>Insgesamt eine Grafikseite.</span>
          }
        >
          {pagePreviews}
        </Carousel>
      </Preview>
      <Title>
        {props.graphicTitle}: {props.title}
      </Title>
      <Details>
        <div>
          {props.description.trim() !== "()" ? (
            props.description.length > 200 ? (
              <More>
                <p>{props.description}</p>
              </More>
            ) : (
              <p>{props.description}</p>
            )
          ) : (
            <em>(Keine Beschreibung)</em>
          )}
          <p>
            <small>
              Erstellt am{" "}
              {moment(props.created_at, DB_DATE_FORMAT).format(
                "DD.MM.YYYY, HH:mm"
              )}{" "}
              Uhr
              <br />
              <Button
                label={t(
                  "catalogue:history_" + (showHistory ? "hide" : "show")
                )}
                icon={"history"}
                small
                onClick={() =>
                  setSearchParams({ view: showHistory ? "" : "history" })
                }
              />
            </small>
          </p>
        </div>
        <div>
          <br />
          <table>
            <tbody>
              <tr>
                <td className={"icon-cell"}>
                  <Icon title={"Format der Grafikseiten"} icon={"file-image"} />
                </td>
                <td>Grafikseiten</td>
                <td className={"important"}>
                  {props.graphic_no_of_pages}{" "}
                  {props.graphic_no_of_pages === 1 ? "Seite" : "Seiten"}{" "}
                  {t(
                    `catalogue:${props.graphic_format}-${
                      props.graphic_landscape ? "landscape" : "portrait"
                    }`
                  )}
                </td>
              </tr>
              <tr>
                <td className={"icon-cell"}>
                  <Icon title={"Format der Brailleseiten"} icon={"braille"} />
                </td>
                <td>Brailleseiten</td>
                <td className={"important"}>
                  {props.braille_no_of_pages === 0 ? (
                    <>{t("gui:none")}</>
                  ) : (
                    <>
                      {props.braille_no_of_pages}{" "}
                      {props.braille_no_of_pages === 1 ? "Seite" : "Seiten"}{" "}
                      {t(`catalogue:${props.braille_format}-portrait`)}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className={"icon-cell"}>&ensp;</td>
                <td>{t("catalogue:braillesystem")}:</td>
                <td className={"important"}>
                  {t(props.system)}
                </td>
              </tr>
              <tr>
                <td></td>
                {props.tags.length && props.tags.length > 0 ? (
                  <>
                    <td>Schlagworte:</td>
                    <td>
                      {tags.map((tag) => {
                        if (props.tags.includes(tag.tag_id)) {
                          return (
                            <TagView
                              style={{ fontSize: "100%" }}
                              theme={theme}
                              key={tag.tag_id}
                            >
                              {tag.name}
                            </TagView>
                          );
                        } else return null;
                      })}
                    </td>
                  </>
                ) : (
                  <td className={"disabled"} colSpan={2}>
                    Keine Schlagworte für diese Variante.
                  </td>
                )}
              </tr>
            </tbody>
          </table>
          <br />

          {!logged_in && (
            <Alert info>
              Bitte <NavLink to={"/login"}>logge dich ein</NavLink> oder{" "}
              <NavLink to={"/signup"}>erstelle ein Konto</NavLink>, um Grafiken
              zu bearbeiten.
            </Alert>
          )}

          {!lg && <Alert warning>{t("editor:not_available-screen")}</Alert>}
          <Toolbar columns={2}>
            <FlyoutButton
              flyoutWidth={300}
              disabled={!logged_in || !lg}
              rightAlign
              icon={"pen"}
              label={"Im Editor öffnen, um ..."}
            >
              <FlyoutEntry
                icon={"file-medical"}
                label={"catalogue:variant-copy"}
                onClick={() =>
                  navigate(`/editor/${graphicId}/variant/${variantId}/copy`)
                }
                sublabel={"catalogue:variant-copy-hint"}
              />
              <FlyoutEntry
                icon={"glasses"}
                label={"catalogue:variant-edit"}
                onClick={() =>
                  navigate(`/editor/${graphicId}/variant/${variantId}/edit`)
                }
                sublabel={"catalogue:variant-edit-hint"}
              />
              <FlyoutEntry
                icon={"file-export"}
                label={"catalogue:variant-new"}
                onClick={() =>
                  navigate(`/editor/${graphicId}/variant/${variantId}/new`)
                }
                sublabel={"catalogue:variant-new-hint"}
              />
            </FlyoutButton>

            <FlyoutButton
              disabled={!logged_in}
              rightAlign
              icon={"file-download"}
              label={"catalogue:download-as"}
            >
              <FlyoutEntry
                icon={"file-pdf"}
                label={"catalogue:pdf"}
                onClick={() =>
                  (window.location = `${APP_URL}/variants/${variantId}/pdf_${props.current_file_name}.pdf`)
                }
                sublabel={"catalogue:pdf-hint"}
              />
              <FlyoutEntry
                icon={"file-word"}
                label={"catalogue:rtf"}
                onClick={() =>
                  (window.location = `${APP_URL}/variants/${variantId}/rtf_${props.current_file_name}.rtf`)
                }
                sublabel={"catalogue:rtf-hint"}
              />
              <FlyoutEntry
                icon={"file"}
                label={"catalogue:brf"}
                onClick={() =>
                  (window.location = `${APP_URL}/variants/${variantId}/brf_${props.current_file_name}.brf`)
                }
                sublabel={"catalogue:brf-hint"}
              />
              <FlyoutEntry
                icon={"file-archive"}
                label={"catalogue:zip"}
                onClick={() =>
                  (window.location = `${APP_URL}/variants/${variantId}/zip_${props.current_file_name}.zip`)
                }
                sublabel={"catalogue:zip-hint"}
              />
            </FlyoutButton>
          </Toolbar>
        </div>
      </Details>
      <Well className={"order"}>
        <h3>Bestellen</h3>
        {props.braille_no_of_pages > 0 ? (
          <Radio
            onChange={setProduct}
            value={product}
            name={"graphic_only_or_both_" + props.id}
            options={[
              {
                label: template(t(`catalogue:graphics_and_braille`))({
                  amount: props.braille_no_of_pages + props.graphic_no_of_pages,
                }),
                value: "graphic",
              },
              {
                label:
                  template(t(`catalogue:graphics_only`))({
                    amount: props.graphic_no_of_pages,
                  }) +
                  ` ${((props.quote - props.quote_graphics_only) / 100)
                    .toFixed(2)
                    .replace(".", ",")}€ günstiger)`,
                value: "graphic_nobraille",
              },
            ]}
          ></Radio>
        ) : (
          <p>{props.graphic_no_of_pages} Grafikseite(n)</p>
        )}

        <br />

        <OrderWidget>
          {/*<div style={{display: 'flex'}}>*/}
          <Numberinput
            // disabled={}
            inline
            noMargin
            onChange={(event) => {
              setQuantity(event.currentTarget.value);
            }}
            min={1}
            value={quantity}
            label={t(`catalogue:Stück`)}
          />

          <div>
            <Currency
              amount={
                (product === "graphic"
                  ? props.quote
                  : props.quote_graphics_only) * quantity
              }
            />

            {/*{quantity !== 1 &&*/}
            <small>
              <br />
              Einzelpreis:{" "}
              <Currency
                normal
                amount={
                  product === "graphic"
                    ? props.quote
                    : props.quote_graphics_only
                }
              />
            </small>
            {/*}*/}
            <small>
              <br />
              {t("zzgl. Versand")}
            </small>
          </div>

          <Button
            onClick={() => addToBasket(dispatch, variantId, quantity, product)}
            label={t("catalogue:In den Warenkorb")}
            large
            primary
            icon={"cart-plus"}
          />
        </OrderWidget>
      </Well>
    </Wrapper>
  );
};

export default VariantView;
