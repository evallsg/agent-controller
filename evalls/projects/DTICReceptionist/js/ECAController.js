//@ECA controller
// Globals
if (!LS.Globals)
  LS.Globals = {};

LS.Globals.WAITING=0;
LS.Globals.PROCESSING=1;
LS.Globals.SPEAKING=2;
LS.Globals.LISTENING=3;

this.onStart = function()
{
  if (window.BehaviorPlanner !== undefined)
  	LS.Globals.BehaviorPlanner = new BehaviorPlanner();
  else
    console.error("Planner not included");
  if (window.BehaviorManager !== undefined)
  	LS.Globals.BehaviorManager = new BehaviorManager();
  else
    console.error("Manager not included");

  LS.Globals.facialController = LS.GlobalScene.findNodeComponents("FacialController")[0]
  if(!LS.Globals.facialController )
    console.error("FacialController component not found")
    
  LS.Globals.speechController = LS.GlobalScene.findNodeComponents("TextToSpeech")[0];
  if(!LS.Globals.speechController )
    console.error("SpeechController component not found")
   
   var poser = LS.GlobalScene.findNodeComponents("Poser")[0];
   if(!poser )
    console.error("Poser component not found") 
   else
   	LS.Globals.gestureManager = new GestureManager(poser) 
  
    
  LS.Globals.ws = {};
  LS.Globals.ws.send = function(e){console.log("WS should send ", e)};
  
  // Resources
  // Pre-load audio files. Contains blocks with lg content
  LS.Globals.pendingResources = [];
}

this.onUpdate = function(dt)
{
	var newBlock = null;
 
    if (LS.Globals.BehaviorPlanner)
        newBlock = LS.Globals.BehaviorPlanner.update(dt);

    if (LS.Globals.BehaviorManager)
        LS.Globals.BehaviorManager.update(LS.Globals.processBML, LS.GlobalScene.time);
		
  if(LS.Globals.gestureManager)
      LS.Globals.gestureManager.update(dt)
      
    if (newBlock !== null && newBlock !== undefined) 
    {
        LS.Globals.BehaviorManager.newBlock(newBlock, LS.GlobalScene.time);
    	
    }
}


// Process message
// Messages can come from inner processes. "fromWS" indicates if a reply to the server is required in BMLManager.js
LS.Globals.processMsg = function(msg, fromWS) {

    msg = JSON.parse(msg);

    if (fromWS)
        msg.fromWS = fromWS;

    console.log("Processing message: ", msg);

    // Input msg KRISTINA
    LS.Globals.inputMSG = msg;

    // This is here for the GUI
    if (typeof LS.Globals.msgCallback == "function") {
        //LS.Globals.msgCallback(msg);
        var res = LS.Globals.msgCallback(msg);
        if (res === false) {
            if (fromWS) {
                LS.Globals.ws.send(msg.id + ": true"); // HARDCODED
                console.log("(shortcut) Sending POST response with id:", msg.id);
            }
            return;
        }
    }

    // Client id -> should be characterId?
    if (msg.clientId !== undefined && !LS.Globals.ws.id) {
        LS.Globals.ws.id = msg.clientId;

        console.log("Client ID: ", msg.clientId);
        LS.infoText = "Client ID: " + msg.clientId;

        return;
    }

    // Load audio files
    if (msg.lg) {
        var hasToLoad = LS.Globals.loadAudio(msg);
        if (hasToLoad) {
            LS.Globals.pendingResources.push(msg);
            console.log("Needs to preload audio files.");
            return;
        }
    }

    if (!msg) {
        console.error("An undefined msg has been received.", msg);
        return;
    }

    // Process block
    // Create new bml if necessary
    if (LS.Globals.BehaviorPlanner)
    {
      	
      LS.Globals.BehaviorPlanner.newBlock(msg);
			if(msg.speech)
        LS.Globals.BehaviorPlanner.transition({control:LS.Globals.SPEAKING})
        //LS.Globals.processMsg(JSON.stringify({control:LS.Globals.SPEAKING}));
    }
    if (!msg) {
        console.error("An undefined block has been created by BMLPlanner.", msg);
        return;
    }

    // Update to remove aborted blocks
    if (!LS.Globals.BehaviorManager)
        return;
    LS.Globals.BehaviorManager.update(LS.Globals.processBML, LS.GlobalScene.time);

    if (!msg) {
        console.error("An undefined block has been created due to the update of BMLManager.", msg);
        return;
    }

    // Add new block to stack
    LS.Globals.BehaviorManager.newBlock(msg, LS.GlobalScene.time);
}

// Process message
LS.Globals.processBML = function(key, bml) {

    if (!LS.Globals.facialController)
        return;

    var thatFacial = LS.Globals.facialController;

    switch (key) {
        case "blink":
            thatFacial._blinking = true;
            thatFacial.newBlink(bml);
            break;
        case "gaze":
            thatFacial.newGaze(bml, false);
            break;
        case "gazeShift":
            thatFacial.newGaze(bml, true);
            break;
        case "head":
            thatFacial.newHeadBML(bml);
            break;
        case "headDirectionShift":
            bml.influence = "HEAD";
            thatFacial.newGaze(bml, true, null, true);
            break;
        case "face":
            //thatFacial.newFA(bml, false);
            break;
        case "faceShift":
            //thatFacial.newFA(bml, true);
            break;
        case "speech":
        	console.log("TTS:" + bml.text)
          LS.Globals.speechController.start = true;
            LS.Globals.speechController.speak(bml.text);
        		thatFacial.newLipSync(bml.text)
            break;
        case "gesture":
            LS.Globals.gestureManager.newGesture(bml)   
        	//LS.Globals.gesture(bml);
            break;
        case "posture":
        		
            //LS.Globals.posture(bml);
            break;
        case "pointing":
            break;
        case "lg":
            //thatFacial._visSeq.sequence = bml.sequence;
           // thatFacial._audio.src = bml.audioURL; // When audio loads it plays
            // All "lg" go through pending resources and are called when the audio is loaded.
            // If I assign again the audioURL is the audio already loaded?
            
           /* var CC = LS.GlobalScene._root.getComponent("CaptionsComponent");
            if (CC && !LS.Globals.hideCaptions){
              	var split = 5.0;
              
                if (bml.duration <= split )
                    CC.addSentence(bml.text, CC.getTime(), CC.getTime() + bml.end);
              
              	else{
                  	bml.text.replace(".", " .").replace(",", " ,").split(" ");
                  
                  	var sentence =  [0,0,""], copy = null;
                		for(var w in bml.words){
                    		var word = bml.words[w];
                      	sentence[1] = word.end;	
                      	sentence[2] += " "+word.word;
                      	
                  			if( (sentence[1] - sentence[0])/split >= 1){
                        		copy = sentence.clone();
                    				CC.addSentence(copy[2], CC.getTime() + copy[0], CC.getTime() + copy[1]);
                   					sentence = [sentence[1],sentence[1],""];
                  			}
												
                		}
              	}

            }
                
						
            if(bml.metadata){
              LS.Globals.lg = {metadata : bml.metadata,
                               start: bml.start,
                               end:bml.end,
                               valence:bml.valence,
                               arousal:bml.arousal};
              LS.Globals.count = bml.end - bml.start;
              if(bml.metadata.FacialExpression){
                LS.Globals.BMLManager.newBlock({"id":"face", "face":{ "start": bml.start, "attackPeak": ((bml.end - bml.start)/4), end: bml.end, "valaro": [bml.valence,bml.arousal]}, composition:"OVERWRITE"})
              }
                
            }*/
            break;
    }
}
