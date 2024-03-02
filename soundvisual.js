// Description: Sound visualizer
// Used in: index.html
/*
** Sound Visualizer
** Author: Mine Eskandar
**
** The visual is a is a point going in a circle, with the radius of the circle being the amplitude of the sound.
** The visual also has a trail effect, which is achieved by drawing a rectangle with a low opacity over the entire canvas.
** The visual is also affected by the frequency of the sound, which changes the color of the visual.
**
*/

const canvas = document.getElementById('soundvisual')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth*0.9
canvas.height = window.innerHeight*0.9

const WIDTH = canvas.width
const HEIGHT = canvas.height

// visualizing point location
const R = HEIGHT/8
let theta = 0

// visual Source
// this will be a state variable from values: mic, synth, none
let Audio_source = "mic"



function clearCanvas() {
    // color black
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawPoint(r, theta, color) {
    let centerX = WIDTH / 2
    let centerY = HEIGHT / 2
    let x = centerX + r * Math.cos(theta)
    let y = centerY + r * Math.sin(theta)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()

}



// access the mic and returns the current amplitude and frequency
function micStream(){
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream =>{
            console.log("Mic access granted")
            
            const audioCtx = new AudioContext()
            const analyser = audioCtx.createAnalyser()
            const source = audioCtx.createMediaStreamSource(stream)
            source.connect(analyser)
            analyser.fftSize = 32
            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)
            analyser.getByteTimeDomainData(dataArray)
            analyser.getByteFrequencyData(dataArray)

            const WIDTH = canvas.width
            const HEIGHT = canvas.height

            
            const draw = () => {
                clearCanvas()
                analyser.getByteTimeDomainData(dataArray)
                analyser.getByteFrequencyData(dataArray)

                drawSound(dataArray, bufferLength, 0, theta)

                theta += 0.01

                if (theta > 2 * Math.PI) {
                    theta = 0
                }

                if(Audio_source === "mic")
                requestAnimationFrame(draw)

                if(Audio_source === "none"){
                    drawSilence()
                }
            }
            draw()
        })
        .catch(err => {
            alert("The following error occured: " + err)
        })
    }
    else{
        alert("Browser not supported")
    }
}

function drawSilence(){
    clearCanvas()
    drawPoint(R, theta, "white")
    theta += 0.01
    if (theta > 2 * Math.PI) {
        theta = 0
    }
    if(Audio_source === "none")
    requestAnimationFrame(drawSilence)

    if(Audio_source === "mic"){
        return
    }
}

function drawSound(dataArray, bufferLength, amplitude, theta){
    for (let i = 0; i < bufferLength; i++) {
        amplitude = dataArray[i]

        // set color based on i using the hue
        let color = `hsl(${i/bufferLength *1000}, 100%, 50%)`

        // draw the point
        drawPoint(amplitude + R, theta, color)
        

    }
    
}

function init(){
    micStream()
}

function stop(){
    Audio_source = "none"
}

init()