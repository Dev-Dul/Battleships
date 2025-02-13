class AudioManager{
    constructor(){
        this.sounds = {
            theme: new Audio("../Assets/Sounds/main-theme.mp3"),
            click: new Audio("../Assets/Sounds/click.mp3"),
            explosion: new Audio("../Assets/Sounds/explosion-hit.wav"),
            afar: new Audio("../Assets/Sounds/explosion-afar.wav")
        };

        this.sounds.theme.loop = true;
        this.effectVolume = 1.0;
        this.themeLowVolume = 0.5;
        this.maxVolume = 1.0;
    }

    playSound(name){
        if(name === "click"){
            this.sounds.theme.volume = 0;
        }else{
            this.lowerThemeVolume();
        }
        
        this.sounds[name].currentTime = 0;
        this.sounds[name].volume = this.effectVolume;
        this.sounds[name].play();


        this.sounds[name].onended = () => {
            this.restoreThemeVolume();
        }
    }

    lowerThemeVolume(){
        this.sounds.theme.volume = this.themeLowVolume;
    }

    restoreThemeVolume(){
        this.sounds.theme.volume = this.maxVolume;
    }

    startTheme(){
        this.sounds.theme.play();
    }

    getDuration(name){
        return this.sounds[name].duration;
    }
}

export default AudioManager;