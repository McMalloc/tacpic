import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';
import Loader from "../gui/Loader";
import { Icon } from './_Icon';


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
        color: ${props => props.theme.grey_4};
        transition: color 0.2s;
        position: absolute;
        left: 0.4rem;
    }   
`

const ContentCat = ({ node, active, parentIndex, category, onCategoryClick }) => {
    const [ expanded, setExpanded ] = useState(category.slug === active);

    useEffect(() => {
        setExpanded(false)
    }, [parentIndex]);

    return (
        <li key={node.id} className={'wiki-categories'}>
            <IndexLink active={active} expanded={expanded} onClick={() => {
                setExpanded(!expanded)
                onCategoryClick(category)
            }} className={'no-styled-link'}>
                {node.name}
            </IndexLink>
            {!category.pending && !!category.pages && expanded &&
                <ul className={'wiki-articles'}>
                    {category.pages.map((page, index) =>
                        <li key={index}>
                            <NavLink className={'no-styled-link'} to={`/${parentIndex}/${category.slug}/${page.slug}`}>
                                {page.title.rendered}
                            </NavLink>
                        </li>)}
                </ul>
            }
            {category.pending && <Loader frugal />}
        </li>
    )
}

const ContentIndex = props => {
    const { t } = useTranslation();

    if (!!props.articlesOnly) return <Wrapper>
        <li className={'wiki-categories'}>
            <ul className={'wiki-articles'}>
                {props.pages.map(page =>
                    <li>
                        <NavLink className={'no-styled-link'} to={'/info/de/' + page.id + '?' + page.title}>
                            {page.title}
                        </NavLink>
                    </li>)}
            </ul>
        </li>

    </Wrapper>
    if (!props.hierarchy) return null;
    return (
        <Wrapper>
            {props.hierarchy.map((node, index) =>
                <ContentCat
                    node={node}
                    active={props.active}
                    parentIndex={props.parentIndex}
                    category={props.index.find(cat => cat.id === node.id)}
                    onCategoryClick={props.onCategoryClick} />)}
        </Wrapper>
    )
};

export default ContentIndex;