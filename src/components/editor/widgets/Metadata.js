import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from 'styled-components/macro';
import {Multiline, Textinput} from "../../gui/Input";
import Select from "../../gui/Select";
import {Button} from "../../gui/Button";
import {GRAPHIC, VERSION, VARIANT} from "../../../actions/action_constants";
import Modal from "../../gui/Modal";
import {Alert} from "../../gui/Alert";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {NavLink} from "react-router-dom";
import uuidv4 from "../../../utility/uuid";
import {useParams} from "react-router";
import {Checkbox} from "../../gui/Checkbox";
import Loader from "../../gui/Loader";
import ServerError from "../../platform/ServerError";

const Status = styled.div`
  display: flex;
  justify-content: space-between;
    align-items: baseline;
  margin: ${props => props.theme.spacing[3]} 0;
`;

const Indicator = styled.span`
  display: inline-block;
  text-transform: uppercase;
  color: ${props => props.theme.background};
  font-size: 0.8rem;
  letter-spacing: 2px;
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background-color: ${props => {
    switch (props.state) {
        case 0:
            return props.theme.info;
        case 1:
            return props.theme.success;
        case 2:
            return props.theme.warning;
        default:
            return props.theme.midlight;
    }
}};
`;

const Hint = styled.div`
  text-align: right;
  font-size: 0.9rem;
  font-style: italic;
`;

const uploadVersion = (dispatch, file, mode, changeMessage) => {
    if (file.graphic_id === null) {
        dispatch({
            type: GRAPHIC.CREATE.REQUEST,
            payload: file
        })
    } else if (file.variant_id === null || mode === 'copy') {
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
    const logged_in = useSelector(state => state.user.logged_in);
    const tags = useSelector(
        state => state.catalogue.tags.map(tag => {
            return {
                label: tag.name,
                value: tag.tag_id
            }
        })
    );
    const variantTags = useSelector(state => state.editor.file.present.tags);

    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {mode} = useParams();
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
                Bitte <NavLink to={'/login'}>logge dich ein</NavLink> oder <NavLink to={'/signup'}>erstelle ein
                Konto</NavLink>, um Grafiken zu erstellen.
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
                disabled={file.derivedFrom !== null && mode !== 'new'}
                label={"editor:input_catalogue-title"}
                sublabel={"editor:input_catalogue-title-sub"}/>
            {file.derivedFrom !== null &&
            <Hint>
                <a onClick={() => toggleHintModal(!showHintModal)} href={'#'}>Wieso kann ich den Titel nicht
                    ändern?</a>
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

            <Select
                label={"editor:input_catalogue-tags"}
                tip={"help:input_catalogue-tags"}
                isMulti
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
            <Status>
                <span>Status:</span>
                <Indicator state={file.graphic_id === null ? 0 : 1}>
                    {/*editor:catalogue-state-{this.props.documentState}*/}
                    Entwurf
                </Indicator>
            </Status>
            <div>
                <Checkbox onChange={event => setLicenseAgreed(!licenseAgreed)}
                          name={'cb-license-agreed'}
                          checked={licenseAgreed}
                          label={t("editor:license_agreed")}/>
                <a className={"checkbox-additional"} target={"blank"}
                   href={"https://creativecommons.org/licenses/by-sa/4.0/deed.de"}>Lizenz einsehen.</a>
            </div>
            <br/>
            <Button onClick={() => {
                toggleFileModal(true);
                uploadVersion(dispatch, file, mode, changeMessage)
            }}
                    primary fullWidth
                    disabled={!licenseAgreed}
                    label={file.graphic_id === null ?
                        t("editor:input_catalogue-publish") :
                        (file.isNew ? t("editor:input_catalogue-create") : t("editor:input_catalogue-update"))
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
                               navigate(`/editor/${file.graphic_id}/variant/${file.variant_id}/edit`)
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