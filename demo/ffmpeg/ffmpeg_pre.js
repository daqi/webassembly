function ffmpeg_run(opts, cb) {

  Module = {};

  for (var i in opts) {
    Module[i] = opts[i];
  }

  Module['preRun'] = function() {
    if (Module['files']) {
      var inputDir = Module['inputDir']
      var outputDir = Module['outputDir']

      FS.createFolder('/', inputDir.slice(1), true, true);
      FS.createFolder('/', outputDir.slice(1), true, true);

      FS.mount(WORKERFS, { files: Module['files'] }, inputDir);
    }
  };

  Module['postRun'] = function() {
    var handle = FS.analyzePath(Module['outputDir']);
    Module['return'] = getAllBuffers(handle);
    cb(Module['return']);
  };

  function getAllBuffers(result) {
    var buffers = [];
    if (result && result.object && result.object.contents) {
      for (var i in result.object.contents) {
        if (result.object.contents.hasOwnProperty(i)) {
          buffers.push({
            name: i,
            data: new Uint8Array(result.object.contents[i].contents).buffer
          });
        }
      }
    }
    return buffers;
  }
