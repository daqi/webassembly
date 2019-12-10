const worker = new Worker("worker.js");
const $singlePic = document.querySelector("#single-pic");

function dataURLtoUint8(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return u8arr;
}
function readFile(file, callback) {
  var fileReader = new FileReader();
  fileReader.onload = function(readFile) {
    var ary = dataURLtoUint8(readFile.target.result);
    callback(ary);
  };
  fileReader.readAsDataURL(file);
}

$singlePic.onchange = function(e) {
  const file = e.target.files[0];
  readFile(file, function(file) {
    worker.postMessage({
      file: file,
      args: ["-quality", "85"]
    });
  });
};

worker.addEventListener("message", e => {
  const uint8 = e.data;
  const wrapper = document.createElement("div");
  const img = document.createElement("img");
  img.src = uint8ToUrl(uint8);
  img.width = 100;
  wrapper.appendChild(img);
  document.body.appendChild(wrapper);
});

function uint8ToUrl(uint8) {
  const blob = new Blob([uint8.buffer]);
  return URL.createObjectURL(blob);
}
