import React, { useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { GRAPHIC, VARIANT } from "../../actions/action_constants";
import VariantView from "./VariantView";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import env from "../../env.json";
import Loader from "../gui/Loader";
import { useBreakpoint } from "../../contexts/breakpoints";
import { DB_DATE_FORMAT } from "../../config/constants";
import * as moment from 'moment'
import { Icon } from "../gui/_Icon";
import { Button } from "../gui/Button";
import { useTranslation } from "react-i18next";
import Badge from "../gui/Badge";

const VariantPreviewStyled = styled.div`
  display: flex;
  border: 4px solid transparent;
  position: relative;
  text-decoration: ${(props) => (props.active ? "underline" : "none")};
  border: 2px solid
    ${(props) => (props.active ? props.theme.brand_primary : "transparent")};
  padding: ${(props) => props.large_padding};

  background-color: ${(props) => (props.active ? props.grey_6 : "inherit")};
  color: ${(props) => (props.active ? props.foreground : "inherit")};
  

  transition: background-color 0.1s, color 0.1s;

  img {
    opacity: ${(props) => (props.active ? 1 : 0.7)};
    transition: opacity 0.2s;
  }

  &:hover {
    img {
      opacity: 1;
    }
    strong {
      text-decoration: underline;
    }
  }

  &:focus {
    opacity: 1;
    border: 2px solid ${props => props.theme.brand_primary};
    outline: none;
  }

  img {
    width: 30%;
    height: auto;
    align-self: center;
    box-shadow: ${(props) => props.distant_shadow};
  }

  .variant-info {
    flex: 1 1 100%;
    padding: ${props => props.theme.large_padding};
    color: ${props => props.active ? props.brand_secondary : "inherit"};
  }
`;

const VariantColumn = styled.div`
  overflow-y: auto;
  padding: 0;
  flex-direction: column;
  display: flex;
  position: relative;
  background-color: ${(props) => props.theme.brand_secondary};
  color: ${(props) => props.theme.background};
  //box-shadow: 3px 0 5px rgba(0,0,0,0.4);

  .heading {
    position: sticky;
    padding: ${(props) => props.theme.large_padding};
    background-color: ${(props) => props.theme.brand_secondary};
    color: ${(props) => props.theme.background};

    &.emphasised {
      background-color: ${(props) => props.theme.warning_dark};
    }
  }
`;

const DetailsColumn = styled.div`
  overflow: auto;
  padding: ${(props) => props.theme.large_padding};
  background-color: ${(props) => props.theme.grey_6};
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.grey_6};
  display: flex;
  min-width: 300px;
  max-width: 1400px;
  flex: 1 1 auto;
  overflow: hidden;
  /* touch-action: pan-y; */
`;

const nrOfVisibleTags = 3;

const VariantPreview = props => {
  let selectedVariantId = useParams().variantId;
  const { t } = useTranslation();
  return (
    <VariantPreviewStyled 
      role={'link'}
      aria-label={props.title} 
      active={props.id === parseInt(selectedVariantId)}>
      <img
        alt={t('catalogue:variantPreviewAlt') + ' ' + props.title}
        aria-hidden={true}
        src={`${env.API_URL}/thumbnails/${props.current_file_name}-THUMBNAIL-xl-p0.png`}
      />
      <div aria-hidden={true} className={"variant-info breakable-long-lines"}>
        <strong>{props.title}</strong>
        <br />
        {props.subtitle && <small>{props.subtitle}</small>}
        {!props.public &&
            <><br/><Badge serious state={'warning'}><Icon icon={'eye-slash'} /></Badge></>
          }
      </div>
    </VariantPreviewStyled>
  );
};

const CatalogueItemView = ({ variantsOverview }) => {
  let { graphicId, variantId } = useParams();
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.catalogue.graphicGetPending);
  const history = useSelector((state) => state.catalogue.currentHistory);
  const { md } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const showHistory = searchParams.get("view") === "history";

  const viewedGraphic = useSelector((state) => state.catalogue.viewedGraphic);
  const viewedVariant =
    viewedGraphic.variants &&
    viewedGraphic.variants.find((variant) => variant.id == variantId);

  useEffect(() => {
    dispatch({
      type: GRAPHIC.GET.REQUEST,
      payload: { id: graphicId },
    });
  }, [graphicId]);

  useEffect(() => {

    if (showHistory) {
      dispatch({
        type: VARIANT.HISTORY.REQUEST,
        payload: { id: variantId },
      });
    }
  }, [variantId, searchParams.get("view")]);

  const variantColumn = (
    <VariantColumn className={"col-sm-2 col-md-3 col-lg-2"}>
      <div className={"heading"}>
        <strong>{t('catalogue:availableVariants', {amount: variantsOverview.length})}</strong>
      </div>
      <div>
        {variantsOverview.map((variant, index) => {
          const derivedFrom = variantsOverview.find(
            (v) => v.id == variant.derived_from
          );
          return (
            <Link
              className={"no-styled-link"}
              key={index}
              to={`/catalogue/${graphicId}/variant/${variant.id}`}
            >
              <VariantPreview
                subtitle={derivedFrom && ("abgeleitet aus " + derivedFrom.title)}
                {...variant}
              />
            </Link>
          );
        })}
      </div>
    </VariantColumn>
  );

  const historyColumn = (
    <VariantColumn className={"col-sm-2 col-md-3 col-lg-2"}>
      <div className={"heading emphasised"}>
        <Icon icon={'history'} /> <strong>Versionshistorie</strong>
        <Button onClick={() => setSearchParams({ view: '' })} icon={'times'} style={{ float: 'right' }} />
        <br />
        Variante: {!!viewedVariant && viewedVariant.title}
      </div>
      <div>
        {history.versions.map((version, index) => {
          return (
            <VariantPreview
              title={moment(version.created_at, DB_DATE_FORMAT).format("DD.MM.YYYY, HH:mm") + ' Uhr'}
              id={version.id}
              public
              key={ index }
              subtitle={`von ${history.contributors.find(contributor => contributor.id === version.user_id).display_name}: ${version.change_message}`}
              current_file_name={version.file_name}
            />
          );
        })}
      </div>
    </VariantColumn>
  );

  return (
    <Wrapper>
      {/* <Wrapper {...gestureBind()}> */}
      {pending ? (
        <Loader
          timeout={1000}
          message={"Variante wird geladen, einen Moment noch."}
        />
      ) : md ? (
        <>
          {showHistory ? historyColumn : variantColumn}
          <DetailsColumn className={"col-sm-10 col-md-9 col-lg-10"}>
            <VariantView
              graphicTitle={viewedGraphic.title}
              {...viewedVariant}
            />
          </DetailsColumn>
        </>
      ) : (
        <div
          style={{
            width: 100 * (viewedGraphic.variants.length + 1) + "vw",
            overflow: "auto visible",
            display: "flex",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            touchAction: "pan-x pan-y",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {viewedGraphic.variants.map((variant) => {
            return (
              <VariantView graphicTitle={viewedGraphic.title} {...variant} />
            );
          })}
        </div>
      )}
    </Wrapper>
  );
};

export { CatalogueItemView };
