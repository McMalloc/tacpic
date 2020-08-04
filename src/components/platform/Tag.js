import React, {useEffect, useState} from 'react';
import {Checkbox} from "../gui/Checkbox";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

const toggleTag = (dispatch, value, id) => {
    console.log(value);
    dispatch({
        type: 'TAG_TOGGLED',
        id
    })
};

export const TagView = styled.span`
  display: inline-block;
  //text-transform: uppercase;
  color: ${props=>props.theme.brand_secondary};
  background-color: ${props=>props.theme.grey_5};
  padding: ${props=>props.theme.base_padding} ${props=>props.theme.large_padding};
  border-radius: ${props=>props.theme.border_radius};
  border: 1px solid ${props=>props.theme.grey_6};
  font-size: 14px;
  
  &::before {
    font-family: 'Font Awesome 5 Free', FontAwesome;
    content: "\\f02b";
    padding-right: 3px;
  }
`;

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
                      label={name}/>
        </div>

    )
};

export default Tag;