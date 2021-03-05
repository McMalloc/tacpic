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
import ENCommon from "./en.common";
import ENGlossary from "./en.glossary";
import ENCommerce from "./en.commerce";
import ENEditor from "./en.editor";
import ENLanding from "./en.landing";
import ENCatalogue from "./en.catalogue";
import ENFooter from "./en.footer";
import ENAccount from "./en.account";
import ENProducts from "./en.products";

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
        common: ENCommon,
        account: ENAccount,
        glossary: ENGlossary,
        commerce: ENCommerce,
        editor: ENEditor,
        landing: ENLanding,
        footer: ENFooter,
        products: ENProducts,
        catalogue: ENCatalogue
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
