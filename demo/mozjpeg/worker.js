self.importScripts("cjpeg.js");

onmessage = function(e) {
  const { file, args } = e.data;
  cjpeg(file, args, function(res) {
    // console.log("cjpeg worker result:", res);
    self.postMessage(res);
  });
};
