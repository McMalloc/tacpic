import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import Toggle from "../gui/Toggle";
import { FlyoutButton, FlyoutEntry } from "../gui/FlyoutButton";
import { ITEM_ADDED_TO_BASKET, VARIANT } from "../../actions/action_constants";
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

const addToBasket = (dispatch, variantId, quantity, product, index = null) => {
  dispatch({
    type: ITEM_ADDED_TO_BASKET,
    productId: product,
    contentId: parseInt(variantId),
    quantity: parseInt(quantity),
    index,
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
    "description"
    "details";

  .description {
    grid-area: description;
    min-height: 5rem;
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const { lg, md } = useBreakpoint();
  let { graphicId, variantId } = useParams();
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.catalogue.tags);
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

  const description = <div className={"description"}>
    {props.description.trim() !== "()" ?
      <p>{props.description}</p>
      :
      <em>({t('catalogue:pagePreview')})</em>
    }
  </div>

  const detailTable = <table className={'extra-margin'}>
    <tbody>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={t('catalogue:graphicPagesFormat')} icon={"file-image"} />
        </td>
        <td><small>{t('catalogue:graphicPages')}</small></td>
        <td className={""}>
          {`${props.graphic_no_of_pages} × ${t(
            `catalogue:${props.graphic_format}-${props.graphic_landscape ? "landscape" : "portrait"
            }`
          )}`}
        </td>
      </tr>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={t('catalogue:braillePagesFormat')} icon={"file-alt"} />
        </td>
        <td><small>{t('catalogue:braillePages')}</small></td>

        {props.braille_no_of_pages === 0 ? (
          <td className={"disabled"}>{t("none")}</td>
        ) :
          <td>
            {`${props.braille_no_of_pages} × ${t("catalogue:a4-portrait")}`}
          </td>
        }
      </tr>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={t('catalogue:brailleSystem')} icon={"braille"} />
        </td>
        <td><small>{t("catalogue:brailleSystem")}</small></td>
        <td className={""}>
          {t(props.system.replace(':', '.'))}
        </td>
      </tr>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={t("catalogue:appliedTags")} icon={"tags"} />
        </td>
        <td><small>{t("catalogue:appliedTags")}</small></td>
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
              {t("none")}
            </td>
          )}
      </tr>
      <tr>
        <td className={"icon-cell"}>
          <Icon title={t('catalogue:createdAt')} icon={"calendar-alt"} />
        </td>
        <td><small>{t('catalogue:createdAt')}</small></td>
        <td>
          {moment(props.created_at, DB_DATE_FORMAT).format(t('dateFormat'))}
        </td>
      </tr>
    </tbody>
  </table >

  const buttonBar = <ButtonBar align={'left'}>
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

      <Title>
        {props.graphicTitle}: {props.title}
      </Title>
      {description}

      <div className={'details'}>
        {detailTable}

        {!logged_in && (
          <Alert info>
            <Trans i18nKey={'editor:pleaseLogin'}>
              0<NavLink to={"/login"}>1</NavLink>2<NavLink to={"/signup"}>3</NavLink>4
          </Trans>

          </Alert>
        )}

        {!lg && <Alert warning>{t("editor:not_available-screen")}</Alert>}

        {buttonBar}

        <Well>
          {props.braille_no_of_pages > 0 ? (
            <Radio
              onChange={setProduct}
              legend={['catalogue:orderWithBraille', { count: props.graphic_no_of_pages }]}
              name={"graphic_only_or_both_" + props.id}
              value={product} options={[
                {
                  label: t('catalogue:orderWithBrailleEmboss', { count: props.braille_no_of_pages }),
                  value: "graphic"
                },
                {
                  label: t('catalogue:orderWithBrailleMail',
                    { saved: (props.quote - props.quote_graphics_only) }),
                  value: "graphic_nobraille"
                }
              ]} />
          ) : (
              <p><strong>{t('catalogue:orderWithoutBraille', { count: props.graphic_no_of_pages })}</strong></p>
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
              label={t(`catalogue:pcs`)}
            />

            <div>
              <strong>{t('{{amount, currency}}', {
                amount: (product === "graphic"
                  ? props.quote
                  : props.quote_graphics_only) * quantity
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
                {t('catalogue:deliveryTime', {lower: 4, upper: 5})}
              </div>
            </div>

            <Button
              onClick={() => addToBasket(dispatch, variantId, quantity, product)}
              label={t("catalogue:addToCart")}
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
