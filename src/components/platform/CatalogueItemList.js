import React, {useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import CatalogueItem, {Wrapper as CatalogueItemWrapper} from "./CatalogueItem";
import styled from "styled-components/macro";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";
import {Alert} from "../gui/Alert";
import {FILE, LOAD_MORE} from "../../actions/action_constants";
import {Button} from "../gui/Button";

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
`;

const AddButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: bold;
  text-shadow: 0 0 3px white;
  //box-shadow: 1px 1px 2px rgba(0,0,0,0.35);
  transition: font-size 0.2s;
  transition-timing-function: ease-in;
  //border: 3px solid ${props => props.theme.grey_5};
  position: relative;
  
  &:before {
    position: absolute;
    content: " ";
    top: 2px; left: 2px; right: 2px; bottom: 2px;
    border: 3px solid ${props => props.theme.grey_4};
    transition: left 0.2s, top 0.2s, right 0.2s, bottom 0.2s, background-color 0.2s, border-color 0.2s;
    transition-timing-function: ease-in;
    border-radius: ${props => props.theme.border_radius};
  }
  
  &:hover {
  text-decoration: underline;
    &:before {
      left: 5%; top: 5%; right: 5%; bottom: 5%; 
      border-color: ${props => props.theme.brand_secondary_light};
    }
  }
`

const CatalogueItemList = props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filtered = !useSelector(
        state => state.catalogue.filterTags.length === 0 &&
            state.catalogue.filterTerms.length === 0 &&
            state.catalogue.filterFormat.length === 0 &&
            state.catalogue.filterSystem.length === 0
    );
    const loadMorePending = useSelector(state => state.catalogue.loadMorePending);

    return (
        <>
            <FlexRow>
                {props.graphics && props.graphics.length > 0 ? props.graphics.map((graphic, index) => {
                        return (
                            <CatalogueItem key={index} {...graphic} filtered={filtered}/>
                        )
                    })
                    :
                    <Alert info>Keine Grafiken gefunden.</Alert>
                }
                <CatalogueItemWrapper>
                    <AddButton id={'btn-new-graphic'} onClick={() => {
                        navigate("/editor/new");
                    }}>
                        <span><Icon icon={'plus'}/></span>
                        <span>Neue Grafik</span>
                    </AddButton>
                </CatalogueItemWrapper>
            </FlexRow>
            <div className={"align-center padded-top"}>
                <Button primary label={"Mehr laden"} large disabled={loadMorePending}
                        icon={loadMorePending ? "cog fa-spin" : "ellipsis-h"} onClick={() => {
                    dispatch({
                        type: LOAD_MORE
                    });
                }}/>
            </div>
        </>

    );
};

export default CatalogueItemList;