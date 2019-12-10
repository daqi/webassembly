function cjpeg(file, options, cb) {
  var stdout = "";
  var stderr = "";
  var args = ["-outfile", "/output.jpg"];
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
      FS.writeFile("/input", file, { encoding: "binary" });
    },
    postRun: function() {
      Module["return"] = FS.readFile("/output.jpg");
      cb(Module["return"]);
    },
    arguments: args,
    ENVIRONMENT: "SHELL"
  };

