import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { GRAPHIC, VARIANT } from "../../actions/action_constants";
import VariantView from "./VariantView";
import styled, { useTheme } from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { TagView } from "./Tag";
import { API_URL } from "../../env.json";
import Loader from "../gui/Loader";
import { useBreakpoint } from "../../contexts/breakpoints";
import { DB_DATE_FORMAT } from "../../config/constants";
import * as moment from 'moment'
import { Icon } from "../gui/_Icon";
import { Button } from "../gui/Button";

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
      background-color: ${(props) => props.theme.danger};
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

const VariantPreview = ({
  title,
  id,
  description,
  tags,
  document,
  current_file_name,
  subtitle,
}) => {
  let selectedVariantId = useParams().variantId;
  const allTags = useSelector((state) => state.catalogue.tags);
  return (
    <VariantPreviewStyled active={id === parseInt(selectedVariantId)}>
      <img
        src={`${API_URL}/thumbnails/${current_file_name}-THUMBNAIL-xl-p0.png`}
      />
      <div className={"variant-info"}>
        <strong>{title}</strong>
        <br />
        {subtitle && <small>{subtitle}</small>}
        <div>
          {!!tags && tags.length !== 0 &&
            tags.map((t, index) => {
              let completeTag = allTags.find((_t) => _t.tag_id === t);
              if (index > nrOfVisibleTags) return null;
              if (index === nrOfVisibleTags)
                return (
                  <TagView>({tags.length - nrOfVisibleTags} weitere)</TagView>
                );
              return (
                <TagView title={"Schlagwort"} key={t}>
                  {completeTag && completeTag.name}
                </TagView>
              );
            })}
        </div>
      </div>
    </VariantPreviewStyled>
  );
};

const VariantCarousel = (props) => {
  return {};
};

const CatalogueItemView = ({ variantsOverview }) => {
  let { graphicId, variantId } = useParams();
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.catalogue.graphicGetPending);
  const history = useSelector((state) => state.catalogue.currentHistory);
  const { md } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
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
        <strong>Verfügbare Varianten</strong> ({variantsOverview.length} gesamt)
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
