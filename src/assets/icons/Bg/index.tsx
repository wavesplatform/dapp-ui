import React from "react";
import bg from './bg.svg'
import styled from "@emotion/styled";

export const Bg = styled.div`
background-image: url(${bg});
height: 100%;
width: 100%;
background-size: cover;
position: absolute; left:0;right:0;top:0;bottom:0;
display: flex;
align-items: center;
justify-content: center;

&::before{
    background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);
    z-index: -1;
    content: "";
    position: absolute; left:0;right:0;top:0;bottom:0;

}
`;
