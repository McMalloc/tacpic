const extractSVG = () => {
    let exported = document.getElementById("VIEWBOX").cloneNode(true);
    exported.removeAttribute("transform");
    return exported.outerHTML;
};

export default extractSVG;
