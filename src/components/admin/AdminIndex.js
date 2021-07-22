import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminErrors from './AdminErrors';
import { useParams } from 'react-router';
import { IndexLink, Wrapper } from '../gui/ContentIndex';
import ContentPage from '../gui/ContentPage';
import { NavLink } from 'react-router-dom';
import AdminGraphics from "./AdminGraphics";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminLogs from "./AdminLogs";
import AdminVouchers from "./AdminVouchers";

// TODO: Minimieren-Button


const AdminIndex = () => {
    const { t } = useTranslation();
    const { section, view } = useParams();


    useEffect(() => {

    }, [])

    console.log(section, view);


    return <div className='row'>
        <div className={'col-md-3 col-lg-2 col-xs-12'}>
            <div style={{ position: 'sticky', top: 0 }}>
                    <Wrapper>
                        <li className={'wiki-categories'}>
                            <IndexLink className={'no-styled-link'}
                                to={'/admin/orders/'}>
                                    Bestellungen
                                </IndexLink>
                                <ul className={'wiki-articles'}>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/orders/list'}>
                                            Alle Bestellungen
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/vouchers/list'}>
                                            Internetmarken
                                        </NavLink>
                                    </li>
                                </ul>
                            
                        </li>
                        <li className={'wiki-categories'}>
                            <IndexLink className={'no-styled-link'}
                                to={'/admin/drafts/'}>
                                    Entwürfe
                                </IndexLink>
                                <ul className={'wiki-articles'}>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/drafts/list'}>
                                            Alle Entwürfe
                                        </NavLink>
                                    </li>
                                </ul>

                        </li>
                        <li className={'wiki-categories'}>
                            <IndexLink className={'no-styled-link'}
                                to={'/admin/users/'}>
                                    Benutzer*innen
                                </IndexLink>
                                <ul className={'wiki-articles'}>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/users/list'}>
                                            Alle Benutzer*innen
                                        </NavLink>
                                    </li>
                                </ul>

                        </li>
                        <li className={'wiki-categories'}>
                            <IndexLink className={'no-styled-link'}
                                to={'/admin/logs/'}>
                                    Logs
                                </IndexLink>
                                <ul className={'wiki-articles'}>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/logs/frontend_exceptions'}>
                                            Exceptions Frontend
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/logs/backend_exceptions'}>
                                            Exceptions Backend
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={'no-styled-link'} to={'/admin/logs/logfiles'}>
                                            Logs
                                        </NavLink>
                                    </li>
                                </ul>

                        </li>
                    </Wrapper>

            </div>
        </div>
        <div className={'col-md-9 col-lg-10 col-xs-12'}>
            {(section === 'drafts') && (view === 'list') &&
                <AdminGraphics />
            }
            {(section === 'orders') && (view === 'list') &&
                <AdminOrders />
            }
            {(section === 'vouchers') && (view === 'list') &&
                <AdminVouchers />
            }
            {(section === 'users') && (view === 'list') &&
                <AdminUsers />
            }
            {(section === 'logs') && (view === 'frontend_exceptions') &&
                <AdminErrors frontend/>
            }
            {(section === 'logs') && (view === 'backend_exceptions') &&
                <AdminErrors backend/>
            }
            {(section === 'logs') && (view === 'logfiles') &&
                <AdminLogs />
            }
        </div>
    </div>
        ;
};

export default AdminIndex;