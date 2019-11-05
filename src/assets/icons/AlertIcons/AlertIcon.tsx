import styled from "@emotion/styled";
import err from './err.svg'
import suc from './succ.svg'
import info from './succ.svg'//todo fix
import warn from './succ.svg'//todo fix

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
width: 38px;
height: 38px;
background: url(${warn});
`;

export const InfoIcn =  styled.div`
width: 38px;
height: 38px;
background: url(${info});
`;
