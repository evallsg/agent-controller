//@Facial GUI
// Globals

if (!LS.Globals)
  LS.Globals = {};

//LS.Globals.showGUI = true;

this.onStart = function(){
  //this.lipsyncHTML();
}

this.showDebugger = false;

// --------------------- GUI ---------------------

this.onRenderGUI = function(){
	
  /*if (!LS.Globals.showGUI)
    return;*/
  
  width = gl.viewport_data[2];
  height = gl.viewport_data[3];
  
  
  if (!gl.mouse.left_button){
		this._clicked = false;
  }
  
  
  //TOGGLE Debugger
  var area=[width-150,40,125,25];
  gl.start2D();
  this.showDebugger = LS.GUI.Toggle( area, this.showDebugger, "Debugger")
  
  var area=[width-150,80,125,20];
  
 /* LS.GUI.pushStyle();
  
  var micTexture = LS.ResourcesManager.getTexture("evalls/projects/data/imgs/microphone.png", {temp_color:[40,120,40,255]});
  var micTextureOver = LS.ResourcesManager.getTexture("evalls/projects/data/imgs/microphone_over.png", {temp_color:[40,120,40,255]});
  var start_speak = LS.GUI.Button([width-120,120,50,40], micTexture, micTextureOver);
  
  if(start_speak)
  	LS.Globals.speechRecogniser.start();
  
  if(LS.Globals.speechController)
  {
  	var isSpeaking = LS.Globals.speechController.isSpeaking();
    if(isSpeaking){
    	LS.GUI.backgroundColor = "rgba(0,255,0,1)";
      console.log("SPEAKING")
    }
  }
  var speaking = LS.GUI.Button(area, "Stop speaking");
  LS.GUI.popStyle()
  if(speaking)
  	LS.Globals.speechController.stop();
  */
  
  
  if(this.showDebugger)
  {
    var resetFace = LS.GUI.Button([width-150,80,125,25], "Reset face");
    if(resetFace) LS.Globals.facialController.resetFace();

    var planner = LS.GUI.Button([width-150,120,125,25], "Test planner");
    if(planner) window.open("https://webglstudio.org/projects/present/demos/BML-realizer/test/");
    //gl.start2D();
    // ---------- BML ----------
   /* var comp = this._composition[this._selComposition];
    // Blink button
    var rect={x:width-200,y:250,w:150,h:30};

    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button  && !this._clicked){
        this._clicked = true;
        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "blink","blink":true, composition: comp});
        else
          LS.Globals.blink({"blink":"true"});
        gl.fillStyle = "rgba(127,255,127,0.8)";
      }
    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";

    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";
    gl.fillText("Blink", rect.x + rect.w/2, rect.y +3*rect.h/4);



    // Random gaze
    rect={x:width-200,y:370,w:150,h:30};

    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button && !this._clicked){
        this._clicked = true;


        var opts = ["RIGHT", "LEFT", "UP", "DOWN", "UPRIGHT", "UPLEFT", "DOWNRIGHT", "DOWNLEFT"];
        var opts2 =  ["HEAD", "EYES"];

        var val = opts[Math.floor(Math.random()*8)];
        var val2 = Math.random()*45;
        var val3 = opts2[Math.floor(Math.random()*2)];

        // TODO -> IF APP RUNNING
        //var obj = {"influence":val3, "offsetDirection":val, "offsetAngle": val2};
        var obj = {"influence":val3, "offsetDirection":"RIGHT", "offsetAngle": 0};
        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "gaze","gaze":obj, composition: comp});
        else
          LS.Globals.gaze(obj);

        gl.fillStyle = "rgba(127,255,127,0.8)";
      }

    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";



    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";



    gl.fillText("Gaze", rect.x + rect.w/2, rect.y + 0.75*rect.h);/*   (" + this.gaze.influence + ", " 
                + this.gaze.offsetAngle.toFixed(2) + ", " 
                + this.gaze.offsetDirection + ")"
                , rect.x + rect.w/2, rect.y +3*rect.h/4);*/


    // Random gaze shift
   /* rect={x:width-200,y:410,w:150,h:30};

    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button && !this._clicked){

        this._clicked = true;

        var opts = ["RIGHT", "LEFT", "UP", "DOWN", "UPRIGHT", "UPLEFT", "DOWNRIGHT", "DOWNLEFT"];
        var opts2 =  ["HEAD", "EYES"];

        var val = opts[Math.floor(Math.random()*8)];
        var val2 = Math.random()*45;
        var val3 = opts2[Math.floor(Math.random()*2)];

        // TODO--> ONLY WHEN APP IS RUNNING - why? problem fixed?
        var obj = {"influence":val3, "offsetDirection":val, "offsetAngle": val2};
        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "gazeShift","gazeShift":obj, composition: comp});
        else
          LS.Globals.gazeShift(obj);

        gl.fillStyle = "rgba(127,255,127,0.8)";
      }

    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";

    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";

    gl.fillText("GazeShift" , rect.x + rect.w/2, rect.y + 0.75*rect.h);/*   (" + this.gaze.influence + ", " 
                + this.gaze.offsetAngle.toFixed(2) + ", " 
                + this.gaze.offsetDirection + ")"
                , rect.x + rect.w/2, rect.y +3*rect.h/4);*/




    // Head
    /*rect={x:width-200,y:450,w:150,h:30};
    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button&& !this._clicked){

        this._clicked = true;

        var opts =  ["NOD", "SHAKE", "TILT"];
        var val = opts[Math.floor(Math.random()*opts.length)];

        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "head","head":{"lexeme": val}, composition: comp});
        else
          LS.Globals.head({"lexeme": val});

        gl.fillStyle = "rgba(127,255,127,0.8)";
      }

    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";

    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";

    gl.fillText("Head nod/shake/tilt" , rect.x + rect.w/2, rect.y + 0.75*rect.h);

*/

    // Composition mode
    /*if (LS.Globals.BehaviorManager){
      rect={x:width-270,y:530,w:60,h:30};
      gl.font = "10px Arial";
      for (var i = 0; i<this._composition.length; i++){
        // Selected
        if (this._selComposition == i) // ii
          gl.fillStyle = "rgba(255,255,255,0.7)";
        // Mouse click
        else if (gl.mouse.x < rect.x + rect.w + (i*rect.w) && gl.mouse.x > rect.x + (i*rect.w) &&
            gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){

          if (gl.mouse.left_button && !this._clicked){
            this._clicked = true;
            this._selComposition = i;
            gl.fillStyle = "rgba(127,255,127,0.8)";
          }

        } else
          gl.fillStyle = "rgba(255,255,255,0.3)";


        gl.fillRect(rect.x + (i*rect.w),rect.y,rect.w,rect.h);
        gl.fillStyle = "rgba(255,255,255,0.9)";

        gl.fillText(this._composition[i] , rect.x + rect.w/2 + (i*rect.w), rect.y + 0.75*rect.h);
      }
    }*/


    // ---------- BML PLANNER ----------

    /*var state = this._state[this._selState];

    // State
    if (LS.Globals.BehaviorPlanner){
      this._selState = LS.Globals.BehaviorPlanner.state
      state = this._state[this._selState];
      var rect={x:60,y:100,w:100,h:30};
      gl.font = "15px Arial";
      gl.textAlign = "center";
      for (var i = 0; i<this._state.length; i++){
        // Selected
        if (this._selState == i) // ii
          gl.fillStyle = "rgba(255,255,255,0.7)";
        // Mouse click
        else if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
           gl.mouse.y < rect.y + rect.h + i*rect.h*1.5 && 
                 gl.mouse.y > rect.y + i*rect.h*1.5){

          if (gl.mouse.left_button && !this._clicked){
            this._clicked = true;
            this._selState = i;
            LS.Globals.processMsg(JSON.stringify({control: i}));
            gl.fillStyle = "rgba(127,255,127,0.8)";
          } else
            gl.fillStyle = "rgba(255,255,255,0.9)";

        } else
          gl.fillStyle = "rgba(255,255,255,0.3)";


        gl.fillRect(rect.x ,rect.y + i*rect.h*1.5,rect.w,rect.h);
        gl.fillStyle = "rgba(255,255,255,0.9)";

        switch(i)
        {
          case LS.Globals.WAITING:
            state = "WAITING";
            break;
          case LS.Globals.SPEAKING:
            state = "SPEAKING";
            break;
          case LS.Globals.LISTENING:
            state = "LISTENING";
            break;
          case LS.Globals.PROCESSING:
            state = "PROCESSING";
            break;

        }
        gl.fillText(state , rect.x + rect.w/2, rect.y + 0.75*rect.h + i*rect.h*1.5);
      }
    }*/

    /*
    // Show transcript
    if (LS.Globals.transcript){
      gl.font = "20px Arial";
      gl.fillStyle = "white";
      gl.textAlign = "left";
      var posX = 50;
      var posY = height- 50;
      var maxWidth = width;
      var lineHeight = 25;
      var words = LS.Globals.transcript.split(" ");
      var line = "";
      for (var n = 0; n < words.length; n++){
        var testLine = line + words[n] + " ";
        var metrics = gl.measureText(testLine);
        if (metrics.width > maxWidth){
          gl.fillText (line, posX, posY);
          line = words[n] + " ";
          posY += lineHeight;
        } else
          line = testLine;
      }

      gl.fillText(line, posX, posY);

    }
    */
   /* var rect={x:60,y:300,w:100,h:30};
    // rect={x:width-200,y:410,w:150,h:30};

    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button && !this._clicked){

        this._clicked = true;

        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "gesture",gesture:{"lexeme": "wave"}, composition:"MERGE"});
        /*else
          LS.Globals.gazeShift(obj);*/

     /*   gl.fillStyle = "rgba(127,255,127,0.8)";
      }

    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";

    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";

    gl.fillText("Wave" , rect.x + rect.w/2, rect.y + 0.75*rect.h)

     var rect={x:60,y:340,w:100,h:30};
    // rect={x:width-200,y:410,w:150,h:30};

    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button && !this._clicked){

        this._clicked = true;

        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "gesture",gesture:{"lexeme": "speaking"}, composition:"MERGE"});
        /*else
          LS.Globals.gazeShift(obj);*/

       /* gl.fillStyle = "rgba(127,255,127,0.8)";
      }

    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";

    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";

    gl.fillText("Present" , rect.x + rect.w/2, rect.y + 0.75*rect.h)

    var rect={x:60,y:380,w:100,h:30};
    // rect={x:width-200,y:410,w:150,h:30};

    if (gl.mouse.x < rect.x + rect.w && gl.mouse.x > rect.x &&
        gl.mouse.y < rect.y + rect.h && gl.mouse.y > rect.y){
      gl.fillStyle = "rgba(255,255,255,0.5)";

      if (gl.mouse.left_button && !this._clicked){

        this._clicked = true;

        if (LS.Globals.BehaviorManager)
          LS.Globals.BehaviorManager.newBlock({"id": "gesture",gesture:{"lexeme": "default"}, composition:"MERGE"});
        /*else
          LS.Globals.gazeShift(obj);*/

       /* gl.fillStyle = "rgba(127,255,127,0.8)";
      }

    } else
      gl.fillStyle = "rgba(255,255,255,0.3)";

    gl.fillRect(rect.x,rect.y,rect.w,rect.h);
    gl.fillStyle = "rgba(255,255,255,0.9)";

    gl.fillText("Reset pose" , rect.x + rect.w/2, rect.y + 0.75*rect.h)*/
    //gl.finish2D();
    
	// ---------------- BML REALIZER----------------------------------
   // Blocks
  var blockStack = null;
  var bmlStacks = null;
  if (LS.Globals)
    if (LS.Globals.BehaviorManager){
      blockStack = LS.Globals.BehaviorManager.stack;
      bmlStacks = LS.Globals.BehaviorManager.BMLStacks;
    }
  
	
  // Viewport
  var w = gl.viewport_data[2];
  var h = gl.viewport_data[3];
  
  // Base rectangle
  var psize = 0.3;
  var r={x:0,y:h*(1-psize),w:w,h:h*psize};
  gl.fillStyle = "rgba(255,255,255,0.5)";
  gl.fillRect(r.x,r.y,r.w,r.h);
  
  // Row lines
  var maxTextWidth = 0;
  var numRows = stacks.length +1;
  gl.font= 14 * Math.max(h/600, 0.5) + "px Arial"; // Compensated
  for (var i = 0; i < numRows; i++){
    // Lines
    gl.strokeStyle = "rgba(0,0,0,0.3)";
    var height = i/numRows * (h - r.y) + r.y;
    gl.beginPath(); gl.moveTo(0, height); gl.lineTo(w, height); gl.stroke();
    height = (i+1.8)/numRows * (h - r.y) + r.y;
    gl.fillStyle = "rgba(0,0,0,0.5)";
    gl.fillText(stacks[i], 10, height);
    // Adaptive line
    var text = toString(stacks[i]);
    maxTextWidth = Math.max(gl.measureText(text).width, maxTextWidth);
  }
  
  // BMLPLANNER STATE
  if (LS.Globals.BehaviorPlanner){
    gl.font= 10 * Math.max(h/600, 0.5) + "px Arial";
    gl.fillStyle = "rgba(0,0,0,0.5)";
    height = (-1+1.8)/numRows * (h - r.y) + r.y;
    gl.fillText(LS.Globals.BehaviorPlanner.state, 40, height);
  }
  
  
  // Column line
  var firstColW = maxTextWidth * 0.5;
  gl.beginPath(); gl.moveTo(firstColW, r.y); gl.lineTo(firstColW, h); gl.stroke();
 
  // Blocks
  if (!blockStack)
    return;
  if (blockStack.length == 0)
    return;
  // Get global timestamp
	var time = LS.GlobalScene.time;
  // Block rectangle
  var rr = {x: 0, y:0, w: 0, h: 0};
  for (var i = 0; i<blockStack.length; i++){
    var block = blockStack[i];
    var xB = firstColW + timescale * 10 * (block.startGlobalTime - time);
    var wB = timescale * 10 * Math.min((block.endGlobalTime - time), block.end);
    rr.x = Math.max(firstColW,xB);
    rr.y = r.y;
    rr.w = wB;
    rr.h = r.h;
    gl.strokeStyle = "rgba(0,0,0,0.6)";
    gl.lineWidth = 4;
    gl.strokeRect(rr.x,rr.y, rr.w, rr.h);
    // Add block id on top
    gl.font= 12 * Math.max(h/600, 0.5) + "px Arial"; // Compensated
    gl.fillStyle = "rgba(0,0,0,0.5)";
    gl.fillText(block.id, rr.x, 0.8/numRows * (h - r.y) + r.y);
  }
  // BML instruction rectangles
  for (var i = 0; i < stacks.length; i++){ // bmlStacks.length
    var bmlStack = bmlStacks[i];
    // Select color
    gl.fillStyle = "rgba" + colors[i] + "0.3)";
    for (var j = 0; j < bmlStack.length; j++){
      var bmlIns = bmlStack[j];
      if (bmlIns === undefined){
        console.log("Error in: ", stacks[i], bmlStack);
        return;
      }
      // Paint rectangle
      xB = firstColW + timescale * 10 * (bmlIns.startGlobalTime - time);
      wB = timescale * 10 * Math.min((bmlIns.endGlobalTime - time), bmlIns.end);
      rr.x = Math.max(firstColW,xB);
      rr.y = (i+1)/numRows * (h - r.y) + r.y;
      rr.w = Math.max(wB,0);
      rr.h = 1/numRows * (h - r.y);
      gl.fillRect(rr.x, rr.y, rr.w, rr.h);
      gl.lineWidth = 2;
      gl.strokeRect(rr.x, rr.y, rr.w, rr.h);
    }
  }
 
  }
 gl.finish2D();
  
  
 
}

this._clicked = false;
//this.gaze.influence = "NECK";
//this.gaze.offsetAngle = 0.0;
//this.gaze.offsetDirection = "RIGHT";

this._targetValAro = [0,0];
this._lipSyncMsg = {"text":"La temperatura óptima para bañar a un bebé es 38 grados.","audioURL":"http://kristina.taln.upf.edu/demo/resources/voice/test_02.wav","duration":3.8106875,"valence":0.5,"arousal":0.5,"sequence":[[0.0,0.0,0.0,0.0,0.0,0.0,0.0],[0.045135416,0.09,0.31,0.0,0.0,0.0,0.18],[0.12075,0.25,0.27,0.0,0.22,0.57,0.15],[0.18573958,0.15,0.45,0.0,0.0,0.0,0.15],[0.24328125,0.12,0.18,0.0,0.0,0.0,0.1],[0.2966146,0.1,0.27,0.0,0.3,0.15,0.1],[0.3519271,0.15,0.25,0.17,0.3,0.0,0.0],[0.3969271,0.12,0.18,0.0,0.0,0.0,0.1],[0.43691665,0.09,0.2,0.0,0.0,0.0,0.18],[0.49691665,0.25,0.27,0.0,0.22,0.57,0.15],[0.5719271,0.15,0.45,0.0,0.0,0.0,0.15],[0.62692714,0.12,0.14,0.0,0.45,0.4,0.06],[0.6670313,0.09,0.2,0.0,0.0,0.0,0.18],[0.7149688,0.25,0.27,0.0,0.22,0.57,0.15],[0.77511466,0.12,0.27,0.0,0.37,0.3,0.12],[0.8421146,0.15,0.25,0.17,0.3,0.0,0.0],[0.89361465,0.15,0.45,0.0,0.0,0.0,0.15],[0.9304271,0.1,0.36,0.0,0.75,0.0,0.15],[0.99284375,0.1,0.27,0.0,0.3,0.15,0.1],[1.0652604,0.25,0.27,0.0,0.22,0.57,0.15],[1.1149375,0.0,0.92,0.0,0.0,0.33,0.0],[1.1479584,0.12,0.18,0.0,0.0,0.0,0.1],[1.191698,0.09,0.31,0.0,0.0,0.0,0.18],[1.2568854,0.25,0.27,0.0,0.22,0.57,0.15],[1.3393333,0.0,0.87,0.0,0.0,0.33,0.0],[1.4121354,0.12,0.14,0.0,0.45,0.45,0.06],[1.4617292,0.25,0.27,0.0,0.22,0.57,0.15],[1.521125,0.15,0.25,0.17,0.3,0.0,0.0],[1.5810626,0.25,0.27,0.0,0.22,0.57,0.15],[1.6209792,0.09,0.2,0.0,0.0,0.0,0.18],[1.6591876,0.25,0.27,0.0,0.22,0.57,0.15],[1.7075833,0.0,0.1,0.17,0.2,0.0,0.1],[1.754,0.25,0.27,0.0,0.22,0.57,0.15],[1.8446875,0.25,0.2,0.0,0.0,0.1,0.05],[1.9488542,0.25,0.27,0.0,0.22,0.57,0.15],[1.9986563,0.09,0.2,0.0,0.0,0.0,0.18],[2.0415416,0.25,0.27,0.0,0.22,0.57,0.15],[2.0951145,0.12,0.14,0.0,0.45,0.4,0.06],[2.1457605,0.2,0.3,0.1,0.0,0.0,0.2],[2.1906877,0.0,0.18,0.17,0.2,0.0,0.0],[2.2361667,0.12,0.18,0.0,0.0,0.0,0.1],[2.2867396,0.0,0.1,0.17,0.2,0.0,0.1],[2.3421144,0.12,0.18,0.0,0.0,0.0,0.1],[2.3923855,0.12,0.18,0.0,0.0,0.0,0.1],[2.4623752,0.15,0.25,0.0,0.15,0.0,0.15],[2.582396,0.15,0.45,0.0,0.0,0.0,0.15],[2.6773958,0.09,0.2,0.0,0.0,0.0,0.18],[2.7173855,0.12,0.18,0.0,0.0,0.0,0.1],[2.7523751,0.1,0.46,0.0,0.75,0.0,0.15],[2.8073854,0.2,0.3,0.1,0.0,0.0,0.2],[2.8623958,0.15,0.45,0.0,0.0,0.0,0.15],[2.9073958,0.25,0.27,0.0,0.22,0.57,0.15],[2.9873958,0.1,0.36,0.0,0.75,0.0,0.15],[3.0623856,0.12,0.27,0.0,0.37,0.3,0.12],[3.1767292,0.1,0.0,0.0,0.0,0.33,0.0],[3.3037813,0.12,0.27,0.0,0.37,0.3,0.12],[3.3565729,0.0,0.87,0.0,0.0,0.33,0.0],[3.4016666,0.09,0.2,0.0,0.0,0.0,0.18],[3.4761562,0.25,0.27,0.0,0.22,0.57,0.15],[3.555646,0.0,0.92,0.0,0.0,0.33,0.0],[3.6256561,0.12,0.27,0.0,0.37,0.3,0.12],[3.738177,0.15,0.25,0.0,0.15,0.0,0.15],[3.8106875,0.0,0.0,0.0,0.0,0.0,0.0]]}
this._composition = ["MERGE", "REPLACE", "APPEND", "OVERWRITE"];
this._selComposition = 0;


this._state = [LS.Globals.WAITING, "LISTENING", "PLANNING", "SPEAKING"];
this._selState = 0;



// Stacks (should concide with BMLManager.BMLStacks order)
var stacks = ["blink", "gaze", "face", "head", "headDir",
              "speech", "lg"]; //gesture, poiting

// Colors
var colors = ["(0,255,0,", "(255,132,0,", "(0,0,255,",
              "(255,255,0, 0.5)", "(255,0,0,0.5)", "(0,255,255,",
              "(0,133,0,", "(255,0,255,","(255,63,0,",
              "(255, 255, 127"];

// Time scale
  var timescale = 20;