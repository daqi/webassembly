const worker = new Worker("worker.js");
const $singlePic = document.querySelector("#single-pic");
const $ori = document.querySelector("#ori");
const $res = document.querySelector("#res");
const $number = document.querySelector("#number");
const $quality = document.querySelector("#quality");

let quality = 85;
$number.innerHTML = "压缩质量：" + quality;

$quality.addEventListener(
  "change",
  function(e) {
    quality = e.target.value;
    $number.innerHTML = "压缩质量：" + quality;
  },
  false
);

var before;
var after;

$singlePic.onchange = function(e) {
  const file = e.target.files[0];
  file2U8Arr(file, function(u8arr) {
    const img = document.createElement("img");
    img.src = u8arrToUrl(u8arr);
    img.style.width = "100%";
    $ori.appendChild(img);
    // console.log(u8arr)
    before = u8arr.length;
    console.log("原图大小:", formatSize(before));
    worker.postMessage({
      file: u8arr,
      args: ["-quality", String(quality)]
    });
  });
};

worker.addEventListener("message", e => {
  const u8arr = e.data;
  after = u8arr.length;
  console.log("压缩之后:", formatSize(after));
  console.log("压缩率:", tofixed2((after / before) * 100) + "%");
  const img = document.createElement("img");
  img.src = u8arrToUrl(u8arr);
  img.style.width = "100%";
  $res.appendChild(img);
});

function file2U8Arr(file, callback) {
  var fileReader = new FileReader();
  fileReader.onload = function(readFile) {
    const res = new Uint8Array(readFile.target.result);
    callback(res);
  };
  fileReader.readAsArrayBuffer(file);
}

function u8arrToUrl(u8arr) {
  const blob = new Blob([u8arr.buffer]);
  return URL.createObjectURL(blob);
}

function formatSize(size) {
  size = Number(size);
  if (Number.isNaN(size)) return ""; // Nan
  if (size < 1024) {
    return size + "B";
  }
  if (size < 1048576) {
    return tofixed2(size / 1024) + "K";
  }
  if (size < 1073741824) {
    return tofixed2(size / 1048576) + "M";
  }
  if (size < 1099511627776) {
    return tofixed2(size / 1073741824) + "G";
  }
  return tofixed2(size / 1099511627776) + "T";
}

function tofixed2(number) {
  return Number(Number(number).toFixed(2));
}
