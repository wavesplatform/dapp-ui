import {SubStore} from './SubStore';
import {action, computed, observable} from "mobx";

class SettingsStore extends SubStore {
    @observable jsonSettingValue = localStorage.getItem('jsonSettings') === 'true'

    @action setJsonSettingValue = (value: boolean) => {
        this.jsonSettingValue = value
        localStorage.setItem('jsonSettings', value.toString())
    }

}

export {SettingsStore};
