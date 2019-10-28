import { action, computed, observable } from 'mobx';
import { RootStore } from '@stores/RootStore';
import { SubStore } from '@stores/SubStore';

type TDataItem = {
    title: string,
    text: string,
    more?: string
};

export type TInfoData = {
    Mainnet: TDataItem,
    Testnet: TDataItem,
    Stagenet: TDataItem,
};

export interface INode {
    chainId: string
    url: string
    system?: boolean
    title?: keyof TInfoData
}


export default class SettingsStore extends SubStore {
    systemNodes: INode[] = [
        {chainId: 'T', url: 'https://testnodes.wavesnodes.com/', system: true, title: 'Testnet'},
        {chainId: 'W', url: 'https://nodes.wavesplatform.com/', system: true, title: 'Mainnet'},
        {chainId: 'S', url: 'https://nodes-stagenet.wavesnodes.com/', system: true, title: 'Stagenet'}
    ];

    @observable customNodes: INode[] = [];

    @observable activeNodeIndex = 0;

    constructor(rootStore: RootStore, initState: any) {
        super(rootStore);
        if (initState != null) {
            this.customNodes = initState.customNodes;
            this.activeNodeIndex = initState.activeNodeIndex;
        }
    }

    @computed
    get nodes() {
        return [...this.systemNodes, ...(this.customNodes || [])];
    }

    @computed
    get defaultNode() {
        return this.nodes[this.activeNodeIndex];
    }

    @computed
    get defaultChainId() {
        return this.defaultNode.chainId;
    }

    @action
    addNode(node: INode) {
        this.customNodes.push(node);
    }

    @action
    deleteNode(i: number) {
        this.customNodes.splice(i - 3, 1);
        if (this.activeNodeIndex >= i) this.activeNodeIndex -= 1;
    }

    @action
    updateNode(value: string, i: number, field: 'url' | 'chainId') {
        this.customNodes[i - 3][field] = value;
    }

    @action
    setDefaultNode(i: number) {
        this.activeNodeIndex = i;
    }

    public serialize = () => ({
        customNodes: this.customNodes,
        activeNodeIndex: this.activeNodeIndex,
    });

}
