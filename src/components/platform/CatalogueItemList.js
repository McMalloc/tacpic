import React from "react";
import {useNavigate} from "react-router-dom";
import CatalogueItem, {Wrapper as CatalogueItemWrapper} from "./CatalogueItem";
import styled from "styled-components/macro";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";
import {Alert} from "../gui/Alert";
import {FILE, LOAD_MORE} from "../../actions/action_constants";
import {Button} from "../gui/Button";
import Loader, {LoaderOverlay} from "../gui/Loader";
import { useTranslation } from 'react-i18next';

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
`;

const Wrapper = styled.div`
  position: relative;
  min-height: 100px;
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
  transition: font-size 0.2s;
  transition-timing-function: ease-in;
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
    const { t } = useTranslation();
    const filtered = !useSelector(
        state => state.catalogue.filterTags.length === 0 &&
            state.catalogue.filterTerms.length === 0 &&
            state.catalogue.filterFormat.length === 0 &&
            state.catalogue.filterSystem.length === 0
    );
    const exhausted = useSelector(state => state.catalogue.exhausted);
    const searchPending = useSelector(state => state.catalogue.searchPending);
    const loadMorePending = useSelector(state => state.catalogue.loadMorePending);

    const newButton = <CatalogueItemWrapper>
            <AddButton id={'btn-new-graphic'} onClick={() => {
                dispatch({type: FILE.OPEN.REQUEST})
                navigate("/editor/splash");
            }}>
                <span><Icon icon={'plus'}/></span>
                <span>{t('catalogue:new_graphic') }</span>
            </AddButton>
        </CatalogueItemWrapper>

    return (
        <Wrapper>
            {props.graphics && props.graphics.length > 0 ? 
                <FlexRow>
                    {props.graphics.map((graphic, index) => {
                        return (
                            <CatalogueItem key={index} {...graphic} filtered={filtered}/>
                        )
                    })}
                    {newButton}
                </FlexRow>
                :
                <>
                    <div style={{textAlign: 'center', paddingTop: '20%'}}>
                    {/* <CatalogueItemWrapper>
                        <Alert info>{t('catalogue:no_graphic_found')}</Alert>
                    </CatalogueItemWrapper> */}

                        <p><Icon icon={"folder-open fa-2x"} /><br/>{t('catalogue:no_graphic_found')}</p>
                        <br />
                        <FlexRow style={{justifyContent: 'center'}}>
                            {newButton}
                        </FlexRow>
                    </div>
                    
                </>
                }
            <FlexRow>
                
            </FlexRow>
            <div className={"align-center padded-top"}>
                {!exhausted &&
                    <Button primary label={"catalogue:load_more"} large disabled={loadMorePending}
                        icon={loadMorePending ? "cog fa-spin" : "ellipsis-h"} onClick={() => {
                            dispatch({
                                type: LOAD_MORE
                            });
                        }} />
                }
            </div>

            {searchPending &&
            <LoaderOverlay>
                <Loader />
            </LoaderOverlay>
            }
        </Wrapper>

    );
};

export default CatalogueItemList;