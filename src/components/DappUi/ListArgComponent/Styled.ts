import styled from "@emotion/styled";
import {fonts} from "@src/styles";

export const Root = styled.div`
width: 100%;
display: flex;
align-items: flex-start;
justify-content: space-between;
`

export const Wrapper = styled.div`
width: 90%;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-end;
`

export const Item = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;
align-items: center;
margin-bottom: 10px;
`
export const ArgumentTitle = styled.div`
flex: 0.5;
height: 40px;
display: flex;
margin-right: 10px;
align-items: center;
max-width: 150px;
`;

export const ArgumentTitleVarName = styled.div`
${fonts.callableFuncArgFont};
 font-weight: bold;
`;

export const ArgumentTitleVarType = styled.div`
min-width: 88px;
margin-right: 10px;
text-align: left !important;
${fonts.callableFuncArgFont}`;

export const WrapperInput = styled.div`
flex: 1;
display: flex;
align-items: center;
`
