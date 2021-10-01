import React from 'react';

interface IProps {
    address: string;
}

export class Address extends React.Component<IProps> {

    render() {
        const address = this.props.address;

        // 6...4
        const formated = `${address.slice(0, 6)}...${address.slice(-4)}`

        return (<div>{formated} </div>);
    }
}
