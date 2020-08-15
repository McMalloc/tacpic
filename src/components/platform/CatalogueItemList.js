import React, {useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import CatalogueItem, {Wrapper as CatalogueItemWrapper} from "./CatalogueItem";
import styled from "styled-components";
import {Button} from "../gui/Button";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {Icon} from "../gui/_Icon";
import {Alert} from "../gui/Alert";

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
  box-shadow: 1px 1px 2px rgba(0,0,0,0.35);
  background:url(
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAK0lEQVQYV2P8////f0ZGRkYGKADzYRwQDRIA0SgqwAIwbXAVUGMY0QVAqgGzDxf+fIja2gAAAABJRU5ErkJggg==
   ) repeat;
  border-radius: ${props => props.theme.border_radius};
  border: 3px solid ${props => props.theme.grey_5};
  
  &:hover {
    background-color: ${props => props.theme.background};
  }
`

const handleNewGraphic = (dispatch, doRedirect) => {
    doRedirect(true);
    dispatch({
        type: "NEW_GRAPHIC_STARTED"
    });
};

const CatalogueItemList = props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [redirect, doRedirect] = useState(false);
    const filtered = !useSelector(
        state => state.catalogue.filterTags.length === 0 &&
            state.catalogue.filterTerms.length === 0 &&
            state.catalogue.filterFormat.length === 0 &&
            state.catalogue.filterSystem.length === 0
    );


    if (redirect) return <Navigate push to="/editor/new"/>
    if (!(props.graphics && props.graphics.length > 0)) return <Alert info>Keine Grafiken gefunden.</Alert>;

    return (
        <>
            <FlexRow>
                {props.graphics && props.graphics.length > 0 && props.graphics.map((graphic, index) => {
                        return (
                            <CatalogueItem key={index} {...graphic} filtered={filtered}/>
                        )
                    })
                }
                <CatalogueItemWrapper>
                    <AddButton id={'btn-new-graphic'} onClick={() => handleNewGraphic(dispatch, doRedirect)}>
                        <span><Icon icon={'plus'}/></span>
                        <span>Neue Grafik</span>
                    </AddButton>
                </CatalogueItemWrapper>
            </FlexRow>
        </>

    );
};

export default CatalogueItemList;