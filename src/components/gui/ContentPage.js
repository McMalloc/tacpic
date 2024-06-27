import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import Loader from './Loader';

const Wrapper = styled.div`
    div[class^="wp-container-"] {
        padding: 0;
    }

    figure:not(.imprint)>img {
        box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
    }
    
    figure.imprint {

        margin: 0;

        >img {
        width: auto;
    }
    }

    figcaption {
        font-size: 0.9rem;
    }

    article {
        padding: 3rem 0;
        p, ul, ol {
            font-size: 1.1rem;
            line-height: 1.8rem;
        }

        ul {
            margin-left: 1rem;

            li {
                margin-bottom: 0;
            }
        }

        video, iframe {
            width: 100%;
            box-shadow: ${props => props.theme.distant_shadow};
        }
    }
    pre {
        white-space: break-spaces;
    }
`;

const Details = styled.p`
    text-align: right;
    font-size: 0.8rem;
    line-height: 1.2;
`;

const ContentPage = props => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = props.title.rendered + ' | tacpic';
    }, [props.title])

    return (
        <Wrapper>
            <h1>{props.title.rendered}</h1>
            {!props.noWhistles &&
                <Details>
                    Veröffentlicht am {moment(props.date).format('DD.MM.yyyy')}<br />
                    Geändert am {moment(props.modified).format('DD.MM.yyyy')}
                </Details>
            }

            {props.content ?
                <>
                    <article dangerouslySetInnerHTML={{ __html: props.content.rendered }}></article>
                    {!props.noWhistles &&
                        <Details>
                            <br />Dieser Text samt Medieninhalten ist lizenziert unter einer <br />
                            <a rel={"license"} href={"http://creativecommons.org/licenses/by/4.0/"}>Creative Commons Namensnennung 4.0 International Lizenz</a>. <br />
                            Als Quellenangabe genügt eine Verlinkung auf tacpic.de.
                        </Details>
                    }
                </>
                : <Loader />
            }

            
        </Wrapper>
    )
};

export default ContentPage;