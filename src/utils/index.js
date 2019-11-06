const bs58 = require('bs58');


export const checkSlash = (url) => url[url.length -1] === '/' ? url : url + '/';

export function getCurrentBrowser() {
    // Opera 8.0+
    const isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) {
        return 'opera';
    }

    // Firefox 1.0+
    const isFirefox = typeof window.InstallTrigger !== 'undefined';
    if (isFirefox) {
        return 'firefox';
    }

    // Safari 3.0+ "[object HTMLElementConstructor]"
    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof window.safari !== 'undefined' && window.safari.pushNotification));
    if (isSafari) {
        return 'safari';
    }

    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
        return 'ie';
    }

    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) {
        return 'edge';
    }

    // Chrome 1 - 71
    const isChrome = !!window.chrome;
    if (isChrome) {
        return 'chrome';
    }

    return '';
};
export const loadState = () => {
    try {
        const state = JSON.parse(localStorage.getItem('store'));
        return state || undefined;

    } catch (error) {
        console.log(error);
        return undefined;
    }

};

export const saveState = (state) => {
    localStorage.setItem('store', JSON.stringify(state));
};

export const getNetworkByAddress = (address) => {
    switch (String.fromCharCode(bs58.decode(address)[1])) {
        case 'T': return {server: 'https://nodes-testnet.wavesnodes.com', code: 'T'};
        case 'S': return {server: 'https://nodes-stagenet.wavesnodes.com', code: 'S'};
        case 'W': return {server: 'https://nodes.wavesplatform.com', code: 'W'};
        default: return null;
    }
}
