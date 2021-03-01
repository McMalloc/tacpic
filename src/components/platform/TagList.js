import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {groupBy, difference, flatten} from 'lodash';
import {Navigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Tag from "./Tag";

const TagList = props => {
    // Hooks
    const tags = useSelector(
        state => state.catalogue.tags
    );
    const {t} = useTranslation();
    const [redirect, doRedirect] = useState(false);
    const [input, setInput] = useState({});

    if (!tags) {
        return <p>{t('catalogue:tagsLoading')}</p>;
    }

    if (tags.length === 0) return <em>{t('catalogue:noTagsAvailable')}</em>;

    let groupedTags = groupBy(tags, 'taxonomy_id');

    const named_taxonomies = []; // most important taxonomies
    const misc_taxonomies = difference(
        Object.keys(groupedTags).map(id => id),
        named_taxonomies);

    let misc = [];
    misc_taxonomies.forEach(taxonomy_id => {
        misc.push(groupedTags[taxonomy_id]);
    });

    misc = flatten(misc);

    return (
        <div>
            {named_taxonomies.map(taxonomy_id => {
                return (
                    <div key={taxonomy_id}>
                        <strong>{t(`catalogue-taxonomy-${taxonomy_id}`)}</strong>
                        {groupedTags[taxonomy_id] && groupedTags[taxonomy_id].map(tag => {
                            return <Tag key={tag.tag_id} {...tag}/>
                        })}
                    </div>
                )
            })}
            <strong>{t('catalogue:tagsHeading')}</strong>
            <div className={'tag-wrapper custom-tag-list'}>
                {misc.map(tag => {
                        return <Tag key={tag.tag_id} {...tag}/>
                    }
                )}
            </div>
        </div>
    )
};

export default TagList;