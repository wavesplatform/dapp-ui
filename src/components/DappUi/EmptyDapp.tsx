/** @jsx jsx **/
import React from "react";
import { css, jsx } from "@emotion/core";

const style = css`
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
`

interface IProps {
    description?: string| JSX.Element
}

export default class EmptyDapp extends React.Component<IProps> {
    render() {
        return <div css={style}>
            <img src="https://wavesexplorer.com/images/erroring-88.905d816e1748ea540e287c909dc82195.svg" alt={'Empty'}/>
            {this.props.description}
        </div>
    }

}
