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
};

recognition.onerror = (event) => {
  console.log("Error: " + event.error)
}

recognition.onstart = () => {
  console.log("Recognition started")
}

