/** @jsx jsx **/
import styled from '@emotion/styled';
import { fonts } from '@src/styles';
import { css } from '@emotion/core';

const flexStyle = css`display: flex;width: 100%;`;

export const Root = styled.div`
flex-shrink: 0;
position: relative;
display: flex;
background: white;
box-shadow: 0 5px 16px rgba(134, 142, 164, 0.05);
border-radius: 4px;
margin-bottom: 10px;
padding: 30px 40px;
flex-direction: column;
justify-content: flex-end;
`;

export const FlexBlock = styled.div`
${flexStyle};
@media(max-width: 1280px){
  flex-direction: column;
}
`;

export const Header = styled.div`
${flexStyle};
border-bottom: 1px solid #EBEDF2;
padding-bottom: 20px;
justify-content: space-between;
margin: 0 0 10px 0;
`;

export const ArgumentsLayout = styled.div`
${flexStyle};
//margin: 0 0 20px 0;
border-bottom: 1px solid #EBEDF2;
margin-bottom: 16px;
flex-direction: column;
`;

export const ArgumentItem = styled.div`
${flexStyle};
width: 100%;
display: flex;
justify-content: space-between;
margin-bottom: 14px;
`;

export const ArgumentTitle = styled.div`
flex: 0.5;
display: flex;
margin-right: 10px;
align-items: center;
justify-content: flex-start;
max-width: 150px;
`;

export const ArgumentTitleVarName = styled.div`
${fonts.callableFuncArgFont};
 font-weight: bold;
`;

export const ArgumentTitleVarType = styled.div`
margin-right: 10px;
text-align: left !important;
${fonts.callableFuncArgFont};
`;

export const AttachPaymentBtn = styled.div`
${flexStyle};
justify-content: flex-end;
flex: 1;
`;

export const AttachPaymentItems = styled.div`
${flexStyle};
flex-direction: column;
flex: 3;
//@media(max-width: 1280px){
//  flex: 2;
//}
`;

export const AttachPaymentItem = styled.div`
${flexStyle};
align-items: center;
  margin: 0 -10px;
 & > *{
  margin: 0 10px;
}
 & > * {
  margin-bottom: 14px;
 }
`;

export const Wrapper = styled.div`
width: 90%;
display: flex;
align-items: center;
`

export const Title = styled.div`
max-width: calc(100% - 150px);
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
${fonts.cardTitleFont}
`

export const Anchor = styled.div`
position:absolute;
top:-100px;
`;

export const ButtonsWrapper = styled.div`
display: flex;
align-items: center;
`
