import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import DECommon from "./common_de";
import DEGlossary from "./glossary_de";
import DECommerce from "./commerce_de";
import DEEditor from "./editor_de";
import DELanding from "./landing_de";
import DECatalogue from "./catalogue_de";
import DEFooter from "./footer_de";
import DEAccount from "./account_de";
import DEProducts from "./products_de";
import ENCommon from "./common_en";
import ENGlossary from "./glossary_en";
import ENCommerce from "./commerce_en";
import ENEditor from "./editor_en";
import ENLanding from "./landing_en";
import ENCatalogue from "./catalogue_en";
import ENFooter from "./footer_en";
import ENAccount from "./account_en";
import ENProducts from "./products_en";

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
                        .format(value / 100)
                        // .replace(',00', ',–') #1163
                        .replace(" ", " ")
                };
                return value;
            }
        }
    });

export default i18n;
