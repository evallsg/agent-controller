window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
SpeechToText.recognition = new window.SpeechRecognition();

function SpeechToText()
{
  this.properties = {
    interimResults : true,
    maxAlternatives : 1,
    continuous : true
  }
  this.addOutput("text")
  
}

SpeechToText.prototype.onStart = function()
{
  SpeechToText.recognition.start();
}

SpeechToText.prototype.onStop = function()
{
  SpeechToText.recognition.stop();
}
SpeechToText.prototype.onGetOutputs = function() {
        return [
            ["onSpeechStart", "event"],
            ["onSpeechEnd", "event"],
            ["onResult", "event"]
        ];
    };
SpeechToText.prototype.onPropertyChanged = function()
{
  if(!SpeechToText.recognition)
    return;
  
  var props = this.properties;
 	for(var i in props)
    SpeechToText.recognition[i] = props[i];
}

SpeechToText.prototype.onExecute = function ()
{
  var that = this
  SpeechToText.recognition.onspeechstart = (e) =>{console.log("audiuo")};
	SpeechToText.recognition.onspeechend = (e) =>{
                                                  SpeechToText.recognition.stop()
                                                 }
  SpeechToText.recognition.onresult =addResult.bind(this, event)
  
	
}
function addResult(event){
	var that = this;
  const speechToText = event.results[0][0].transcript;
  console.log(speechToText)
  
}
LiteGraph.registerNodeType("features/stt", SpeechToText );