// Hacks to the ABC editor by RT
var ePlay;	//Midi player button
var abcEditor;

var ABCGUI={
	kReplayStep:-2 		//Beats to go back for replay
	,abcSong:'abcSong1'	//Current song (saved locally in browser)
}
var ABCElems={}

function mToggleMute(){
	e=ABCElems.abc;
	var s=e.value;
	var sMuteOn="\n%$[V"			;//String for muting
	var sMuteOff="\n[V"			;//String for unmuting

	iStart=e.selectionStart
	iEnd=e.selectionEnd				//Range of the muting

	iStart=s.substr(0,e.selectionStart).lastIndexOf("\n")   //Exact start position of selection 
	iEnd=s.substr(e.selectionEnd).indexOf("\n")+e.selectionEnd    //Exact end of selection    //Exact end of selection

	sStart=s.substr(0,iStart)		//Split in 3 sections
	if (iStart<0) iStart=0;
	sEnd=s.substr(iEnd)
	sSub=s.substr(iStart,iEnd-iStart)

	if(sSub.indexOf(sMuteOn)<0){    //Not muted, so mute
		r=new  RegExp(sMuteOff.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),'g')
		sSub=sSub.replace(r,sMuteOn)
	} else  {    //Muted, so unmute
		r=new  RegExp(sMuteOn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),'g')
		sSub=sSub.replace(r,sMuteOff)
	}
	s=sStart+sSub+sEnd;
	e.value=s;
	iStart=sStart.length+1;				//Reapply selection
	iEnd=(sStart+sSub).length-1;
	setTimeout(function(){
		e.selectionStart=iStart;				//Restore old selection
		e.selectionEnd=iEnd;
	},1000);
}

function mFormat(){
	var e=ABCElems.abc;
	e.value=e.value.replace("\\t","\t|"); //Replace tab with tab|
	e.value=e.value.replace("/t","\t|"); //Replace tab with tab|
	
}
function mFocusText(){
		 setTimeout(function(){	 ABCElems.abc.focus()}	 ,500)
}
function mZoom(factor){
	ae=document.activeElement;
	if (ae==ABCElems.abc){
		if (ABCElems.abc.style.zoom==0) ABCElems.abc.style.zoom=1;
		ABCElems.abc.style.zoom=ABCElems.abc.style.zoom*factor;	
	}else if (mIsVisible(abcEditor.elMenu)){
		
	}else {
		var z=document.getElementById('idCanvasZoom');
		z.style.width=z.offsetWidth*factor+'px'
	}
}
 
function mTextZoom () { 
	var z=ABCElems.abc.style;
	if (!z.zoom) z.zoom="100%"
	z.zoom=(Number.parseInt(prompt('Zoom ',z.zoom))+'%');
}
function mCanvasZoom () { 
	var z=document.getElementById('idCanvasZoom').style;
	if (!z.width) z.width="100%"
	z.width=Number.parseInt(prompt('Zoom ',z.width))+'%';
}

function mMenuKeyPress(evnt) { 
	if ((evnt.keyCode==27)||(evnt.keyCode==220)){//Escape close menu
			mBlockKey(evnt);
			mMenuHide();
	} else if(evnt.code=='KeyM'){
		mBlockKey(evnt);
		mToggleMute();
		mMenuHide();
		return;
	}else if (evnt.key=='r') { //'r' reproduce music
		mBlockKey(evnt);
		mPlayPause(ABCGUI.kReplayStep);
		mMenuHide();
	}else{
		mBlockKey(evnt);
		//alert(evnt.keyCode);
	}
}
 
function mKeyPress(evnt) {	//Install a shortcut key handler
    eV=evnt;	
	if (mIsVisible(abcEditor.elMenu)) {
		mBlockKey(evnt);mMenuKeyPress(evnt);return;
	} else if (evnt.altKey||evnt.ctrlKey){																//Ctrl or Alt key
		if  (evnt.code=='KeyM') {mBlockKey(evnt); mMenuShow();return};					//Show menu
		if (evnt.code=='KeyR') { mBlockKey(evnt); mPlayPause(); return;} 	//'r' reproduce music
		if ((evnt.key>'0')&&(evnt.key<='9')) {  																//Load song 1 to 9
			mBlockKey(evnt);		mGetSong("abcSong"+evnt.key);		return;
		}
		if (evnt.key=='+'){mBlockKey(evnt); mZoom(1.1);}
		if (evnt.key=='-'){mBlockKey(evnt); mZoom(0.9);}
	}
    if (!evnt.ctrlKey) {
    	if (evnt.keyCode==9){//Tab key
			mBlockKey(evnt);
			var e=evnt.srcElement;
            var s = e.selectionStart;
            e.value = e.value.substring(0,e.selectionStart) + "\t" + e.value.substring(e.selectionEnd);
            e.selectionEnd = s+1; 
		}
		return
	}
	//Only control + keys
    if (((evnt.key=='m')||(evnt.code=='KeyM'))&&(evnt.ctrlKey)){
		mBlockKey(evnt);
		mToggleMute();
	} else if ((evnt.key>'0')&&(evnt.key<='9')) {  //Load song 1 to 9
		mBlockKey(evnt);
		mGetSong("abcSong"+evnt.key)
	} else if ((evnt.key=='p')) {
		//mBlockKey(evnt);
		//mPrint();

	}else if ((evnt.keyCode==79)) { //'o' toggle layout orientation
		mBlockKey(evnt);
		mLayoutToggle();
	}else if (evnt.key=='r') { //'r' reproduce music
		mBlockKey(evnt);
		mPlayPause(); 
	}else if (evnt.key=='0'){  //'0' refresh page
		mBlockKey(evnt);
		location.reload(true);	//Refresh page
	}
	//N,T:   Cant be catched     mBlockKey(evnt);

	if (abcEditor.warnings.length>0) mFormat();
}


function mBlockKey(evnt){
	evnt.preventDefault();
	evnt.stopPropagation();
	
}
function mPrint(){		window.location="printable.html";}
			//190409 RT get last edited string
function mGetSong(songname){
	var sOld=ABCElems.abc.value.trim();
	if (sOld.length>10)  //Save if there already was one
		window.localStorage.setItem(ABCGUI.abcSong,sOld);//Save current 
	ABCGUI.abcSong=songname;
	ABCElems.abc.value=window.localStorage.getItem(ABCGUI.abcSong); //Open another
	mRenderCanvas();
}

function mStatic(bGet)	{
	if (bGet){
		var params=window.localStorage.getItem('ABCGUI');
		if (params) ABCGUI=JSON.parse(params);
	} else {
		window.localStorage.setItem('ABCGUI',JSON.stringify(ABCGUI));
	}
	mGetSong(ABCGUI.abcSong);
}

function mLoad(){ 
	ABCJS.RTHacks=true;	//Enable hacks since brancing
	
	ABCElems.abc=document.getElementById('abc')
	abcEditor=new ABCJS.Editor("abc", 
	{
		canvas_id: "canvas",
		generate_midi: true,
		midi_id: "midi",
		warnings_id: "warnings",
		
		abcjsParams: {
			generateInline: true,
			inlineControls: {
			},
			midiListener: function(abcjsElement, currentEvent, context) {
			midiListener1(abcjsElement, currentEvent, context);
		},
			add_classes: true,
			generateDownload: false
		}
	});		
	//ABCElems.abc.wrap="off";
	//Responsive layout testing
	abcEditor.abcjsParams.responsive= "resize"  //make the svg take up whatever width is available for the container.
	//Add to abcjsParams
	abcEditor.abcjsParams.add_classes=true;
	//abcEditor.abcjsParams.scale=0.72
	//190409 RT get last edited string
	window.onunload = function() {  //Save the current text at unload
		mStatic(false);
	};

	//Install a keyhandler
	var e=ABCElems.abc;
	e.onkeydown = function(event){mKeyPress(event)};  //Only this with ctrl is working on android
	document.onkeydown = function(event){mKeyPress(event)};  //Only this with ctrl is working on android
	document.getElementById('canvas').onkeydown =function(event) {mCanvasKeyPress(event)};
//Setup menu handlers	

	abcEditor.elMenu=document.getElementById('idMenu');
	abcEditor.elMenu.onkeydown = function(event){mMenuKeyPress(event)}
	document.getElementsByClassName('idPopUp')[0].onclick=(function(){mMenuHide();    });  //Close if on overlay
		  	
	abcEditor.elMenu.children[1].onclick=function(evnt){mBlockKey(evnt)};		//Block outside buttons
	 
    document.getElementsByClassName('popupCloseButton')[0].onclick=(function(){
		mMenuHide();
    });
	//alert('ABCGUI.abcSong ' +ABCGUI.abcSong );
	mStatic(true);
 	mGetSong(ABCGUI.abcSong);//190409 RT get last edited tune
}

var nPos=0;
function mSetPlayLoopStart(){
	if (midiEvnt)
		midiEvnt.nLoopStart=midiEvnt.nBeat;
	mButtonsRefresh();
}
 
function mPlayPause(movepos){	//Pause or resume playing at a beat relative to current
	if(!movepos) movepos=ABCGUI.kReplayStep;//Move the starting beat  relative to current
	var nStartBeat=midiEvnt.nBeat+movepos;
	if (nStartBeat<0) nStartBeat=0;
//Workaround rendering the tune
	target =document.querySelector('.abcjs-midi-start');
	if (!target) {alert('Tune is not ready');return;}
    target.click(); //Render the tune 
	MIDI.player.stop();	//STOP it
	MIDI.player.currentTime=midiEvnt.beats[nStartBeat]*MIDI.player.duration;
	if (midiEvnt.bPlaying){
		midiEvnt.bPlaying=false;	//Stop at current beat
	} else {
		midiEvnt.bPlaying=true;
		MIDI.player.start();

	}
	mButtonsRefresh();
}
function mButtonsRefresh(){
	var elPlay	=document.getElementById("idBtnPlay");
	var elStart	=document.getElementById("idBtnStart");
	var elEnd	=document.getElementById("idBtnEnd");
	if (!midiEvnt.bPlaying) 
			elPlay.textContent="Play:"+midiEvnt.nBeat;
	else 	elPlay.textContent="Pause:"+midiEvnt.nBeat;
	if (midiEvnt.nLoopStart)
	elStart.textContent	="Start:"+midiEvnt.nLoopStart;
	if (midiEvnt.nLoopEnd)
	elEnd.textContent	="End:"+midiEvnt.nLoopEnd;
}
var midiEvnt={};
  midiEvnt.beats=[];			//Progress time for the beats
function midiListener1(_abcjsElement, _currentEvent, _context){
	//_abcjsElement;  //Not interesting for this purpose
	debug= _currentEvent;
	if (!_currentEvent.newBeat) return;  //Only beats
	midiEvnt.nBeat=_currentEvent.thisBeat;
	midiEvnt.progress=_currentEvent.progress; 
	if (!midiEvnt.beats[_currentEvent.thisBeat])
		midiEvnt.beats[_currentEvent.thisBeat]=_currentEvent.progress;	//Collect beat progresses
}

function mRenderCanvas(){	//190508 revised 
		abcEditor.fireChanged();//I guess this renders the canvas 
		abcEditor.paramChanged();//Maybe this is better ?
}
function mLayoutToggle(){   // Toggle orientation between horizontal/vertical layout
	e=document.getElementById('idLayoutVert');
	e.disabled=!e.disabled;
}

function mMenuShow(){		//A menu 
	 mVis( abcEditor.elMenu ,true);
	 setTimeout(function(){	 document.getElementById('idBtnPlay').focus()}	 ,500)
}
function mMenuHide(){	//Hide the menu and focus text
	mVis(abcEditor.elMenu,false);
	mFocusText();
}
function mIsVisible(el){
	return (el.style.display=='block');
	
}

function mVis(e,bool){
	if (bool)
		e.style.display='block'
	else
		e.style.display='none'
}
function mSVG2IMG(){	///Convert the SVG to image so it can be copy pasted
	var svg = document.querySelector('svg');
	var XML = new XMLSerializer().serializeToString(svg);
   SVG64=btoa(unescape(encodeURIComponent(XML)));
    var  img = new Image();
	 
	img.height =svg.parentElement.clientHeight;//svg.viewBox.baseVal.height 
	img.width =svg.parentElement.clientWidth;//svg.viewBox.baseVal.width 
    img.src = 'data:image/svg+xml;base64,' + SVG64;
	svg.outerHTML='<canvas width="400" height="400" id="cv"></canvas>';
	svg.outerHTML=img.outerHTML;			//Brutal substitution of element
 	img = document.querySelector('img');
 
}
 
 