const worker = new Worker("worker.js");
const $singlePic = document.querySelector("#single-pic");
const $res = document.querySelector("#res");
const $number = document.querySelector("#number");
const $quality = document.querySelector("#quality");

const KBps = 200;

let quality = 70;
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
var start;

$singlePic.onchange = function(e) {
  const file = e.target.files[0];
  file2U8Arr(file, function(u8arr) {
    const url = u8arrToUrl(u8arr);
    appendImg(url);
    // console.log(u8arr)
    before = u8arr.length;
    console.log("原图大小:", formatSize(before));
    start = +new Date();
    worker.postMessage({
      file: u8arr,
      args: ["-quality", String(quality)]
    });
  });
};

worker.addEventListener("message", e => {
  const u8arr = e.data;
  after = u8arr.length;
  const time = new Date() - start;
  console.log("压缩之后:", formatSize(after));
  console.log("压缩率:", tofixed2((after / before) * 100) + "%");
  console.log("减小了:", tofixed2((1 - after / before) * 100) + "%");
  console.log("花费时间:", time + "ms");
  const Bps = KBps * 1024;
  const beforeTime = before / Bps;
  const afterTime = after / Bps + time / 1000;
  console.log("如果上行带宽为", KBps + "KB/s");
  console.log("上传原图大约需要", tofixed2(beforeTime) + "s");
  console.log("压缩并上传大约需要", tofixed2(afterTime) + "s");
  console.log("节省了大约", tofixed2(beforeTime - afterTime) + "s");
  console.log("效率提高了", tofixed2((1 - afterTime / beforeTime) * 100) + "%");
  const url = u8arrToUrl(u8arr);
  appendImg(url);
});

function appendImg(url) {
  const img = document.createElement("img");
  img.src = url;
  img.style.width = "50%";
  $res.appendChild(img);
}

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
