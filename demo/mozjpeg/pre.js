
function cjpeg(file, options, cb) {
	if (typeof file === "undefined") return;
  
	var inputDir = "/inputDir";
	var outputDir = "/outputDir";
  
	var stdout = "";
	var stderr = "";
  
	// Default arguments. set output file
	var args = ["-outfile", outputDir + "/output.jpg", inputDir + '/' + file.name];
  
	// You also can use array of options.
	if (Array.isArray(options)) {
	  args = args.concat(options);
	}
	// Target file name.
	var Module = {
	  print: function(text) {
		stdout += text;
	  },
	  printErr: function(text) {
		stderr += text;
	  },
	  arguments: args,
	  ENVIRONMENT: "SHELL" // maximum compatibility???
	};
  
	Module["preRun"] = function() {
	  if (file) {
		FS.createFolder("/", inputDir.slice(1), true, true);
		FS.createFolder("/", outputDir.slice(1), true, true);
		FS.mount(WORKERFS, { files: [file] }, inputDir);
	  }
	};
  
	Module["postRun"] = function() {
	  var handle = FS.analyzePath(Module["outputDir"]);
	  Module["return"] = getAllBuffers(handle);
	  cb(Module["return"]);
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