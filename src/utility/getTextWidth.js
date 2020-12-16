/** Get width of text in px by constructing a mirror object and removing it afterwards. */
export const getTextWidth = (text, fontSize, font) => {
    const container = document.createElement('span');
    document.getElementById('dummy').append(container);
    container.style.whiteSpace = 'pre';
    container.innerText = text;
    container.style.fontSize = fontSize;
    container.style.fontFamily = font;
    const width = container.getBoundingClientRect().width;
    container.remove();
    return width;
}