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

// first we need speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const simpleCommands = [
    "Mina",
    "Time",
    "Date",
    "Summary",
    "Yes",
    "No",
    "start",
    "stop"
]

const grammar = `#JSGF V1.0; grammar simpleCommands; public <simpleCommands> = ${simpleCommands.join(" | ")} ;`

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;

recognition.start()
console.log("Recognition started")

recognition.onresult = function(event) {
  console.log("Recognised!")

  let result_len = event.results.length - 1
  console.log(event.results[result_len][0].transcript)

  let command = event.results[result_len][0].transcript

  // now we need to process the command
  process_command(command.toLowerCase())
}

recognition.onnomatch = () => {
  console.log("Nooo!")

  diagnostic.textContent = "I didn't recognize that color.";
};