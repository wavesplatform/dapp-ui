/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import * as avatar from 'identity-img';

const styles = css`
  display: flex;
  //overflow: hidden;
  //cursor: pointer;
  align-items: center;
  padding: 0 0 0 15px;
  position: relative;
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
    const handleExit = () => window.location.reload();

    return (
        <div css={styles} onClick={onClick}>
            <img src={src} width={size} height={size} alt="Avatar"/>
            <Logout onClick={handleExit}/>
        </div>
    );
};


export const Logout = ({onClick}: { onClick?: () => void }) => <svg css={css`right: -24px;cursor: pointer;position: absolute;`}
                                                                    onClick={onClick} width="14"
                                                                    height="14" viewBox="0 0 14 14" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
        <path
            d="M6.97676 12.814H1.74418C1.42324 12.814 1.16279 12.5535 1.16279 12.2326V1.76746C1.16279 1.44652 1.42327 1.18607 1.74418 1.18607H6.97676C7.29827 1.18607 7.55814 0.9262 7.55814 0.604692C7.55814 0.283184 7.29827 0.0232544 6.97676 0.0232544H1.74418C0.782551 0.0232544 0 0.805833 0 1.76746V12.2326C0 13.1942 0.782551 13.9767 1.74418 13.9767H6.97676C7.29827 13.9767 7.55814 13.7169 7.55814 13.3954C7.55814 13.0739 7.29827 12.814 6.97676 12.814Z"
            fill="#9BA6B1"/>
        <path
            d="M13.8269 6.58603L10.2921 3.09765C10.0641 2.87206 9.69555 2.87499 9.46996 3.10347C9.24438 3.33196 9.2467 3.69998 9.47579 3.92556L12.0019 6.41857H5.23275C4.91124 6.41857 4.65137 6.67845 4.65137 6.99996C4.65137 7.32146 4.91124 7.58137 5.23275 7.58137H12.0019L9.47579 10.0744C9.24673 10.3 9.24498 10.668 9.46996 10.8965C9.5839 11.0116 9.73391 11.0697 9.88392 11.0697C10.0316 11.0697 10.1793 11.0139 10.2921 10.9023L13.8269 7.41389C13.9374 7.30459 14.0002 7.15573 14.0002 6.99993C14.0002 6.84418 13.938 6.69592 13.8269 6.58603Z"
            fill="#9BA6B1"/>
    </g>
    <defs>
        <clipPath id="clip0">
            <rect width="14" height="14" fill="white"/>
        </clipPath>
    </defs>
</svg>;


export default Avatar;
