import { saveAs } from 'file-saver';

const downloadFile = function (data, fileName) {
    // const blob = new Blob([data], {type: "octet/stream"})
    // const file = new File([data], fileName, {type: "application/pdf;charset=utf-8"});
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName, {autoBom: true});

    // const a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";
    // let blob = new Blob([data], {type: "octet/stream"}),
    //     url = window.URL.createObjectURL(blob);
    // a.href = url;
    // a.download = fileName;
    // a.click();
    // window.URL.revokeObjectURL(url);
};

export default downloadFile;