

// --------------------- SPEECH ---------------------
// BML
// <speech text>
// Not supported: SSML tags, sync, start, end

// The SpeechSynthesisUtternace should be in the agent and passed here. Events will be managed
// in the agent side, not here.
// Could there be an end time approximation?

// Constructor
TextToSpeech.utterance = new SpeechSynthesisUtterance(""); 
TextToSpeech["@language"] = {widget: "combo", values: TextToSpeech.LANGS }
//TextToSpeech.VOICES = speechSynthesis.getVoices();
TextToSpeech.LANGS = ["en-US", "en-GB", "es-ES"]
function TextToSpeech(o){
  
  this.enabled = true;
  this.utterance = new SpeechSynthesisUtterance("");
  this.lang = TextToSpeech.LANGS[0];
	this.voice = 1;
  this.speaking = false;
  this.text = "";
	this._chunk = [];
  this.start = false;
  this.stop = LiteGraph.ACTION;
  this._num_sentences = 0;
  this.speed = 1;
  if(o) 
    this.configure(o)
    
	//this.utterance.voice = speechSynthesis.getVoices()[this.voice];
 // this.utterance.lang = this.lang;

}
TextToSpeech["@stop"] = {type: "Action"}

TextToSpeech.prototype.getActions = function()
{
  return ["stop"]; 
}

/*this.onAction = function(action)
{
	console.log("action triggered:",action);
	switch(action)
	{
		case "play": //... dostuff;
			break;
	}
}*/
TextToSpeech.prototype.onStart = function(){
	this.utterance = new SpeechSynthesisUtterance(""); 
}
// Get available voices
TextToSpeech.prototype.getVoices = function(lang){
  var voicesNames = [];
  var vv = speechSynthesis.getVoices();
  if(lang)
    vv.filter(function(v) {  return v.lang == lang ;})
  
  vv.forEach(item=>voicesNames.push(item.name))
 /* for (var i = 0; i<vv.length; i++){
    voicesNames[i] = vv[i].name;
  }*/
  return voicesNames;
}

// Set voice
TextToSpeech.prototype.setVoice = function(voiceName){
  this.utterance.voice = speechSynthesis.getVoices().filter(function(v) {return v.name == voiceName;})[0];
}

//bind events when the component belongs to the scene
TextToSpeech.prototype.onAddedToScene = function(scene)
{

  LEvent.bind(scene, "update", this.onUpdate, this );
  LEvent.bind(scene, "action", this.onAction, this );
}

//unbind events when the component no longer belongs to the scene
TextToSpeech.prototype.onRemovedFromScene = function(scene)
{
	//bind events
  LEvent.unbind(scene, "update", this.onUpdate, this );
}
TextToSpeech.prototype.onAction = function(action, param) {
  if(action == "stop")
  {
    this.onStop();
   // this.stop = false;
  }
};
//example of one method called for ever update event
TextToSpeech.prototype.onUpdate = function(e,dt)
{
  if(!this.utterance)
     this.utterance = new SpeechSynthesisUtterance("");
  
  if(this.utterance && !this.utterance.voice)
     this.utterance.voice = speechSynthesis.getVoices()[this.voice];
  if(this.utterance)
    this.utterance.rate = this.speed;
	if(this.enabled ) 
  {
  	this.speak(this.text)
    
  }
  
  this.speaking = speechSynthesis.speaking;
}
TextToSpeech.prototype.onStop = function(){
	speechSynthesis.cancel();
}
/*TextToSpeech.prototype.stop = function(){
	speechSynthesis.cancel();
}*/
TextToSpeech.prototype.isSpeaking = function(){
	return speechSynthesis.speaking;
}
// Speak - TTS
TextToSpeech.prototype.speak = function (text){
    
 
    
  if(this.start&&!this._num_sentences){//CONTROLAR CAS QUE TINGUI CHUNK >1
  	speechSynthesis.cancel();
    //speechSynthesis.speaking= this.speaking = true;

    text = text.replace(/.,;:{}?/g,". ")
    this._chunk = text.split(". ");
    this._num_sentences = this._chunk.length;
    this.start = false;
  }
  if(this._chunk.length&& !speechSynthesis.speaking)
  {
    this.utterance.text = this._chunk[0];
    this.speaking = true;
    this._chunk.shift();
    this._num_sentences -=1;
    speechSynthesis.speak(this.utterance);
    
   /* if(!this._chunk.length&& this.utterance.text)
    {

      this.start = false;
    }*/
  }
  
    
}
TextToSpeech["@inspector"] = function( component, inspector )
{
  inspector.widgets_per_row = 1;
 	
  inspector.addString( "text", component.text, {callback: function(v){
				component.text = v;
    		
			}});

      
  inspector.addCombo( "language", component.lang, { values: TextToSpeech.LANGS, name_width: "50%", callback: function(v){
    component.lang = v;
    if(component.utterance)
    	component.utterance.lang = v;
    
    inspector.refresh();
			}});

 	var voices = speechSynthesis.getVoices().filter(function(v) {  return v.lang == component.lang ;})
  var voicesName = [];
  voices.forEach(item=>voicesName.push(item.name))
  var voice = speechSynthesis.getVoices()[component.voice];
  if(!voice){
  	console.error("Voice is null");
    return;
  }
  var speed = component.speed;
  if(component.utterance)
  {
    component.utterance.voice = voice;
    speed = component.utterance.rate;
  }
  
  inspector.addCombo( "voices", voice.name, { values: voicesName, name_width: "50%", callback: function(v){
    var voice = speechSynthesis.getVoices().filter(function(i){ return i.name == v})[0];
    	console.log(voice)
    component.voice =  speechSynthesis.getVoices().indexOf(voice )
    if(component.utterance)
        component.utterance.voice = voice;
  }});
  inspector.addNumber("speed", component.speed, { callback: function(v){
    component.speed = v;
  	if(component.utterance)
      component.utterance.rate = v;
  }})
  //inspector.refresh();
 
}

//NOT IN USE
TextToSpeech.prototype.phonemesToBS = function (text){
  var BS= {
    open_mouth: 0,
    lips_pressed:0,
    lower_lip_in:0,
    tongue_up:0,
    kiss:0
  }
	var weights = [];
 
  text = text.replace(/[.,\/#!$%\^&\*;:{}?=\-_`~()]/g,"").toLowerCase();
  
  for(var i=0; i<text.length;i++)
  {
    var actions = Object.assigns({},BS);
  	var letter = text[i];
    if(letter == "a" || letter == "i")
    {
      actions.open_mouth = 0.65;
    }
    else if(letter == "e")
    {
      actions.open_mouth = 0.45;
    }
    else if(letter == "u")
    {
      actions.open_mouth = 0.10;
      actions.kiss = 0.50;
      actions.tongue_up = 0.20;
    }
    else if(letter == "o")
    {
      actions.open_mouth = 0.40;
      actions.kiss = 0.50;
    }
    else if(letter =="f" || letter =="v")
    {
      actions.lower_lip_in = 0.85
    }
    else if(letter == "l")
    {
      actions.open_mouth = 0.65;
      actions.tongue_up = 1;
    }
    else if(letter =="m" || letter =="b" || letter =="p")
    {
      actions.lips_pressed = 0.2;
    }
    else
    {
      actions.open_mouth = 0.1;
    }
    weights.push(actions)
  }
  
  return weights;
}
LS.registerComponent( TextToSpeech );