import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../gui/Select";
import { useTranslation } from "react-i18next";

const Document = (props) => {
  const dispatch = useDispatch();
  const { system } = useSelector((state) => state.editor.file.present);
  const { t } = useTranslation();

    return (
      <div className={props.className}>
          <Select
      tip={"help:select_braille-system"}
      default={"de-de-g0.utb"}
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
        { label: t("catalogue:de-de-g2.ctb"), value: "de-de-g2.ctb" },
        { label: t("catalogue:de-de-g1.ctb"), value: "de-de-g1.ctb" },
        { label: t("catalogue:de-de-g0.utb"), value: "de-de-g0.utb" },
        // {label: "Computerbraille 8-Punkt DE Kurzschrift", value: "cb"}
      ]}
    />  
      </div>
    
  );
};

export default Document;
