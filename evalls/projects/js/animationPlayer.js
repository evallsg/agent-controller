//https://github.com/jagenjo/litescene.js/blob/master/guides/programming_components.md
//This is an example of a component code
function AnimationPlayer(o) {
  //define some properties
  this.enabled = true;
	this._animations = [];
  this._values_changed = false;
  this.selected = "";
  this.playback_speed = 1.0;
  this.onPreApply = null;
  this.onApplySample = null;
  //if we have the state passed, then we restore the state
  if(o)
    this.configure(o);
}

//bind events when the component belongs to the scene
AnimationPlayer.prototype.onAddedToScene = function(scene)
{
  LEvent.bind(scene, "update", this.onUpdate, this );
}

//unbind events when the component no longer belongs to the scene
AnimationPlayer.prototype.onRemovedFromScene = function(scene)
{
	//bind events
  LEvent.unbind(scene, "update", this.onUpdate, this );
}

//example of one method called for ever update event
AnimationPlayer.prototype.onUpdate = function(e,dt)
{
  if(!this.enabled)
		return;
  
   var animations = this._animations;
	
  for(var i in animations)
  {
    
   	var animation = animations[i]; 
    if(!animation.enabled)
      continue;
    
    this.onUpdateAnimation( dt, animation );

    if(animation._use_blend_animation)
      this.onUpdateBlendAnimation(dt,animation);

      
  }
  var scene = this._root.scene;
	if(scene)
		scene.requestFrame();
  
}

AnimationPlayer.prototype.onUpdateAnimation = function(dt,animation)
{
 
  /*var animations = this._animations;
	
  for(var i in animations)
  {
   var animation = animations[i]; 
       */
  animation.current_time += dt* this.playback_speed;
    var take = animation.takes[ "default" ]; //HARDCODED 
    if(!take) 
      return;
       
    var time = animation.current_time;
    var start_time = 0;
    var duration = animation._duration;
    var end_time = duration;

   /* if(this.range)
    {
      start_time = this.range[0];
      end_time = this.range[1];
      duration = end_time - start_time;
    }*/
    
    if(time > end_time)
    {
      if(animation.loop)
      {
        time = ((animation.current_time - start_time) % duration) + start_time;
        LEvent.trigger( this, "animation_loop" );
      } 
      else
      {
        time = end_time; 
        //time = start_time; //reset after
        LEvent.trigger( this, "end_animation" );
        animation.enabled = false;
        //this.playing = false;
       
      }
    }
    else if(time < start_time)
      time = start_time;
		
    this.applyAnimation( take, time, animation._last_time, animation.weight);
    animation._last_time = time;
/*  }


	var scene = this._root.scene;
	if(scene)
		scene.requestFrame();*/
}
AnimationPlayer.prototype.onUpdateBlendAnimation = function( dt,animation )
{
	/*var animations = this._animations;
	
  for(var i in animations)
  {
   var animation = animations[i]; 
       */
    var take = animation.takes[ "default" ]; //HARDCODED 
    if(!take) 
      return;

    animation._blend_current_time += dt;
    animation._blend_remaining_time -= dt;

    if( animation._blend_remaining_time <= 0 )
      animation._use_blend_animation = false; //next frame it will stop

    var time = animation._blend_current_time * this.playback_speed;

    var start_time = 0;
    var duration = animation._duration;
    var end_time = duration;

    if(time > end_time)
    {
      if( animation.loop )
      {
        time = ((animation._blend_current_time - start_time) % duration) + start_time;
      }
      else
      {
        time = end_time; 
        animation._use_blend_animation = false;
        animation.enabled = false;
      }
          
    }
    else if(time < start_time)
      time = start_time;
  
		this.applyAnimation( take, time, null, animation._blend_remaining_time / animation.blend_time );
	/*}
	var scene = this._root.scene;
	if(scene)
		scene.requestFrame();*/
}
/**
* applys the animation to the scene nodes
* @method applyAnimation
* @param {String} take the name of the take
* @param {Number} time the time where to sample the tracks
* @param {Number} last_time [optional] the last time that was applied, (used to trigger events)
* @param {Number} weight [optional] the weight of this animation (used for blending animation), if ommited 1 is used
*/
AnimationPlayer.prototype.applyAnimation = function( take, time, last_time, weight )
{
	if( last_time === undefined )
		last_time = time;

	//this could happen if the component was removed during the onUpdate
	if(!this._root) 
		return;

	var root_node = null;
	if(this.root_node && this._root.scene)
	{
		if(this.root_node == "@")
			root_node = this._root;
		else
			root_node = this._root.scene.getNode( this.root_node );
	}
	take.applyTracks( time, last_time, LS.LINEAR, root_node, this._root.scene, weight, this.onPreApply, this.onApplySample );
}
/**
* returns the current animation or an animation with a given name
* @method getAnimation
* @param {String} name [optional] the name of the animation, if omited then uses the animation set in the component
* @return {LS.Animation} the animation container
*/
AnimationPlayer.prototype.getAnimation = function( name )
{

	if(!name || name[0] == "@") 
		return this._root.scene.animation;
	var anim = LS.ResourcesManager.getResource( name );
	if( anim && anim.constructor === LS.Animation )
		return anim;
	return null;
}

//you can also implement the methods serialize and configure

//register the class so it is a valid component for LS
AnimationPlayer["@inspector"] = function( component, inspector )
{
  var node = this;
	inspector.widgets_per_row = 7;

  for(var i = 0; i < component._animations.length; ++i)
  {
      let animation = component._animations[i];
      inspector.addCheckbox("enable",  animation.enabled, { animationIdx: i, callback: function(v){

        var i = this.options.animationIdx;
        if(v && !component._animations[i].enabled){
          animation._use_blend_animation = true
          animation.current_time=0;
        }
        if(!v && component._animations[i].enabled)
          animation._use_blend_animation = false;
        
        component._animations[i].enabled = v;
        // inspector.refresh();
      }});
    
      inspector.addString( null, animation.name, {width:"30%", point: animation.name, callback: function(v){
          this.options.point = v;
          component.setDirtyCanvas(true);
        }});

      inspector.addSlider("weight",  animation.weight, { min:0,max:1, animationIdx: i, callback: function(v){

          var i = this.options.animationIdx;
          component._animations[i].weight = v;
         // inspector.refresh();
        }});
      inspector.addNumber("duration",  animation.duration, {animationIdx: i, callback: function(v){

          var i = this.options.animationIdx;
          component._animations[i].duration = v;
         // inspector.refresh();
        }});
      inspector.addCheckbox("loop",  animation.loop, { animationIdx: i, callback: function(v){

          var i = this.options.animationIdx;
          if(v && !component._animations[i].loop)
            component._animations[i].current_time=0;

          component._animations[i].loop = v;
         // inspector.refresh();
        }});

      inspector.addButton(null,"X", { point: animation.name, width: "5%", callback: function(){
          LiteGUI.confirm("Are you sure? ", (function(v){
            if(!v)
              return;
            component.removeAnimation( animation.name );	
            inspector.refresh();
          }).bind(this.options));
        }});

	}
  inspector.widgets_per_row = 1;

  var new_point_name = "";
  inspector.addSeparator();
  inspector.addTitle("New animation");
  inspector.widgets_per_row = 2;
  
  inspector.widgets_per_row = 1;
  inspector.addSeparator();
  inspector.addButton("Select animation","<img src='https://webglstudio.org/latest/imgs/mini-icon-folder.png'>",{ micro: true, callback: function(){
    	EditorModule.showSelectResource( { type:"animation", on_complete: function(v){
      	new_animation_name = v; 
        if(new_animation_name){
          
          component.addAnimation( new_animation_name);
    		}
    		inspector.refresh();
      }});
  }});
  
}

AnimationPlayer.prototype.addAnimation = function( name)
{
  var animation = this.getAnimation(name);
  if(!animation)
    return;
  
  if( this.findAnimation(animation.name) )
  { 
    console.warn("there is already an animation with this name" );
    return;
  }
  animation.weight = 0;
  animation.loop = false;
  animation.current_time=0;
  animation._last_time=0;
  animation._duration = animation.takes[ "default" ].duration; //HARDCODED ;
  animation.blend_time = 1;
  animation._blend_current_time =  animation.current_time;
	animation._blend_remaining_time = animation.blend_time;
  animation.enabled = true;
  animation._use_blend_animation = true;
  this._animations.push(animation);//{name:name, weight:0, loop: false});
  this._values_changed = true;
  //this.setDirtyCanvas(true);
}

AnimationPlayer.prototype.removeAnimation = function(name)
{
  for(var i = 0; i < this._animations.length; ++i)
    if( this._animations[i].name == name )
    {
      this._animations.splice(i,1);
      this._values_changed = true;
      return;
    }
}

AnimationPlayer.prototype.findAnimation = function( name )
{
  for(var i = 0; i < this._animations.length; ++i)
    if( this._animations[i].name == name )
      return this._animations[i];
  return null;
}

AnimationPlayer.prototype.onSerialize = function(o)
{
  o.animations = this._animations;
  
}

AnimationPlayer.prototype.onConfigure = function(o)
{
  if(o.animations)
    this._animations = o.animations;
  for(var i in this._animations)
  {
    LS.RM.load(this._animations[i].name)
  }

}
LS.registerComponent( AnimationPlayer );
