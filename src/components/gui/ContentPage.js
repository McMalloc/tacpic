import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from "react-i18next";
import moment from 'moment';

const Wrapper = styled.div`
    article {
        padding: 3rem 0;
        p, ul, ol {
        font-size: 1.1rem;
        line-height: 1.8rem;
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

            <article dangerouslySetInnerHTML={{ __html: props.content.rendered }}></article>

            {!props.noWhistles &&
                <Details>
                    <br />Dieser Text samt Medieninhalten ist lizenziert unter einer <br />
                    <a rel={"license"} href={"http://creativecommons.org/licenses/by/4.0/"}>Creative Commons Namensnennung 4.0 International Lizenz</a>. <br />
                    Als Quellenangabe genügt eine Verlinkung auf tacpic.de.
                </Details>
            }
        </Wrapper>
    )
};

export default ContentPage;