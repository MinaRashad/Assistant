// Description: This file contains the assistant logic
// Used in: index.html
//
// Process commands

/* the assistant is going to work in the following way:
** 1. The user will start talking, and will turn what the user is saying into a string
** 2. The assistant will take the user command 
** 3. Assistant process the command and return a response string
** 4. The assistant will turn the response string into speech
** 5. The assistant will play the speech
** 6. The assistant will wait for the user to talk again

** The assistant will be able to do the following:
** 1. Tell the user the time
** 2. Tell the user the date
** 3. Answer general questions by searching the internet
** 4. Access my google calendar and help me organize it

that is all for now
*/

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
            summarize_info()
            
        }
    }

}

function speak(text){
    const utterThis = new SpeechSynthesisUtterance(text)
    utterThis.pitch = pitch
    utterThis.rate = rate
    synth.speak(utterThis)
}

function degreesToCardinal(degrees){
    let cardinals = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"]
    return cardinals[Math.round(degrees / 45) % 8]
}

function summarize_info(){
    // summary command
    // very simple command to demonstrate the assistant's ability to process commands
    // state date and time, location, battery level, and weather


    speak(`Today is ${new Date().toDateString()}. The time is ${new Date().toLocaleTimeString()}`)

    // battery
    navigator.getBattery()
    .then(battery => {
        speak(`Battery level: ${battery.level*100}%`)
    })
    
    // location
    navigator.geolocation.getCurrentPosition(position => {
        // speak(`Your current location is at latitude ${Math.round(position.coords.latitude*1000)/1000} and longitude ${Math.round(position.coords.longitude*1000)/1000}`)

        // get api key for geocoding
        return new Promise((resolve, reject) => {
            if(!localStorage.getItem("geocode_api_key")){
                let api_key = prompt("Please enter your geocode api key")
                localStorage.setItem("geocode_api_key", api_key)
                resolve(api_key)
            }
            else{
                resolve(localStorage.getItem("geocode_api_key"))
            }
        })
        .then(api_key =>
        // find current address
        fetch(`https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1&auth=${api_key}`)
        )
        .then(response => response.json())
        .then(data => {
            speak(`Current location is ${data.city}, ${data.country}`)

            // get api key from weather with prompt in a promise
            return new Promise((resolve, reject) => {
                if(!localStorage.getItem("weather_api_key")){
                    let api_key = prompt("Please enter your weather api key")
                    localStorage.setItem("weather_api_key", api_key)
                    resolve(api_key)
                }
                else{
                    resolve(localStorage.getItem("weather_api_key"))
                }
            })
                            
        })
        .then(api_key => 
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}`)
        )
        .then(response => response.json())
        .then(data => {
            speak(`Today's weather is ${data.weather[0].description} with a temperature of ${Math.round(data.main.temp - 273.15)} degrees celsius`)
            speak(`The humidity is about ${data.main.humidity}%`)
            speak(`The wind speed is about ${data.wind.speed} meters per second to the ${degreesToCardinal(data.wind.deg)}`)

            // forecast
        })
        .catch(err => {
            console.log(err)
        })



    })

    

}