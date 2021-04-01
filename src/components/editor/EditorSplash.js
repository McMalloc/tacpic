import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import * as moment from 'moment';
import styled from 'styled-components/macro';
import { FILE, LOCALFILES } from '../../actions/action_constants';
import { Button } from '../gui/Button';
import { Row } from '../gui/Grid';
import Tile from '../gui/_Tile';
import { Alert } from '../gui/Alert';
import Modal from '../gui/Modal';
import { useTranslation, Trans } from 'react-i18next';
import { useBreakpoint } from '../../contexts/breakpoints';

const TileWrapper = styled(Tile)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Section = styled.div`
    /* display: flex; */
    width: 33%;
`

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

const openLocalFile = (dispatch, data = {}) => dispatch({ type: FILE.OPEN.SUCCESS, data });

const EditorSplash = () => {
    const dispatch = useDispatch();
    const t = useTranslation().t;
    const navigate = useNavigate();
    const { lg } = useBreakpoint();
    const localIndex = useSelector(state => state.editor.localfiles.index);
    const user = useSelector(state => state.user);

    useEffect(() => {
        dispatch({ type: LOCALFILES.INDEX.REQUEST });
    }, [])

    const [fileToBeRemoved, setFileToBeRemoved] = useState(null);

    if (!lg) {
        return (
            <div className={"row"}>
                <div
                    className={
                        "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3"
                    }
                >
                    <Alert warning>{t("editor:not_available-screen")}</Alert>
                </div>
            </div>
        );
    }

    return (
        <>
            <Row>
                <div className={"col-xs-12 col-md-12"}>
                    <h1>Editor</h1>
                    {!user.logged_in &&
                        <Alert info>
                            <Trans i18nKey={'editor:pleaseLogin'}>
                                0<NavLink to={"/login"}>1</NavLink>2<NavLink to={"/signup"}>3</NavLink>4
                        </Trans>
                            <br />{t('editor:pleaseLoginHint')}
                        </Alert>
                    }
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={() => {
                            dispatch({ type: FILE.OPEN.REQUEST });
                            navigate('/editor/app');
                        }} primary large label={'editor:newDraft'} icon={"plus"} />
                    </div>
                    <br />
                    <br />
                </div>
            </Row>
            {localIndex.length > 0 &&
                <Row>
                    {/* <Alert danger>Diese lokal gespeicherte Arbeit steht nicht auf anderen Geräten oder Browsern zur Verfügung kann verloren gehen, wenn beispielsweise der Browsercache geleert wird.</Alert> */}
                    <div className={"col-xs-12 col-md-12"}>
                        <hr />
                        <p>{t('editor:localFilesAvailable')}</p>
                        {localIndex.map(file => {
                            return <Link
                                key={file.uuid}
                                className={'no-styled-link'}
                                to={'/editor/app'}
                                onClick={() => dispatch({ type: FILE.OPEN.SUCCESS, data: file })}>
                                <TileWrapper frugal padded className={'extra-margin double'}>
                                    <Section>
                                        <small>{t('editor:title')}</small>
                                        <div className={'hover-sensitive'}>
                                            {!!file.graphicTitle ?
                                                <><strong>{file.graphicTitle}</strong><br /><span>{file.variantTitle}</span></>
                                                :
                                                <span className={'disabled'}>{t('editor:noTitle')}</span>
                                            }
                                        </div>
                                    </Section>
                                    <Section>
                                        <small>{t('editor:lastEdited')}</small><br />
                                        {file.lastSaved && moment(file.lastSaved).format(t('dateFormat'))}
                                    </Section>
                                    <Section>
                                        <Indicator state={2}>{t('editor:notPublished')}</Indicator>
                                    </Section>

                                    <Section style={{ textAlign: 'right', width: 'auto' }}>
                                        <Button title={'deleteDraft'} icon={'trash-alt'} onClick={event => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            setFileToBeRemoved(file);
                                        }} />
                                    </Section>
                                </TileWrapper></Link>
                        })}
                    </div>
                </Row>
            }

            {fileToBeRemoved !== null &&
                <Modal actions={[
                    {
                        label: "editor:delete_file_confirm_cancel",
                        name: "delete_file_confirm_cancel",
                        align: "left",
                        action: () => setFileToBeRemoved(null)
                    },
                    {
                        label: "editor:delete_file_confirm_ok",
                        name: "delete_file_confirm_ok",
                        align: "right",
                        icon: "trash-alt",
                        disabled: false,
                        action: () => {
                            dispatch({ type: LOCALFILES.REMOVE.REQUEST, uuid: fileToBeRemoved.uuid })
                            setFileToBeRemoved(null);
                        }
                    }
                ]} title={"editor:delete_file_confirm_heading"}>
                    <Alert danger>{t("editor:delete_file_confirm_copy", {
                        title: fileToBeRemoved.graphicTitle + ": " + fileToBeRemoved.variantTitle,
                        date: moment(fileToBeRemoved.lastSaved).format("DD.MM.YYYY HH:mm")
                    })}</Alert>
                </Modal>}

        </>
    );

}

export default EditorSplash;