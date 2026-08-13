// Web Audio API Synthesizer for instant zero-latency keyboard feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private soundProfile: "mechanical" | "soft" | "typewriter" | "retro" | "muted" = "mechanical";

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setSoundProfile(profile: "mechanical" | "soft" | "typewriter" | "retro" | "muted") {
    this.soundProfile = profile;
    this.isMuted = profile === "muted";
  }

  public getSoundProfile() {
    return this.soundProfile;
  }

  public playKeyPress(isSpace: boolean = false, isError: boolean = false) {
    if (this.isMuted || this.soundProfile === "muted") return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (isError) {
      // Play crisp low error blip
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
      return;
    }

    switch (this.soundProfile) {
      case "mechanical": {
        // High-end tactile mechanical switch click (Cherry MX Blue / Brown feel)
        const osc = this.ctx.createOscillator();
        const noiseGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "sine";
        const baseFreq = isSpace ? 320 : 650 + Math.random() * 80;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

        filter.type = "bandpass";
        filter.frequency.value = isSpace ? 1200 : 2800;
        filter.Q.value = 3;

        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
        break;
      }

      case "soft": {
        // Soft quiet membrane / laptop key cap sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(isSpace ? 240 : 420 + Math.random() * 40, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case "typewriter": {
        // Clacks like a vintage Remington typewriter
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(isSpace ? 180 : 850 + Math.random() * 150, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }

      case "retro": {
        // 8-bit retro arcade blip
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(isSpace ? 300 : 520, now);
        osc.frequency.setValueAtTime(isSpace ? 450 : 880, now + 0.02);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
    }
  }

  public playFinishChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 triumph chord

    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + idx * 0.07);

      gain.gain.setValueAtTime(0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.35);
    });
  }

  public playLaserShot() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }
}

export const soundEngine = new SoundEngine();
