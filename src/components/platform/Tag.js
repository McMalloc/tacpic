import React, {useEffect, useState} from 'react';
import {Checkbox} from "../gui/Checkbox";
import {useDispatch, useSelector} from "react-redux";

const toggleTag = (dispatch, value, id) => {
    console.log(value);
    dispatch({
        type: 'TAG_TOGGLED',
        id
    })
};

const Tag = ({name, tag_id}) => {
    const dispatch = useDispatch();
    const checked = useSelector(
        state => state.catalogue.filterTags.includes(tag_id)
    );

    return (
        <div>
            <Checkbox onChange={event => toggleTag(dispatch, event.target.name, tag_id)}
                      name={'tag-toggle-' + name}
                      checked={checked}
                      label={name + " " + tag_id}/>
        </div>

    )
};

export default Tag;