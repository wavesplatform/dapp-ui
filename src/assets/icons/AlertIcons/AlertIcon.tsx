import styled from "@emotion/styled";
import err from './err.svg'
import suc from './succ.svg'
import info from './info.svg'
import warn from './warning.svg'

export const ErrorIcn =  styled.div`
width: 58px;
height: 58px;
background: url(${err});
`;

export const SuccessIcn = styled.div`
width: 38px;
height: 38px;;
background: url(${suc});
`;

export const WarningIcn =  styled.div`
width: 41px;
height: 36px;
background: url(${warn});
`;

export const InfoIcn =  styled.div`
width: 38px;
height: 38px;
background: url(${info});
`;
