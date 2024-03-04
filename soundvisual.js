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

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const WIDTH = canvas.width
const HEIGHT = canvas.height

// visualizing point location
const R = HEIGHT/8
const ANGULAR_VELOCITY = 0.03
let theta = 0


// visual Source
// this will be a state variable from values: mic, synth, none
let Audio_source = "mic"
let analyser = null
let dataArray = null


function clearCanvas() {
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

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
async function get_micStream(){
    console.log("called get_micStream")
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream =>{
            console.log("Mic access granted")
            
            const audioCtx = new AudioContext()
            analyser = audioCtx.createAnalyser()
            const source = audioCtx.createMediaStreamSource(stream)
            source.connect(analyser)
            analyser.fftSize = 32
            const bufferLength = analyser.frequencyBinCount
            dataArray = new Uint8Array(bufferLength)
            analyser.getByteTimeDomainData(dataArray)
            analyser.getByteFrequencyData(dataArray)

            const WIDTH = canvas.width
            const HEIGHT = canvas.height

            return;
            
            // const draw = () => {
            //     clearCanvas()
            //     analyser.getByteTimeDomainData(dataArray)
            //     analyser.getByteFrequencyData(dataArray)

            //     drawSound(dataArray, bufferLength, 0, theta)

            //     theta += 0.01

            //     if (theta > 2 * Math.PI) {
            //         theta = 0
            //     }

            //     if(Audio_source === "mic")
            //     requestAnimationFrame(draw)

            //     if(Audio_source === "none"){
            //         drawSilence()
            //     }
            // }
            // draw()
        })
        .catch(err => {
            alert("The following error occured: " + err)
        })
    }
    else{
        alert("Browser not supported")
    }
}

function draw_silence(){
    clearCanvas()
    drawPoint(R, theta, "white")
    theta += ANGULAR_VELOCITY
    if (theta > 2 * Math.PI) {
        theta = 0
    }
}

function draw_mic(){
    analyser.getByteTimeDomainData(dataArray)
    analyser.getByteFrequencyData(dataArray)

    drawSound(dataArray, dataArray.length, 0, theta)

    theta += ANGULAR_VELOCITY

    if (theta > 2 * Math.PI) {
        theta = 0
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



// main code
get_micStream()

setInterval(() => {
    if(analyser !== null){
        clearCanvas()

        if (Audio_source === "mic"){
            draw_mic()
        }
        else if(Audio_source === "none"){
            draw_silence()
        }


    }
    else{
        draw_silence()
    }
}, 1000/60)