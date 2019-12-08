self.importScripts('ffmpeg.js')

onmessage = function (e) {
  const { files, arguments } = e.data
  ffmpeg_run({
    outputDir: '/output',
    inputDir: '/input',
    arguments: arguments,
    files,
  }, (res) => {
    console.log('ccc worker result:', res)
    self.postMessage(res)
  })
}