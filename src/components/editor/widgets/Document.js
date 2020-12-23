import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../gui/Select";
import { useTranslation } from "react-i18next";
import { BRAILLE_SYSTEMS } from "../../../config/constants";

const Document = (props) => {
  const dispatch = useDispatch();
  const { system } = useSelector((state) => state.editor.file.present);
  const { t } = useTranslation();

    return (
      <div className={props.className}>
          <Select
      tip={"help:select_braille-system"}
      default={'DE:VOLL'}
      value={system}
          onChange={(selection) =>
            dispatch({
                type: "CHANGE_FILE_PROPERTY",
                key: "system",
                value: selection.value,
              })
      }
      label={"editor:select_braille-system"}
      options={[
        { label: t("catalogue:KURZ"), value: 'DE:KURZ' },
        { label: t("catalogue:VOLL"), value: 'DE:VOLL' },
        { label: t("catalogue:BASIS"), value: 'DE:BASIS' },
        // {label: "Computerbraille 8-Punkt DE Kurzschrift", value: "cb"}
      ]}
    />  
      </div>
    
  );
};

export default Document;
