class SoundManager {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  
  // BGM Nodes
  private bgmGain: GainNode | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode }[] = [];
  private melodyTimeouts: any[] = [];
  
  // Tape Warble Effect
  private warbleLFO: OscillatorNode | null = null;
  private warbleGain: GainNode | null = null;
  
  // Additional Textures
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

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
    if (this.context && this.context.state === 'suspended') {
      this.context.resume().catch(e => console.error("AudioContext resume failed", e));
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

  private createNoiseBuffer(): AudioBuffer {
    const sampleRate = this.context!.sampleRate;
    const bufferSize = sampleRate * 4; // 4 seconds of noise
    const buffer = this.context!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private startBgm() {
    if (!this.context) return;
    this.ensureContext();
    this.stopBgm(); // Ensure clean state

    // 1. Master Chain
    this.bgmGain = this.context.createGain();
    this.bgmGain.gain.value = 0.4; // Slightly lower for clarity

    this.masterCompressor = this.context.createDynamicsCompressor();
    this.masterCompressor.threshold.value = -24;
    this.masterCompressor.knee.value = 30;
    this.masterCompressor.ratio.value = 12;
    this.masterCompressor.attack.value = 0.003;
    this.masterCompressor.release.value = 0.25;

    // 2. Reverb (Brighter, Spacious)
    this.reverbNode = this.context.createConvolver();
    this.reverbNode.buffer = this.createImpulseResponse(3, 3, false); // Shorter, cleaner reverb
    
    // Lowpass Filter (Opened up for cheerfulness)
    const lowpass = this.context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3500; // Higher cutoff for brightness
    lowpass.Q.value = 0.5;

    // Mix dry/wet
    const dryGain = this.context.createGain();
    dryGain.gain.value = 0.6;
    const wetGain = this.context.createGain();
    wetGain.gain.value = 0.4;

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

    // 3. Tape Warble LFO (Subtle Nostalgia)
    this.warbleLFO = this.context.createOscillator();
    this.warbleGain = this.context.createGain();
    
    this.warbleLFO.type = 'sine';
    this.warbleLFO.frequency.value = 0.1; // Very slow drift
    this.warbleGain.gain.value = 8; // Reduced detune
    
    this.warbleLFO.connect(this.warbleGain);
    this.warbleLFO.start();

    // 4. Cheerful Pads (C Major 7 / Add9)
    // Warm, comforting background
    const padFreqs = [
      130.81, // C3
      196.00, // G3
      261.63, // C4
      329.63, // E4
      493.88  // B4 (Major 7th)
    ];

    const createPad = (freq: number, type: 'sine' | 'triangle', gainScale: number = 1) => {
      if (!this.context || !this.bgmGain || !this.warbleGain) return;

      const osc = this.context.createOscillator();
      const oscGain = this.context.createGain();
      const lfo = this.context.createOscillator();
      const lfoGain = this.context.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() * 20) - 10; 

      this.warbleGain.connect(osc.detune);

      // Gentle Breathing LFO
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (Math.random() * 0.1); 
      
      lfoGain.gain.value = 0.02 * gainScale; 
      oscGain.gain.value = 0.03 * gainScale; 
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(this.bgmGain);

      osc.start();
      lfo.start();

      this.activeOscillators.push({ osc, gain: oscGain, lfo });
    };

    padFreqs.forEach((freq, index) => {
      createPad(freq, index < 2 ? 'sine' : 'triangle', index < 2 ? 0.8 : 0.5);
    });

    // 5. Melody Loop (Wind Chimes / Droplets)
    // C Major Pentatonic: C, D, E, G, A
    const melodyNotes = [
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50 // C6
    ];

    const playMelodyNote = () => {
      if (!this.isBgmPlaying || !this.context || !this.bgmGain) return;

      const freq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      
      // Envelope: Fast attack, long release
      const now = this.context.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      if (this.warbleGain) this.warbleGain.connect(osc.detune);

      osc.start();
      osc.stop(now + 3.0);

      // Schedule next note
      const nextTime = 2000 + Math.random() * 4000; // 2-6 seconds
      const timeout = setTimeout(playMelodyNote, nextTime);
      this.melodyTimeouts.push(timeout);
    };

    // Start melody loop
    playMelodyNote();
    
    // 6. Subtle Atmosphere (Reduced Hiss)
    this.noiseNode = this.context.createBufferSource();
    this.noiseNode.buffer = this.createNoiseBuffer();
    this.noiseNode.loop = true;
    this.noiseGain = this.context.createGain();
    this.noiseGain.gain.value = 0.002; // Barely audible
    
    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 8000; 
    
    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.bgmGain);
    this.noiseNode.start();

    this.isBgmPlaying = true;
  }

  startBgmDirect() {
     if (!this.isBgmPlaying) {
        this.startBgm();
     }
  }

  private stopBgm() {
    // Clear Melody Loop
    this.melodyTimeouts.forEach(t => clearTimeout(t));
    this.melodyTimeouts = [];

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
    
    // Stop Noise
    if (this.noiseNode) {
        try {
            this.noiseNode.stop();
            this.noiseNode.disconnect();
        } catch(e) {}
        this.noiseNode = null;
    }
    if (this.noiseGain) {
        this.noiseGain.disconnect();
        this.noiseGain = null;
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
