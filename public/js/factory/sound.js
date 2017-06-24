app.factory('sound', function() {
	function Sound() {
		this.sounds = {
			login: 'sound/bg-music.wav', 
			game: 'sound/game-bg.wav'
		};
        this.volume = Number(localStorage.volume) || 10;
        this.currentSound = this.sounds.login;
        this.sound = new Audio(this.currentSound);
        this.isPlaying = true;


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
	        localStorage.setItem('volume', this.volume);
	    },
	    mute: function() {
	    	var volume = this.volume;
			if(volume === 0){
				volume = this.savedVolume;
			}else{
				volume = 0;
			}

			this.setVolume();
			this.savedVolume = this.volume; 
	    	this.volume = volume;
	    	localStorage.setItem('volume', volume);	
	    },

	    changeSound: function(view) {
	        this.currentSound = this.sounds[view];

	        setTimeout(() => {
		        this.sound.src = this.currentSound;
		        if(this.isPlaying)
		        	this.sound.play();
		        this.setVolume();
	        }, 1000);
	    },
	    setVolume: function(volume) {
	    	this.sound.volume = volume / 10 || this.volume / 10;
	    }
	}

	return new Sound;
})