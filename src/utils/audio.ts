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
  private listeners: ((isPlaying: boolean) => void)[] = [];

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

  playGearScroll() {
    if (!this.context) return;
    this.ensureContext();
    
    // Softer, subtle mechanical tick (Less harsh)
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    
    // Triangle wave is smoother than sawtooth but still has some character
    osc.type = 'triangle';
    
    // Lower pitch range for a "thud" rather than a "buzz"
    osc.frequency.setValueAtTime(50, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.context.currentTime + 0.15);
    
    // Aggressive lowpass to remove all harsh high frequencies
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, this.context.currentTime);
    filter.Q.value = 0.5; // No resonance (which causes "ringing")

    // Softer envelope
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.02); // Soft attack
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.2);
    
    osc.connect(filter);
    filter.connect(gain);
    
    if (this.analyser) {
        gain.connect(this.analyser);
    } else {
        gain.connect(this.context.destination);
    }
    
    osc.start();
    osc.stop(this.context.currentTime + 0.2);
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

  public startBgmDirect() {
    if (!this.context) return;
    this.ensureContext();
    if (!this.isBgmPlaying) {
      this.startBgm();
    }
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

  public get isPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public subscribe(listener: (isPlaying: boolean) => void) {
    this.listeners.push(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.isBgmPlaying));
  }

  private startBgm() {
    if (!this.context) return;
    this.ensureContext();
    this.stopBgm(); // Ensure clean state
    this.isBgmPlaying = true;
    this.notify();

    // 1. Master Chain
    this.bgmGain = this.context.createGain();
    this.bgmGain.gain.value = 0.4; // Slightly lower for clarity

    this.masterCompressor = this.context.createDynamicsCompressor();
    this.masterCompressor.threshold.value = -24;
    this.masterCompressor.knee.value = 30;
    this.masterCompressor.ratio.value = 12;
    this.masterCompressor.attack.value = 0.003;
    this.masterCompressor.release.value = 0.25;

    // 2. Reverb (Brighter, Spacious, Ethereal)
    this.reverbNode = this.context.createConvolver();
    // Increased duration for more ethereal feel
    this.reverbNode.buffer = this.createImpulseResponse(7, 2, false); 
    
    // Lowpass Filter (Opened up for cheerfulness)
    const lowpass = this.context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3500; // Lower cutoff for warmer, soothing sound
    lowpass.Q.value = 0.5;

    // Mix dry/wet - increased wet for ethereal feel
    const dryGain = this.context.createGain();
    dryGain.gain.value = 0.4;
    const wetGain = this.context.createGain();
    wetGain.gain.value = 0.6;

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
    this.warbleLFO.frequency.value = 0.15; // Slightly faster drift
    this.warbleGain.gain.value = 10; 
    
    this.warbleLFO.connect(this.warbleGain);
    this.warbleLFO.start();

    // 4. Cheerful Pads (C Major 9 / Add9)
    // Higher register for ethereal feel
    const padFreqs = [
      261.63, // C4
      329.63, // E4
      392.00, // G4
      493.88, // B4 (Major 7th)
      587.33  // D5 (9th)
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

      // Gentle Breathing LFO - Faster breathing for "bouncing" feel
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (Math.random() * 0.2); // Slower, deeper breathing
      
      lfoGain.gain.value = 0.02 * gainScale; 
      oscGain.gain.value = 0.02 * gainScale; // Lower base volume for pads
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(this.bgmGain);

      osc.start();
      lfo.start();

      this.activeOscillators.push({ osc, gain: oscGain, lfo });
    };

    padFreqs.forEach((freq, index) => {
      createPad(freq, 'sine', 0.5);
    });

    // 5. Melody Loop (Wind Chimes / Droplets / Bouncing)
    // C Major Pentatonic extended
    const melodyNotes = [
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50, // C6
      1174.66, // D6
      1318.51  // E6
    ];

    // Simple Delay Line for bouncing effect
    const delayNode = this.context.createDelay();
    delayNode.delayTime.value = 0.33; // 330ms delay (triplet feel)
    const delayFeedback = this.context.createGain();
    delayFeedback.gain.value = 0.5;
    const delayFilter = this.context.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2500;

    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayFilter);
    delayFilter.connect(delayNode);
    delayNode.connect(this.bgmGain);

    const playMelodyNote = () => {
      if (!this.isBgmPlaying || !this.context || !this.bgmGain) return;

      const freq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      // Triangle for a bell-like tone
      osc.type = 'sine'; 
      osc.frequency.value = freq;
      
      // Envelope: Very fast attack, bouncy decay
      const now = this.context.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02); // Softer attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); // Longer, smoother decay

      osc.connect(gain);
      gain.connect(this.bgmGain);
      gain.connect(delayNode); // Send to delay

      if (this.warbleGain) this.warbleGain.connect(osc.detune);

      osc.start();
      osc.stop(now + 1.5);

      // Schedule next note - Faster, more random
      const nextTime = 1500 + Math.random() * 2500; // Much sparser
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
    this.noiseGain.gain.value = 0.001; // Even quieter
    
    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 9000; 
    
    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.bgmGain);
    this.noiseNode.start();
  }

  private stopBgm() {
    if (this.bgmGain) {
      const now = this.context!.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      setTimeout(() => {
        this.bgmGain?.disconnect();
        this.bgmGain = null;
      }, 1000);
    }

    this.activeOscillators.forEach(({ osc, gain, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];

    this.melodyTimeouts.forEach(t => clearTimeout(t));
    this.melodyTimeouts = [];

    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }

    this.isBgmPlaying = false;
    this.notify();
  }
}

export const audioManager = new SoundManager();
