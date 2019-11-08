import styled from "@emotion/styled";
import { fonts } from "@src/styles";
import React from "react";

const Root = styled.a`
${fonts.footerFont};
margin:  60px  0 14px 0;
text-decoration: none;
`;

const Footer = () =>
    <Root rel="noopener, noreferrer" href={'https://wavesplatform.com'} target="_blank">wavesplatform.com</Root>;

export default Footer
