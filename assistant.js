// Description: This file contains the assistant logic
// Used in: index.html
//
// Process commands

const instructionDOM = document.getElementsByClassName("instructions")[0]
let active = false

// Assistant Voice


function process_command(command){

    if(!active){
        if(command.includes("start")){
            active = true
            instructionDOM.style.display = "none"


        }
    }

}