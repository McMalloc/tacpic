import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../gui/Select";
import Tooltip from "../../gui/Tooltip";
import { useTranslation } from "react-i18next";

const Document = (props) => {
  const dispatch = useDispatch();
  const { system } = useSelector((state) => state.editor.file.present);
  const { t } = useTranslation();

    return (
      <div className={props.className}>
        <Tooltip anchor={"braille-system-select"}>
                      <p>{t('editor:tooltip:braille-system-select')}</p>
                      <p><a target="_blank" href="/support/editor/punktschriftsystem-aendern" rel="noreferrer">
                        {t('editor:tooltip:braille-system-select-link')}</a>
                        </p>
                    </Tooltip>
          <Select
      id={"braille-system-select"}
      value={system || 'DE:VOLL'}
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
