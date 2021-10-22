import { observable } from 'mobx';
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

    @observable private keys: string[] = [];

    @observable isOpenLoginDialog = false;
    @observable isOpenMobileExplorer = false;
    @observable isOpenMobileAccount = false;

    async notify(content: string | JSX.Element, opts: TNotifyOptions = {}) {

        if(!this._instance) {
            await this.init();
        }

        if (opts.key) {
            this._instance.removeNotice(opts.key);
        } else{
            opts.key = this.makeNoticeId();
        }

        if (!this.keys.includes(opts.key)) {
            this.keys.push(opts.key);
        }

        const type = opts.type || 'info';

        try {
            const notice = this._instance.notice({
                ...opts,
                content: getAlert(content, {...opts, type}),
                style: {...styles[type], ...opts.style},
                duration: opts.duration || 1000000,
                key: opts.key,
                closable: true,
                closeIcon: closeAlertIcon
            });
            console.log(notice);
        } catch(e) {
            console.error(content)
        }
    }

    async init() {
        notification.newInstance({
            closeIcon: closeAlertIcon,
            getContainer: () => {
                return document.querySelector('.notices-list-container');
            }
        }, (notification: any) => this._instance = notification);
    }

    closeAll() {
        this.keys.forEach((key) => this._instance.removeNotice(key))
        this.keys = [];
    }

    count() {
        return this.keys.length;
    }

    private makeNoticeId(): string {
        return String(Date.now());
    }
}

export default NotificationStore;
