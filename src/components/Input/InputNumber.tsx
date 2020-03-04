import RCInputNumber from 'rc-input-number';
import React from 'react';
import styled from '@emotion/styled';
import arrowUp from '@src/assets/icons/Arrow/numArrowUp.svg';
import arrowDown from '@src/assets/icons/Arrow/numArrowDown.svg';

const Root = styled.div`
display: flex;
width: 100%;
font-family: Roboto;
color: #6F7582;
.rc-input-number {
    font-size: 14px;
    line-height: 16px;
    height: 40px;
    border: none;
    box-shadow: unset;
    flex: 1;    
    .rc-input-number-input{
        border-radius: 4px 0 0 4px;
        background: #F4F6FA;
    }
    .rc-input-number-handler-wrap{
      border-color:  #E7EBF4;
      background: #F4F6FA;
      width: 44px;
      border-radius: 0 4px 4px 0;
    }
    .rc-input-number-handler-active{
    background: transparent;
    }
    .rc-input-number-handler-up, .rc-input-number-handler-down{
      border-color:  #E7EBF4;
      height: 20px;   
    }
    .rc-input-number-handler-up-inner{
      &::after{
        content: url(${arrowUp});
      }
    }
    .rc-input-number-handler-down-inner{
      &::after{
        content: url(${arrowDown});
        transform: rotate(180deg);
      }
    }
}
`;
export default class InputNumber extends React.Component <any> {
    render() {
        return <Root><RCInputNumber {...this.props}/></Root>;
    }
}
