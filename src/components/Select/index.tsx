/** @jsx jsx  **/
import React from "react";
import { css, jsx } from '@emotion/core';
import styled from "@emotion/styled";
import RCSelect from 'rc-select';
import 'rc-select/assets/index.css';
import Arrow from '@src/assets/icons/Arrow';

const Root = styled.div`
display: flex;
width: 100%;
font-family: Roboto;
font-size: 14px;
line-height: 16px;
color: #6F7582;
.rc-select{
  width: 100%;
 
  .rc-select-selection{
      background: #F4F6FA;
      border-radius: 4px;
      border: none;
      box-shadow: none !important;
      height: 40px;
      
      &__rendered, &-selected-value, .rc-select-search__field{
        height: 40px;
        display: flex !important;
        align-items: center;
        color: #6F7582;
      }
      
      .rc-select-arrow{
        height: 40px;
        margin-right: 8px;
        display: flex;
        align-items: center;
      } 
  }
}
`;

interface IProps {
    value?: string
    onChange?: (e: string) => void
    css?: any

}

interface IState {
}


export default class Select extends React.Component<IProps, IState> {

    render() {
        const {css: style, children, value, onChange} = this.props;
        return (
            <Root css={style}>
                <RCSelect value={value} onChange={onChange} inputIcon={<Arrow style={css`padding-bottom: 5px`}/>}>{children}</RCSelect>
            </Root>
        );
    }
}
