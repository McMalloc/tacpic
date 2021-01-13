import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../gui/Button";
import Modal from "../../gui/Modal";
import { GraphicPagePreview } from "../../gui/PagePreview";
import styled from "styled-components/macro";
import { useTranslation } from "react-i18next";
import {
  AccordeonMenuEntry
} from "../../gui/Accordeon";
import { Alert } from "../../gui/Alert";

const changePage = (dispatch, nr) => {
  dispatch({
    type: "PAGE_CHANGE",
    number: nr,
  });
};
const addPage = (dispatch, isTextPage, pageLength) => {
  dispatch({
    type: "PAGE_ADD",
    isTextPage,
  });
  dispatch({
    type: "PAGE_CHANGE",
    number: pageLength,
  });
};
const removePage = (dispatch, index, currentPage) => {
  currentPage === index && dispatch({
    type: "PAGE_CHANGE",
    number: Math.max(index - 1, 0),
  });
  dispatch({
    type: "PAGE_REMOVE",
    index,
  });
};

const ButtonBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${(props) => props.theme.base_padding};
  border-top: 1px solid ${(props) => props.theme.grey_4};
`;

const PageTitle = styled.div`
  padding: ${(props) => props.theme.large_padding};
`;

const Pages = (props) => {
  const { width, height, pages } = useSelector(
    (state) => state.editor.file.present
  );
  const t = useTranslation().t;
  const currentPage = useSelector((state) => state.editor.ui.currentPage);
  const dispatch = useDispatch();

  const [pageToBeRemoved, setPageToBeRemoved] = useState(null);

  return (
    <>
      <>
        {pages.map((page, index) => {
          const active = index === currentPage;
          return (
            <AccordeonMenuEntry
              active={active}
              onClick={() => changePage(dispatch, index)}
              style={{ justifyContent: "space-between" }}
              key={index}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <GraphicPagePreview
                  base={50}
                  index={index}
                  width={width}
                  height={height}
                />
                <PageTitle>{page.name !== null ? page.name : "Seite " + (index + 1)}</PageTitle>
              </div>

              {index !== 0 &&
                <Button onClick={event => {
                  event.stopPropagation();
                  setPageToBeRemoved(index)}} 
                  className={'hover-button'} small icon={"trash-alt"} />
              }
            </AccordeonMenuEntry>
          );
        })}
      </>

      <ButtonBar>
        {/* <Button
          disabled={pages.length <= 1}
                  icon={"trash-alt"}
                  label={"commerce:remove"}
          onClick={() => removePage(dispatch, currentPage)}
        /> */}
        <Button
          primary
          icon={"plus"}
          label={"editor:new_graphics_page"}
          onClick={() => addPage(dispatch, false, pages.length)}
        />
      </ButtonBar>

      {pageToBeRemoved !== null &&
        <Modal fitted actions={[
          {
            label: "editor:delete_page_confirm_cancel",
            name: "delete_page_confirm_cancel",
            align: "left",
            action: () => setPageToBeRemoved(null)
          },
          {
            label: "editor:delete_page_confirm_ok",
            name: "delete_page_confirm_ok",
            align: "right",
            template: 'primary',
            disabled: false,
            action: () => {
              removePage(dispatch, pageToBeRemoved, currentPage);
              setPageToBeRemoved(null);
            }
          }
        ]} title={"editor:delete_page_confirm_heading"}>
          <Alert danger>{t("editor:delete_page_confirm_copy", { pageNumber: "Seite " + (pageToBeRemoved + 1)})}</Alert>
        </Modal>}
    </>
  );
};

export default Pages;
