import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as moment from 'moment';
import styled from 'styled-components/macro';
import { FILE, LOCALFILES } from '../../actions/action_constants';
import { Button } from '../gui/Button';
import { Row } from '../gui/Grid';
import Tile from '../gui/_Tile';
import { Alert } from '../gui/Alert';
import Modal from '../gui/Modal';
import { useTranslation } from 'react-i18next';


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
    const localIndex = useSelector(state => state.editor.localfiles.index);

    useEffect(() => {
        dispatch({ type: LOCALFILES.INDEX.REQUEST });
    }, [])

    const [fileToBeRemoved, setFileToBeRemoved] = useState(null);

    return (
        <>
            <Row>
                <div className={"col-xs-12 col-md-10 col-md-offset-1"}>
                    <h1>Editor</h1>
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={() => {
                            dispatch({ type: FILE.OPEN.REQUEST });
                            navigate('/editor/app');
                        }} primary large icon={"plus"}>Neuer Entwurf</Button>
                    </div>
                    <br />
                    <br />
                </div>
            </Row>
            {localIndex.length > 0 &&
                <Row>
                    {/* <Alert danger>Diese lokal gespeicherte Arbeit steht nicht auf anderen Geräten oder Browsern zur Verfügung kann verloren gehen, wenn beispielsweise der Browsercache geleert wird.</Alert> */}
                    <div className={"col-xs-12 col-md-10 col-md-offset-1"}>
                        <hr />
                        <p>Es liegen unveröffentlichte Bearbeitungen vor. Diese sind lokal, also nur von diesem Gerät und Browser abrufbar. <Link to={"/"}>Hinweise zu lokalen Dateien.</Link></p>
                        {localIndex.map(file => {
                            return <Link
                                key={file.uuid}
                                className={'no-styled-link'}
                                to={'/editor/app'}
                                onClick={() => dispatch({ type: FILE.OPEN.SUCCESS, data: file })}>
                                <TileWrapper frugal padded className={'extra-margin double'}>
                                    <Section>
                                        <small>Titel</small>
                                        <div className={'hover-sensitive'}>
                                            {!!file.graphicTitle ?
                                                <><strong>{file.graphicTitle}</strong><br /><span>{file.variantTitle}</span></>
                                                :
                                                <span className={'disabled'}>Noch kein Titel vergeben</span>
                                            }
                                        </div>
                                    </Section>
                                    <Section>
                                        <small>Zuletzt bearbeitet</small><br />
                                        {file.lastSaved && moment(file.lastSaved).format("DD.MM.YYYY")}<br />
                                        {file.lastSaved && moment(file.lastSaved).format("HH:mm") + ' Uhr'}
                                    </Section>
                                    <Section>
                                            <Indicator state={2}> Nicht veröffentlicht</Indicator>
                                    </Section>

                                    <Section style={{ textAlign: 'right', width: 'auto' }}>
                                        <Button title={'Entwurf löschen'} icon={'trash-alt'} onClick={event => {
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