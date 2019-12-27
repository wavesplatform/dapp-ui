/** @jsx jsx **/
import React from "react";
import { IMeta } from "@stores/MetaStore";
import ScrollBar from "react-perfect-scrollbar";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { fonts } from "@src/styles";


const Anchor = styled.a`
height: 40px;
width: calc(100% - 20px);
display: flex;
align-items: center;
justify-content: flex-end;
padding-right: 20px;
cursor: pointer;
text-decoration: none;
    outline: none;
${fonts.menuFont}
:hover{
color: #3A3E46;
}

@media(max-width: 768px){
justify-content: flex-start;
padding-left: 20px;
}
`



const anchorWrapperStyle = css`
position: fixed;
top:100px;
left: 0;
z-index: 2;
width: 30%;
height: 100%;
@media(max-width: 768px){
    position: inherit;
    height: max-content;
    top: 0;
    width: 100%;
}

`;

export const Explorer: React.FunctionComponent<{ meta?: IMeta, hash: string }> = ({meta, hash}) =>
    <ScrollBar css={anchorWrapperStyle}>
    {meta && meta.callableFuncTypes ? Object.keys(meta.callableFuncTypes).map(key =>
        <Anchor key={key} href={`#${key}`} css={hash === key && css`background: #E9EFFF`}> {key}</Anchor>
) : <div/>}
</ScrollBar>
