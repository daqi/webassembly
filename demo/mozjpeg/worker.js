self.importScripts("cjpeg.js");

onmessage = function(e) {
  const { file, args } = e.data;
  const res = cjpeg(
    file,
    args,
  );
  console.log(res)
};
