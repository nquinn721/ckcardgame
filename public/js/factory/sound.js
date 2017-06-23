app.factory('sound', function() {
	function Sound() {
		this.sounds = ['sound/bg-music.wav', 'sound/game-bg.music.wav'];
        this.volume = Number(localStorage.volume) || 10;
        this.sound = new Audio(this.sounds[0]);
        this.isPlaying = true;
        this.currentSound = this.sounds[0];


	    this.sound.loop = true;
	    this.sound.volume = this.volume / 10;

	    if(localStorage.isPlaying){
	        if(localStorage.isPlaying === 'false'){
	            this.isPlaying = false;
	        } else {
	        	this.isPlaying = true;
	        }
	    }

        if(this.isPlaying){
        	this.sound.play();
        }
	}

	Sound.prototype = {
	    pauseMusic: function() {
	        this.sound.pause();
	        this.isPlaying = false;
	        localStorage.setItem('isPlaying', false);
	    },
	    playMusic: function() {
	        this.sound.play();  
	        this.isPlaying = true;
	        localStorage.setItem('isPlaying', true);
	    },
	    adjustVolume: function() {
	        this.sound.volume = this.volume / 10;
	        localStorage.setItem('volume', this.sound.volume);
	    },

	    changeSound: function() {
	        var sounds = this.sounds.slice();
	        sounds.splice(this.sounds.indexOf(this.currentSound), 1);
	        this.currentSound = sounds[0];
	    }	
	}

	return new Sound;
})