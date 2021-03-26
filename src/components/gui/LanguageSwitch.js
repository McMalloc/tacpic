import React from 'react';
import { switchLanguage } from '../../i18n/i18n';
import { Button } from './Button';


const LanguageSwitch = props => {
    return (
        <Button style={{alignSelf: 'center'}} small icon={'language'} onClick={() => switchLanguage()} label={'switchLang'} />
    )
};

export default LanguageSwitch;

// Loader.propTypes = {
//     large: PropTypes.bool,
//     message: PropTypes.string,
//     timeout: PropTypes.number
// }