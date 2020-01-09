/** @jsx jsx  **/
import React from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import RCSelect from 'rc-select';
import 'rc-select/assets/index.css';

// const selectStyle = css`
// height: 50px;
// width: 100%;
// background: #F4F6FA;
// border-radius: 4px;
//
// outline: none;
// border: none;
// padding: 0 10px;
// font-family: Roboto;
// font-size: 16px;
// `;

const Root = styled.div`
display: flex;
width: 100%;
font-family: Roboto;
font-size: 16px;
.rc-select{
  width: 100%;
  
  .rc-select-selection{
      background: #F4F6FA;
      border-radius: 4px;
      border: none;
      box-shadow: none !important;
      height: 50px;
      
      &__rendered, &-selected-value, .rc-select-search__field{
        height: 50px;
        display: flex !important;
        align-items: center;
        color: black;
      }
      
      .rc-select-arrow{
        height: 50px;
        margin-right: 8px;
      } 
  }
}
`;

//
interface IProps {
    value?: string
    onChange?: (e: string) => void
    css?: any

}

interface IState {
}

export default class Select extends React.Component<IProps, IState> {

    handleChange = (e: any) => console.log(e)

    render() {
        const {css: style, children, value, onChange} = this.props;


        return (
            <Root css={style}>
                <RCSelect value={value} onChange={onChange}>{children}</RCSelect>
            </Root>
        );
    }
}


// export default class Select extends React.Component<IProps, IState> {
//
//     render() {
//         const { css, children, ...others} = this.props;
//         return
//
//         {/*<div css={[styles.root, css]}>*/}
//         {/*    <Root css={[css]} {...others}>*/}
//                 // {children}
//             // </Root>
//         // </div>;
//     }
// }


