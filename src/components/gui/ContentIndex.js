import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation, withTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';


export const Wrapper = styled.ul`
    padding: 0;
    font-size: 0.9rem;
    border-right: 2px solid lightgrey;  

    &, ul {
        margin: 0;
        list-style: none;
    }

    a.active {
        background-color: ${props => props.theme.grey_5};
    }

    & > li {
        margin: 0;
    }

    ul.wiki-articles {
        padding: 0;

        li {
            margin-bottom: 0.2rem;
        }
    }

    ul.wiki-articles>li {
        
        &>a {
            padding: 0.3rem;
            border-radius: 3px;
            box-sizing: border-box;
            width: 100%;
            display: inline-block;
            position: relative;
            padding-left: 1.5rem;

            &.active {
                background-color: ${props => props.theme.brand_primary_light};

                &:before {
                    left: 0.4rem;
                    color: ${props => props.theme.brand_secondary_light};
                }
            }

            &:before {
                position: absolute;
                left: 0.2rem;
                transition: left 0.2s, color 0.2s;
                font-family: 'Font Awesome 5 Free';
                content: '\f061';
                color: ${props => props.theme.grey_4};
                font-weight: 900;
            }
        }

        &:hover {
            a { 
                text-decoration: underline; 
                &:before{
                    left: 0.4rem;
                    color: ${props => props.theme.brand_secondary_light};
                }
            }
        }
    }

    li.wiki-categories {
        margin: 0;
        a.active:before {
                    color: ${props => props.theme.brand_secondary_light};
                }

        &:hover {
            a { 
                /* text-decoration: underline;  */
                &:before{
                    color: ${props => props.theme.brand_secondary_light};
                }
            }
        }
    }
`;

export const IndexLink = styled.span`
    position: relative;
    font-weight: 900;

    padding: 0.4rem;
    border-radius: 3px;
    margin: 0.1rem 0;
    box-sizing: border-box;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    padding-left: 1.5rem;
    .wiki-article-count {
        font-weight: 400;
    }

    &:hover {
        background-color: ${props => props.theme.grey_6};
        text-decoration: underline;
    }

    &:before {
        font-family: 'Font Awesome 5 Free';
        content: ${props => props.expanded ? '"\f146"' : '"\f0fe"'};
        color: ${props => props.expanded ? props.theme.brand_secondary_light : props.theme.grey_4};
        transition: color 0.2s;
        position: absolute;
        left: 0rem;
    }   
`

const ContentCat = ({ node, pages, active, parentIndex }) => {
    const [expanded, setExpanded] = useState(node.slug === active);

    return (
        <li key={node.id} className={'wiki-categories'}>
            <IndexLink active={active}
                expanded={expanded} onClick={() => setExpanded(!expanded)}
                className={'no-styled-link'}>
                {node.name}
            </IndexLink>
            {!!pages && expanded &&
                <ul className={'wiki-articles'}>
                    {pages.map((page, index) =>
                        <li key={index}>
                            <NavLink className={'no-styled-link'} to={`/${parentIndex}/${node.slug}/${page.slug}`}>
                                {page.title.rendered}
                            </NavLink>
                        </li>)}
                </ul>
            }
        </li>
    )
}

const ContentIndex = props => {
    const { t } = useTranslation();

    // for legal pages
    if (!!props.articlesOnly) return <Wrapper>
        <li className={'wiki-categories'}>
            <ul className={'wiki-articles'}>
                {props.pages.map(page =>
                    <li key={page.id}>
                        <NavLink className={'no-styled-link'} to={'/info/de/' + page.id + '?' + page.title}>
                            {page.title}
                        </NavLink>
                    </li>)}
            </ul>
        </li>
    </Wrapper>

    // for searchResults
    if (!!props.searchResults) return <Wrapper>
        <li className={'wiki-categories'}>
            <ul className={'wiki-articles'}>
                {props.searchResults.map(result => {
                    return <li key={result.id}>
                        <NavLink className={'no-styled-link'} to={new URL(result.url, document.location.origin)}>
                            {result.title}
                        </NavLink>
                    </li>
                })}
            </ul>
        </li>

    </Wrapper>
    if (!props.hierarchy) return null;
    return (
        <Wrapper>
            {props.hierarchy.map((node, index) =>
                <ContentCat
                    node={node}
                    key={index}
                    active={props.active}
                    pages={props.pages.filter(page => page.categories.includes(node.id))}
                    parentIndex={props.parentIndex} />)}
        </Wrapper>
    )
};

export default ContentIndex;