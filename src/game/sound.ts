/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playCoinCollect(pitchOffset = 0) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 987.77 + pitchOffset; // Crisp metallic gold coin ping (B5 pitch base)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.07);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playBlocked() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Gentle, subtle wooden thud indicating limit reached / no more balls right now
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.11);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  playPopBurst() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playBallClink() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = 1200 + Math.random() * 400;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playDropHole(holeIndex: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Notes go up in pitch as holes fill (440 -> 554 -> 659)
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    const f = freqs[Math.min(holeIndex, 2)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playBrickClear() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  playPowerup() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playWin() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      [523.25, 659.25, 783.99], // C
      [587.33, 739.99, 880.0],  // D
      [659.25, 830.61, 987.77], // E
      [1046.5, 1318.5, 1567.98], // High C
    ];

    const now = this.ctx.currentTime;
    chords.forEach((chord, i) => {
      const chordTime = now + i * 0.16;
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        gain.gain.setValueAtTime(0.18, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(chordTime);
        osc.stop(chordTime + 0.4);
      });
    });
  }

  private lastSquishTime = 0;
  private lastGrumbleTime = 0;
  private lastWinkTime = 0;

  /**
   * Fluffy "Weee!" upward vocal chirp when popping into the air.
   * Plays a cheerful pentatonic vocal note with formant filtering.
   */
  playFluffyLaunch(noteIndex: number = 0) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const pentatonic = [587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];
    const baseFreq = pentatonic[Math.abs(noteIndex) % pentatonic.length];

    const osc = this.ctx.createOscillator();
    const formant = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Glides upward ("Weee!")
    osc.frequency.setValueAtTime(baseFreq * 0.85, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.11);

    // Vocal formant for cute "ee" vowel (~2600Hz)
    formant.type = 'peaking';
    formant.frequency.setValueAtTime(2600, now);
    formant.Q.setValueAtTime(3.5, now);
    formant.gain.setValueAtTime(6, now);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(formant);
    formant.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Fluffy "Boing / Oof!" cute squishy bounce when landing on funnel walls or floor.
   * Throttled to prevent audio clutter.
   */
  playFluffySquish() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastSquishTime < 0.09) return;
    this.lastSquishTime = now;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Rubber-squish bounce curve: dips down then slightly recovers
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.09);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, now);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Fluffy "Humph! / Grrr" tiny cute grumpy vocal murmur when waiting too long.
   */
  playFluffyGrumble() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastGrumbleTime < 1.8) return;
    this.lastGrumbleTime = now;

    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    // Cute tiny comic angry vibrato
    mod.type = 'sine';
    mod.frequency.setValueAtTime(28, now);
    modGain.gain.setValueAtTime(20, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(230, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    mod.connect(modGain);
    modGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    mod.start(now);
    osc.start(now);
    mod.stop(now + 0.16);
    osc.stop(now + 0.16);
  }

  /**
   * Fluffy "Yaaay!" bright cheerful vocal chime when dropping into bucket socket.
   */
  playFluffyCheer(holeIndex: number = 0) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const holeNotes = [
      { start: 587.33, end: 880.0 },   // Hole 0: D5 -> A5
      { start: 659.25, end: 1046.5 },  // Hole 1: E5 -> C6
      { start: 783.99, end: 1318.51 }, // Hole 2: G5 -> E6
    ];
    const { start, end } = holeNotes[Math.min(2, Math.max(0, holeIndex))];

    // Vocal voice
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + 0.14);

    filter.type = 'peaking';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(2.5, now);
    filter.gain.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);

    // Sparkle harmonic overtone
    const bell = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(end * 1.5, now);

    bellGain.gain.setValueAtTime(0.12, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    bell.connect(bellGain);
    bellGain.connect(this.ctx.destination);

    bell.start(now);
    bell.stop(now + 0.18);
  }

  /**
   * Fluffy "Bloop!" sweet soft wink pop on the conveyor.
   */
  playFluffyWink() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastWinkTime < 0.6) return;
    this.lastWinkTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(1420, now + 0.045);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }
}

export const sounds = new SoundSystem();
