import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import DECommon from "./de.common";
import DEGlossary from "./de.glossary";
import DECommerce from "./de.commerce";
import DEEditor from "./de.editor";
import DELanding from "./de.landing";
import DECatalogue from "./de.catalogue";
import DEFooter from "./de.footer";
import DEAccount from "./de.account";
import DEProducts from "./de.products";
import ENEditor from "./en.editor";
import ENAccount from "./en.account";

const resources = {
    de: {
        common: DECommon,
        glossary: DEGlossary,
        commerce: DECommerce,
        editor: DEEditor,
        landing: DELanding,
        account: DEAccount,
        footer: DEFooter,
        products: DEProducts,
        catalogue: DECatalogue
    },
    en: {
        editor: ENEditor,
        account: ENAccount
    }
};

const getPreferedLanguage = () => {
    return localStorage.getItem('lang');
}

const setPreferedLanguage = lang => {
    return localStorage.setItem('lang', lang);
}

const detectLanguage = () => {
    if (navigator.language.substring(0,2) === 'de') return 'de';
    return 'en';
}

export const initLanguage = () => {
    const preferredLang = getPreferedLanguage();
    let lang;
    if (preferredLang === null) {
        lang = detectLanguage();
    } else {
        lang = preferredLang;
    }
    switchLanguage(lang);
}

export const switchLanguage = lang => {
    if (!lang) {
        lang = i18n.language === 'de' ? 'en' : 'de'
    };
    document.documentElement.lang = lang;
    setPreferedLanguage(lang);
    i18n.changeLanguage(lang);
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        saveMissing: true,
        missingKeyHandler: (lng, ns, key, fallbackValue, arg) => {
            // console.log(ns, key);
        },
        lng: "de",
        ns: [
            'common',
            'glossary',
            'editor',
            'commerce',
            'landing',
            'footer',
            'catalogue'
        ],
        defaultNS: 'common',

        keySeparator: '.',

        interpolation: {
            escapeValue: false,
            format: function(value, format, lang) {
                if (format === 'currency') {
                    return new Intl.NumberFormat(lang, 
                        { style: 'currency', currency: 'EUR' })
                        .format(value / 100).replace(',00', ',–').replace(" ", " ")
                };
                return value;
            }
        }
    });

export default i18n;
