import React, { useEffect, useState } from 'react';
import { Checkbox } from "../gui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";

const toggleTag = (dispatch, value, id) => {
  console.log(value);
  dispatch({
    type: 'TAG_TOGGLED',
    id
  })
};

export const TagView = styled.span`
  display: inline-block;
  color: ${props => props.theme.brand_secondary};
  background-color: ${props => props.theme.grey_4};
  padding: 0 ${props => props.theme.large_padding} 0 0.5rem;
  border-radius: 0 ${props => props.theme.border_radius} ${props => props.theme.border_radius} 0;
  font-size: 14px;
  position: relative;
  margin-left: 0.5rem;
  margin-bottom: 1px;
  margin-top: 1px;
}
  position: relative;
  
  &:not(:last-child) {
    margin-right: 3px;
  }
  
  &::before {
    position: absolute;
    top: 0; bottom: 0; left: -0.5rem;
    right: 0;
    content: "";
    display: block;
    z-index: 0;
    background-image: url('/images/taghead.svg');
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

const Tag = ({ name, tag_id }) => {
  const dispatch = useDispatch();
  const checked = useSelector(
    state => state.catalogue.filterTags.includes(tag_id)
  );

  return (
    <div>
      <Checkbox onChange={event => toggleTag(dispatch, event.target.name, tag_id)}
        name={'tag-toggle-' + name}
        id={"cb-tag-" + tag_id}
        pom={name}
        value={checked}
        label={name} />
    </div>

  )
};

export default Tag;