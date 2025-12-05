class SoundManager {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  
  // BGM Nodes
  private bgmGain: GainNode | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode }[] = [];
  
  // Tape Warble Effect
  private warbleLFO: OscillatorNode | null = null;
  private warbleGain: GainNode | null = null;
  
  private isBgmPlaying: boolean = false;

  constructor() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContext();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      
      this.gainNode.gain.value = 0.1; // Global volume
    } catch (e) {
      console.error('Web Audio API not supported', e);
    }
  }

  private ensureContext() {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }

  playHover() {
    if (!this.context) return;
    this.ensureContext();
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    // Crisp, high-pitched blip
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2000, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2500, this.context.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.03);
    
    osc.connect(gain);
    if (this.analyser) {
        gain.connect(this.analyser);
    } else {
        gain.connect(this.context.destination);
    }
    
    osc.start();
    osc.stop(this.context.currentTime + 0.03);
  }

  playClick() {
    if (!this.context) return;
    this.ensureContext();
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    // Sharp, mechanical click
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.08);
    
    osc.connect(gain);
    if (this.analyser) {
        gain.connect(this.analyser);
    } else {
        gain.connect(this.context.destination);
    }
    
    osc.start();
    osc.stop(this.context.currentTime + 0.08);
  }

  toggleBgm(): boolean {
    if (!this.context) return false;
    this.ensureContext();

    if (this.isBgmPlaying) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isBgmPlaying;
  }

  // Generate a simple impulse response for reverb
  private createImpulseResponse(duration: number, decay: number, reverse: boolean): AudioBuffer {
    const sampleRate = this.context!.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.context!.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = reverse ? length - i : i;
      // Exponential decay
      const val = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      left[i] = val;
      right[i] = val;
    }
    return impulse;
  }

  private startBgm() {
    if (!this.context) return;
    this.stopBgm(); // Ensure clean state

    // 1. Master Chain
    this.bgmGain = this.context.createGain();
    this.bgmGain.gain.value = 0.2; // Adjusted volume

    this.masterCompressor = this.context.createDynamicsCompressor();
    this.masterCompressor.threshold.value = -24;
    this.masterCompressor.knee.value = 30;
    this.masterCompressor.ratio.value = 12;
    this.masterCompressor.attack.value = 0.003;
    this.masterCompressor.release.value = 0.25;

    // 2. Reverb (Ethereal Space)
    this.reverbNode = this.context.createConvolver();
    this.reverbNode.buffer = this.createImpulseResponse(4, 2, false); // 4 seconds reverb
    
    // Lowpass Filter for warmer, "tape" sound
    const lowpass = this.context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1200; 
    lowpass.Q.value = 0.5;

    // Mix dry/wet
    const dryGain = this.context.createGain();
    dryGain.gain.value = 0.5;
    const wetGain = this.context.createGain();
    wetGain.gain.value = 0.5;

    this.bgmGain.connect(lowpass);
    lowpass.connect(this.masterCompressor);
    this.masterCompressor.connect(dryGain);
    this.masterCompressor.connect(this.reverbNode);
    this.reverbNode.connect(wetGain);
    
    if (this.analyser) {
        dryGain.connect(this.analyser);
        wetGain.connect(this.analyser);
    } else {
        dryGain.connect(this.context.destination);
        wetGain.connect(this.context.destination);
    }

    // 3. Tape Warble LFO (Global Detune Modulation)
    this.warbleLFO = this.context.createOscillator();
    this.warbleGain = this.context.createGain();
    
    this.warbleLFO.type = 'sine';
    this.warbleLFO.frequency.value = 0.15; // Slow drift
    this.warbleGain.gain.value = 15; // +/- 15 cents detune
    
    this.warbleLFO.connect(this.warbleGain);
    this.warbleLFO.start();

    // 4. Generative Drone Voices
    // A minor add9 / Suspended feel: A2, E3, B3, C4, E4, A4
    const baseFreqs = [
      110.00, // A2
      164.81, // E3
      246.94, // B3
      261.63, // C4
      329.63, // E4
      440.00  // A4
    ];

    // Add some high shimmer harmonics
    const shimmerFreqs = [
      659.25, // E5
      880.00  // A5
    ];

    const createVoice = (freq: number, type: 'sine' | 'triangle', gainScale: number = 1) => {
      if (!this.context || !this.bgmGain || !this.warbleGain) return;

      const osc = this.context.createOscillator();
      const oscGain = this.context.createGain();
      const lfo = this.context.createOscillator();
      const lfoGain = this.context.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      // Initial detune spread
      osc.detune.value = (Math.random() * 30) - 15; 

      // Apply Tape Warble
      this.warbleGain.connect(osc.detune);

      // Volume LFO (Swells)
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (Math.random() * 0.15); 
      
      lfoGain.gain.value = 0.03 * gainScale; // Modulation depth
      oscGain.gain.value = 0.02 * gainScale; // Base gain
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(this.bgmGain);

      osc.start();
      lfo.start();

      this.activeOscillators.push({ osc, gain: oscGain, lfo });
    };

    baseFreqs.forEach((freq, index) => {
      createVoice(freq, index % 2 === 0 ? 'sine' : 'triangle', 1.0);
    });

    shimmerFreqs.forEach((freq) => {
      createVoice(freq, 'sine', 0.4); // Lower volume for shimmer
    });

    this.isBgmPlaying = true;
  }

  startBgmDirect() {
     if (!this.isBgmPlaying) {
        this.startBgm();
     }
  }

  private stopBgm() {
    // Stop Warble
    if (this.warbleLFO) {
        try {
            this.warbleLFO.stop();
            this.warbleLFO.disconnect();
        } catch(e) {}
        this.warbleLFO = null;
    }
    if (this.warbleGain) {
        this.warbleGain.disconnect();
        this.warbleGain = null;
    }

    this.activeOscillators.forEach(item => {
      try {
        // Smooth fade out
        if (this.context) {
          item.gain.gain.cancelScheduledValues(this.context.currentTime);
          item.gain.gain.setValueAtTime(item.gain.gain.value, this.context.currentTime);
          item.gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
        }
        setTimeout(() => {
          item.osc.stop();
          item.lfo.stop();
          item.osc.disconnect();
          item.lfo.disconnect();
        }, 1000);
      } catch (e) {}
    });
    
    this.activeOscillators = [];
    
    if (this.bgmGain) {
      // Fade out master
      if (this.context) {
        this.bgmGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
      }
      setTimeout(() => {
        this.bgmGain?.disconnect();
        this.masterCompressor?.disconnect();
        this.reverbNode?.disconnect();
        this.bgmGain = null;
        this.masterCompressor = null;
        this.reverbNode = null;
      }, 1000);
    }
    
    this.isBgmPlaying = false;
  }
}

export const audioManager = new SoundManager();
