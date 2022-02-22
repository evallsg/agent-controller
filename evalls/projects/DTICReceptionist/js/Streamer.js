
//@Websocket
// Force http (as we use ws, not wss)
//if (window.location.protocol != "https:")
//    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);

function Streamer(url){
	if (this.constructor !== Streamer){
		throw ("You must use new to create an Streamer");
	}
	this.hostname = "webglstudio.org/port/9003/ws/";
  this.port = 8000;
  this.room = "present";


	this._streaming = false;
	this._ws = null;
	this._headersize = 18;
	
	if(url){
		this.connect(url)
	}
  else
    this.connect();
  LS.Globals.streamer = this;

}
Streamer.prototype.onAddedToScene = function(scene)
{
  LEvent.bind(scene, "update", this.onUpdate, this );
  
  if (!"WebSocket" in window)
    alert("WebSockets are not supported in this browser");
  else 
    this.connect();
}
Streamer.prototype.connect = function( url, on_connected, on_error ){
  
  
	 // Host string ("wss://.." if https)
  var hostString = url|| "wss://" + this.hostname;
  
  that = this;
  // Create new WS
  this._ws = new WebSocket(hostString);
  console.log("Connecting to " + hostString + "...");
  LS.infoText = "Connecting to " + hostString + "...";
  // Events
  // onopen
  this._ws.onopen = function(){
  	// Assign to LS.Globals
    LS.Globals.ws = this;
        
    console.log("Connected to "+ hostString);

  }
  
  // onmessage
  this._ws.onmessage = function(e){
    console.log("Received message: ", e.data);
    var msg = JSON.parse(e.data);
    if(msg.type.info && msg.data.includes("session with token "+that.room+ " created"))	
         that.connectRoom();
    // Process message
    if (LS.Globals.processMsg)
      LS.Globals.processMsg(e.data, true);
  }
  
  // onerror
  this._ws.onerror = function (e){
    console.log("WS error: ", e); 
  }
  
  // onclose
  this._ws.onclose = function(){
    // Remove from LS.Globals
    LS.Globals.ws = null;
    
    
    console.log("Disconnected from " + hostString);
  }
}

Streamer.prototype.connectRoom = function(room){
  
	if(room)
    this.room = room;
   this._ws.send(JSON.stringify({type: "session", data: { token: this.room, action: "connect"}}));
  
}
Streamer.prototype.onUpdate = function(dt){
  // If Websocket
  if (this._ws)
    // If connection is closed or couldn't be opened, retry
    if (this._ws.readyState == 3)
      // Retry connection
      this.connect();
}
Streamer.prototype.onRemovedFromScene = function(scene)
{
   // Disconnect websocket
  if (this._ws)
    this._ws.close();
	//bind events
  LEvent.unbind(scene, "update", this.onUpdate, this );
}
LS.registerComponent( Streamer );
