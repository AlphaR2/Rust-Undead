export type SoundType = 
  | 'click'
  | 'hover' 
  | 'hammer'
  | 'clang'
  | 'forge'
  | 'epic'
  | 'success'
  | 'error'
  | 'battle'
  | 'victory'
  | 'defeat';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  delay?: number;
}

interface CompoundSound {
  sounds: SoundConfig[];
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
          this.isInitialized = true;
        }
      }
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      this.audioContext = null;
      this.isInitialized = false;
    }
  }

  private async ensureAudioContext(): Promise<AudioContext | null> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
        return null;
      }
    }

    return this.audioContext;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public isAudioSupported(): boolean {
    return this.isInitialized && this.audioContext !== null;
  }

  private createTone(
    frequency: number, 
    duration: number, 
    type: OscillatorType = 'sine', 
    volume: number = 0.1
  ): void {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error creating tone:', error);
    }
  }

  private playCompoundSound(compound: CompoundSound): void {
    compound.sounds.forEach((sound) => {
      if (sound.delay) {
        setTimeout(() => {
          this.createTone(sound.frequency, sound.duration, sound.type, sound.volume);
        }, sound.delay);
      } else {
        this.createTone(sound.frequency, sound.duration, sound.type, sound.volume);
      }
    });
  }

  private getSoundConfig(type: SoundType): CompoundSound {
    const soundConfigs: Record<SoundType, CompoundSound> = {
      click: {
        sounds: [{ frequency: 800, duration: 0.1, type: 'sine', volume: 0.08 }]
      },
      hover: {
        sounds: [{ frequency: 600, duration: 0.05, type: 'sine', volume: 0.05 }]
      },
      hammer: {
        sounds: [
          { frequency: 200, duration: 0.3, type: 'square', volume: 0.12 },
          { frequency: 150, duration: 0.2, type: 'square', volume: 0.1, delay: 100 }
        ]
      },
      clang: {
        sounds: [
          { frequency: 800, duration: 0.2, type: 'sine', volume: 0.1 },
          { frequency: 600, duration: 0.15, type: 'sine', volume: 0.08, delay: 50 }
        ]
      },
      forge: {
        sounds: [{ frequency: 300, duration: 0.5, type: 'sawtooth', volume: 0.1 }]
      },
      epic: {
        sounds: [
          { frequency: 440, duration: 0.3, type: 'sine', volume: 0.1 },
          { frequency: 554, duration: 0.3, type: 'sine', volume: 0.1, delay: 200 },
          { frequency: 659, duration: 0.5, type: 'sine', volume: 0.12, delay: 400 }
        ]
      },
      success: {
        sounds: [
          { frequency: 523, duration: 0.2, type: 'sine', volume: 0.1 }, // C5
          { frequency: 659, duration: 0.2, type: 'sine', volume: 0.1, delay: 150 }, // E5
          { frequency: 784, duration: 0.3, type: 'sine', volume: 0.12, delay: 300 } // G5
        ]
      },
      error: {
        sounds: [{ frequency: 200, duration: 0.5, type: 'sawtooth', volume: 0.15 }]
      },
      battle: {
        sounds: [
          { frequency: 220, duration: 0.4, type: 'square', volume: 0.1 },
          { frequency: 330, duration: 0.3, type: 'square', volume: 0.08, delay: 100 }
        ]
      },
      victory: {
        sounds: [
          { frequency: 523, duration: 0.25, type: 'sine', volume: 0.1 },
          { frequency: 659, duration: 0.25, type: 'sine', volume: 0.1, delay: 200 },
          { frequency: 784, duration: 0.25, type: 'sine', volume: 0.12, delay: 400 },
          { frequency: 1047, duration: 0.4, type: 'sine', volume: 0.15, delay: 600 }
        ]
      },
      defeat: {
        sounds: [
          { frequency: 220, duration: 0.6, type: 'sawtooth', volume: 0.12 },
          { frequency: 110, duration: 0.8, type: 'sawtooth', volume: 0.1, delay: 200 }
        ]
      }
    };

    return soundConfigs[type];
  }

  public async playSound(type: SoundType): Promise<void> {
    if (!this.isEnabled) return;

    const audioContext = await this.ensureAudioContext();
    if (!audioContext) return;

    try {
      const soundConfig = this.getSoundConfig(type);
      this.playCompoundSound(soundConfig);
    } catch (error) {
      console.warn(`Error playing sound "${type}":`, error);
    }
  }

  public dispose(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch((error) => {
        console.warn('Error closing audio context:', error);
      });
      this.audioContext = null;
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    audioManager.dispose();
  });
}