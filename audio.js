var musicContext , masterGain , masterAnalyser;

var note;

var songsLoaded     = 0;
var songsNeededToLoad = 1;

function initAudio(){

  musicContext = new webkitAudioContext();

  masterGain      = musicContext.createGain();
  masterAnalyser  = musicContext.createAnalyser();

  // number of different parts of the spectrum
  masterAnalyser.frequencyBinCount = 1024;

  masterGain.connect( masterAnalyser );
  masterAnalyser.connect( musicContext.destination );

  note = new NOTE( "knee.mp3" );
  
}



function NOTE( file ){

  this.file = file;

  this.loadFile();

  this.playing = false;

}



NOTE.prototype = {

  stop:function(){

    this.playing = false;
    this.source.noteOff( 0 );

  },

  play:function(){

    this.playing = true;
    this.createSource();
    this.source.noteOn( 0 );

  },

  createSource:function(){

    this.source         = musicContext.createBufferSource();
    this.source.buffer  = this.buffer;
    this.source.loop    = false;

    this.analyser       = musicContext.createAnalyser();
    this.gain           = musicContext.createGain();

    this.source.connect( this.gain );
    this.gain.connect( this.analyser );

    this.analyser.connect( masterGain );


  },

  onDecode:function(){
    
    //gets just the track name, removing the mp3
    this.trackID= this.file.split('.')[this.file.split('.').length-2];
    this.playing = false;
    this.createSource();
    this.loadBarAdd();

  },


  loadFile:function(){
    
    var request=new XMLHttpRequest();
    request.open("GET",this.file,true);
    request.responseType="arraybuffer";


    var self = this
    request.onload = function(){

      musicContext.decodeAudioData(request.response,function(buffer){

        if(!buffer){
          alert('error decoding file data: '+url);
          return;
        }

        self.buffer = buffer;
        self.onDecode();

      })
    },

    request.send();
  },


  loadBarAdd: function(){

    songsLoaded += 1;

    if( songsLoaded == songsNeededToLoad ){

      BEGIN();

    }
  
  }


}




