import DOMPurify from 'dompurify';

export const sanitise = input => {

    // input = input.replace(/[^a-z0-9äöüß\?\!\%\$\§\(\)\+\*\/\s\.,_-]/gim,"").replace("%", "%%");
    return DOMPurify.sanitize(input).trim();
}