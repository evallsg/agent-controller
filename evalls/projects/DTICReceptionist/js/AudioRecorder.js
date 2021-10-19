function AudioRecorder (o) {
        
  this.dataType = "mediaStream";
  this.mimeType = MediaRecorder.isTypeSupported("audio/webm; codecs=opus") 
  ? "audio/webm; codecs=opus" : "audio/ogg; codecs=opus";
  //this.utterance = new SpeechSynthesisUtterance(this.text);
  //this.speechSynthesis = window.speechSynthesis;
  this.mediaStream_ = new MediaStream();
  this.mediaSource_ = new MediaSource();
  this.mediaRecorder = new MediaRecorder(this.mediaStream_, {
    mimeType: this.mimeType,
    bitsPerSecond: 256 * 8 * 1024
  });
  
  this.audioContext = LGAudio.getAudioContext();

/*	this.audionode = context.createAnalyser();*/
  this.source = this.audioContext.createBufferSource();
  this.audioNode = new Audio();
  this.chunks = Array();
  this.addInput("audio","audio");
  this.addInput("play","boolean");
  this.addInput("stop","boolean");
  this.addOutput("data","*");
  this.play = false;
  this.stop = false;
  /*if (utteranceOptions) {
          if (utteranceOptions.voice) {
            this.speechSynthesis.onvoiceschanged = e => {
              const voice = this.speechSynthesis.getVoices().find(({
                name: _name
              }) => _name === utteranceOptions.voice);
              this.utterance.voice = voice;
              console.log(voice, this.utterance);
            }
            this.speechSynthesis.getVoices();
          }
          let {
            lang, rate, pitch
          } = utteranceOptions;
          /*Object.assign(this.utterance, {
            lang, rate, pitch
          });*/
/*}*/
	this.audioNode.controls = "controls";
//document.body.appendChild(this.audioNode);
}



              
AudioRecorder.prototype.blob = function()
{
    if (!this.chunks.length) throw new Error("no data to return");
   
      return Promise.resolve({
    	tts: this,
    	data: this.chunks.length === 1 ? this.chunks[0] : new Blob(this.chunks, {
      type: this.mimeType
    	})
  	});
}

AudioRecorder.prototype.arrayBuffer = function(blob) {
  if (!this.chunks.length) throw new Error("no data to return");
  return new Promise(resolve => {
    const reader = new FileReader;
    reader.onload = e => resolve(({
    tts: this,
    data: reader.result
  }));
  reader.readAsArrayBuffer(blob ? new Blob(blob, {
    type: blob.type
  }) : this.chunks.length === 1 ? this.chunks[0] : new Blob(this.chunks, {
    type: this.mimeType
  }));
});
}
AudioRecorder.prototype.audioBuffer = function() {
	if (!this.chunks.length) throw new Error("no data to return");
  
  return this.arrayBuffer()
  	.then(ab => this.audioContext.decodeAudioData(ab.data))
  		.then(buffer => ({
        tts: this,
        data: buffer
      }))
}
AudioRecorder.prototype.mediaSource = function() {

	if (!this.chunks.length) throw new Error("no data to return");
	
  return this.arrayBuffer()
  .then(({
    data: ab
  }) => new Promise((resolve, reject) => {
    this.mediaSource_.onsourceended = () => resolve({
    tts: this,
    data: this.mediaSource_
  });
  
	this.mediaSource_.onsourceopen = () => {
    if (MediaSource.isTypeSupported(this.mimeType)) {
    const sourceBuffer = this.mediaSource_.addSourceBuffer(this.mimeType);
    sourceBuffer.mode = "sequence"
    sourceBuffer.onupdateend = () =>
    this.mediaSource_.endOfStream();
    sourceBuffer.appendBuffer(ab);
    } else {
      reject("{this.mimeType} is not supported")
    }
  }
  this.audioNode.src = URL.createObjectURL(this.mediaSource_);
  }));
}
AudioRecorder.prototype.readableStream = function({size = 1024, controllerOptions = {}, rsOptions = {}}) {
	
  if (!this.chunks.length) throw new Error("no data to return");
  const src = this.chunks.slice(0);
  const chunk = size;
  return Promise.resolve({
    tts: this,
    data: new ReadableStream(controllerOptions || 
    {
      start(controller) 
      {
      	console.log(src.length);
      	controller.enqueue(src.splice(0, chunk))
  	  },
      pull(controller) 
      {
      	if (src.length = 0) controller.close();
      	controller.enqueue(src.splice(0, chunk));
    	}
    }, rsOptions)
    });

}
      
      //example of one method called for ever update event
AudioRecorder.prototype.onExecute = function(e,dt)
{
  var audio = this.getInputData(0);
  var play = this.getInputData(1);
  var stop = this.getInputData(2);

  if(play && !this.play)
  {
    this.play = true;
    var that = this;
    this.start()
     .then(result => result.tts.audioBuffer())
        .then(({
          tts, data
        }) => {
          // do stuff with `ArrayBuffer`, `AudioBuffer`, `Blob`, `MediaSource`, `MediaStream`, `ReadableStream`
          console.log(tts, data);
      		 this.source = this.audioContext.createBufferSource();
    			this.source.buffer = data;
      		
        })

      .catch(err => console.log(err))
        
	}
	if(stop && this.play)
   {
    this.play = false;
    this.stop = true;
   	this.mediaRecorder.stop();
   }
   this.setOutputData(0, this.source);
}
      
AudioRecorder.prototype.start = function()
{
  return navigator.mediaDevices.getUserMedia({ audio: true  })
  .then(stream => new Promise((resolve => {
    const track = stream.getAudioTracks()[0];
    this.mediaStream_.addTrack(track);
    // return the current `MediaStream`
    if (this.dataType && this.dataType === "mediaStream") {
      resolve({tts:this, data:this.mediaStream_});
    };
    
    this.mediaRecorder.ondataavailable = event => {
    	if (event.data.size > 0) {
      	this.chunks.push(event.data);
  		};
    }
    this.mediaRecorder.onstop = () => {
      track.stop();
      this.mediaStream_.getAudioTracks()[0].stop();
      this.mediaStream_.removeTrack(track);
      console.log("Completed recording ", this.chunks);
      resolve(this);
    };
      
    this.mediaRecorder.start();
      
     
    
      //this.speechSynthesis.speak(this.utterance);
    }).bind(this)));
          
}
LiteGraph.registerNodeType("audio/recorder", AudioRecorder );
      //LS.registerComponent( AudioRecorder );
      /*
let ttsRecorder = new AudioRecorder();

ttsRecorder.start()
      .then(tts => tts.blob())
      .then(({
        tts, data
      }) => {
        // do stuff with `ArrayBuffer`, `AudioBuffer`, `Blob`, `MediaSource`, `MediaStream`, `ReadableStream`
        console.log(tts, data);
          tts.audioNode.src = URL.createObjectURL(data);
          tts.audioNode.title = tts.utterance.text;
          tts.audioNode.onloadedmetadata = () => {
            console.log(tts.audioNode.duration);
           // tts.audioNode.play();
          }
      })

    .catch(err => console.log(err))*/