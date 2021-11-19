import React, {useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {ORDER_ADMIN, USER_ADMIN} from '../../actions/action_constants';
import moment from "moment";
import Datagrid from "../gui/Datagrid";
import Modal from "../gui/Modal";
import {DB_DATE_FORMAT} from "../../config/constants";
import {Checkbox} from "../gui/Checkbox";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  width: 100%;
`;

const AdminUsers = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(state => state.admin.users);
    const currentUser = useSelector(state => state.admin.currentUser);
    const memoedUsers = useMemo(() => users, [users.length]);
    const [modalContent, setModalContent] = useState(null);
    const [pending, setPending] = useState(false);

    const [editableRights, setEditableRights] = useState({});

    if (currentUser) setEditableRights(currentUser.rights);

    useEffect(() => {
        dispatch({ type: USER_ADMIN.INDEX.REQUEST })
        // dispatch({ type: USER.INDEX.REQUEST })
    }, [])

    const columns = React.useMemo(() => {
        if (memoedUsers.length === 0 || !memoedUsers[0]) {
            return []
        } else {
            return Object.keys(memoedUsers[0]).map(key => {
                let col = {
                    Header: t(key),
                    accessor: key
                }
                if (key === 'created_at') {
                    col.Cell = props => moment(props.value, DB_DATE_FORMAT).format(t('dateFormat'))
                }

                return col
            })
        }
    }, [memoedUsers.length]);

    return (
        <Wrapper>
            <Datagrid columns={columns} data={memoedUsers} onRowClick={(row, index) => {
                dispatch({ type: USER_ADMIN.GET.REQUEST, payload: { id: row.id } });
                setModalContent(row);
            }} />
            {!!modalContent &&
                <Modal tinted fitted dismiss={() => setModalContent(null)} actions={[
                    {
                        label: "Abbrechen",
                        align: "left",
                        disabled: pending,
                        action: () => {
                            setModalContent(null)
                        }
                    },
                    {
                        label: "Bestätigen",
                        align: "right",
                        template: 'primary',
                        disabled: pending,
                        action: () => {
                            setPending(true);
                            fetch(`/api/internal/users/${currentUser.id}/rpc`, {
                                method: 'POST',
                                body: JSON.stringify({
                                    method: 'set_rights',
                                    rights: editableRights
                                }),
                                headers: {
                                    'Authorization': "Bearer " + localStorage.getItem('jwt'),
                                    'Content-Type': 'application/json'
                                }
                            }).then(response => {
                                setPending(false)
                                dispatch({type: USER_ADMIN.GET.REQUEST, payload: {id: currentUser.id}});
                            });
                        }
                    }
                ]} title={`Bestellung #${modalContent.id} -- Details`}>
                    {JSON.stringify(editableRights)}
                    {Object.keys(editableRights).map(field => {
                        if (field === 'changed_at' ||
                            field === 'created_at' ||
                            field === 'id' ||
                            field === 'user_id') return null;
                        return <Checkbox
                            key={field}
                            disabled={pending}
                            onChange={event => {
                                editableRights[field] = !editableRights[field]
                                setEditableRights({
                                    ...editableRights,
                                    [field]: !editableRights[field]
                                })
                            }}
                            value={editableRights[field]}
                            name={currentUser.id + '-' + field}
                            label={field}/>
                    })}
                </Modal>
            }
        </Wrapper>
    )
};

export default AdminUsers;