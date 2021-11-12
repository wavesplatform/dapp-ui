/** @jsx jsx **/
import React from "react";
import ScrollBar from "react-perfect-scrollbar";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

import { fonts } from "@src/styles";
import  {TCallableFuncArguments } from '@src/interface'
import { IScriptInfoMeta } from "@stores/MetaStore";
import { centerEllipsis } from '@components/Home/Account';


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

export const Explorer: React.FunctionComponent<{ meta?: IScriptInfoMeta<TCallableFuncArguments>, hash: string, onSelect?: () => void }> =
    ({meta, hash, onSelect}) =>
        <ScrollBar css={anchorWrapperStyle} options={{suppressScrollX: true}}>
            {meta && meta.callableFuncTypes ? Object.keys(meta.callableFuncTypes).map(key =>
                <Anchor onClick={onSelect} key={key} href={`#${key}`}
                        css={hash === key && css`background: #E9EFFF`}> {centerEllipsis(key)}</Anchor>
            ) : <div/>}
            <div css={css`height: 200px; width: 100%`}/>
        </ScrollBar>;
