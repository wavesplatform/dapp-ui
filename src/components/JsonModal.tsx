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
  max-width: 720px;
  max-height: 80vh;
  border-radius: 4px;
`

const Title = styled.div`
  display: flex;
  align-items: center;
`

const WrapperTitle = styled.div`
  display: flex;
  font-size: 18px;
  justify-content: space-between;
  background: #F8F9FB;
  padding: 20px 25px;
  border-radius: 4px;
`

const Button = styled.div`
  margin-left: 25px;
  background: #7CA1FD;
  border-radius: 4px;
  min-width: 150px;
  height: 40px;
  color: white;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 36px;
  text-align: center;
`

const WrapperButtons = styled.div`
  padding: 25px 25px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #dae1e9;
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
        this.props.handleClose()
        try {
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
        } catch (e) {
            this.props.notificationStore!.notify(
                `Error: ${JSON.stringify(e)}`, {type: 'error'}
            )
        }

    }

    render() {
        return <Root>
            <Content>
                <WrapperTitle>
                    <Title>
                        JSON
                        <Copy onClick={this.handleCopy}/>
                    </Title>
                    <Close onClick={this.props.handleClose} style={{height: '30px', width: '30px'}}/>
                </WrapperTitle>
                <ScrollBar>
                    <ReactJson src={this.props.data} displayDataTypes={false}
                               style={{fontFamily: 'Roboto', fontSize: '12px', padding: '25px 35px'}} name={false}/>
                </ScrollBar>
                <WrapperButtons>
                    <Button onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button onClick={this.broadcast}>
                        Invoke
                    </Button>
                </WrapperButtons>
            </Content>
        </Root>
    }
}
