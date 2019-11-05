import styled from "@emotion/styled";
import { fonts } from "@src/styles";
import React from "react";

const _Footer = styled.a`
${fonts.footerFont};
margin:  60px  0 14px 0;
text-decoration: none;
`;

const Footer = () =>
    <_Footer rel="noopener, noreferrer" href={'wavesplatform.com'} target="_blank">wavesplatform.com</_Footer>;

export default Footer
