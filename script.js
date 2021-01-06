const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )

}


video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaysize = {width:video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaysize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detections);
        const resizedetection = faceapi.resizeResults(detections,displaysize)
        canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedetection)
        faceapi.draw.drawFaceLandmarks(canvas, resizedetection)
        faceapi.draw.drawFaceExpressions(canvas, resizedetection)
    },100)
})