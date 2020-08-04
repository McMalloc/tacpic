import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {groupBy, difference, flatten} from 'lodash';
import {Redirect} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Checkbox} from "../gui/Checkbox";
import Tag from "./Tag";

const TagList = props => {
    // Hooks
    const tags = useSelector(
        state => state.catalogue.tags
    );
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [redirect, doRedirect] = useState(false);
    const [input, setInput] = useState({});

    if (!tags) {
        return <p>{t('Schlagworte werden geladen.')}</p>;
    }

    if (tags.length === 0) return <em>Keine Schlagworte vorhanden.</em>;

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
        <>
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
            <strong>Schlagworte</strong>
            {misc.map(tag => {
                    return <Tag key={tag.tag_id} {...tag}/>
                }
            )}
        </>
    )
};

export default TagList;