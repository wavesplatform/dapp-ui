import styled from "@emotion/styled";
import err from './err.svg'
import suc from './succ.svg'
import info from './info.svg'
import warn from './warning.svg'

export const ErrorIcn =  styled.div`
height: 25px;
background: url(${err}) center no-repeat;
background-size: contain;
`;

export const SuccessIcn = styled.div`
height: 25px;
background: url(${suc})  center no-repeat;
background-size: contain;
`;

export const WarningIcn =  styled.div`
height: 25px;
background: url(${warn})  center no-repeat;
background-size: contain;
`;

export const InfoIcn =  styled.div`
height: 25px;
background: url(${info})  center no-repeat;
background-size: contain;
`;
