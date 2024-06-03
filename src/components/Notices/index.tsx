import React from 'react';
import { inject, observer } from 'mobx-react';
import { NotificationStore } from '@stores/index';

interface IProps {
    notificationStore?: NotificationStore;
}

const styles = {
    position: 'fixed' as any,
    top: '50px',
    right: '32px',
    zIndex: '10000' as any,
    color: '#9BA6B1',
    fontSize: '12px',
    cursor: 'pointer'
};

@inject('notificationStore')
@observer
export class Notices extends React.Component<IProps> {
    render() {
        const notificationStore = this.props.notificationStore;

        return (
            <div className="notices-container">
                {notificationStore!.count() > 1

                    ? (<div
                        className="notices-close-all"
                        style={styles}
                        onClick={()=>notificationStore?.closeAll()}>
                            close all
                        </div>
                    )
                    : null
                }
                <div className="notices-list-container"></div>
            </div>
        );
    }
}
