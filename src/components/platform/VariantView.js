import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import Toggle from "../gui/Toggle";
import { FlyoutButton, FlyoutEntry } from "../gui/FlyoutButton";
import { ITEM_ADDED_TO_BASKET, ITEM_REMOVED_FROM_BASKET, VARIANT } from "../../actions/action_constants";
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
import * as moment from "moment";
import { APP_URL, API_URL } from "../../env.json";
import Well from "../gui/Well";
import { MD_SCREEN, SM_SCREEN, DB_DATE_FORMAT } from "../../config/constants";
import { FILE } from "../../actions/action_constants";
import useIntersect from "../../contexts/intersections";
import { useBreakpoint } from "../../contexts/breakpoints";
import { Trans } from "react-i18next";
import InfoLabel from "../gui/InfoLabel";
import Select from "../gui/Select";

const addToBasket = (dispatch, variantId, quantity, product, index = null) => {
  dispatch({
    type: ITEM_ADDED_TO_BASKET,
    productId: product,
    contentId: parseInt(variantId),
    quantity: parseInt(quantity),
    index,
  });
};

const removeFromBasket = (dispatch, index) => {
  dispatch({
    type: ITEM_REMOVED_FROM_BASKET,
    index
  });
};

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
    "details"
    "order";

  .details {
    grid-area: details;
    margin-top: 0.5rem;
    /* background: linear-gradient(0deg, rgba(0,0,0,0.2439477744222689) 0%, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 100%); */
  }

  flex: 0 1 auto;
  box-sizing: border-box;
  padding: ${(props) => props.theme.large_padding};

  min-width: 100%;

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
  grid-area: order;
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const { lg, md } = useBreakpoint();
  let { graphicId, variantId } = useParams();
  const dispatch = useDispatch();
  const tags = useSelector(state => state.catalogue.tags);
  const basketIndex = useSelector(state => state.catalogue.basket.map(item => parseInt(item.contentId)).findIndex(id => id == variantId));
  const { logged_in, role } = useSelector((state) => state.user);
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
        <span className={"disabled"}>{t('catalogue:onlyOnePage')}</span>
      }
    >
      {props.document.pages
        .map((page, index) => {
          return (
            <img
              key={index}
              alt={t('catalogue:pagePreview', { file: props.graphicTitle, number: index + 1 })}
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

  const buttonBar = <ButtonBar>
    <FlyoutButton
      flyoutWidth={300}
      disabled={!logged_in || !lg}
      icon={"pen"}
      label={"catalogue:openInEditor"}
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
        &ensp;
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
    &ensp;
    <Toggle
      label={"catalogue:history_" + (showHistory ? "hide" : "show")}
      toggled={showHistory}
      icon={"history"}
      onClick={() =>
        setSearchParams({ view: showHistory ? "" : "history" })
      }
    />
    {role === 1 &&
      <FlyoutButton
        disabled={!logged_in}
        label={'catalogue:adminFeatures'} icon={'eye-slash'}
      >
        <FlyoutEntry
          label={"catalogue:hideVariant"}
          onClick={() => dispatch({ type: VARIANT.HIDE.REQUEST, payload: { id: variantId, public: false } })}
          sublabel={""}
        />
        <FlyoutEntry
          label={"catalogue:hideGraphic"}
          onClick={() => { }}
          sublabel={""}
        />

      </FlyoutButton>
    }
  </ButtonBar>

  return (
    <Wrapper ref={ref}>
      {pagePreviews}

      <Title className={'breakable-long-lines'}>
        {props.graphicTitle}: {props.title}
      </Title>

      <div className={'details'}>
        <div className={'extra-margin'}>
          <InfoLabel
            icon={'file-image'}
            title={'catalogue:graphicPagesFormat'}
            info={`${props.graphic_no_of_pages} × ${t(
              `catalogue:${props.graphic_format}-${props.graphic_landscape ? "landscape" : "portrait"
              }`
            )}`}
            label={'catalogue:graphicPages'} />

          <InfoLabel
            icon={'file-alt'}
            title={'catalogue:braillePagesFormat'}
            info={props.braille_no_of_pages > 0 ? `${props.braille_no_of_pages} × ${t("catalogue:a4-portrait")}` : <span className={"disabled"}>{t("none")}</span>}
            label={'catalogue:braillePages'} />

          <InfoLabel
            icon={'braille'}
            title={'catalogue:brailleSystem'}
            info={props.system.replace(':', '.')}
            label={'catalogue:brailleSystem'} />

          <InfoLabel
            icon={'tags'}
            title={'catalogue:appliedTags'}
            info={props.tags.length && props.tags.length > 0 ? (
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
                <span className={"disabled"}>
                  {t("none")}
                </span>
              )}
            label={'catalogue:appliedTags'} />


          <InfoLabel
            icon={'calendar-alt'}
            noTranslate
            title={'catalogue:createdAt'}
            info={moment(props.created_at, DB_DATE_FORMAT).format(t('dateFormat'))}
            label={'catalogue:createdAt'} />
        </div>

        {!logged_in && (
          <Alert info>
            <Trans i18nKey={'editor:pleaseLogin'}>
              0<NavLink to={"/login"}>1</NavLink>2<NavLink to={"/signup"}>3</NavLink>4
          </Trans>

          </Alert>
        )}

        {!lg && <Alert info>{t("editor:not_available-screen")}</Alert>}
      </div>
      <div className={'order'}>
        {buttonBar}

        <Well>

          <InfoLabel
            label={'Grafik'}
            info={`${props.graphic_no_of_pages} × ${t(
              `catalogue:${props.graphic_format}-${props.graphic_landscape ? "landscape" : "portrait"
              }`
            )}`}
          />

          {props.braille_no_of_pages > 0 &&
            <Select isSearchable={false} label={t('commerce:descriptionAs')} value={product} onChange={event => setProduct(event.value)} name={"graphic_only_or_both_" + props.id} options={[
              {
                label: <FlyoutEntry
                  icon={"braille"}
                  label={t('catalogue:orderWithBrailleEmboss', { count: props.braille_no_of_pages })}
                  // sublabel={"catalogue:orderWithBrailleEmbossHint"}
                />,
                display: t('catalogue:orderWithBrailleEmboss', { count: props.braille_no_of_pages }),
                value: 'graphic'
              },
              {
                label: <FlyoutEntry
                  icon={"file-word"}
                  label={t('catalogue:orderWithBrailleMail',
                    { saved: (props.quote - props.quote_graphics_only) })}
                  sublabel={"catalogue:orderWithBrailleMailHint"}
                />,
                display: t('catalogue:orderWithBrailleMail',
                { saved: (props.quote - props.quote_graphics_only) }),
                value: 'graphic_nobraille'
              }
            ]} />}
          <br />

          <OrderWidget>
            {/*<div style={{display: 'flex'}}>*/}
            <Numberinput
              // disabled={}
              inline
              noMargin
              onChange={(event) => {
                setQuantity(Math.max(parseInt(event.currentTarget.value), 1));
              }}
              min={1}
              value={quantity}
              label={t(`catalogue:pcs`)}
            />

            <div>
              <strong>{t('{{amount, currency}}', {
                amount: (product === "graphic"
                  ? props.quote
                  : props.quote_graphics_only) * (quantity || 0)
              })}</strong>

              <div style={{ fontSize: '0.8rem' }}>
                {quantity !== 1 &&
                  <>{t('catalogue:singlePrice')}: {t('{{amount, currency}}', {
                    amount: (product === "graphic"
                      ? props.quote
                      : props.quote_graphics_only)
                  })}</>}
                <br />
                {t("catalogue:plusShipping", { amount: 200 })}
                <br />
                {t('catalogue:deliveryTime', { lower: 4, upper: 5 })}
              </div>
            </div>

            <Button
              onClick={() => {
                basketIndex === -1 ?
                  addToBasket(dispatch, variantId, quantity, product)
                  :
                  removeFromBasket(dispatch, basketIndex)
              }}
              label={t(basketIndex >= 0 ? "commerce:remove" : "catalogue:addToCart")}
              title={t("catalogue:removeFromCart")}
              large
              primary={basketIndex === -1}
              icon={basketIndex >= 0 ? "shopping-cart" : "cart-plus"}
            />
          </OrderWidget>
        </Well>
      </div>

    </Wrapper>
  );
};

export default VariantView;
