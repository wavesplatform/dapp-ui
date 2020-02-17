import notification from 'rc-notification';
import { SubStore } from '@stores/SubStore';
import { RootStore } from '@stores/RootStore';
import getAlert, {closeAlertIcon} from '@utils/alertUtil'

export type TNotifyOptions = Partial<{
    duration: number,
    closable: boolean,
    key: string

    type: 'error' | 'info' | 'warning' | 'success'
    link?: string
    linkTitle?: string
    title: string
    style: { [key: string]: string | number }
}>;


const style = {
    boxShadow: '0px 6px 20px rgba(155, 166, 177, 0.3)',
    borderRadius: '0',
    padding: 0,


};

const styles = {
    error: {
        ...style,
        borderTop: '2px solid #EF7362'
    },
    warning: {
        ...style,
        borderTop: '2px solid #FFD56A'
    },
    info: {
        ...style,
        borderTop: '2px solid #5A8AFF'
    },
    success: {
        ...style,
        borderTop: '2px solid #7ECF81'
    }
};

class NotificationStore extends SubStore {
    _instance?: any;

    constructor(rootStore: RootStore) {
        super(rootStore);
        notification.newInstance({closeIcon: closeAlertIcon}, (notification: any) => this._instance = notification);
    }

    notify(content: string | JSX.Element, opts: TNotifyOptions = {}) {
        if (opts.key) {
            this._instance.removeNotice(opts.key);
        }
        const type = opts.type || 'info';

        this._instance && this._instance.notice({
            ...opts,
            content: getAlert(content, {...opts, type}),
            style: {...styles[type], ...opts.style},
            duration: opts.duration || 10,
            key: opts.key,
            closable: true,
            closeIcon: closeAlertIcon
        });
    }
}

export default NotificationStore;
