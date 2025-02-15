import themeAudio from "../Assets/Sounds/main-theme.mp3";
import clickAud from "../Assets/Sounds/click.mp3";
import explosionAud from "../Assets/Sounds/explosion-hit.wav";
import afar from "../Assets/Sounds/explosion-afar.wav";

class AudioManager{
    constructor(){
        this.sounds = {
            theme: new Audio(themeAudio),
            click: new Audio(clickAud),
            explosion: new Audio(explosionAud),
            afar: new Audio(afar)
        };

        this.sounds.theme.loop = true;
        this.effectVolume = 1.0;
        this.themeLowVolume = 0.5;
        this.maxVolume = 1.0;
        this.isMute = false;
    }

    playSound(name){

        if(this.isMute){
           this.mute();
        }else{

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

    mute(){
        this.isMute = true;
        let keys = Object.keys(this.sounds);
        console.log(keys);
        keys.forEach(key => {
            // this.sounds[key].volume = 0;
            this.sounds[key].pause();
        });
        // focus(let i = 0; i < )
        // for(snd in this.sounds){
        //     snd.volume = 0;
        //     snd.pause();
        // }
    }

    unmute(){
        this.startTheme();
        this.isMute = false;
    }
}

export default AudioManager;