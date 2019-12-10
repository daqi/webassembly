const worker = new Worker('worker.js')
const $singlePic = document.querySelector('#single-pic')
const $multiPic = document.querySelector('#multi-pic')
const $dynamicPic = document.querySelector('#dynamic-pic')

$singlePic.onchange = (e) => {
  const files = e.target.files
  worker.postMessage({
    files,
    arguments: [
      '-i', '/input/' + files[0].name,
      '-ss', '00:00:05',
      '-vframes', '1',
      '-q:v', '2',
      '/output/01.jpg'
    ],
  })
}

$multiPic.onchange = (e) => {
  const files = e.target.files
  worker.postMessage({
    files,
    arguments: [
      '-i', '/input/' + files[0].name,
      '-y',
      '-f', 'image2',
      '-vf', 'fps=fps=1',
      '/output/prefix_%03d.jpeg'
    ]
  })
}

$dynamicPic.onchange = (e) => {
  const files = e.target.files
  worker.postMessage({
    files,
    arguments: [
      '-i', '/input/' + files[0].name,
      '-ss', '00:00:04',
      '-t', '3',
      '-s', '640x640',
      '-r', '15',
      '/output/foo.gif'
    ]
  })
}

worker.addEventListener('message', e => {
  const resList = e.data
  const wrapper = document.createElement('div')
  for (let i = 0; i < resList.length; i++) {
    const arryBuffer = resList[i].data
    const img = document.createElement('img')
    img.src = arrayBufferToUrl(arryBuffer)
    img.style.width = '50%'
    wrapper.appendChild(img)
  }
  document.body.appendChild(wrapper)
})

function arrayBufferToUrl(buffer) {
  const bytes = new Uint8Array(buffer);
  const blob = new Blob([bytes.buffer]);
  return URL.createObjectURL(blob)
}