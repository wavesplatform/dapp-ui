/** @jsx jsx **/
import styled from "@emotion/styled";
import React from "react";
import { css, jsx } from "@emotion/core";

const LoadingRoot = styled.div`
  font-size: 2.5vw;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;top: 0;left: 0;right: 0;bottom: 0;
`;

export default class Loading extends React.Component<{}, { length: number }> {

    interval: ReturnType<typeof setInterval> | null = null;

    constructor(props: any) {
        super(props);
        this.state = {length: 3};

        this.interval = setInterval(() => {
            let length = this.state.length + 1;
            if (this.state.length === 3) length = 1;
            this.setState({length})
        }, 500);
    }

    componentWillUnmount(): void {
        this.interval && clearInterval(this.interval)
    }

    render() {
        return <LoadingRoot>
            <div css={css`width: max-content;`}>{this.props.children}
            </div>
            <div css={css`width: 1px;`}>{Array.from(this.state, () => ".")}</div>
        </LoadingRoot>
    }
}
