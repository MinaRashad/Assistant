// Description: This file contains the assistant logic
// Used in: index.html
//
// Process commands

const instructionDOM = document.getElementsByClassName("instructions")[0]
let active = false

// Assistant Voice
const synth = window.speechSynthesis
const pitch = 0.1
const rate = 1



function process_command(command){

    if(!active){
        if(command.includes("start")){
            active = true
            instructionDOM.style.display = "none"
            speak("Speech recognition functions engaged")

            // speak
            // speak(`Hello, This is Mina's Personal Assistant. 
            //     I hope I can help you today. For now, I can only process simple commands.`)

        }
    }
    if(active){
        if(command.includes("stop")){
            synth.cancel()
            speak("Speech recognition functions disengaged")
            active = false
        }
        else if(command.includes("skip")){
            synth.cancel()
        }
        else if(command.includes("summary")){
            speak(`Today is ${new Date().toDateString()}. The time is ${new Date().toLocaleTimeString()}`)

            // location
            navigator.geolocation.getCurrentPosition(position => {
                speak(`Your current location is at latitude ${Math.round(position.coords.latitude*1000)/1000} and longitude ${Math.round(position.coords.longitude*1000)/1000}`)
            })

            // battery
            navigator.getBattery()
            .then(battery => {
                speak(`Battery level: ${battery.level*100}%`)
            })

            
        }
    }

}

function speak(text){
    const utterThis = new SpeechSynthesisUtterance(text)
    utterThis.pitch = pitch
    utterThis.rate = rate
    synth.speak(utterThis)
}