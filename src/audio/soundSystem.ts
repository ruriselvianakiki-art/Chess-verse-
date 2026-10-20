/**
 * Procedural Web Audio API sound synthesizer for Chess Aura
 * Provides atmospheric background ambient piano chords & tactile sound effects
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicTimer: number | null = null;
  private chordIndex = 0;

  // Settings
  public musicEnabled = true;
  public sfxEnabled = true;
  public musicVolume = 0.35;
  public sfxVolume = 0.55;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.value = this.musicEnabled ? this.musicVolume : 0;
      this.musicGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
      this.sfxGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setTargetAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime, 0.05);
    }
    if (enabled && !this.isMusicPlaying) {
      this.startAmbientMusic();
    } else if (!enabled && this.isMusicPlaying) {
      this.stopAmbientMusic();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setTargetAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGainNode && this.ctx && this.musicEnabled) {
      this.musicGainNode.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGainNode && this.ctx && this.sfxEnabled) {
      this.sfxGainNode.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05);
    }
  }

  // --- Sound Effects ---

  public playMove() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio context might require user interaction first
    }
  }

  public playCapture() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;

      // Punchy impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.16);

      // Shimmer overlay
      const shimmer = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(880, now + 0.02);
      shimmer.frequency.exponentialRampToValueAtTime(440, now + 0.2);
      shimmerGain.gain.setValueAtTime(0.25, now + 0.02);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(this.sfxGainNode);
      shimmer.start(now + 0.02);
      shimmer.stop(now + 0.23);
    } catch {}
  }

  public playCheck() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      [440, 554.37].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        // Lowpass filter for deep urgent pulse
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, now);

        gain.gain.setValueAtTime(0.4, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.36);
      });
    } catch {}
  }

  public playSelect() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playVictory() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      // Majestic triumphant chord arpeggio: C4, E4, G4, C5, E5
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.35, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch {}
  }

  // --- Procedural Ambient Cosmic Piano Chords ---

  public startAmbientMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.playNextAmbientChord();
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playNextAmbientChord() {
    if (!this.isMusicPlaying) return;

    try {
      this.initContext();
      if (this.ctx && this.musicGainNode && this.musicEnabled) {
        // Aesthetic celestial chord progressions: Dm9 -> G13 -> Cmaj9 -> Am9
        const chords = [
          [146.83, 220.0, 261.63, 329.63, 440.0], // Dm9
          [196.0, 246.94, 329.63, 392.0, 493.88], // G13
          [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj9
          [110.0, 164.81, 220.0, 261.63, 329.63], // Am9
        ];

        const chord = chords[this.chordIndex % chords.length];
        this.chordIndex++;

        const now = this.ctx.currentTime;
        const chordDuration = 4.8; // 4.8 seconds per gentle chord

        chord.forEach((freq, i) => {
          if (!this.ctx || !this.musicGainNode) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);

          // Warm celestial soft lowpass
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800 + i * 200, now);

          // Gentle slow attack and long dreamy release
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.12 / Math.sqrt(chord.length), now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGainNode);

          osc.start(now + i * 0.08);
          osc.stop(now + chordDuration + 0.1);
        });
      }
    } catch {}

    // Schedule next chord
    this.musicTimer = window.setTimeout(() => {
      this.playNextAmbientChord();
    }, 4500);
  }
}

export const sound = new SoundSystem();
