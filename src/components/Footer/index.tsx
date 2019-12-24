import styled from "@emotion/styled";
import { fonts } from "@src/styles";
import React from "react";

const Link = styled.a`
${fonts.footerFont};
text-decoration: none;
flex: 1;
`;

const Root = styled.div`
display: flex;
justify-content: center;
height: 60px;
width: 100%;
align-items: flex-end;
flex-shrink: 0;
flex: 1;
padding-bottom: 14px;
`

const Footer = () => <Root>
    <Link rel="noopener, noreferrer" href={'https://wavesplatform.com'} target="_blank">wavesplatform.com</Link>
</Root>;

export default Footer
