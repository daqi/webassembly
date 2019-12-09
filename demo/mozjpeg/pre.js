function cjpeg(file, options, cb) {
  var stdout = "";
  var stderr = "";
  var args = ["-outfile", "/output/a.jpg"];
  if (Array.isArray(options)) {
    args = args.concat(options);
  } else {
    for (var key in options) {
      if (!options.hasOwnProperty(key)) continue;
      if (options[key]) {
        args.push("-" + key);
        if (typeof options[key] !== "boolean") {
          args.push(String(options[key]));
        }
      }
    }
  }
  args.push("/input");
  var Module = {
    outputDir: "/output",
    print: function(text) {
      stdout += text;
    },
    printErr: function(text) {
      stderr += text;
    },
    preRun: function() {
      FS.createFolder("/", Module["outputDir"].slice(1), true, true);
      FS.writeFile("/input", file, { encoding: "binary" });
    },
    postRun: function() {
      var handle = FS.analyzePath(Module["outputDir"]);
      Module["return"] = getAllBuffers(handle);
      cb(Module["return"]);
    },
    arguments: args,
    ENVIRONMENT: "SHELL"
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

