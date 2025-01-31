import { api_base } from '@api-base';
import { APP_ID_MAP } from '@constants';
import { getAppIdFallback } from '@storage';

const GTM = (() => {
    const isGtmApplicable = () => Object.values(APP_ID_MAP.production).includes(`${getAppIdFallback()}`);

    const init = () => {
        if (isGtmApplicable()) {
            const gtmTag =
                '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\': new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src= \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f); })(window,document,\'script\',\'dataLayer\',\'GTM-P97C2DZ\');';

            const script = document.createElement('script');
            script.innerHTML = gtmTag;
            document.body.appendChild(script);

            const interval = setInterval(() => {
                if (window?.dataLayer) {
                    setVisitorId();
                    clearInterval(interval);
                }
            }, 500);
        }
    };

    const pushDataLayer = data => {
        if (isGtmApplicable() && window?.dataLayer) {
            window.dataLayer.push({
                ...data,
            });
        }
    };

    const setVisitorId = () => {
        const { account_info } = api_base;
        if (account_info?.loginid) {
            pushDataLayer({ visitorId: account_info?.loginid });
        } else {
            pushDataLayer({ visitorId: undefined });
        }
    };

    return {
        init,
        pushDataLayer,
        setVisitorId,
    };
})();

export default GTM;
