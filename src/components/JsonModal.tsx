import React from "react";
import styled from "@emotion/styled";
import {inject, observer} from "mobx-react";
import ReactJson from "react-json-view";
import ScrollBar from "react-perfect-scrollbar";
import {Copy} from "@components/Home";
import copyToClipboard from "copy-to-clipboard";
import NotificationStore from "@stores/NotificationStore";
import Close from "@src/assets/icons/Close";
import {SignedTransaction, InvokeScriptTransaction} from "@waves/ts-types";
import {SignerStore} from "@stores";
import {broadcast, waitForTx} from "@waves/waves-transactions";
import {getExplorerLink} from "@utils";

const Root = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(205, 211, 226, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  height: max-content;
  position: relative;
  width: 100%;
  max-width: 672px;
  max-height: 80vh;
  border-radius: 4px;
`

const Title = styled.div`
  display: flex;
  font-size: 18px;
  justify-content: space-between;
  background: #F8F9FB;
  padding: 20px 30px;
`

const SaveButton = styled.div`
  margin: 0 30px 20px 30px;
  padding: 15px 25px;
  background: #1F5AF6;
  border-radius: 6px;
  align-items: center;
  text-align: center;
  color: #F8F9FB;
  width: max-content;
  align-self: end;
  cursor: pointer;
`

interface IProps {
    handleClose: () => void,
    data: SignedTransaction<InvokeScriptTransaction>,
    notificationStore?: NotificationStore,
    signerStore?: SignerStore
}

@inject('notificationStore', 'signerStore')
@observer
export default class JsonModal extends React.Component<IProps> {

    state = {}

    handleCopy = () => {
        if (copyToClipboard(JSON.stringify(this.props.data, undefined, ' '))) {
            this.props.notificationStore!.notify('Copied!', {type: 'success'});
        }
    };

    broadcast = async () => {
        const path = await this.props.signerStore?.getNetworkByDapp()
        await broadcast(this.props.data as SignedTransaction<InvokeScriptTransaction>, path!.server)
        const txId = (this.props.data as any).id
        const res = await waitForTx(txId, {apiBase: path!.server}) as any
        const isFailed = res.applicationStatus && res.applicationStatus === 'script_execution_failed'

        const link = path ? getExplorerLink(path!.code, txId, 'tx') : undefined;
        this.props.notificationStore!.notify(
            isFailed
                ? `Script execution failed`
                : `Success`, {type: isFailed ? 'error' : 'success', link, linkTitle: 'View transaction'}
        )
    }

    render() {
        return <Root>
            <Content>
                <Title>
                    <div>
                        JSON
                        <Copy onClick={this.handleCopy}/>
                    </div>
                    <Close onClick={this.props.handleClose} style={{height: '30px', width: '30px'}}/>
                </Title>
                <ScrollBar>
                    <ReactJson src={this.props.data} displayDataTypes={false}
                               style={{fontFamily: 'Roboto', fontSize: '12px', padding: '25px 35px'}} name={''}/>
                </ScrollBar>
                <SaveButton onClick={this.broadcast}>
                    Invoke
                </SaveButton>
            </Content>
        </Root>
    }
}
