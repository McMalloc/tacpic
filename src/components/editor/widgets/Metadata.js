import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from 'styled-components/macro';
import {Textinput} from "../../gui/Input";
import Combobox from "../../gui/Combobox";
import {Button} from "../../gui/Button";
import {GRAPHIC, VARIANT} from "../../../actions/action_constants";
import Modal from "../../gui/Modal";
import {Alert} from "../../gui/Alert";
import {useTranslation, Trans} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {NavLink} from "react-router-dom";
import uuidv4 from "../../../utility/uuid";
import {Checkbox} from "../../gui/Checkbox";
import Loader from "../../gui/Loader";
import i18n from "i18next";

const Status = styled.div`
  display: flex;
  justify-content: space-between;
    align-items: baseline;
  margin: ${props => props.theme.spacing[3]} 0;
`;


const Hint = styled.div`
  text-align: right;
  font-size: 0.9rem;
  font-style: italic;
`;

const uploadVersion = (dispatch, file, changeMessage) => {
    if (file.graphic_id === null) {
        dispatch({
            type: GRAPHIC.CREATE.REQUEST,
            payload: file
        })
    } else if (file.variant_id === null) {
        dispatch({
            type: VARIANT.CREATE.REQUEST,
            payload: file
        })
    } else {
        dispatch({
            type: VARIANT.UPDATE.REQUEST,
            payload: {...file, changeMessage}
        })
    }
};

const Metadata = () => {
    const file = useSelector(state => state.editor.file.present);
    const {logged_in, role} = useSelector(state => state.user);
    const tags = useSelector(
        state => state.catalogue.tags.map(tag => 
            ({
                label: tag.name,
                value: tag.tag_id
            })
        )
    );
    const variantTags = useSelector(state => state.editor.file.present.tags);

    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [input, setInput] = useState({});
    const [showFileModal, toggleFileModal] = useState(false);
    const [showHintModal, toggleHintModal] = useState(false);
    const [licenseAgreed, setLicenseAgreed] = useState(false);
    const [changeMessage, setChangeMessage] = useState("");

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    if (!logged_in) return (
            <Alert info>
                <Trans i18nKey={'editor:pleaseLogin'}>
                                0<NavLink to={"/login"}>1</NavLink>2<NavLink to={"/signup"}>3</NavLink>4
                </Trans>
            </Alert>
    );

    return (
        <>
            <Textinput
                value={file.graphicTitle}
                onChange={event => {
                    dispatch({
                        type: "CHANGE_FILE_PROPERTY",
                        key: 'graphicTitle',
                        value: event.currentTarget.value
                    });
                }}
                tip={"help:input_graphic-title"}
                name={"graphic-title"}
                disabled={file.derivedFrom !== null && role !== 1}
                label={"editor:input_catalogue-title"}
                sublabel={"editor:input_catalogue-title-sub"}/>
            {file.derivedFrom !== null &&
            <Hint>
                <a onClick={() => toggleHintModal(!showHintModal)} href={'#'}>
                    {t('editor:draftPanel.editTitleWhyCant')}</a>
                <br/><br/>
            </Hint>
            }


            <Textinput
                value={file.variantTitle}
                onChange={event => {
                    dispatch({
                        type: "CHANGE_FILE_PROPERTY",
                        key: 'variantTitle',
                        value: event.currentTarget.value
                    });
                }}
                name={"variant-title"}
                tip={"help:input_variant-title"}
                disabled={file.graphic_id === null || file.derivedFrom === null}
                label={"editor:input_catalogue-variant-title"}/>

            <Alert info>{file.graphic_id === null || file.derivedFrom === null ?
                t("editor:input_catalogue-variant-title-hint-alt")
                :
                t("editor:input_catalogue-variant-title-hint")}
            </Alert>

            <Combobox
                label={"editor:input_catalogue-tags"}
                tip={"help:input_catalogue-tags"}
                isMulti
                pom={"tagCombobox"}
                creatable
                onChange={selection => {
                    if (selection === null) selection = [];
                    dispatch({
                        type: "CHANGE_FILE_PROPERTY",
                        key: 'tags',
                        value: selection.map(tag => {
                            return {tag_id: tag.value, name: tag.label}
                        })
                    })
                }}
                onCreateOption={(option) => {
                    let taglist = [...variantTags];
                    taglist.push({tag_id: uuidv4(), name: option});
                    dispatch({
                        type: "CHANGE_FILE_PROPERTY",
                        key: 'tags',
                        value: taglist
                    })
                }}
                options={tags}
                value={variantTags.map(tag => {
                    return {value: tag.tag_id, label: tag.name}
                })}
                sublabel={"editor:input_catalogue-tags-sub"}/>

            {(file.graphic_id !== null && file.variant_id !== null) &&
                <Textinput
                    value={changeMessage}
                    onChange={event => setChangeMessage(event.currentTarget.value)}
                    name={"change-message"}
                    label={"editor:input_change-message"}
                    sublabel={"editor:input_change-message-hint"}/>
            }
            
            <hr/>
            <div>
                <Checkbox onChange={event => setLicenseAgreed(!licenseAgreed)}
                          name={'cb-license-agreed'}
                          pom="licenseAgreementCheckbox"
                          checked={licenseAgreed}
                          label={t("editor:license_agreed")}/>
                          
                <a className={"checkbox-additional sub-label"} target={"_blank"} rel="noreferrer"
                   href={`https://creativecommons.org/licenses/by-sa/4.0/deed${i18n.language === 'de' ? '.de' : ''}`}>{t('editor:draftPanel.viewLicense')}</a>
                <a className={"checkbox-additional sub-label"} target={"_blank"} rel="noreferrer"
                   href={`/support/katalog/lizenz-der-inhalte`}>{t('editor:draftPanel.whyLicense')}</a>
            </div>
            <br/>
            <Button onClick={() => {
                toggleFileModal(true);
                uploadVersion(dispatch, file, changeMessage)
            }}
                    primary fullWidth
                    disabled={!licenseAgreed}
                    label={file.graphic_id === null ?
                        t("editor:input_catalogue-publish") :
                        (file.variant_id === null ? t("editor:input_catalogue-create") : t("editor:input_catalogue-update"))
                    }>
            </Button>

            {showFileModal &&
            <Modal fitted title={'editor:publish_modal_filestate-title'} dismiss={() => toggleFileModal(false)}
                   actions={[
                       {
                           label: "editor:publish_button_continue-editing",
                           align: "left",
                           disabled: file.state === 'updating',
                           action: () => {
                            //    navigate(`/editor/${file.graphic_id}/variant/${file.variant_id}/edit`)
                               toggleFileModal(false);
                           }
                       },
                       {
                           label: "editor:publish_button_back",
                           align: "right",
                           template: 'primary',
                           disabled: file.state === 'updating',
                           action: () => navigate(`/catalogue/${file.graphic_id}/variant/${file.variant_id}`)
                       }
                   ]}
            >
                {file.state === 'updating' &&
                <Loader message={"editor:publish_loader_message"} timeout={3000}/>
                }
                {file.state === 'success' &&
                <Alert success>
                    {t('editor:publish_alert_success')}
                </Alert>
                }
                {file.state === 'failure' &&
                    <>
                        <Alert danger>
                            {t('editor:publish_alert_failure')}
                        </Alert>
                        {/* <ServerError error={file.error} /> */}
                    </>

                }

            </Modal>
            }

            {showHintModal &&
            <Modal fitted title={t('editor:Titel ändern')} dismiss={() => toggleHintModal(false)}
                   actions={[
                       {
                           label: "Abbrechen",
                           align: "left",
                           action: () => {
                               toggleHintModal(false);
                               setTimeout(() => {
                                   document.getElementById("label-for-graphic-title").focus();
                               }, 100);
                           }
                       },
                       {
                           label: "Variantentitel bearbeiten",
                           align: "right",
                           template: 'primary',
                           disabled: file.state === 'updating',
                           action: () => {
                               toggleHintModal(false);
                               setTimeout(() => {
                                   document.getElementById("label-for-variant-title").focus();
                               }, 100);
                           }
                       },
                       {
                           label: "In Entwurf umwandeln",
                           align: "right",
                           template: 'primary',
                           disabled: file.state === 'updating',
                           action: () => {
                               toggleHintModal(false);
                               navigate('/editor/copy');
                               setTimeout(() => {
                                   document.getElementById("label-for-graphic-title").focus();
                               }, 100);
                           }
                       }
                   ]}>

                <p className={'copy'}>
                    <Alert info>Diese Variante basiert auf einer Variante des Entwurfs "{file.graphicTitle}", daher
                        können Sie den Titel
                        des Entwurfs nicht verändern.</Alert>
                    <Alert complimentaryCopy>
                        Finden Sie stattdessen einen passenden Namen für Ihre
                        Variante. Entspricht der Inhalt Ihrer Variante nicht mehr dem Titel des Entwurfs, können Sie
                        ihre Variante
                        auch in einen eigenständigen Entwurf umwandeln.</Alert>
                </p>

            </Modal>
            }
        </>
    );
};

export default Metadata;