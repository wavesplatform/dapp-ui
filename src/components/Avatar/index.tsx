/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from 'react';
import * as avatar from 'identity-img';

const styles = css`
  display: flex;
  overflow: hidden;
  //cursor: pointer;
  align-items: center;
  padding: 0 0 0 15px;
  img {
    border-radius: 50%;
  }
`;

const SIZE = 30;

interface IProps {
    size?: number,
    address: string,
    className?: string,
    onClick?: () => void
}

const Avatar: React.FunctionComponent<IProps> = (props) => {
    const {size = SIZE, address, onClick} = props;
    avatar.config({rows: 8, cells: 8});
    const src = address ? avatar.create(address, {size: size * 3}) : '';
    return (
        <div css={styles} onClick={onClick}>
            <img src={src} width={size} height={size} alt="Avatar"/>
        </div>
    );
};

export default Avatar;
