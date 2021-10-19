//@Websocket
// Force http (as we use ws, not wss)
//if (window.location.protocol != "https:")
//    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);


// Globals
if (!LS.Globals)
  LS.Globals = {};

LS.infoText = "";
LS.Globals.room = "ausburg";  
  
this.hostname = "webglstudio.org";

this.characterName = "Eva";



this.onStart = function(){
  this.port = 8000;
  this.room = LS.Globals.room ;
  // If websockets not supported
  if (!"WebSocket" in window)
    alert("WebSockets are not supported in this browser");
  else
    this.connectWS();
  
}




this.onUpdate = function(dt)
{
  // If Websocket
  if (this.ws)
    // If connection is closed or couldn't be opened, retry
    if (this.ws.readyState == 3)
      // Retry connection
      this.connectWS();
      
}



this.onFinish = function(){
  
  // Disconnect websocket
  if (this.ws)
    this.ws.close();
}





this.connectWS = function(){
  // Host string ("wss://.." if https)
  var hostString = "wss://" + this.hostname;
  
  that = this;
  // Create new WS
  this.ws = new WebSocket(hostString);
  console.log("Connecting to " + hostString + "...");
  LS.infoText = "Connecting to " + hostString + "...";
  // Events
  // onopen
  this.ws.onopen = function(){
  	// Assign to LS.Globals
    LS.Globals.ws = this;
        
    console.log("Connected to "+ hostString);
    this.send( JSON.stringify({type:"session", data: {token: that.room, action: "bp_create"}}));

  }
  
  // onmessage
  this.ws.onmessage = function(e){
    //console.log("Received message: ", e.data);
    
    // Process message
    if (LS.Globals.processMsg)
      LS.Globals.processMsg(e.data, true);
  }
  
  // onerror
  this.ws.onerror = function (e){
    console.log("WS error: ", e); 
  }
  
  // onclose
  this.ws.onclose = function(){
    // Remove from LS.Globals
    LS.Globals.ws = null;
    
    
    console.log("Disconnected from " + hostString);
  }
  
}





/*
var msg = {
	"id": Math.floor(Math.random()*1000),
  "face": {
  	"start": 0,
    "end": 1,
    "valaro": [0.5, 0.5]
  },
  "blink": true
}


req = new XMLHttpRequest();
req.open('POST', 'https://webglstudio.org:8080/idle?id=myID', true);
req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
req.send(JSON.stringify(msg));

req.onreadystatechange = function () { //Call a function when the state changes.
    if (req.readyState == 4 && req.status == 200) {
        console.log(req.responseText);
    }
}

// http://kristina.taln.upf.edu/services/language_generation?data=Hello

*/
