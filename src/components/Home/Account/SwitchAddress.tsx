import React from 'react';
import styled from '@emotion/styled';

import { IconEthereum } from './IconEthereum';
import { IconWaves } from './IconWaves';

import { EAddressType } from './interface';

interface IProps extends React.ComponentPropsWithoutRef<"div"> {
    type: string
}

const Wrap = styled.div`
    display: flex;
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    cursor: pointer;
`;

export class SwitchAddress extends React.Component<IProps> {

    render() {
        return (
            <Wrap onClick={this.props.onClick}>
                {
                    this.props.type === EAddressType.WAVES
                    ? <IconWaves />
                    : <IconEthereum />
                }
            </Wrap>
        );
    }
}
