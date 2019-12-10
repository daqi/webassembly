## 运行 Demo

```sh
yarn global add http-server

http-server
```


cd mozjpeg-3.3.1

autoreconf -fiv
emconfigure ./configure --without-simd --without-turbojpeg CC="emcc"
make


mkdir buildwasm
cd buildwasm
cp ../.libs/cjpeg cjpeg.bc

emcc -03 \
  -s ALLOW_MEMORY_GROWTH=1 \
  cjpeg.bc -o cjpeg.js \
  --pre-js pre.js --post-js post.js \
  -L'../.libs' -ljpeg

emcc -O3 --closure 1 --pre-js pre.js --post-js post.js -s "EXPORTED_RUNTIME_METHODS=[]" -s ELIMINATE_DUPLICATE_FUNCTIONS=1 -s ALLOW_MEMORY_GROWTH=1 --memory-init-file 0 cjpeg.bc -o cjpeg.js -L'../.libs' -ljpeg