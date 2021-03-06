//@BehaviorPlanner
//Agent's communicative intentions specified using BML standard

var BehaviorPlanner = function(){

	this.conversation = "--- New dialogue---\n\n";
  this.state = LS.Globals.LISTENING//LS.Globals.WAITING;
  
  //For automatic state update
  this.stateTime = 0;
  this.nextBlockIn =  1 + Math.random() * 2;
  
  // Default facial state
  this.defaultValence = 0.4;
  this.currentArousal = 0;
  
  // Idle timings (blink and saccades)
  this.blinkIdle = 0.5 + Math.random()*6;
	this.blinkDur = Math.random()*0.5 + 0.15;
	this.blinkCountdown = 0;

	this.saccIdle = 0.5 + Math.random()*6;
	this.saccDur = Math.random() + 0.5;
	this.saccCountdown = 0;
}

//UPDATE
BehaviorPlanner.prototype.update = function(dt){

  this.stateTime += dt;
  
  // Automatic state update
  if (this.nextBlockIn < this.stateTime){
    this.stateTime = 0;
   // return this.createBlock();
  }
  
  // Check if speech has finished to change to WAITING
  if (this.state == LS.Globals.SPEAKING){
    if (LS.Globals.BehaviorManager){
      if (LS.Globals.BehaviorManager.lgStack.length == 0 && LS.Globals.BehaviorManager.speechStack.length == 0)
        this.transition({control: LS.Globals.WAITING});
    }
  }
  
  // Automatic blink and saccades
  return this.updateBlinksAndSaccades(dt);
}

//TRANSITION to nextState
BehaviorPlanner.prototype.transition = function(block){
  
  var nextState = block.control;
  
  if (nextState == this.state)
    return;
  
  var currentState = "waiting";
  
  switch(this.state){
    case LS.Globals.WAITING:
      currentState = "waiting";
      break;
    case LS.Globals.LISTENING:
      currentState = "listening";
      break;
      case LS.Globals.SPEAKING:
      currentState = "speaking";
      break;
      case LS.Globals.PROCESSING:
      currentState = "processing";
      break;
  }
  

  // Reset state time
  this.stateTime = 0;
  
  // TRANSITIONS
  switch(nextState){
  	
      // Waiting can only come after speaking
    case LS.Globals.WAITING:
    	// Look at user for a while, then start gazing around
    	this.nextBlockIn = 2 + Math.random() * 4;
      console.log("PREV STATE:", currentState, "\nNEXT STATE:", "waiting");
  		break;
  	
      // Can start speaking at any moment
    case LS.Globals.LISTENING:
    	// Force to overwrite existing bml
    	block.composition = "OVERWRITE";
    	/*if(this.state ==LS.Globals.SPEAKING){
      	// Abort speech
      	this.abortSpeech();
    	}*/
    	// Look at user and default face
    	this.attentionToUser(block, true);
    	// Back-channelling
    	this.nextBlockIn = 1 +  Math.random()*2;
      console.log("PREV STATE:", currentState, "\nNEXT STATE:", "listening");
			break;
  
  		// Processing always after listening
    case LS.Globals.PROCESSING:
    	this.nextBlockIn = 0;
      console.log("PREV STATE:", currentState, "\nNEXT STATE:", "processing");
  		break;
 	 		
      // Speaking always after processing
    case LS.Globals.SPEAKING:
    	this.attentionToUser(block, true);
    	// Should I create random gestures during speech?
    	this.nextBlockIn = 2 + Math.random()*4;
      console.log("PREV STATE:", currentState, "\nNEXT STATE:", "speaking");
  	break;
  }
  
  this.state = nextState;
  
}

//!!!!!!!!!!!!!!!!!!
/*BehaviorPlanner.prototype.abortSpeech = function(){
  // Cancel audio and lipsync in Facial
  if (LS.Globals.Facial){
    var facial = LS.Globals.Facial;
    if (!facial._audio.paused){
    	facial._audio.pause(); // Then paused is true and no facial actions
      // Go to neutral face? Here or somewhere else?
    }
  }
  // End all blocks in BMLManager
  if (LS.Globals.BMLManager){
    var manager = LS.Globals.BMLManager;
    for (var i =0 ; i < manager.stack.length; i++){
      manager.stack[i].endGlobalTime = 0;
    }
  }
}*/

//---------------------------AUTOMATIC------------------------------


//CREATEBLOCKs during a state (automatic)
BehaviorPlanner.prototype.createBlock = function(){
  
  var state = this.state;
  var block = {
    id: state, 
    composition: "OVERWRITE"
  };
  
  switch(state)
  {
  // LISTENING
    case LS.Globals.LISTENING:
      this.nextBlockIn = 1.5 + Math.random()*3;
      // head -> link with this.currentArousal
      if (Math.random() < 0.6)
      {
        block.head = {
          start: 0,
          end: 1.5 + Math.random()*2,
          lexeme: "NOD",
          amount: 0.05 + Math.random()*0.1,
          type:"head"
        }
      }
      // Random blink
      if (Math.random() < 0.8)
        block.blink = {start: 0.3, end: 0.5+Math.random()*0.5};

      // Esporadic raising eyebrows
      if (Math.random() < 0.5)
      {
        var start = Math.random();
        var end = start + 1 + Math.random();
        block.face = [{
          start: start,
          attackPeak: start + (end-start)*0.2,
          relax: start + (end-start)*0.5,
          end: end,
          lexeme: {
            lexeme: "RAISE_BROWS", 
            amount: 0.1 + Math.random()*0.2
          },
          type:"face"
        },
          {
          start: start,
          attackPeak: start + (end-start)*0.2,
          relax: start + (end-start)*0.5,
          end: end,
          lexeme: {
            lexeme: "UPPER_LID_RAISER", 
            amount: 0.1 + Math.random()*0.2
        	},
          type:"face"
        }]
        
      }

      // Gaze should already be towards user

      break;
  
  // SPEAKING
    case LS.Globals.SPEAKING:
      
      this.nextBlockIn = 2 + Math.random()*4;
      // Head
      if (Math.random() < 0.6){
        block.head = {
          start: 0,
          end: 2.5 + Math.random()*1.5,
          lexeme: "NOD",
          amount: 0.05 + Math.random()*0.05,
          type:"head"
        }
        // Deviate head slightly
        if (Math.random() < 0.85)
        {
          var offsetDirections = ["DOWNRIGHT", "DOWNLEFT", "LEFT", "RIGHT"]; // Upper and sides
          var randOffset = offsetDirections[Math.floor(Math.random() * offsetDirections.length)];
          block.headDirectionShift = {
            start: 0,
            end: 1 + Math.random(),
            target: "CAMERA",
            offsetDirection: randOffset,
            offsetAngle: 1 + Math.random()*3,
            type:"headDirectionShift"
          }
        }
      }
      // Esporadic raising eyebrows
      if (Math.random() < 0.7)
      {
        var start = Math.random();
        var end = start + 1.2 + Math.random()*0.5;
        block.face = {
          start: start,
          attackPeak: start + (end-start)*0.2,
          relax: start + (end-start)*0.5,
          end: end,
          lexeme: {
            lexeme: "RAISE_BROWS", 
            amount: 0.1 + Math.random()*0.2
          },
           type:"face"
        }
      }
      // Redirect gaze to user
      if (Math.random() < 0.7)
      {
        var start = Math.random();
        var end = start + 0.5 + Math.random()*1;
        block.gazeShift = {
          start: start,
          end: end,
          influence: "EYES",
          target: "CAMERA",
          type:"gazeShift"
        }
        block.composition = "OVERWRITE";
      }

    	break;
  
  
  // PROCESSING
    case LS.Globals.PROCESSING:
      this.nextBlockIn = 2 + Math.random() * 2;
      // gaze
      var offsetDirections = ["UPRIGHT", "UPLEFT", "LEFT", "RIGHT"]; // Upper and sides
      var randOffset = offsetDirections[Math.floor(Math.random() * offsetDirections.length)];
      if(Math.random() < 0.8)
      {
        block.gazeShift = {
          start: 0,
          end: 1 + Math.random(),
          influence: "EYES",
          target: "CAMERA",
          offsetDirection: randOffset,
          offsetAngle: 10 + 5*Math.random(),
          type:"gazeShift"
        }
        // blink
        block.blink = {
          start: 0, 
          end: 0.2 + block.gazeShift.end*Math.random(),
          type:"blink"
        };
      }

      // head nods
      if (Math.random() < 0.3)
      {
        block.head = {
          start: 0,
          end: 1.5 + Math.random()*2,
          lexeme: Math.random() < 0.2 ? "TILT" : "NOD",
          amount: 0.05 + Math.random()*0.1,
          type:"head"
        }
      }

      // frown
      if (Math.random() < 0.6)
      {
        block.face = {
          start: 0,
          end: 1 + Math.random(),
          lexeme: [
            {
              lexeme: "LOWER_BROWS", 
              amount: 0.2 + Math.random()*0.5
            }
          ],
          type:"face"
        }
      }

      // press lips
      if (Math.random() < 0.3)
      {
        var lexeme = {
          lexeme: "PRESS_LIPS",
          amount: 0.1 + 0.3 * Math.random()
        };
        if(block.face)
          block.face.lexeme.push(lexeme)
        else
          block.face = {
            start: 0,
            end: 1 + Math.random(),
            lexeme: lexeme
        }
          block.face.type="face"
      }
      break;
  
  // WAITING
    case LS.Globals.WAITING:
      
      this.nextBlockIn = 2 + Math.random() * 3;
      // gaze
      var offsetDirections = ["DOWN", "DOWNRIGHT", "DOWNLEFT", "LEFT", "RIGHT"]; // Upper and sides
      var randOffset = offsetDirections[Math.floor(Math.random() * offsetDirections.length)];
      block.gazeShift = {
        start: 0,
        end: 1 + Math.random(),
        target: "CAMERA",
        influence: Math.random()>0.5 ? "HEAD":"EYES",
        offsetDirection: randOffset,
        offsetAngle: 5 + 5*Math.random(),
        type:"gazeShift"
      }
      // Blink
      if(Math.random() < 0.8)
        block.blink = {start: 0, end: 0.2 + Math.random()*0.5, type:"blink"};

      // Set to neutral face (VALENCE-AROUSAL)
      block.faceShift = {start: 0, end: 2, valaro: [0,0], type:"faceShift"};

     	break;
  }
  return block;
}

// -------------------- NEW BLOCK --------------------
// New block arrives. It could be speech or control.
BehaviorPlanner.prototype.newBlock = function(block){
  
  // State
  if (block.control!= undefined && block.control!= null)
    this.transition(block);
/*
	// User input
  if (block.userText)
    this.conversation = "USER: " + block.userText + "\n";

	// If langauge-generation
	if (block.lg){
    block.blink = [];
    block.face = [];
    
		// List of bml instructions
		if (block.lg.constructor === Array)
         for (var i = 0; i <block.lg.length; i++){
           this.processSpeechBlock(block.lg[i], block, (i == block.lg.length-1));
           this.addUtterancePause(block.lg[i]);
         }
    	// No array
    	else
    		this.processSpeechBlock(block.lg, block, true);
	}
*/
	// If non-verbal -> inside mode-selection.nonverbal
	if (block.nonVerbal){
		// Add gesture (check arousal of message)
    if (block.nonVerbal.constructor === Array){ // It is always an array in server
      for (var i = 0; i < block.nonVerbal.length; i++){ // TODO -> relate nonVerbal with lg
        var act = block.nonVerbal[i].dialogueAct;
        block.gesture = {lexeme: act, start: 0, end: 2, type:"gesture"};
      }
    }
    
	}
}

// Automatic blink and saccades
// http://hal.univ-grenoble-alpes.fr/hal-01025241/document
BehaviorPlanner.prototype.updateBlinksAndSaccades = function(dt){
  // Minimum time between saccades 150ms
  // Commonly occurring saccades 5-10 deg durations 30-40ms
  // Saccade latency to visual target is 200ms (min 100 ms)
  // Frequency?
  
  // 10-30 blinks per minute during conversation (every two-six seconds)
  // 1.4 - 14 blinks per min during reading
  
  var block = null;
  
  // Blink
  this.blinkCountdown += dt;
  if (this.blinkCountdown > this.blinkIdle){
    block = {
      blink: 
      {
        start :0,
        end: this.blinkDur
      }
    };
    
    this.blinkCountdown = this.blinkDur;
    this.blinkIdle = this.blinkDur + 0.5 + Math.random()*10;
    this.blinkDur = Math.random()*0.5 + 0.15;
  }
  
  // Saccade
  this.saccCountdown += dt;
  if (this.saccCountdown > this.saccIdle){
    // Random direction
    var opts = ["RIGHT", "LEFT", "DOWN","DOWNRIGHT", "DOWNLEFT", "UP", "UPLEFT", "UPRIGHT"]; // If you are looking at the eyes usually don't look at the hair
    var randDir = opts[Math.floor(Math.random()*opts.length)];
    
    // Fixed point to saccade around?
    var target = "EYESTARGET";
    if (this.state == LS.Globals.LISTENING) 
      target = "CAMERA";
        
    if (!block) 
      block = {};
    
   /* block.gazeShift = {
      start: 0,
      end: Math.random()*0.1+0.1,
      target: target, 
      influence: "EYES",
      offsetDirection: randDir,
      offsetAngle: Math.random()*3,// + 2,
      type:"gazeShift"
    }*/
    
    this.saccCountdown = this.saccDur;
    if (this.state ==LS.Globals.LISTENING || this.state == LS.Globals.SPEAKING)
      this.saccIdle = this.saccDur + 2 + Math.random()*6;
    else
  		this.saccIdle = this.saccDur + 0.5 + Math.random()*6;
  	
    this.saccDur = Math.random()*0.5 + 0.5;
  }
  
  return block;
}


BehaviorPlanner.prototype.attentionToUser = function(block, overwrite){
  // If gazeShift already exists, modify

	var end = 0.5 + Math.random();
	var startHead = 0;
  var startGaze = startHead + Math.random()*0.5; // Late start
  
	// gazeShift
	var gazeShift = {
    id: "gazeEnd",
		start: startGaze,
		end: end,
		influence: "EYES",
		target: "CAMERA",
    type:"gazeShift"
	}
  
	// blink
	var startBlink = -Math.random()*0.2;
	var blink = {
    start: startHead,
		end: end,
    type:"blink"
	}

	// headDirectionShift
	var offsetDirections = ["DOWN", "DOWNLEFT", "DOWNRIGHT"]; // Submissive? Listening?
  var randOffset = offsetDirections[Math.floor(Math.random() * offsetDirections.length)];
	var startDir = -Math.random()*0.3;
	var headDir = {
		start: startHead,
		end: end,
		target: "CAMERA",
    offsetDirection: randOffset,
    offsetAngle: 2 + 5*Math.random(),
    type:"headDirectionShift"
	}
  
  var faceVA = {
    start: startHead,
    end: end,
    valaro: [this.defaultValence, 0],
    type:"faceVA",
    shift : true
  }
  
  // Force and remove existing bml instructions
  if (overwrite)
  {
    block.blink = blink;
    block.faceVA = faceVA;
    block.gazeShift = gazeShift;
    block.headDirectionShift = headDir;
  } 
  else
  {
    this.addToBlock(blink, block, "blink");
    this.addToBlock(faceVA, block, "faceVA");
    this.addToBlock(gazeShift, block, "gazeShift");
    this.addToBlock(headDir, block, "headDirectionShift");
  }
}

BehaviorPlanner.prototype.addToBlock = function(bml, block, key){
  if (block[key])
  {
    // Add to array (TODO: overwrite, merge etc...)
    if (block[key].constructor === Array)
    {
      if (bml.constructor === Array)
        for (var i = 0; i<bml.length; i++)
          block[key].push(bml[i]);
      else
        block[key].push(bml);
    }
    // Transform object to array
    else {
      var tmpObj = block[key];
      block[key] = [];
      block[key].push(tmpObj);
      if (bml.constructor === Array)
        for (var i = 0; i<bml.length; i++)
          block[key].push(bml[i]);
       else
        block[key].push(bml);
    }
  } 
  // Doesn't exist yet
  else
    block[key] = bml;
  
}


// ---------------------------- NONVERBAL GENERATOR (for speech) ----------------------------
// Process language generation message
// Adds new bml instructions according to the dialogue act and speech
//BehaviorPlanner.prototype.processSpeechBlock = function (bmlLG, block, isLast){}

// Use longest word as prosody mark
//BehaviorPlanner.prototype.createBrowsUp = function (bmlLG){}

// Generate faceShifts at the end of speech
//BehaviorPlanner.prototype.createEndFace = function (bmlLG){}

// Create a head nod at the beggining
//BehaviorPlanner.prototype.createHeadNodStart = function (bmlLG){}

// Create gaze (one at start to look away and back to user)
//BehaviorPlanner.prototype.createGazeStart = function (bmlLG){}

// Look at the camera at the end
//BehaviorPlanner.prototype.createGazeEnd = function (bmlLG){}

// Change offsets of new bml instructions
//BehaviorPlanner.prototype.fixSyncStart = function (bml, offsetStart){}

// Add a pause between speeches
//BehaviorPlanner.prototype.addUtterancePause = function (bmlLG){}
