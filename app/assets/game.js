(() => {
  var _t = Object.defineProperty,
    Xt = Object.defineProperties;
  var Yt = Object.getOwnPropertyDescriptors;
  var et = Object.getOwnPropertySymbols;
  var Jt = Object.prototype.hasOwnProperty,
    Qt = Object.prototype.propertyIsEnumerable;
  var Re = (e, n, t) =>
      n in e
        ? _t(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t })
        : (e[n] = t),
    L = (e, n) => {
      for (var t in n || (n = {})) Jt.call(n, t) && Re(e, t, n[t]);
      if (et) for (var t of et(n)) Qt.call(n, t) && Re(e, t, n[t]);
      return e;
    },
    R = (e, n) => Xt(e, Yt(n));
  var C = (e, n, t) => Re(e, typeof n != "symbol" ? n + "" : n, t);
  var Zt = [
      [0, 2, 3, 5, 7, 8, 10],
      [0, 2, 4, 7, 9],
      [0, 1, 4, 5, 7, 8, 11],
      [0, 2, 4, 6, 7, 9, 11],
    ],
    ae = [
      {
        id: "epic",
        label: "Anh h\xF9ng ca",
        scale: [0, 2, 3, 5, 7, 8, 10],
        bpm: 124,
        kick: "four",
        snare: "backbeat",
        hat: "offbeat",
        bass: { wave: "sawtooth", rate: 2, gain: 0.3 },
        pad: { wave: "sawtooth", gain: 0.045 },
        arp: { wave: "square", gain: 0.06, rate: 1 },
        lead: {
          wave: "sawtooth",
          gain: 0.09,
          detune: 0.006,
          motif: [0, -1, 2, -1, 4, -1, 2, -1, 7, -1, 6, 4, 2, -1, 4, -1],
        },
        prog: [0, 5, 3, 4],
      },
      {
        id: "chiptune",
        label: "Chiptune 8-bit",
        scale: [0, 2, 4, 7, 9],
        bpm: 156,
        kick: "half",
        snare: "backbeat",
        hat: "sixteenth",
        bass: { wave: "triangle", rate: 2, gain: 0.4 },
        pad: null,
        arp: { wave: "square", gain: 0.08, rate: 1 },
        lead: {
          wave: "square",
          gain: 0.1,
          detune: 0,
          motif: [0, 2, 4, 2, 7, -1, 4, 2, 0, -1, 2, 4, 7, 9, 7, -1],
        },
        prog: [0, 3, 4, 0],
      },
      {
        id: "edm",
        label: "EDM Festival",
        scale: [0, 2, 4, 5, 7, 9, 11],
        bpm: 128,
        kick: "four",
        snare: "sparse",
        hat: "offbeat",
        bass: { wave: "sawtooth", rate: 2, gain: 0.34 },
        pad: { wave: "sawtooth", gain: 0.06 },
        arp: { wave: "sawtooth", gain: 0.05, rate: 1 },
        lead: {
          wave: "sawtooth",
          gain: 0.12,
          detune: 0.012,
          motif: [4, -1, 4, 5, 7, -1, 7, -1, 9, -1, 7, 5, 4, -1, 2, -1],
        },
        prog: [5, 3, 0, 4],
      },
      {
        id: "rock",
        label: "Rock m\u1EA1nh",
        scale: [0, 1, 3, 5, 7, 8, 10],
        bpm: 146,
        kick: "double",
        snare: "backbeat",
        hat: "sixteenth",
        bass: { wave: "sawtooth", rate: 4, gain: 0.34 },
        pad: null,
        arp: null,
        lead: {
          wave: "square",
          gain: 0.1,
          detune: 0.004,
          motif: [0, -1, 0, 1, 0, -1, 3, -1, 4, -1, 3, -1, 1, -1, 0, -1],
        },
        prog: [0, 0, 5, 6],
      },
      {
        id: "cinematic",
        label: "\u0110i\u1EC7n \u1EA3nh",
        scale: [0, 2, 3, 5, 7, 8, 11],
        bpm: 92,
        kick: "sparse",
        snare: "none",
        hat: "none",
        bass: { wave: "sine", rate: 2, gain: 0.45 },
        pad: { wave: "sawtooth", gain: 0.07 },
        arp: null,
        lead: {
          wave: "sawtooth",
          gain: 0.1,
          detune: 0.008,
          motif: [0, -1, -1, -1, 4, -1, -1, 3, 2, -1, -1, -1, 7, -1, 6, -1],
        },
        prog: [0, 5, 2, 4],
      },
      {
        id: "synthwave",
        label: "Synthwave",
        scale: [0, 2, 3, 5, 7, 8, 10],
        bpm: 108,
        kick: "four",
        snare: "backbeat",
        hat: "sixteenth",
        bass: { wave: "sawtooth", rate: 4, gain: 0.3 },
        pad: { wave: "square", gain: 0.04 },
        arp: { wave: "sawtooth", gain: 0.06, rate: 2 },
        lead: {
          wave: "square",
          gain: 0.08,
          detune: 0.01,
          motif: [4, -1, -1, 4, 5, -1, 7, -1, 9, -1, -1, 7, 5, -1, 4, -1],
        },
        prog: [0, 5, 2, 6],
      },
      {
        id: "lofi",
        label: "Lofi th\u01B0 gi\xE3n",
        scale: [0, 2, 3, 5, 7, 9, 10],
        bpm: 82,
        kick: "half",
        snare: "backbeat",
        hat: "swing",
        bass: { wave: "triangle", rate: 2, gain: 0.45 },
        pad: { wave: "triangle", gain: 0.09 },
        arp: null,
        lead: {
          wave: "triangle",
          gain: 0.14,
          detune: 0.003,
          motif: [0, -1, 2, -1, -1, 4, -1, 2, 3, -1, -1, 2, 0, -1, -1, -1],
        },
        prog: [1, 4, 0, 5],
      },
      {
        id: "oriental",
        label: "Ph\u01B0\u01A1ng \u0110\xF4ng",
        scale: [0, 2, 4, 7, 9],
        bpm: 104,
        kick: "sparse",
        snare: "sparse",
        hat: "swing",
        bass: { wave: "triangle", rate: 2, gain: 0.4 },
        pad: { wave: "triangle", gain: 0.07 },
        arp: { wave: "triangle", gain: 0.12, rate: 1 },
        lead: {
          wave: "sawtooth",
          gain: 0.07,
          detune: 0.004,
          motif: [0, 2, 4, -1, 7, -1, 4, 2, 4, -1, 2, 0, -1, -1, 2, -1],
        },
        prog: [0, 2, 3, 0],
      },
    ],
    tt = [
      { id: "auto", label: "T\u1EF1 \u0111\u1ED9ng theo c\u1EA3nh" },
      { id: "random", label: "Ng\u1EABu nhi\xEAn m\u1ED7i m\xE0n" },
      ...ae.map((e) => ({ id: e.id, label: e.label })),
    ];
  function en(e) {
    let n = 2166136261;
    for (let t = 0; t < e.length; t++)
      n = Math.imul(n ^ e.charCodeAt(t), 16777619);
    return n >>> 0;
  }
  var _ = (e) => 440 * Math.pow(2, (e - 69) / 12),
    ge = class {
      constructor() {
        C(this, "ctx", null);
        C(this, "master", null);
        C(this, "external", null);
        C(this, "sfxBus", null);
        C(this, "musicBus", null);
        C(this, "noise", null);
        C(this, "muted", !1);
        C(this, "musicVol", 0.5);
        C(this, "sfxVol", 0.8);
        C(this, "timer", 0);
        C(this, "step", 0);
        C(this, "nextTime", 0);
        C(this, "theme", {
          root: 50,
          scale: Zt[0],
          bpm: 112,
          seed: 1,
          style: ae[0],
        });
        C(this, "styleChoice", "auto");
        C(this, "lastSceneryId", "x");
        C(this, "lastStage", 0);
        C(this, "intensity", 0);
        C(this, "lastPlayed", {});
      }
      unlock() {
        if (typeof window != "undefined") {
          if (!this.ctx) {
            if (this.external) this.ctx = this.external;
            else {
              let l = window.AudioContext || window.webkitAudioContext;
              if (!l) return;
              this.ctx = new l();
            }
            ((this.master = this.ctx.createGain()),
              (this.master.gain.value = this.muted ? 0 : 1));
            let n = this.ctx.createDynamicsCompressor();
            (this.master.connect(n).connect(this.ctx.destination),
              (this.sfxBus = this.ctx.createGain()),
              (this.sfxBus.gain.value = this.sfxVol),
              this.sfxBus.connect(this.master),
              (this.musicBus = this.ctx.createGain()),
              (this.musicBus.gain.value = this.musicVol * 0.75),
              this.musicBus.connect(this.master));
            let t = this.ctx.createDelay(1);
            t.delayTime.value = 0.28;
            let a = this.ctx.createGain();
            a.gain.value = 0.38;
            let i = this.ctx.createGain();
            i.gain.value = 0.35;
            let r = this.ctx.createBiquadFilter();
            ((r.type = "lowpass"),
              (r.frequency.value = 2600),
              this.musicBus.connect(t),
              t.connect(r).connect(a).connect(t),
              r.connect(i).connect(this.master));
            let s = this.ctx.sampleRate;
            this.noise = this.ctx.createBuffer(1, s, this.ctx.sampleRate);
            let o = this.noise.getChannelData(0);
            for (let l = 0; l < s; l++) o[l] = Math.random() * 2 - 1;
          }
          !this.external && this.ctx.state === "suspended" && this.ctx.resume();
        }
      }
      useOffline(n) {
        ((this.external = n), this.unlock());
      }
      pump() {
        this.schedule();
      }
      get isMuted() {
        return this.muted;
      }
      setMuted(n) {
        ((this.muted = n),
          this.master &&
            this.ctx &&
            this.master.gain.setTargetAtTime(
              n ? 0 : 1,
              this.ctx.currentTime,
              0.05,
            ));
      }
      setMusicVolume(n) {
        ((this.musicVol = n),
          this.musicBus &&
            this.ctx &&
            this.musicBus.gain.setTargetAtTime(
              n * 0.75,
              this.ctx.currentTime,
              0.05,
            ));
      }
      setSfxVolume(n) {
        ((this.sfxVol = n),
          this.sfxBus &&
            this.ctx &&
            this.sfxBus.gain.setTargetAtTime(n, this.ctx.currentTime, 0.05));
      }
      setStyle(n) {
        n !== this.styleChoice &&
          ((this.styleChoice = n),
          this.setTheme(this.lastSceneryId, this.lastStage));
      }
      setTheme(n, t) {
        var r;
        ((this.lastSceneryId = n), (this.lastStage = t));
        let a = en(n),
          i =
            this.styleChoice === "auto"
              ? ae[a % ae.length]
              : this.styleChoice === "random"
                ? ae[Math.floor(Math.random() * ae.length)]
                : (r = ae.find((s) => s.id === this.styleChoice)) != null
                  ? r
                  : ae[0];
        ((this.theme = {
          root: 43 + (a % 12),
          scale: i.scale,
          bpm: i.bpm + Math.min(16, t * 3),
          seed: a || 1,
          style: i,
        }),
          (this.step = 0));
      }
      setIntensity(n) {
        this.intensity = Math.max(0, Math.min(1, n));
      }
      startMusic() {
        if (!(this.timer || !this.ctx)) {
          if (((this.nextTime = this.ctx.currentTime + 0.1), this.external)) {
            this.timer = -1;
            return;
          }
          this.timer = window.setInterval(() => this.schedule(), 80);
        }
      }
      stopMusic() {
        (this.timer > 0 && clearInterval(this.timer), (this.timer = 0));
      }
      dispose() {
        var n;
        (this.stopMusic(),
          this.external || (n = this.ctx) == null || n.close(),
          (this.ctx = null));
      }
      schedule() {
        let n = this.ctx;
        if (!n) return;
        let a = 60 / this.theme.bpm / 4;
        for (; this.nextTime < n.currentTime + 0.3;)
          (this.playStep(this.step, this.nextTime, a),
            this.step++,
            (this.nextTime += a));
      }
      rnd(n) {
        let t = (this.theme.seed + n * 374761393) >>> 0;
        return (
          (t = Math.imul(t ^ (t >>> 13), 1274126177)),
          ((t ^ (t >>> 16)) >>> 0) / 4294967296
        );
      }
      playStep(n, t, a) {
        let i = this.theme,
          r = i.style,
          s = Math.floor(n / 16),
          o = n % 16,
          l = this.intensity,
          u = r.prog[s % 4],
          c = (f) => {
            let p = i.scale.length,
              w = Math.floor(f / p);
            return i.scale[((f % p) + p) % p] + w * 12;
          },
          h = i.root + c(u),
          m = s % 8 === 7;
        ((r.kick === "four"
          ? o % 4 === 0
          : r.kick === "half"
            ? o === 0 || o === 8 || (l > 0.6 && o === 10)
            : r.kick === "double"
              ? o % 4 === 0 || o === 6 || o === 14
              : o === 0 || (o === 10 && s % 2 === 1)) && this.kick(t),
          l > 0.5 &&
            r.kick !== "sparse" &&
            (o === 7 || o === 15) &&
            this.kick(t),
          r.snare === "backbeat" && (o === 4 || o === 12)
            ? this.snare(t, 0.75)
            : r.snare === "sparse" && o === 12 && this.snare(t, 0.5),
          r.snare !== "none" &&
            m &&
            o >= 8 &&
            o % 2 === 0 &&
            this.snare(t, 0.3 + (o - 8) * 0.06),
          r.hat === "offbeat"
            ? o % 4 === 2
              ? this.hat(t, 0.4)
              : l > 0.2 && o % 2 === 1 && this.hat(t, 0.14)
            : r.hat === "sixteenth"
              ? this.hat(t, o % 4 === 2 ? 0.4 : 0.15)
              : r.hat === "swing" &&
                (o % 4 === 0 || o % 4 === 3) &&
                this.hat(t, o % 4 === 3 ? 0.18 : 0.28));
        let k = 16 / (r.bass.rate * 2);
        if (o % k === 0) {
          let f = o % (k * 2) !== 0;
          (this.tone(
            _(h - 12 + (f ? 12 : 0)),
            t,
            a * k * 0.9,
            r.bass.wave,
            r.bass.gain,
            420 + l * 500,
          ),
            this.tone(_(h - 24), t, a * k * 0.9, "sine", 0.35, 300));
        }
        if (r.pad && o === 0)
          for (let f of [0, 2, 4, 6]) {
            let p = _(i.root + 12 + c(u + f));
            (this.tone(p * 1.004, t, a * 15, r.pad.wave, r.pad.gain, 1800),
              this.tone(p * 0.996, t, a * 15, r.pad.wave, r.pad.gain, 1800));
          }
        if (r.arp && o % r.arp.rate === 0) {
          let f = [0, 2, 4, 7, 4, 2, 7, 9][((o / r.arp.rate) % 8) | 0];
          this.tone(
            _(i.root + 24 + c(u + f)),
            t,
            a * 1.3 * r.arp.rate,
            r.arp.wave,
            r.arp.gain + l * 0.03,
            3200,
          );
        }
        let g = r.lead.motif,
          S = (s % 2 === 0 ? g : g.map((f) => (f < 0 ? f : f + 2)))[o];
        if (S >= 0 && (s % 4 >= 1 || l > 0.3)) {
          let f = i.root + 24 + c(u + S),
            p = a * (o % 4 === 0 ? 3.2 : 1.8),
            w = r.lead.detune;
          (this.tone(_(f) * (1 + w), t, p, r.lead.wave, r.lead.gain, 3800),
            w > 0 &&
              this.tone(_(f) * (1 - w), t, p, r.lead.wave, r.lead.gain, 3800),
            this.tone(_(f - 12), t, p, "triangle", r.lead.gain * 1.1, 2e3));
        }
        (m &&
          o === 0 &&
          r.hat !== "none" &&
          this.noiseBurst(t, a * 16, 0.28, "bandpass", 400, this.musicBus, 6e3),
          s % 8 === 0 &&
            o === 0 &&
            s > 0 &&
            (this.tone(_(i.root - 12), t, a * 8, "sine", 0.6, 200),
            this.noiseBurst(t, 0.9, 0.3, "highpass", 3e3, this.musicBus)));
      }
      tone(n, t, a, i, r, s = 4e3, o) {
        let l = this.ctx;
        if (!l) return;
        let u = l.createOscillator(),
          c = l.createGain(),
          h = l.createBiquadFilter();
        ((h.type = "lowpass"),
          (h.frequency.value = s),
          (u.type = i),
          (u.frequency.value = n),
          c.gain.setValueAtTime(1e-4, t),
          c.gain.linearRampToValueAtTime(r, t + 0.01),
          c.gain.exponentialRampToValueAtTime(1e-4, t + a),
          u
            .connect(h)
            .connect(c)
            .connect(o != null ? o : this.musicBus),
          u.start(t),
          u.stop(t + a + 0.05));
      }
      kick(n) {
        let t = this.ctx,
          a = t.createOscillator(),
          i = t.createGain();
        (a.frequency.setValueAtTime(150, n),
          a.frequency.exponentialRampToValueAtTime(40, n + 0.12),
          i.gain.setValueAtTime(0.9, n),
          i.gain.exponentialRampToValueAtTime(1e-4, n + 0.2),
          a.connect(i).connect(this.musicBus),
          a.start(n),
          a.stop(n + 0.25));
      }
      noiseBurst(n, t, a, i, r, s, o) {
        let l = this.ctx,
          u = l.createBufferSource();
        u.buffer = this.noise;
        let c = l.createBiquadFilter();
        ((c.type = i),
          c.frequency.setValueAtTime(r, n),
          o && c.frequency.exponentialRampToValueAtTime(o, n + t));
        let h = l.createGain();
        (h.gain.setValueAtTime(a, n),
          h.gain.exponentialRampToValueAtTime(1e-4, n + t),
          u.connect(c).connect(h).connect(s),
          u.start(n, Math.random() * 0.5),
          u.stop(n + t + 0.05));
      }
      snare(n, t) {
        (this.noiseBurst(n, 0.14, t * 0.5, "highpass", 1500, this.musicBus),
          this.tone(190, n, 0.08, "triangle", t * 0.4, 3e3));
      }
      hat(n, t) {
        this.noiseBurst(n, 0.04, t * 0.5, "highpass", 7e3, this.musicBus);
      }
      slide(n, t, a, i, r, s = 0) {
        let o = this.ctx,
          l = o.currentTime + s,
          u = o.createOscillator(),
          c = o.createGain();
        ((u.type = i),
          u.frequency.setValueAtTime(n, l),
          u.frequency.exponentialRampToValueAtTime(Math.max(20, t), l + a),
          c.gain.setValueAtTime(r, l),
          c.gain.exponentialRampToValueAtTime(1e-4, l + a),
          u.connect(c).connect(this.sfxBus),
          u.start(l),
          u.stop(l + a + 0.05));
      }
      play(n, t = 1) {
        var l, u;
        let a = this.ctx;
        if (!a || !this.sfxBus || this.muted) return;
        let i = a.currentTime,
          s =
            (l = {
              shoot: 0.06,
              hit: 0.05,
              coin: 0.04,
              sunHit: 0.08,
              kill: 0.05,
            }[n]) != null
              ? l
              : 0;
        if (i - ((u = this.lastPlayed[n]) != null ? u : -1) < s) return;
        this.lastPlayed[n] = i;
        let o = this.sfxBus;
        switch (n) {
          case "jump":
            this.slide(280, 620, 0.16, "square", 0.14);
            break;
          case "jump2":
            this.slide(420, 900, 0.14, "square", 0.14);
            break;
          case "shoot":
            this.slide(900 + Math.random() * 200, 220, 0.09, "sawtooth", 0.09);
            break;
          case "hit":
            this.noiseBurst(i, 0.08, 0.25, "bandpass", 1800, o);
            break;
          case "kill":
            (this.noiseBurst(i, 0.3, 0.45, "lowpass", 2500, o, 200),
              this.slide(400, 90, 0.25, "sawtooth", 0.15));
            break;
          case "coin": {
            let c = 988 + Math.min(t, 8) * 40;
            (this.tone(c, i, 0.1, "square", 0.1, 6e3, o),
              this.tone(c * 1.5, i + 0.06, 0.18, "square", 0.1, 6e3, o));
            break;
          }
          case "powerup":
            [523, 659, 784, 1047].forEach((c, h) =>
              this.tone(c, i + h * 0.07, 0.2, "triangle", 0.2, 5e3, o),
            );
            break;
          case "gun":
            [392, 523, 659, 784, 1047, 1319].forEach((c, h) =>
              this.tone(c, i + h * 0.06, 0.22, "square", 0.12, 5e3, o),
            );
            break;
          case "heal":
            [659, 880, 1175].forEach((c, h) =>
              this.tone(c, i + h * 0.09, 0.3, "sine", 0.22, 5e3, o),
            );
            break;
          case "hurt":
            (this.slide(300, 80, 0.3, "sawtooth", 0.28),
              this.noiseBurst(i, 0.2, 0.3, "lowpass", 1200, o));
            break;
          case "dead":
            (this.slide(440, 55, 1.2, "sawtooth", 0.28),
              this.slide(330, 40, 1.4, "square", 0.15, 0.1),
              this.noiseBurst(i, 0.8, 0.3, "lowpass", 800, o, 100));
            break;
          case "sunHit":
            (this.noiseBurst(i, 0.1, 0.3, "bandpass", 1e3, o),
              this.tone(180, i, 0.1, "triangle", 0.25, 1500, o));
            break;
          case "sunDie":
            (this.noiseBurst(i, 2.2, 0.7, "lowpass", 5e3, o, 60),
              this.slide(220, 30, 2.2, "sawtooth", 0.35),
              [523, 659, 784, 1047, 1319, 1568].forEach((c, h) =>
                this.tone(c, i + 1.6 + h * 0.1, 0.5, "triangle", 0.2, 6e3, o),
              ));
            break;
          case "whoosh":
            this.noiseBurst(i, 1.1, 0.3, "bandpass", 300, o, 3500);
            break;
          case "stage":
            [392, 494, 587, 784].forEach((c, h) =>
              this.tone(c, i + h * 0.12, 0.45, "sawtooth", 0.14, 3e3, o),
            );
            break;
          case "event":
            (this.slide(200, 400, 0.4, "sawtooth", 0.2),
              this.slide(205, 405, 0.4, "sawtooth", 0.2));
            break;
          case "roar":
            (this.slide(140, 60, 0.8, "sawtooth", 0.3),
              this.noiseBurst(i, 0.8, 0.3, "lowpass", 900, o, 150));
            break;
          case "meteor":
            (this.noiseBurst(i, 0.9, 0.45, "lowpass", 3e3, o, 120),
              this.slide(160, 45, 0.7, "triangle", 0.4));
            break;
          case "lightning":
            (this.noiseBurst(i, 0.5, 0.6, "highpass", 2500, o, 800),
              this.slide(1800, 100, 0.35, "sawtooth", 0.2));
            break;
          case "combo": {
            let c = Math.min(t, 12);
            (this.tone(_(72 + c), i, 0.2, "square", 0.12, 5e3, o),
              this.tone(_(79 + c), i + 0.05, 0.2, "square", 0.1, 5e3, o));
            break;
          }
          case "levelUp": {
            let L2 = Math.min(20, t),
              nn = 3 + (L2 >> 2),
              base = 440 * Math.pow(1.0595, Math.min(12, L2)),
              ratios = [1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4];
            for (let k = 0; k < nn; k++) {
              this.tone(base * ratios[k], i + k * 0.07, 0.35, "triangle", 0.2, 6e3, o);
              L2 >= 10 && this.tone(base * ratios[k] * 2, i + k * 0.07, 0.3, "sawtooth", 0.05, 7e3, o);
            }
            if (L2 >= 10) {
              this.slide(140, 45, 0.9, "sine", 0.4);
              this.noiseBurst(i, 0.6, 0.25, "highpass", 3e3, o, 800);
            }
            if (L2 >= 16) this.noiseBurst(i, 1.4, 0.35, "bandpass", 500, o, 5e3);
            break;
          }
          case "grenadeShoot":
            this.slide(200, 55, 0.2, "square", 0.35);
            this.noiseBurst(i, 0.14, 0.5, "lowpass", 1800, o, 300);
            this.slide(1100, 250, 0.08, "sawtooth", 0.1, 0.02);
            break;
          case "boom1":
            this.noiseBurst(i, 0.8, 0.85, "lowpass", 3400, o, 110);
            this.slide(140, 34, 0.65, "sine", 0.6);
            break;
          case "planeFly":
            this.slide(115, 92, 3.4, "sawtooth", 0.1);
            this.slide(118, 96, 3.4, "sawtooth", 0.1);
            this.noiseBurst(i, 3.4, 0.14, "bandpass", 260, o, 700);
            break;
          case "bombFall":
            this.slide(2400, 320, 0.85, "sine", 0.11);
            break;
          case "boom2":
            this.noiseBurst(i, 1.1, 0.95, "lowpass", 4200, o, 90);
            this.slide(120, 28, 0.95, "sine", 0.7);
            this.slide(300, 50, 0.5, "sawtooth", 0.2);
            break;
          case "missileLock":
            [0, 0.14, 0.28].forEach((d) => this.tone(1500, i + d, 0.09, "square", 0.14, 6e3, o));
            this.tone(1900, i + 0.45, 0.35, "square", 0.12, 6e3, o);
            break;
          case "missileLaunch":
            this.noiseBurst(i, 1.5, 0.7, "bandpass", 500, o, 4500);
            this.slide(110, 520, 1.1, "sawtooth", 0.2);
            break;
          case "boom3":
            this.noiseBurst(i, 1.8, 1, "lowpass", 5200, o, 60);
            this.slide(95, 22, 1.6, "sine", 0.85);
            this.slide(320, 40, 1.1, "sawtooth", 0.3);
            this.noiseBurst(i + 0.18, 1.2, 0.5, "lowpass", 1400, o, 70);
            break;
          case "nukeSiren":
            for (let k = 0; k < 8; k++) this.tone(k % 2 ? 640 : 900, i + k * 0.4, 0.42, "sawtooth", 0.2, 2800, o);
            this.noiseBurst(i, 3.2, 0.2, "lowpass", 200, o, 120);
            break;
          case "nukeWhistle":
            this.slide(3200, 160, 3.4, "sine", 0.15);
            this.slide(60, 160, 3.4, "sawtooth", 0.14);
            break;
          case "nukeBoom":
            this.noiseBurst(i, 4.5, 1, "lowpass", 9e3, o, 40);
            this.slide(70, 16, 4, "sine", 1);
            this.slide(52, 14, 4.5, "sine", 0.8, 0.1);
            this.slide(260, 30, 2.4, "sawtooth", 0.35);
            this.noiseBurst(i + 0.35, 3.5, 0.6, "lowpass", 1800, o, 60);
            this.tone(2200, i + 0.5, 2.6, "sine", 0.05, 6e3, o);
            [196, 247, 294].forEach((f, k) => this.tone(f, i + 1.6 + k * 0.25, 2.2, "triangle", 0.18, 3e3, o));
            break;
          case "respawn":
            [262, 330, 392, 523].forEach((c, h) =>
              this.tone(c, i + h * 0.1, 0.3, "triangle", 0.2, 4e3, o),
            );
            break;
        }
      }
    };
  var be = (e) => ({
      moods: [
        "calm",
        "calm",
        "annoyed",
        "annoyed",
        "enraged",
        "enraged",
        "evil",
      ].map((n) => `bosses/${e}-${n}.webp`),
      spit: `bosses/${e}-spit.webp`,
    }),
    De = (e) => ({
      moods: [
        "happy",
        "calm",
        "annoyed",
        "irritated",
        "enraged",
        "furious",
        "evil",
      ].map((n) => `bosses/${e}-${n}.webp`),
      spit: `bosses/${e}-spit.webp`,
    }),
    F = [
      {
        id: "sun",
        label: "M\u1EB7t tr\u1EDDi",
        moods: [
          "sun-happy",
          "calm-sun",
          "sun-annoyed",
          "sun-irritated",
          "sun-enraged",
          "sun-furious",
          "sun-evil",
        ].map((e) => `sun/${e}.webp`),
        spit: "sun/sun-spit.webp",
        glow: [255, 190, 70],
        boltStyle: "lightning",
        orbKind: "fire",
        pools: [["bolt", "bolt", "spit"], ["barrage"], ["sweep", "barrage"]],
      },
      R(L({ id: "moon", label: "M\u1EB7t tr\u0103ng" }, De("moon")), {
        glow: [170, 215, 255],
        boltStyle: "beam",
        orbKind: "ice",
        pools: [
          ["meteor", "beam", "spit"],
          ["meteor", "beam"],
          ["sweep", "meteor"],
        ],
      }),
      R(L({ id: "cloud", label: "M\xE2y b\xE3o" }, De("cloud")), {
        glow: [255, 225, 90],
        boltStyle: "lightning",
        orbKind: "spark",
        pools: [
          ["rain", "bolt", "hail"],
          ["barrage", "hail"],
          ["rain", "sweep"],
        ],
      }),
      R(L({ id: "planet", label: "H\xE0nh tinh t\xEDm" }, De("planet")), {
        glow: [225, 110, 255],
        boltStyle: "shock",
        orbKind: "plasma",
        pools: [
          ["orbs", "shock", "spit"],
          ["meteor", "shock"],
          ["orbs", "sweep"],
        ],
      }),
      R(
        L(
          { id: "dragon", label: "R\u1ED3ng h\u1ECFa ng\u1EE5c" },
          be("dragon"),
        ),
        {
          glow: [255, 80, 30],
          boltStyle: "inferno",
          orbKind: "lava",
          pools: [
            ["fan", "bolt", "spit"],
            ["barrage", "pincer"],
            ["nova", "sweep", "fan"],
          ],
        },
      ),
      R(L({ id: "reaper", label: "T\u1EED th\u1EA7n" }, be("reaper")), {
        glow: [90, 255, 140],
        boltStyle: "soul",
        orbKind: "soul",
        pools: [
          ["orbs", "pincer", "bolt"],
          ["rain", "fan"],
          ["nova", "pincer", "sweep"],
        ],
      }),
      R(L({ id: "mecha", label: "Robot t\u1EADn th\u1EBF" }, be("mecha")), {
        glow: [255, 60, 60],
        boltStyle: "laser",
        orbKind: "missile",
        pools: [
          ["beam", "meteor", "spit"],
          ["sweep", "fan", "pincer"],
          ["nova", "rain", "beam"],
        ],
      }),
      R(L({ id: "kraken", label: "H\u1EA3i qu\xE1i Kraken" }, be("kraken")), {
        glow: [40, 220, 220],
        boltStyle: "rain",
        orbKind: "ice",
        pools: [
          ["rain", "orbs", "spit"],
          ["pincer", "hail", "fan"],
          ["nova", "rain", "pincer", "sweep"],
        ],
      }),
      R(L({ id: "demon", label: "Ch\xFAa qu\u1EF7" }, be("demon")), {
        glow: [190, 60, 255],
        boltStyle: "inferno",
        orbKind: "plasma",
        pools: [
          ["fan", "orbs", "bolt"],
          ["barrage", "pincer", "meteor"],
          ["nova", "sweep", "fan", "beam"],
        ],
      }),
      R(L({ id: "pharaoh", label: "Pharaoh Anubis" }, be("pharaoh")), {
        glow: [255, 215, 70],
        boltStyle: "shock",
        orbKind: "soul",
        pools: [
          ["orbs", "shock", "spit"],
          ["beam", "pincer", "rain"],
          ["nova", "sweep", "beam", "meteor"],
        ],
      }),
    ],
    Pe = "random";
  function X(e) {
    var n;
    return (n = F.find((t) => t.id === e)) != null ? n : F[0];
  }
  var Ge = "game/";
  async function nt() {
    return await (await fetch(`${Ge}manifest.json`)).json();
  }
  var ze = ["mount", "monster", "scenery", "boss"];
  var W = class extends Error {
    constructor(t) {
      var a;
      super(
        (a = t[0]) != null
          ? a
          : "G\xF3i d\u1EEF li\u1EC7u kh\xF4ng h\u1EE3p l\u1EC7",
      );
      C(this, "issues");
      this.issues = t;
    }
  };
  var Ke = "packs.php",
    tn = "packs/files/",
    Oe = () => "";
  function ot(e) {
    Oe = e;
  }
  var Ce = new Map(),
    Ne = new Map();
  function Ie(e, n) {
    let t = Ne.get(n);
    return t ? (e === "en" ? t.en : t.vi) : null;
  }
  async function rt(e) {
    try {
      let n = await e.json();
      if (Array.isArray(n == null ? void 0 : n.issues) && n.issues.length)
        return n.issues.map(String);
    } catch (n) {}
    return [`Server tr\u1EA3 v\u1EC1 l\u1ED7i ${e.status}.`];
  }
  async function nn() {
    var e;
    try {
      let n = await fetch(Ke, { cache: "no-store" });
      return n.ok ? ((e = (await n.json()).packs) != null ? e : []) : [];
    } catch (n) {
      return [];
    }
  }
  async function it(e, n) {
    if (!/\.zip$/i.test(e.name))
      throw new W([`"${e.name}" kh\xF4ng ph\u1EA3i file .zip.`]);
    if (e.size > 52428800)
      throw new W([
        `File qu\xE1 l\u1EDBn (${(e.size / 1048576).toFixed(1)}MB). Gi\u1EDBi h\u1EA1n ${52428800 / 1048576}MB.`,
      ]);
    let t = new FormData();
    t.set("file", e);
    let a;
    try {
      a = await fetch(`${Ke}?type=${n}`, {
        method: "POST",
        body: t,
        headers: { "X-Password": Oe() },
      });
    } catch (i) {
      throw new W([
        "Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c t\u1EDBi server. H\xE3y th\u1EED l\u1EA1i.",
      ]);
    }
    if (!a.ok) throw new W(await rt(a));
    return (await a.json()).pack;
  }
  async function st(e) {
    let n = await fetch(`${Ke}?delete=${encodeURIComponent(e)}`, {
      method: "POST",
      headers: { "X-Password": Oe() },
    });
    if (!n.ok) throw new W(await rt(n));
  }
  function an(e, n) {
    var t;
    (Ce.clear(), Ne.clear());
    for (let a = F.length - 1; a >= 0; a--)
      F[a].id.startsWith("u-") && F.splice(a, 1);
    for (let a of n) {
      Ne.set(a.id, { vi: a.name, en: (t = a.nameEn) != null ? t : a.name });
      for (let i of a.files)
        Ce.set(i, `${tn}${i.replace(/^custom\//, "")}?v=${a.createdAt}`);
      a.type === "mount"
        ? e.mounts.push(a.def)
        : a.type === "monster"
          ? e.monsters.push(a.def)
          : a.type === "scenery"
            ? e.sceneries.push(a.def)
            : F.push(a.def);
    }
  }
  async function lt() {
    let [e, n] = await Promise.all([nt(), nn()]);
    return (an(e, n), { manifest: e, packs: n });
  }
  var T = (e, n, t) => (e === "en" ? t : n),
    on = {
      sun: "Sun",
      moon: "Moon",
      cloud: "Storm Cloud",
      planet: "Purple Planet",
      dragon: "Inferno Dragon",
      reaper: "Grim Reaper",
      mecha: "Doom Mecha",
      kraken: "Kraken",
      demon: "Demon Lord",
      pharaoh: "Anubis Pharaoh",
    };
  function Y(e, n) {
    var i;
    let t = X(n),
      a = Ie(e, t.id);
    return a || (e === "en" && (i = on[t.id]) != null ? i : t.label);
  }
  var rn = {
      "Kh\u1EDFi \u0111\u1ED9ng": "Starting up",
      "Th\u1EE7 c\xF4ng": "Manual",
      "H\u1ED3i sinh": "Respawning",
      "B\u1EAFn boss": "Shooting boss",
      "Di\u1EC7t qu\xE1i": "Killing monsters",
      "B\u1EAFn c\u1EA7u l\u1EEDa": "Shooting fireballs",
      "N\xE9 s\xE9t": "Dodging lightning",
      "Nh\u1EB7t xu": "Grabbing coins",
      "Nh\u1EB7t v\u1EADt ph\u1EA9m": "Grabbing items",
      "Nh\u1EA3y qua qu\xE1i": "Jumping over monsters",
      "Tr\xE1nh qu\xE1i bay": "Avoiding flyers",
      "Nh\u1EA3y nh\u1EB7t \u0111\u1ED3": "Jumping for loot",
      "L\xEAn b\u1EE5c nh\u1EB7t xu": "Climbing for coins",
      "Nh\u1EA3y m\xFAa": "Dancing around",
      "Xu\u1ED1ng b\u1EE5c": "Dropping down",
      "C\xE2n b\u1EB1ng": "Balanced",
      "X\u1EA1 th\u1EE7": "Sniper",
      "Thu th\u1EADp": "Collector",
      "Th\u1EE3 nh\u1EB7t": "Collector",
      "Li\u1EC1u m\u1EA1ng": "Daredevil",
    },
    Fe = (e, n) => {
      var t;
      return e === "en" && (t = rn[n]) != null ? t : n;
    };
  function Z(e) {
    let n = e >>> 0,
      t = () => {
        n = (n + 1831565813) >>> 0;
        let a = n;
        return (
          (a = Math.imul(a ^ (a >>> 15), a | 1)),
          (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
          ((a ^ (a >>> 14)) >>> 0) / 4294967296
        );
      };
    return {
      next: t,
      range: (a, i) => a + t() * (i - a),
      int: (a, i) => Math.floor(a + t() * (i - a + 1)),
      chance: (a) => t() < a,
      pick: (a) => a[Math.floor(t() * a.length)],
      shuffle: (a) => {
        for (let i = a.length - 1; i > 0; i--) {
          let r = Math.floor(t() * (i + 1));
          [a[i], a[r]] = [a[r], a[i]];
        }
        return a;
      },
    };
  }
  function ye(...e) {
    let n = 2166136261;
    for (let t of e)
      ((n ^= t >>> 0), (n = Math.imul(n, 16777619)), (n ^= n >>> 13));
    return n >>> 0;
  }
  var sn = {
      natural: {
        id: "natural",
        label: "T\u1EF1 nhi\xEAn",
        hint: "Kh\xF4ng can thi\u1EC7p, AI ch\u01A1i theo b\u1EA3n n\u0103ng",
        failStart: 1,
        playerEndHp: 100,
        sunEnd: 0,
      },
      dominant: {
        id: "dominant",
        label: "\xC1p \u0111\u1EA3o",
        hint: "T\u01B0\u1EDBng qu\xE2n g\u1EA7n nh\u01B0 kh\xF4ng m\u1EA5t m\xE1u, h\u1EA1 m\u1EB7t tr\u1EDDi \u0111\xFAng gi\u1EDD",
        failStart: 1,
        playerEndHp: 100,
        sunEnd: 0,
      },
      clutch: {
        id: "clutch",
        label: "Ng\u01B0\u1EE3c d\xF2ng ngh\u1EB9t th\u1EDF",
        hint: "M\xE1u t\u1EE5t s\xE1t \u0111\xE1y r\u1ED3i h\u1EA1 m\u1EB7t tr\u1EDDi \u1EDF nh\u1EEFng gi\xE2y cu\u1ED1i",
        failStart: 0.45,
        playerEndHp: 14,
        sunEnd: 0,
      },
      attrition: {
        id: "attrition",
        label: "C\u1EA1n s\u1EE9c d\u1EA7n",
        hint: "M\u1EA5t m\xE1u t\u1EEB t\u1EEB, m\u1EB7t tr\u1EDDi c\xF2n kho\u1EA3ng 35% khi t\u01B0\u1EDBng qu\xE2n ng\xE3",
        failStart: 0.3,
        playerEndHp: 0,
        sunEnd: 0.35,
      },
      sudden: {
        id: "sudden",
        label: "S\u1EE5p \u0111\u1ED5 b\u1EA5t ng\u1EDD",
        hint: "\u0110ang \u1ED5n r\u1ED3i b\u1ECB d\u1ED3n d\u1EADp s\xE9t \u1EDF cu\u1ED1i, m\u1EB7t tr\u1EDDi c\xF2n h\u01A1n n\u1EEDa m\xE1u",
        failStart: 0.7,
        playerEndHp: 0,
        sunEnd: 0.6,
      },
      close: {
        id: "close",
        label: "Thua s\xE1t n\xFAt",
        hint: "M\u1EB7t tr\u1EDDi ch\u1EC9 c\xF2n ch\xFAt m\xE1u r\u1ED3i t\u01B0\u1EDBng qu\xE2n g\u1EE5c ng\xE3",
        failStart: 0.5,
        playerEndHp: 0,
        sunEnd: 0.08,
      },
    },
    ln = 3.3,
    oe = (e, n, t) => Math.max(n, Math.min(t, e)),
    un = 10,
    cn = 1800;
  function hn(e, n, t) {
    var u, c, h, m;
    let a = new Set(e.sceneries.map((d) => d.id)),
      i = oe(Math.round((u = n.duration) != null ? u : 60), un, cn),
      r = (c = n.outcome) != null ? c : "natural",
      s = ((h = n.sceneries) != null ? h : []).filter((d) => a.has(d));
    if (!s.length && r !== "natural") {
      let d = oe(Math.round(i / 30), 1, 6);
      s = Z(ye(t, 5150))
        .shuffle(e.sceneries.map((k) => k.id))
        .slice(0, d);
    }
    let o = new Set(e.monsters.map((d) => d.id)),
      l = ((m = n.monsters) != null ? m : []).filter((d) => o.has(d));
    return {
      sceneries: s,
      monsters: l,
      duration: i,
      outcome: r,
      lang: n.lang === "en" ? "en" : "vi",
    };
  }
  function ut(e, n, t) {
    let a = hn(e, n, t),
      i = Math.max(1, a.sceneries.length),
      r = a.duration / i,
      s = Z(ye(t, 424242)),
      o =
        a.outcome === "win"
          ? s.pick(["dominant", "clutch"])
          : a.outcome === "lose"
            ? s.pick(["attrition", "sudden", "close"])
            : "natural",
      l = a.outcome !== "natural";
    return {
      scenario: a,
      stages: i,
      budget: r,
      tempo: l ? oe(30 / r, 0.9, 1.5) : 1,
      hpScale: l ? oe(r / 40, 0.35, 3) : 1,
      style: sn[o],
      stageStart: 0,
      hpRef: null,
      sunScale: 1,
      sunFloor: 0,
      hurtMult: 1,
      fail: 0,
      noHeal: !1,
      sunKillNow: !1,
      playerKillNow: !1,
      result: null,
      resultAt: 0,
    };
  }
  function fn(e, n, t) {
    let a = n >= e.stages - 1,
      i = e.scenario.outcome === "lose" && a,
      r = a ? e.scenario.duration - (i ? 2.6 : 4.6) : (n + 1) * e.budget - ln;
    return Math.max(t + 3, r);
  }
  function ct(e) {
    let n = e.director;
    if (!n || n.scenario.outcome === "natural" || n.result) return;
    let t = n.scenario.outcome,
      a = e.stage >= n.stages - 1,
      i = t === "lose" && a,
      r = n.stageStart,
      s = fn(n, e.stage, r),
      o = Math.max(3, s - r),
      l = oe((e.time - r) / o, 0, 1),
      u = i ? n.style.sunEnd : 0,
      c = 1 - (1 - u) * l,
      h = e.sun,
      m = h.hp / h.maxHp,
      d = e.time >= s && !i;
    n.sunScale = d ? 14 : oe(1 + 9 * (m - c), 0.08, 12);
    let k = i ? u * h.maxHp : 1;
    if (
      ((n.sunFloor = d ? 0 : Math.max(k, (c - 0.03) * h.maxHp)),
      (n.sunKillNow = !i && e.time > s + 2.5),
      (n.playerKillNow = i && e.time >= s),
      (n.fail = 0),
      (n.noHeal = !1),
      (n.hurtMult = 0.7),
      a && (i || n.style.id === "clutch"))
    ) {
      let g = r + o * n.style.failStart;
      if (e.time >= g) {
        n.hpRef == null && (n.hpRef = e.player.hp);
        let y = oe((e.time - g) / Math.max(1, s - g), 0, 1),
          S = n.hpRef + (n.style.playerEndHp - n.hpRef) * y,
          f = e.player.hp - S;
        ((n.fail = oe(f / 25, 0, 1) * (i ? 1 : 0.7)),
          (n.hurtMult = f > 2 ? 2.5 : 0.35),
          (n.noHeal = !0));
      }
    }
  }
  function ht(e) {
    e.director && ((e.director.stageStart = e.time), (e.director.hpRef = null));
  }
  var M = 1280,
    E = 720,
    P = 612,
    ce = 130,
    ie = 880,
    Se = 1 / 60,
    mn = 0.85,
    Ue = 430,
    dn = 100,
    pn = 135;
  function Be(e, n, t, a, i) {
    var m, d;
    let r = Z(ye(n, t, 7919)),
      s = Z(ye(n, 31337)).shuffle(e.sceneries.slice()),
      o = s[t % s.length];
    if (Array.isArray(a)) {
      let k = a[t % a.length];
      o = (m = e.sceneries.find((g) => g.id === k)) != null ? m : o;
    } else
      t === 0 &&
        a &&
        (o = (d = e.sceneries.find((k) => k.id === a)) != null ? d : o);
    let l =
        i != null && i.length ? e.monsters.filter((k) => i.includes(k.id)) : [],
      u = l.length ? l : e.monsters,
      c = r.shuffle(u.slice()).slice(0, 7),
      h = r.shuffle(e.platforms.slice()).slice(0, 3);
    return { scenery: o, monsters: c, platformSprites: h };
  }
  function gn(e) {
    let n = e.pick(["balanced", "sniper", "collector", "daredevil"]),
      t = {
        balanced: { pickup: 1, hop: 0.12, margin: 105 },
        sniper: { pickup: 0.55, hop: 0.05, margin: 125 },
        collector: { pickup: 1.9, hop: 0.2, margin: 100 },
        daredevil: { pickup: 1.1, hop: 0.55, margin: 85 },
      }[n];
    return {
      style: n,
      reaction: e.range(0.06, 0.22),
      margin: t.margin,
      pickupWeight: t.pickup,
      hopChance: t.hop,
      wanderPhase: e.range(0, 10),
      wanderAmp: e.range(30, 110),
      rng: Z(e.int(1, 2 ** 30)),
      targetX: 420,
      holdJump: 0,
      intent: "Kh\u1EDFi \u0111\u1ED9ng",
      replanT: 0,
      seenBolts: {},
    };
  }
  function mt() {
    return {
      x: 360,
      y: P,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      jumpsLeft: 2,
      jumpHeld: !1,
      onGround: !0,
      standing: null,
      fireCd: 0,
      invuln: 1.5,
      gun: 0,
      doubleT: 0,
      haloT: 0,
      reverseT: 0,
      meteorT: 0,
      meteorCd: 0,
      facingAngle: -0.5,
      runPhase: 0,
      hurtFlash: 0,
    };
  }
  function bn(e) {
    return 1400 + e * 650;
  }
  function Ve(e, n = 1) {
    let t = Math.round(bn(e) * n);
    return {
      x: M - 170,
      y: 130,
      hp: t,
      maxHp: t,
      cd: 2.2,
      rageT: 0,
      flash: 0,
      spitT: 0,
      scale: 1,
      scaleTo: 1,
      scaleT: 6,
      homeX: M - 170,
      homeY: 130,
      tpT: 0,
      tpTo: { x: M - 170, y: 130 },
      tpCd: 6,
      deathT: 0,
    };
  }
  function z(e) {
    return Y(e.lang, e.bossId);
  }
  function dt(e, n) {
    var d, k, g, y, S, f, p;
    let t = Z(n.seed),
      i =
        n.rider === "none"
          ? void 0
          : (d = e.riders.find((w) => w.id === n.rider)) != null
            ? d
            : t.pick(e.riders),
      r =
        (k = e.mounts.find((w) => w.id === n.mount)) != null
          ? k
          : t.pick(e.mounts),
      s =
        n.boss === Pe
          ? Z(n.seed ^ 2654435769).pick(F).id
          : X((g = n.boss) != null ? g : "sun").id,
      o = n.scenario ? ut(e, n.scenario, n.seed) : null,
      l =
        o != null && o.scenario.sceneries.length ? o.scenario.sceneries : null,
      u = l != null ? l : n.scenery,
      c =
        o != null && o.scenario.monsters.length ? o.scenario.monsters : void 0,
      h = Be(e, n.seed, 0, u, c),
      m = {
        manifest: e,
        seed: n.seed,
        rng: t,
        mode: (y = n.mode) != null ? y : "auto",
        tick: 0,
        time: 0,
        run: 1,
        stage: 0,
        plan: h,
        fadeFrom: null,
        fadeT: 0,
        scroll: 0,
        speed: 250,
        player: mt(),
        riderId: (S = i == null ? void 0 : i.id) != null ? S : "none",
        mountId: r.id,
        bossId: s,
        monsters: [],
        bullets: [],
        fireballs: [],
        bolts: [],
        pickups: [],
        platforms: [],
        meteors: [],
        effects: [],
        floaters: [],
        slowT: 0,
        slowScale: 1,
        cam: {
          z: 1,
          x: M / 2,
          y: E / 2,
          tz: 1,
          tx: M / 2,
          ty: E / 2,
          hold: 0,
          next: 1.5,
          roll: 0,
          troll: 0,
          sw: null,
          bars: 0,
        },
        combo: 0,
        comboT: 0,
        bestCombo: 0,
        comboPop: 0,
        bossBannerT: 2.6,
        sun: Ve(0, (f = o == null ? void 0 : o.hpScale) != null ? f : 1),
        monsterT: 4.5,
        swarmNext: 22,
        swarmT: 0,
        platformT: 4,
        coinT: 2,
        eventT: t.range(12, 20),
        banner: null,
        sounds: [],
        shake: 0,
        flash: null,
        phase: "play",
        phaseT: 0,
        score: 0,
        coins: 0,
        kills: 0,
        sunKills: 0,
        collected: 0,
        bestScore: 0,
        log: [],
        uid: 1,
        ai: gn(t),
        firstScenery: u,
        monsterIds: c,
        director: o,
        lang:
          ((p = n.scenario) == null ? void 0 : p.lang) === "en" ? "en" : "vi",
        intent: "",
      };
    return (
      H(
        m,
        `${T(m.lang, "M\xE0n", "Stage")} 1 \xB7 ${h.scenery.id}`,
        T(
          m.lang,
          `${z(m)} \u0111ang nh\xECn b\u1EA1n...`,
          `${z(m)} is watching you...`,
        ),
      ),
      m
    );
  }
  function N(e, n, t = 1) {
    e.sounds.length < 24 && e.sounds.push({ name: n, n: t });
  }
  function H(e, n, t = "", a = 2.4) {
    ((e.banner = { text: n, sub: t, t: 0, life: a }),
      e.log.push({ t: e.time, text: t ? `${n} \u2014 ${t}` : n }),
      e.log.length > 40 && e.log.shift());
  }
  function yn(e, n) {
    (e.log.push({ t: e.time, text: n }), e.log.length > 40 && e.log.shift());
  }
  function A(e, n, t, a, i = 100, r = 0.4, s = 0) {
    e.effects.push({ kind: n, x: t, y: a, t: 0, life: r, size: i, variant: s });
  }
  function pt(e, n, t, a, i) {
    let r = (s, o, l, u = 0) =>
      e.effects.push({
        kind: s,
        x: n,
        y: t,
        t: 0,
        life: l,
        size: o,
        variant: u,
        color: a,
      });
    (r("glow", 190, 0.3),
      r("shock", 170, 0.45),
      r("shards", 130, 0.6, (e.tick | 0) % 7),
      i === "needle"
        ? r("slash", 150, 0.35, 1)
        : i === "beam"
          ? (r("shock", 280, 0.6), r("slash", 240, 0.4, 0))
          : i === "pillar"
            ? r("stars", 120, 0.7)
            : (r("stars", 100, 0.55), r("slash", 130, 0.3, (e.tick | 0) % 3)));
  }
  function he(e, n, t, a, i = "#fff", r = 34, s = 1) {
    e.floaters.push({
      text: n,
      x: t,
      y: a,
      t: 0,
      life: s,
      color: i,
      size: r,
      vx: 0,
    });
  }
  function j(e, n) {
    let t =
      Math.sin((e.tick + 1) * 12.9898 + n * 78.233 + e.floaters.length * 3.1) *
      43758.5453;
    return t - Math.floor(t);
  }
  function gt(e, n, t, a) {
    if (n < 1) return;
    let i = n >= 40,
      r = j(e, 1) < 0.18,
      s = Math.round(n * (r ? 1.5 : 1)),
      o = r ? "#ff5a3c" : i ? "#ffb02e" : "#fff3b0";
    e.floaters.push({
      text: r ? `${s}!` : `${s}`,
      x: t + (j(e, 2) - 0.5) * 52,
      y: a - 20,
      t: 0,
      life: 0.8,
      color: o,
      size: r ? 40 : i ? 32 : 24,
      vx: (j(e, 3) - 0.5) * 100,
    });
  }
  function wn(e, n, t) {
    (e.combo++,
      N(e, "combo", e.combo),
      (e.comboT = 3),
      (e.comboPop = 1),
      e.combo > e.bestCombo && (e.bestCombo = e.combo),
      e.combo >= 3 &&
        e.combo % 5 === 0 &&
        (e.floaters.push({
          text: `COMBO x${e.combo}`,
          x: n,
          y: t - 60,
          t: 0,
          life: 1.2,
          color: "#ff4fd8",
          size: 44,
          vx: 0,
        }),
        (e.shake = Math.max(e.shake, 0.25))));
  }
  function Ee(e) {
    let n = e.w * 0.5,
      t = e.h * 0.62,
      a = e.def.kind === "walk" ? e.y + e.h * 0.12 : e.y;
    return { x: e.x - n / 2, y: a - t / 2, w: n, h: t };
  }
  function kn(e) {
    return { x: e.x - 62, y: e.y - 150, w: 124, h: 140 };
  }
  function we(e) {
    return { x: e.x + dn, y: e.y - pn };
  }
  function Mn(e, n) {
    return (
      e.x < n.x + n.w && e.x + e.w > n.x && e.y < n.y + n.h && e.y + e.h > n.y
    );
  }
  function vn(e) {
    return 9 + e * 4;
  }
  function Sn(e) {
    return Math.max(0.085, 0.25 - e * 0.02);
  }
  function Ae(e, n, t = !1, a = 0) {
    let i = e.rng,
      r = n != null ? n : i.pick(e.plan.monsters),
      s =
        (r.kind === "walk" ? i.range(150, 200) : i.range(120, 170)) *
        (t ? 1.5 : 1),
      o = s / r.size[1],
      l = r.size[0] * o,
      u = s,
      c = r.kind === "walk" ? P - u / 2 + 10 : i.range(250, P - 190),
      h = 1 + e.stage * 0.28,
      m = Math.round((14 + u * 0.12) * h * (t ? 4.2 : 1));
    e.monsters.push({
      uid: e.uid++,
      def: r,
      x: M + l / 2 + 40 + a,
      y: c,
      w: l,
      h: u,
      hp: m,
      maxHp: m,
      ownVx: i.range(30, 120) * (r.kind === "fly" ? 1.4 : 1),
      baseY: c,
      phase: i.range(0, Math.PI * 2),
      age: 0,
      state: "move",
      stateT: 0,
      cooldown: i.range(0.4, 1.1) + a / 900,
      elite: t,
      flash: 0,
      dmgDone: !1,
      coinMin: t ? 14 : 3,
      coinMax: t ? 22 : 7,
    });
  }
  function ee(e, n, t, a = {}) {
    e.pickups.push(
      L(
        {
          uid: e.uid++,
          kind: "coin",
          x: n,
          y: t,
          vx: 0,
          vy: 0,
          gravity: !1,
          value: 1,
          age: 0,
          gunIdx: 0,
        },
        a,
      ),
    );
  }
  function K(e, n, t, a, i = {}) {
    e.pickups.push(
      L(
        {
          uid: e.uid++,
          kind: n,
          x: t,
          y: a,
          vx: 0,
          vy: 0,
          gravity: !1,
          value: 1,
          age: 0,
          gunIdx: 0,
        },
        i,
      ),
    );
  }
  function xn(e) {
    let n = e.rng,
      t = M + 80,
      a = n.pick(["line", "arc", "zigzag", "circle", "wave", "stair"]),
      i = P - 70;
    switch (a) {
      case "line": {
        let r = n.int(5, 9);
        for (let s = 0; s < r; s++) ee(e, t + s * 52, i);
        break;
      }
      case "arc": {
        for (let s = 0; s < 9; s++) {
          let o = s / 8;
          ee(e, t + s * 55, i - Math.sin(o * Math.PI) * 190);
        }
        break;
      }
      case "zigzag": {
        for (let r = 0; r < 8; r++) ee(e, t + r * 60, i - (r % 2) * 110);
        break;
      }
      case "circle": {
        let r = i - 130;
        for (let s = 0; s < 10; s++) {
          let o = (s / 10) * Math.PI * 2;
          ee(e, t + 90 + Math.cos(o) * 90, r + Math.sin(o) * 90);
        }
        break;
      }
      case "wave": {
        for (let r = 0; r < 12; r++)
          ee(e, t + r * 48, i - 100 - Math.sin(r * 0.7) * 80);
        break;
      }
      case "stair": {
        for (let r = 0; r < 6; r++) ee(e, t + r * 60, i - r * 38);
        break;
      }
    }
    if (n.chance(0.2)) {
      let r = [
          "heal",
          "double",
          "halo",
          "lightning",
          "meteor",
          "reverse",
          "gun",
        ],
        s = n.pick(r);
      K(e, s, t + 220, P - n.range(110, 230), {
        gunIdx: Math.min(9, e.player.gun + 1),
      });
    }
  }
  function Tn(e) {
    let n = e.rng,
      t = n.pick(e.plan.platformSprites),
      a = 250,
      i = n.pick([105, 150, 195]),
      r = P - i,
      s = t.src.includes("moving") || n.chance(0.2),
      o = {
        uid: e.uid++,
        x: M + a,
        y: r,
        w: a,
        sprite: t,
        bobPhase: n.range(0, 6),
        bobAmp: s ? 38 : 0,
        baseY: r,
      };
    e.platforms.push(o);
    let l = n.int(3, 5);
    for (let u = 0; u < l; u++)
      ee(e, o.x - a / 2 + 50 + u * ((a - 100) / (l - 1)), r - 44, { vx: 0 });
    n.chance(0.3) &&
      K(
        e,
        n.pick(["double", "halo", "lightning", "meteor", "heal", "gun"]),
        o.x,
        r - 100,
        { gunIdx: Math.min(9, e.player.gun + 1) },
      );
  }
  function bt(e, n, t, a, i = 1) {
    for (let r = 0; r < a; r++) {
      let s = e.rng.range(-Math.PI * 0.95, -Math.PI * 0.05),
        o = e.rng.range(160, 420);
      ee(e, n, t, {
        vx: Math.cos(s) * o,
        vy: Math.sin(s) * o,
        gravity: !0,
        value: i,
      });
    }
  }
  function Me(e, n, t, a = !1) {
    let i = e.player;
    if (e.phase !== "play" || (!a && (i.invuln > 0 || i.haloT > 0))) return;
    ((e.combo = 0), (e.comboT = 0));
    let r = e.director,
      s = !!r && r.scenario.outcome !== "natural";
    if (a) n = Math.max(1, Math.round(i.hp));
    else if (
      s &&
      ((n = Math.max(1, Math.round(n * r.hurtMult))),
      (n = Math.min(n, Math.max(0, Math.round(i.hp) - 6))),
      n <= 0)
    )
      return;
    ((i.hp -= n),
      (i.invuln = 1.1),
      (i.hurtFlash = 0.35),
      N(e, "hurt"),
      (e.shake = Math.max(e.shake, 0.4)),
      (e.flash = { color: "rgba(255,40,20,0.35)", t: 0.25 }),
      he(e, `-${n}`, i.x, i.y - 160, "#ff6b5a"),
      yn(e, T(e.lang, `Tr\xFAng ${t} (-${n})`, `Hit by ${t} (-${n})`)),
      i.hp <= 0 &&
        ((i.hp = 0),
        (e.phase = "dead"),
        N(e, "dead"),
        (e.phaseT = 3),
        r && r.scenario.outcome === "lose"
          ? ((r.result = "lose"),
            (r.resultAt = e.time),
            H(
              e,
              T(e.lang, "TH\u1EA4T B\u1EA0I", "DEFEAT"),
              T(
                e.lang,
                `${z(e)} v\u1EABn \u0111\u1EE9ng v\u1EEFng...`,
                `${z(e)} still stands...`,
              ),
              6,
            ))
          : H(
              e,
              T(e.lang, "Ng\xE3 ng\u1EF1a!", "Knocked down!"),
              T(
                e.lang,
                `H\u1ED3i sinh l\u1EA7n ${e.run + 1}...`,
                `Respawn #${e.run + 1}...`,
              ),
              2.8,
            ),
        A(e, "boom", i.x, i.y - 80, 220, 0.7)));
  }
  function Pn(e, n) {
    (N(e, "kill"),
      e.kills++,
      wn(e, n.x, n.y),
      (e.score += Math.round(n.maxHp * 2)),
      A(e, "hit", n.x, n.y, n.w * 1.1, 0.4, e.rng.int(0, 9)),
      A(e, "boom", n.x, n.y, n.w * 0.9, 0.5));
    let t = e.rng.int(n.coinMin, n.coinMax);
    if ((bt(e, n.x, n.y, t), n.elite))
      (K(e, "gun", n.x, n.y - 40, {
        vx: 120,
        vy: -380,
        gravity: !0,
        gunIdx: Math.min(9, e.player.gun + 1),
      }),
        K(
          e,
          e.rng.pick(["double", "halo", "lightning", "meteor", "reverse"]),
          n.x,
          n.y - 40,
          { vx: 220, vy: -440, gravity: !0 },
        ),
        H(e, T(e.lang, "Tinh anh b\u1ECB h\u1EA1!", "Elite down!"), n.def.id));
    else {
      let a = e.rng.next();
      a < 0.1
        ? K(
            e,
            e.rng.pick(["double", "halo", "lightning", "meteor", "reverse"]),
            n.x,
            n.y,
            { vx: 120, vy: -360, gravity: !0 },
          )
        : a < 0.17
          ? K(e, "heal", n.x, n.y, { vx: 80, vy: -360, gravity: !0 })
          : a < 0.22 &&
            K(e, "gun", n.x, n.y, {
              vx: 100,
              vy: -360,
              gravity: !0,
              gunIdx: Math.min(9, e.player.gun + 1),
            });
    }
    e.monsters = e.monsters.filter((a) => a !== n);
  }
  function $e(e, n, t) {
    ((n.hp -= t),
      (n.flash = 0.12),
      gt(e, t, n.x, n.y - n.h * 0.5),
      n.hp <= 0 && Pn(e, n));
  }
  function ve(e, n, t, a) {
    let i = e.sun;
    if (e.phase !== "play") return;
    let r = e.director,
      s = !!r && r.scenario.outcome !== "natural";
    ((e.score += Math.round(Math.min(n, 400))),
      s && (n *= r.sunScale),
      (i.hp -= n),
      s && !r.sunKillNow && i.hp < r.sunFloor && (i.hp = r.sunFloor),
      (i.flash = 0.1),
      N(e, "sunHit"),
      e.tick % 2 === 0 && gt(e, n, t, a),
      e.tick % 3 === 0 && A(e, "spark", t, a, 40, 0.25),
      i.hp <= 0 &&
        ((i.hp = 0),
        (i.deathT = 0),
        N(e, "sunDie"),
        (e.slowT = 1.6),
        q(e, 1.7, i.x, i.y, 1.8, 0),
        (e.slowScale = 0.22),
        (e.phase = "transition"),
        (e.phaseT = 3.2),
        e.sunKills++,
        (e.flash = { color: "rgba(255,230,150,0.7)", t: 0.8 }),
        (e.shake = 1),
        A(e, "sunBurst", i.x, i.y, 520, 1.6),
        bt(e, i.x, i.y, 36, 2),
        K(e, "gun", i.x, i.y, {
          vx: -120,
          vy: -200,
          gravity: !0,
          gunIdx: Math.min(9, e.player.gun + 1),
        }),
        K(e, "halo", i.x - 40, i.y, { vx: -220, vy: -160, gravity: !0 }),
        (e.bolts = []),
        (e.fireballs = []),
        s && e.stage >= r.stages - 1
          ? ((r.result = "win"),
            (r.resultAt = e.time),
            H(
              e,
              T(e.lang, "CHI\u1EBEN TH\u1EAENG!", "VICTORY!"),
              T(
                e.lang,
                `${z(e)} \u0111\xE3 g\u1EE5c ng\xE3`,
                `${z(e)} has fallen`,
              ),
              6,
            ))
          : H(
              e,
              T(e.lang, `${z(e)} g\u1EE5c ng\xE3!`, `${z(e)} defeated!`),
              T(
                e.lang,
                `M\xE0n ${e.stage + 2} s\u1EAFp b\u1EAFt \u0111\u1EA7u`,
                `Stage ${e.stage + 2} incoming`,
              ),
              3,
            )));
  }
  function Cn(e, n) {
    var a;
    let t = e.player;
    switch (
      (e.collected++,
      N(
        e,
        n.kind === "coin"
          ? "coin"
          : n.kind === "gun"
            ? "gun"
            : n.kind === "heal"
              ? "heal"
              : n.kind === "lightning"
                ? "lightning"
                : n.kind === "meteor"
                  ? "meteor"
                  : "powerup",
        Math.min(8, e.combo),
      ),
      n.kind)
    ) {
      case "coin": {
        ((e.coins += n.value),
          (e.score += 5 * n.value),
          e.tick % 2 === 0 && he(e, `+${n.value}`, n.x, n.y - 20, "#ffd84a"));
        break;
      }
      case "gun": {
        let i = Math.max(t.gun, n.gunIdx);
        (i > t.gun
          ? ((t.gun = i),
            H(
              e,
              T(e.lang, "N\xE2ng c\u1EA5p s\xFAng!", "Gun upgrade!"),
              T(e.lang, `C\u1EA5p ${t.gun + 1}`, `Level ${t.gun + 1}`),
              1.6,
            ))
          : (e.score += 200),
          he(e, T(e.lang, "S\xDANG", "GUN"), t.x, t.y - 180, "#7dd3fc"));
        break;
      }
      case "double":
        ((t.doubleT = 12),
          H(
            e,
            T(e.lang, "B\u1EAFn \u0111\xF4i!", "Double shot!"),
            T(e.lang, "12 gi\xE2y", "12 seconds"),
            1.4,
          ));
        break;
      case "halo":
        ((t.haloT = 7),
          H(
            e,
            T(e.lang, "H\xE0o quang b\u1EA5t t\u1EED!", "Immortal halo!"),
            T(e.lang, "7 gi\xE2y", "7 seconds"),
            1.4,
          ));
        break;
      case "reverse":
        ((t.reverseT = 9),
          H(
            e,
            T(e.lang, "Ph\u1EA3n \u0111\xF2n!", "Counter strike!"),
            T(
              e.lang,
              `S\xE9t v\xE0 l\u1EEDa b\u1EADt ng\u01B0\u1EE3c v\u1EC1 ${z(e).toLowerCase()}`,
              `Lightning and fire bounce back at the ${z(e).toLowerCase()}`,
            ),
            1.6,
          ));
        break;
      case "heal":
        if ((a = e.director) != null && a.noHeal) break;
        ((t.hp = Math.min(t.maxHp, t.hp + 35)),
          he(e, "+35 HP", t.x, t.y - 180, "#6ee7a1"));
        break;
      case "meteor":
        ((t.meteorT = 6),
          H(
            e,
            T(e.lang, "M\u01B0a thi\xEAn th\u1EA1ch!", "Meteor shower!"),
            T(e.lang, "6 gi\xE2y", "6 seconds"),
            1.4,
          ));
        break;
      case "lightning": {
        let i = e.monsters
          .slice()
          .sort((r, s) => r.x - s.x)
          .slice(0, 6);
        for (let r of i)
          (A(e, "lightning", r.x, r.y, 320, 0.5), $e(e, r, 90 + e.stage * 25));
        (A(e, "lightning", e.sun.x, e.sun.y, 520, 0.6),
          ve(e, 160, e.sun.x, e.sun.y),
          (e.flash = { color: "rgba(160,200,255,0.4)", t: 0.2 }),
          (e.shake = Math.max(e.shake, 0.5)),
          H(e, T(e.lang, "S\u1EA5m s\xE9t!", "Thunder!"), "", 1.1));
        break;
      }
    }
  }
  function In(e) {
    N(e, "event");
    let n = e.rng;
    switch (
      n.pick(["horde", "coinRain", "sunRage", "elite", "supply", "meteorGift"])
    ) {
      case "horde": {
        let a = n.pick(e.plan.monsters),
          i = n.int(5, 8);
        for (let r = 0; r < i; r++) Ae(e, a, !1, r * 150);
        H(
          e,
          T(
            e.lang,
            "B\u1EA7y qu\xE1i \u1EADp \u0111\u1EBFn!",
            "Monster swarm!",
          ),
          a.id,
        );
        break;
      }
      case "coinRain": {
        for (let a = 0; a < 30; a++)
          ee(e, n.range(240, M - 60), -20 - a * 38, {
            vx: -e.speed * 0.4,
            vy: 120,
            gravity: !0,
          });
        H(
          e,
          T(e.lang, "M\u01B0a v\xE0ng!", "Gold rain!"),
          T(e.lang, "Nh\u1EB7t th\u1EADt nhanh", "Grab it fast"),
        );
        break;
      }
      case "sunRage": {
        ((e.sun.rageT = 7),
          (e.sun.cd = 0.4),
          H(
            e,
            T(e.lang, `${z(e)} n\u1ED5i gi\u1EADn!`, `${z(e)} is furious!`),
            T(e.lang, "N\xE9 s\xE9t \u0111i", "Dodge the lightning"),
          ));
        break;
      }
      case "elite": {
        (Ae(e, n.pick(e.plan.monsters), !0),
          H(
            e,
            T(e.lang, "Tinh anh xu\u1EA5t hi\u1EC7n!", "Elite spawned!"),
            T(
              e.lang,
              "R\u01A1i s\xFAng + k\u1EF9 n\u0103ng",
              "Drops guns + skills",
            ),
          ));
        break;
      }
      case "supply": {
        (K(e, "gun", 520 + n.range(-100, 200), -40, {
          vy: 140,
          gravity: !0,
          gunIdx: Math.min(9, e.player.gun + 1),
        }),
          K(e, "heal", 760 + n.range(-100, 100), -120, {
            vy: 140,
            gravity: !0,
          }),
          H(
            e,
            T(e.lang, "Ti\u1EBFp t\u1EBF t\u1EEB tr\u1EDDi!", "Airdrop!"),
            "",
          ));
        break;
      }
      case "meteorGift": {
        (K(e, "meteor", M + 60, P - 130),
          K(e, "lightning", M + 200, P - 130),
          H(e, T(e.lang, "Qu\xE0 thi\xEAn th\u1EA1ch!", "Meteor gifts!"), ""));
        break;
      }
    }
  }
  function We(e, n, t, a) {
    let i = Array.from({ length: e }, (r, s) => s).sort(
      (r, s) => Math.abs(n(r) - t) - Math.abs(n(s) - t),
    );
    return a.chance(0.35) ? i[1] : i[0];
  }
  function En(e, n) {
    var y, S;
    let t = e.sun,
      a = 1 - t.hp / t.maxHp + (t.rageT > 0 ? 0.35 : 0);
    ((t.rageT = Math.max(0, t.rageT - n)),
      (t.flash = Math.max(0, t.flash - n)),
      (t.spitT = Math.max(0, t.spitT - n)));
    let i = Math.sin(e.time * 0.6) * 60 * Math.min(1, a + 0.3);
    if (e.phase !== "transition") {
      if (((t.scaleT -= n), t.scaleT <= 0)) {
        let f = a > 0.5 ? [0.65, 0.8, 1, 1.5, 1.8] : [0.8, 1, 1.35];
        ((t.scaleTo = f[Math.floor(e.rng.range(0, f.length)) % f.length]),
          (t.scaleT = e.rng.range(4, 7) - a * 1.5));
      }
      ((t.scale += (t.scaleTo - t.scale) * Math.min(1, n * 2.5)),
        t.tpT > 0
          ? ((t.tpT -= n),
            t.tpT <= 0 &&
              (A(e, "sunBurst", t.homeX, t.homeY, 260, 0.5),
              (t.homeX = t.tpTo.x),
              (t.homeY = t.tpTo.y),
              A(e, "sunBurst", t.homeX, t.homeY, 320, 0.6),
              (t.cd = Math.min(t.cd, 0.25))))
          : ((t.tpCd -= n),
            t.tpCd <= 0 &&
              ((t.tpT = 0.5),
              (t.tpTo = {
                x: e.rng.range(Math.max(260, e.player.x + 120), M - 110),
                y: e.rng.range(100, 270),
              }),
              (t.tpCd = Math.max(2.5, e.rng.range(5, 8) - a * 3)))));
    }
    if (
      ((t.x = t.homeX + i),
      (t.y = t.homeY + Math.sin(e.time * 1.3) * 14),
      (t.cd -= n),
      t.cd > 0 || t.tpT > 0)
    )
      return;
    let s = e.rng,
      o = e.player,
      l = X(e.bossId),
      u = [...l.pools[0]];
    (a > 0.2 && u.push(...l.pools[1]), a > 0.45 && u.push(...l.pools[2]));
    let c = s.pick(u),
      h = l.boltStyle,
      m =
        h === "beam"
          ? 84
          : h === "shock"
            ? 68
            : h === "inferno"
              ? 70
              : h === "laser"
                ? 46
                : 56,
      d = (f, p, w, b, x, $, I) =>
        e.fireballs.push({
          x: f,
          y: p,
          vx: w,
          vy: b,
          r: x,
          reflected: !1,
          age: -$,
          kind: I,
        }),
      k = Math.max(0.55, 1 - e.stage * 0.06 - a * 0.25),
      g = (f, p = 0, w = k, b = h, x = m) => ({
        x: Math.max(60, Math.min(M - 160, f)),
        delay: p,
        t: 0,
        warn: w,
        strike:
          b === "beam"
            ? 0.55
            : b === "inferno"
              ? 0.5
              : b === "laser"
                ? 0.45
                : 0.3,
        hit: !1,
        seed: s.int(1, 99999),
        style: b,
        half: x,
      });
    switch (c) {
      case "bolt": {
        (e.bolts.push(g(o.x + o.vx * 0.4 + s.range(-40, 40))),
          a > 0.6 && e.bolts.push(g(o.x + s.range(-220, 220), 0.3)));
        break;
      }
      case "barrage": {
        let f = 3 + Math.floor(a * 2),
          p = 210,
          w = (f - 1) * p,
          b = Math.max(70, Math.min(ie + 100 - w, o.x - w / 2)),
          x = (I) => b + I * p,
          $ = We(f, x, o.x, s);
        for (let I = 0; I < f; I++) I !== $ && e.bolts.push(g(x(I), I * 0.06));
        break;
      }
      case "sweep": {
        let p = (x) => ce - 40 + (x / 6) * (ie - ce + 120),
          w = Math.max(1, Math.min(4, We(7, p, o.x, s))),
          b = s.chance(0.5);
        for (let x = 0; x < 7; x++) {
          if (x === w || x === w + 1) continue;
          let $ = b ? x : 6 - x;
          e.bolts.push(g(p(x), $ * 0.17, k * 0.9));
        }
        break;
      }
      case "spit": {
        let f = a > 0.5 ? 3 : a > 0.2 ? 2 : 1;
        t.spitT = 0.6;
        for (let p = 0; p < f; p++) {
          let w = o.x + s.range(-60, 60),
            b = o.y - 70 + s.range(-60, 30),
            x = w - t.x,
            $ = b - t.y,
            I = Math.hypot(x, $),
            B = 360 + a * 120 + p * 40;
          d(
            t.x - 40,
            t.y + 30,
            (x / I) * B,
            ($ / I) * B,
            28,
            p * 0.35,
            l.orbKind,
          );
        }
        break;
      }
      case "meteor": {
        let f = 3 + Math.floor(a * 3);
        t.spitT = 0.6;
        for (let p = 0; p < f; p++) {
          let w = o.x + 120 + s.range(-120, 380);
          d(
            w,
            -30,
            -s.range(150, 260),
            s.range(430, 560),
            24,
            p * 0.32,
            l.orbKind,
          );
        }
        break;
      }
      case "hail": {
        let f = 5 + Math.floor(a * 4);
        for (let p = 0; p < f; p++)
          d(
            s.range(ce, ie + 80),
            -30,
            0,
            s.range(480, 560),
            17,
            p * 0.2,
            "hail",
          );
        break;
      }
      case "orbs": {
        let f = a > 0.5 ? 5 : 3;
        t.spitT = 0.6;
        let p = Math.atan2(o.y - 70 - t.y, o.x - t.x);
        for (let w = 0; w < f; w++) {
          let b = p + (w - (f - 1) / 2) * 0.22;
          d(
            t.x - 40,
            t.y + 30,
            Math.cos(b) * 310,
            Math.sin(b) * 310,
            22,
            0,
            l.orbKind,
          );
        }
        break;
      }
      case "beam": {
        (e.bolts.push(g(o.x + o.vx * 0.5, 0, k * 1.25)),
          a > 0.5 &&
            e.bolts.push(
              g(o.x + (s.chance(0.5) ? 300 : -300), 0.35, k * 1.25),
            ));
        break;
      }
      case "rain": {
        let f = 8 + Math.floor(a * 4);
        for (let p = 0; p < f; p++)
          e.bolts.push(
            g(o.x + s.range(-440, 440), p * 0.11, k * 0.8, "rain", 30),
          );
        break;
      }
      case "shock": {
        let w = Math.max(70, Math.min(ie + 100 - 700, o.x - 350)),
          b = (I) => w + I * 175,
          x = We(5, b, o.x, s),
          $ = s.chance(0.5);
        for (let I = 0; I < 5; I++)
          I !== x &&
            e.bolts.push(g(b(I), ($ ? I : 4 - I) * 0.2, k, "shock", 68));
        break;
      }
      case "fan": {
        let f = a > 0.5 ? 7 : 5;
        t.spitT = 0.6;
        let p = Math.atan2(o.y - 70 - t.y, o.x - t.x);
        for (let w = 0; w < f; w++) {
          let b = p + (w - (f - 1) / 2) * 0.3;
          d(
            t.x - 40,
            t.y + 30,
            Math.cos(b) * 330,
            Math.sin(b) * 330,
            20,
            w * 0.05,
            l.orbKind,
          );
        }
        break;
      }
      case "pincer": {
        let f = o.x + s.range(-30, 30),
          p = 4;
        for (let w = 0; w < p; w++)
          (e.bolts.push(g(f - 150 - w * 140, w * 0.12, k)),
            e.bolts.push(g(f + 150 + w * 140, w * 0.12, k)));
        break;
      }
      case "nova": {
        let f = 10 + Math.floor(a * 4);
        t.spitT = 0.8;
        let p = s.range(0, Math.PI);
        for (let w = 0; w < f; w++) {
          let b = p + (w / f) * Math.PI * 2;
          d(
            t.x - 40,
            t.y + 60,
            Math.cos(b) * 270,
            Math.abs(Math.sin(b)) * 270 + 60,
            20,
            0,
            l.orbKind,
          );
        }
        for (let w = 0; w < 4; w++)
          d(
            s.range(ce, ie + 80),
            -30,
            0,
            s.range(420, 520),
            22,
            0.5 + w * 0.25,
            l.orbKind,
          );
        break;
      }
    }
    ((t.cd = (2.5 - a * 1.35) * s.range(0.8, 1.2)),
      t.rageT > 0 && (t.cd *= 0.55),
      (t.cd = Math.max(
        0.55,
        t.cd /
          ((S = (y = e.director) == null ? void 0 : y.tempo) != null ? S : 1),
      )));
  }
  function q(e, n, t, a, i, r = 0) {
    let s = e.cam;
    ((s.sw = null),
      (s.tz = n),
      (s.tx = t),
      (s.ty = a),
      (s.troll = r),
      (s.hold = i));
  }
  function re(e, n, t, a, i = "inout", r = 0.5) {
    var o, l, u, c;
    let s = e.cam;
    ((s.sw = {
      sx: n.x,
      sy: n.y,
      sz: n.z,
      sr: (o = n.r) != null ? o : 0,
      ex: t.x,
      ey: t.y,
      ez: t.z,
      er: (l = t.r) != null ? l : 0,
      t: 0,
      dur: a,
      ease: i,
    }),
      (s.hold = a + r),
      (s.tz = t.z),
      (s.tx = t.x),
      (s.ty = t.y),
      (s.troll = (u = t.r) != null ? u : 0),
      (s.x = n.x),
      (s.y = n.y),
      (s.z = n.z),
      (s.roll = (c = n.r) != null ? c : 0));
  }
  function An(e, n, t) {
    N(e, "whoosh");
    let a = e.player,
      i = Math.max(M * 0.2, Math.min(M * 0.8, a.x));
    switch (n) {
      case 0:
        re(
          e,
          { x: i, y: 0, z: 1.55, r: t * 0.03 },
          { x: i, y: a.y - 70, z: 1.5 },
          1.8,
          "inout",
          0.6,
        );
        break;
      case 1:
        re(
          e,
          { x: 0, y: E * 0.5, z: 1.5, r: -0.035 },
          { x: M, y: E * 0.5, z: 1.5, r: 0.035 },
          2.6,
          "inout",
          0.3,
        );
        break;
      case 2:
        re(
          e,
          { x: M, y: E * 0.45, z: 1.5, r: 0.035 },
          { x: 0, y: E * 0.45, z: 1.5, r: -0.035 },
          2.6,
          "inout",
          0.3,
        );
        break;
      case 3:
        re(
          e,
          { x: M / 2 - t * M * 0.45, y: E * 0.5, z: 1.35, r: -t * 0.07 },
          { x: i, y: a.y - 50, z: 1.6, r: t * 0.02 },
          0.9,
          "out",
          0.8,
        );
        break;
      case 4:
        re(
          e,
          { x: M / 2, y: 0, z: 1.3, r: 0 },
          { x: M / 2, y: E, z: 1.3, r: 0 },
          2.8,
          "inout",
          0.2,
        );
        break;
      case 5:
        re(
          e,
          { x: a.x, y: a.y - 60, z: 2.1, r: t * 0.08 },
          { x: M / 2, y: E / 2, z: 1.12, r: 0 },
          2,
          "out",
          0.4,
        );
        break;
      case 6:
        re(
          e,
          { x: t > 0 ? M : 0, y: 0, z: 1.25, r: t * -0.05 },
          { x: e.sun.x, y: e.sun.y, z: 1.7, r: t * 0.03 },
          2,
          "in",
          0.5,
        );
        break;
      default:
        re(
          e,
          { x: i, y: E, z: 1.6, r: t * 0.04 },
          { x: i, y: E * 0.15, z: 1.4, r: -t * 0.03 },
          2.4,
          "inout",
          0.3,
        );
    }
  }
  function $n(e, n) {
    let t = ["255,220,90", "120,220,255", "255,120,220", "150,255,150"],
      a = t[Math.floor(j(e, 13) * t.length)],
      i = n.y - n.h * 0.5;
    (e.effects.push({
      kind: "glow",
      x: n.x,
      y: i,
      t: 0,
      life: 1.2,
      size: n.h * 1.3,
      variant: 0,
      color: a,
    }),
      e.effects.push({
        kind: "shock",
        x: n.x,
        y: i,
        t: 0,
        life: 0.9,
        size: n.h * 1.1,
        variant: 0,
        color: a,
      }));
    for (let r = 0; r < 4; r++)
      e.effects.push({
        kind: "shards",
        x: n.x + (r - 1.5) * 24,
        y: i + (r % 2) * 20,
        t: -r * 0.12,
        life: 1,
        size: n.h * 0.9,
        variant: r + 2,
        color: a,
      });
    e.effects.push({
      kind: "stars",
      x: n.x,
      y: i - n.h * 0.2,
      t: 0,
      life: 1.1,
      size: n.h * 0.8,
      variant: 0,
      color: a,
    });
  }
  function Bn(e, n) {
    let t = e.cam;
    t.hold -= n;
    let a = t.sw ? 1 : 0;
    if (((t.bars += (a - t.bars) * (1 - Math.exp(-n * 6))), t.sw)) {
      let r = t.sw;
      r.t += n;
      let s = Math.min(1, r.t / r.dur),
        o =
          r.ease === "out"
            ? 1 - Math.pow(1 - s, 3)
            : r.ease === "in"
              ? s * s * s
              : s < 0.5
                ? 4 * s * s * s
                : 1 - Math.pow(-2 * s + 2, 3) / 2;
      ((t.x = r.sx + (r.ex - r.sx) * o),
        (t.y = r.sy + (r.ey - r.sy) * o),
        (t.z = r.sz + (r.ez - r.sz) * o),
        (t.roll = r.sr + (r.er - r.sr) * o),
        t.hold <= 0 && (t.sw = null));
      return;
    }
    if (t.hold <= 0 && e.slowT <= 0)
      if (((t.next -= n), t.next <= 0 && e.phase === "play")) {
        let r = e.player,
          s = Math.floor(j(e, 9) * 8),
          o = j(e, 5) < 0.5 ? -1 : 1;
        if (j(e, 17) < 0.6) An(e, Math.floor(j(e, 19) * 8), o);
        else if (s === 0) q(e, 1.45, r.x, r.y - 60, 2.2, o * 0.02);
        else if (s === 1) q(e, 1.3, e.sun.x, e.sun.y, 2, 0);
        else if (s === 2)
          q(
            e,
            1.18,
            Math.max(M * 0.3, Math.min(M * 0.7, r.x + o * 260)),
            E * 0.55,
            2.4,
            o * 0.035,
          );
        else if (s === 3) q(e, 1.6, r.x, r.y - 90, 1.4, 0);
        else if (s === 4) q(e, 1.12, M / 2 + o * 160, E / 2, 2.6, o * 0.025);
        else {
          let l = e.monsters.filter(
              (c) => c.x > 120 && c.x < M - 60 && c.hp > 0,
            ),
            u = l.length ? l[Math.floor(j(e, 11) * l.length)] : null;
          u
            ? (q(e, 1.85, u.x, u.y - u.h * 0.4, 1.6, o * 0.03),
              s >= 6 && ((e.slowT = 1.3), (e.slowScale = 0.35)),
              $n(e, u))
            : q(e, 1.3, r.x, r.y - 80, 1.6, 0);
        }
        t.next = 2.5 + j(e, 7) * 3;
      } else t.hold <= 0 && t.tz !== 1 && q(e, 1, M / 2, E / 2, 0, 0);
    let i = 1 - Math.exp(-n * 3.2);
    ((t.z += (t.tz - t.z) * i),
      (t.x += (t.tx - t.x) * i),
      (t.y += (t.ty - t.y) * i),
      (t.roll += (t.troll - t.roll) * i));
  }
  function yt(e, n, t = Se) {
    var o, l, u, c, h, m, d, k, g;
    (Bn(e, t),
      e.slowT > 0 &&
        ((e.slowT = Math.max(0, e.slowT - t)),
        (t *=
          e.slowScale + (1 - e.slowScale) * (1 - Math.min(1, e.slowT / 0.4)))));
    let a = e.director;
    if ((a == null ? void 0 : a.result) === "timeup") return;
    if (a && !a.result) {
      let y =
        a.scenario.duration + (a.scenario.outcome === "natural" ? 0 : 1.5);
      if (e.time + t >= y) {
        ((e.time = y),
          (a.result = "timeup"),
          (a.resultAt = y),
          H(
            e,
            T(e.lang, "H\u1EBET GI\u1EDC", "TIME UP"),
            T(
              e.lang,
              "\u0110\xE3 \u0111\u1EE7 th\u1EDDi gian \u0111\xE3 ch\u1ECDn",
              "The chosen time is up",
            ),
            6,
          ));
        return;
      }
    }
    if (
      (e.tick++,
      (e.time += t),
      (t *= mn),
      skTick(e, t),
      (e.intent = (o = n.intent) != null ? o : e.intent),
      (e.shake = Math.max(0, e.shake - t * 1.6)),
      e.flash && ((e.flash.t -= t), e.flash.t <= 0 && (e.flash = null)),
      e.banner &&
        ((e.banner.t += t), e.banner.t > e.banner.life && (e.banner = null)),
      e.fadeFrom && ((e.fadeT -= t), e.fadeT <= 0 && (e.fadeFrom = null)),
      e.phase === "dead")
    ) {
      ((e.phaseT -= t),
        je(e, t),
        qe(e, t),
        e.phaseT <= 0 &&
          ((l = e.director) == null ? void 0 : l.result) !== "lose" &&
          Ln(e));
      return;
    }
    if (e.phase === "transition") {
      ((e.phaseT -= t),
        (e.sun.deathT += t),
        (e.speed =
          (250 + e.stage * 14) *
          ((c = (u = e.director) == null ? void 0 : u.tempo) != null ? c : 1)),
        (e.scroll += e.speed * t),
        ft(e, n, t),
        qe(e, t),
        je(e, t),
        (e.player.invuln = Math.max(e.player.invuln, 0.5)),
        e.phaseT <= 0 &&
          ((h = e.director) == null ? void 0 : h.result) !== "win" &&
          Hn(e));
      return;
    }
    if (
      (ct(e),
      (m = e.director) != null &&
        m.playerKillNow &&
        e.player.hp > 0 &&
        Me(e, 999, T(e.lang, "ki\u1EC7t s\u1EE9c", "exhaustion"), !0),
      e.phase !== "play" ||
        ((d = e.director) != null &&
          d.sunKillNow &&
          e.sun.hp > 0 &&
          ((e.sun.hp = Math.min(e.sun.hp, 1)),
          ve(e, 5, e.sun.x, e.sun.y),
          e.phase !== "play")))
    )
      return;
    let i = (g = (k = e.director) == null ? void 0 : k.tempo) != null ? g : 1;
    ((e.speed = (250 + e.stage * 14) * i),
      (e.scroll += e.speed * t),
      ft(e, n, t),
      Rn(e, n, t),
      (e.swarmNext -= t),
      e.swarmNext <= 0 &&
        e.swarmT <= 0 &&
        e.phase === "play" &&
        ((e.swarmT = 3.2),
        (e.swarmNext = 14 + j(e, 21) * 8),
        (e.bossBannerT = 0),
        (e.shake = Math.max(e.shake, 0.5)),
        e.floaters.push({
          text: "MONSTER HORDE!",
          x: M / 2,
          y: E * 0.3,
          t: 0,
          life: 1.8,
          color: "#ff7a3c",
          size: 56,
          vx: 0,
        }),
        q(e, 1, M / 2, E / 2, 3.4, 0)),
      e.swarmT > 0 &&
        ((e.swarmT -= t),
        (e.monsterT = Math.min(e.monsterT, 0)),
        e.monsters.length < 22 &&
          e.tick % 5 === 0 &&
          Ae(e, void 0, !1, (e.tick % 15) * 40)),
      (e.monsterT -= t));
    let r = Math.min(1, e.time / 40),
      s = 3 + Math.round(7 * r);
    if (
      e.monsterT <= 0 &&
      e.monsters.length < (e.swarmT > 0 ? 22 : s) &&
      e.swarmT <= 0
    ) {
      let y = r < 1 ? e.rng.int(1, 2) : e.rng.int(2, 4);
      for (let S = 0; S < y && e.monsters.length < s; S++)
        Ae(e, void 0, !1, S * 170);
      e.monsterT =
        (e.rng.range(2.2, 3.6) * (1 + (1 - r) * 0.9)) /
        ((1 + e.stage * 0.1) * i);
    }
    ((e.platformT -= t),
      e.platformT <= 0 && (Tn(e), (e.platformT = e.rng.range(7, 13))),
      (e.coinT -= t),
      e.coinT <= 0 && (xn(e), (e.coinT = e.rng.range(3.5, 7))),
      (e.eventT -= t),
      e.eventT <= 0 && (In(e), (e.eventT = e.rng.range(13, 24))),
      En(e, t),
      qe(e, t),
      Gn(e, t),
      je(e, t));
  }
  function Ln(e) {
    var n, t;
    ((e.bestScore = Math.max(e.bestScore, e.score)),
      e.run++,
      (e.player = R(L({}, mt()), {
        gun: Math.max(0, e.player.gun - 2),
        invuln: 2.5,
        haloT: 3,
      })),
      (e.monsters = []),
      (e.bullets = []),
      (e.fireballs = []),
      (e.bolts = []),
      (e.meteors = []),
      (e.sun = Ve(
        e.stage,
        (t = (n = e.director) == null ? void 0 : n.hpScale) != null ? t : 1,
      )),
      (e.phase = "play"),
      N(e, "respawn"),
      (e.ai = R(L({}, e.ai), { intent: "H\u1ED3i sinh", seenBolts: {} })),
      H(
        e,
        T(e.lang, `L\u01B0\u1EE3t ${e.run}`, `Run ${e.run}`),
        T(
          e.lang,
          "T\u01B0\u1EDBng qu\xE2n quay l\u1EA1i!",
          "The general is back!",
        ),
      ));
  }
  function Hn(e) {
    var n, t;
    (e.stage++,
      (e.fadeFrom = e.plan.scenery),
      (e.fadeT = 1.4),
      (e.plan = Be(e.manifest, e.seed, e.stage, e.firstScenery, e.monsterIds)),
      (e.sun = Ve(
        e.stage,
        (t = (n = e.director) == null ? void 0 : n.hpScale) != null ? t : 1,
      )),
      ht(e),
      (e.monsters = []),
      (e.bullets = []),
      (e.platforms = []),
      (e.phase = "play"),
      (e.player.hp = Math.min(e.player.maxHp, e.player.hp + 30)),
      (e.ai = R(L({}, e.ai), { seenBolts: {} })),
      (e.bossBannerT = 2.6),
      N(e, "stage"),
      N(e, "roar"),
      H(
        e,
        `${T(e.lang, "M\xE0n", "Stage")} ${e.stage + 1} \xB7 ${e.plan.scenery.id}`,
        T(
          e.lang,
          `${z(e)} m\u1EDBi, c\u01A1n gi\u1EADn m\u1EDBi`,
          `New ${z(e)}, new rage`,
        ),
      ));
  }
  function Rn(e, n, t) {
    let a = e.player;
    if (
      ((a.fireCd -= t),
      (a.doubleT = Math.max(0, a.doubleT - t)),
      !n.fire || !n.aim || a.fireCd > 0)
    )
      return;
    let i = we(a),
      r = Math.atan2(n.aim.y - i.y, n.aim.x - i.x);
    ((r = Math.max(-1.35, Math.min(0.5, r))), (a.facingAngle = r));
    let s = vn(a.gun);
    N(e, "shoot");
    let o = (l, u = 0) => {
      e.bullets.push({
        x: i.x,
        y: i.y + u,
        vx: Math.cos(l) * 1e3,
        vy: Math.sin(l) * 1e3,
        dmg: s,
        idx: Math.min(a.gun, e.manifest.bullets.length - 1),
        life: 1.6,
        pierce: a.gun >= 5 ? 1 : 0,
        hitIds: [],
        angle: l,
      });
    };
    (o(r),
      a.doubleT > 0 && (o(r - 0.09, -8), o(r + 0.09, 8)),
      (a.fireCd = Sn(a.gun)));
  }
  function ft(e, n, t) {
    let a = e.player;
    ((a.invuln = Math.max(0, a.invuln - t)),
      (a.haloT = Math.max(0, a.haloT - t)),
      (a.reverseT = Math.max(0, a.reverseT - t)),
      (a.hurtFlash = Math.max(0, a.hurtFlash - t)),
      (a.meteorT = Math.max(0, a.meteorT - t)));
    let r = ((n.right ? 1 : 0) - (n.left ? 1 : 0)) * Ue;
    if (
      ((a.vx += (r - a.vx) * Math.min(1, t * 10)),
      (a.x += a.vx * t),
      (a.x = Math.max(ce, Math.min(ie, a.x))),
      n.jump && !a.jumpHeld && a.jumpsLeft > 0)
    ) {
      let o = a.jumpsLeft === 2;
      (N(e, o ? "jump" : "jump2"),
        (a.vy = o ? -860 : -740),
        a.jumpsLeft--,
        (a.onGround = !1),
        (a.standing = null),
        A(e, "dust", a.x - 20, a.y, 70, 0.35));
    }
    a.jumpHeld = n.jump;
    let s = a.y;
    if (
      ((a.vy += 2100 * t),
      (a.y += a.vy * t),
      (a.runPhase += t * (6 + e.speed / 60)),
      a.standing)
    ) {
      let o = a.standing;
      Math.abs(a.x - o.x) > o.w / 2 + 22
        ? (a.standing = null)
        : ((a.y = o.y), (a.vy = 0));
    }
    if (!a.standing && a.vy >= 0) {
      for (let o of e.platforms)
        if (s <= o.y + 8 && a.y >= o.y && Math.abs(a.x - o.x) < o.w / 2 + 14) {
          ((a.y = o.y),
            (a.vy = 0),
            (a.standing = o),
            (a.onGround = !0),
            (a.jumpsLeft = 2),
            A(e, "dust", a.x, a.y, 60, 0.3));
          break;
        }
    }
    (a.y >= P && !a.standing
      ? (a.onGround || A(e, "dust", a.x, P, 60, 0.3),
        (a.y = P),
        (a.vy = 0),
        (a.onGround = !0),
        (a.jumpsLeft = 2))
      : a.standing
        ? (a.onGround = !0)
        : ((a.onGround = !1), a.jumpsLeft === 2 && (a.jumpsLeft = 1)),
      a.meteorT > 0 &&
        ((a.meteorCd -= t),
        a.meteorCd <= 0 &&
          ((a.meteorCd = 0.16),
          e.meteors.push({
            x: e.rng.range(280, M + 100),
            y: -60,
            vx: -320,
            vy: 760,
            variant: e.rng.int(0, 2),
          }))));
  }
  var wt = {
    "aqua-turtle": { t: "arc", color: "90,190,255", n: 3 },
    "cherry-bomber": { t: "arc", color: "255,70,110", r: 22 },
    "cone-zombie": { t: "arc", color: "255,160,60" },
    slattern: { t: "arc", color: "190,100,255", r: 20 },
    minions: { t: "arc", color: "255,225,50", n: 3 },
    medusa: { t: "wave", color: "90,255,110", n: 5 },
    vampire: { t: "wave", color: "220,50,90", n: 6, r: 10 },
    "hello-kitty": { t: "wave", color: "255,130,190", n: 4 },
    cloverfield: { t: "wave", color: "170,130,90", n: 4 },
    "leaf-saurian": { t: "wave", color: "110,230,90", n: 4, shape: "needle" },
    "volt-mouse": { t: "wave", color: "255,235,60", n: 4 },
    "ember-salamander": { t: "wave", color: "255,110,30", n: 5 },
    "gatling-pea": { t: "straight", color: "120,240,80", n: 6 },
    "needle-cactus": {
      t: "spread",
      color: "200,255,170",
      n: 5,
      shape: "needle",
    },
    "fire-mole": { t: "straight", color: "255,130,30", n: 3 },
    "ice-worm": { t: "straight", color: "150,215,255", n: 3 },
    "shadow-imp": { t: "spread", color: "170,90,255", n: 3 },
    "venom-toad": { t: "arc", color: "140,255,60", n: 3 },
    "storm-ogre": { t: "rain", color: "255,240,120", n: 4 },
    "thorn-chomper": { t: "quake", color: "90,220,70" },
    minotaur: { t: "quake", color: "230,170,100" },
    "steel-golem": { t: "quake", color: "140,210,255" },
    godzilla: { t: "beam", color: "90,210,255" },
  };
  function Dn(e, n) {
    var k;
    let t = wt[n.def.id],
      a = e.player,
      i = n.x - n.w * 0.35,
      r = n.y - n.h * 0.1,
      s = a.x,
      o = a.y - 70,
      l = (g) =>
        e.fireballs.push(L({ reflected: !1, age: 0, kind: "fire" }, g));
    if (!t) {
      if (n.def.kind === "fly")
        for (let g = -1; g <= 1; g++) {
          let y = Math.atan2(o - r, s - i) + g * 0.22;
          l({
            x: i,
            y: r,
            vx: Math.cos(y) * 430,
            vy: Math.sin(y) * 430,
            r: 13,
            color: "255,200,90",
            dmg: 10,
          });
        }
      else A(e, "dust", n.x, P, n.w * 1.4, 0.5);
      return;
    }
    let u = t.t === "quake" || t.t === "beam" ? 0 : (k = t.n) != null ? k : 3,
      c = (t.t !== "quake" && t.t !== "beam" && t.r) || 16,
      h = (t.t !== "quake" && t.t !== "beam" && t.dmg) || 10,
      m = t.t !== "quake" && t.t !== "beam" ? t.shape : void 0,
      d = Math.atan2(o - r, s - i);
    switch (t.t) {
      case "arc": {
        for (let g = 0; g < u; g++) {
          let y = 0.75 + g * 0.12,
            S = 1300,
            f = (s + (g - (u - 1) / 2) * 90 - i) / y,
            p = (o - r - 0.5 * S * y * y) / y;
          l({
            x: i,
            y: r,
            vx: f,
            vy: p,
            r: c,
            g: S,
            color: t.color,
            dmg: h,
            age: -g * 0.12,
          });
        }
        break;
      }
      case "straight":
        for (let g = 0; g < u; g++)
          l({
            x: i,
            y: r,
            vx: Math.cos(d) * 620,
            vy: Math.sin(d) * 620,
            r: c - 4,
            color: t.color,
            dmg: 8,
            age: -g * 0.1,
            shape: m,
          });
        break;
      case "spread":
        for (let g = 0; g < u; g++) {
          let y = d + (g - (u - 1) / 2) * 0.2;
          l({
            x: i,
            y: r,
            vx: Math.cos(y) * 520,
            vy: Math.sin(y) * 520,
            r: c - 6,
            color: t.color,
            dmg: 8,
            shape: m,
          });
        }
        break;
      case "wave":
        for (let g = 0; g < u; g++) {
          let y = d + (g - (u - 1) / 2) * 0.1;
          l({
            x: i,
            y: r,
            vx: Math.cos(y) * 470,
            vy: Math.sin(y) * 470,
            r: c - 3,
            wave: 170,
            ph: g * 1.3,
            color: t.color,
            dmg: h,
            age: -g * 0.07,
            shape: m,
          });
        }
        break;
      case "rain":
        for (let g = 0; g < u; g++) {
          let y = s + (g - (u - 1) / 2) * 110 + e.rng.range(-30, 30);
          l({
            x: y,
            y: -40,
            vx: 0,
            vy: 760,
            r: 18,
            color: t.color,
            dmg: 14,
            age: -g * 0.18,
            shape: "needle",
          });
        }
        A(e, "lightning", i, r, 260, 0.4);
        break;
      case "quake":
        for (let g = 0; g < 4; g++)
          l({
            x: Math.max(80, i - 90 - g * 130),
            y: P - 70,
            vx: 0,
            vy: 0,
            r: 52,
            color: t.color,
            dmg: 14,
            age: -(0.45 + g * 0.22),
            shape: "pillar",
          });
        e.shake = Math.max(e.shake, 0.3);
        break;
      case "beam":
        (l({
          x: i,
          y: r,
          vx: -980,
          vy: 0,
          r: 34,
          color: t.color,
          dmg: 22,
          age: -0.5,
          shape: "beam",
        }),
          l({
            x: i,
            y: r,
            vx: -980,
            vy: 0,
            r: 34,
            color: t.color,
            dmg: 22,
            age: -0.7,
            shape: "beam",
          }));
        break;
    }
  }
  function qe(e, n) {
    var i, r, s;
    let t = e.player,
      a = e.speed;
    for (let o of e.monsters.slice()) {
      ((o.age += n), (o.flash = Math.max(0, o.flash - n)), (o.cooldown -= n));
      let l = t.x - o.x;
      if (o.state === "attack") {
        if (((o.stateT -= n), wt[o.def.id])) o.x -= (a * 0.6 + o.ownVx) * n;
        else if (o.def.kind === "walk") o.x -= (a + o.ownVx + 260) * n;
        else {
          o.x -= (a + o.ownVx + 160) * n;
          let u = t.y - 70;
          o.y += (u - o.y) * Math.min(1, n * 3);
        }
        o.stateT <= 0 &&
          ((o.state = "move"),
          (o.cooldown = e.rng.range(2, 3.5)),
          (o.dmgDone = !1));
      } else
        ((o.x -= (a * 0.55 + o.ownVx) * n),
          o.def.kind === "fly"
            ? (o.y = o.baseY + Math.sin(o.age * 2.2 + o.phase) * 38)
            : (o.y = o.baseY + Math.abs(Math.sin(o.age * 6 + o.phase)) * -4),
          o.cooldown <= 0 &&
            l > -80 &&
            l < 560 &&
            ((o.state = "attack"),
            (o.stateT = o.def.attack.length ? 0.8 : 0.6),
            (o.age = 0),
            (o.dmgDone = !1),
            (e.shake = Math.max(e.shake, 0.2)),
            A(e, "ring", o.x, o.y, o.h * 1.1, 0.45),
            o.def.kind === "walk" && A(e, "ring", o.x, P + 4, o.w * 1.2, 0.5),
            Dn(e, o)));
      o.x < -o.w && (e.monsters = e.monsters.filter((u) => u !== o));
    }
    for (let o of e.bullets.slice())
      ((o.x += o.vx * n),
        (o.y += o.vy * n),
        (o.life -= n),
        (o.life <= 0 || o.x > M + 80 || o.y < -80 || o.y > E + 40) &&
          (e.bullets = e.bullets.filter((l) => l !== o)));
    for (let o of e.fireballs.slice())
      if (((o.age += n), !(o.age < 0))) {
        if (
          (o.g && (o.vy += o.g * n),
          (o.x += o.vx * n),
          (o.y += o.vy * n),
          o.wave &&
            (o.y +=
              Math.cos(o.age * 9 + ((i = o.ph) != null ? i : 0)) * o.wave * n),
          o.shape === "pillar")
        ) {
          let l = e.player;
          (o.age > 0.1 &&
            o.age < 0.4 &&
            !o.reflected &&
            l.invuln <= 0 &&
            l.haloT <= 0 &&
            Math.abs(o.x - l.x) < o.r + 30 &&
            l.y > P - 70 &&
            (pt(
              e,
              l.x,
              l.y - 90,
              (r = o.color) != null ? r : "255,150,60",
              "pillar",
            ),
            Me(
              e,
              (s = o.dmg) != null ? s : 14,
              T(e.lang, "c\u1ED9t \u0111\u1EA5t", "rock spike"),
            )),
            o.age > 0.5 && (e.fireballs = e.fireballs.filter((u) => u !== o)));
          continue;
        }
        if (!o.reflected && !o.nm && o.age >= 0 && o.shape !== "beam") {
          let l = e.player;
          if ((o.x - o.vx * n - l.x) * (o.x - l.x) <= 0) {
            o.nm = !0;
            let c = Math.abs(o.y - (l.y - 70));
            c > 40 &&
              c < 120 &&
              l.invuln <= 0 &&
              ((e.slowT = 0.9),
              (e.slowScale = 0.3),
              q(e, 1.55, l.x, l.y - 70, 0.9, 0.02),
              (e.comboT = 3),
              (e.flash = { color: "rgba(120,220,255,0.25)", t: 0.3 }),
              A(e, "ring", l.x, l.y - 70, 150, 0.5),
              he(e, "NEAR MISS!", l.x, l.y - 170, "#7fe3ff", 36, 1));
          }
        }
        if (!o.reflected && o.age >= 0 && o.y > P + 10) {
          (A(e, "boom", o.x, P, 70, 0.25),
            (e.fireballs = e.fireballs.filter((l) => l !== o)));
          continue;
        }
        (o.x < -80 || o.y > E + 80 || o.x > M + 200 || o.y < -200) &&
          (e.fireballs = e.fireballs.filter((l) => l !== o));
      }
    for (let o of e.bolts.slice()) {
      if (o.delay > 0) {
        o.delay -= n;
        continue;
      }
      ((o.t += n),
        o.t > o.warn + o.strike && (e.bolts = e.bolts.filter((l) => l !== o)));
    }
    for (let o of e.pickups.slice()) {
      if (((o.age += n), o.gravity)) {
        ((o.vy += 1500 * n), (o.x += o.vx * n), (o.y += o.vy * n));
        let l = P - 40;
        (o.y >= l &&
          ((o.y = l),
          (o.vy *= -0.35),
          (o.vx *= 0.7),
          Math.abs(o.vy) < 90 && ((o.vy = 0), (o.gravity = !1), (o.vx = 0))),
          (o.x -= a * n * 0.5));
      } else o.x -= a * n;
      if (o.kind === "coin") {
        let l = t.x,
          u = t.y - 70,
          c = Math.hypot(o.x - l, o.y - u);
        c < 130 &&
          e.phase === "play" &&
          ((o.x += ((l - o.x) / c) * 520 * n),
          (o.y += ((u - o.y) / c) * 520 * n));
      }
      (o.x < -80 || o.y > E + 60) &&
        (e.pickups = e.pickups.filter((l) => l !== o));
    }
    for (let o of e.platforms.slice())
      ((o.x -= a * n),
        (o.bobPhase += n * 1.6),
        o.bobAmp && (o.y = o.baseY + Math.sin(o.bobPhase) * o.bobAmp),
        o.x < -o.w &&
          ((e.platforms = e.platforms.filter((l) => l !== o)),
          t.standing === o && (t.standing = null)));
    for (let o of e.meteors.slice())
      if (((o.x += o.vx * n), (o.y += o.vy * n), o.y >= P - 20)) {
        (A(e, "boom", o.x, P - 40, 190, 0.5),
          (e.shake = Math.max(e.shake, 0.15)));
        for (let l of e.monsters.slice())
          Math.hypot(l.x - o.x, l.y - (P - 60)) < 150 &&
            $e(e, l, 55 + e.stage * 15);
        e.meteors = e.meteors.filter((l) => l !== o);
      }
  }
  function Gn(e, n) {
    var i, r;
    let t = e.player,
      a = kn(t);
    for (let s of e.bullets.slice()) {
      let o = !1;
      for (let l of e.monsters.slice()) {
        if (s.hitIds.includes(l.uid)) continue;
        let u = Ee(l);
        if (s.x > u.x && s.x < u.x + u.w && s.y > u.y && s.y < u.y + u.h)
          if (
            (s.hitIds.push(l.uid),
            A(e, "hit", s.x, s.y, 70, 0.22, s.idx),
            $e(e, l, s.dmg),
            s.pierce > 0)
          )
            s.pierce--;
          else {
            o = !0;
            break;
          }
      }
      if (o) {
        e.bullets = e.bullets.filter((l) => l !== s);
        continue;
      }
      for (let l of e.fireballs.slice())
        if (
          !(l.age < 0 || l.reflected) &&
          Math.hypot(l.x - s.x, l.y - s.y) < l.r + 12
        ) {
          (A(e, "boom", l.x, l.y, 90, 0.3),
            (e.fireballs = e.fireballs.filter((u) => u !== l)),
            (e.score += 30),
            (o = !0));
          break;
        }
      if (o) {
        e.bullets = e.bullets.filter((l) => l !== s);
        continue;
      }
      Math.hypot(e.sun.x - s.x, e.sun.y - s.y) < 92 * e.sun.scale &&
        (A(e, "hit", s.x, s.y, 80, 0.22, s.idx),
        ve(e, s.dmg, s.x, s.y),
        (e.bullets = e.bullets.filter((l) => l !== s)));
    }
    for (let s of e.monsters)
      if (
        (s.state !== "attack" && s.def.kind === "fly" && s.state, Mn(a, Ee(s)))
      ) {
        let o = s.elite ? 20 : 12;
        Me(e, o, s.def.id);
      }
    for (let s of e.bolts)
      if (!(s.delay > 0 || s.t < s.warn || s.hit)) {
        (s.t >= s.warn &&
          s.t - n < s.warn &&
          (A(e, "ring", s.x, P + 4, 160, 0.4),
          (e.shake = Math.max(e.shake, 0.25))),
          Math.abs(t.x - s.x) < s.half &&
            ((s.hit = !0),
            t.reverseT > 0
              ? (A(e, "lightning", e.sun.x, e.sun.y, 520, 0.45),
                ve(e, 85 + e.stage * 30, e.sun.x, e.sun.y),
                he(
                  e,
                  T(e.lang, "PH\u1EA2N \u0110\xD2N", "COUNTER"),
                  t.x,
                  t.y - 180,
                  "#7dd3fc",
                ))
              : Me(e, 24, T(e.lang, "s\xE9t", "lightning"))));
        for (let o of e.monsters.slice())
          Math.abs(o.x - s.x) < s.half && !s.hit && $e(e, o, 40);
      }
    for (let s of e.fireballs.slice()) {
      if (s.age < 0) continue;
      if (s.reflected) {
        Math.hypot(s.x - e.sun.x, s.y - e.sun.y) < 110 * e.sun.scale &&
          (A(e, "boom", s.x, s.y, 140, 0.4),
          ve(e, 70 + e.stage * 25, s.x, s.y),
          (e.fireballs = e.fireballs.filter((l) => l !== s)));
        continue;
      }
      if (
        s.x > a.x - s.r &&
        s.x < a.x + a.w + s.r &&
        s.y > a.y - s.r &&
        s.y < a.y + a.h + s.r
      )
        if (t.reverseT > 0) {
          s.reflected = !0;
          let l = e.sun.x - s.x,
            u = e.sun.y - s.y,
            c = Math.hypot(l, u);
          ((s.vx = (l / c) * 700),
            (s.vy = (u / c) * 700),
            he(
              e,
              T(e.lang, "PH\u1EA2N \u0110\xD2N", "COUNTER"),
              t.x,
              t.y - 180,
              "#7dd3fc",
            ));
        } else
          t.invuln <= 0 &&
            t.haloT <= 0 &&
            (A(e, "boom", s.x, s.y, 110, 0.35),
            pt(
              e,
              t.x,
              t.y - 90,
              (i = s.color) != null ? i : "255,150,60",
              s.shape,
            ),
            (e.fireballs = e.fireballs.filter((l) => l !== s)),
            Me(
              e,
              (r = s.dmg) != null ? r : 16,
              T(e.lang, "\u0111\xF2n qu\xE1i", "monster attack"),
            ));
    }
    for (let s of e.pickups.slice())
      Math.hypot(s.x - t.x, s.y - (t.y - 80)) < (s.kind === "coin" ? 62 : 80) &&
        (Cn(e, s), (e.pickups = e.pickups.filter((l) => l !== s)));
  }
  function je(e, n) {
    var t;
    for (let a of e.effects.slice())
      ((a.t += n),
        a.t >= a.life && (e.effects = e.effects.filter((i) => i !== a)));
    (e.comboT > 0 && ((e.comboT -= n), e.comboT <= 0 && (e.combo = 0)),
      (e.comboPop = Math.max(0, e.comboPop - n * 5)),
      (e.bossBannerT = Math.max(0, e.bossBannerT - n)));
    for (let a of e.floaters.slice())
      ((a.t += n),
        (a.y -= 46 * n),
        (a.x += ((t = a.vx) != null ? t : 0) * n),
        a.t >= a.life && (e.floaters = e.floaters.filter((i) => i !== a)));
  }
  var zn = {
    balanced: "C\xE2n b\u1EB1ng",
    sniper: "X\u1EA1 th\u1EE7",
    collector: "Th\u1EE3 nh\u1EB7t",
    daredevil: "Li\u1EC1u m\u1EA1ng",
  };
  function kt(e) {
    return zn[e.ai.style];
  }
  var Nn = {
    coin: 1,
    gun: 14,
    double: 9,
    halo: 9,
    reverse: 8,
    lightning: 11,
    meteor: 9,
    heal: 0,
  };
  function Kn(e, n) {
    return n.kind === "heal"
      ? e.player.hp < 70
        ? 14
        : 2
      : n.kind === "gun" && n.gunIdx <= e.player.gun
        ? 1
        : Nn[n.kind];
  }
  function On(e) {
    var a, i;
    let n = e.ai,
      t = [];
    for (let r of e.bolts) {
      let s = r.delay > 0 ? r.delay + r.warn : r.warn - r.t,
        o = r.delay > 0 ? 0 : r.t,
        l = (i = (a = e.director) == null ? void 0 : a.fail) != null ? i : 0;
      (l > 0 && r.seed % 100 < l * 70) ||
        (o < n.reaction + l * 0.5 && r.t < r.warn) ||
        (r.delay > 0 ? r.delay + r.warn : r.warn - r.t) < -r.strike ||
        t.push({
          x: r.x,
          eta: Math.max(0, s),
          half: r.half + n.margin * 0.3,
          weight: 1,
        });
    }
    for (let r of e.fireballs) {
      if (r.age < 0 || r.reflected) continue;
      let s = P - 90;
      if (r.vy <= 1) continue;
      let o = (s - r.y) / r.vy;
      o < 0 ||
        o > 1.4 ||
        t.push({ x: r.x + r.vx * o, eta: o, half: r.r + 50, weight: 0.8 });
    }
    return t;
  }
  function Fn(e) {
    let n = e.player,
      t = null,
      a = 1 / 0;
    for (let i of e.monsters) {
      if (i.x < n.x - 40 || i.x > 1250) continue;
      let r = i.x - n.x,
        s = i.y - (n.y - 100);
      if (Math.atan2(Math.abs(s), Math.max(1, r)) > 1.2) continue;
      let o = r - (i.state === "attack" ? 160 : 0) + (i.elite ? -40 : 0);
      o < a && ((a = o), (t = i));
    }
    return t;
  }
  function Wn(e, n) {
    let t = we(e.player),
      i = Math.hypot(n.x - t.x, n.y - t.y) / 1e3,
      r = -(e.speed * 0.55 + n.ownVx + (n.state === "attack" ? 200 : 0));
    return { x: n.x + r * i, y: n.y };
  }
  function _e(e) {
    let n = e.player,
      t = we(n);
    for (let s of e.fireballs)
      if (
        !(s.age < 0 || s.reflected) &&
        s.x > t.x &&
        s.x < t.x + 560 &&
        Math.abs(s.y - t.y) < 280
      )
        return { x: s.x, y: s.y, kind: "fireball" };
    let a = Fn(e);
    if (a) {
      let s = Wn(e, a);
      return R(L({}, s), { kind: "monster" });
    }
    let r = Math.hypot(e.sun.x - t.x, e.sun.y - t.y) / 1e3;
    return { x: e.sun.x, y: e.sun.y + 10 + r * 0, kind: "sun" };
  }
  function qn(e) {
    let n = e.player,
      t = e.ai,
      a = null,
      i = 0;
    for (let r of e.pickups) {
      if (r.x < n.x - 30 || r.x > n.x + 640) continue;
      let s = Kn(e, r) * t.pickupWeight;
      if (s <= 0) continue;
      let o = P - 70 - r.y;
      if (o > 270) continue;
      let l = Math.abs(r.x - n.x),
        u = s / (l * 0.01 + 1.2) - o * 0.003;
      u > i && ((i = u), (a = r));
    }
    return a;
  }
  function Mt(e) {
    let n = e.player,
      t = e.ai,
      a = t.rng,
      i = On(e),
      r = _e(e),
      s = {
        left: !1,
        right: !1,
        jump: !1,
        fire: e.phase === "play",
        aim: { x: r.x, y: r.y },
      },
      o = qn(e),
      l = n.x,
      u = 1 / 0,
      c =
        r.kind === "sun"
          ? "B\u1EAFn boss"
          : r.kind === "monster"
            ? "Di\u1EC7t qu\xE1i"
            : "B\u1EAFn c\u1EA7u l\u1EEDa",
      h = e.monsters.filter((f) => f.def.kind === "walk" && f.x > n.x - 60),
      d = 400 + Math.sin(e.time * 0.4 + t.wanderPhase) * t.wanderAmp;
    for (let f = ce; f <= ie; f += 16) {
      let p = Math.abs(f - n.x) / Ue,
        w = Math.abs(f - n.x) * 0.12 + Math.abs(f - d) * 0.16;
      for (let b of i) {
        let x = Math.abs(f - b.x);
        (b.eta + 0.1 < p * 0.6 && Math.abs(n.x - b.x) > b.half) ||
          (x < b.half
            ? (w +=
                (b.eta < 0.8 ? 9e3 : 2500) *
                b.weight *
                (1 - x / (b.half * 1.5)))
            : x < b.half + 50 && (w += 80 * b.weight));
      }
      for (let b of h) {
        let x = b.x - b.def.size[0] * 0 - f;
        x > -40 &&
          x < 230 &&
          !(n.vy < 0) &&
          (w += 160 * (1 - Math.max(0, x) / 260));
      }
      for (let b of e.monsters)
        b.def.kind === "fly" &&
          Math.abs(b.x - f) < 110 &&
          b.y > n.y - 260 &&
          (w += 110);
      if (o) {
        let b = p,
          x = o.x - e.speed * b;
        w -= 360 * Math.exp(-(((f - x) / 120) ** 2)) * t.pickupWeight * 0.8;
      }
      w < u && ((u = w), (l = f));
    }
    i.some((f) => Math.abs(n.x - f.x) < f.half + 20 && f.eta < 0.9)
      ? (c = "N\xE9 s\xE9t")
      : o &&
        Math.abs(l - o.x) < 160 &&
        (c =
          o.kind === "coin" ? "Nh\u1EB7t xu" : "Nh\u1EB7t v\u1EADt ph\u1EA9m");
    let g = l - n.x;
    Math.abs(g) > 14 && ((s.right = g > 0), (s.left = g < 0));
    let y = !1,
      S = n.jumpsLeft > 0;
    for (let f of h) {
      let p = Ee(f),
        w = e.speed * 0.55 + f.ownVx + (f.state === "attack" ? 260 : 0),
        b = p.x - (n.x + 55),
        x = b / w;
      (b > -60 &&
        x < 0.5 &&
        n.y > P - 40 &&
        ((y = !0), (c = "Nh\u1EA3y qua qu\xE1i")),
        n.jumpsLeft === 1 &&
          !n.onGround &&
          b > -60 &&
          b < 70 &&
          n.y > P - 90 &&
          (y = !0));
    }
    for (let f of e.monsters)
      f.def.kind === "fly" &&
        f.state === "attack" &&
        Math.abs(f.x - n.x) < 150 &&
        Math.abs(f.y - (n.y - 70)) < 120 &&
        n.onGround &&
        ((y = !0), (c = "Tr\xE1nh qu\xE1i bay"));
    if (o) {
      let f = n.y - 70 - o.y,
        p = Math.abs(o.x - n.x) < 190 && o.x > n.x - 30;
      (f > 40 &&
        p &&
        n.onGround &&
        ((y = !0), (c = "Nh\u1EA3y nh\u1EB7t \u0111\u1ED3")),
        f > 150 &&
          !n.onGround &&
          n.vy > -150 &&
          n.jumpsLeft > 0 &&
          p &&
          (y = !0));
    }
    for (let f of e.platforms) {
      if (!n.onGround || n.standing) continue;
      let p = f.x - n.x;
      Math.abs(p) < 120 &&
        P - f.y <= 125 &&
        e.pickups.some((w) => Math.abs(w.x - f.x) < f.w / 2 && w.y < f.y) &&
        ((y = !0), (c = "L\xEAn b\u1EE5c nh\u1EB7t xu"));
    }
    return (
      !y &&
        n.onGround &&
        i.length === 0 &&
        a.next() < t.hopChance * 0.012 &&
        ((y = !0), (c = "Nh\u1EA3y m\xFAa")),
      t.holdJump > 0 && t.holdJump--,
      y && S && !n.jumpHeld && ((s.jump = !0), (t.holdJump = 2)),
      n.jumpHeld && !y && (s.jump = !1),
      n.onGround &&
        n.standing &&
        !o &&
        ((s.left = !0), (c = "Xu\u1ED1ng b\u1EE5c")),
      (t.intent = c),
      (s.intent = c),
      s
    );
  }
  var fe = null;
  function It(e) {
    fe = e;
  }
  function vt(e, n, t, a, i, r) {
    let s = r.size;
    e.font = `800 ${s}px ${i}`;
    let o = e.measureText(n).width;
    r.maxWidth &&
      o > r.maxWidth &&
      ((s = Math.floor((s * r.maxWidth) / o)), (e.font = `800 ${s}px ${i}`));
    let l = Array.from(n),
      u = l.map((m) => e.measureText(m).width),
      c = u.reduce((m, d) => m + d, 0),
      h = r.align === "left" ? t : t - c / 2;
    (e.save(),
      (e.textAlign = "left"),
      (e.lineJoin = "round"),
      l.forEach((m, d) => {
        var S;
        let k = Math.sin(r.t * 9 + d * 0.7) * ((S = r.wave) != null ? S : 0),
          g = Math.sin(r.t * 7 + d * 0.9) * 0.05 * (r.wave ? 1 : 0);
        (e.save(),
          e.translate(h + u[d] / 2, a + k),
          e.rotate(g),
          (e.shadowColor = r.glow),
          (e.shadowBlur = s * 0.5),
          (e.lineWidth = s * 0.3),
          (e.strokeStyle = r.glow),
          e.strokeText(m, -u[d] / 2, 0),
          (e.shadowBlur = 0),
          (e.lineWidth = s * 0.2),
          (e.strokeStyle = r.edge),
          e.strokeText(m, -u[d] / 2, 0),
          (e.fillStyle = "rgba(0,0,0,0.55)"),
          e.fillText(m, -u[d] / 2 + s * 0.04, s * 0.07));
        let y = e.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
        (y.addColorStop(0, r.colors[0]),
          y.addColorStop(0.5, r.colors[1]),
          y.addColorStop(1, r.colors[2]),
          (e.fillStyle = y),
          e.fillText(m, -u[d] / 2, 0),
          e.restore(),
          (h += u[d]));
      }),
      e.restore());
  }
  var jn = (e) => 1 + 3.2 * Math.pow(e - 1, 3) + 2.2 * Math.pow(e - 1, 2),
    le = (e) => {
      let n = Math.sin(e * 127.1 + 311.7) * 43758.5453;
      return n - Math.floor(n);
    };
  function G(e, n) {
    return e.get(n);
  }
  function St(e, n, t, a, i) {
    (e.save(), (e.globalAlpha = i));
    let r = t.layers,
      s = r.sky && G(n, r.sky.src);
    s
      ? e.drawImage(s, 0, 0, M, E)
      : ((e.fillStyle = "#9ad1ff"), e.fillRect(0, 0, M, E));
    let o = [
      ["mountain-far", 0.04, 360, 600],
      ["far", 0.1, 330, 610],
      ["mountain-mid", 0.12, 380, 620],
      ["mid", 0.28, 400, 640],
      ["mountain-near", 0.2, 400, 650],
      ["near", 0.55, 360, 665],
    ];
    for (let [c, h, m, d] of o) {
      let k = r[c],
        g = k && G(n, k.src);
      if (!g) continue;
      let y = (k.size[0] * m) / k.size[1],
        S = a * h;
      for (let f = Math.floor(S / y); f * y - S < M; f++) {
        let p = Math.floor(f * y - S);
        f % 2 === 0
          ? e.drawImage(g, p, d - m, Math.ceil(y) + 1, m)
          : (e.save(),
            e.translate(p + Math.ceil(y) + 1, 0),
            e.scale(-1, 1),
            e.drawImage(g, 0, d - m, Math.ceil(y) + 1, m),
            e.restore());
      }
    }
    let l = r.road && G(n, r.road.src),
      u = P - 22;
    if (l) {
      let c = E - u,
        h = (r.road.size[0] * c) / r.road.size[1],
        m = -(a % h),
        d = n.getWhiteTopRows(r.road.src);
      for (let k = m; k < M; k += h)
        e.drawImage(
          l,
          0,
          d,
          l.naturalWidth,
          l.naturalHeight - d,
          Math.floor(k),
          u,
          Math.ceil(h) + 1,
          c,
        );
    } else ((e.fillStyle = "#6b4a2b"), e.fillRect(0, u, M, E - u));
    e.restore();
  }
  function Un(e, n, t) {
    let a = t.sun,
      i = 1 - a.hp / a.maxHp,
      r = X(t.bossId),
      s = r.moods[Math.min(r.moods.length - 1, Math.floor(i * r.moods.length))];
    a.spitT > 0 && (s = r.spit);
    let o = G(n, s),
      [l, u, c] = r.glow,
      h = t.phase === "transition",
      m = 1 + Math.sin(t.time * 6) * 0.03 + (a.rageT > 0 ? 0.08 : 0),
      d = h ? a.deathT * a.deathT * 160 : 0,
      k =
        a.tpT > 0
          ? Math.abs(Math.sin((a.tpT / 0.5) * Math.PI * 4)) * 0.5 + 0.1
          : 1,
      g = (h ? Math.max(0, 1 - a.deathT / 2.4) : 1) * k;
    (e.save(), (e.globalAlpha = g));
    let y = e.createRadialGradient(
      a.x,
      a.y + d,
      20,
      a.x,
      a.y + d,
      260 * a.scale,
    );
    (y.addColorStop(0, `rgba(${l},${u},${c},${0.55 + i * 0.2})`),
      y.addColorStop(1, `rgba(${l},${u},${c},0)`),
      (e.fillStyle = y));
    let S = 260 * a.scale;
    if ((e.fillRect(a.x - S, a.y + d - S, S * 2, S * 2), o)) {
      let f = 250 * a.scale * m,
        p = (o.naturalHeight * f) / o.naturalWidth;
      (e.translate(a.x, a.y + d),
        h && e.rotate(a.deathT * 0.8),
        a.flash > 0 && (e.filter = "brightness(1.8)"),
        e.drawImage(o, -f / 2, -p / 2, f, p));
    }
    e.restore();
  }
  function xt(e, n, t, a) {
    (e.beginPath(), e.moveTo(n + (le(t) - 0.5) * 80, 40));
    let r = 12;
    for (let s = 1; s <= r; s++) {
      let o = 40 + ((P + 8 - 40) * s) / r,
        l = s === r ? 0 : (le(t + s * 3 + Math.floor(a * 30)) - 0.5) * 64;
      e.lineTo(n + l, o);
    }
  }
  var Tt = {
    lightning: {
      warn: "255,240,150",
      ring: "255,%d,60",
      glow: "#ffd27a",
      outer: "rgba(255,170,40,0.9)",
      core: "#fff6c9",
    },
    beam: {
      warn: "190,230,255",
      ring: "120,%d,255",
      glow: "#a5d8ff",
      outer: "rgba(110,180,255,0.85)",
      core: "#f2faff",
    },
    rain: {
      warn: "255,240,120",
      ring: "255,%d,80",
      glow: "#ffe066",
      outer: "rgba(255,214,70,0.9)",
      core: "#fffbe0",
    },
    inferno: {
      warn: "255,140,60",
      ring: "255,%d,30",
      glow: "#ff6a2a",
      outer: "rgba(255,90,20,0.9)",
      core: "#fff0a8",
    },
    soul: {
      warn: "170,255,200",
      ring: "90,%d,140",
      glow: "#5dff9b",
      outer: "rgba(60,230,120,0.9)",
      core: "#eafff1",
    },
    laser: {
      warn: "255,150,150",
      ring: "255,%d,70",
      glow: "#ff4d4d",
      outer: "rgba(255,50,50,0.9)",
      core: "#fff0f0",
    },
    shock: {
      warn: "240,170,255",
      ring: "220,%d,255",
      glow: "#e599ff",
      outer: "rgba(200,90,255,0.85)",
      core: "#fbe8ff",
    },
  };
  function Vn(e, n) {
    var t;
    for (let a of n.bolts) {
      if (a.delay > 0) continue;
      let i = (t = Tt[a.style]) != null ? t : Tt.lightning,
        r = a.half;
      if (a.t < a.warn) {
        let o = a.t / a.warn;
        (e.save(), (e.globalAlpha = 0.35 + o * 0.5));
        let l = e.createRadialGradient(a.x, P + 6, 4, a.x, P + 6, r * 1.25);
        (l.addColorStop(0, `rgba(${i.warn},0.95)`),
          l.addColorStop(1, `rgba(${i.warn},0)`),
          (e.fillStyle = l),
          e.beginPath(),
          e.ellipse(a.x, P + 6, r * 1.25, 18, 0, 0, Math.PI * 2),
          e.fill(),
          (e.strokeStyle = `rgba(${i.ring.replace("%d", String(Math.floor(220 - o * 150)))},0.9)`),
          (e.lineWidth = 3),
          e.setLineDash([10, 8]),
          e.beginPath(),
          e.ellipse(a.x, P + 6, r * (1.2 - o * 0.2), 14, 0, 0, Math.PI * 2),
          e.stroke(),
          a.style === "beam" &&
            (e.setLineDash([4, 10]),
            (e.globalAlpha = 0.15 + o * 0.3),
            (e.strokeStyle = `rgba(${i.warn},0.9)`),
            e.strokeRect(a.x - r, 0, r * 2, P + 6)),
          e.restore());
        continue;
      }
      let s = 1 - (a.t - a.warn) / a.strike;
      if (
        (e.save(),
        (e.globalAlpha = Math.max(0.2, s)),
        (e.shadowColor = i.glow),
        (e.shadowBlur = 30),
        (e.lineJoin = "round"),
        (e.lineCap = "round"),
        a.style === "beam")
      ) {
        let o = e.createLinearGradient(a.x - r, 0, a.x + r, 0);
        (o.addColorStop(0, "rgba(120,190,255,0)"),
          o.addColorStop(0.35, i.outer),
          o.addColorStop(0.5, i.core),
          o.addColorStop(0.65, i.outer),
          o.addColorStop(1, "rgba(120,190,255,0)"),
          (e.fillStyle = o),
          e.fillRect(a.x - r, 0, r * 2, P + 6));
      } else if (a.style === "inferno" || a.style === "laser") {
        let o = (a.t - a.warn) / a.strike,
          l =
            a.style === "inferno"
              ? 0.85 + Math.sin(a.t * 60 + a.seed) * 0.15
              : 1,
          u = r * l * (a.style === "laser" ? 0.55 + (1 - o) * 0.2 : 1),
          c = e.createLinearGradient(a.x - u, 0, a.x + u, 0);
        if (
          (c.addColorStop(0, "rgba(255,60,20,0)"),
          c.addColorStop(0.3, i.outer),
          c.addColorStop(0.5, i.core),
          c.addColorStop(0.7, i.outer),
          c.addColorStop(1, "rgba(255,60,20,0)"),
          (e.fillStyle = c),
          e.fillRect(a.x - u, 0, u * 2, P + 6),
          a.style === "inferno")
        ) {
          e.fillStyle = i.outer;
          for (let h = 0; h < 9; h++) {
            let m = P - ((a.t * 380 + h * 70) % (P - 20)),
              d = a.x + Math.sin(a.t * 14 + h * 2 + a.seed) * r * 0.6;
            (e.beginPath(),
              e.arc(d, m, 12 + (h % 3) * 5, 0, Math.PI * 2),
              e.fill());
          }
        }
      } else if (a.style === "shock") {
        let o = (a.t - a.warn) / a.strike;
        ((e.strokeStyle = i.outer),
          (e.lineWidth = 16),
          e.beginPath(),
          e.ellipse(
            a.x,
            P + 4,
            r * (0.5 + o * 0.8),
            20 + o * 10,
            0,
            0,
            Math.PI * 2,
          ),
          e.stroke(),
          (e.strokeStyle = i.core),
          (e.lineWidth = 5),
          e.beginPath(),
          e.ellipse(
            a.x,
            P + 4,
            r * (0.5 + o * 0.8),
            20 + o * 10,
            0,
            0,
            Math.PI * 2,
          ),
          e.stroke(),
          (e.globalAlpha = Math.max(0.2, s) * 0.7));
        let l = e.createLinearGradient(0, P - 260, 0, P);
        (l.addColorStop(0, "rgba(200,90,255,0)"),
          l.addColorStop(1, i.outer),
          (e.fillStyle = l),
          e.fillRect(a.x - r * 0.45, P - 260, r * 0.9, 260));
      } else {
        let o = a.style === "rain";
        (xt(e, a.x, a.seed, a.t),
          (e.strokeStyle = i.outer),
          (e.lineWidth = o ? 12 : 26),
          e.stroke(),
          xt(e, a.x, a.seed, a.t),
          (e.strokeStyle = i.core),
          (e.lineWidth = o ? 4 : 9),
          e.stroke());
      }
      e.restore();
    }
  }
  var Pt = {
    fire: "255,150,30",
    ice: "130,200,255",
    hail: "200,235,255",
    spark: "255,220,60",
    plasma: "230,100,255",
    lava: "255,70,20",
    soul: "90,255,150",
    missile: "255,80,80",
  };
  function _n(e, n) {
    var t, a, i;
    for (let r of n.fireballs) {
      if (r.age < 0) {
        if (r.shape === "pillar" || r.shape === "beam") {
          let u = 0.35 + 0.35 * Math.abs(Math.sin(n.tick * 0.5));
          (e.save(),
            (e.fillStyle = `rgba(${(t = r.color) != null ? t : "255,80,60"},${u})`),
            r.shape === "pillar"
              ? (e.beginPath(),
                e.ellipse(r.x, P + 4, r.r, 9, 0, 0, Math.PI * 2),
                e.fill())
              : e.fillRect(0, r.y - 5, r.x, 10),
            e.restore());
        }
        continue;
      }
      e.save();
      let s = r.reflected
          ? "120,200,255"
          : (i = (a = r.color) != null ? a : Pt[r.kind]) != null
            ? i
            : Pt.fire,
        o = Math.hypot(r.vx, r.vy) || 1;
      if (r.shape === "pillar") {
        let u =
            230 *
            Math.min(1, r.age / 0.12) *
            (1 - Math.max(0, r.age - 0.35) / 0.15),
          c = e.createLinearGradient(0, P, 0, P - u);
        (c.addColorStop(0, `rgba(${s},0.95)`),
          c.addColorStop(1, `rgba(${s},0)`),
          (e.fillStyle = c),
          e.beginPath(),
          e.moveTo(r.x - r.r, P),
          e.lineTo(r.x, P - u),
          e.lineTo(r.x + r.r, P),
          e.fill(),
          e.restore());
        continue;
      }
      if (r.shape === "beam") {
        let u = e.createLinearGradient(r.x, 0, r.x + 420, 0);
        (u.addColorStop(0, `rgba(${s},0)`),
          u.addColorStop(1, `rgba(${s},0.9)`),
          (e.fillStyle = u),
          e.fillRect(r.x, r.y - r.r, 420, r.r * 2),
          (e.fillStyle = "rgba(255,255,255,0.9)"),
          e.fillRect(r.x + 120, r.y - r.r * 0.3, 300, r.r * 0.6),
          e.restore());
        continue;
      }
      if (r.shape === "needle") {
        ((e.strokeStyle = `rgba(${s},0.95)`),
          (e.lineWidth = Math.max(4, r.r * 0.55)),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(r.x, r.y),
          e.lineTo(r.x - (r.vx / o) * 38, r.y - (r.vy / o) * 38),
          e.stroke(),
          e.restore());
        continue;
      }
      if (r.kind === "hail" || r.kind === "ice") {
        let u = r.kind === "hail" ? 46 : 70,
          c = e.createLinearGradient(
            r.x,
            r.y,
            r.x - (r.vx / o) * u,
            r.y - (r.vy / o) * u,
          );
        (c.addColorStop(0, `rgba(${s},0.8)`),
          c.addColorStop(1, `rgba(${s},0)`),
          (e.strokeStyle = c),
          (e.lineWidth = r.r * 1.3),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(r.x, r.y),
          e.lineTo(r.x - (r.vx / o) * u, r.y - (r.vy / o) * u),
          e.stroke());
      }
      let l = e.createRadialGradient(r.x, r.y, 2, r.x, r.y, r.r * 1.8);
      if (
        (l.addColorStop(0, "rgba(255,255,235,1)"),
        l.addColorStop(0.35, `rgba(${s},0.95)`),
        l.addColorStop(1, `rgba(${s},0)`),
        (e.fillStyle = l),
        e.beginPath(),
        e.arc(r.x, r.y, r.r * 1.8, 0, Math.PI * 2),
        e.fill(),
        r.kind === "missile")
      ) {
        let u = e.createLinearGradient(
          r.x,
          r.y,
          r.x - (r.vx / o) * 60,
          r.y - (r.vy / o) * 60,
        );
        (u.addColorStop(0, "rgba(255,200,80,0.9)"),
          u.addColorStop(1, "rgba(255,80,40,0)"),
          (e.strokeStyle = u),
          (e.lineWidth = r.r * 0.8),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(r.x, r.y),
          e.lineTo(r.x - (r.vx / o) * 60, r.y - (r.vy / o) * 60),
          e.stroke());
      }
      if (
        ((r.kind === "soul" || r.kind === "lava") &&
          ((e.fillStyle =
            r.kind === "soul"
              ? "rgba(220,255,230,0.9)"
              : "rgba(255,230,120,0.9)"),
          e.beginPath(),
          e.arc(
            r.x + Math.sin(n.time * 12) * 3,
            r.y - r.r * 0.8,
            r.r * 0.45,
            0,
            Math.PI * 2,
          ),
          e.fill()),
        r.kind === "spark")
      ) {
        ((e.strokeStyle = "rgba(255,250,200,0.95)"),
          (e.lineWidth = 3),
          e.beginPath());
        for (let u = 0; u < 4; u++) {
          let c = n.time * 9 + (u * Math.PI) / 2;
          (e.moveTo(r.x, r.y),
            e.lineTo(
              r.x + Math.cos(c) * r.r * 1.6,
              r.y + Math.sin(c) * r.r * 1.6,
            ));
        }
        e.stroke();
      }
      e.restore();
    }
  }
  function Xn(e, n, t) {
    let a = n.getCutout(t.sprite.src);
    if (!a) return;
    let i = t.w + 40,
      r = (a.height * i) / a.width;
    e.drawImage(a, t.x - i / 2, t.y - 10, i, r);
  }
  function Yn(e, n, t, a) {
    let i = Math.abs(Math.cos(a * 5));
    (e.save(),
      e.translate(n, t),
      (e.shadowColor = "rgba(255,200,0,0.8)"),
      (e.shadowBlur = 10),
      (e.fillStyle = "#ffcf33"),
      (e.strokeStyle = "#b8860b"),
      (e.lineWidth = 3),
      e.beginPath(),
      e.ellipse(0, 0, 16 * Math.max(0.25, i), 16, 0, 0, Math.PI * 2),
      e.fill(),
      e.stroke(),
      (e.shadowBlur = 0),
      (e.fillStyle = "#fff1a8"),
      e.beginPath(),
      e.ellipse(-3 * i, -4, 5 * Math.max(0.25, i), 5, 0, 0, Math.PI * 2),
      e.fill(),
      e.restore());
  }
  var Jn = {
    double: "skills/double.webp",
    halo: "skills/immortal-halo.webp",
    reverse: "skills/reverse.webp",
    lightning: "skills/lightning-orb.webp",
    meteor: "meteors/meteor2.webp",
  };
  function Qn(e, n, t, a) {
    var o;
    let i = Math.sin(a.age * 4 + a.uid) * 5;
    if (a.kind === "coin") {
      Yn(e, a.x, a.y + i * 0.4, a.age + a.uid);
      return;
    }
    e.save();
    let r = e.createRadialGradient(a.x, a.y + i, 4, a.x, a.y + i, 54),
      s =
        a.kind === "heal"
          ? "110,240,160"
          : a.kind === "gun"
            ? "120,200,255"
            : "255,220,120";
    if (
      (r.addColorStop(0, `rgba(${s},0.7)`),
      r.addColorStop(1, `rgba(${s},0)`),
      (e.fillStyle = r),
      e.fillRect(a.x - 54, a.y + i - 54, 108, 108),
      a.kind === "heal")
    ) {
      ((e.fillStyle = "#ff4d6d"),
        (e.strokeStyle = "#fff"),
        (e.lineWidth = 3),
        e.beginPath());
      let l = a.x,
        u = a.y + i;
      (e.moveTo(l, u + 18),
        e.bezierCurveTo(l - 30, u - 4, l - 14, u - 28, l, u - 10),
        e.bezierCurveTo(l + 14, u - 28, l + 30, u - 4, l, u + 18),
        e.fill(),
        e.stroke());
    } else if (a.kind === "gun") {
      let l = Math.min(a.gunIdx, t.manifest.guns.length - 1),
        u = G(n, t.manifest.guns[l].src);
      if (u) {
        let h = (u.naturalHeight * 84) / u.naturalWidth;
        e.drawImage(u, a.x - 84 / 2, a.y + i - h / 2, 84, h);
      }
    } else {
      let l = G(n, (o = Jn[a.kind]) != null ? o : "");
      if (l) {
        a.kind !== "meteor" && (e.globalCompositeOperation = "screen");
        let u = 64,
          c = (l.naturalHeight * u) / l.naturalWidth;
        e.drawImage(l, a.x - u / 2, a.y + i - c / 2, u, c);
      }
    }
    e.restore();
  }
  var Zn = new Set([
      "aqua-turtle",
      "cherry-bomber",
      "cloverfield",
      "cone-zombie",
      "ember-salamander",
      "fire-mole",
      "gatling-pea",
      "hello-kitty",
      "ice-worm",
      "leaf-saurian",
      "medusa",
      "minions",
      "needle-cactus",
      "shadow-imp",
      "slattern",
      "steel-golem",
      "storm-ogre",
      "thorn-chomper",
      "vampire",
      "venom-toad",
      "volt-mouse",
    ]),
    ea = new Set(["minotaur", "godzilla", "raptor-runner", "horn-triceratops"]);
  function ta(e) {
    let t = Zn.has(e) ? -1 : 1;
    return ea.has(e) ? -t : t;
  }
  function na(e, n, t, a) {
    let i = t.state === "attack",
      r = t.def.attack.length > 0,
      s = i && r ? t.def.attack : t.def.frames,
      o = i ? 9 : 8,
      l = s[Math.floor(t.age * o) % s.length],
      u = G(n, l);
    if (!u) return;
    let c = (u.naturalWidth * t.h) / u.naturalHeight,
      h = a < t.x ? 1 : -1,
      m = -h,
      d = r ? 0.8 : 0.6,
      k = i ? Math.min(1, Math.max(0, 1 - t.stateT / d)) : 0,
      g = !i && t.cooldown < 0.45 && t.cooldown > -1 && Math.abs(a - t.x) < 330,
      y = 0.5 + 0.5 * Math.sin(t.age * 28),
      S = t.y + t.h / 2 - 8 - t.h / 2;
    if (g) {
      (e.save(), (e.globalAlpha = 0.25 + y * 0.3));
      let b = e.createRadialGradient(t.x, S, 6, t.x, S, t.h * 0.75);
      (b.addColorStop(0, "rgba(255,70,50,0.85)"),
        b.addColorStop(1, "rgba(255,70,50,0)"),
        (e.fillStyle = b),
        e.beginPath(),
        e.arc(t.x, S, t.h * 0.75, 0, Math.PI * 2),
        e.fill(),
        e.restore());
    }
    let f = (b, x, $, I, B) => {
        (e.save(),
          e.translate(t.x + b, t.y + t.h / 2 - 8),
          (e.globalAlpha = x),
          B ? (e.filter = B) : t.flash > 0 && (e.filter = "brightness(2.2)"),
          t.elite && !B && ((e.shadowColor = "#ffcf33"), (e.shadowBlur = 24)),
          e.scale(h * ta(t.def.id) * $, I),
          e.drawImage(u, -c / 2, -t.h, c, t.h),
          e.restore());
      },
      p = 1,
      w = 1;
    if ((g && ((p = 1 - 0.05 * y), (w = 1 + 0.05 * y)), i)) {
      let b = Math.sin(k * Math.PI);
      ((p = 1 + b * 0.14), (w = 1 - b * 0.07));
      for (let x = 3; x >= 1; x--)
        f(
          -m * x * 26 * b,
          0.2 - x * 0.04,
          p,
          w,
          "brightness(1.6) saturate(1.8) hue-rotate(-20deg)",
        );
    }
    if (
      (f(0, 1, p, w, g ? `brightness(${1.1 + y * 0.5}) saturate(1.4)` : void 0),
      i)
    ) {
      let b = Math.sin(k * Math.PI),
        x = t.def.kind === "fly",
        $ = t.x + m * (c * 0.32);
      (e.save(),
        (e.lineCap = "round"),
        (e.shadowColor = x ? "#9fd8ff" : "#ff8a3d"),
        (e.shadowBlur = 20));
      let I = t.h * (0.45 + k * 0.35);
      ((e.globalAlpha = Math.min(1, b * 1.6)),
        (e.strokeStyle = x
          ? "rgba(180,230,255,0.95)"
          : "rgba(255,200,110,0.95)"),
        (e.lineWidth = 12 * (1 - k * 0.6)),
        e.beginPath(),
        e.arc($, S, I, m > 0 ? -1 : Math.PI - 1 + 0, m > 0 ? 1 : Math.PI + 1),
        e.stroke(),
        (e.strokeStyle = "rgba(255,255,255,0.95)"),
        (e.lineWidth = 4),
        e.beginPath(),
        e.arc(
          $,
          S,
          I - 5,
          m > 0 ? -0.9 : Math.PI - 0.9,
          m > 0 ? 0.9 : Math.PI + 0.9,
        ),
        e.stroke(),
        (e.globalAlpha = b * 0.8),
        (e.strokeStyle = "rgba(255,255,255,0.85)"),
        (e.lineWidth = 3));
      for (let B = 0; B < 4; B++) {
        let V = S + (B - 1.5) * t.h * 0.2,
          pe = 60 + B * 14;
        (e.beginPath(),
          e.moveTo(t.x - m * (c * 0.3), V),
          e.lineTo(t.x - m * (c * 0.3 + pe * b), V),
          e.stroke());
      }
      (x ||
        ((e.globalAlpha = b * 0.6),
        (e.strokeStyle = "rgba(255,230,190,0.9)"),
        (e.lineWidth = 5),
        e.beginPath(),
        e.ellipse(
          t.x - m * 20,
          P + 8,
          30 + k * 90,
          8 + k * 12,
          0,
          0,
          Math.PI * 2,
        ),
        e.stroke()),
        e.restore());
    }
    if (t.hp < t.maxHp || t.elite) {
      let b = Math.max(70, t.w * 0.5),
        x = t.x - b / 2,
        $ = t.y - t.h / 2 - 12;
      ((e.fillStyle = "rgba(0,0,0,0.55)"),
        e.fillRect(x - 2, $ - 2, b + 4, 9),
        (e.fillStyle = t.elite ? "#ffcf33" : "#ff5a4d"),
        e.fillRect(x, $, (b * t.hp) / t.maxHp, 5));
    }
  }
  function aa(e, n, t) {
    var x, $;
    let a = t.player,
      i = t.manifest.riders.find((I) => I.id === t.riderId),
      r = t.manifest.mounts.find((I) => I.id === t.mountId);
    if (!r) return;
    let s = !a.onGround,
      o = r.idle,
      l = i == null ? void 0 : i.idle,
      u = !0;
    if (s)
      ((o = a.vy < 0 ? r.up : r.down), i && (l = a.vy < 0 ? i.up : i.down));
    else if (u) {
      let I = Math.floor(a.runPhase) % Math.max(1, r.run.length);
      ((o = (x = r.run[I]) != null ? x : r.idle),
        i &&
          (l =
            ($ = i.run[I % Math.max(1, i.run.length)]) != null ? $ : i.idle));
    }
    let c = G(n, o),
      h = i && l ? G(n, l) : null,
      m = a.invuln > 0 && Math.floor(t.time * 14) % 2 === 0 && a.haloT <= 0;
    (e.save(), m && (e.globalAlpha = 0.45), (e.fillStyle = "rgba(0,0,0,0.28)"));
    let d = Math.max(0, P - a.y);
    (e.beginPath(),
      e.ellipse(
        a.x,
        P + 6,
        120 * (1 - Math.min(0.5, d / 400)),
        14,
        0,
        0,
        Math.PI * 2,
      ),
      e.fill());
    let k = s ? 0 : Math.abs(Math.sin(a.runPhase * Math.PI)) * -6,
      g = 360 / r.size[0],
      y = r.size[0] * g,
      S = r.size[1] * g,
      f = a.x - y * 0.46,
      p = a.y - S * 0.95 + k;
    lvBack(e, t, a, f, p, y, S);
    c &&
      (a.hurtFlash > 0 && (e.filter = "brightness(1.8) saturate(1.5)"),
      e.drawImage(c, f, p, y, S));
    let w = Math.min(a.gun, t.manifest.guns.length - 1),
      b = G(n, t.manifest.guns[w].src);
    if (b) {
      let I = we(a),
        B = 70,
        V = (b.naturalHeight * B) / b.naturalWidth,
        pe = B * 0.7;
      (e.save(),
        e.translate(
          I.x - Math.cos(a.facingAngle) * pe,
          I.y - Math.sin(a.facingAngle) * pe,
        ),
        e.rotate(a.facingAngle),
        e.drawImage(b, -B * 0.3, -V / 2, B, V),
        e.restore());
    }
    if (h && i) {
      let I = g * 1.05,
        B = i.size[0] * I,
        V = i.size[1] * I,
        pe = f + y * 0.43 - B * 0.54,
        Vt = p + S * 0.62 - V * 0.86 - 4;
      (a.hurtFlash > 0 && (e.filter = "brightness(1.8) saturate(1.5)"),
        e.drawImage(h, pe, Vt, B, V));
    }
    lvFront(e, t, a, f, p, y, S);
    if (((e.filter = "none"), e.restore(), a.haloT > 0)) {
      let I = G(n, "skills/immortal-halo.webp");
      if (
        (e.save(),
        (e.globalAlpha = 0.85 * Math.min(1, a.haloT)),
        (e.shadowColor = "#fff3a0"),
        (e.shadowBlur = 30),
        I)
      ) {
        e.globalCompositeOperation = "screen";
        let B = 190,
          V = (I.naturalHeight * B) / I.naturalWidth;
        e.drawImage(I, a.x - B / 2, a.y - 250, B, V);
      }
      ((e.strokeStyle = "rgba(255,240,150,0.7)"),
        (e.lineWidth = 4),
        e.beginPath(),
        e.ellipse(a.x, a.y - 90, 150, 105, 0, 0, Math.PI * 2),
        e.stroke(),
        e.restore());
    }
    a.reverseT > 0 &&
      (e.save(),
      (e.strokeStyle = `rgba(120,200,255,${0.5 + Math.sin(t.time * 12) * 0.3})`),
      (e.lineWidth = 5),
      e.beginPath(),
      e.ellipse(a.x, a.y - 90, 140, 100, 0, 0, Math.PI * 2),
      e.stroke(),
      e.restore());
  }
  function oa(e, n, t) {
    for (let a of t.bullets) {
      let i = G(n, t.manifest.bullets[a.idx].src);
      if ((e.save(), e.translate(a.x, a.y), e.rotate(a.angle), i)) {
        let s = (i.naturalHeight * 70) / i.naturalWidth;
        e.drawImage(i, -70 / 2, -s / 2, 70, s);
      } else ((e.fillStyle = "#ffe28a"), e.fillRect(-12, -4, 24, 8));
      e.restore();
    }
  }
  function ra(e, n, t) {
    for (let a of t.meteors) {
      let i = G(n, `meteors/meteor${a.variant + 1}.webp`);
      if (!i) continue;
      (e.save(),
        e.translate(a.x, a.y),
        e.rotate(Math.atan2(a.vy, a.vx) + Math.PI));
      let r = 120,
        s = (i.naturalHeight * r) / i.naturalWidth;
      (e.drawImage(i, -r / 2, -s / 2, r, s), e.restore());
    }
  }
  function ia(e, n, t) {
    var a, i, r, s;
    for (let o of t.effects) {
      let l = o.t / o.life;
      switch ((e.save(), (e.globalAlpha = 1 - l * l), o.kind)) {
        case "hit": {
          let u = t.manifest.hits,
            c = G(n, u[Math.min(o.variant, u.length - 1)].src);
          if (c) {
            let h = o.size * (0.7 + l * 0.5),
              m = (c.naturalHeight * h) / c.naturalWidth;
            e.drawImage(c, o.x - h / 2, o.y - m / 2, h, m);
          }
          break;
        }
        case "boom": {
          let u = G(n, "meteors/boom.webp"),
            c = o.size * (0.6 + l * 0.8);
          if (u) {
            let h = (u.naturalHeight * c) / u.naturalWidth;
            e.drawImage(u, o.x - c / 2, o.y - h / 2, c, h);
          } else
            ((e.fillStyle = "#ffb347"),
              e.beginPath(),
              e.arc(o.x, o.y, c / 3, 0, Math.PI * 2),
              e.fill());
          break;
        }
        case "lightning": {
          let u = G(n, "skills/lightning.webp");
          if (u) {
            e.globalCompositeOperation = "screen";
            let c = o.size * 1.4,
              h = (u.naturalWidth * c) / u.naturalHeight;
            e.drawImage(u, o.x - h / 2, o.y - c + 60, h, c);
          }
          break;
        }
        case "dust": {
          e.fillStyle = "rgba(230,220,200,0.6)";
          for (let u = 0; u < 5; u++) {
            let c = le(o.x + u) * Math.PI,
              h = 6 + l * 22;
            (e.beginPath(),
              e.arc(
                o.x + Math.cos(c) * (10 + l * 36) * (u % 2 ? 1 : -1),
                o.y - 6 - Math.sin(c) * l * 24,
                h * 0.5,
                0,
                Math.PI * 2,
              ),
              e.fill());
          }
          break;
        }
        case "ring": {
          ((e.strokeStyle = "rgba(255,220,120,0.9)"),
            (e.lineWidth = 6 * (1 - l)),
            e.beginPath(),
            e.ellipse(
              o.x,
              o.y,
              o.size * (0.3 + l * 0.7),
              o.size * 0.12 * (0.3 + l * 0.7),
              0,
              0,
              Math.PI * 2,
            ),
            e.stroke());
          break;
        }
        case "spark": {
          e.fillStyle = "#fff3b0";
          for (let u = 0; u < 6; u++) {
            let c = le(o.x * 3 + u * 7) * Math.PI * 2;
            (e.beginPath(),
              e.arc(
                o.x + Math.cos(c) * l * 40,
                o.y + Math.sin(c) * l * 40,
                3,
                0,
                Math.PI * 2,
              ),
              e.fill());
          }
          break;
        }
        case "sunBurst": {
          let u = e.createRadialGradient(
            o.x,
            o.y,
            10,
            o.x,
            o.y,
            o.size * (0.4 + l),
          );
          (u.addColorStop(0, "rgba(255,250,200,0.95)"),
            u.addColorStop(0.5, "rgba(255,170,50,0.6)"),
            u.addColorStop(1, "rgba(255,100,20,0)"),
            (e.fillStyle = u),
            e.beginPath(),
            e.arc(o.x, o.y, o.size * (0.4 + l), 0, Math.PI * 2),
            e.fill());
          break;
        }
        case "glow": {
          let u = (a = o.color) != null ? a : "255,200,100",
            c = o.size * (0.4 + l * 0.8);
          e.globalCompositeOperation = "lighter";
          let h = e.createRadialGradient(o.x, o.y, 0, o.x, o.y, c);
          (h.addColorStop(0, "rgba(255,255,255,0.95)"),
            h.addColorStop(0.35, `rgba(${u},0.7)`),
            h.addColorStop(1, `rgba(${u},0)`),
            (e.fillStyle = h),
            e.beginPath(),
            e.arc(o.x, o.y, c, 0, Math.PI * 2),
            e.fill());
          break;
        }
        case "shock": {
          let u = (i = o.color) != null ? i : "255,200,100",
            c = o.size * (0.15 + l * 0.85);
          ((e.strokeStyle = `rgba(${u},0.95)`),
            (e.lineWidth = 10 * (1 - l) + 1),
            e.beginPath(),
            e.arc(o.x, o.y, c, 0, Math.PI * 2),
            e.stroke(),
            (e.strokeStyle = "rgba(255,255,255,0.8)"),
            (e.lineWidth = 3 * (1 - l)),
            e.beginPath(),
            e.arc(o.x, o.y, c * 0.8, 0, Math.PI * 2),
            e.stroke());
          break;
        }
        case "shards": {
          let u = (r = o.color) != null ? r : "255,200,100";
          e.fillStyle = `rgba(${u},1)`;
          for (let c = 0; c < 12; c++) {
            let h = le(o.variant * 13 + c * 5) * Math.PI * 2,
              m = 0.5 + le(c * 9 + o.variant) * 0.9,
              d = o.size * l * m,
              k = o.x + Math.cos(h) * d,
              g = o.y + Math.sin(h) * d + l * l * 60;
            (e.save(),
              e.translate(k, g),
              e.rotate(h + l * 6),
              e.fillRect(-7 * (1 - l), -2, 14 * (1 - l), 4),
              e.restore());
          }
          break;
        }
        case "slash": {
          let u = (s = o.color) != null ? s : "255,255,255",
            c = -0.9 + o.variant * 0.9,
            h = o.size * (0.5 + l * 0.7);
          (e.translate(o.x, o.y),
            e.rotate(c),
            (e.globalCompositeOperation = "lighter"),
            (e.strokeStyle = `rgba(${u},0.9)`),
            (e.lineCap = "round"),
            (e.lineWidth = 12 * (1 - l) + 2),
            e.beginPath(),
            e.moveTo(-h, 0),
            e.lineTo(h, 0),
            e.stroke(),
            (e.strokeStyle = "rgba(255,255,255,0.95)"),
            (e.lineWidth = 4 * (1 - l)),
            e.stroke());
          break;
        }
        case "stars": {
          e.fillStyle = "#fff6b8";
          for (let u = 0; u < 5; u++) {
            let c = (u / 5) * Math.PI * 2 + l * 2,
              h = o.size * (0.3 + l * 0.8),
              m = o.x + Math.cos(c) * h,
              d = o.y - 10 + Math.sin(c) * h * 0.6 - l * 30,
              k = 9 * (1 - l * 0.6);
            e.beginPath();
            for (let g = 0; g < 8; g++) {
              let y = g % 2 ? k * 0.4 : k,
                S = (g / 8) * Math.PI * 2;
              e.lineTo(m + Math.cos(S) * y, d + Math.sin(S) * y);
            }
            (e.closePath(), e.fill());
          }
          break;
        }
        default:
          break;
      }
      e.restore();
    }
  }
  function se(e, n, t, a, i, r) {
    (e.beginPath(),
      e.moveTo(n + r, t),
      e.arcTo(n + a, t, n + a, t + i, r),
      e.arcTo(n + a, t + i, n, t + i, r),
      e.arcTo(n, t + i, n, t, r),
      e.arcTo(n, t, n + a, t, r),
      e.closePath());
  }
  var hpS = { p: { g: 1, l: 1, f: 0, t: -1 }, b: { g: 1, l: 1, f: 0, t: -1 } };
  function hpUp(k, r, tm) {
    let s = hpS[k];
    if (s.t < 0 || tm < s.t || tm - s.t > 1) {
      ((s.g = r), (s.l = r), (s.f = 0), (s.t = tm));
      return s;
    }
    let dt = tm - s.t;
    s.t = tm;
    r < s.l - 1e-4 && ((s.f = 0.35), (s.g = Math.max(s.g, s.l)));
    s.l = r;
    s.f = Math.max(0, s.f - dt);
    r > s.g ? (s.g = r) : s.f <= 0.18 && (s.g = Math.max(r, s.g - dt * 0.45));
    return s;
  }
  function hpBar(e, x, y, w, h, r, k, tm) {
    r = Math.max(0, Math.min(1, r));
    let s = hpUp(k, r, tm),
      b = k === "b",
      low = r > 0 && r <= (b ? 0.25 : 0.3),
      crit = r > 0 && r <= 0.15,
      pu = low ? 0.5 + 0.5 * Math.sin(tm * (crit ? 16 : 9)) : 0,
      ix = x + 2,
      iy = y + 2,
      iw = w - 4,
      ih = h - 4,
      rad = b ? 2 : ih / 2;
    (e.save(),
      b && low && e.translate(Math.sin(tm * 60) * (crit ? 2.2 : 1.2), 0));
    ((e.fillStyle = "rgba(8,8,18,0.78)"),
      se(e, x, y, w, h, b ? 4 : h / 2),
      e.fill());
    if (s.g > r + 0.002) {
      ((e.fillStyle = "rgba(255,255,255,0.88)"),
        se(e, ix, iy, Math.max(ih, iw * s.g), ih, rad),
        e.fill());
    }
    if (r > 0) {
      let mw = Math.max(ih, iw * r),
        c0,
        c1;
      if (b)
        low
          ? ((c0 = "#ff5a3c"), (c1 = "#8a0c14"))
          : ((c0 = "#d946ef"), (c1 = "#6d1d93"));
      else
        r > 0.6
          ? ((c0 = "#6dff95"), (c1 = "#1c9c4f"))
          : r > 0.3
            ? ((c0 = "#ffe45c"), (c1 = "#ec9a14"))
            : ((c0 = "#ff7b7b"), (c1 = "#c81e2e"));
      let g = e.createLinearGradient(0, iy, 0, iy + ih);
      (g.addColorStop(0, c0),
        g.addColorStop(1, c1),
        (e.fillStyle = g),
        se(e, ix, iy, mw, ih, rad),
        e.fill(),
        (e.fillStyle = "rgba(255,255,255,0.22)"),
        se(e, ix + 2, iy + 1, Math.max(0, mw - 4), ih * 0.38, rad),
        e.fill());
      if (s.f > 0.2) {
        ((e.fillStyle = `rgba(255,255,255,${((s.f - 0.2) / 0.15) * 0.7})`),
          se(e, ix, iy, mw, ih, rad),
          e.fill());
      }
      if (low) {
        ((e.fillStyle = `rgba(255,${b ? 220 : 255},${b ? 120 : 255},${pu * 0.4})`),
          se(e, ix, iy, mw, ih, rad),
          e.fill());
      }
    }
    ((e.strokeStyle = "rgba(0,0,0,0.35)"), (e.lineWidth = 1));
    let n = b ? 4 : 10;
    for (let i = 1; i < n; i++) {
      let lx = ix + (iw * i) / n;
      (e.beginPath(), e.moveTo(lx, iy), e.lineTo(lx, iy + ih), e.stroke());
    }
    if (low) {
      ((e.shadowColor = b ? "#ff6a2a" : "#ff2d3d"),
        (e.shadowBlur = 8 + pu * 16));
    }
    ((e.strokeStyle = b
      ? "#ffd23f"
      : low
        ? "#ff4d5a"
        : "rgba(255,255,255,0.45)"),
      (e.lineWidth = b ? 2.5 : 2),
      se(e, x, y, w, h, b ? 4 : h / 2),
      e.stroke(),
      (e.shadowBlur = 0));
    if (b) {
      e.fillStyle = "#ffd23f";
      for (let sd = 0; sd < 2; sd++) {
        let cx = sd ? x + w : x;
        (e.beginPath(),
          e.moveTo(cx, y - 4),
          e.lineTo(cx + (sd ? 5 : -5), y + h / 2),
          e.lineTo(cx, y + h + 4),
          e.lineTo(cx + (sd ? -3 : 3), y + h / 2),
          e.closePath(),
          e.fill());
      }
    }
    ((e.font = `800 ${Math.round(ih * 0.8)}px ${fe != null ? fe : "sans-serif"}`),
      (e.textAlign = "center"),
      (e.textBaseline = "middle"),
      (e.lineJoin = "round"),
      (e.lineWidth = 3),
      (e.strokeStyle = "rgba(0,0,0,0.7)"));
    let pt = `${Math.ceil(r * 100)}%`;
    (e.strokeText(pt, x + w / 2, y + h / 2 + 1),
      (e.fillStyle = "#fff"),
      e.fillText(pt, x + w / 2, y + h / 2 + 1),
      e.restore());
  }
  function hpAlarm(e, t) {
    let p = t.player,
      r = p.hp / p.maxHp;
    if (!(r > 0 && r <= 0.3)) return;
    let tm = t.time,
      crit = r <= 0.15,
      pu = 0.5 + 0.5 * Math.sin(tm * (crit ? 16 : 9)),
      a = (0.16 + 0.26 * pu) * (crit ? 1.35 : 1),
      g = e.createRadialGradient(
        M / 2,
        E / 2,
        E * 0.42,
        M / 2,
        E / 2,
        M * 0.62,
      );
    (g.addColorStop(0, "rgba(220,20,30,0)"),
      g.addColorStop(1, `rgba(220,20,30,${a})`),
      e.save(),
      (e.fillStyle = g),
      e.fillRect(0, 0, M, E));
    if (Math.sin(tm * (crit ? 16 : 9)) > -0.25) {
      let f = fe != null ? fe : "sans-serif",
        tx = T(
          t.lang,
          crit ? "S\u1EAAP CH\u1EBET!" : "S\u1EAAP H\u1EBET M\xC1U!",
          crit ? "CRITICAL!" : "LOW HEALTH!",
        );
      ((e.textAlign = "center"),
        (e.textBaseline = "middle"),
        (e.lineJoin = "round"),
        (e.font = `900 ${crit ? 44 : 38}px ${f}`),
        (e.lineWidth = 9),
        (e.strokeStyle = "rgba(40,0,6,0.95)"),
        (e.shadowColor = "rgba(255,40,50,0.9)"),
        (e.shadowBlur = 18),
        e.strokeText(tx, M / 2, 128),
        (e.fillStyle = crit ? "#ff3040" : "#ff6a6a"),
        e.fillText(tx, M / 2, 128));
    }
    e.restore();
  }
  function Ct(e, n, t, a, i, r, s, o) {
    if (
      ((e.fillStyle = "rgba(10,10,20,0.6)"),
      se(e, n, t, a, i, i / 2),
      e.fill(),
      r > 0)
    ) {
      let l = e.createLinearGradient(n, 0, n + a, 0);
      (l.addColorStop(0, s),
        l.addColorStop(1, o),
        (e.fillStyle = l),
        se(e, n + 2, t + 2, Math.max(i - 4, (a - 4) * r), i - 4, (i - 4) / 2),
        e.fill());
    }
  }
  function lvFit(e, x0, x, y, w) {
    let f = e.font,
      sz = +(/(\d+)px/.exec(f) || [0, 16])[1],
      tx = x0;
    while (sz > 11 && e.measureText(tx).width > w)
      (sz--, (e.font = f.replace(/\d+px/, sz + "px")));
    if (e.measureText(tx).width > w) {
      while (tx.length > 1 && e.measureText(tx + "\u2026").width > w)
        tx = tx.slice(0, -1);
      tx += "\u2026";
    }
    (e.fillText(tx, x, y), (e.font = f));
  }
  function sa(e, n, t, a) {
    let i = t.player,
      r = a.font,
      s = fe != null ? fe : r;
    (e.save(),
      (e.textBaseline = "middle"),
      (e.fillStyle = "rgba(12,12,24,0.55)"),
      se(e, 20, 20, 340, 128, 18),
      e.fill(),
      (e.fillStyle = "#fff"),
      (e.font = `800 22px ${s}`),
      (e.fillStyle = "#ff8fa0"),
      e.fillText(T(t.lang, "M\xC1U", "HP"), 36, 44),
      hpBar(e, 96, 33, 246, 22, i.hp / i.maxHp, "p", t.time),
      (e.font = `800 30px ${s}`),
      (e.shadowColor = "rgba(255,200,40,0.8)"),
      (e.shadowBlur = 12),
      (e.fillStyle = "#ffd84a"),
      e.fillText(`${t.coins} ${T(t.lang, "xu", "coins")}`, 36, 80),
      (e.shadowBlur = 0),
      (e.fillStyle = "#fff"),
      (e.font = `800 22px ${s}`),
      e.fillText(
        `${T(t.lang, "\u0110i\u1EC3m", "Score")} ${t.score.toLocaleString(t.lang === "en" ? "en-US" : "vi-VN")}`,
        200,
        82,
      ),
      (e.font = `800 20px ${s}`));
    let gt = `${T(t.lang, "S\xFAng", "Gun")} ${i.gun + 1}`,
      gw = e.measureText(gt).width;
    ((e.font = `600 16px ${r}`),
      lvFit(
        e,
        T(
          t.lang,
          `Di\u1EC7t ${t.kills} qu\xE1i \xB7 ${t.sunKills} ${Y(t.lang, t.bossId).toLowerCase()}`,
          `Killed ${t.kills} monsters \xB7 ${t.sunKills} ${Y(t.lang, t.bossId).toLowerCase()}`,
        ),
        36,
        120,
        306 - gw,
      ),
      (e.font = `800 20px ${s}`),
      (e.fillStyle = "#7dd3fc"),
      e.fillText(gt, 344 - gw, 120));
    let o = 460,
      l = (M - o) / 2;
    if (
      ((e.fillStyle = "rgba(12,12,24,0.55)"),
      se(e, l - 14, 14, o + 28, 66, 16),
      e.fill(),
      (e.fillStyle = "#ffe9b0"),
      (e.font = `800 20px ${s}`),
      (e.textAlign = "center"),
      e.fillText(
        `${Y(t.lang, t.bossId).toUpperCase()} \xB7 ${T(t.lang, "M\xC0N", "STAGE")} ${t.stage + 1} \xB7 ${t.plan.scenery.id.toUpperCase()}`,
        M / 2,
        33,
      ),
      hpBar(e, l, 51, o, 20, t.sun.hp / t.sun.maxHp, "b", t.time),
      (e.textAlign = "left"),
      t.combo >= 2)
    ) {
      let h = 1 + t.comboPop * 0.35,
        m = Math.min(1, t.combo / 30);
      (e.save(),
        e.translate(M - 40, 310),
        e.rotate(-0.06),
        e.scale(h, h),
        (e.textAlign = "right"),
        (e.textBaseline = "middle"),
        (e.lineJoin = "round"),
        (e.font = `900 ${64 + m * 28}px ${s}`),
        (e.lineWidth = 12),
        (e.strokeStyle = "rgba(20,0,30,0.95)"),
        e.strokeText(`${t.combo}x`, 0, 0),
        (e.shadowColor = `rgba(255,${Math.round(200 - m * 150)},${Math.round(80 + m * 120)},1)`),
        (e.shadowBlur = 24),
        (e.fillStyle = `rgb(255,${Math.round(230 - m * 150)},${Math.round(90 + m * 110)})`),
        e.fillText(`${t.combo}x`, 0, 0),
        (e.shadowBlur = 0),
        (e.font = `800 22px ${s}`),
        (e.lineWidth = 6),
        e.strokeText("COMBO", 0, 44),
        (e.fillStyle = "#fff"),
        e.fillText("COMBO", 0, 44),
        (e.fillStyle = "rgba(255,255,255,0.25)"),
        e.fillRect(-150, 66, 150, 6),
        (e.fillStyle = "#ff4fd8"),
        e.fillRect(-150, 66, 150 * Math.max(0, t.comboT / 3), 6),
        e.restore());
    }
    {
      let h = t.lang === "vi",
        m = h
          ? [
              "B\u1EA1n c\u1EA7m c\u1EF1 \u0111\u01B0\u1EE3c bao l\xE2u?",
              "\u0110\u1EEBng ch\u1EDBp m\u1EAFt, qu\xE1i s\u1EAFp tr\xE0n v\xE0o!",
              "Ch\u1EDD \u0111\u1EBFn boss cu\u1ED1i...",
              "Ai th\u1EAFng: ng\u01B0\u1EDDi hay qu\xE1i v\u1EADt?",
              "Combo c\xE0ng cao, c\xE0ng \u0111\xE3!",
              "Xem \u0111\u1EBFn cu\u1ED1i s\u1EBD b\u1EA5t ng\u1EDD!",
              "Qu\xE1i k\xE9o c\u1EA3 \u0111\xE0n, c\xF2n b\u1EA1n?",
              "N\xE9 \u0111\u01B0\u1EE3c \u0111\xF2n n\xE0y kh\xF4ng?",
              "C\xFA \u0103n may hay th\u1EF1c l\u1EF1c?",
              "B\xECnh lu\u1EADn s\u1ED1 qu\xE1i b\u1EA1n \u0111o\xE1n s\u1EBD h\u1EA1!",
            ]
          : [
              "How long can you survive?",
              "Don't blink, the horde is coming!",
              "Wait for the final boss...",
              "Human vs monsters: who wins?",
              "Higher combo, bigger rush!",
              "Watch until the end!",
              "Whole packs attack at once!",
              "Can you dodge this?",
              "Luck or skill?",
              "Comment how many kills you guess!",
            ],
        d = Math.floor(t.time / 4) % m.length,
        k = (t.time % 4) / 4,
        g = Math.min(1, k / 0.08, (1 - k) / 0.1),
        y = m[d];
      (e.save(),
        (e.globalAlpha = Math.max(0, g)),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        (e.lineJoin = "round"));
      let S = Math.min(34, M / (y.length * 0.56));
      e.font = `900 ${S}px ${s}`;
      let f = 118 + (1 - Math.min(1, k / 0.1)) * -12,
        p = e.measureText(y).width;
      ((e.fillStyle = "rgba(0,0,0,0.5)"),
        e.beginPath(),
        e.roundRect(M / 2 - p / 2 - 22, f - S * 0.75, p + 44, S * 1.5, 14),
        e.fill(),
        (e.lineWidth = 8),
        (e.strokeStyle = "rgba(20,0,30,0.95)"),
        e.strokeText(y, M / 2, f),
        (e.fillStyle = d % 2 ? "#ffe45c" : "#ffffff"),
        e.fillText(y, M / 2, f),
        e.restore());
      let w = Math.floor(t.time / 60),
        b = String(Math.floor(t.time % 60)).padStart(2, "0");
      (e.save(),
        (e.textAlign = "right"),
        (e.textBaseline = "middle"),
        (e.lineJoin = "round"),
        (e.font = `800 24px ${s}`),
        (e.lineWidth = 7),
        (e.strokeStyle = "rgba(20,0,30,0.95)"));
      let x =
          (h ? "Qu\xE1i \u0111\xE3 h\u1EA1: " : "Monsters slain: ") + t.kills,
        $ = (h ? "S\u1ED1ng s\xF3t: " : "Survived: ") + w + ":" + b;
      if (
        (e.strokeText(x, M - 24, 176),
        (e.fillStyle = "#ff9a5c"),
        e.fillText(x, M - 24, 176),
        e.strokeText($, M - 24, 206),
        (e.fillStyle = "#9be8ff"),
        e.fillText($, M - 24, 206),
        t.bestCombo >= 3)
      ) {
        let I =
          (h ? "Combo cao nh\u1EA5t: " : "Best combo: ") + t.bestCombo + "x";
        (e.strokeText(I, M - 24, 236),
          (e.fillStyle = "#ff7ae0"),
          e.fillText(I, M - 24, 236));
      }
      e.restore();
    }
    if (t.bossBannerT > 0 && t.phase === "play") {
      let h = 2.6 - t.bossBannerT,
        m = Math.min(1, h / 0.25),
        d = Math.min(1, t.bossBannerT / 0.4),
        k = Math.min(m, d),
        g = 1 + (1 - m) * 1.2,
        y = 0.75 + 0.25 * Math.sin(h * 22);
      (e.save(),
        (e.globalAlpha = k),
        (e.fillStyle = `rgba(160,0,20,${0.5 * k})`),
        e.fillRect(0, E * 0.34, M, 130),
        (e.fillStyle = `rgba(255,60,40,${0.8 * y})`),
        e.fillRect(0, E * 0.34, M, 5),
        e.fillRect(0, E * 0.34 + 125, M, 5),
        e.translate(M / 2, E * 0.34 + 62),
        e.scale(g, g),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        (e.lineJoin = "round"),
        (e.font = `900 76px ${s}`),
        (e.lineWidth = 14),
        (e.strokeStyle = "rgba(30,0,0,0.95)"),
        e.strokeText("! BOSS !", 0, -8),
        (e.shadowColor = "#ff2a1a"),
        (e.shadowBlur = 30),
        (e.fillStyle = `rgb(255,${Math.round(220 * y)},${Math.round(120 * y)})`),
        e.fillText("! BOSS !", 0, -8),
        (e.shadowBlur = 0),
        (e.font = `800 26px ${s}`),
        (e.lineWidth = 7),
        e.strokeText(Y(t.lang, t.bossId).toUpperCase(), 0, 44),
        (e.fillStyle = "#fff"),
        e.fillText(Y(t.lang, t.bossId).toUpperCase(), 0, 44),
        e.restore());
    }
    let u = [];
    if (
      (i.doubleT > 0 &&
        u.push([
          T(t.lang, "B\u1EAEN \u0110\xD4I", "DOUBLE SHOT"),
          i.doubleT,
          "#7dd3fc",
        ]),
      i.haloT > 0 &&
        u.push([T(t.lang, "B\u1EA4T T\u1EEC", "IMMORTAL"), i.haloT, "#fde68a"]),
      i.reverseT > 0 &&
        u.push([
          T(t.lang, "PH\u1EA2N \u0110\xD2N", "COUNTER"),
          i.reverseT,
          "#a5b4fc",
        ]),
      i.meteorT > 0 &&
        u.push([
          T(t.lang, "THI\xCAN TH\u1EA0CH", "METEOR"),
          i.meteorT,
          "#fda4af",
        ]),
      u.forEach(([h, m, d], k) => {
        let g = 152 + k * 30;
        ((e.fillStyle = "rgba(12,12,24,0.55)"),
          se(e, 20, g, 190, 24, 12),
          e.fill(),
          (e.fillStyle = d),
          (e.font = `800 17px ${s}`),
          e.fillText(`${h} ${m.toFixed(1)}s`, 34, g + 12));
      }),
      t.mode === "auto")
    ) {
      let h = `AUTO \xB7 ${Fe(t.lang, kt(t))}`;
      e.font = `800 20px ${s}`;
      let m = e.measureText(h).width,
        d = M - m - 64;
      ((e.fillStyle = "rgba(12,12,24,0.6)"),
        se(e, d - 14, 20, m + 56, 32, 16),
        e.fill(),
        (e.fillStyle = "#4ade80"),
        e.beginPath(),
        e.arc(d + 4, 36, 6 + Math.sin(t.time * 6) * 1.5, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#fff"),
        e.fillText(h, d + 20, 37));
      let k = Fe(t.lang, t.ai.intent);
      e.font = `700 17px ${r}`;
      let g = e.measureText(k).width;
      ((e.fillStyle = "rgba(12,12,24,0.6)"),
        se(e, M - g - 62, 58, g + 40, 28, 14),
        e.fill(),
        (e.fillStyle = "#fde68a"),
        e.fillText(k, M - g - 42, 72));
    }
    let c = t.log.slice(-4);
    if (
      ((e.font = `700 18px ${r}`),
      c.forEach((h, m) => {
        let d = t.time - h.t;
        if (d > 7) return;
        ((e.globalAlpha = Math.max(0, Math.min(1, (7 - d) / 2))),
          (e.fillStyle = "rgba(12,12,24,0.5)"));
        let k = e.measureText(h.text).width + 28;
        (se(e, 20, E - 46 - (c.length - m) * 34, k, 28, 14),
          e.fill(),
          (e.fillStyle = "#fff"),
          e.fillText(h.text, 34, E - 31 - (c.length - m) * 34));
      }),
      (e.globalAlpha = 1),
      t.banner)
    ) {
      let h = t.banner,
        m =
          h.t < 0.3 ? h.t / 0.3 : h.t > h.life - 0.5 ? (h.life - h.t) / 0.5 : 1;
      (e.save(),
        (e.globalAlpha = Math.max(0, m)),
        (e.textAlign = "center"),
        e.translate(M / 2, 250));
      let d = 0.35 + 0.65 * jn(Math.min(1, h.t / 0.4));
      (e.scale(d, d),
        e.rotate(
          Math.sin(h.t * 4) * 0.025 - 0.02 * (1 - Math.min(1, h.t / 0.4)),
        ),
        vt(e, h.text, 0, 0, s, {
          size: 96,
          t: h.t,
          colors: ["#fff7b0", "#ffb81c", "#ff3d2e"],
          glow: "rgba(255,90,30,0.95)",
          edge: "#2a0630",
          wave: 6,
          maxWidth: M - 180,
        }),
        h.sub &&
          vt(e, h.sub, 0, 74, s, {
            size: 38,
            t: h.t,
            colors: ["#ffffff", "#d9f3ff", "#7dd3fc"],
            glow: "rgba(80,160,255,0.9)",
            edge: "#0b1030",
            maxWidth: M - 260,
          }),
        e.restore());
    }
    e.restore();
  }
  var LV_TH = [0, 3e3, 8e3, 15e3, 25e3, 38e3, 54e3, 72e3, 88e3, 1e5].concat(
    Array.from({ length: 10 }, (_, i) => 1e5 + 5500 * (i + 1) + 500 * i * (i + 1)),
  );
  var LV_COL = [
    ["#fff", "#fff"],
    ["#fff", "#fff"],
    ["#7dff8a", "#d2ffd8"],
    ["#5ec8ff", "#c8eeff"],
    ["#33e6d0", "#bafff6"],
    ["#ffa030", "#ffe18a"],
    ["#b66bff", "#ead0ff"],
    ["#ffd84a", "#fff4b8"],
    ["#ff5fa8", "#ffd2e9"],
    ["#ff4a4a", "#ffd84a"],
    ["#ffffff", "#ffe9a0"],
    ["#7dffea", "#e6fffa"],
    ["#ff8a3d", "#ffe0b0"],
    ["#c77dff", "#f1d9ff"],
    ["#ffe14a", "#fffbd0"],
    ["#ff4fd8", "#ffd0f4"],
    ["#4affc4", "#d6fff0"],
    ["#ff5252", "#ffd0a0"],
    ["#8fa8ff", "#ffffff"],
    ["#ffd700", "#fff7c2"],
    ["#ffffff", "#ffd54a"],
  ];
  function lvOf(s) {
    let L = 1;
    for (let i = 1; i < LV_TH.length; i++) s >= LV_TH[i] && (L = i + 1);
    return L;
  }
  function lvR(i, k) {
    let x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function lvLevel(t) {
    let L = lvOf(t.score || 0);
    return (
      t.lvCur == null
        ? ((t.lvCur = L), (t.lvT0 = -99))
        : L > t.lvCur && ((t.lvCur = L), (t.lvT0 = t.time)),
      t.lvCur
    );
  }
  function lvStar(e, x, y, r, rot) {
    e.beginPath();
    for (let i = 0; i < 8; i++) {
      let a = rot + (i * Math.PI) / 4,
        d = i % 2 ? r * 0.28 : r;
      e.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
    }
    e.closePath();
    e.fill();
  }
  function lvGlow(e, x, y, r, c, al) {
    let g = e.createRadialGradient(x, y, 0, x, y, r);
    (g.addColorStop(0, c),
      g.addColorStop(1, "rgba(255,255,255,0)"),
      (e.globalAlpha = al),
      (e.fillStyle = g),
      e.beginPath(),
      e.arc(x, y, r, 0, Math.PI * 2),
      e.fill());
  }
  function lvBack(e, t, a, f, p, w, h) {
    let L = lvLevel(t);
    if (L < 2) return;
    let tm = t.time,
      c = LV_COL[L],
      cx = f + w * 0.5,
      cy = p + h * 0.55;
    (e.save(), (e.filter = "none"), (e.globalCompositeOperation = "lighter"));
    lvGlow(
      e,
      cx,
      cy,
      150 + Math.min(L, 10) * 17 + Math.max(0, L - 10) * 8 + Math.sin(tm * 3) * 8,
      c[0],
      Math.min(0.6, 0.14 + L * 0.035) * (L > 12 ? 0.7 : 1),
    );
    if (L >= 3) {
      let k = 1 + 0.06 * Math.sin(tm * 4);
      ((e.strokeStyle = c[0]),
        (e.lineWidth = 3),
        (e.globalAlpha = 0.3 + L * 0.04),
        e.beginPath(),
        e.ellipse(
          a.x,
          a.y + 4,
          (125 + L * 8) * k,
          18 + L * 1.5,
          0,
          0,
          Math.PI * 2,
        ),
        e.stroke(),
        L >= 6 &&
          ((e.globalAlpha = 0.25 + L * 0.03),
          e.beginPath(),
          e.ellipse(a.x, a.y + 4, (95 + L * 6) / k, 13 + L, 0, 0, Math.PI * 2),
          e.stroke()));
    }
    if (L >= 12) {
      e.strokeStyle = c[1];
      e.lineWidth = 3;
      let extra = L >= 16 ? 2 : 1;
      for (let r = 0; r < extra; r++) {
        e.globalAlpha = 0.28 + L * 0.01;
        e.beginPath();
        e.ellipse(a.x, a.y + 4, (160 + L * 9 + r * 38) * (1 + 0.05 * Math.sin(tm * 3 + r)), 24 + L * 1.6 + r * 6, 0, 0, Math.PI * 2);
        e.stroke();
      }
    }
    if (L >= 15) {
      let g = e.createLinearGradient(0, 0, 0, a.y + 6);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, c[0]);
      e.fillStyle = g;
      e.globalAlpha = 0.16 + (L - 15) * 0.03 + Math.sin(tm * 6) * 0.03;
      let pw = 40 + (L - 14) * 9;
      e.fillRect(cx - pw / 2, 0, pw, a.y + 6);
      e.fillRect(cx - pw * 0.18, 0, pw * 0.36, a.y + 6);
    }
    if (L >= 17) {
      for (let i = 0; i < 2; i++) {
        let ph = (tm * 0.8 + i * 0.5) % 1;
        e.strokeStyle = L >= 20 ? `hsl(${(tm * 200 + i * 180) % 360},100%,70%)` : c[1];
        e.lineWidth = 4 * (1 - ph) + 1;
        e.globalAlpha = (1 - ph) * 0.6;
        e.beginPath();
        e.ellipse(a.x, a.y + 4, 120 + ph * 420, 18 + ph * 80, 0, 0, Math.PI * 2);
        e.stroke();
      }
    }
    if (L >= 20) {
      for (let sd = -1; sd <= 1; sd += 2) {
        for (let i = 0; i < 7; i++) {
          let an = -Math.PI / 2 + sd * (0.35 + i * 0.17) + Math.sin(tm * 2 + i) * 0.04,
            len = 250 + i * 22 - Math.abs(i - 3) * 8,
            tx = cx + Math.cos(an) * len,
            ty = cy - 20 + Math.sin(an) * len * 0.8,
            g2 = e.createLinearGradient(cx, cy, tx, ty);
          g2.addColorStop(0, "rgba(255,255,255,0.55)");
          g2.addColorStop(1, "rgba(255,213,74,0)");
          e.globalAlpha = 0.5;
          e.strokeStyle = g2;
          e.lineWidth = 16 - i;
          e.lineCap = "round";
          e.beginPath();
          e.moveTo(cx, cy);
          e.lineTo(tx, ty);
          e.stroke();
        }
      }
    }
    if (L >= 10) {
      e.fillStyle = c[1];
      let rayN = 12 + Math.max(0, L - 10) * 2;
      for (let i = 0; i < rayN; i++) {
        let an = tm * 0.35 + (i * Math.PI * 2) / rayN,
          len = 330 + (L - 10) * 14 + Math.sin(tm * 2 + i) * 30;
        ((e.globalAlpha = 0.1),
          e.beginPath(),
          e.moveTo(cx, cy),
          e.lineTo(
            cx + Math.cos(an - 0.07) * len,
            cy + Math.sin(an - 0.07) * len,
          ),
          e.lineTo(
            cx + Math.cos(an + 0.07) * len,
            cy + Math.sin(an + 0.07) * len,
          ),
          e.closePath(),
          e.fill());
      }
    }
    if (L >= 8) {
      let n = L >= 10 ? 9 + Math.max(0, L - 10) : 6;
      e.lineCap = "round";
      for (let i = 0; i < n; i++) {
        let y0 = cy - 70 + i * (150 / n),
          len = 130 + L * 14 + Math.sin(tm * 6 + i) * 18,
          x0 = cx - w * 0.3,
          g = e.createLinearGradient(x0, 0, x0 - len, 0),
          hue = (tm * 140 + i * (360 / n)) % 360;
        (g.addColorStop(0, `hsla(${hue},100%,65%,0.75)`),
          g.addColorStop(1, `hsla(${hue},100%,65%,0)`),
          (e.globalAlpha = 1),
          (e.strokeStyle = g),
          (e.lineWidth = 5),
          e.beginPath(),
          e.moveTo(x0, y0),
          e.lineTo(x0 - len, y0 + Math.sin(tm * 5 + i) * 8),
          e.stroke());
      }
    }
    if (L >= 9) {
      let ax = cx - w * 0.06,
        ay = cy - h * 0.2,
        fl = Math.sin(tm * 5) * 0.2;
      for (let s = 0; s < 2; s++) {
        let off = s ? -0.18 : 0;
        for (let i = 0; i < 8; i++) {
          let an = -2.75 + i * 0.2 + fl + off,
            len = (110 + i * 16) * (1 + Math.min(0.6, Math.max(0, L - 8) * 0.045)),
            tx = ax + Math.cos(an) * len,
            ty = ay + Math.sin(an) * len,
            g = e.createLinearGradient(ax, ay, tx, ty);
          (g.addColorStop(0, c[1]),
            g.addColorStop(1, c[0]),
            (e.globalAlpha = s ? 0.28 : 0.5),
            (e.fillStyle = g),
            e.beginPath(),
            e.moveTo(ax, ay),
            e.quadraticCurveTo((ax + tx) / 2 - 8, (ay + ty) / 2 + 14, tx, ty),
            e.quadraticCurveTo((ax + tx) / 2 + 16, (ay + ty) / 2 - 4, ax, ay),
            e.fill());
        }
      }
    }
    e.restore();
  }
  function lvFront(e, t, a, f, p, w, h) {
    let L = lvLevel(t);
    if (L < 2) return;
    let tm = t.time,
      c = LV_COL[L],
      cx = f + w * 0.5,
      cy = p + h * 0.55;
    (e.save(), (e.filter = "none"), (e.globalCompositeOperation = "lighter"));
    let N = 8 + L * 5;
    for (let i = 0; i < N; i++) {
      let ph = (tm * (0.5 + lvR(i, 1) * 0.6) + lvR(i, 2)) % 1,
        px = cx + (lvR(i, 3) - 0.5) * w * 0.95 - ph * 70,
        py = p + h * 0.95 - ph * (h * 0.9 + L * 10),
        sz = (2 + lvR(i, 4) * 3 + L * 0.3) * (1 - ph * 0.55);
      ((e.globalAlpha = Math.sin(ph * Math.PI) * (0.55 + L * 0.04)),
        (e.fillStyle = i % 2 ? c[1] : c[0]));
      if (L >= 6 && i % 3 === 0) lvStar(e, px, py, sz * 2.2, tm * 2 + i);
      else (e.beginPath(), e.arc(px, py, sz, 0, Math.PI * 2), e.fill());
    }
    if (L >= 4) {
      let k = Math.min(6 + Math.max(0, (L - 10) >> 1), L - 2);
      for (let i = 0; i < k; i++) {
        let an = tm * 2.2 + (i * Math.PI * 2) / k,
          ox = cx + Math.cos(an) * w * 0.52,
          oy = cy + Math.sin(an) * h * 0.34 - Math.cos(tm) * 6;
        (lvGlow(
          e,
          ox,
          oy,
          12 + L * 1.4,
          L >= 8 ? `hsl(${(tm * 120 + i * 60) % 360},100%,70%)` : c[1],
          0.9,
        ),
          (e.globalAlpha = 1),
          (e.fillStyle = "#fff"),
          e.beginPath(),
          e.arc(ox, oy, 3 + L * 0.25, 0, Math.PI * 2),
          e.fill());
      }
    }
    if (L >= 6) {
      let sd = Math.floor(tm * 10),
        n = Math.min(L - 4, 12);
      ((e.lineJoin = "round"),
        (e.shadowColor = c[0]),
        (e.shadowBlur = 14),
        (e.strokeStyle = c[1]),
        (e.lineWidth = 2));
      for (let i = 0; i < n; i++) {
        let an = lvR(sd + i, 5) * Math.PI * 2,
          sx = cx + Math.cos(an) * w * 0.3,
          sy = cy + Math.sin(an) * h * 0.3,
          len = 60 + lvR(sd + i, 6) * 50;
        ((e.globalAlpha = 0.55 + lvR(sd + i, 7) * 0.45),
          e.beginPath(),
          e.moveTo(sx, sy));
        for (let j = 1; j <= 5; j++) {
          let d = (len * j) / 5,
            jit = (lvR(sd + i * 7 + j, 8) - 0.5) * 26;
          e.lineTo(
            sx + Math.cos(an) * d - Math.sin(an) * jit,
            sy + Math.sin(an) * d + Math.cos(an) * jit,
          );
        }
        e.stroke();
      }
      e.shadowBlur = 0;
    }
    if (L >= 7) {
      let n = L - 2;
      for (let i = 0; i < n; i++) {
        let sd = Math.floor(tm * 2 + i * 0.37),
          ph = (tm * 2 + i * 0.37) % 1,
          sx = cx + (lvR(sd + i, 9) - 0.5) * w * 1.1,
          sy = cy + (lvR(sd + i, 10) - 0.5) * h * 0.95;
        ((e.globalAlpha = Math.sin(ph * Math.PI)),
          (e.fillStyle = "#fff"),
          lvStar(e, sx, sy, 5 + L + Math.sin(ph * Math.PI) * 6, ph * 2));
      }
    }
    if (L >= 10) {
      let hx = cx + w * 0.12,
        hy = p - 8;
      for (let r = 0; r < (L >= 17 ? 4 : L >= 13 ? 3 : 2); r++) {
        let rx = 84 + r * 34,
          ry = 20 + r * 8;
        ((e.strokeStyle = r ? c[1] : c[0]),
          (e.lineWidth = 3),
          (e.globalAlpha = 0.85),
          (e.shadowColor = c[1]),
          (e.shadowBlur = 18),
          e.beginPath(),
          e.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2),
          e.stroke(),
          (e.shadowBlur = 0),
          (e.globalAlpha = 0.7),
          (e.fillStyle = c[1]));
        for (let i = 0; i < 12; i++) {
          let an = tm * (r ? -1.2 : 1.4) + (i * Math.PI) / 6;
          lvStar(
            e,
            hx + Math.cos(an) * rx,
            hy + Math.sin(an) * ry,
            r ? 4 : 5,
            an,
          );
        }
      }
      let ns = 5 + Math.max(0, L - 10);
      for (let i = 0; i < ns; i++) {
        let an = tm * 1.6 + (i * Math.PI * 2) / ns;
        ((e.globalAlpha = 0.95),
          (e.fillStyle = `hsl(${(tm * 160 + i * 72) % 360},100%,72%)`),
          lvStar(
            e,
            cx + Math.cos(an) * w * 0.62,
            cy + Math.sin(an) * h * 0.5,
            9,
            tm * 3 + i,
          ));
      }
    }
    if (L >= 14) {
      let nc = Math.min(8, L - 10);
      e.lineCap = "round";
      for (let i = 0; i < nc; i++) {
        let an = tm * (1.1 + i * 0.07) + (i * Math.PI * 2) / nc,
          hx = cx + Math.cos(an) * w * 0.7,
          hy = cy + Math.sin(an) * h * 0.55,
          col = L >= 16 ? `hsl(${(tm * 150 + i * 45) % 360},100%,70%)` : c[1];
        for (let j = 0; j < 10; j++) {
          let a2 = an - j * 0.07;
          e.globalAlpha = (1 - j / 10) * 0.8;
          e.fillStyle = col;
          e.beginPath();
          e.arc(cx + Math.cos(a2) * w * 0.7, cy + Math.sin(a2) * h * 0.55, 7 - j * 0.55, 0, Math.PI * 2);
          e.fill();
        }
        e.globalAlpha = 1;
        e.fillStyle = "#fff";
        lvStar(e, hx, hy, 10, tm * 4 + i);
      }
    }
    if (L >= 20) {
      let kx = cx + w * 0.12,
        ky = p - 62;
      e.globalAlpha = 0.95;
      e.shadowColor = "#ffd54a";
      e.shadowBlur = 20;
      for (let i = 0; i < 7; i++) {
        let off = (i - 3) * 22;
        e.fillStyle = `hsl(${(tm * 120 + i * 50) % 360},100%,70%)`;
        e.beginPath();
        e.moveTo(kx + off - 10, ky + Math.abs(i - 3) * 6 + 30);
        e.lineTo(kx + off, ky - (3 - Math.abs(i - 3)) * 14 - 8 + Math.sin(tm * 6 + i) * 3);
        e.lineTo(kx + off + 10, ky + Math.abs(i - 3) * 6 + 30);
        e.closePath();
        e.fill();
      }
      e.shadowBlur = 0;
    }
    e.restore();
  }
  var LV_TITLES = [
    null, null, null, null, null, null, null, null, null, null, null,
    ["SI\xCAU C\u1EA4P", "SUPER"],
    ["ANH H\xD9NG", "HERO"],
    ["HUY\u1EC0N THO\u1EA0I", "LEGEND"],
    ["TH\u1EA6N L\u1EF0C", "DIVINE POWER"],
    ["TH\u1EA6N THO\u1EA0I", "MYTHIC"],
    ["THI\xCAN H\xC0", "GALACTIC"],
    ["V\u0168 TR\u1EE4", "COSMIC"],
    ["B\u1EA4T T\u1EEC", "IMMORTAL"],
    ["TH\u1EA6N TH\xDA", "GODBEAST"],
    ["T\u1ED0I TH\u01AF\u1EE2NG", "SUPREME"],
  ];
  function lvFx(e, L, c, u, al, cx, cy) {
    let k = L - 10;
    for (let i = 0; i < 3 + k; i++) {
      let x = lvR(i, 50) * M,
        wd = 18 + L * 1.2 + lvR(i, 51) * 30,
        g = e.createLinearGradient(0, 0, 0, E);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, L >= 16 ? `hsl(${(i * 47 + u * 160) % 360},100%,70%)` : c[0]);
      g.addColorStop(1, "rgba(255,255,255,0)");
      e.globalAlpha = al * (0.1 + 0.08 * Math.sin(u * 6 + i)) * Math.min(1, u / 0.4);
      e.fillStyle = g;
      e.fillRect(x - wd / 2, 0, wd, E);
    }
    if (L >= 14) {
      let n = 20 + L * 2,
        ea = skEase(Math.min(1, u / 0.7));
      e.lineCap = "round";
      for (let i = 0; i < n; i++) {
        let an = (i * Math.PI * 2) / n + lvR(i, 52) * 0.1,
          r0 = 120 + 340 * ea,
          r1 = r0 + 60 + lvR(i, 53) * 160;
        e.globalAlpha = al * 0.55 * (1 - Math.min(1, u / 2.2));
        e.strokeStyle = i % 2 ? c[1] : c[0];
        e.lineWidth = 3;
        e.beginPath();
        e.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0);
        e.lineTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1);
        e.stroke();
      }
    }
    if (L >= 16) {
      e.globalAlpha = al * (0.35 + 0.15 * Math.sin(u * 9));
      e.strokeStyle = `hsl(${(u * 260) % 360},100%,68%)`;
      e.lineWidth = 16;
      e.strokeRect(8, 8, M - 16, E - 16);
    }
    if (L >= 18) {
      e.globalAlpha = al * 0.12;
      e.fillStyle = c[1];
      lvStar(e, cx, cy, 340 + Math.sin(u * 3) * 24, u * 0.7);
    }
    if (L >= 20) {
      e.globalAlpha = al * Math.max(0, 0.1 * (1 - u / 0.8));
      e.fillStyle = "#fff0b0";
      e.fillRect(0, 0, M, E);
      for (let i = 0; i < 70; i++) {
        let x = lvR(i, 60) * M,
          sp = 120 + lvR(i, 61) * 220,
          y = ((u * sp + lvR(i, 62) * E) % (E + 60)) - 30;
        e.globalAlpha = al * 0.85;
        e.fillStyle = `hsl(${(i * 31 + u * 240) % 360},100%,72%)`;
        lvStar(e, x, y, 6 + lvR(i, 63) * 8, u * 3 + i);
      }
    }
  }
  function lvSub(e, t, L, fam, c, u) {
    let tt = LV_TITLES[L];
    if (!tt) return;
    let txt = T(t.lang, tt[0], tt[1]) + (L >= 20 ? " \xB7 MAX" : ""),
      fs = 24 + (L - 10) * 1.8,
      pulse = 1 + 0.04 * Math.sin(u * 8);
    e.save();
    e.translate(0, 112);
    e.scale(pulse, pulse);
    e.font = `900 ${fs}px ${fam}`;
    e.lineWidth = 8;
    e.strokeStyle = "rgba(20,0,35,0.92)";
    e.strokeText(txt, 0, 0);
    e.shadowColor = c[0];
    e.shadowBlur = 16;
    e.fillStyle = L >= 16 ? `hsl(${(u * 260) % 360},100%,72%)` : c[1];
    e.fillText(txt, 0, 0);
    e.restore();
  }
  function lvArrow(e, x, y, s) {
    (e.beginPath(),
      e.moveTo(x, y - s),
      e.lineTo(x + s * 0.9, y + s * 0.05),
      e.lineTo(x + s * 0.38, y + s * 0.05),
      e.lineTo(x + s * 0.38, y + s * 0.85),
      e.lineTo(x - s * 0.38, y + s * 0.85),
      e.lineTo(x - s * 0.38, y + s * 0.05),
      e.lineTo(x - s * 0.9, y + s * 0.05),
      e.closePath(),
      e.fill());
  }
  function lvOverlay(e, t, hud) {
    let L = lvLevel(t),
      c = LV_COL[L],
      fam = fe != null ? fe : "sans-serif";
    if (hud) {
      (e.save(),
        (e.textBaseline = "middle"),
        (e.fillStyle = "rgba(12,12,24,0.6)"),
        se(e, 222, 152, 130, 24, 12),
        e.fill(),
        (e.strokeStyle = L >= 2 ? c[0] : "rgba(255,255,255,0.35)"),
        (e.lineWidth = 2),
        se(e, 222, 152, 130, 24, 12),
        e.stroke(),
        (e.fillStyle = L >= 2 ? c[1] : "#fff"),
        (e.font = `800 16px ${fam}`),
        e.fillText(`LV ${L}`, 236, 164.5),
        (e.fillStyle = "rgba(255,255,255,0.65)"),
        (e.font = `600 12px ${fam}`),
        e.fillText(
          L >= 20 ? "MAX" : `/ ${LV_TH[L].toLocaleString("en-US")}`,
          284,
          164.5,
        ),
        e.restore());
    }
    let u = t.time - t.lvT0,
      D = 3.2 + L * 0.12;
    if (!(L >= 2) || !(u >= 0) || u >= D) return;
    let al = u < 0.25 ? u / 0.25 : u > D - 0.7 ? (D - u) / 0.7 : 1,
      k = Math.min(1, u / 0.45),
      v = 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2),
      sc = 0.4 + 0.6 * v,
      cx = M / 2,
      cy = 190;
    (e.save(),
      (e.globalCompositeOperation = "lighter"),
      u < 0.4 &&
        L >= 3 &&
        ((e.globalAlpha = (1 - u / 0.4) * 0.35),
        (e.fillStyle = c[1]),
        e.fillRect(0, 0, M, E)),
      lvGlow(e, cx, cy, 250 + L * 22, c[0], al * Math.max(0.28, 0.55 - Math.max(0, L - 10) * 0.03)));
    let rn = 8 + L * 3;
    e.fillStyle = c[1];
    for (let i = 0; i < rn; i++) {
      let an = u * 0.6 + (i * Math.PI * 2) / rn,
        len = (200 + L * 28) * Math.min(1, u / 0.5);
      ((e.globalAlpha = al * 0.16),
        e.beginPath(),
        e.moveTo(cx, cy),
        e.lineTo(
          cx + Math.cos(an - 0.05) * len,
          cy + Math.sin(an - 0.05) * len,
        ),
        e.lineTo(
          cx + Math.cos(an + 0.05) * len,
          cy + Math.sin(an + 0.05) * len,
        ),
        e.closePath(),
        e.fill());
    }
    let rings = L >= 20 ? 7 : L >= 16 ? 6 : L >= 12 ? 5 : L >= 10 ? 4 : L >= 8 ? 3 : L >= 5 ? 2 : 1;
    ((e.strokeStyle = c[0]), (e.lineWidth = 4));
    for (let i = 0; i < rings; i++) {
      let r = (u - i * 0.22) * 520;
      r > 0 &&
        r < 620 &&
        ((e.globalAlpha = al * Math.max(0, 1 - r / 620) * 0.8),
        e.beginPath(),
        e.arc(cx, cy, r, 0, Math.PI * 2),
        e.stroke());
    }
    let pn = 10 + L * 6,
      ease = 1 - Math.pow(1 - Math.min(u / 1.3, 1), 3);
    for (let i = 0; i < pn; i++) {
      let an = lvR(i, 1) * Math.PI * 2,
        d = (0.35 + lvR(i, 2) * 0.65) * (130 + L * 32) * ease,
        px = cx + Math.cos(an) * d * 1.5,
        py = cy + Math.sin(an) * d + u * u * 22,
        sz = 2 + lvR(i, 3) * 3 + L * 0.3;
      ((e.globalAlpha = al * (0.5 + 0.5 * Math.sin(u * 8 + i))),
        (e.fillStyle =
          L >= 8
            ? `hsl(${(i * 37 + u * 200) % 360},100%,70%)`
            : i % 2
              ? c[1]
              : c[0]),
        L >= 5 && i % 2 === 0
          ? lvStar(e, px, py, sz * 2.4, u * 3 + i)
          : (e.beginPath(), e.arc(px, py, sz, 0, Math.PI * 2), e.fill()));
    }
    L >= 11 && lvFx(e, L, c, u, al, cx, cy);
    e.restore();
    (e.save(),
      (e.globalAlpha = al),
      e.translate(cx, cy),
      e.scale(sc, sc),
      (e.textAlign = "center"),
      (e.textBaseline = "middle"),
      (e.lineJoin = "round"));
    let fs = 52 + L * 2.5,
      wob = Math.sin(u * 9) * 0.015;
    (e.rotate(wob), (e.font = `900 ${fs}px ${fam}`));
    let tw = e.measureText("UP LEVEL").width,
      g = e.createLinearGradient(0, -fs * 0.5 - 18, 0, fs * 0.5 - 18);
    (g.addColorStop(0, c[1]),
      g.addColorStop(1, c[0]),
      (e.lineWidth = 11),
      (e.strokeStyle = "rgba(20,0,35,0.92)"),
      e.strokeText("UP LEVEL", 0, -18),
      (e.shadowColor = c[0]),
      (e.shadowBlur = 18 + L * 3),
      (e.fillStyle = g),
      e.fillText("UP LEVEL", 0, -18),
      (e.shadowBlur = 0));
    ((e.fillStyle = L >= 8 ? `hsl(${(u * 220) % 360},100%,68%)` : c[0]),
      (e.strokeStyle = "rgba(20,0,35,0.9)"),
      (e.lineWidth = 3));
    for (let sd = -1; sd <= 1; sd += 2) {
      let ax = sd * (tw / 2 + 62);
      for (let j = 0; j < 3; j++) {
        let ph = (u * 1.7 + j / 3) % 1,
          ay = 34 - ph * 84,
          s = 26 + L;
        ((e.globalAlpha = al * Math.sin(ph * Math.PI)),
          e.save(),
          e.translate(ax, ay),
          e.scale(1, 1),
          lvArrow(e, 0, 0, s),
          e.restore());
      }
    }
    e.globalAlpha = al;
    let ls = 40 + L * 2.5,
      txt =
        T(t.lang, `LEVEL ${L}`, `LEVEL ${L}`) + (L >= 20 ? " \xB7 MAX" : "");
    ((e.font = `900 ${ls}px ${fam}`),
      (e.lineWidth = 9),
      (e.strokeStyle = "rgba(20,0,35,0.92)"),
      e.strokeText(txt, 0, 50),
      (e.shadowColor = c[0]),
      (e.shadowBlur = 14 + L * 2),
      (e.fillStyle = "#fff"),
      e.fillText(txt, 0, 50),
      L >= 11 && lvSub(e, t, L, fam, c, u),
      e.restore());
  }
  /* ============ Vũ khí hỗ trợ theo level: lựu đạn / máy bay / tên lửa / hạt nhân ============ */
  var SK_MAX = { grenade: 2, bomber: 2, missile: 1, nuke: 1 };
  var SK_RATE = { grenade: 0.05, bomber: 0.04, missile: 0.04, nuke: 0.035 };
  var skClamp = (v, a, b) => Math.max(a, Math.min(b, v));
  var skEase = (u) => 1 - Math.pow(1 - skClamp(u, 0, 1), 3);
  function skTier(L) {
    return L < 5 ? "grenade" : L < 11 ? "bomber" : L < 16 ? "missile" : "nuke";
  }
  function skMeta(e) {
    skFxInit();
    return (
      e.skMeta ||
      (e.skMeta = {
        used: { grenade: 0, bomber: 0, missile: 0, nuke: 0 },
        next: 7,
        acc: 0,
        rng: Z(ye(e.seed, 60601)),
        lv: lvOf(e.score || 0),
      })
    );
  }
  function skTargets(e) {
    return e.monsters.filter((m) => m.hp > 0 && m.x > 150 && m.x < M - 70);
  }
  function skMuzzle(e) {
    let g = we(e.player);
    return { x: g.x, y: g.y };
  }
  function skBez(a, b, c, u) {
    let k = 1 - u;
    return {
      x: k * k * a.x + 2 * k * u * b.x + u * u * c.x,
      y: k * k * a.y + 2 * k * u * b.y + u * u * c.y,
    };
  }
  function skAim(s, m) {
    if (m && m.hp > 0 && m.x > -50) {
      s.ax = m.x;
      s.ay = m.y;
    }
  }
  function skBlast(e, x, y, R, dmg, column) {
    let k = 0;
    for (let m of e.monsters.slice()) {
      if (m.hp <= 0) continue;
      let hit = column
        ? Math.abs(m.x - x) < R + m.w * 0.35
        : Math.hypot(m.x - x, (m.y - y) * 0.8) < R + m.w * 0.4;
      if (hit) {
        e.strike &&
          (e.strike.hitFx || (e.strike.hitFx = [])).push({
            x: m.x,
            y: m.y - m.h * 0.5,
            t0: e.strike.t,
            s: Math.max(90, m.h),
          });
        $e(e, m, dmg);
        k++;
      }
    }
    return k;
  }
  function skCam(e, z, x, y, roll, bars) {
    q(e, z, x, y, 0.35, roll || 0);
    bars && (e.cam.bars = Math.min(bars, e.cam.bars + 0.05));
  }
  function skSlow(e, scale) {
    e.slowT = 0.5;
    e.slowScale = scale;
  }
  function skTxt(s, t0, t1, text, sub, y, size, col, glow, wave) {
    s.texts.push({ t0, t1, text, sub, y, size, col, glow, wave });
  }

  var SK_START = {
    grenade(e, tg, m) {
      let tgt = tg[Math.floor(m.rng.next() * tg.length)],
        o = skMuzzle(e),
        s = {
          type: "grenade",
          t: 0,
          T: 0.95,
          dur: 2.5,
          ox: o.x,
          oy: o.y,
          tgt,
          ax: tgt.x,
          ay: tgt.y,
          texts: [],
          kills: 0,
        };
      skTxt(
        s,
        0,
        1.5,
        T(e.lang, "SÚNG PHÓNG LỰU!", "GRENADE LAUNCHER!"),
        T(e.lang, "Nạp đạn - bắn!", "Locked and loaded!"),
        215,
        64,
        ["#fff7b0", "#ffc83a", "#ff6a1e"],
        "rgba(255,120,30,0.95)",
        4,
      );
      N(e, "grenadeShoot");
      return s;
    },
    bomber(e, tg, m) {
      let xs = tg.map((a) => a.x),
        lo = Math.min(...xs) - 70,
        hi = Math.max(...xs) + 70,
        n = 8,
        sp = skClamp((hi - lo) / (n - 1), 95, 150),
        x0 = skClamp(lo, 110, M - 110 - sp * (n - 1)),
        V = 540,
        T0 = 1.1,
        s = {
          type: "bomber",
          t: 0,
          V,
          T0,
          F: 0.85,
          bombs: [],
          kills: 0,
          texts: [],
          dur: 0,
        };
      for (let k = 0; k < n; k++) {
        let x = x0 + k * sp;
        s.bombs.push({ x, td: T0 + (x + 280) / V, done: false });
      }
      s.dur = s.bombs[n - 1].td + s.F + 2.1;
      skTxt(
        s,
        0,
        2.6,
        T(e.lang, "KHÔNG KÍCH!", "AIR STRIKE!"),
        T(e.lang, "Máy bay ném bom đang tới", "Bombers inbound"),
        200,
        74,
        ["#fff7b0", "#ffb81c", "#ff3d2e"],
        "rgba(255,90,30,0.95)",
        5,
      );
      skTxt(
        s,
        s.bombs[0].td,
        s.bombs[0].td + 1.8,
        T(e.lang, "THẢ BOM!", "BOMBS AWAY!"),
        "",
        250,
        66,
        ["#ffffff", "#ffe08a", "#ff8a1e"],
        "rgba(255,150,30,0.95)",
        6,
      );
      N(e, "planeFly");
      return s;
    },
    missile(e, tg, m) {
      let o = skMuzzle(e),
        list = tg.slice(0, 3),
        s = {
          type: "missile",
          t: 0,
          F: 1.75,
          o,
          ms: list.map((mo, i) => ({
            tgt: mo,
            ax: mo.x,
            ay: mo.y,
            tl: 1.5 + i * 0.24,
            done: false,
          })),
          kills: 0,
          texts: [],
          dur: 0,
        };
      s.dur = 1.5 + (list.length - 1) * 0.24 + s.F + 2.4;
      skTxt(
        s,
        0,
        1.6,
        T(e.lang, "KHÓA MỤC TIÊU", "TARGET LOCKED"),
        T(e.lang, "Tên lửa sẵn sàng", "Missiles armed"),
        215,
        66,
        ["#ffffff", "#9fe8ff", "#2fb8ff"],
        "rgba(40,170,255,0.95)",
        4,
      );
      skTxt(
        s,
        1.5,
        3.1,
        T(e.lang, "PHÓNG TÊN LỬA!", "MISSILES AWAY!"),
        "",
        215,
        72,
        ["#fff7b0", "#ff9a3a", "#ff3322"],
        "rgba(255,80,40,0.95)",
        6,
      );
      N(e, "missileLock");
      return s;
    },
    nuke(e, tg, m) {
      let cx = tg.reduce((a, b) => a + b.x, 0) / tg.length,
        s = {
          type: "nuke",
          t: 0,
          T: 6.2,
          cx: skClamp(cx, 260, M - 220),
          boom: false,
          dur: 12.6,
          texts: [],
          kills: 0,
        };
      skTxt(
        s,
        0.15,
        2.8,
        T(e.lang, "CẢNH BÁO!", "WARNING!"),
        T(e.lang, "PHÁT HIỆN TÊN LỬA HẠT NHÂN", "NUCLEAR LAUNCH DETECTED"),
        215,
        92,
        ["#ffffff", "#ffd2d2", "#ff2a2a"],
        "rgba(255,30,30,0.98)",
        6,
      );
      skTxt(
        s,
        3,
        5.0,
        T(e.lang, "VŨ KHÍ HẠT NHÂN ĐANG RƠI", "NUCLEAR WARHEAD INBOUND"),
        "",
        120,
        54,
        ["#ffffff", "#fff0a0", "#ff9a1e"],
        "rgba(255,120,20,0.95)",
        4,
      );
      skTxt(
        s,
        s.T + 0.7,
        s.T + 3.3,
        T(e.lang, "HẠT NHÂN", "NUCLEAR STRIKE"),
        T(e.lang, "Quái vật bị xóa sổ", "Total annihilation"),
        205,
        112,
        ["#ffffff", "#ffe27a", "#ff4a12"],
        "rgba(255,90,10,1)",
        8,
      );
      N(e, "nukeSiren");
      return s;
    },
  };

  var SK_RUN = {
    grenade(e, s) {
      let T0 = s.T;
      skAim(s, s.tgt);
      let mx = (s.ox + s.ax) / 2,
        my = (s.oy + s.ay) / 2 - 20;
      if (s.t < T0 + 0.8) skCam(e, 1.28, mx, my, 0.02, 0);
      if (s.t > T0 - 0.4 && s.t < T0 + 0.35) skSlow(e, 0.33);
      if (s.t >= T0 && !s.hit) {
        s.hit = true;
        s.ix = s.ax;
        s.iy = s.ay;
        s.kills = skBlast(e, s.ax, s.ay, 175, 520, false);
        N(e, "boom1");
        e.shake = Math.max(e.shake, 0.75);
        e.flash = { color: "rgba(255,210,140,0.35)", t: 0.18 };
        he(e, T(e.lang, "BÙM!", "BOOM!"), s.ax, s.ay - 90, "#ffb02e", 62, 1.2);
        s.kills >= 2 &&
          he(e, `x${s.kills} KILL`, s.ax, s.ay - 150, "#ff5a3c", 44, 1.4);
      }
    },
    bomber(e, s) {
      let px = -280 + s.V * (s.t - s.T0);
      skCam(e, 1.1, skClamp(px, 300, M - 300), E * 0.5, 0, 0);
      let first = s.bombs[0];
      for (let b of s.bombs) {
        if (!b.dropped && s.t >= b.td) {
          b.dropped = true;
          N(e, "bombFall");
        }
        if (!b.done && s.t >= b.td + s.F) {
          b.done = true;
          s.kills += skBlast(e, b.x, P, 135, 700, true);
          N(e, "boom2");
          e.shake = Math.max(e.shake, 0.6);
          e.flash = { color: "rgba(255,190,110,0.22)", t: 0.1 };
        }
      }
      if (s.t > first.td + s.F - 0.3 && s.t < first.td + s.F + 0.4)
        skSlow(e, 0.45);
      if (!s.fin && s.bombs[s.bombs.length - 1].done) {
        s.fin = true;
        let t0 = s.t;
        skTxt(
          s,
          t0,
          t0 + 2,
          s.kills >= 3
            ? T(e.lang, "SAN BẰNG!", "TOTAL DESTRUCTION!")
            : T(e.lang, "TRÚNG ĐÍCH!", "DIRECT HITS!"),
          s.kills ? `x${s.kills} KILL` : "",
          230,
          80,
          ["#ffffff", "#ffd36a", "#ff4a1e"],
          "rgba(255,100,30,0.95)",
          6,
        );
      }
    },
    missile(e, s) {
      let o = s.o,
        al = s.ms.filter((m) => !m.done),
        f = al[0] || s.ms[0];
      for (let m of s.ms) skAim(m, m.tgt);
      if (s.t < 1.5) skCam(e, 1.18, (o.x + f.ax) / 2, (o.y + f.ay) / 2, 0, 0.5);
      else {
        let u = skClamp((s.t - f.tl) / s.F, 0, 1);
        if (u < 0.55) skCam(e, 1.25, (o.x + f.ax) / 2, 260, 0, 0.8);
        else
          skCam(
            e,
            1.55 + u * 0.55,
            f.ax,
            f.ay - 30,
            (f.ax > M / 2 ? 1 : -1) * 0.02,
            1,
          );
      }
      for (let m of s.ms) {
        let u = (s.t - m.tl) / s.F;
        if (!m.launched && s.t >= m.tl) {
          m.launched = true;
          N(e, "missileLaunch");
        }
        if (u > 0.62 && u < 1.04) skSlow(e, 0.28);
        if (!m.done && u >= 1) {
          m.done = true;
          s.kills += skBlast(e, m.ax, m.ay, 210, 1800, false);
          N(e, "boom3");
          e.shake = Math.max(e.shake, 0.95);
          e.flash = { color: "rgba(255,230,170,0.5)", t: 0.28 };
          he(
            e,
            T(e.lang, "BÙM!!", "BOOM!!"),
            m.ax,
            m.ay - 110,
            "#ffcf4a",
            70,
            1.3,
          );
        }
      }
      if (!s.fin && s.ms.every((m) => m.done)) {
        s.fin = true;
        let t0 = s.t;
        skTxt(
          s,
          t0,
          t0 + 2.2,
          T(e.lang, "TRÚNG MỤC TIÊU!", "DIRECT HIT!"),
          s.kills ? `x${s.kills} KILL` : "",
          230,
          84,
          ["#ffffff", "#ffd36a", "#ff3a1e"],
          "rgba(255,90,30,0.98)",
          6,
        );
      }
    },
    nuke(e, s) {
      let T0 = s.T,
        r = T0 - s.t;
      if (s.t < T0) {
        let wu = skClamp((s.t - 2.4) / (T0 - 2.4), 0, 1);
        if (s.t < 2.4) skCam(e, 1.05, M / 2, E / 2, 0, 1);
        else
          skCam(
            e,
            1.15 + wu * 1.05,
            s.cx + (1 - wu) * 60,
            120 + wu * (P - 260),
            (1 - wu) * -0.03,
            1,
          );
        if (r < 1 && r > -0.3) skSlow(e, 0.28);
        let n = Math.ceil(r);
        if (r <= 3 && n !== s.cd && n >= 1) {
          s.cd = n;
          N(e, "missileLock");
        }
        if (s.t >= 2.4 && !s.whistle) {
          s.whistle = true;
          N(e, "nukeWhistle");
        }
      }
      if (s.t >= T0 && !s.boom) {
        s.boom = true;
        s.kills = skBlast(e, s.cx, P, 9999, 99999, false);
        e.bolts = [];
        e.fireballs = [];
        N(e, "nukeBoom");
        e.shake = 1;
      }
      if (s.boom) {
        let u = s.t - T0;
        u < 3 && (e.shake = Math.max(e.shake, 1 - u / 3));
        skCam(
          e,
          1.0 + 0.1 * Math.sin(u * 1.5),
          M / 2,
          E / 2 - 20,
          Math.sin(u * 7) * 0.012 * Math.max(0, 1 - u / 2.5),
          1,
        );
        u < 0.5 && skSlow(e, 0.4);
        if (u > 0.9 && !s.cleanse) {
          s.cleanse = true;
          skBlast(e, s.cx, P, 9999, 99999, false);
        }
      }
    },
  };

  function skTick(e, dt) {
    let m = skMeta(e),
      L = lvOf(e.score || 0);
    if (L > m.lv) {
      m.lv = L;
      N(e, "levelUp", L);
    }
    let s = e.strike;
    if (s) {
      s.t += dt;
      SK_RUN[s.type](e, s);
      if (s.t >= s.dur) {
        e.strike = null;
        m.next = e.time + 14;
      }
      return;
    }
    if (e.phase !== "play" || e.time < m.next) return;
    m.acc += dt;
    if (m.acc < 0.5) return;
    m.acc = 0;
    let type = skTier(L);
    if (m.used[type] >= SK_MAX[type]) return;
    let dur = e.director ? e.director.scenario.duration : 600;
    if (type === "nuke" && dur <= 300) return;
    if (e.time - (e.lvT0 == null ? -99 : e.lvT0) < 4.5) return;
    let tg = skTargets(e);
    if (tg.length < (type === "nuke" ? 2 : 1)) return;
    if (m.rng.next() > SK_RATE[type] * 0.5) return;
    m.used[type]++;
    e.strike = SK_START[type](e, tg, m);
  }

  /* ============ Sprite .webp cho vũ khí hỗ trợ (game/fx/*.webp, xem tools/build_fx.py) ============ */
  var SKFX = { meta: null, imgs: {}, started: false, t: 0 };
  function skFxInit() {
    if (SKFX.started) return;
    SKFX.started = true;
    fetch(`${Ge}fx/fx.json`)
      .then((r) => r.json())
      .then((m) => {
        for (let k in m) {
          let d = m[k];
          if (!d.n) continue;
          for (let i = 0; i < d.n; i++) {
            let key = d.n === 1 ? k : `${k}-${i}`,
              im = new Image();
            im.crossOrigin = "anonymous";
            im.src = `${Ge}fx/${key}.webp`;
            SKFX.imgs[key] = im;
          }
        }
        SKFX.meta = m;
      })
      .catch(() => {});
  }
  function skSpr(c, name, f, x, y, o) {
    o = o || {};
    let d = SKFX.meta && SKFX.meta[name];
    if (!d) return;
    let fi = Math.floor(f),
      i = o.loop ? ((fi % d.n) + d.n) % d.n : skClamp(fi, 0, d.n - 1),
      im = SKFX.imgs[d.n === 1 ? name : `${name}-${i}`];
    if (!im || !im.complete || !im.naturalWidth) return;
    let sc = o.sc == null ? 1 : o.sc,
      sx = (o.sx != null ? o.sx : sc) * (o.fx ? -1 : 1),
      sy = (o.sy != null ? o.sy : sc) * (o.fy ? -1 : 1);
    c.save();
    c.globalAlpha = o.al == null ? 1 : o.al;
    if (o.add) c.globalCompositeOperation = "lighter";
    c.translate(x, y);
    if (o.rot) c.rotate(o.rot);
    c.scale(sx, sy);
    c.drawImage(im, -d.ax, -d.ay, d.w, d.h);
    c.restore();
  }
  function skGlow(c, name, x, y, r, al) {
    skSpr(c, name, 0, x, y, { sc: (r * 2) / 256, al, add: name !== "glow-black" });
  }
  function skFrames(name, u) {
    let d = SKFX.meta && SKFX.meta[name];
    return d ? skClamp(u, 0, 0.9999) * d.n : 0;
  }

  function skBoom(c, x, y, u, R, pw, sd) {
    if (u < 0 || u > 1.7) return;
    let fade = u < 1.1 ? 1 : Math.max(0, 1 - (u - 1.1) / 0.6),
      flip = (sd | 0) % 2 === 1;
    if (u < 0.25) skGlow(c, "glow-white", x, y, R * (1.7 + pw * 0.3), 1 - u / 0.25);
    if (u < 0.8) {
      let k = skEase(u / 0.8),
        sx = (R * (0.6 + 2.3 * k) * 2) / 640;
      skSpr(c, "shock", skFrames("shock", u / 0.8), x, y + R * 0.15, {
        sx,
        sy: sx * 0.7,
        al: (1 - u / 0.8) * 0.9,
        add: true,
      });
    }
    skSpr(c, "explosion", skFrames("explosion", u / 1.15), x, y - R * 0.15, {
      sc: (R * 3.3) / 512,
      al: fade,
      fx: flip,
      rot: (((sd | 0) % 7) - 3) * 0.05,
    });
    if (pw >= 3 && u > 0.1)
      skSpr(c, "explosion", skFrames("explosion", (u - 0.1) / 1.15), x + R * 0.38, y - R * 0.05, {
        sc: (R * 2.4) / 512,
        al: fade,
        fx: !flip,
      });
    if (u < 0.9)
      skSpr(c, "sparks", skFrames("sparks", u / 0.9), x, y - R * 0.2, {
        sc: (R * (2.4 + pw * 0.5)) / 384,
        add: true,
      });
    if (u > 0.3) {
      let uu = u - 0.3;
      for (let i = 0; i < 3 + pw; i++)
        skSpr(
          c,
          "smoke",
          i,
          x + (lvR(i + sd, 7) - 0.5) * R * 1.3,
          y - uu * (60 + R * 0.45) - R * 0.2 - lvR(i + sd, 8) * R * 0.4,
          { sc: (R * (1.0 + uu * 0.8)) / 192, al: Math.max(0, 0.6 * (1 - uu / 1.3)), loop: true },
        );
    }
    if (pw >= 2)
      for (let i = 0; i < 8 + pw * 2; i++) {
        let a = -Math.PI * (0.1 + lvR(i + sd, 9) * 0.8),
          v = 220 + lvR(i + sd, 10) * 280;
        skSpr(c, "ember", i + u * 8, x + Math.cos(a) * v * u, y + Math.sin(a) * v * u + 480 * u * u, {
          sc: (0.16 + lvR(i + sd, 11) * 0.2) * (1 - u * 0.3),
          al: Math.max(0, 1 - u / 1.3),
          add: true,
          loop: true,
        });
      }
  }

  function skReticle(c, x, y, r, t, col) {
    let nm = col.indexOf("255,230") >= 0 ? "reticle-y" : "reticle-r";
    skSpr(c, nm, ((t * 2.4) / (Math.PI / 2)) * 8, x, y, { sc: r / 77, loop: true, al: 0.95 });
  }

  function skMissile(c, x, y, ang, sz, flame) {
    skSpr(c, "missile", SKFX.t * 22, x, y, { rot: ang, sc: (sz * 1.3) / 130, loop: true });
    if (flame)
      skGlow(c, "glow-orange", x - Math.cos(ang) * sz * 0.95, y - Math.sin(ang) * sz * 0.95, sz * 0.6, 0.55);
  }

  function skPlane(c, x, y, t) {
    skSpr(c, "glow-black", 0, x - 10, y + 494, { sx: 300 / 256, sy: 34 / 256, al: 0.35 });
    for (let i = 10; i >= 1; i--)
      skSpr(c, "smoke", i + Math.floor(t * 6), x - 160 - i * 28, y + 6 + Math.sin(i + t * 9) * 4, {
        sc: (40 + i * 7) / 192,
        al: 0.55 * (1 - i / 11),
        loop: true,
      });
    skSpr(c, "plane", t * 18, x, y, { loop: true, sc: 0.95 });
  }

  function skMushroom(c, x, gy, u, fade) {
    let rise = skEase(u / 3.2);
    skGlow(c, "glow-orange", x, gy - 40 - 260 * rise, 320 + 120 * rise, 0.5 * fade);
    skSpr(c, "mushroom", skFrames("mushroom", u / 3.4), x, gy + 6, { sc: 1.5, al: fade });
  }

  function skGrenadeLauncher(c, s, t) {
    let a = Math.atan2(s.ay - s.oy - 120, s.ax - s.ox),
      flip = Math.cos(a) < 0,
      fr = t < 0.5 ? 1 + Math.floor((t / 0.5) * 4.99) : 0,
      mx = s.ox + Math.cos(a) * 100,
      my = s.oy + Math.sin(a) * 100;
    skSpr(c, "launcher", fr, s.ox, s.oy, { rot: a, fy: flip, sc: 0.62 });
    if (t < 0.3) skSpr(c, "flash", skFrames("flash", t / 0.3), mx, my, { rot: a, sc: 0.55 });
    for (let i = 0; i < 6; i++)
      skSpr(
        c,
        "smoke",
        i,
        s.ox + Math.cos(a) * (104 + i * 14 * t * 3),
        s.oy + Math.sin(a) * (104 + i * 14 * t * 3) - t * 30 * i * 0.3,
        { sc: (40 + i * 20 * t) / 192, al: Math.max(0, 0.55 - t * 0.7), loop: true },
      );
  }

  function skDraw(c, e) {
    let s = e.strike;
    if (!s) return;
    skFxInit();
    let t = s.t;
    SKFX.t = t;
    if (s.hitFx)
      for (let h of s.hitFx) {
        let uu = (t - h.t0) / 0.75;
        if (uu < 0 || uu > 1) continue;
        skSpr(c, "explosion", skFrames("explosion", uu), h.x, h.y, {
          sc: (h.s * 1.6) / 512,
          al: 1 - uu * uu,
        });
        skSpr(c, "sparks", skFrames("sparks", uu), h.x, h.y, { sc: (h.s * 1.8) / 384, add: true });
      }
    if (s.type === "grenade") {
      let u = skClamp(t / s.T, 0, 1),
        dx = s.ax - s.ox,
        dy = s.ay - s.oy;
      if (t < 0.7) skGrenadeLauncher(c, s, t);
      if (t < s.T + 0.1) {
        let pos = (uu) => ({
            x: s.ox + dx * uu,
            y: s.oy + dy * uu - 150 * 4 * uu * (1 - uu),
          }),
          p = pos(u);
        for (let j = 12; j >= 1; j--) {
          let q2 = pos(Math.max(0, u - j * 0.022));
          skSpr(c, j < 4 ? "ember" : "smoke", j, q2.x, q2.y, {
            sc: (6 + j * 1.8) / (j < 4 ? 80 : 96),
            al: 0.55 * (1 - j / 13),
            add: j < 4,
            loop: true,
          });
        }
        skGlow(c, "glow-orange", p.x, p.y, 30, 0.6);
        skSpr(c, "grenade", t * 14, p.x, p.y, { loop: true, sc: 0.62 });
        skReticle(c, s.ax, s.ay, 52 - u * 10, t, "rgba(255,70,50,0.95)");
      }
      s.hit && skBoom(c, s.ix, s.iy, t - s.T, 140, 2, 3);
    } else if (s.type === "bomber") {
      let px = -280 + s.V * (t - s.T0),
        lastB = s.bombs[s.bombs.length - 1];
      for (let b of s.bombs) {
        let uu = (t - b.td) / s.F;
        if (uu > -0.05 && uu < 1) {
          let y1 = P - 20,
            by = 150 + (y1 - 150) * Math.pow(Math.max(0, uu), 1.7);
          for (let k = 3; k >= 1; k--)
            skSpr(c, "smoke", k, b.x, by - 34 - k * 24, { sc: (14 + k * 8) / 192, al: 0.4 / k, loop: true });
          skSpr(c, "bomb", t * 12 + b.x, b.x, by, {
            loop: true,
            rot: Math.PI / 2 - 0.1 + Math.sin(t * 6 + b.x) * 0.05,
            sc: 0.85,
          });
        }
        b.done &&
          skBoom(
            c,
            b.x,
            P - 40,
            t - b.td - s.F,
            b === lastB ? 175 : 130,
            b === lastB ? 3 : 2,
            b.x | 0,
          );
      }
      if (px > -300 && px < M + 300) skPlane(c, px, 118, t);
    } else if (s.type === "missile") {
      for (let i = 0; i < s.ms.length; i++) {
        let m = s.ms[i];
        if (t < m.tl + s.F && !m.done) {
          let lk = skClamp((t - 0.2 - i * 0.3) / 0.8, 0, 1);
          lk > 0 &&
            skReticle(
              c,
              m.ax,
              m.ay,
              78 - lk * 30,
              t,
              lk >= 1 ? "rgba(255,50,40,0.98)" : "rgba(255,230,90,0.95)",
            );
        }
        let u = (t - m.tl) / s.F;
        if (u >= 0 && u < 1) {
          let P1 = { x: s.o.x + (m.ax - s.o.x) * 0.3, y: -240 },
            P2 = { x: m.ax, y: m.ay },
            f = (v) => skBez(s.o, P1, P2, Math.pow(v, 1.15)),
            p = f(u),
            p2 = f(Math.min(1, u + 0.01)),
            ang = Math.atan2(p2.y - p.y, p2.x - p.x);
          for (let j = 18; j >= 1; j--) {
            let tp = f(Math.max(0, u - j * 0.016));
            skSpr(c, j < 5 ? "ember" : "smoke", j + i, tp.x, tp.y, {
              sc: (10 + j * 2.4) / (j < 5 ? 80 : 96),
              al: 0.6 * (1 - j / 19),
              add: j < 5,
              loop: true,
            });
          }
          skMissile(c, p.x, p.y, ang, 90 + (u > 0.55 ? 24 : 0), true);
        }
        m.done && skBoom(c, m.ax, m.ay, t - m.tl - s.F, 210, 3, 11 + i * 5);
      }
    } else if (s.type === "nuke") {
      let T0 = s.T;
      if (t < T0 + 0.05 && t > 2.3) {
        let wu = skClamp((t - 2.4) / (T0 - 2.4), 0, 1),
          wx = s.cx - 150 * (1 - wu),
          wy = -260 + (P + 270) * Math.pow(wu, 1.15);
        for (let j = 22; j >= 1; j--) {
          let uu2 = Math.max(0, wu - j * 0.02),
            tx = s.cx - 150 * (1 - uu2),
            ty = -260 + (P + 270) * Math.pow(uu2, 1.15);
          skSpr(c, j < 7 ? "ember" : "smoke", j, tx, ty - 190 - j * 6, {
            sc: (24 + j * 4.4) / (j < 7 ? 80 : 96),
            al: 0.55 * (1 - j / 23),
            add: j < 7,
            loop: true,
          });
        }
        skGlow(c, "glow-orange", wx, wy - 190, 130, 0.7);
        skSpr(c, "nuke", t * 20, wx, wy - 100, {
          rot: Math.PI / 2 - 0.25 * (1 - wu),
          sc: 1,
          loop: true,
        });
      }
      if (t >= T0) {
        let u = t - T0,
          fade = u < 3.8 ? 1 : Math.max(0, 1 - (u - 3.8) / 2.4);
        u < 1.4 &&
          skGlow(c, "glow-white", s.cx, P - 40, 520 * skEase(u / 1.1) + 80, Math.max(0, 1 - u / 1.4));
        for (let i = 0; i < 3; i++) {
          let rr = (u - i * 0.12) * 1300;
          if (rr > 0) {
            let sx = (rr * 2) / 640;
            skSpr(c, "shock", skFrames("shock", u / 2.2), s.cx, P + 6, {
              sx,
              sy: sx * 0.64,
              al: Math.max(0, 1 - u / 2.2),
              add: true,
            });
          }
        }
        skMushroom(c, s.cx, P, u, fade);
        for (let i = 0; i < 40; i++) {
          let a = lvR(i, 41) * Math.PI * 2,
            v = 160 + lvR(i, 42) * 600;
          skSpr(
            c,
            "ember",
            i + u * 10,
            s.cx + Math.cos(a) * v * u * 0.9,
            P - 40 + Math.sin(a) * v * u * 0.7 + 260 * u * u,
            { sc: (0.14 + lvR(i, 43) * 0.2), al: Math.max(0, 1 - u / 2.6), add: true, loop: true },
          );
        }
      }
    }
  }

  function skScreen(c, e) {
    let s = e.strike;
    if (!s) return;
    let t = s.t;
    if (s.type === "nuke") {
      let T0 = s.T;
      if (t < T0) {
        let pulse = 0.5 + 0.5 * Math.sin(t * 7);
        c.save();
        let g = c.createRadialGradient(M / 2, E / 2, 220, M / 2, E / 2, 760);
        g.addColorStop(0, "rgba(255,0,0,0)");
        g.addColorStop(1, `rgba(255,20,20,${0.22 + pulse * 0.4})`);
        c.fillStyle = g;
        c.fillRect(0, 0, M, E);
        c.restore();
        let r = T0 - t;
        if (r <= 3 && r > 0) {
          let n = Math.ceil(r),
            f = 1 - (r - Math.floor(r)),
            fam = fe != null ? fe : "sans-serif",
            sc = 1 + 0.35 * (1 - f);
          c.save();
          c.globalAlpha = 0.95;
          c.translate(M / 2, 360);
          c.scale(sc, sc);
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.lineJoin = "round";
          c.font = `900 190px ${fam}`;
          c.lineWidth = 22;
          c.strokeStyle = "rgba(40,0,0,0.92)";
          c.strokeText(String(n), 0, 0);
          c.shadowColor = "#ff2a2a";
          c.shadowBlur = 36;
          c.fillStyle = n === 1 ? "#ffffff" : "#ffd23a";
          c.fillText(String(n), 0, 0);
          c.restore();
        }
      } else {
        let u = t - T0,
          wh = u < 0.2 ? 1 : Math.max(0, 1 - (u - 0.2) / 2.3);
        if (wh > 0.001) {
          c.save();
          c.fillStyle = `rgba(255,252,238,${wh})`;
          c.fillRect(0, 0, M, E);
          c.restore();
        }
        if (u > 0.3 && u < 3.8) {
          c.save();
          c.globalCompositeOperation = "lighter";
          let g = c.createRadialGradient(M / 2, E * 0.72, 40, M / 2, E * 0.72, 900);
          g.addColorStop(0, `rgba(255,150,40,${0.35 * Math.max(0, 1 - u / 3.8)})`);
          g.addColorStop(1, "rgba(255,80,0,0)");
          c.fillStyle = g;
          c.fillRect(0, 0, M, E);
          c.restore();
        }
      }
    } else if (s.type === "missile") {
      let last = s.ms[s.ms.length - 1],
        t0 = last.tl + s.F - 0.1;
      if (t > t0 && t < t0 + 0.6) {
        c.save();
        c.fillStyle = `rgba(255,236,190,${0.55 * (1 - (t - t0) / 0.6)})`;
        c.fillRect(0, 0, M, E);
        c.restore();
      }
    }
    skText(c, s);
  }

  function skText(c, s) {
    let fam = fe != null ? fe : "sans-serif";
    for (let x of s.texts) {
      let u = s.t - x.t0,
        D = x.t1 - x.t0;
      if (u < 0 || u > D) continue;
      let al = u < 0.15 ? u / 0.15 : u > D - 0.35 ? (D - u) / 0.35 : 1,
        sc = 0.3 + 0.7 * jn(Math.min(1, u / 0.35));
      c.save();
      c.globalAlpha = Math.max(0, al);
      c.textAlign = "center";
      c.translate(M / 2, x.y);
      c.scale(sc, sc);
      c.rotate(Math.sin(u * 5) * 0.015);
      vt(c, x.text, 0, 0, fam, {
        size: x.size,
        t: u,
        colors: x.col,
        glow: x.glow,
        edge: "#1a0408",
        wave: x.wave,
        maxWidth: M - 160,
      });
      x.sub &&
        vt(c, x.sub, 0, x.size * 0.78, fam, {
          size: Math.max(26, x.size * 0.38),
          t: u,
          colors: ["#ffffff", "#ffe9c0", "#ffb36b"],
          glow: x.glow,
          edge: "#1a0408",
          maxWidth: M - 240,
        });
      c.restore();
    }
  }

  function Et(e, n, t, a) {
    var o, l;
    (e.save(), e.clearRect(0, 0, M, E));
    let i = t.cam;
    if (i.z > 1.001 || Math.abs(i.roll) > 0.001) {
      let u = i.z,
        c = M / 2 / u,
        h = E / 2 / u,
        m = Math.max(c, Math.min(M - c, i.x)),
        d = Math.max(h, Math.min(E - h, i.y));
      (e.translate(M / 2, E / 2),
        e.rotate(i.roll),
        e.scale(u, u),
        e.translate(-m, -d));
    }
    let r = t.shake * 10;
    (r > 0 && e.translate((le(t.tick) - 0.5) * r, (le(t.tick + 99) - 0.5) * r),
      St(e, n, t.plan.scenery, t.scroll, 1),
      t.fadeFrom &&
        St(e, n, t.fadeFrom, t.scroll, Math.max(0, Math.min(1, t.fadeT / 1.4))),
      Un(e, n, t));
    for (let u of t.platforms) Xn(e, n, u);
    for (let u of t.pickups) Qn(e, n, t, u);
    Vn(e, t);
    let s = t.monsters.slice().sort((u, c) => u.y + u.h - (c.y + c.h));
    for (let u of s) na(e, n, u, t.player.x);
    ((t.phase !== "dead" || Math.floor(t.time * 10) % 2 === 0) && aa(e, n, t),
      oa(e, n, t),
      _n(e, t),
      ra(e, n, t),
      ia(e, n, t),
      skDraw(e, t));
    for (let u of t.floaters) {
      (e.save(),
        (e.globalAlpha = Math.max(0, 1 - Math.pow(u.t / u.life, 2))),
        (e.textBaseline = "middle"));
      let c = 1 + 0.5 * Math.max(0, 1 - u.t * 6);
      (e.translate(u.x, u.y),
        e.scale(c, c),
        (e.font = `800 ${(o = u.size) != null ? o : 34}px ${fe != null ? fe : a.font}`),
        (e.textAlign = "center"),
        (e.lineJoin = "round"),
        (e.lineWidth = Math.max(5, ((l = u.size) != null ? l : 34) * 0.26)),
        (e.strokeStyle = "rgba(20,0,30,0.9)"),
        e.strokeText(u.text, 0, 0),
        (e.shadowColor = u.color),
        (e.shadowBlur = 16),
        (e.fillStyle = u.color),
        e.fillText(u.text, 0, 0),
        e.restore());
    }
    if (
      (t.flash && ((e.fillStyle = t.flash.color), e.fillRect(0, 0, M, E)),
      e.restore(),
      i.bars > 0.01)
    ) {
      let u = E * 0.07 * i.bars;
      ((e.fillStyle = "#000"),
        e.fillRect(0, 0, M, u),
        e.fillRect(0, E - u, M, u));
    }
    (a.hud && sa(e, n, t, a), lvOverlay(e, t, a.hud), skScreen(e, t), a.hud && hpAlarm(e, t));
  }
  var Le = class {
    constructor() {
      C(this, "cache", new Map());
      C(this, "pending", new Map());
      C(this, "cutouts", new Map());
      C(this, "roadTops", new Map());
    }
    get(n) {
      let t = this.cache.get(n);
      return t && t.complete && t.naturalWidth > 0 ? t : null;
    }
    getCutout(n) {
      var f;
      if (this.cutouts.has(n))
        return (f = this.cutouts.get(n)) != null ? f : null;
      let t = this.get(n);
      if (!t) return null;
      let a = t.naturalWidth,
        i = t.naturalHeight,
        r = document.createElement("canvas");
      ((r.width = a), (r.height = i));
      let s = r.getContext("2d", { willReadFrequently: !0 });
      s.drawImage(t, 0, 0);
      let o = s.getImageData(0, 0, a, i),
        l = o.data,
        u = new Uint8Array(a * i),
        c = (p) => l[p * 4] > 228 && l[p * 4 + 1] > 228 && l[p * 4 + 2] > 228,
        h = [],
        m = (p, w) => {
          let b = w * a + p;
          !u[b] && c(b) && ((u[b] = 1), h.push(b));
        };
      for (let p = 0; p < a; p++) (m(p, 0), m(p, i - 1));
      for (let p = 0; p < i; p++) (m(0, p), m(a - 1, p));
      for (; h.length;) {
        let p = h.pop();
        l[p * 4 + 3] = 0;
        let w = p % a,
          b = (p / a) | 0;
        (w > 0 && m(w - 1, b),
          w < a - 1 && m(w + 1, b),
          b > 0 && m(w, b - 1),
          b < i - 1 && m(w, b + 1));
      }
      let d = a,
        k = i,
        g = 0,
        y = 0;
      for (let p = 0; p < i; p++)
        for (let w = 0; w < a; w++)
          l[(p * a + w) * 4 + 3] > 0 &&
            (w < d && (d = w),
            w > g && (g = w),
            p < k && (k = p),
            p > y && (y = p));
      if ((s.putImageData(o, 0, 0), g <= d || y <= k))
        return (this.cutouts.set(n, r), r);
      let S = document.createElement("canvas");
      return (
        (S.width = g - d + 1),
        (S.height = y - k + 1),
        S.getContext("2d").drawImage(r, -d, -k),
        this.cutouts.set(n, S),
        S
      );
    }
    getWhiteTopRows(n) {
      let t = this.roadTops.get(n);
      if (t !== void 0) return t;
      let a = this.get(n);
      if (!a) return 0;
      let i = document.createElement("canvas");
      ((i.width = a.naturalWidth), (i.height = Math.min(60, a.naturalHeight)));
      let r = i.getContext("2d", { willReadFrequently: !0 });
      r.drawImage(a, 0, 0);
      let s = r.getImageData(0, 0, i.width, i.height).data,
        o = 0;
      for (let l = 0; l < i.height; l++) {
        let u = 0,
          c = Math.max(1, Math.floor(i.width / 40)),
          h = 0;
        for (let m = 0; m < i.width; m += c) {
          let d = (l * i.width + m) * 4;
          (h++, s[d] > 240 && s[d + 1] > 240 && s[d + 2] > 240 && u++);
        }
        if (u / h < 0.9) break;
        o++;
      }
      return (this.roadTops.set(n, o), o);
    }
    load(n) {
      var r;
      let t = this.pending.get(n);
      if (t) return t;
      let a = new Image();
      ((a.crossOrigin = "anonymous"), this.cache.set(n, a));
      let i = new Promise((s) => {
        ((a.onload = () => s()), (a.onerror = () => s()));
      });
      return (
        (a.src = (r = Ce.get(n)) != null ? r : Ge + n),
        this.pending.set(n, i),
        i
      );
    }
    loadAll(n) {
      return Promise.all(n.map((t) => this.load(t))).then(() => {});
    }
  };
  function la(e) {
    return Object.values(e.layers).map((n) => n.src);
  }
  function ua(e) {
    return [...e.frames, ...e.attack];
  }
  function At(e) {
    return [
      ...la(e.scenery),
      ...e.monsters.flatMap(ua),
      ...e.platformSprites.map((n) => n.src),
    ];
  }
  function $t(e, n, t, a = "sun") {
    let i = e.riders.find((o) => o.id === n),
      r = e.mounts.find((o) => o.id === t),
      s = [];
    return (
      i && s.push(...i.run, i.idle, i.up, i.down),
      r && s.push(...r.run, r.idle, r.up, r.down),
      s.push(
        ...e.guns.map((o) => o.src),
        ...e.bullets.map((o) => o.src),
        ...e.hits.map((o) => o.src),
        ...e.sun.filter((o) => !o.includes("bolt")),
        ...X(a).moods,
        X(a).spit,
        ...e.skills.filter((o) => o.endsWith(".webp")),
        ...e.meteors,
      ),
      s
    );
  }
  function Bt(e, n) {
    let t = e.loadAll(At(n.plan)),
      a = Be(n.manifest, n.seed, n.stage + 1, n.firstScenery, n.monsterIds);
    return { current: t, next: e.loadAll(At(a)) };
  }
  var xe = class {
    constructor(n, t, a, i, r = 1) {
      C(this, "manifest", n);
      C(this, "opts", t);
      C(this, "canvas", a);
      C(this, "font", i);
      C(this, "scale", r);
      C(this, "audioLog", null);
      C(this, "audioClock", 0);
      C(this, "assets", new Le());
      C(this, "state");
      C(this, "speed", 1);
      C(this, "paused", !1);
      C(this, "hud", !0);
      C(this, "audio", new ge());
      C(this, "audioSceneryId", "");
      C(this, "ctx");
      C(this, "raf", 0);
      C(this, "last", 0);
      C(this, "acc", 0);
      C(this, "keys", new Set());
      C(this, "pointerDown", !1);
      C(this, "stageKey", -1);
      C(this, "ready", !1);
      C(this, "disposed", !1);
      C(this, "cleanup", []);
      ((a.width = Math.round(M * r)),
        (a.height = Math.round(E * r)),
        (this.ctx = a.getContext("2d", { alpha: !1 })),
        (this.ctx.imageSmoothingEnabled = !0),
        (this.ctx.imageSmoothingQuality = "high"),
        (this.state = dt(n, t)));
    }
    get mode() {
      return this.state.mode;
    }
    setMode(n) {
      this.state.mode = n;
    }
    async init() {
      (await this.assets.loadAll(
        $t(
          this.manifest,
          this.state.riderId,
          this.state.mountId,
          this.state.bossId,
        ),
      ),
        await this.ensureStageAssets(!0),
        !this.disposed && ((this.ready = !0), this.draw()));
    }
    async ensureStageAssets(n = !1) {
      if (this.stageKey === this.state.stage) return;
      this.stageKey = this.state.stage;
      let { current: t, next: a } = Bt(this.assets, this.state);
      n ? await Promise.all([t, a]) : await t;
    }
    bindInput() {
      let n = (s) => {
          let o = s.target;
          (o &&
            (o.tagName === "INPUT" ||
              o.tagName === "SELECT" ||
              o.tagName === "TEXTAREA")) ||
            (this.keys.add(s.code),
            this.unlockAudio(),
            [
              "Space",
              "ArrowUp",
              "ArrowDown",
              "ArrowLeft",
              "ArrowRight",
            ].includes(s.code) && s.preventDefault());
        },
        t = (s) => this.keys.delete(s.code),
        a = () => {
          ((this.pointerDown = !0), this.unlockAudio());
        },
        i = () => (this.pointerDown = !1),
        r = () => this.unlockAudio();
      (window.addEventListener("pointerdown", r),
        window.addEventListener("keydown", n),
        window.addEventListener("keyup", t),
        this.canvas.addEventListener("pointerdown", a),
        window.addEventListener("pointerup", i),
        this.cleanup.push(() => {
          (window.removeEventListener("pointerdown", r),
            window.removeEventListener("keydown", n),
            window.removeEventListener("keyup", t),
            this.canvas.removeEventListener("pointerdown", a),
            window.removeEventListener("pointerup", i));
        }));
    }
    manualInput() {
      let n = this.keys,
        t = _e(this.state);
      return {
        left: n.has("ArrowLeft") || n.has("KeyA"),
        right: n.has("ArrowRight") || n.has("KeyD"),
        jump: n.has("ArrowUp") || n.has("KeyW") || n.has("Space"),
        fire:
          n.has("KeyJ") || n.has("KeyK") || n.has("KeyF") || this.pointerDown,
        aim: { x: t.x, y: t.y },
        intent: "Th\u1EE7 c\xF4ng",
      };
    }
    tick() {
      var t;
      if (((t = this.state.director) == null ? void 0 : t.result) === "timeup")
        return;
      let n = this.state.mode === "auto" ? Mt(this.state) : this.manualInput();
      (yt(this.state, n, Se),
        this.pumpAudio(),
        this.state.stage !== this.stageKey && this.ensureStageAssets());
    }
    pumpAudio() {
      let n = this.state,
        t = n.sounds;
      if (this.paused || this.disposed) {
        t.length = 0;
        return;
      }
      let a = this.audioLog,
        i = this.audioClock;
      for (let u of t)
        a
          ? a.push({ t: i, k: "sfx", name: u.name, n: u.n })
          : this.audio.play(u.name, u.n);
      t.length = 0;
      let r = `${n.plan.scenery.id}`;
      r !== this.audioSceneryId &&
        ((this.audioSceneryId = r),
        a
          ? a.push({ t: i, k: "theme", id: r, stage: n.stage })
          : this.audio.setTheme(r, n.stage));
      let s = n.sun.maxHp > 0 ? n.sun.hp / n.sun.maxHp : 1,
        o = n.player.hp < n.player.maxHp * 0.3 ? 0.3 : 0,
        l =
          n.phase === "play"
            ? 0.35 + (1 - s) * 0.35 + o + (n.sun.rageT > 0 ? 0.2 : 0)
            : 0;
      a ? a.push({ t: i, k: "intensity", v: l }) : this.audio.setIntensity(l);
    }
    unlockAudio() {
      (this.audio.unlock(), this.audio.startMusic());
    }
    draw() {
      (this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0),
        Et(this.ctx, this.assets, this.state, {
          font: this.font,
          hud: this.hud,
        }));
    }
    start() {
      let n = (t) => {
        if (
          this.disposed ||
          ((this.raf = requestAnimationFrame(n)), !this.ready)
        )
          return;
        let a = Math.min(0.1, (t - this.last) / 1e3 || 0);
        if (((this.last = t), !this.paused)) {
          this.acc += a * this.speed;
          let i = 0;
          for (; this.acc >= Se && i < 24;)
            (this.tick(), (this.acc -= Se), i++);
          i === 24 && (this.acc = 0);
        }
        this.draw();
      };
      ((this.last = performance.now()), (this.raf = requestAnimationFrame(n)));
    }
    async advance(n) {
      for (let t = 0; t < n; t++)
        (this.tick(),
          this.stageKey !== this.state.stage &&
            (await this.ensureStageAssets(!0)));
      this.draw();
    }
    frameJpeg(n = 0.92) {
      return this.canvas.toDataURL("image/jpeg", n);
    }
    snapshot() {
      var t, a, i, r;
      let n = this.state;
      return {
        time: n.time,
        stage: n.stage,
        run: n.run,
        score: n.score,
        coins: n.coins,
        kills: n.kills,
        sunKills: n.sunKills,
        hp: n.player.hp,
        gun: n.player.gun,
        sceneryId: n.plan.scenery.id,
        style: n.ai.style,
        intent: n.ai.intent,
        riderId: n.riderId,
        mountId: n.mountId,
        bossId: n.bossId,
        log: n.log.slice(-6).map((s) => s.text),
        best: Math.max(n.bestScore, n.score),
        result:
          (a = (t = n.director) == null ? void 0 : t.result) != null ? a : null,
        stages:
          (r = (i = n.director) == null ? void 0 : i.stages) != null ? r : 0,
      };
    }
    dispose() {
      ((this.disposed = !0),
        this.audio.dispose(),
        cancelAnimationFrame(this.raf),
        this.cleanup.forEach((n) => n()));
    }
  };
  var v = (e) => document.getElementById(e),
    He = "GameFont",
    Xe = 3 * 1024 * 1024,
    ne,
    D = null,
    Gt,
    Te = (Gt = sessionStorage.getItem("vg-pass")) != null ? Gt : "",
    me = !1,
    zt = [],
    J = [],
    Q = [];
  ot(() => Te);
  function O(e, n = "info") {
    let t = v("status");
    ((t.textContent = e), (t.dataset.kind = n));
  }
  function ke(e) {
    let n = v("progress");
    ((n.hidden = e === null),
      e !== null &&
        (v("progress-bar").style.width = `${Math.max(0, Math.min(100, e))}%`));
  }
  async function te(e, n, t = "") {
    var r;
    let a = await fetch(
        `api.php?action=${e}${t}`,
        R(L({}, n), {
          headers: R(
            L({}, (r = n == null ? void 0 : n.headers) != null ? r : {}),
            { "X-Password": Te },
          ),
        }),
      ),
      i = {};
    try {
      i = await a.json();
    } catch (s) {
      i = {
        ok: !1,
        error: `Server tr\u1EA3 v\u1EC1 l\u1ED7i ${a.status} (kh\xF4ng ph\u1EA3i JSON).`,
      };
    }
    return (
      a.status === 401 && ((Te = ""), sessionStorage.removeItem("vg-pass")),
      i
    );
  }
  function Nt(e, n) {
    e.innerHTML = "";
    for (let t of n) e.add(new Option(t.label, t.id));
  }
  function Kt() {
    return {
      seed: Number(v("seed").value) || 1,
      mode: v("mode").value,
      rider: v("rider").value || void 0,
      mount: v("mount").value || void 0,
      boss: v("boss").value,
      scenario: {
        sceneries: [...J],
        monsters: [...Q],
        duration: Number(v("duration").value) || 60,
        outcome: v("outcome").value,
        lang: v("lang").value,
      },
    };
  }
  async function ca(e) {
    (D == null || D.dispose(), (D = null));
    let n = Kt(),
      t = v("game-canvas"),
      a = new xe(ne, n, t, `${He}, sans-serif`, e);
    return (
      await a.init(),
      a.bindInput(),
      a.start(),
      a.audio.setMusicVolume(Number(v("music-vol").value)),
      a.audio.setStyle(v("music-style").value),
      (a.speed = 1),
      (D = a),
      a
    );
  }
  async function U() {
    if (me) return;
    O("\u0110ang t\u1EA3i m\xE0n ch\u01A1i...");
    let e = await ca(1);
    (e.unlockAudio(),
      e.audio.setMuted(v("mute").checked),
      O(
        '\u0110ang xem tr\u01B0\u1EDBc (\u0111\u1ED9 ph\xE2n gi\u1EA3i th\u1EA5p). B\u1EA5m "T\u1EA1o video 2K" \u0111\u1EC3 quay ch\xEDnh th\u1EE9c.',
        "info",
      ));
  }
  function ha(e) {
    return new Promise((n, t) =>
      e.toBlob(
        (a) =>
          a
            ? n(a)
            : t(
                new Error(
                  "Kh\xF4ng xu\u1EA5t \u0111\u01B0\u1EE3c khung h\xECnh.",
                ),
              ),
        "image/jpeg",
        0.93,
      ),
    );
  }
  async function fa(e, n, t) {
    var s;
    let a = t.map((o) => o.size).join(","),
      i = new Blob(t),
      r = "T\u1EA3i khung h\xECnh th\u1EA5t b\u1EA1i.";
    for (let o = 0; o < 3; o++) {
      let l = await te(
        "frames",
        { method: "POST", body: i, headers: { "X-Lens": a } },
        `&id=${e}&start=${n}`,
      );
      if (l.ok) return;
      ((r = (s = l.error) != null ? s : r),
        await new Promise((u) => setTimeout(u, 800 * (o + 1))));
    }
    throw new Error(r);
  }
  async function ma(e, n, t, a, i) {
    let r = [];
    e.audioLog = r;
    let s = 60 / t,
      o = Math.ceil(a * t),
      l = Math.round(2.5 * t),
      u = 1 / 0,
      c = 0,
      h = [],
      m = 0,
      d = 0,
      k = [],
      g = async () => {
        if (!h.length) return;
        let S = fa(n, d, h);
        (k.push(S),
          S.catch(() => {}),
          (d += h.length),
          (h = []),
          (m = 0),
          k.length >= 3 && (await k.shift()));
      },
      y = 0;
    for (; y < o && y < u && me; y++) {
      let S = Math.round(y * s);
      ((e.audioClock = y / t),
        await e.advance(S - c),
        (c = S),
        u === 1 / 0 && e.snapshot().result && (u = y + l));
      let f = await ha(e.canvas);
      (h.push(f),
        (m += f.size),
        m >= 2.5 * 1024 * 1024 && (await g()),
        y % 10 === 0 && i(y / t, y));
    }
    return (await g(), await Promise.all(k), { log: r, frames: y });
  }
  function da(e) {
    let n = e.numberOfChannels,
      t = e.length,
      a = new DataView(new ArrayBuffer(44 + t * n * 2)),
      i = (o, l) =>
        [...l].forEach((u, c) => a.setUint8(o + c, u.charCodeAt(0)));
    (i(0, "RIFF"),
      a.setUint32(4, 36 + t * n * 2, !0),
      i(8, "WAVEfmt "),
      a.setUint32(16, 16, !0),
      a.setUint16(20, 1, !0),
      a.setUint16(22, n, !0),
      a.setUint32(24, e.sampleRate, !0),
      a.setUint32(28, e.sampleRate * n * 2, !0),
      a.setUint16(32, n * 2, !0),
      a.setUint16(34, 16, !0),
      i(36, "data"),
      a.setUint32(40, t * n * 2, !0));
    let r = Array.from({ length: n }, (o, l) => e.getChannelData(l)),
      s = 44;
    for (let o = 0; o < t; o++)
      for (let l = 0; l < n; l++) {
        let u = Math.max(-1, Math.min(1, r[l][o]));
        (a.setInt16(s, u < 0 ? u * 32768 : u * 32767, !0), (s += 2));
      }
    return new Blob([a], { type: "audio/wav" });
  }
  async function pa(e, n, t) {
    let i = n / t,
      r = new OfflineAudioContext(2, Math.max(48e3, Math.ceil(i * 48e3)), 48e3),
      s = new ge();
    (s.setMusicVolume(Number(v("music-vol").value)),
      s.setStyle(v("music-style").value),
      s.useOffline(r),
      s.startMusic());
    let o = new Map();
    for (let c of e) {
      let h = Math.round(c.t * t),
        m = o.get(h);
      m ? m.push(c) : o.set(h, [c]);
    }
    let l = (c) => {
      let h = o.get(c);
      if (h) {
        let m = null;
        for (let d of h)
          d.k === "theme"
            ? s.setTheme(d.id, d.stage)
            : d.k === "intensity" && (m = d.v);
        m !== null && s.setIntensity(m);
        for (let d of h) d.k === "sfx" && s.play(d.name, d.n);
      }
      s.pump();
    };
    l(0);
    for (let c = 1; c < n; c++)
      r.suspend(c / t).then(() => {
        (l(c), r.resume());
      });
    let u = await r.startRendering();
    return (s.dispose(), da(u));
  }
  async function ga(e, n, t) {
    var i;
    let a = Math.ceil(e.size / Xe);
    for (let r = 0; r < a; r++) {
      let s = e.slice(r * Xe, (r + 1) * Xe),
        o = await te("chunk", { method: "POST", body: s }, `&id=${n}&i=${r}`);
      if (!o.ok)
        throw new Error(
          (i = o.error) != null ? i : "T\u1EA3i l\xEAn th\u1EA5t b\u1EA1i.",
        );
      t(((r + 1) / a) * 100);
    }
  }
  function ba() {
    let e = new Uint8Array(12);
    return (
      crypto.getRandomValues(e),
      Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("")
    );
  }
  async function Ot() {
    if (!(await te("check")).needs_password || Te) return !0;
    let n = prompt("Nh\u1EADp m\u1EADt kh\u1EA9u t\u1EA1o video:");
    return n ? ((Te = n), sessionStorage.setItem("vg-pass", n), !0) : !1;
  }
  async function ya() {
    var o, l, u, c, h, m;
    if (me) {
      me = !1;
      return;
    }
    let e = await te("check");
    if (!e.ok) {
      O(
        (o = e.error) != null ? o : "ffmpeg ch\u01B0a s\u1EB5n s\xE0ng.",
        "err",
      );
      return;
    }
    if (!(await Ot())) return;
    let n = v("size").value,
      [t, a] = n.split("x").map(Number),
      i = Number(v("fps").value),
      r = Number(v("duration").value) || 60,
      s = v("make");
    ((me = !0), (s.textContent = "D\u1EEBng quay"), (v("result").hidden = !0));
    try {
      (O(`\u0110ang chu\u1EA9n b\u1ECB canvas ${t}x${a}...`),
        D == null || D.dispose(),
        (D = null));
      let d = Kt(),
        k = new xe(ne, d, v("game-canvas"), `${He}, sans-serif`, a / 720);
      await k.init();
      let g = ba(),
        { log: y, frames: S } = await ma(k, g, i, r + 30, (b, x) => {
          (ke(Math.min(100, (b / r) * 100)),
            O(
              `\u0110ang d\u1EF1ng khung h\xECnh ${t}x${a} @${i}fps: ${b.toFixed(0)}s / ~${r}s (${x} khung)`,
            ));
        });
      if ((k.dispose(), !me)) throw new Error("\u0110\xE3 d\u1EEBng.");
      if (S < 2)
        throw new Error(
          "Kh\xF4ng c\xF3 khung h\xECnh n\xE0o \u0111\u01B0\u1EE3c t\u1EA1o.",
        );
      (O(
        "\u0110ang d\u1EF1ng \xE2m thanh (ch\xEDnh x\xE1c theo t\u1EEBng khung h\xECnh)...",
      ),
        ke(null));
      let f = await pa(y, S, i);
      (O(
        `\u0110ang t\u1EA3i \xE2m thanh l\xEAn host (${(f.size / 1048576).toFixed(1)}MB)...`,
      ),
        await ga(f, g, (b) => ke(b)),
        O(
          "ffmpeg \u0111ang gh\xE9p khung h\xECnh + \xE2m thanh th\xE0nh MP4 H.264...",
        ));
      let p = new FormData();
      (p.set("id", g),
        p.set("size", n),
        p.set("fps", String(i)),
        p.set("crf", v("crf").value),
        p.set("name", `game-seed-${v("seed").value}`));
      let w = await te("encode", { method: "POST", body: p });
      if (!w.ok)
        throw new Error(
          (l = w.error) != null
            ? l
            : "Kh\xF4ng ch\u1EA1y \u0111\u01B0\u1EE3c ffmpeg.",
        );
      for (;;) {
        await new Promise((x) => setTimeout(x, 1500));
        let b = await te("status", void 0, `&id=${g}`);
        if (b.state === "running") {
          (ke((u = b.percent) != null ? u : 0),
            O(
              `ffmpeg \u0111ang x\u1EED l\xFD: ${(c = b.percent) != null ? c : 0}%`,
            ));
          continue;
        }
        if (b.state === "done") {
          (ke(100),
            wa(b.file, b.size),
            O("Ho\xE0n t\u1EA5t! Video 2K \u0111\xE3 s\u1EB5n s\xE0ng.", "ok"));
          break;
        }
        throw new Error(`${(h = b.error) != null ? h : "ffmpeg l\u1ED7i"}
${(m = b.log) != null ? m : ""}`);
      }
      Je();
    } catch (d) {
      O(d instanceof Error ? d.message : String(d), "err");
    } finally {
      ((me = !1),
        (s.textContent = "T\u1EA1o video 2K"),
        setTimeout(() => ke(null), 1500),
        U());
    }
  }
  function wa(e, n) {
    let t = v("result");
    t.hidden = !1;
    let a = `output/${encodeURIComponent(e)}`,
      i = v("result-video");
    i.src = a;
    let r = v("result-link");
    ((r.href = a),
      (r.download = e),
      (r.textContent = `T\u1EA3i ${e} (${(n / 1048576).toFixed(1)}MB)`));
  }
  async function Je() {
    var t;
    let e = await te("list"),
      n = v("files");
    if (((n.innerHTML = ""), !e.ok || !((t = e.files) != null && t.length))) {
      n.innerHTML = '<li class="muted">Ch\u01B0a c\xF3 video n\xE0o.</li>';
      return;
    }
    for (let a of e.files) {
      let i = document.createElement("li"),
        r = document.createElement("a");
      ((r.href = `output/${encodeURIComponent(a.file)}`),
        (r.textContent = `${a.file} \xB7 ${(a.size / 1048576).toFixed(1)}MB`),
        (r.download = a.file));
      let s = document.createElement("button");
      ((s.type = "button"),
        (s.textContent = "Xo\xE1"),
        (s.className = "link-btn"),
        (s.onclick = async () => {
          let o = new FormData();
          (o.set("file", a.file),
            await te("delete", { method: "POST", body: o }),
            Je());
        }),
        i.append(r, s),
        n.append(i));
    }
  }
  var Ft = () => v("lang").value,
    Wt = (e) => {
      var n;
      return (n = Ie(Ft(), e)) != null ? n : e;
    },
    Lt = (e) => e.slice().sort(() => Math.random() - 0.5);
  function Ye(e, n) {
    let t = e.value;
    (Nt(e, n), n.some((a) => a.id === t) && (e.value = t));
  }
  function Ht(e, n, t, a) {
    let i = v(e);
    i.innerHTML = "";
    for (let r of n) {
      let s = t.indexOf(r),
        o = document.createElement("button");
      ((o.type = "button"),
        (o.className = "chip"),
        o.setAttribute("aria-pressed", String(s >= 0)));
      let l = document.createElement("span");
      if (((l.textContent = Wt(r)), o.append(l), s >= 0)) {
        let u = document.createElement("b");
        ((u.textContent = String(s + 1)), o.append(u));
      }
      ((o.onclick = () => a(r)), i.append(o));
    }
  }
  function ue() {
    let e = ne.sceneries.map((a) => a.id).sort(),
      n = ne.monsters.map((a) => a.id).sort();
    ((J = J.filter((a) => e.includes(a))),
      (Q = Q.filter((a) => n.includes(a))));
    let t = (a, i) => (a.includes(i) ? a.filter((r) => r !== i) : [...a, i]);
    (Ht("sceneries", e, J, (a) => {
      ((J = t(J, a)), ue());
    }),
      Ht("monsters", n, Q, (a) => {
        ((Q = t(Q, a)), ue());
      }),
      (v("sceneries-count").textContent = J.length
        ? String(J.length)
        : "t\u1EF1 ch\u1ECDn"),
      (v("monsters-count").textContent = Q.length
        ? String(Q.length)
        : "t\u1EF1 ch\u1ECDn"));
  }
  function qt() {
    (Ye(v("rider"), [
      { id: "", label: "Ng\u1EABu nhi\xEAn" },
      { id: "none", label: "Kh\xF4ng hi\u1EC3n th\u1ECB nh\xE2n v\u1EADt" },
      ...ne.riders.map((e) => ({ id: e.id, label: e.id })),
    ]),
      Ye(v("mount"), [
        { id: "", label: "Ng\u1EABu nhi\xEAn" },
        ...ne.mounts.map((e) => ({ id: e.id, label: Wt(e.id) })),
      ]),
      Ye(v("boss"), [
        { id: Pe, label: "Ng\u1EABu nhi\xEAn theo seed" },
        ...F.map((e) => ({ id: e.id, label: Y(Ft(), e.id) })),
      ]));
  }
  async function Qe() {
    let e = await lt();
    ((ne = e.manifest), (zt = e.packs), qt(), ue(), Ze());
  }
  function ka() {
    Nt(v("music-style"), tt);
    let e = () => ne.sceneries.map((t) => t.id),
      n = () => ne.monsters.map((t) => t.id);
    ((v("sceneries-random").onclick = () => {
      ((J = Lt(e()).slice(0, 1 + Math.floor(Math.random() * 4))), ue(), U());
    }),
      (v("sceneries-clear").onclick = () => {
        ((J = []), ue(), U());
      }),
      (v("monsters-random").onclick = () => {
        ((Q = Lt(n()).slice(0, 1 + Math.floor(Math.random() * 5))), ue(), U());
      }),
      (v("monsters-clear").onclick = () => {
        ((Q = []), ue(), U());
      }),
      (v("boss-random").onclick = () => {
        let t = F.map((a) => a.id);
        ((v("boss").value = t[Math.floor(Math.random() * t.length)]), U());
      }),
      v("lang").addEventListener("change", () => {
        (qt(), ue(), Ze());
      }));
  }
  var jt = {
      mount: {
        label: "Th\xFA c\u01B0\u1EE1i",
        hint: "\u1EA2nh n\u1EC1n trong su\u1ED1t (PNG/WEBP), c\xF9ng m\u1ED9t h\u01B0\u1EDBng nh\xECn.",
        files: [
          "info.json",
          "run-0.png ... run-N.png (2-12 \u1EA3nh ch\u1EA1y)",
          "idle.png",
          "jump-up.png",
          "jump-down.png",
        ],
        infoJson:
          '{ "type": "mount", "name": "Ng\u1EF1a M\xE2y", "nameEn": "Cloud Horse" }',
      },
      monster: {
        label: "Qu\xE1i v\u1EADt",
        hint: '\u1EA2nh n\u1EC1n trong su\u1ED1t. kind: "walk" (\u0111i b\u1ED9) ho\u1EB7c "fly" (bay).',
        files: [
          "info.json",
          "frame-0.png ... frame-N.png (2-8 \u1EA3nh)",
          "attack-0.png, attack-1.png ... (t\xF9y ch\u1ECDn)",
        ],
        infoJson:
          '{ "type": "monster", "name": "R\xF9a N\u01B0\u1EDBc", "nameEn": "Water Turtle", "kind": "walk" }',
      },
      scenery: {
        label: "C\u1EA3nh quan",
        hint: "N\u0103m l\u1EDBp \u1EA3nh t\u1EEB xa \u0111\u1EBFn g\u1EA7n. C\xE1c l\u1EDBp far/mid/near/road n\xEAn l\u1EB7p \u0111\u01B0\u1EE3c theo chi\u1EC1u ngang.",
        files: [
          "info.json",
          "sky.png",
          "far.png",
          "mid.png",
          "near.png",
          "road.png",
        ],
        infoJson:
          '{ "type": "scenery", "name": "R\u1EEBng Amazon", "nameEn": "Amazon Jungle" }',
      },
      boss: {
        label: "Boss",
        hint: "\u1EA2nh n\u1EC1n trong su\u1ED1t, nh\xECn th\u1EB3ng. annoyed v\xE0 evil l\xE0 t\xF9y ch\u1ECDn.",
        files: [
          "info.json",
          "calm.png",
          "enraged.png",
          "spit.png",
          "annoyed.png, evil.png (t\xF9y ch\u1ECDn)",
        ],
        infoJson:
          '{ "type": "boss", "name": "H\u1EA3i Qu\xE1i", "nameEn": "Sea Monster", "glow": [40,220,220], "boltStyle": "rain", "orbKind": "ice", "difficulty": "normal" }',
      },
    },
    de = "mount";
  function Rt() {
    let e = jt[de];
    ((v("import-hint").textContent = e.hint),
      (v("import-files").innerHTML = e.files
        .map((t) => `<li><code>${t}</code></li>`)
        .join("")),
      (v("import-json").textContent = e.infoJson));
    let n = v("import-sample");
    ((n.href = `samples/${de}-example.zip`),
      (n.download = `${de}-example.zip`),
      document.querySelectorAll("#import-tabs button").forEach((t) => {
        t.setAttribute("aria-pressed", String(t.dataset.type === de));
      }),
      Ze());
  }
  function Ze() {
    let e = document.getElementById("import-list");
    if (!e) return;
    e.innerHTML = "";
    let n = zt.filter((t) => t.type === de);
    if (!n.length) {
      e.innerHTML =
        '<li class="muted">Ch\u01B0a c\xF3 m\u1EE5c n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp.</li>';
      return;
    }
    for (let t of n) {
      let a = document.createElement("li"),
        i = document.createElement("span");
      i.textContent = `${t.name}${t.nameEn ? ` / ${t.nameEn}` : ""} (${t.id})`;
      let r = document.createElement("button");
      ((r.type = "button"),
        (r.className = "link-btn"),
        (r.textContent = "Xo\xE1"),
        (r.onclick = async () => {
          try {
            await st(t.id);
          } catch (s) {
            Ut([
              {
                ok: !1,
                file: t.id,
                issues:
                  s instanceof W
                    ? s.issues
                    : ["Kh\xF4ng x\xF3a \u0111\u01B0\u1EE3c."],
              },
            ]);
          }
          (await Qe(), U());
        }),
        a.append(i, r),
        e.append(a));
    }
  }
  function Ut(e) {
    var t;
    let n = v("import-results");
    n.innerHTML = "";
    for (let a of e) {
      let i = document.createElement("div");
      i.className = a.ok ? "res ok" : "res err";
      let r = document.createElement("strong");
      if (
        ((r.textContent = `${a.file}: ${a.ok ? a.message : "Kh\xF4ng th\u1EC3 s\u1EED d\u1EE5ng file n\xE0y:"}`),
        i.append(r),
        (t = a.issues) != null && t.length)
      ) {
        let s = document.createElement("ul");
        for (let o of a.issues) {
          let l = document.createElement("li");
          ((l.textContent = o), s.append(l));
        }
        i.append(s);
      }
      n.append(i);
    }
  }
  async function Dt(e) {
    if (!e.length || !(await Ot())) return;
    v("import-busy").hidden = !1;
    let n = [],
      t = 0;
    for (let a of e)
      try {
        let i = await it(a, de);
        (t++,
          n.push({
            ok: !0,
            file: a.name,
            message: `\u0110\xE3 th\xEAm "${i.name}" (id: ${i.id}).`,
          }));
      } catch (i) {
        n.push({
          ok: !1,
          file: a.name,
          issues:
            i instanceof W
              ? i.issues
              : [
                  "L\u1ED7i kh\xF4ng x\xE1c \u0111\u1ECBnh khi \u0111\u1ECDc file.",
                ],
        });
      }
    (Ut(n),
      (v("import-busy").hidden = !0),
      (v("import-file").value = ""),
      t && (await Qe(), U()));
  }
  function Ma() {
    let e = v("import-dialog"),
      n = v("import-tabs");
    for (let i of ze) {
      let r = document.createElement("button");
      ((r.type = "button"),
        (r.className = "chip"),
        (r.dataset.type = i),
        (r.textContent = jt[i].label),
        (r.onclick = () => {
          ((de = i), (v("import-results").innerHTML = ""), Rt());
        }),
        n.append(r));
    }
    ((v("import-open").onclick = () => {
      (Rt(), e.showModal());
    }),
      (v("import-close").onclick = () => e.close()));
    let t = v("import-file");
    t.onchange = () => {
      var i;
      Dt(Array.from((i = t.files) != null ? i : []));
    };
    let a = v("import-drop");
    ((a.ondragover = (i) => {
      (i.preventDefault(), a.classList.add("drag"));
    }),
      (a.ondragleave = () => a.classList.remove("drag")),
      (a.ondrop = (i) => {
        var r, s;
        (i.preventDefault(),
          a.classList.remove("drag"),
          Dt(
            Array.from(
              (s = (r = i.dataTransfer) == null ? void 0 : r.files) != null
                ? s
                : [],
            ),
          ));
      }));
  }
  async function va() {
    var a;
    O("\u0110ang t\u1EA3i d\u1EEF li\u1EC7u game...");
    let e = new FontFace(He, "url(assets/NotoSans.ttf)", { weight: "100 900" });
    try {
      (await e.load(), document.fonts.add(e), It(`${He}, sans-serif`));
    } catch (i) {}
    (await Qe(),
      ka(),
      Ma(),
      (v("seed").value = String(Math.floor(Math.random() * 1e6))),
      (v("random-seed").onclick = () => {
        ((v("seed").value = String(Math.floor(Math.random() * 1e6))), U());
      }),
      (v("apply").onclick = () => {
        U();
      }),
      (v("make").onclick = () => {
        ya();
      }),
      (v("music-vol").oninput = () =>
        D == null
          ? void 0
          : D.audio.setMusicVolume(Number(v("music-vol").value))),
      (v("music-style").onchange = () =>
        D == null ? void 0 : D.audio.setStyle(v("music-style").value)),
      (v("mute").onchange = () =>
        D == null ? void 0 : D.audio.setMuted(v("mute").checked)));
    let n = await te("check"),
      t = v("ffmpeg-info");
    ((t.textContent = n.ok
      ? `ffmpeg s\u1EB5n s\xE0ng: ${n.version}`
      : `ffmpeg: ${(a = n.error) != null ? a : "ch\u01B0a s\u1EB5n s\xE0ng"}`),
      (t.dataset.kind = n.ok ? "ok" : "err"),
      await Je(),
      await U());
  }
  va().catch((e) =>
    O(
      `L\u1ED7i kh\u1EDFi \u0111\u1ED9ng: ${e instanceof Error ? e.message : e}`,
      "err",
    ),
  );
})();
