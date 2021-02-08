import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import Toggle from "../gui/Toggle";
import { FlyoutButton, FlyoutEntry } from "../gui/FlyoutButton";
import { ITEM_ADDED_TO_BASKET } from "../../actions/action_constants";
import styled, { useTheme } from "styled-components/macro";
import { useTranslation } from "react-i18next";
import { Icon } from "../gui/_Icon";
import { TagView } from "./Tag";
import { Alert } from "../gui/Alert";
import { NavLink } from "react-router-dom";
import Carousel from "../gui/Carousel";
import ButtonBar from "../gui/ButtonBar";
import { Radio } from "../gui/Radio";
import { Numberinput } from "../gui/Input";
import { Currency } from "../gui/Currency";
import * as moment from "moment";
import { APP_URL, API_URL } from "../../env.json";
import Well from "../gui/Well";
import { MD_SCREEN, SM_SCREEN, DB_DATE_FORMAT } from "../../config/constants";
import { FILE } from "../../actions/action_constants";
import useIntersect from "../../contexts/intersections";
import { useBreakpoint } from "../../contexts/breakpoints";

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
  /* display: flex;
  flex-direction: column;
  padding-bottom: 12px; */
  grid-area: details;
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
  grid-template-rows: auto;
  grid-template-areas:
    "title"
    "preview"
    "description"
    "details";

  .description {
    grid-area: description;
    overflow: auto;
    background: linear-gradient(0deg, rgba(0,0,0,0.2439477744222689) 0%, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 100%);
  }

  .details {
    grid-area: details;
    margin-top: 0.5rem;
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
    height: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr 1fr;
    grid-template-areas:
      "preview  title"
      "preview  description"
      "preview  details";
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

  const pagePreviews = <Preview>
    <Carousel
      single={
        <span className={"disabled"}>Insgesamt eine Grafikseite.</span>
      }
    >
      {props.document.pages
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
        )}
    </Carousel>
  </Preview>

  const description = <div className={"description"}>
    {props.description.trim() !== "()" ?
      <p>{props.description}</p>
      :
      <em>(Keine Beschreibung)</em>
    }
  </div>

  const detailTable = <table className={'extra-margin'}>
    <tbody>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={"Format der Grafikseiten"} icon={"file-image"} />
        </td>
        <td><small>Grafikseiten</small></td>
        <td className={""}>
          {`${props.graphic_no_of_pages} × ${t(
            `catalogue:${props.graphic_format}-${props.graphic_landscape ? "landscape" : "portrait"
            }`
          )}`}
        </td>
      </tr>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={"Format der Brailleseiten"} icon={"file-alt"} />
        </td>
        <td><small>Brailleseiten</small></td>

        {props.braille_no_of_pages === 0 ? (
          <td className={"disabled"}>{t("gui:none")}</td>
        ) : 
            <td>
              {`${props.braille_no_of_pages} × ${t("catalogue:a4-portrait")}`}
            </td>
          }
      </tr>
    <tr>
      <td className={"icon-cell"}>
        <Icon title={"Braillesystem"} icon={"braille"} />
      </td>
      <td><small>{t("catalogue:braillesystem")}</small></td>
      <td className={""}>
        {t(props.system)}
      </td>
    </tr>
    <tr>
      <td className={"icon-cell"}>
        <Icon title={"Schlagworte"} icon={"tags"} />
      </td>
      <td><small>Schlagworte</small></td>
      {props.tags.length && props.tags.length > 0 ? (
        <>
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
            {t("gui:none")}
          </td>
        )}
    </tr>
    <tr>
      <td className={"icon-cell"}>
        <Icon title={"Erstellt am"} icon={"calendar-alt"} />
      </td>
      <td><small>Erstellt am</small></td>
      <td>
        {moment(props.created_at, DB_DATE_FORMAT).format(
          "DD.MM.YYYY, HH:mm"
        )}{" "}
              Uhr
        </td>
    </tr>
    </tbody>
  </table >

  const buttonBar = <ButtonBar align={'left'}>
  <FlyoutButton
    flyoutWidth={300}
    disabled={!logged_in || !lg}
    icon={"pen"}
    label={"Im Editor öffnen, um ..."}
  >
    <FlyoutEntry
      icon={"file-medical"}
      label={"catalogue:variant-copy"}
      onClick={() => {
        dispatch({
          type: FILE.OPEN.REQUEST,
          id: variantId,
          mode: 'copy',
        });
        navigate('/editor/app');
      }}
      sublabel={"catalogue:variant-copy-hint"}
    />
    <FlyoutEntry
      icon={"glasses"}
      label={"catalogue:variant-edit"}
      onClick={() => {
        dispatch({
          type: FILE.OPEN.REQUEST,
          id: variantId,
          mode: 'edit',
        });
        navigate('/editor/app');
      }}
      sublabel={"catalogue:variant-edit-hint"}
    />
    <FlyoutEntry
      icon={"file-export"}
      label={"catalogue:variant-new"}
      onClick={() => {
        dispatch({
          type: FILE.OPEN.REQUEST,
          id: variantId,
          mode: 'new',
        });
        navigate('/editor/app');
      }}
      sublabel={"catalogue:variant-new-hint"}
    />
  </FlyoutButton>

  <FlyoutButton
    disabled={!logged_in}
    rightAlign
    icon={"file-download"}
    label={"catalogue:download-as"}
  >
    {['pdf', 'rtf', 'brf', 'zip'].map(format => {
      return <FlyoutEntry
        icon={format === 'pdf' ? 'file-pdf' : format === 'zip' ? 'file-archive' : format === 'rtf' ? 'file-word' : 'braille'}
        key={format}
        label={"catalogue:" + format}
        onClick={() =>
          (window.location = `${APP_URL}/variants/${variantId}/${format}_${props.current_file_name}.${format}`)
        }
        sublabel={`catalogue:${format}-hint`}
      />
    })}
  </FlyoutButton>
  <Toggle
    label={"catalogue:history_" + (showHistory ? "hide" : "show")}
    toggled={showHistory}
    icon={"history"}
    onClick={() =>
      setSearchParams({ view: showHistory ? "" : "history" })
    }
  />
</ButtonBar>

return (
  <Wrapper ref={ref}>
    {pagePreviews}

    <Title>
      {props.graphicTitle}: {props.title}
    </Title>
    {description}

    <div className={'details'}>
      {detailTable}

      {!logged_in && (
        <Alert info>
          Bitte <NavLink to={"/login"}>logge dich ein</NavLink> oder{" "}
          <NavLink to={"/signup"}>erstelle ein Konto</NavLink>, um Grafiken
              zu bearbeiten.
        </Alert>
      )}

      {!lg && <Alert warning>{t("editor:not_available-screen")}</Alert>}

      {buttonBar}

      <Well>
        {props.braille_no_of_pages > 0 ? (
          <Radio
            onChange={setProduct}
            legend={'Grafik auf Schwellpapier bestellen und Bildbeschreibung erhalten als'}
            name={"graphic_only_or_both_" + props.id}
            value={product} options={[
              {
                label: `${props.braille_no_of_pages} × DIN A4, Brailleprägung`,
                value: "graphic"
              },
              {
                label: "E-Mail" + ` (${((props.quote - props.quote_graphics_only) / 100)
                  .toFixed(2)
                  .replace(".", ",")}€ günstiger)`, value: "graphic_nobraille"
              }
            ]} />
        ) : (
            <p><strong>Grafik auf {props.graphic_no_of_pages} Seite/n Schwellpapier bestellen</strong></p>
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
    </div>

  </Wrapper>
);
};

export default VariantView;
