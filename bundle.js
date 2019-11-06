require = function() {
    return function e(t, r, n) {
        function i(a, s) {
            if (!r[a]) {
                if (!t[a]) {
                    var f = "function" == typeof require && require;
                    if (!s && f)
                        return f(a, !0);
                    if (o)
                        return o(a, !0);
                    var u = new Error("Cannot find module '" + a + "'");
                    throw u.code = "MODULE_NOT_FOUND",
                    u
                }
                var l = r[a] = {
                    exports: {}
                };
                t[a][0].call(l.exports, function(e) {
                    return i(t[a][1][e] || e)
                }, l, l.exports, e, t, r, n)
            }
            return r[a].exports
        }
        for (var o = "function" == typeof require && require, a = 0; a < n.length; a++)
            i(n[a]);
        return i
    }
}()({
    1: [function(e, t, r) {
        t.exports = function(e) {
            return atob(e)
        }
    }
    , {}],
    2: [function(e, t, r) {
        "use strict";
        var n = e("is-audio-buffer")
          , i = e("inherits")
          , o = e("audio-buffer-utils")
          , a = e("audio-buffer")
          , s = e("object-assign")
          , f = e("negative-index")
          , u = e("is-plain-obj")
          , l = e("events");
        function h(e, t) {
            if (!(this instanceof h))
                return new h(e,t);
            "number" == typeof t && (t = {
                channels: t
            }),
            t && null != t.channels && (t.numberOfChannels = t.channels),
            s(this, t),
            this.buffers = [],
            this.length = 0,
            this.duration = 0,
            this.append(e)
        }
        t.exports = h,
        i(h, l),
        h.prototype.numberOfChannels = 2,
        h.prototype.sampleRate = null,
        h.prototype.copyFromChannel = function(e, t, r) {
            null == r && (r = 0);
            for (var n = this.offset(r), i = r - n[1], o = n[1], a = n[0], s = this.buffers.length; a < s; a++) {
                var f = this.buffers[a]
                  , u = f.getChannelData(t);
                r > i && (u = u.subarray(r)),
                t < f.numberOfChannels && e.set(u, Math.max(0, i - o)),
                i += f.length
            }
        }
        ,
        h.prototype.copyToChannel = function(e, t, r) {
            null == r && (r = 0);
            for (var n = this.offset(r), i = r - n[1], o = n[0], a = this.buffers.length; o < a; o++) {
                var s = this.buffers[o]
                  , f = s.getChannelData(t);
                t < s.numberOfChannels && f.set(e.subarray(Math.max(i, r), i + f.length), Math.max(0, r - i)),
                i += s.length
            }
        }
        ,
        h.prototype.getChannelData = function(e, t, r) {
            if (null == t && (t = 0),
            null == r && (r = this.length),
            t = f(t, this.length),
            r = f(r, this.length),
            !this.buffers.length || t === r)
                return new Float32Array;
            if (1 === this.buffers.length)
                return this.buffers[0].getChannelData(e).subarray(t, r);
            var n = new (0,
            this.buffers[0].getChannelData(0).constructor)(r - t)
              , i = this.offset(t)
              , o = this.offset(r)
              , a = this.buffers[i[0]];
            n.set(a.getChannelData(e).subarray(i[1]));
            for (var s = -i[1] + a.length, u = i[0] + 1, l = o[0]; u < l; u++) {
                var h = this.buffers[u];
                n.set(h.getChannelData(e), s),
                s += h.length
            }
            var c = this.buffers[o[0]];
            return n.set(c.getChannelData(e).subarray(0, o[1]), s),
            n
        }
        ,
        h.prototype.append = function(e) {
            var t = 0;
            if (e instanceof h)
                this.append(e.buffers);
            else if (n(e) && e.length)
                this._appendBuffer(e);
            else if (Array.isArray(e))
                for (var r = e.length; t < r; t++)
                    this.append(e[t]);
            else
                e && (e = new a(this.numberOfChannels || 2,e),
                this._appendBuffer(e));
            return this
        }
        ,
        h.prototype.offset = function(e) {
            var t, r = 0, n = 0;
            if (0 === e)
                return [0, 0];
            for (; n < this.buffers.length; n++) {
                if (e < (t = r + this.buffers[n].length) || n == this.buffers.length - 1)
                    return [n, e - r];
                r = t
            }
        }
        ,
        h.prototype._appendBuffer = function(e) {
            return e ? (this.buffers.length ? this.numberOfChannels = Math.max(this.numberOfChannels, e.numberOfChannels) : this.numberOfChannels = e.numberOfChannels,
            this.duration += e.duration,
            this.sampleRate || (this.sampleRate = e.sampleRate),
            this.buffers.push(e),
            this.length += e.length,
            this) : this
        }
        ,
        h.prototype.copy = function(e, t, r, n) {
            if (("number" != typeof r || r < 0) && (r = 0),
            ("number" != typeof n || n > this.length) && (n = this.length),
            r >= this.length)
                return e || new a(this.numberOfChannels,0);
            if (n <= 0)
                return e || new a(this.numberOfChannels,0);
            var i, s, f = !!e, u = this.offset(r), l = n - r, h = l, c = f && t || 0, p = u[1];
            if (0 === r && n == this.length) {
                if (!f)
                    return 1 === this.buffers.length ? o.slice(this.buffers[0]) : o.concat(this.buffers);
                for (s = 0; s < this.buffers.length; s++)
                    o.copy(this.buffers[s], e, c),
                    c += this.buffers[s].length;
                return e
            }
            if (h <= this.buffers[u[0]].length - p)
                return f ? o.copy(o.subbuffer(this.buffers[u[0]], p, p + h), e, t) : o.slice(this.buffers[u[0]], p, p + h);
            for (f || (e = new a(this.numberOfChannels,l)),
            s = u[0]; s < this.buffers.length; s++) {
                if (!(h > (i = this.buffers[s].length - p))) {
                    o.copy(o.subbuffer(this.buffers[s], p, p + h), e, c);
                    break
                }
                o.copy(o.subbuffer(this.buffers[s], p), e, c),
                c += i,
                h -= i,
                p && (p = 0)
            }
            return e
        }
        ,
        h.prototype.slice = function(e, t) {
            if (e = e || 0,
            t = null == t ? this.length : t,
            (e = f(e, this.length)) == (t = f(t, this.length)))
                return new h(0,this.numberOfChannels);
            var r = this.offset(e)
              , n = this.offset(t)
              , i = this.buffers.slice(r[0], n[0] + 1);
            return 0 == n[1] ? i.pop() : i[i.length - 1] = o.subbuffer(i[i.length - 1], 0, n[1]),
            0 != r[1] && (i[0] = o.subbuffer(i[0], r[1])),
            new h(i,this.numberOfChannels)
        }
        ,
        h.prototype.clone = function(e, t) {
            for (var r = 0, n = new h(0,this.numberOfChannels), i = this.slice(e, t); r < i.buffers.length; r++)
                n.append(o.clone(i.buffers[r]));
            return n
        }
        ,
        h.prototype.destroy = function() {
            this.buffers.length = 0,
            this.length = 0
        }
        ,
        h.prototype.repeat = function(e) {
            if (!(e = Math.floor(e)) && 0 !== e || !Number.isFinite(e))
                throw RangeError("Repeat count must be non-negative number.");
            if (!e)
                return this.consume(this.length),
                this;
            if (1 === e)
                return this;
            for (var t = this, r = 1; r < e; r++)
                t = new h(t.copy()),
                this.append(t);
            return this
        }
        ,
        h.prototype.insert = function(e, t) {
            null == t && (t = e,
            e = 0),
            e = f(e, this.length),
            this.split(e);
            e = this.offset(e);
            return t = new h(t),
            this.buffers.splice.apply(this.buffers, [e[0], 0].concat(t.buffers)),
            this.length += t.length,
            this.duration += t.duration,
            this.numberOfChannels = Math.max(t.numberOfChannels, this.numberOfChannels),
            this
        }
        ,
        h.prototype.remove = function(e, t) {
            if (null == t && (t = e,
            e = 0),
            !t)
                return this;
            t < 0 && (e -= t = -t),
            e = f(e, this.length),
            t = Math.min(this.length - e, t),
            this.split(e, e + t);
            var r = this.offset(e)
              , n = this.offset(e + t);
            n[1] === this.buffers[n[0]].length && (n[0] += 1);
            let i = this.buffers.splice(r[0], n[0] - r[0]);
            return i = new h(i,this.numberOfChannels),
            this.length -= i.length,
            this.duration = this.length / this.sampleRate,
            i
        }
        ,
        h.prototype.delete = function() {
            return this.remove.apply(this, arguments),
            this
        }
        ,
        h.prototype.consume = function(e) {
            for (; this.buffers.length; ) {
                if (!(e >= this.buffers[0].length)) {
                    this.buffers[0] = o.subbuffer(this.buffers[0], e),
                    this.length -= e;
                    break
                }
                e -= this.buffers[0].length,
                this.length -= this.buffers[0].length,
                this.buffers.shift()
            }
            return this.duration = this.length / this.sampleRate,
            this
        }
        ,
        h.prototype.map = function(e, t, r) {
            null == t && (t = 0),
            null == r && (r = this.length),
            t = f(t, this.length),
            r = f(r, this.length);
            let n = this.offset(t)
              , i = this.offset(r)
              , o = t - n[1]
              , a = this.buffers.slice(0, n[0])
              , s = this.buffers.slice(i[0] + 1)
              , u = this.buffers.slice(n[0], i[0] + 1);
            return u = u.map((t,r)=>{
                let n = e.call(this, t, r, o, this.buffers, this);
                return void 0 !== n && !0 !== n || (n = t),
                n ? (o += n.length,
                n) : null
            }
            ).filter(e=>!!e && !!e.length),
            new h(a.concat(u).concat(s),this.numberOfChannels)
        }
        ,
        h.prototype.each = function(e, t, r, n) {
            let i = arguments[arguments.length - 1];
            u(i) || (i = {
                reversed: !1
            }),
            "number" != typeof t && (t = 0),
            "number" != typeof r && (r = this.length),
            t = f(t, this.length),
            r = f(r, this.length);
            let o = this.offset(t)
              , a = this.offset(r);
            this.buffers.slice(o[0], a[0] + 1);
            if (i.reversed) {
                let t = r - a[1];
                for (let r = a[0], n = o[0]; r >= n; r--) {
                    let n = this.buffers[r];
                    if (!1 === e.call(this, n, r, t, this.buffers, this))
                        break;
                    t -= n.length
                }
            } else {
                let r = t - o[1];
                for (let t = o[0], n = a[0] + 1; t < n; t++) {
                    let n = this.buffers[t];
                    if (!1 === e.call(this, n, t, r, this.buffers, this))
                        break;
                    r += n.length
                }
            }
            return this
        }
        ,
        h.prototype.reverse = function(e, t) {
            null == e && (e = 0),
            null == t && (t = this.length),
            e = f(e, this.length),
            t = f(t, this.length);
            let r = this.slice(e, t).each(e=>{
                o.reverse(e)
            }
            );
            return r.buffers.reverse(),
            this.remove(e, t - e),
            this.insert(e, r),
            this
        }
        ,
        h.prototype.split = function() {
            let e = arguments;
            for (let t = 0; t < e.length; t++) {
                let r = e[t];
                if (Array.isArray(r))
                    this.split.apply(this, r);
                else if ("number" == typeof r) {
                    let e = this.offset(r)
                      , t = this.buffers[e[0]];
                    if (e[1] > 0 && e[1] < t.length) {
                        let r = o.subbuffer(t, 0, e[1])
                          , n = o.subbuffer(t, e[1]);
                        this.buffers.splice(e[0], 1, r, n)
                    }
                }
            }
            return this
        }
        ,
        h.prototype.join = function(e, t) {
            null == e && (e = 0),
            null == t && (t = this.length),
            e = f(e, this.length),
            t = f(t, this.length);
            let r = this.offset(e)
              , n = this.offset(t)
              , i = this.buffers.slice(r[0], n[0])
              , a = o.concat(i);
            return this.buffers.splice.apply(this.buffers, [r[0], n[0] - r[0] + (n[1] ? 1 : 0)].concat(a)),
            this
        }
    }
    , {
        "audio-buffer": 4,
        "audio-buffer-utils": 3,
        events: 8,
        inherits: 15,
        "is-audio-buffer": 16,
        "is-plain-obj": 20,
        "negative-index": 21,
        "object-assign": 23
    }],
    3: [function(e, t, r) {
        "use strict";
        e("typedarray-methods");
        var n = e("audio-buffer")
          , i = e("is-audio-buffer")
          , o = e("is-browser")
          , a = e("negative-index")
          , s = e("clamp")
          , f = e("audio-context");
        function u(e, t, r, i) {
            return i || (i = {}),
            new n(t,e,r,i)
        }
        function l(e, t, r) {
            h(e),
            h(t),
            r = r || 0;
            for (var n = 0, i = Math.min(e.numberOfChannels, t.numberOfChannels); n < i; n++)
                t.getChannelData(n).set(e.getChannelData(n), r);
            return t
        }
        function h(e) {
            if (!i(e))
                throw new Error("Argument should be an AudioBuffer instance.")
        }
        function c(e) {
            return h(e),
            o ? f().createBuffer(e.numberOfChannels, e.length, e.sampleRate) : u(e.length, e.numberOfChannels, e.sampleRate)
        }
        function p(e, t, r, n, o) {
            if (h(e),
            i(t) || null == t || ("function" == typeof r ? t = null : (o = n,
            n = r,
            r = t,
            t = null)),
            t ? h(t) : t = e,
            n = null == n ? 0 : a(n, e.length),
            o = null == o ? e.length : a(o, e.length),
            r instanceof Function)
                for (f = 0,
                u = e.numberOfChannels; f < u; f++) {
                    var s = e.getChannelData(f);
                    for (l = t.getChannelData(f),
                    c = n; c < o; c++)
                        l[c] = r.call(e, s[c], c, f, s)
                }
            else
                for (var f = 0, u = e.numberOfChannels; f < u; f++)
                    for (var l = t.getChannelData(f), c = n; c < o; c++)
                        l[c] = r;
            return t
        }
        function d(e, t, r) {
            h(e),
            t = null == t ? 0 : a(t, e.length),
            r = null == r ? e.length : a(r, e.length);
            for (var n = [], i = 0; i < e.numberOfChannels; i++) {
                var o = e.getChannelData(i);
                n.push(o.slice(t, r))
            }
            return u(n, e.numberOfChannels, e.sampleRate)
        }
        function g() {
            for (var e = [], t = 0, r = arguments.length; t < r; t++) {
                var n = arguments[t];
                if (Array.isArray(n))
                    for (var i = 0; i < n.length; i++)
                        e.push(n[i]);
                else
                    e.push(n)
            }
            var o = 1
              , a = 0
              , s = 0;
            for (t = 0; t < e.length; t++) {
                h(d = e[t]),
                a += d.length,
                o = Math.max(d.numberOfChannels, o),
                s = Math.max(d.sampleRate, s)
            }
            for (var f = [], l = 0; l < o; l++) {
                var c = new Float32Array(a)
                  , p = 0;
                for (t = 0; t < e.length; t++) {
                    var d;
                    l < (d = e[t]).numberOfChannels && c.set(d.getChannelData(l), p),
                    p += d.length
                }
                f.push(c)
            }
            return u(f, o, s)
        }
        function b(e, t, r) {
            var n, i;
            return "number" == typeof e ? (n = t,
            i = e) : (n = e,
            i = t),
            r = r || 0,
            h(n),
            i < n.length ? n : n === t ? g(p(u(i - n.length, n.numberOfChannels), r), n) : g(n, p(u(i - n.length, n.numberOfChannels), r))
        }
        function y(e, t, r, n) {
            var i, o;
            if (h(e),
            t = null == t ? 0 : Math.abs(t),
            r) {
                i = e.length;
                for (var a = 0, s = e.numberOfChannels; a < s; a++)
                    for (var f = e.getChannelData(a), u = 0; u < f.length && !(u > i); u++)
                        if (Math.abs(f[u]) > t) {
                            i = u;
                            break
                        }
            } else
                i = 0;
            if (n) {
                o = 0;
                for (a = 0,
                s = e.numberOfChannels; a < s; a++)
                    for (u = (f = e.getChannelData(a)).length - 1; u >= 0 && !(u < o); u--)
                        if (Math.abs(f[u]) > t) {
                            o = u + 1;
                            break
                        }
            } else
                o = e.length;
            return d(e, i, o)
        }
        t.exports = {
            create: u,
            copy: l,
            shallow: c,
            clone: function(e) {
                return l(e, c(e))
            },
            reverse: function(e, t, r, n) {
                h(e),
                i(t) || null == t || (n = r,
                r = t,
                t = null);
                t ? (h(t),
                l(e, t)) : t = e;
                r = null == r ? 0 : a(r, e.length),
                n = null == n ? e.length : a(n, e.length);
                for (var o = 0, s = t.numberOfChannels; o < s; ++o)
                    t.getChannelData(o).subarray(r, n).reverse();
                return t
            },
            invert: function(e, t, r, n) {
                i(t) || null == t || (n = r,
                r = t,
                t = null);
                return p(e, t, function(e) {
                    return -e
                }, r, n)
            },
            zero: function(e, t, r, n) {
                return p(e, t, 0, r, n)
            },
            noise: function(e, t, r, n) {
                return p(e, t, function(e) {
                    return 2 * Math.random() - 1
                }, r, n)
            },
            equal: function e(t, r) {
                if (arguments.length > 2) {
                    for (var n = 0, i = arguments.length - 1; n < i; n++)
                        if (!e(arguments[n], arguments[n + 1]))
                            return !1;
                    return !0
                }
                h(t);
                h(r);
                if (t.length !== r.length || t.numberOfChannels !== r.numberOfChannels)
                    return !1;
                for (var o = 0; o < t.numberOfChannels; o++)
                    for (var a = t.getChannelData(o), s = r.getChannelData(o), n = 0; n < a.length; n++)
                        if (a[n] !== s[n])
                            return !1;
                return !0
            },
            fill: p,
            slice: d,
            concat: g,
            resize: function(e, t) {
                return h(e),
                t < e.length ? d(e, 0, t) : g(e, u(t - e.length, e.numberOfChannels))
            },
            pad: b,
            padLeft: function(e, t, r) {
                return b(t, e, r)
            },
            padRight: function(e, t, r) {
                return b(e, t, r)
            },
            rotate: function(e, t) {
                h(e);
                for (var r = 0; r < e.numberOfChannels; r++)
                    for (var n = e.getChannelData(r), i = n.slice(), o = 0, a = n.length; o < a; o++)
                        n[(t + (t + o < 0 ? a + o : o)) % a] = i[o];
                return e
            },
            shift: function(e, t) {
                h(e);
                for (var r = 0; r < e.numberOfChannels; r++) {
                    var n = e.getChannelData(r);
                    if (t > 0)
                        for (var i = n.length - t; i--; )
                            n[i + t] = n[i];
                    else
                        for (var i = -t, o = n.length - t; i < o; i++)
                            n[i + t] = n[i] || 0
                }
                return e
            },
            normalize: function(e, t, r, n) {
                i(t) || (n = r,
                r = t,
                t = null);
                r = null == r ? 0 : a(r, e.length),
                n = null == n ? e.length : a(n, e.length);
                for (var o = 0, f = 0; f < e.numberOfChannels; f++)
                    for (var u = e.getChannelData(f), l = r; l < n; l++)
                        o = Math.max(Math.abs(u[l]), o);
                var h = Math.max(1 / o, 1);
                return p(e, t, function(e, t, r) {
                    return s(e * h, -1, 1)
                }, r, n)
            },
            removeStatic: function(e, t, r, n) {
                var i = function(e, t, r) {
                    if (h(e),
                    t = null == t ? 0 : a(t, e.length),
                    (r = null == r ? e.length : a(r, e.length)) - t < 1)
                        return [];
                    for (var n = [], i = 0; i < e.numberOfChannels; i++) {
                        for (var o = 0, s = e.getChannelData(i), f = t; f < r; f++)
                            o += s[f];
                        n.push(o / (r - t))
                    }
                    return n
                }(e, r, n);
                return p(e, t, function(e, t, r) {
                    return e - i[r]
                }, r, n)
            },
            trim: function(e, t) {
                return y(e, t, !0, !0)
            },
            trimLeft: function(e, t) {
                return y(e, t, !0, !1)
            },
            trimRight: function(e, t) {
                return y(e, t, !1, !0)
            },
            mix: function(e, t, r, n) {
                h(e),
                h(t),
                null == r && (r = .5);
                var i = r instanceof Function ? r : function(e, t) {
                    return e * (1 - r) + t * r
                }
                ;
                null == n ? n = 0 : n < 0 && (n += e.length);
                for (var o = 0; o < e.numberOfChannels; o++)
                    for (var a = e.getChannelData(o), s = t.getChannelData(o), f = n, u = 0; f < e.length && u < t.length; f++,
                    u++)
                        a[f] = i.call(e, a[f], s[u], u, o);
                return e
            },
            size: function(e) {
                return h(e),
                e.numberOfChannels * e.getChannelData(0).byteLength
            },
            data: function(e, t) {
                h(e),
                t = t || [];
                for (var r = 0; r < e.numberOfChannels; r++)
                    ArrayBuffer.isView(t[r]) ? t[r].set(e.getChannelData(r)) : t[r] = e.getChannelData(r);
                return t
            },
            subbuffer: function(e, t, r) {
                h(e),
                t = null == t ? 0 : a(t, e.length),
                r = null == r ? e.length : a(r, e.length);
                for (var n = [], i = 0; i < e.numberOfChannels; i++) {
                    var o = e.getChannelData(i);
                    n.push(o.subarray(t, r))
                }
                return u(n, e.numberOfChannels, e.sampleRate, {
                    isWAA: !1
                })
            }
        }
    }
    , {
        "audio-buffer": 4,
        "audio-context": 5,
        clamp: 11,
        "is-audio-buffer": 16,
        "is-browser": 17,
        "negative-index": 21,
        "typedarray-methods": 47
    }],
    4: [function(e, t, r) {
        "use strict";
        var n = e("is-buffer")
          , i = e("buffer-to-arraybuffer")
          , o = e("is-browser")
          , a = e("is-audio-buffer")
          , s = e("audio-context")
          , f = e("is-plain-obj");
        function u(e, t, r, l) {
            if (!(this instanceof u))
                return new u(e,t,r,l);
            for (var h = arguments.length; !arguments[h] && h; )
                h--;
            var c, p, d, g = arguments[h], b = !1;
            if (g && "number" != typeof g ? (c = g.context || s && s(),
            p = null != g.isWAA ? g.isWAA : !(!o || !c.createBuffer),
            d = g.floatArray || Float32Array,
            g.floatArray && (b = !0)) : (p = !!(c = s && s()),
            d = Float32Array),
            null == t || f(t) ? (t = e || 1,
            e = null) : ("number" == typeof r ? this.sampleRate = r : o && (this.sampleRate = c.sampleRate),
            null != e && (this.numberOfChannels = e)),
            "number" == typeof t) {
                this.length = t,
                this.data = [];
                for (h = 0; h < this.numberOfChannels; h++)
                    this.data[h] = new d(t)
            } else if (a(t)) {
                this.length = t.length,
                null == e && (this.numberOfChannels = t.numberOfChannels),
                null == r && (this.sampleRate = t.sampleRate),
                this.data = [];
                h = 0;
                for (var y = this.numberOfChannels; h < y; h++)
                    this.data[h] = t.getChannelData(h).slice()
            } else if (ArrayBuffer.isView(t) || t instanceof ArrayBuffer || n(t)) {
                n(t) && (t = i(t)),
                t instanceof Float32Array || t instanceof Float64Array || (t = new d(t.buffer || t)),
                this.length = Math.floor(t.length / this.numberOfChannels),
                this.data = [];
                for (h = 0; h < this.numberOfChannels; h++)
                    this.data[h] = t.subarray(h * this.length, (h + 1) * this.length)
            } else {
                if (!Array.isArray(t)) {
                    if (t && (t.data || t.buffer))
                        return new u(this.numberOfChannels,t.data || t.buffer,this.sampleRate);
                    throw Error("Failed to create buffer: check provided arguments")
                }
                if (t[0]instanceof Object) {
                    null == e && (this.numberOfChannels = t.length),
                    this.length = t[0].length,
                    this.data = [];
                    for (h = 0; h < this.numberOfChannels; h++)
                        this.data[h] = !b && (t[h]instanceof Float32Array || t[h]instanceof Float64Array) ? t[h] : new d(t[h])
                } else {
                    this.length = Math.floor(t.length / this.numberOfChannels),
                    this.data = [];
                    for (h = 0; h < this.numberOfChannels; h++)
                        this.data[h] = new d(t.slice(h * this.length, (h + 1) * this.length))
                }
            }
            if (p) {
                var m = c.createBuffer(this.numberOfChannels, this.length, this.sampleRate);
                for (h = 0; h < this.numberOfChannels; h++)
                    m.getChannelData(h).set(this.getChannelData(h));
                return m
            }
            this.duration = this.length / this.sampleRate
        }
        t.exports = u,
        u.prototype.numberOfChannels = 2,
        u.prototype.sampleRate = s.sampleRate || 44100,
        u.prototype.getChannelData = function(e) {
            if (e >= this.numberOfChannels || e < 0 || null == e)
                throw Error("Cannot getChannelData: channel number (" + e + ") exceeds number of channels (" + this.numberOfChannels + ")");
            return this.data[e]
        }
        ,
        u.prototype.copyFromChannel = function(e, t, r) {
            null == r && (r = 0);
            for (var n = this.data[t], i = r, o = 0; i < this.length && o < e.length; i++,
            o++)
                e[o] = n[i]
        }
        ,
        u.prototype.copyToChannel = function(e, t, r) {
            var n = this.data[t];
            r || (r = 0);
            for (var i = r, o = 0; i < this.length && o < e.length; i++,
            o++)
                n[i] = e[o]
        }
    }
    , {
        "audio-context": 5,
        "buffer-to-arraybuffer": 9,
        "is-audio-buffer": 16,
        "is-browser": 17,
        "is-buffer": 18,
        "is-plain-obj": 20
    }],
    5: [function(e, t, r) {
        "use strict";
        var n = {};
        t.exports = function(e) {
            if ("undefined" == typeof window)
                return null;
            var t = window.OfflineAudioContext || window.webkitOfflineAudioContext
              , r = window.AudioContext || window.webkitAudioContext;
            if (!r)
                return null;
            "number" == typeof e && (e = {
                sampleRate: e
            });
            var i = e && e.sampleRate;
            if (e && e.offline)
                return t ? new t(e.channels || 2,e.length,i || 44100) : null;
            var o = n[i];
            if (o)
                return o;
            try {
                o = new r(e)
            } catch (e) {
                o = new r
            }
            return n[o.sampleRate] = n[i] = o,
            o
        }
    }
    , {}],
    6: [function(e, t, r) {
        "use strict";
        r.byteLength = function(e) {
            var t = u(e)
              , r = t[0]
              , n = t[1];
            return 3 * (r + n) / 4 - n
        }
        ,
        r.toByteArray = function(e) {
            for (var t, r = u(e), n = r[0], a = r[1], s = new o(function(e, t, r) {
                return 3 * (t + r) / 4 - r
            }(0, n, a)), f = 0, l = a > 0 ? n - 4 : n, h = 0; h < l; h += 4)
                t = i[e.charCodeAt(h)] << 18 | i[e.charCodeAt(h + 1)] << 12 | i[e.charCodeAt(h + 2)] << 6 | i[e.charCodeAt(h + 3)],
                s[f++] = t >> 16 & 255,
                s[f++] = t >> 8 & 255,
                s[f++] = 255 & t;
            2 === a && (t = i[e.charCodeAt(h)] << 2 | i[e.charCodeAt(h + 1)] >> 4,
            s[f++] = 255 & t);
            1 === a && (t = i[e.charCodeAt(h)] << 10 | i[e.charCodeAt(h + 1)] << 4 | i[e.charCodeAt(h + 2)] >> 2,
            s[f++] = t >> 8 & 255,
            s[f++] = 255 & t);
            return s
        }
        ,
        r.fromByteArray = function(e) {
            for (var t, r = e.length, i = r % 3, o = [], a = 0, s = r - i; a < s; a += 16383)
                o.push(l(e, a, a + 16383 > s ? s : a + 16383));
            1 === i ? (t = e[r - 1],
            o.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1],
            o.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
            return o.join("")
        }
        ;
        for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, f = a.length; s < f; ++s)
            n[s] = a[s],
            i[a.charCodeAt(s)] = s;
        function u(e) {
            var t = e.length;
            if (t % 4 > 0)
                throw new Error("Invalid string. Length must be a multiple of 4");
            var r = e.indexOf("=");
            return -1 === r && (r = t),
            [r, r === t ? 0 : 4 - r % 4]
        }
        function l(e, t, r) {
            for (var i, o, a = [], s = t; s < r; s += 3)
                i = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]),
                a.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
            return a.join("")
        }
        i["-".charCodeAt(0)] = 62,
        i["_".charCodeAt(0)] = 63
    }
    , {}],
    7: [function(e, t, r) {}
    , {}],
    8: [function(e, t, r) {
        var n = Object.create || function(e) {
            var t = function() {};
            return t.prototype = e,
            new t
        }
          , i = Object.keys || function(e) {
            var t = [];
            for (var r in e)
                Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
            return r
        }
          , o = Function.prototype.bind || function(e) {
            var t = this;
            return function() {
                return t.apply(e, arguments)
            }
        }
        ;
        function a() {
            this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = n(null),
            this._eventsCount = 0),
            this._maxListeners = this._maxListeners || void 0
        }
        t.exports = a,
        a.EventEmitter = a,
        a.prototype._events = void 0,
        a.prototype._maxListeners = void 0;
        var s, f = 10;
        try {
            var u = {};
            Object.defineProperty && Object.defineProperty(u, "x", {
                value: 0
            }),
            s = 0 === u.x
        } catch (e) {
            s = !1
        }
        function l(e) {
            return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners
        }
        function h(e, t, r, i) {
            var o, a, s;
            if ("function" != typeof r)
                throw new TypeError('"listener" argument must be a function');
            if ((a = e._events) ? (a.newListener && (e.emit("newListener", t, r.listener ? r.listener : r),
            a = e._events),
            s = a[t]) : (a = e._events = n(null),
            e._eventsCount = 0),
            s) {
                if ("function" == typeof s ? s = a[t] = i ? [r, s] : [s, r] : i ? s.unshift(r) : s.push(r),
                !s.warned && (o = l(e)) && o > 0 && s.length > o) {
                    s.warned = !0;
                    var f = new Error("Possible EventEmitter memory leak detected. " + s.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
                    f.name = "MaxListenersExceededWarning",
                    f.emitter = e,
                    f.type = t,
                    f.count = s.length,
                    "object" == typeof console && console.warn && console.warn("%s: %s", f.name, f.message)
                }
            } else
                s = a[t] = r,
                ++e._eventsCount;
            return e
        }
        function c() {
            if (!this.fired)
                switch (this.target.removeListener(this.type, this.wrapFn),
                this.fired = !0,
                arguments.length) {
                case 0:
                    return this.listener.call(this.target);
                case 1:
                    return this.listener.call(this.target, arguments[0]);
                case 2:
                    return this.listener.call(this.target, arguments[0], arguments[1]);
                case 3:
                    return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
                default:
                    for (var e = new Array(arguments.length), t = 0; t < e.length; ++t)
                        e[t] = arguments[t];
                    this.listener.apply(this.target, e)
                }
        }
        function p(e, t, r) {
            var n = {
                fired: !1,
                wrapFn: void 0,
                target: e,
                type: t,
                listener: r
            }
              , i = o.call(c, n);
            return i.listener = r,
            n.wrapFn = i,
            i
        }
        function d(e, t, r) {
            var n = e._events;
            if (!n)
                return [];
            var i = n[t];
            return i ? "function" == typeof i ? r ? [i.listener || i] : [i] : r ? function(e) {
                for (var t = new Array(e.length), r = 0; r < t.length; ++r)
                    t[r] = e[r].listener || e[r];
                return t
            }(i) : b(i, i.length) : []
        }
        function g(e) {
            var t = this._events;
            if (t) {
                var r = t[e];
                if ("function" == typeof r)
                    return 1;
                if (r)
                    return r.length
            }
            return 0
        }
        function b(e, t) {
            for (var r = new Array(t), n = 0; n < t; ++n)
                r[n] = e[n];
            return r
        }
        s ? Object.defineProperty(a, "defaultMaxListeners", {
            enumerable: !0,
            get: function() {
                return f
            },
            set: function(e) {
                if ("number" != typeof e || e < 0 || e != e)
                    throw new TypeError('"defaultMaxListeners" must be a positive number');
                f = e
            }
        }) : a.defaultMaxListeners = f,
        a.prototype.setMaxListeners = function(e) {
            if ("number" != typeof e || e < 0 || isNaN(e))
                throw new TypeError('"n" argument must be a positive number');
            return this._maxListeners = e,
            this
        }
        ,
        a.prototype.getMaxListeners = function() {
            return l(this)
        }
        ,
        a.prototype.emit = function(e) {
            var t, r, n, i, o, a, s = "error" === e;
            if (a = this._events)
                s = s && null == a.error;
            else if (!s)
                return !1;
            if (s) {
                if (arguments.length > 1 && (t = arguments[1]),
                t instanceof Error)
                    throw t;
                var f = new Error('Unhandled "error" event. (' + t + ")");
                throw f.context = t,
                f
            }
            if (!(r = a[e]))
                return !1;
            var u = "function" == typeof r;
            switch (n = arguments.length) {
            case 1:
                !function(e, t, r) {
                    if (t)
                        e.call(r);
                    else
                        for (var n = e.length, i = b(e, n), o = 0; o < n; ++o)
                            i[o].call(r)
                }(r, u, this);
                break;
            case 2:
                !function(e, t, r, n) {
                    if (t)
                        e.call(r, n);
                    else
                        for (var i = e.length, o = b(e, i), a = 0; a < i; ++a)
                            o[a].call(r, n)
                }(r, u, this, arguments[1]);
                break;
            case 3:
                !function(e, t, r, n, i) {
                    if (t)
                        e.call(r, n, i);
                    else
                        for (var o = e.length, a = b(e, o), s = 0; s < o; ++s)
                            a[s].call(r, n, i)
                }(r, u, this, arguments[1], arguments[2]);
                break;
            case 4:
                !function(e, t, r, n, i, o) {
                    if (t)
                        e.call(r, n, i, o);
                    else
                        for (var a = e.length, s = b(e, a), f = 0; f < a; ++f)
                            s[f].call(r, n, i, o)
                }(r, u, this, arguments[1], arguments[2], arguments[3]);
                break;
            default:
                for (i = new Array(n - 1),
                o = 1; o < n; o++)
                    i[o - 1] = arguments[o];
                !function(e, t, r, n) {
                    if (t)
                        e.apply(r, n);
                    else
                        for (var i = e.length, o = b(e, i), a = 0; a < i; ++a)
                            o[a].apply(r, n)
                }(r, u, this, i)
            }
            return !0
        }
        ,
        a.prototype.addListener = function(e, t) {
            return h(this, e, t, !1)
        }
        ,
        a.prototype.on = a.prototype.addListener,
        a.prototype.prependListener = function(e, t) {
            return h(this, e, t, !0)
        }
        ,
        a.prototype.once = function(e, t) {
            if ("function" != typeof t)
                throw new TypeError('"listener" argument must be a function');
            return this.on(e, p(this, e, t)),
            this
        }
        ,
        a.prototype.prependOnceListener = function(e, t) {
            if ("function" != typeof t)
                throw new TypeError('"listener" argument must be a function');
            return this.prependListener(e, p(this, e, t)),
            this
        }
        ,
        a.prototype.removeListener = function(e, t) {
            var r, i, o, a, s;
            if ("function" != typeof t)
                throw new TypeError('"listener" argument must be a function');
            if (!(i = this._events))
                return this;
            if (!(r = i[e]))
                return this;
            if (r === t || r.listener === t)
                0 == --this._eventsCount ? this._events = n(null) : (delete i[e],
                i.removeListener && this.emit("removeListener", e, r.listener || t));
            else if ("function" != typeof r) {
                for (o = -1,
                a = r.length - 1; a >= 0; a--)
                    if (r[a] === t || r[a].listener === t) {
                        s = r[a].listener,
                        o = a;
                        break
                    }
                if (o < 0)
                    return this;
                0 === o ? r.shift() : function(e, t) {
                    for (var r = t, n = r + 1, i = e.length; n < i; r += 1,
                    n += 1)
                        e[r] = e[n];
                    e.pop()
                }(r, o),
                1 === r.length && (i[e] = r[0]),
                i.removeListener && this.emit("removeListener", e, s || t)
            }
            return this
        }
        ,
        a.prototype.removeAllListeners = function(e) {
            var t, r, o;
            if (!(r = this._events))
                return this;
            if (!r.removeListener)
                return 0 === arguments.length ? (this._events = n(null),
                this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = n(null) : delete r[e]),
                this;
            if (0 === arguments.length) {
                var a, s = i(r);
                for (o = 0; o < s.length; ++o)
                    "removeListener" !== (a = s[o]) && this.removeAllListeners(a);
                return this.removeAllListeners("removeListener"),
                this._events = n(null),
                this._eventsCount = 0,
                this
            }
            if ("function" == typeof (t = r[e]))
                this.removeListener(e, t);
            else if (t)
                for (o = t.length - 1; o >= 0; o--)
                    this.removeListener(e, t[o]);
            return this
        }
        ,
        a.prototype.listeners = function(e) {
            return d(this, e, !0)
        }
        ,
        a.prototype.rawListeners = function(e) {
            return d(this, e, !1)
        }
        ,
        a.listenerCount = function(e, t) {
            return "function" == typeof e.listenerCount ? e.listenerCount(t) : g.call(e, t)
        }
        ,
        a.prototype.listenerCount = g,
        a.prototype.eventNames = function() {
            return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : []
        }
    }
    , {}],
    9: [function(e, t, r) {
        (function(e) {
            !function(n) {
                var i = new e(0).buffer instanceof ArrayBuffer ? function(e) {
                    return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength)
                }
                : function(e) {
                    for (var t = new ArrayBuffer(e.length), r = new Uint8Array(t), n = 0; n < e.length; ++n)
                        r[n] = e[n];
                    return t
                }
                ;
                void 0 !== r ? (void 0 !== t && t.exports && (r = t.exports = i),
                r.bufferToArrayBuffer = i) : "function" == typeof define && define.amd ? define([], function() {
                    return i
                }) : n.bufferToArrayBuffer = i
            }(this)
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        buffer: 10
    }],
    10: [function(e, t, r) {
        (function(t) {
            "use strict";
            var n = e("base64-js")
              , i = e("ieee754");
            r.Buffer = t,
            r.SlowBuffer = function(e) {
                +e != e && (e = 0);
                return t.alloc(+e)
            }
            ,
            r.INSPECT_MAX_BYTES = 50;
            var o = 2147483647;
            function a(e) {
                if (e > o)
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                var r = new Uint8Array(e);
                return r.__proto__ = t.prototype,
                r
            }
            function t(e, t, r) {
                if ("number" == typeof e) {
                    if ("string" == typeof t)
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    return u(e)
                }
                return s(e, t, r)
            }
            function s(e, r, n) {
                if ("string" == typeof e)
                    return function(e, r) {
                        "string" == typeof r && "" !== r || (r = "utf8");
                        if (!t.isEncoding(r))
                            throw new TypeError("Unknown encoding: " + r);
                        var n = 0 | c(e, r)
                          , i = a(n)
                          , o = i.write(e, r);
                        o !== n && (i = i.slice(0, o));
                        return i
                    }(e, r);
                if (ArrayBuffer.isView(e))
                    return l(e);
                if (null == e)
                    throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                if (N(e, ArrayBuffer) || e && N(e.buffer, ArrayBuffer))
                    return function(e, r, n) {
                        if (r < 0 || e.byteLength < r)
                            throw new RangeError('"offset" is outside of buffer bounds');
                        if (e.byteLength < r + (n || 0))
                            throw new RangeError('"length" is outside of buffer bounds');
                        var i;
                        i = void 0 === r && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e,r) : new Uint8Array(e,r,n);
                        return i.__proto__ = t.prototype,
                        i
                    }(e, r, n);
                if ("number" == typeof e)
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                var i = e.valueOf && e.valueOf();
                if (null != i && i !== e)
                    return t.from(i, r, n);
                var o = function(e) {
                    if (t.isBuffer(e)) {
                        var r = 0 | h(e.length)
                          , n = a(r);
                        return 0 === n.length ? n : (e.copy(n, 0, 0, r),
                        n)
                    }
                    if (void 0 !== e.length)
                        return "number" != typeof e.length || P(e.length) ? a(0) : l(e);
                    if ("Buffer" === e.type && Array.isArray(e.data))
                        return l(e.data)
                }(e);
                if (o)
                    return o;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive])
                    return t.from(e[Symbol.toPrimitive]("string"), r, n);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
            }
            function f(e) {
                if ("number" != typeof e)
                    throw new TypeError('"size" argument must be of type number');
                if (e < 0)
                    throw new RangeError('The value "' + e + '" is invalid for option "size"')
            }
            function u(e) {
                return f(e),
                a(e < 0 ? 0 : 0 | h(e))
            }
            function l(e) {
                for (var t = e.length < 0 ? 0 : 0 | h(e.length), r = a(t), n = 0; n < t; n += 1)
                    r[n] = 255 & e[n];
                return r
            }
            function h(e) {
                if (e >= o)
                    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o.toString(16) + " bytes");
                return 0 | e
            }
            function c(e, r) {
                if (t.isBuffer(e))
                    return e.length;
                if (ArrayBuffer.isView(e) || N(e, ArrayBuffer))
                    return e.byteLength;
                if ("string" != typeof e)
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
                var n = e.length
                  , i = arguments.length > 2 && !0 === arguments[2];
                if (!i && 0 === n)
                    return 0;
                for (var o = !1; ; )
                    switch (r) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return n;
                    case "utf8":
                    case "utf-8":
                        return U(e).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * n;
                    case "hex":
                        return n >>> 1;
                    case "base64":
                        return I(e).length;
                    default:
                        if (o)
                            return i ? -1 : U(e).length;
                        r = ("" + r).toLowerCase(),
                        o = !0
                    }
            }
            function p(e, t, r) {
                var n = e[t];
                e[t] = e[r],
                e[r] = n
            }
            function d(e, r, n, i, o) {
                if (0 === e.length)
                    return -1;
                if ("string" == typeof n ? (i = n,
                n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648),
                P(n = +n) && (n = o ? 0 : e.length - 1),
                n < 0 && (n = e.length + n),
                n >= e.length) {
                    if (o)
                        return -1;
                    n = e.length - 1
                } else if (n < 0) {
                    if (!o)
                        return -1;
                    n = 0
                }
                if ("string" == typeof r && (r = t.from(r, i)),
                t.isBuffer(r))
                    return 0 === r.length ? -1 : g(e, r, n, i, o);
                if ("number" == typeof r)
                    return r &= 255,
                    "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, r, n) : Uint8Array.prototype.lastIndexOf.call(e, r, n) : g(e, [r], n, i, o);
                throw new TypeError("val must be string, number or Buffer")
            }
            function g(e, t, r, n, i) {
                var o, a = 1, s = e.length, f = t.length;
                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (e.length < 2 || t.length < 2)
                        return -1;
                    a = 2,
                    s /= 2,
                    f /= 2,
                    r /= 2
                }
                function u(e, t) {
                    return 1 === a ? e[t] : e.readUInt16BE(t * a)
                }
                if (i) {
                    var l = -1;
                    for (o = r; o < s; o++)
                        if (u(e, o) === u(t, -1 === l ? 0 : o - l)) {
                            if (-1 === l && (l = o),
                            o - l + 1 === f)
                                return l * a
                        } else
                            -1 !== l && (o -= o - l),
                            l = -1
                } else
                    for (r + f > s && (r = s - f),
                    o = r; o >= 0; o--) {
                        for (var h = !0, c = 0; c < f; c++)
                            if (u(e, o + c) !== u(t, c)) {
                                h = !1;
                                break
                            }
                        if (h)
                            return o
                    }
                return -1
            }
            function b(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                n ? (n = Number(n)) > i && (n = i) : n = i;
                var o = t.length;
                n > o / 2 && (n = o / 2);
                for (var a = 0; a < n; ++a) {
                    var s = parseInt(t.substr(2 * a, 2), 16);
                    if (P(s))
                        return a;
                    e[r + a] = s
                }
                return a
            }
            function y(e, t, r, n) {
                return F(U(t, e.length - r), e, r, n)
            }
            function m(e, t, r, n) {
                return F(function(e) {
                    for (var t = [], r = 0; r < e.length; ++r)
                        t.push(255 & e.charCodeAt(r));
                    return t
                }(t), e, r, n)
            }
            function v(e, t, r, n) {
                return m(e, t, r, n)
            }
            function w(e, t, r, n) {
                return F(I(t), e, r, n)
            }
            function _(e, t, r, n) {
                return F(function(e, t) {
                    for (var r, n, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a)
                        r = e.charCodeAt(a),
                        n = r >> 8,
                        i = r % 256,
                        o.push(i),
                        o.push(n);
                    return o
                }(t, e.length - r), e, r, n)
            }
            function C(e, t, r) {
                return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
            }
            function x(e, t, r) {
                r = Math.min(e.length, r);
                for (var n = [], i = t; i < r; ) {
                    var o, a, s, f, u = e[i], l = null, h = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
                    if (i + h <= r)
                        switch (h) {
                        case 1:
                            u < 128 && (l = u);
                            break;
                        case 2:
                            128 == (192 & (o = e[i + 1])) && (f = (31 & u) << 6 | 63 & o) > 127 && (l = f);
                            break;
                        case 3:
                            o = e[i + 1],
                            a = e[i + 2],
                            128 == (192 & o) && 128 == (192 & a) && (f = (15 & u) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (f < 55296 || f > 57343) && (l = f);
                            break;
                        case 4:
                            o = e[i + 1],
                            a = e[i + 2],
                            s = e[i + 3],
                            128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (f = (15 & u) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && f < 1114112 && (l = f)
                        }
                    null === l ? (l = 65533,
                    h = 1) : l > 65535 && (l -= 65536,
                    n.push(l >>> 10 & 1023 | 55296),
                    l = 56320 | 1023 & l),
                    n.push(l),
                    i += h
                }
                return function(e) {
                    var t = e.length;
                    if (t <= A)
                        return String.fromCharCode.apply(String, e);
                    var r = ""
                      , n = 0;
                    for (; n < t; )
                        r += String.fromCharCode.apply(String, e.slice(n, n += A));
                    return r
                }(n)
            }
            r.kMaxLength = o,
            t.TYPED_ARRAY_SUPPORT = function() {
                try {
                    var e = new Uint8Array(1);
                    return e.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42
                        }
                    },
                    42 === e.foo()
                } catch (e) {
                    return !1
                }
            }(),
            t.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
            Object.defineProperty(t.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (t.isBuffer(this))
                        return this.buffer
                }
            }),
            Object.defineProperty(t.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (t.isBuffer(this))
                        return this.byteOffset
                }
            }),
            "undefined" != typeof Symbol && null != Symbol.species && t[Symbol.species] === t && Object.defineProperty(t, Symbol.species, {
                value: null,
                configurable: !0,
                enumerable: !1,
                writable: !1
            }),
            t.poolSize = 8192,
            t.from = function(e, t, r) {
                return s(e, t, r)
            }
            ,
            t.prototype.__proto__ = Uint8Array.prototype,
            t.__proto__ = Uint8Array,
            t.alloc = function(e, t, r) {
                return function(e, t, r) {
                    return f(e),
                    e <= 0 ? a(e) : void 0 !== t ? "string" == typeof r ? a(e).fill(t, r) : a(e).fill(t) : a(e)
                }(e, t, r)
            }
            ,
            t.allocUnsafe = function(e) {
                return u(e)
            }
            ,
            t.allocUnsafeSlow = function(e) {
                return u(e)
            }
            ,
            t.isBuffer = function(e) {
                return null != e && !0 === e._isBuffer && e !== t.prototype
            }
            ,
            t.compare = function(e, r) {
                if (N(e, Uint8Array) && (e = t.from(e, e.offset, e.byteLength)),
                N(r, Uint8Array) && (r = t.from(r, r.offset, r.byteLength)),
                !t.isBuffer(e) || !t.isBuffer(r))
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (e === r)
                    return 0;
                for (var n = e.length, i = r.length, o = 0, a = Math.min(n, i); o < a; ++o)
                    if (e[o] !== r[o]) {
                        n = e[o],
                        i = r[o];
                        break
                    }
                return n < i ? -1 : i < n ? 1 : 0
            }
            ,
            t.isEncoding = function(e) {
                switch (String(e).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
                }
            }
            ,
            t.concat = function(e, r) {
                if (!Array.isArray(e))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length)
                    return t.alloc(0);
                var n;
                if (void 0 === r)
                    for (r = 0,
                    n = 0; n < e.length; ++n)
                        r += e[n].length;
                var i = t.allocUnsafe(r)
                  , o = 0;
                for (n = 0; n < e.length; ++n) {
                    var a = e[n];
                    if (N(a, Uint8Array) && (a = t.from(a)),
                    !t.isBuffer(a))
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    a.copy(i, o),
                    o += a.length
                }
                return i
            }
            ,
            t.byteLength = c,
            t.prototype._isBuffer = !0,
            t.prototype.swap16 = function() {
                var e = this.length;
                if (e % 2 != 0)
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var t = 0; t < e; t += 2)
                    p(this, t, t + 1);
                return this
            }
            ,
            t.prototype.swap32 = function() {
                var e = this.length;
                if (e % 4 != 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var t = 0; t < e; t += 4)
                    p(this, t, t + 3),
                    p(this, t + 1, t + 2);
                return this
            }
            ,
            t.prototype.swap64 = function() {
                var e = this.length;
                if (e % 8 != 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var t = 0; t < e; t += 8)
                    p(this, t, t + 7),
                    p(this, t + 1, t + 6),
                    p(this, t + 2, t + 5),
                    p(this, t + 3, t + 4);
                return this
            }
            ,
            t.prototype.toString = function() {
                var e = this.length;
                return 0 === e ? "" : 0 === arguments.length ? x(this, 0, e) : function(e, t, r) {
                    var n = !1;
                    if ((void 0 === t || t < 0) && (t = 0),
                    t > this.length)
                        return "";
                    if ((void 0 === r || r > this.length) && (r = this.length),
                    r <= 0)
                        return "";
                    if ((r >>>= 0) <= (t >>>= 0))
                        return "";
                    for (e || (e = "utf8"); ; )
                        switch (e) {
                        case "hex":
                            return S(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return x(this, t, r);
                        case "ascii":
                            return E(this, t, r);
                        case "latin1":
                        case "binary":
                            return O(this, t, r);
                        case "base64":
                            return C(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return T(this, t, r);
                        default:
                            if (n)
                                throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(),
                            n = !0
                        }
                }
                .apply(this, arguments)
            }
            ,
            t.prototype.toLocaleString = t.prototype.toString,
            t.prototype.equals = function(e) {
                if (!t.isBuffer(e))
                    throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === t.compare(this, e)
            }
            ,
            t.prototype.inspect = function() {
                var e = ""
                  , t = r.INSPECT_MAX_BYTES;
                return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(),
                this.length > t && (e += " ... "),
                "<Buffer " + e + ">"
            }
            ,
            t.prototype.compare = function(e, r, n, i, o) {
                if (N(e, Uint8Array) && (e = t.from(e, e.offset, e.byteLength)),
                !t.isBuffer(e))
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                if (void 0 === r && (r = 0),
                void 0 === n && (n = e ? e.length : 0),
                void 0 === i && (i = 0),
                void 0 === o && (o = this.length),
                r < 0 || n > e.length || i < 0 || o > this.length)
                    throw new RangeError("out of range index");
                if (i >= o && r >= n)
                    return 0;
                if (i >= o)
                    return -1;
                if (r >= n)
                    return 1;
                if (r >>>= 0,
                n >>>= 0,
                i >>>= 0,
                o >>>= 0,
                this === e)
                    return 0;
                for (var a = o - i, s = n - r, f = Math.min(a, s), u = this.slice(i, o), l = e.slice(r, n), h = 0; h < f; ++h)
                    if (u[h] !== l[h]) {
                        a = u[h],
                        s = l[h];
                        break
                    }
                return a < s ? -1 : s < a ? 1 : 0
            }
            ,
            t.prototype.includes = function(e, t, r) {
                return -1 !== this.indexOf(e, t, r)
            }
            ,
            t.prototype.indexOf = function(e, t, r) {
                return d(this, e, t, r, !0)
            }
            ,
            t.prototype.lastIndexOf = function(e, t, r) {
                return d(this, e, t, r, !1)
            }
            ,
            t.prototype.write = function(e, t, r, n) {
                if (void 0 === t)
                    n = "utf8",
                    r = this.length,
                    t = 0;
                else if (void 0 === r && "string" == typeof t)
                    n = t,
                    r = this.length,
                    t = 0;
                else {
                    if (!isFinite(t))
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    t >>>= 0,
                    isFinite(r) ? (r >>>= 0,
                    void 0 === n && (n = "utf8")) : (n = r,
                    r = void 0)
                }
                var i = this.length - t;
                if ((void 0 === r || r > i) && (r = i),
                e.length > 0 && (r < 0 || t < 0) || t > this.length)
                    throw new RangeError("Attempt to write outside buffer bounds");
                n || (n = "utf8");
                for (var o = !1; ; )
                    switch (n) {
                    case "hex":
                        return b(this, e, t, r);
                    case "utf8":
                    case "utf-8":
                        return y(this, e, t, r);
                    case "ascii":
                        return m(this, e, t, r);
                    case "latin1":
                    case "binary":
                        return v(this, e, t, r);
                    case "base64":
                        return w(this, e, t, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return _(this, e, t, r);
                    default:
                        if (o)
                            throw new TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(),
                        o = !0
                    }
            }
            ,
            t.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
            var A = 4096;
            function E(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i)
                    n += String.fromCharCode(127 & e[i]);
                return n
            }
            function O(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i)
                    n += String.fromCharCode(e[i]);
                return n
            }
            function S(e, t, r) {
                var n = e.length;
                (!t || t < 0) && (t = 0),
                (!r || r < 0 || r > n) && (r = n);
                for (var i = "", o = t; o < r; ++o)
                    i += D(e[o]);
                return i
            }
            function T(e, t, r) {
                for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2)
                    i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                return i
            }
            function k(e, t, r) {
                if (e % 1 != 0 || e < 0)
                    throw new RangeError("offset is not uint");
                if (e + t > r)
                    throw new RangeError("Trying to access beyond buffer length")
            }
            function R(e, r, n, i, o, a) {
                if (!t.isBuffer(e))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (r > o || r < a)
                    throw new RangeError('"value" argument is out of bounds');
                if (n + i > e.length)
                    throw new RangeError("Index out of range")
            }
            function M(e, t, r, n, i, o) {
                if (r + n > e.length)
                    throw new RangeError("Index out of range");
                if (r < 0)
                    throw new RangeError("Index out of range")
            }
            function j(e, t, r, n, o) {
                return t = +t,
                r >>>= 0,
                o || M(e, 0, r, 4),
                i.write(e, t, r, n, 23, 4),
                r + 4
            }
            function B(e, t, r, n, o) {
                return t = +t,
                r >>>= 0,
                o || M(e, 0, r, 8),
                i.write(e, t, r, n, 52, 8),
                r + 8
            }
            t.prototype.slice = function(e, r) {
                var n = this.length;
                e = ~~e,
                r = void 0 === r ? n : ~~r,
                e < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
                r < 0 ? (r += n) < 0 && (r = 0) : r > n && (r = n),
                r < e && (r = e);
                var i = this.subarray(e, r);
                return i.__proto__ = t.prototype,
                i
            }
            ,
            t.prototype.readUIntLE = function(e, t, r) {
                e >>>= 0,
                t >>>= 0,
                r || k(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); )
                    n += this[e + o] * i;
                return n
            }
            ,
            t.prototype.readUIntBE = function(e, t, r) {
                e >>>= 0,
                t >>>= 0,
                r || k(e, t, this.length);
                for (var n = this[e + --t], i = 1; t > 0 && (i *= 256); )
                    n += this[e + --t] * i;
                return n
            }
            ,
            t.prototype.readUInt8 = function(e, t) {
                return e >>>= 0,
                t || k(e, 1, this.length),
                this[e]
            }
            ,
            t.prototype.readUInt16LE = function(e, t) {
                return e >>>= 0,
                t || k(e, 2, this.length),
                this[e] | this[e + 1] << 8
            }
            ,
            t.prototype.readUInt16BE = function(e, t) {
                return e >>>= 0,
                t || k(e, 2, this.length),
                this[e] << 8 | this[e + 1]
            }
            ,
            t.prototype.readUInt32LE = function(e, t) {
                return e >>>= 0,
                t || k(e, 4, this.length),
                (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
            }
            ,
            t.prototype.readUInt32BE = function(e, t) {
                return e >>>= 0,
                t || k(e, 4, this.length),
                16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            }
            ,
            t.prototype.readIntLE = function(e, t, r) {
                e >>>= 0,
                t >>>= 0,
                r || k(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); )
                    n += this[e + o] * i;
                return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)),
                n
            }
            ,
            t.prototype.readIntBE = function(e, t, r) {
                e >>>= 0,
                t >>>= 0,
                r || k(e, t, this.length);
                for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256); )
                    o += this[e + --n] * i;
                return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)),
                o
            }
            ,
            t.prototype.readInt8 = function(e, t) {
                return e >>>= 0,
                t || k(e, 1, this.length),
                128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
            }
            ,
            t.prototype.readInt16LE = function(e, t) {
                e >>>= 0,
                t || k(e, 2, this.length);
                var r = this[e] | this[e + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }
            ,
            t.prototype.readInt16BE = function(e, t) {
                e >>>= 0,
                t || k(e, 2, this.length);
                var r = this[e + 1] | this[e] << 8;
                return 32768 & r ? 4294901760 | r : r
            }
            ,
            t.prototype.readInt32LE = function(e, t) {
                return e >>>= 0,
                t || k(e, 4, this.length),
                this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            }
            ,
            t.prototype.readInt32BE = function(e, t) {
                return e >>>= 0,
                t || k(e, 4, this.length),
                this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            }
            ,
            t.prototype.readFloatLE = function(e, t) {
                return e >>>= 0,
                t || k(e, 4, this.length),
                i.read(this, e, !0, 23, 4)
            }
            ,
            t.prototype.readFloatBE = function(e, t) {
                return e >>>= 0,
                t || k(e, 4, this.length),
                i.read(this, e, !1, 23, 4)
            }
            ,
            t.prototype.readDoubleLE = function(e, t) {
                return e >>>= 0,
                t || k(e, 8, this.length),
                i.read(this, e, !0, 52, 8)
            }
            ,
            t.prototype.readDoubleBE = function(e, t) {
                return e >>>= 0,
                t || k(e, 8, this.length),
                i.read(this, e, !1, 52, 8)
            }
            ,
            t.prototype.writeUIntLE = function(e, t, r, n) {
                (e = +e,
                t >>>= 0,
                r >>>= 0,
                n) || R(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                var i = 1
                  , o = 0;
                for (this[t] = 255 & e; ++o < r && (i *= 256); )
                    this[t + o] = e / i & 255;
                return t + r
            }
            ,
            t.prototype.writeUIntBE = function(e, t, r, n) {
                (e = +e,
                t >>>= 0,
                r >>>= 0,
                n) || R(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                var i = r - 1
                  , o = 1;
                for (this[t + i] = 255 & e; --i >= 0 && (o *= 256); )
                    this[t + i] = e / o & 255;
                return t + r
            }
            ,
            t.prototype.writeUInt8 = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 1, 255, 0),
                this[t] = 255 & e,
                t + 1
            }
            ,
            t.prototype.writeUInt16LE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 2, 65535, 0),
                this[t] = 255 & e,
                this[t + 1] = e >>> 8,
                t + 2
            }
            ,
            t.prototype.writeUInt16BE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 2, 65535, 0),
                this[t] = e >>> 8,
                this[t + 1] = 255 & e,
                t + 2
            }
            ,
            t.prototype.writeUInt32LE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 4, 4294967295, 0),
                this[t + 3] = e >>> 24,
                this[t + 2] = e >>> 16,
                this[t + 1] = e >>> 8,
                this[t] = 255 & e,
                t + 4
            }
            ,
            t.prototype.writeUInt32BE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 4, 4294967295, 0),
                this[t] = e >>> 24,
                this[t + 1] = e >>> 16,
                this[t + 2] = e >>> 8,
                this[t + 3] = 255 & e,
                t + 4
            }
            ,
            t.prototype.writeIntLE = function(e, t, r, n) {
                if (e = +e,
                t >>>= 0,
                !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    R(this, e, t, r, i - 1, -i)
                }
                var o = 0
                  , a = 1
                  , s = 0;
                for (this[t] = 255 & e; ++o < r && (a *= 256); )
                    e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1),
                    this[t + o] = (e / a >> 0) - s & 255;
                return t + r
            }
            ,
            t.prototype.writeIntBE = function(e, t, r, n) {
                if (e = +e,
                t >>>= 0,
                !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    R(this, e, t, r, i - 1, -i)
                }
                var o = r - 1
                  , a = 1
                  , s = 0;
                for (this[t + o] = 255 & e; --o >= 0 && (a *= 256); )
                    e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1),
                    this[t + o] = (e / a >> 0) - s & 255;
                return t + r
            }
            ,
            t.prototype.writeInt8 = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 1, 127, -128),
                e < 0 && (e = 255 + e + 1),
                this[t] = 255 & e,
                t + 1
            }
            ,
            t.prototype.writeInt16LE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 2, 32767, -32768),
                this[t] = 255 & e,
                this[t + 1] = e >>> 8,
                t + 2
            }
            ,
            t.prototype.writeInt16BE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 2, 32767, -32768),
                this[t] = e >>> 8,
                this[t + 1] = 255 & e,
                t + 2
            }
            ,
            t.prototype.writeInt32LE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 4, 2147483647, -2147483648),
                this[t] = 255 & e,
                this[t + 1] = e >>> 8,
                this[t + 2] = e >>> 16,
                this[t + 3] = e >>> 24,
                t + 4
            }
            ,
            t.prototype.writeInt32BE = function(e, t, r) {
                return e = +e,
                t >>>= 0,
                r || R(this, e, t, 4, 2147483647, -2147483648),
                e < 0 && (e = 4294967295 + e + 1),
                this[t] = e >>> 24,
                this[t + 1] = e >>> 16,
                this[t + 2] = e >>> 8,
                this[t + 3] = 255 & e,
                t + 4
            }
            ,
            t.prototype.writeFloatLE = function(e, t, r) {
                return j(this, e, t, !0, r)
            }
            ,
            t.prototype.writeFloatBE = function(e, t, r) {
                return j(this, e, t, !1, r)
            }
            ,
            t.prototype.writeDoubleLE = function(e, t, r) {
                return B(this, e, t, !0, r)
            }
            ,
            t.prototype.writeDoubleBE = function(e, t, r) {
                return B(this, e, t, !1, r)
            }
            ,
            t.prototype.copy = function(e, r, n, i) {
                if (!t.isBuffer(e))
                    throw new TypeError("argument should be a Buffer");
                if (n || (n = 0),
                i || 0 === i || (i = this.length),
                r >= e.length && (r = e.length),
                r || (r = 0),
                i > 0 && i < n && (i = n),
                i === n)
                    return 0;
                if (0 === e.length || 0 === this.length)
                    return 0;
                if (r < 0)
                    throw new RangeError("targetStart out of bounds");
                if (n < 0 || n >= this.length)
                    throw new RangeError("Index out of range");
                if (i < 0)
                    throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length),
                e.length - r < i - n && (i = e.length - r + n);
                var o = i - n;
                if (this === e && "function" == typeof Uint8Array.prototype.copyWithin)
                    this.copyWithin(r, n, i);
                else if (this === e && n < r && r < i)
                    for (var a = o - 1; a >= 0; --a)
                        e[a + r] = this[a + n];
                else
                    Uint8Array.prototype.set.call(e, this.subarray(n, i), r);
                return o
            }
            ,
            t.prototype.fill = function(e, r, n, i) {
                if ("string" == typeof e) {
                    if ("string" == typeof r ? (i = r,
                    r = 0,
                    n = this.length) : "string" == typeof n && (i = n,
                    n = this.length),
                    void 0 !== i && "string" != typeof i)
                        throw new TypeError("encoding must be a string");
                    if ("string" == typeof i && !t.isEncoding(i))
                        throw new TypeError("Unknown encoding: " + i);
                    if (1 === e.length) {
                        var o = e.charCodeAt(0);
                        ("utf8" === i && o < 128 || "latin1" === i) && (e = o)
                    }
                } else
                    "number" == typeof e && (e &= 255);
                if (r < 0 || this.length < r || this.length < n)
                    throw new RangeError("Out of range index");
                if (n <= r)
                    return this;
                var a;
                if (r >>>= 0,
                n = void 0 === n ? this.length : n >>> 0,
                e || (e = 0),
                "number" == typeof e)
                    for (a = r; a < n; ++a)
                        this[a] = e;
                else {
                    var s = t.isBuffer(e) ? e : t.from(e, i)
                      , f = s.length;
                    if (0 === f)
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    for (a = 0; a < n - r; ++a)
                        this[a + r] = s[a % f]
                }
                return this
            }
            ;
            var L = /[^+/0-9A-Za-z-_]/g;
            function D(e) {
                return e < 16 ? "0" + e.toString(16) : e.toString(16)
            }
            function U(e, t) {
                var r;
                t = t || 1 / 0;
                for (var n = e.length, i = null, o = [], a = 0; a < n; ++a) {
                    if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
                        if (!i) {
                            if (r > 56319) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            if (a + 1 === n) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            i = r;
                            continue
                        }
                        if (r < 56320) {
                            (t -= 3) > -1 && o.push(239, 191, 189),
                            i = r;
                            continue
                        }
                        r = 65536 + (i - 55296 << 10 | r - 56320)
                    } else
                        i && (t -= 3) > -1 && o.push(239, 191, 189);
                    if (i = null,
                    r < 128) {
                        if ((t -= 1) < 0)
                            break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((t -= 2) < 0)
                            break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((t -= 3) < 0)
                            break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (!(r < 1114112))
                            throw new Error("Invalid code point");
                        if ((t -= 4) < 0)
                            break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return o
            }
            function I(e) {
                return n.toByteArray(function(e) {
                    if ((e = (e = e.split("=")[0]).trim().replace(L, "")).length < 2)
                        return "";
                    for (; e.length % 4 != 0; )
                        e += "=";
                    return e
                }(e))
            }
            function F(e, t, r, n) {
                for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i)
                    t[i + r] = e[i];
                return i
            }
            function N(e, t) {
                return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
            }
            function P(e) {
                return e != e
            }
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        "base64-js": 6,
        buffer: 10,
        ieee754: 14
    }],
    11: [function(e, t, r) {
        t.exports = function(e, t, r) {
            return t < r ? e < t ? t : e > r ? r : e : e < r ? r : e > t ? t : e
        }
    }
    , {}],
    12: [function(e, t, r) {
        (function(e) {
            function t(e) {
                return Object.prototype.toString.call(e)
            }
            r.isArray = function(e) {
                return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e)
            }
            ,
            r.isBoolean = function(e) {
                return "boolean" == typeof e
            }
            ,
            r.isNull = function(e) {
                return null === e
            }
            ,
            r.isNullOrUndefined = function(e) {
                return null == e
            }
            ,
            r.isNumber = function(e) {
                return "number" == typeof e
            }
            ,
            r.isString = function(e) {
                return "string" == typeof e
            }
            ,
            r.isSymbol = function(e) {
                return "symbol" == typeof e
            }
            ,
            r.isUndefined = function(e) {
                return void 0 === e
            }
            ,
            r.isRegExp = function(e) {
                return "[object RegExp]" === t(e)
            }
            ,
            r.isObject = function(e) {
                return "object" == typeof e && null !== e
            }
            ,
            r.isDate = function(e) {
                return "[object Date]" === t(e)
            }
            ,
            r.isError = function(e) {
                return "[object Error]" === t(e) || e instanceof Error
            }
            ,
            r.isFunction = function(e) {
                return "function" == typeof e
            }
            ,
            r.isPrimitive = function(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
            }
            ,
            r.isBuffer = e.isBuffer
        }
        ).call(this, {
            isBuffer: e("../../is-buffer/index.js")
        })
    }
    , {
        "../../is-buffer/index.js": 18
    }],
    13: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            return new RegExp(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi)
        }
    }
    , {}],
    14: [function(e, t, r) {
        r.read = function(e, t, r, n, i) {
            var o, a, s = 8 * i - n - 1, f = (1 << s) - 1, u = f >> 1, l = -7, h = r ? i - 1 : 0, c = r ? -1 : 1, p = e[t + h];
            for (h += c,
            o = p & (1 << -l) - 1,
            p >>= -l,
            l += s; l > 0; o = 256 * o + e[t + h],
            h += c,
            l -= 8)
                ;
            for (a = o & (1 << -l) - 1,
            o >>= -l,
            l += n; l > 0; a = 256 * a + e[t + h],
            h += c,
            l -= 8)
                ;
            if (0 === o)
                o = 1 - u;
            else {
                if (o === f)
                    return a ? NaN : 1 / 0 * (p ? -1 : 1);
                a += Math.pow(2, n),
                o -= u
            }
            return (p ? -1 : 1) * a * Math.pow(2, o - n)
        }
        ,
        r.write = function(e, t, r, n, i, o) {
            var a, s, f, u = 8 * o - i - 1, l = (1 << u) - 1, h = l >> 1, c = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : o - 1, d = n ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t),
            isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0,
            a = l) : (a = Math.floor(Math.log(t) / Math.LN2),
            t * (f = Math.pow(2, -a)) < 1 && (a--,
            f *= 2),
            (t += a + h >= 1 ? c / f : c * Math.pow(2, 1 - h)) * f >= 2 && (a++,
            f /= 2),
            a + h >= l ? (s = 0,
            a = l) : a + h >= 1 ? (s = (t * f - 1) * Math.pow(2, i),
            a += h) : (s = t * Math.pow(2, h - 1) * Math.pow(2, i),
            a = 0)); i >= 8; e[r + p] = 255 & s,
            p += d,
            s /= 256,
            i -= 8)
                ;
            for (a = a << i | s,
            u += i; u > 0; e[r + p] = 255 & a,
            p += d,
            a /= 256,
            u -= 8)
                ;
            e[r + p - d] |= 128 * g
        }
    }
    , {}],
    15: [function(e, t, r) {
        "function" == typeof Object.create ? t.exports = function(e, t) {
            e.super_ = t,
            e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        }
        : t.exports = function(e, t) {
            e.super_ = t;
            var r = function() {};
            r.prototype = t.prototype,
            e.prototype = new r,
            e.prototype.constructor = e
        }
    }
    , {}],
    16: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            return null != e && "number" == typeof e.length && "number" == typeof e.sampleRate && "function" == typeof e.getChannelData && "number" == typeof e.duration
        }
    }
    , {}],
    17: [function(e, t, r) {
        t.exports = !0
    }
    , {}],
    18: [function(e, t, r) {
        function n(e) {
            return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
        }
        t.exports = function(e) {
            return null != e && (n(e) || function(e) {
                return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
            }(e) || !!e._isBuffer)
        }
    }
    , {}],
    19: [function(e, t, r) {
        "use strict";
        var n = e("data-uri-regex");
        t.exports = function(e) {
            return !0 === (e && n().test(e))
        }
    }
    , {
        "data-uri-regex": 13
    }],
    20: [function(e, t, r) {
        "use strict";
        var n = Object.prototype.toString;
        t.exports = function(e) {
            var t;
            return "[object Object]" === n.call(e) && (null === (t = Object.getPrototypeOf(e)) || t === Object.getPrototypeOf({}))
        }
    }
    , {}],
    21: [function(e, t, r) {
        var n = e("negative-zero");
        t.exports = function(e, t) {
            return null == e ? 0 : n(e) ? t : e <= -t ? 0 : e < 0 ? t + e % t : Math.min(t, e)
        }
    }
    , {
        "negative-zero": 22
    }],
    22: [function(e, t, r) {
        "use strict";
        t.exports = (e=>Object.is(e, -0))
    }
    , {}],
    23: [function(e, t, r) {
        "use strict";
        var n = Object.getOwnPropertySymbols
          , i = Object.prototype.hasOwnProperty
          , o = Object.prototype.propertyIsEnumerable;
        t.exports = function() {
            try {
                if (!Object.assign)
                    return !1;
                var e = new String("abc");
                if (e[5] = "de",
                "5" === Object.getOwnPropertyNames(e)[0])
                    return !1;
                for (var t = {}, r = 0; r < 10; r++)
                    t["_" + String.fromCharCode(r)] = r;
                if ("0123456789" !== Object.getOwnPropertyNames(t).map(function(e) {
                    return t[e]
                }).join(""))
                    return !1;
                var n = {};
                return "abcdefghijklmnopqrst".split("").forEach(function(e) {
                    n[e] = e
                }),
                "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, n)).join("")
            } catch (e) {
                return !1
            }
        }() ? Object.assign : function(e, t) {
            for (var r, a, s = function(e) {
                if (null === e || void 0 === e)
                    throw new TypeError("Object.assign cannot be called with null or undefined");
                return Object(e)
            }(e), f = 1; f < arguments.length; f++) {
                for (var u in r = Object(arguments[f]))
                    i.call(r, u) && (s[u] = r[u]);
                if (n) {
                    a = n(r);
                    for (var l = 0; l < a.length; l++)
                        o.call(r, a[l]) && (s[a[l]] = r[a[l]])
                }
            }
            return s
        }
    }
    , {}],
    24: [function(e, t, r) {
        r.endianness = function() {
            return "LE"
        }
        ,
        r.hostname = function() {
            return "undefined" != typeof location ? location.hostname : ""
        }
        ,
        r.loadavg = function() {
            return []
        }
        ,
        r.uptime = function() {
            return 0
        }
        ,
        r.freemem = function() {
            return Number.MAX_VALUE
        }
        ,
        r.totalmem = function() {
            return Number.MAX_VALUE
        }
        ,
        r.cpus = function() {
            return []
        }
        ,
        r.type = function() {
            return "Browser"
        }
        ,
        r.release = function() {
            return "undefined" != typeof navigator ? navigator.appVersion : ""
        }
        ,
        r.networkInterfaces = r.getNetworkInterfaces = function() {
            return {}
        }
        ,
        r.arch = function() {
            return "javascript"
        }
        ,
        r.platform = function() {
            return "browser"
        }
        ,
        r.tmpdir = r.tmpDir = function() {
            return "/tmp"
        }
        ,
        r.EOL = "\n",
        r.homedir = function() {
            return "/"
        }
    }
    , {}],
    25: [function(e, t, r) {
        (function(r) {
            "use strict";
            var n = e("to-array-buffer")
              , i = e("audio-buffer")
              , o = e("os")
              , a = e("is-audio-buffer")
              , s = {
                signed: !0,
                float: !1,
                bitDepth: 16,
                byteOrder: o.endianness instanceof Function ? o.endianness() : "LE",
                channels: 2,
                sampleRate: 44100,
                interleaved: !0,
                samplesPerFrame: 1024,
                id: "S_16_LE_2_44100_I",
                max: 32678,
                min: -32768
            }
              , f = Object.keys(s);
            function u(e) {
                var t = [];
                return t.push(e.float ? "F" : e.signed ? "S" : "U"),
                t.push(e.bitDepth),
                t.push(e.byteOrder),
                t.push(e.channels),
                t.push(e.sampleRate),
                t.push(e.interleaved ? "I" : "N"),
                t.join("_")
            }
            function l(e, t) {
                return (e.id || u(e)) === (t.id || u(t))
            }
            function h(e) {
                return e || (e = {}),
                f.forEach(function(t) {
                    null == e[t] && (e[t] = s[t])
                }),
                e.float ? (64 != e.bitDepth && (e.bitDepth = 32),
                e.signed = !0) : e.bitDepth <= 8 && (e.byteOrder = ""),
                e.float ? (e.min = -1,
                e.max = 1) : (e.max = Math.pow(2, e.bitDepth) - 1,
                e.min = 0,
                e.signed && (e.min -= Math.ceil(.5 * e.max),
                e.max -= Math.ceil(.5 * e.max))),
                e.id = u(e),
                e
            }
            function c(e, t, i) {
                if (p(t) || (t = h(t)),
                p(i) || (i = h(i)),
                l(t, i))
                    return e;
                var o, a = n(e), s = new (d(t))(a), f = new (d(i))(s);
                if (t.max !== i.max && s.forEach(function(e, r) {
                    e = (e - t.min) / (t.max - t.min) * (i.max - i.min) + i.min,
                    f[r] = Math.max(i.min, Math.min(i.max, e))
                }),
                t.interleaved != i.interleaved) {
                    var u = t.channels
                      , c = Math.floor(s.length / u);
                    t.interleaved && !i.interleaved ? f = f.map(function(e, t, r) {
                        return r[t % c * u + ~~(t / c)]
                    }) : !t.interleaved && i.interleaved && (f = f.map(function(e, t, r) {
                        return r[t % u * c + ~~(t / u)]
                    }))
                }
                if (!i.float && t.byteOrder !== i.byteOrder)
                    for (var g = "LE" === i.byteOrder, b = new DataView(f.buffer), y = i.bitDepth / 8, m = "set" + (((o = i).float ? "Float" : o.signed ? "Int" : "Uint") + o.bitDepth), v = 0, w = f.length; v < w; v++)
                        b[m](v * y, f[v], g);
                return new r(f.buffer)
            }
            function p(e) {
                return e && e.id
            }
            function d(e) {
                return p(e) || (e = h(e)),
                e.float ? e.bitDepth > 32 ? Float64Array : Float32Array : 32 === e.bitDepth ? e.signed ? Int32Array : Uint32Array : 8 === e.bitDepth ? e.signed ? Int8Array : Uint8Array : e.signed ? Int16Array : Uint16Array
            }
            function g(e) {
                return e instanceof Int8Array ? {
                    float: !1,
                    signed: !0,
                    bitDepth: 8
                } : e instanceof Uint8Array || e instanceof Uint8ClampedArray ? {
                    float: !1,
                    signed: !1,
                    bitDepth: 8
                } : e instanceof Int16Array ? {
                    float: !1,
                    signed: !0,
                    bitDepth: 16
                } : e instanceof Uint16Array ? {
                    float: !1,
                    signed: !1,
                    bitDepth: 16
                } : e instanceof Int32Array ? {
                    float: !1,
                    signed: !0,
                    bitDepth: 32
                } : e instanceof Uint32Array ? {
                    float: !1,
                    signed: !1,
                    bitDepth: 32
                } : e instanceof Float32Array ? {
                    float: !0,
                    signed: !1,
                    bitDepth: 32
                } : e instanceof Float64Array ? {
                    float: !0,
                    signed: !1,
                    bitDepth: 64
                } : {
                    float: !1,
                    signed: !1,
                    bitDepth: 8
                }
            }
            h(s),
            t.exports = {
                defaults: s,
                format: function(e) {
                    if (!e)
                        return {};
                    if ("string" == typeof e || e.id)
                        return r = e.id || e,
                        {
                            float: "F" === (n = r.split("_"))[0],
                            signed: "S" === n[0],
                            bitDepth: parseInt(n[1]),
                            byteOrder: n[2],
                            channels: parseInt(n[3]),
                            sampleRate: parseInt(n[4]),
                            interleaved: "I" === n[5]
                        };
                    if (a(e)) {
                        var t = g(e.getChannelData(0));
                        return {
                            sampleRate: e.sampleRate,
                            channels: e.numberOfChannels,
                            samplesPerFrame: e.length,
                            float: !0,
                            signed: !0,
                            bitDepth: t.bitDepth
                        }
                    }
                    return ArrayBuffer.isView(e) ? g(e) : function(e) {
                        var t = {};
                        return f.forEach(function(r) {
                            null != e[r] && (t[r] = e[r])
                        }),
                        null != e.channelCount && (t.channels = e.channelCount),
                        t
                    }(e);
                    var r, n
                },
                normalize: h,
                equal: l,
                toBuffer: function(e, t) {
                    p(t) || (t = h(t));
                    var r = n(e)
                      , i = g(e.getChannelData(0));
                    return c(r, {
                        float: !0,
                        channels: e.numberOfChannels,
                        sampleRate: e.sampleRate,
                        interleaved: !1,
                        bitDepth: i.bitDepth
                    }, t)
                },
                toAudioBuffer: function(e, t) {
                    return p(t) || (t = h(t)),
                    e = c(e, t, {
                        channels: t.channels,
                        sampleRate: t.sampleRate,
                        interleaved: !1,
                        float: !0
                    }),
                    new i(t.channels,e,t.sampleRate)
                },
                convert: c
            }
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        "audio-buffer": 4,
        buffer: 10,
        "is-audio-buffer": 16,
        os: 24,
        "to-array-buffer": 46
    }],
    26: [function(e, t, r) {
        (function(e) {
            "use strict";
            void 0 === e || !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
                nextTick: function(t, r, n, i) {
                    if ("function" != typeof t)
                        throw new TypeError('"callback" argument must be a function');
                    var o, a, s = arguments.length;
                    switch (s) {
                    case 0:
                    case 1:
                        return e.nextTick(t);
                    case 2:
                        return e.nextTick(function() {
                            t.call(null, r)
                        });
                    case 3:
                        return e.nextTick(function() {
                            t.call(null, r, n)
                        });
                    case 4:
                        return e.nextTick(function() {
                            t.call(null, r, n, i)
                        });
                    default:
                        for (o = new Array(s - 1),
                        a = 0; a < o.length; )
                            o[a++] = arguments[a];
                        return e.nextTick(function() {
                            t.apply(null, o)
                        })
                    }
                }
            } : t.exports = e
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 27
    }],
    27: [function(e, t, r) {
        var n, i, o = t.exports = {};
        function a() {
            throw new Error("setTimeout has not been defined")
        }
        function s() {
            throw new Error("clearTimeout has not been defined")
        }
        function f(e) {
            if (n === setTimeout)
                return setTimeout(e, 0);
            if ((n === a || !n) && setTimeout)
                return n = setTimeout,
                setTimeout(e, 0);
            try {
                return n(e, 0)
            } catch (t) {
                try {
                    return n.call(null, e, 0)
                } catch (t) {
                    return n.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                n = "function" == typeof setTimeout ? setTimeout : a
            } catch (e) {
                n = a
            }
            try {
                i = "function" == typeof clearTimeout ? clearTimeout : s
            } catch (e) {
                i = s
            }
        }();
        var u, l = [], h = !1, c = -1;
        function p() {
            h && u && (h = !1,
            u.length ? l = u.concat(l) : c = -1,
            l.length && d())
        }
        function d() {
            if (!h) {
                var e = f(p);
                h = !0;
                for (var t = l.length; t; ) {
                    for (u = l,
                    l = []; ++c < t; )
                        u && u[c].run();
                    c = -1,
                    t = l.length
                }
                u = null,
                h = !1,
                function(e) {
                    if (i === clearTimeout)
                        return clearTimeout(e);
                    if ((i === s || !i) && clearTimeout)
                        return i = clearTimeout,
                        clearTimeout(e);
                    try {
                        i(e)
                    } catch (t) {
                        try {
                            return i.call(null, e)
                        } catch (t) {
                            return i.call(this, e)
                        }
                    }
                }(e)
            }
        }
        function g(e, t) {
            this.fun = e,
            this.array = t
        }
        function b() {}
        o.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
            l.push(new g(e,t)),
            1 !== l.length || h || f(d)
        }
        ,
        g.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        o.title = "browser",
        o.browser = !0,
        o.env = {},
        o.argv = [],
        o.version = "",
        o.versions = {},
        o.on = b,
        o.addListener = b,
        o.once = b,
        o.off = b,
        o.removeListener = b,
        o.removeAllListeners = b,
        o.emit = b,
        o.prependListener = b,
        o.prependOnceListener = b,
        o.listeners = function(e) {
            return []
        }
        ,
        o.binding = function(e) {
            throw new Error("process.binding is not supported")
        }
        ,
        o.cwd = function() {
            return "/"
        }
        ,
        o.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }
        ,
        o.umask = function() {
            return 0
        }
    }
    , {}],
    28: [function(e, t, r) {
        var n = e("buffer")
          , i = n.Buffer;
        function o(e, t) {
            for (var r in e)
                t[r] = e[r]
        }
        function a(e, t, r) {
            return i(e, t, r)
        }
        i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r),
        r.Buffer = a),
        o(i, a),
        a.from = function(e, t, r) {
            if ("number" == typeof e)
                throw new TypeError("Argument must not be a number");
            return i(e, t, r)
        }
        ,
        a.alloc = function(e, t, r) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            var n = i(e);
            return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0),
            n
        }
        ,
        a.allocUnsafe = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return i(e)
        }
        ,
        a.allocUnsafeSlow = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return n.SlowBuffer(e)
        }
    }
    , {
        buffer: 10
    }],
    29: [function(e, t, r) {
        t.exports = i;
        var n = e("events").EventEmitter;
        function i() {
            n.call(this)
        }
        e("inherits")(i, n),
        i.Readable = e("readable-stream/readable.js"),
        i.Writable = e("readable-stream/writable.js"),
        i.Duplex = e("readable-stream/duplex.js"),
        i.Transform = e("readable-stream/transform.js"),
        i.PassThrough = e("readable-stream/passthrough.js"),
        i.Stream = i,
        i.prototype.pipe = function(e, t) {
            var r = this;
            function i(t) {
                e.writable && !1 === e.write(t) && r.pause && r.pause()
            }
            function o() {
                r.readable && r.resume && r.resume()
            }
            r.on("data", i),
            e.on("drain", o),
            e._isStdio || t && !1 === t.end || (r.on("end", s),
            r.on("close", f));
            var a = !1;
            function s() {
                a || (a = !0,
                e.end())
            }
            function f() {
                a || (a = !0,
                "function" == typeof e.destroy && e.destroy())
            }
            function u(e) {
                if (l(),
                0 === n.listenerCount(this, "error"))
                    throw e
            }
            function l() {
                r.removeListener("data", i),
                e.removeListener("drain", o),
                r.removeListener("end", s),
                r.removeListener("close", f),
                r.removeListener("error", u),
                e.removeListener("error", u),
                r.removeListener("end", l),
                r.removeListener("close", l),
                e.removeListener("close", l)
            }
            return r.on("error", u),
            e.on("error", u),
            r.on("end", l),
            r.on("close", l),
            e.on("close", l),
            e.emit("pipe", r),
            e
        }
    }
    , {
        events: 8,
        inherits: 15,
        "readable-stream/duplex.js": 31,
        "readable-stream/passthrough.js": 40,
        "readable-stream/readable.js": 41,
        "readable-stream/transform.js": 42,
        "readable-stream/writable.js": 43
    }],
    30: [function(e, t, r) {
        var n = {}.toString;
        t.exports = Array.isArray || function(e) {
            return "[object Array]" == n.call(e)
        }
    }
    , {}],
    31: [function(e, t, r) {
        t.exports = e("./lib/_stream_duplex.js")
    }
    , {
        "./lib/_stream_duplex.js": 32
    }],
    32: [function(e, t, r) {
        "use strict";
        var n = e("process-nextick-args")
          , i = Object.keys || function(e) {
            var t = [];
            for (var r in e)
                t.push(r);
            return t
        }
        ;
        t.exports = h;
        var o = e("core-util-is");
        o.inherits = e("inherits");
        var a = e("./_stream_readable")
          , s = e("./_stream_writable");
        o.inherits(h, a);
        for (var f = i(s.prototype), u = 0; u < f.length; u++) {
            var l = f[u];
            h.prototype[l] || (h.prototype[l] = s.prototype[l])
        }
        function h(e) {
            if (!(this instanceof h))
                return new h(e);
            a.call(this, e),
            s.call(this, e),
            e && !1 === e.readable && (this.readable = !1),
            e && !1 === e.writable && (this.writable = !1),
            this.allowHalfOpen = !0,
            e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1),
            this.once("end", c)
        }
        function c() {
            this.allowHalfOpen || this._writableState.ended || n.nextTick(p, this)
        }
        function p(e) {
            e.end()
        }
        Object.defineProperty(h.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function() {
                return this._writableState.highWaterMark
            }
        }),
        Object.defineProperty(h.prototype, "destroyed", {
            get: function() {
                return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
            },
            set: function(e) {
                void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e,
                this._writableState.destroyed = e)
            }
        }),
        h.prototype._destroy = function(e, t) {
            this.push(null),
            this.end(),
            n.nextTick(t, e)
        }
    }
    , {
        "./_stream_readable": 34,
        "./_stream_writable": 36,
        "core-util-is": 12,
        inherits: 15,
        "process-nextick-args": 26
    }],
    33: [function(e, t, r) {
        "use strict";
        t.exports = o;
        var n = e("./_stream_transform")
          , i = e("core-util-is");
        function o(e) {
            if (!(this instanceof o))
                return new o(e);
            n.call(this, e)
        }
        i.inherits = e("inherits"),
        i.inherits(o, n),
        o.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }
    , {
        "./_stream_transform": 35,
        "core-util-is": 12,
        inherits: 15
    }],
    34: [function(e, t, r) {
        (function(r, n) {
            "use strict";
            var i = e("process-nextick-args");
            t.exports = v;
            var o, a = e("isarray");
            v.ReadableState = m;
            e("events").EventEmitter;
            var s = function(e, t) {
                return e.listeners(t).length
            }
              , f = e("./internal/streams/stream")
              , u = e("safe-buffer").Buffer
              , l = n.Uint8Array || function() {}
            ;
            var h = e("core-util-is");
            h.inherits = e("inherits");
            var c = e("util")
              , p = void 0;
            p = c && c.debuglog ? c.debuglog("stream") : function() {}
            ;
            var d, g = e("./internal/streams/BufferList"), b = e("./internal/streams/destroy");
            h.inherits(v, f);
            var y = ["error", "close", "destroy", "pause", "resume"];
            function m(t, r) {
                o = o || e("./_stream_duplex"),
                t = t || {};
                var n = r instanceof o;
                this.objectMode = !!t.objectMode,
                n && (this.objectMode = this.objectMode || !!t.readableObjectMode);
                var i = t.highWaterMark
                  , a = t.readableHighWaterMark
                  , s = this.objectMode ? 16 : 16384;
                this.highWaterMark = i || 0 === i ? i : n && (a || 0 === a) ? a : s,
                this.highWaterMark = Math.floor(this.highWaterMark),
                this.buffer = new g,
                this.length = 0,
                this.pipes = null,
                this.pipesCount = 0,
                this.flowing = null,
                this.ended = !1,
                this.endEmitted = !1,
                this.reading = !1,
                this.sync = !0,
                this.needReadable = !1,
                this.emittedReadable = !1,
                this.readableListening = !1,
                this.resumeScheduled = !1,
                this.destroyed = !1,
                this.defaultEncoding = t.defaultEncoding || "utf8",
                this.awaitDrain = 0,
                this.readingMore = !1,
                this.decoder = null,
                this.encoding = null,
                t.encoding && (d || (d = e("string_decoder/").StringDecoder),
                this.decoder = new d(t.encoding),
                this.encoding = t.encoding)
            }
            function v(t) {
                if (o = o || e("./_stream_duplex"),
                !(this instanceof v))
                    return new v(t);
                this._readableState = new m(t,this),
                this.readable = !0,
                t && ("function" == typeof t.read && (this._read = t.read),
                "function" == typeof t.destroy && (this._destroy = t.destroy)),
                f.call(this)
            }
            function w(e, t, r, n, i) {
                var o, a = e._readableState;
                null === t ? (a.reading = !1,
                function(e, t) {
                    if (t.ended)
                        return;
                    if (t.decoder) {
                        var r = t.decoder.end();
                        r && r.length && (t.buffer.push(r),
                        t.length += t.objectMode ? 1 : r.length)
                    }
                    t.ended = !0,
                    A(e)
                }(e, a)) : (i || (o = function(e, t) {
                    var r;
                    n = t,
                    u.isBuffer(n) || n instanceof l || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
                    var n;
                    return r
                }(a, t)),
                o ? e.emit("error", o) : a.objectMode || t && t.length > 0 ? ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === u.prototype || (t = function(e) {
                    return u.from(e)
                }(t)),
                n ? a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : _(e, a, t, !0) : a.ended ? e.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1,
                a.decoder && !r ? (t = a.decoder.write(t),
                a.objectMode || 0 !== t.length ? _(e, a, t, !1) : O(e, a)) : _(e, a, t, !1))) : n || (a.reading = !1));
                return function(e) {
                    return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
                }(a)
            }
            function _(e, t, r, n) {
                t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r),
                e.read(0)) : (t.length += t.objectMode ? 1 : r.length,
                n ? t.buffer.unshift(r) : t.buffer.push(r),
                t.needReadable && A(e)),
                O(e, t)
            }
            Object.defineProperty(v.prototype, "destroyed", {
                get: function() {
                    return void 0 !== this._readableState && this._readableState.destroyed
                },
                set: function(e) {
                    this._readableState && (this._readableState.destroyed = e)
                }
            }),
            v.prototype.destroy = b.destroy,
            v.prototype._undestroy = b.undestroy,
            v.prototype._destroy = function(e, t) {
                this.push(null),
                t(e)
            }
            ,
            v.prototype.push = function(e, t) {
                var r, n = this._readableState;
                return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = u.from(e, t),
                t = ""),
                r = !0),
                w(this, e, t, !1, r)
            }
            ,
            v.prototype.unshift = function(e) {
                return w(this, e, null, !0, !1)
            }
            ,
            v.prototype.isPaused = function() {
                return !1 === this._readableState.flowing
            }
            ,
            v.prototype.setEncoding = function(t) {
                return d || (d = e("string_decoder/").StringDecoder),
                this._readableState.decoder = new d(t),
                this._readableState.encoding = t,
                this
            }
            ;
            var C = 8388608;
            function x(e, t) {
                return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                    return e >= C ? e = C : (e--,
                    e |= e >>> 1,
                    e |= e >>> 2,
                    e |= e >>> 4,
                    e |= e >>> 8,
                    e |= e >>> 16,
                    e++),
                    e
                }(e)),
                e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0,
                0))
            }
            function A(e) {
                var t = e._readableState;
                t.needReadable = !1,
                t.emittedReadable || (p("emitReadable", t.flowing),
                t.emittedReadable = !0,
                t.sync ? i.nextTick(E, e) : E(e))
            }
            function E(e) {
                p("emit readable"),
                e.emit("readable"),
                R(e)
            }
            function O(e, t) {
                t.readingMore || (t.readingMore = !0,
                i.nextTick(S, e, t))
            }
            function S(e, t) {
                for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (p("maybeReadMore read 0"),
                e.read(0),
                r !== t.length); )
                    r = t.length;
                t.readingMore = !1
            }
            function T(e) {
                p("readable nexttick read 0"),
                e.read(0)
            }
            function k(e, t) {
                t.reading || (p("resume read 0"),
                e.read(0)),
                t.resumeScheduled = !1,
                t.awaitDrain = 0,
                e.emit("resume"),
                R(e),
                t.flowing && !t.reading && e.read(0)
            }
            function R(e) {
                var t = e._readableState;
                for (p("flow", t.flowing); t.flowing && null !== e.read(); )
                    ;
            }
            function M(e, t) {
                return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length),
                t.buffer.clear()) : r = function(e, t, r) {
                    var n;
                    e < t.head.data.length ? (n = t.head.data.slice(0, e),
                    t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function(e, t) {
                        var r = t.head
                          , n = 1
                          , i = r.data;
                        e -= i.length;
                        for (; r = r.next; ) {
                            var o = r.data
                              , a = e > o.length ? o.length : e;
                            if (a === o.length ? i += o : i += o.slice(0, e),
                            0 === (e -= a)) {
                                a === o.length ? (++n,
                                r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r,
                                r.data = o.slice(a));
                                break
                            }
                            ++n
                        }
                        return t.length -= n,
                        i
                    }(e, t) : function(e, t) {
                        var r = u.allocUnsafe(e)
                          , n = t.head
                          , i = 1;
                        n.data.copy(r),
                        e -= n.data.length;
                        for (; n = n.next; ) {
                            var o = n.data
                              , a = e > o.length ? o.length : e;
                            if (o.copy(r, r.length - e, 0, a),
                            0 === (e -= a)) {
                                a === o.length ? (++i,
                                n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n,
                                n.data = o.slice(a));
                                break
                            }
                            ++i
                        }
                        return t.length -= i,
                        r
                    }(e, t);
                    return n
                }(e, t.buffer, t.decoder),
                r);
                var r
            }
            function j(e) {
                var t = e._readableState;
                if (t.length > 0)
                    throw new Error('"endReadable()" called on non-empty stream');
                t.endEmitted || (t.ended = !0,
                i.nextTick(B, t, e))
            }
            function B(e, t) {
                e.endEmitted || 0 !== e.length || (e.endEmitted = !0,
                t.readable = !1,
                t.emit("end"))
            }
            function L(e, t) {
                for (var r = 0, n = e.length; r < n; r++)
                    if (e[r] === t)
                        return r;
                return -1
            }
            v.prototype.read = function(e) {
                p("read", e),
                e = parseInt(e, 10);
                var t = this._readableState
                  , r = e;
                if (0 !== e && (t.emittedReadable = !1),
                0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended))
                    return p("read: emitReadable", t.length, t.ended),
                    0 === t.length && t.ended ? j(this) : A(this),
                    null;
                if (0 === (e = x(e, t)) && t.ended)
                    return 0 === t.length && j(this),
                    null;
                var n, i = t.needReadable;
                return p("need readable", i),
                (0 === t.length || t.length - e < t.highWaterMark) && p("length less than watermark", i = !0),
                t.ended || t.reading ? p("reading or ended", i = !1) : i && (p("do read"),
                t.reading = !0,
                t.sync = !0,
                0 === t.length && (t.needReadable = !0),
                this._read(t.highWaterMark),
                t.sync = !1,
                t.reading || (e = x(r, t))),
                null === (n = e > 0 ? M(e, t) : null) ? (t.needReadable = !0,
                e = 0) : t.length -= e,
                0 === t.length && (t.ended || (t.needReadable = !0),
                r !== e && t.ended && j(this)),
                null !== n && this.emit("data", n),
                n
            }
            ,
            v.prototype._read = function(e) {
                this.emit("error", new Error("_read() is not implemented"))
            }
            ,
            v.prototype.pipe = function(e, t) {
                var n = this
                  , o = this._readableState;
                switch (o.pipesCount) {
                case 0:
                    o.pipes = e;
                    break;
                case 1:
                    o.pipes = [o.pipes, e];
                    break;
                default:
                    o.pipes.push(e)
                }
                o.pipesCount += 1,
                p("pipe count=%d opts=%j", o.pipesCount, t);
                var f = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? l : v;
                function u(t, r) {
                    p("onunpipe"),
                    t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0,
                    p("cleanup"),
                    e.removeListener("close", y),
                    e.removeListener("finish", m),
                    e.removeListener("drain", h),
                    e.removeListener("error", b),
                    e.removeListener("unpipe", u),
                    n.removeListener("end", l),
                    n.removeListener("end", v),
                    n.removeListener("data", g),
                    c = !0,
                    !o.awaitDrain || e._writableState && !e._writableState.needDrain || h())
                }
                function l() {
                    p("onend"),
                    e.end()
                }
                o.endEmitted ? i.nextTick(f) : n.once("end", f),
                e.on("unpipe", u);
                var h = function(e) {
                    return function() {
                        var t = e._readableState;
                        p("pipeOnDrain", t.awaitDrain),
                        t.awaitDrain && t.awaitDrain--,
                        0 === t.awaitDrain && s(e, "data") && (t.flowing = !0,
                        R(e))
                    }
                }(n);
                e.on("drain", h);
                var c = !1;
                var d = !1;
                function g(t) {
                    p("ondata"),
                    d = !1,
                    !1 !== e.write(t) || d || ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== L(o.pipes, e)) && !c && (p("false write response, pause", n._readableState.awaitDrain),
                    n._readableState.awaitDrain++,
                    d = !0),
                    n.pause())
                }
                function b(t) {
                    p("onerror", t),
                    v(),
                    e.removeListener("error", b),
                    0 === s(e, "error") && e.emit("error", t)
                }
                function y() {
                    e.removeListener("finish", m),
                    v()
                }
                function m() {
                    p("onfinish"),
                    e.removeListener("close", y),
                    v()
                }
                function v() {
                    p("unpipe"),
                    n.unpipe(e)
                }
                return n.on("data", g),
                function(e, t, r) {
                    if ("function" == typeof e.prependListener)
                        return e.prependListener(t, r);
                    e._events && e._events[t] ? a(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
                }(e, "error", b),
                e.once("close", y),
                e.once("finish", m),
                e.emit("pipe", n),
                o.flowing || (p("pipe resume"),
                n.resume()),
                e
            }
            ,
            v.prototype.unpipe = function(e) {
                var t = this._readableState
                  , r = {
                    hasUnpiped: !1
                };
                if (0 === t.pipesCount)
                    return this;
                if (1 === t.pipesCount)
                    return e && e !== t.pipes ? this : (e || (e = t.pipes),
                    t.pipes = null,
                    t.pipesCount = 0,
                    t.flowing = !1,
                    e && e.emit("unpipe", this, r),
                    this);
                if (!e) {
                    var n = t.pipes
                      , i = t.pipesCount;
                    t.pipes = null,
                    t.pipesCount = 0,
                    t.flowing = !1;
                    for (var o = 0; o < i; o++)
                        n[o].emit("unpipe", this, r);
                    return this
                }
                var a = L(t.pipes, e);
                return -1 === a ? this : (t.pipes.splice(a, 1),
                t.pipesCount -= 1,
                1 === t.pipesCount && (t.pipes = t.pipes[0]),
                e.emit("unpipe", this, r),
                this)
            }
            ,
            v.prototype.on = function(e, t) {
                var r = f.prototype.on.call(this, e, t);
                if ("data" === e)
                    !1 !== this._readableState.flowing && this.resume();
                else if ("readable" === e) {
                    var n = this._readableState;
                    n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0,
                    n.emittedReadable = !1,
                    n.reading ? n.length && A(this) : i.nextTick(T, this))
                }
                return r
            }
            ,
            v.prototype.addListener = v.prototype.on,
            v.prototype.resume = function() {
                var e = this._readableState;
                return e.flowing || (p("resume"),
                e.flowing = !0,
                function(e, t) {
                    t.resumeScheduled || (t.resumeScheduled = !0,
                    i.nextTick(k, e, t))
                }(this, e)),
                this
            }
            ,
            v.prototype.pause = function() {
                return p("call pause flowing=%j", this._readableState.flowing),
                !1 !== this._readableState.flowing && (p("pause"),
                this._readableState.flowing = !1,
                this.emit("pause")),
                this
            }
            ,
            v.prototype.wrap = function(e) {
                var t = this
                  , r = this._readableState
                  , n = !1;
                for (var i in e.on("end", function() {
                    if (p("wrapped end"),
                    r.decoder && !r.ended) {
                        var e = r.decoder.end();
                        e && e.length && t.push(e)
                    }
                    t.push(null)
                }),
                e.on("data", function(i) {
                    (p("wrapped data"),
                    r.decoder && (i = r.decoder.write(i)),
                    !r.objectMode || null !== i && void 0 !== i) && ((r.objectMode || i && i.length) && (t.push(i) || (n = !0,
                    e.pause())))
                }),
                e)
                    void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
                        return function() {
                            return e[t].apply(e, arguments)
                        }
                    }(i));
                for (var o = 0; o < y.length; o++)
                    e.on(y[o], this.emit.bind(this, y[o]));
                return this._read = function(t) {
                    p("wrapped _read", t),
                    n && (n = !1,
                    e.resume())
                }
                ,
                this
            }
            ,
            Object.defineProperty(v.prototype, "readableHighWaterMark", {
                enumerable: !1,
                get: function() {
                    return this._readableState.highWaterMark
                }
            }),
            v._fromList = M
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "./_stream_duplex": 32,
        "./internal/streams/BufferList": 37,
        "./internal/streams/destroy": 38,
        "./internal/streams/stream": 39,
        _process: 27,
        "core-util-is": 12,
        events: 8,
        inherits: 15,
        isarray: 30,
        "process-nextick-args": 26,
        "safe-buffer": 28,
        "string_decoder/": 44,
        util: 7
    }],
    35: [function(e, t, r) {
        "use strict";
        t.exports = o;
        var n = e("./_stream_duplex")
          , i = e("core-util-is");
        function o(e) {
            if (!(this instanceof o))
                return new o(e);
            n.call(this, e),
            this._transformState = {
                afterTransform: function(e, t) {
                    var r = this._transformState;
                    r.transforming = !1;
                    var n = r.writecb;
                    if (!n)
                        return this.emit("error", new Error("write callback called multiple times"));
                    r.writechunk = null,
                    r.writecb = null,
                    null != t && this.push(t),
                    n(e);
                    var i = this._readableState;
                    i.reading = !1,
                    (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
                }
                .bind(this),
                needTransform: !1,
                transforming: !1,
                writecb: null,
                writechunk: null,
                writeencoding: null
            },
            this._readableState.needReadable = !0,
            this._readableState.sync = !1,
            e && ("function" == typeof e.transform && (this._transform = e.transform),
            "function" == typeof e.flush && (this._flush = e.flush)),
            this.on("prefinish", a)
        }
        function a() {
            var e = this;
            "function" == typeof this._flush ? this._flush(function(t, r) {
                s(e, t, r)
            }) : s(this, null, null)
        }
        function s(e, t, r) {
            if (t)
                return e.emit("error", t);
            if (null != r && e.push(r),
            e._writableState.length)
                throw new Error("Calling transform done when ws.length != 0");
            if (e._transformState.transforming)
                throw new Error("Calling transform done when still transforming");
            return e.push(null)
        }
        i.inherits = e("inherits"),
        i.inherits(o, n),
        o.prototype.push = function(e, t) {
            return this._transformState.needTransform = !1,
            n.prototype.push.call(this, e, t)
        }
        ,
        o.prototype._transform = function(e, t, r) {
            throw new Error("_transform() is not implemented")
        }
        ,
        o.prototype._write = function(e, t, r) {
            var n = this._transformState;
            if (n.writecb = r,
            n.writechunk = e,
            n.writeencoding = t,
            !n.transforming) {
                var i = this._readableState;
                (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
            }
        }
        ,
        o.prototype._read = function(e) {
            var t = this._transformState;
            null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0,
            this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0
        }
        ,
        o.prototype._destroy = function(e, t) {
            var r = this;
            n.prototype._destroy.call(this, e, function(e) {
                t(e),
                r.emit("close")
            })
        }
    }
    , {
        "./_stream_duplex": 32,
        "core-util-is": 12,
        inherits: 15
    }],
    36: [function(e, t, r) {
        (function(r, n, i) {
            "use strict";
            var o = e("process-nextick-args");
            function a(e) {
                var t = this;
                this.next = null,
                this.entry = null,
                this.finish = function() {
                    !function(e, t, r) {
                        var n = e.entry;
                        e.entry = null;
                        for (; n; ) {
                            var i = n.callback;
                            t.pendingcb--,
                            i(r),
                            n = n.next
                        }
                        t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e
                    }(t, e)
                }
            }
            t.exports = m;
            var s, f = !r.browser && ["v0.10", "v0.9."].indexOf(r.version.slice(0, 5)) > -1 ? i : o.nextTick;
            m.WritableState = y;
            var u = e("core-util-is");
            u.inherits = e("inherits");
            var l = {
                deprecate: e("util-deprecate")
            }
              , h = e("./internal/streams/stream")
              , c = e("safe-buffer").Buffer
              , p = n.Uint8Array || function() {}
            ;
            var d, g = e("./internal/streams/destroy");
            function b() {}
            function y(t, r) {
                s = s || e("./_stream_duplex"),
                t = t || {};
                var n = r instanceof s;
                this.objectMode = !!t.objectMode,
                n && (this.objectMode = this.objectMode || !!t.writableObjectMode);
                var i = t.highWaterMark
                  , u = t.writableHighWaterMark
                  , l = this.objectMode ? 16 : 16384;
                this.highWaterMark = i || 0 === i ? i : n && (u || 0 === u) ? u : l,
                this.highWaterMark = Math.floor(this.highWaterMark),
                this.finalCalled = !1,
                this.needDrain = !1,
                this.ending = !1,
                this.ended = !1,
                this.finished = !1,
                this.destroyed = !1;
                var h = !1 === t.decodeStrings;
                this.decodeStrings = !h,
                this.defaultEncoding = t.defaultEncoding || "utf8",
                this.length = 0,
                this.writing = !1,
                this.corked = 0,
                this.sync = !0,
                this.bufferProcessing = !1,
                this.onwrite = function(e) {
                    !function(e, t) {
                        var r = e._writableState
                          , n = r.sync
                          , i = r.writecb;
                        if (function(e) {
                            e.writing = !1,
                            e.writecb = null,
                            e.length -= e.writelen,
                            e.writelen = 0
                        }(r),
                        t)
                            !function(e, t, r, n, i) {
                                --t.pendingcb,
                                r ? (o.nextTick(i, n),
                                o.nextTick(A, e, t),
                                e._writableState.errorEmitted = !0,
                                e.emit("error", n)) : (i(n),
                                e._writableState.errorEmitted = !0,
                                e.emit("error", n),
                                A(e, t))
                            }(e, r, n, t, i);
                        else {
                            var a = C(r);
                            a || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r),
                            n ? f(w, e, r, a, i) : w(e, r, a, i)
                        }
                    }(r, e)
                }
                ,
                this.writecb = null,
                this.writelen = 0,
                this.bufferedRequest = null,
                this.lastBufferedRequest = null,
                this.pendingcb = 0,
                this.prefinished = !1,
                this.errorEmitted = !1,
                this.bufferedRequestCount = 0,
                this.corkedRequestsFree = new a(this)
            }
            function m(t) {
                if (s = s || e("./_stream_duplex"),
                !(d.call(m, this) || this instanceof s))
                    return new m(t);
                this._writableState = new y(t,this),
                this.writable = !0,
                t && ("function" == typeof t.write && (this._write = t.write),
                "function" == typeof t.writev && (this._writev = t.writev),
                "function" == typeof t.destroy && (this._destroy = t.destroy),
                "function" == typeof t.final && (this._final = t.final)),
                h.call(this)
            }
            function v(e, t, r, n, i, o, a) {
                t.writelen = n,
                t.writecb = a,
                t.writing = !0,
                t.sync = !0,
                r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite),
                t.sync = !1
            }
            function w(e, t, r, n) {
                r || function(e, t) {
                    0 === t.length && t.needDrain && (t.needDrain = !1,
                    e.emit("drain"))
                }(e, t),
                t.pendingcb--,
                n(),
                A(e, t)
            }
            function _(e, t) {
                t.bufferProcessing = !0;
                var r = t.bufferedRequest;
                if (e._writev && r && r.next) {
                    var n = t.bufferedRequestCount
                      , i = new Array(n)
                      , o = t.corkedRequestsFree;
                    o.entry = r;
                    for (var s = 0, f = !0; r; )
                        i[s] = r,
                        r.isBuf || (f = !1),
                        r = r.next,
                        s += 1;
                    i.allBuffers = f,
                    v(e, t, !0, t.length, i, "", o.finish),
                    t.pendingcb++,
                    t.lastBufferedRequest = null,
                    o.next ? (t.corkedRequestsFree = o.next,
                    o.next = null) : t.corkedRequestsFree = new a(t),
                    t.bufferedRequestCount = 0
                } else {
                    for (; r; ) {
                        var u = r.chunk
                          , l = r.encoding
                          , h = r.callback;
                        if (v(e, t, !1, t.objectMode ? 1 : u.length, u, l, h),
                        r = r.next,
                        t.bufferedRequestCount--,
                        t.writing)
                            break
                    }
                    null === r && (t.lastBufferedRequest = null)
                }
                t.bufferedRequest = r,
                t.bufferProcessing = !1
            }
            function C(e) {
                return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
            }
            function x(e, t) {
                e._final(function(r) {
                    t.pendingcb--,
                    r && e.emit("error", r),
                    t.prefinished = !0,
                    e.emit("prefinish"),
                    A(e, t)
                })
            }
            function A(e, t) {
                var r = C(t);
                return r && (!function(e, t) {
                    t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++,
                    t.finalCalled = !0,
                    o.nextTick(x, e, t)) : (t.prefinished = !0,
                    e.emit("prefinish")))
                }(e, t),
                0 === t.pendingcb && (t.finished = !0,
                e.emit("finish"))),
                r
            }
            u.inherits(m, h),
            y.prototype.getBuffer = function() {
                for (var e = this.bufferedRequest, t = []; e; )
                    t.push(e),
                    e = e.next;
                return t
            }
            ,
            function() {
                try {
                    Object.defineProperty(y.prototype, "buffer", {
                        get: l.deprecate(function() {
                            return this.getBuffer()
                        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                    })
                } catch (e) {}
            }(),
            "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (d = Function.prototype[Symbol.hasInstance],
            Object.defineProperty(m, Symbol.hasInstance, {
                value: function(e) {
                    return !!d.call(this, e) || this === m && (e && e._writableState instanceof y)
                }
            })) : d = function(e) {
                return e instanceof this
            }
            ,
            m.prototype.pipe = function() {
                this.emit("error", new Error("Cannot pipe, not readable"))
            }
            ,
            m.prototype.write = function(e, t, r) {
                var n, i = this._writableState, a = !1, s = !i.objectMode && (n = e,
                c.isBuffer(n) || n instanceof p);
                return s && !c.isBuffer(e) && (e = function(e) {
                    return c.from(e)
                }(e)),
                "function" == typeof t && (r = t,
                t = null),
                s ? t = "buffer" : t || (t = i.defaultEncoding),
                "function" != typeof r && (r = b),
                i.ended ? function(e, t) {
                    var r = new Error("write after end");
                    e.emit("error", r),
                    o.nextTick(t, r)
                }(this, r) : (s || function(e, t, r, n) {
                    var i = !0
                      , a = !1;
                    return null === r ? a = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (a = new TypeError("Invalid non-string/buffer chunk")),
                    a && (e.emit("error", a),
                    o.nextTick(n, a),
                    i = !1),
                    i
                }(this, i, e, r)) && (i.pendingcb++,
                a = function(e, t, r, n, i, o) {
                    if (!r) {
                        var a = function(e, t, r) {
                            e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = c.from(t, r));
                            return t
                        }(t, n, i);
                        n !== a && (r = !0,
                        i = "buffer",
                        n = a)
                    }
                    var s = t.objectMode ? 1 : n.length;
                    t.length += s;
                    var f = t.length < t.highWaterMark;
                    f || (t.needDrain = !0);
                    if (t.writing || t.corked) {
                        var u = t.lastBufferedRequest;
                        t.lastBufferedRequest = {
                            chunk: n,
                            encoding: i,
                            isBuf: r,
                            callback: o,
                            next: null
                        },
                        u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest,
                        t.bufferedRequestCount += 1
                    } else
                        v(e, t, !1, s, n, i, o);
                    return f
                }(this, i, s, e, t, r)),
                a
            }
            ,
            m.prototype.cork = function() {
                this._writableState.corked++
            }
            ,
            m.prototype.uncork = function() {
                var e = this._writableState;
                e.corked && (e.corked--,
                e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e))
            }
            ,
            m.prototype.setDefaultEncoding = function(e) {
                if ("string" == typeof e && (e = e.toLowerCase()),
                !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                    throw new TypeError("Unknown encoding: " + e);
                return this._writableState.defaultEncoding = e,
                this
            }
            ,
            Object.defineProperty(m.prototype, "writableHighWaterMark", {
                enumerable: !1,
                get: function() {
                    return this._writableState.highWaterMark
                }
            }),
            m.prototype._write = function(e, t, r) {
                r(new Error("_write() is not implemented"))
            }
            ,
            m.prototype._writev = null,
            m.prototype.end = function(e, t, r) {
                var n = this._writableState;
                "function" == typeof e ? (r = e,
                e = null,
                t = null) : "function" == typeof t && (r = t,
                t = null),
                null !== e && void 0 !== e && this.write(e, t),
                n.corked && (n.corked = 1,
                this.uncork()),
                n.ending || n.finished || function(e, t, r) {
                    t.ending = !0,
                    A(e, t),
                    r && (t.finished ? o.nextTick(r) : e.once("finish", r));
                    t.ended = !0,
                    e.writable = !1
                }(this, n, r)
            }
            ,
            Object.defineProperty(m.prototype, "destroyed", {
                get: function() {
                    return void 0 !== this._writableState && this._writableState.destroyed
                },
                set: function(e) {
                    this._writableState && (this._writableState.destroyed = e)
                }
            }),
            m.prototype.destroy = g.destroy,
            m.prototype._undestroy = g.undestroy,
            m.prototype._destroy = function(e, t) {
                this.end(),
                t(e)
            }
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("timers").setImmediate)
    }
    , {
        "./_stream_duplex": 32,
        "./internal/streams/destroy": 38,
        "./internal/streams/stream": 39,
        _process: 27,
        "core-util-is": 12,
        inherits: 15,
        "process-nextick-args": 26,
        "safe-buffer": 28,
        timers: 45,
        "util-deprecate": 48
    }],
    37: [function(e, t, r) {
        "use strict";
        var n = e("safe-buffer").Buffer
          , i = e("util");
        t.exports = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.head = null,
                this.tail = null,
                this.length = 0
            }
            return e.prototype.push = function(e) {
                var t = {
                    data: e,
                    next: null
                };
                this.length > 0 ? this.tail.next = t : this.head = t,
                this.tail = t,
                ++this.length
            }
            ,
            e.prototype.unshift = function(e) {
                var t = {
                    data: e,
                    next: this.head
                };
                0 === this.length && (this.tail = t),
                this.head = t,
                ++this.length
            }
            ,
            e.prototype.shift = function() {
                if (0 !== this.length) {
                    var e = this.head.data;
                    return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next,
                    --this.length,
                    e
                }
            }
            ,
            e.prototype.clear = function() {
                this.head = this.tail = null,
                this.length = 0
            }
            ,
            e.prototype.join = function(e) {
                if (0 === this.length)
                    return "";
                for (var t = this.head, r = "" + t.data; t = t.next; )
                    r += e + t.data;
                return r
            }
            ,
            e.prototype.concat = function(e) {
                if (0 === this.length)
                    return n.alloc(0);
                if (1 === this.length)
                    return this.head.data;
                for (var t, r, i, o = n.allocUnsafe(e >>> 0), a = this.head, s = 0; a; )
                    t = a.data,
                    r = o,
                    i = s,
                    t.copy(r, i),
                    s += a.data.length,
                    a = a.next;
                return o
            }
            ,
            e
        }(),
        i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function() {
            var e = i.inspect({
                length: this.length
            });
            return this.constructor.name + " " + e
        }
        )
    }
    , {
        "safe-buffer": 28,
        util: 7
    }],
    38: [function(e, t, r) {
        "use strict";
        var n = e("process-nextick-args");
        function i(e, t) {
            e.emit("error", t)
        }
        t.exports = {
            destroy: function(e, t) {
                var r = this
                  , o = this._readableState && this._readableState.destroyed
                  , a = this._writableState && this._writableState.destroyed;
                return o || a ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, e),
                this) : (this._readableState && (this._readableState.destroyed = !0),
                this._writableState && (this._writableState.destroyed = !0),
                this._destroy(e || null, function(e) {
                    !t && e ? (n.nextTick(i, r, e),
                    r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e)
                }),
                this)
            },
            undestroy: function() {
                this._readableState && (this._readableState.destroyed = !1,
                this._readableState.reading = !1,
                this._readableState.ended = !1,
                this._readableState.endEmitted = !1),
                this._writableState && (this._writableState.destroyed = !1,
                this._writableState.ended = !1,
                this._writableState.ending = !1,
                this._writableState.finished = !1,
                this._writableState.errorEmitted = !1)
            }
        }
    }
    , {
        "process-nextick-args": 26
    }],
    39: [function(e, t, r) {
        t.exports = e("events").EventEmitter
    }
    , {
        events: 8
    }],
    40: [function(e, t, r) {
        t.exports = e("./readable").PassThrough
    }
    , {
        "./readable": 41
    }],
    41: [function(e, t, r) {
        (r = t.exports = e("./lib/_stream_readable.js")).Stream = r,
        r.Readable = r,
        r.Writable = e("./lib/_stream_writable.js"),
        r.Duplex = e("./lib/_stream_duplex.js"),
        r.Transform = e("./lib/_stream_transform.js"),
        r.PassThrough = e("./lib/_stream_passthrough.js")
    }
    , {
        "./lib/_stream_duplex.js": 32,
        "./lib/_stream_passthrough.js": 33,
        "./lib/_stream_readable.js": 34,
        "./lib/_stream_transform.js": 35,
        "./lib/_stream_writable.js": 36
    }],
    42: [function(e, t, r) {
        t.exports = e("./readable").Transform
    }
    , {
        "./readable": 41
    }],
    43: [function(e, t, r) {
        t.exports = e("./lib/_stream_writable.js")
    }
    , {
        "./lib/_stream_writable.js": 36
    }],
    44: [function(e, t, r) {
        "use strict";
        var n = e("safe-buffer").Buffer
          , i = n.isEncoding || function(e) {
            switch ((e = "" + e) && e.toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
                return !0;
            default:
                return !1
            }
        }
        ;
        function o(e) {
            var t;
            switch (this.encoding = function(e) {
                var t = function(e) {
                    if (!e)
                        return "utf8";
                    for (var t; ; )
                        switch (e) {
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return e;
                        default:
                            if (t)
                                return;
                            e = ("" + e).toLowerCase(),
                            t = !0
                        }
                }(e);
                if ("string" != typeof t && (n.isEncoding === i || !i(e)))
                    throw new Error("Unknown encoding: " + e);
                return t || e
            }(e),
            this.encoding) {
            case "utf16le":
                this.text = f,
                this.end = u,
                t = 4;
                break;
            case "utf8":
                this.fillLast = s,
                t = 4;
                break;
            case "base64":
                this.text = l,
                this.end = h,
                t = 3;
                break;
            default:
                return this.write = c,
                void (this.end = p)
            }
            this.lastNeed = 0,
            this.lastTotal = 0,
            this.lastChar = n.allocUnsafe(t)
        }
        function a(e) {
            return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2
        }
        function s(e) {
            var t = this.lastTotal - this.lastNeed
              , r = function(e, t, r) {
                if (128 != (192 & t[0]))
                    return e.lastNeed = 0,
                    "�";
                if (e.lastNeed > 1 && t.length > 1) {
                    if (128 != (192 & t[1]))
                        return e.lastNeed = 1,
                        "�";
                    if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2]))
                        return e.lastNeed = 2,
                        "�"
                }
            }(this, e);
            return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed),
            this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length),
            void (this.lastNeed -= e.length))
        }
        function f(e, t) {
            if ((e.length - t) % 2 == 0) {
                var r = e.toString("utf16le", t);
                if (r) {
                    var n = r.charCodeAt(r.length - 1);
                    if (n >= 55296 && n <= 56319)
                        return this.lastNeed = 2,
                        this.lastTotal = 4,
                        this.lastChar[0] = e[e.length - 2],
                        this.lastChar[1] = e[e.length - 1],
                        r.slice(0, -1)
                }
                return r
            }
            return this.lastNeed = 1,
            this.lastTotal = 2,
            this.lastChar[0] = e[e.length - 1],
            e.toString("utf16le", t, e.length - 1)
        }
        function u(e) {
            var t = e && e.length ? this.write(e) : "";
            if (this.lastNeed) {
                var r = this.lastTotal - this.lastNeed;
                return t + this.lastChar.toString("utf16le", 0, r)
            }
            return t
        }
        function l(e, t) {
            var r = (e.length - t) % 3;
            return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r,
            this.lastTotal = 3,
            1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2],
            this.lastChar[1] = e[e.length - 1]),
            e.toString("base64", t, e.length - r))
        }
        function h(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
        }
        function c(e) {
            return e.toString(this.encoding)
        }
        function p(e) {
            return e && e.length ? this.write(e) : ""
        }
        r.StringDecoder = o,
        o.prototype.write = function(e) {
            if (0 === e.length)
                return "";
            var t, r;
            if (this.lastNeed) {
                if (void 0 === (t = this.fillLast(e)))
                    return "";
                r = this.lastNeed,
                this.lastNeed = 0
            } else
                r = 0;
            return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""
        }
        ,
        o.prototype.end = function(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + "�" : t
        }
        ,
        o.prototype.text = function(e, t) {
            var r = function(e, t, r) {
                var n = t.length - 1;
                if (n < r)
                    return 0;
                var i = a(t[n]);
                if (i >= 0)
                    return i > 0 && (e.lastNeed = i - 1),
                    i;
                if (--n < r || -2 === i)
                    return 0;
                if ((i = a(t[n])) >= 0)
                    return i > 0 && (e.lastNeed = i - 2),
                    i;
                if (--n < r || -2 === i)
                    return 0;
                if ((i = a(t[n])) >= 0)
                    return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3),
                    i;
                return 0
            }(this, e, t);
            if (!this.lastNeed)
                return e.toString("utf8", t);
            this.lastTotal = r;
            var n = e.length - (r - this.lastNeed);
            return e.copy(this.lastChar, 0, n),
            e.toString("utf8", t, n)
        }
        ,
        o.prototype.fillLast = function(e) {
            if (this.lastNeed <= e.length)
                return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
                this.lastChar.toString(this.encoding, 0, this.lastTotal);
            e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
            this.lastNeed -= e.length
        }
    }
    , {
        "safe-buffer": 28
    }],
    45: [function(e, t, r) {
        (function(t, n) {
            var i = e("process/browser.js").nextTick
              , o = Function.prototype.apply
              , a = Array.prototype.slice
              , s = {}
              , f = 0;
            function u(e, t) {
                this._id = e,
                this._clearFn = t
            }
            r.setTimeout = function() {
                return new u(o.call(setTimeout, window, arguments),clearTimeout)
            }
            ,
            r.setInterval = function() {
                return new u(o.call(setInterval, window, arguments),clearInterval)
            }
            ,
            r.clearTimeout = r.clearInterval = function(e) {
                e.close()
            }
            ,
            u.prototype.unref = u.prototype.ref = function() {}
            ,
            u.prototype.close = function() {
                this._clearFn.call(window, this._id)
            }
            ,
            r.enroll = function(e, t) {
                clearTimeout(e._idleTimeoutId),
                e._idleTimeout = t
            }
            ,
            r.unenroll = function(e) {
                clearTimeout(e._idleTimeoutId),
                e._idleTimeout = -1
            }
            ,
            r._unrefActive = r.active = function(e) {
                clearTimeout(e._idleTimeoutId);
                var t = e._idleTimeout;
                t >= 0 && (e._idleTimeoutId = setTimeout(function() {
                    e._onTimeout && e._onTimeout()
                }, t))
            }
            ,
            r.setImmediate = "function" == typeof t ? t : function(e) {
                var t = f++
                  , n = !(arguments.length < 2) && a.call(arguments, 1);
                return s[t] = !0,
                i(function() {
                    s[t] && (n ? e.apply(null, n) : e.call(null),
                    r.clearImmediate(t))
                }),
                t
            }
            ,
            r.clearImmediate = "function" == typeof n ? n : function(e) {
                delete s[e]
            }
        }
        ).call(this, e("timers").setImmediate, e("timers").clearImmediate)
    }
    , {
        "process/browser.js": 27,
        timers: 45
    }],
    46: [function(e, t, r) {
        var n = e("is-audio-buffer")
          , i = e("is-data-uri")
          , o = e("atob-lite");
        t.exports = function e(t, r) {
            if (!t)
                return new ArrayBuffer;
            if (t instanceof ArrayBuffer)
                return r ? t.slice() : t;
            if (ArrayBuffer.isView(t))
                return null != t.byteOffset ? t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength) : r ? t.buffer.slice() : t.buffer;
            if (n(t)) {
                for (var a = new (0,
                t.getChannelData(0).constructor)(t.length * t.numberOfChannels), s = 0; s < t.numberOfChannels; s++)
                    a.set(t.getChannelData(s), s * t.length);
                return a.buffer
            }
            if (t.buffer || t.data) {
                var f = e(t.buffer || t.data);
                return r ? f.slice() : f
            }
            if ("string" == typeof t) {
                if (i(t)) {
                    for (var u = o(t.split(",")[1]), l = [], h = 0; h < u.length; h++)
                        l.push(u.charCodeAt(h));
                    return new Uint8Array(l)
                }
                for (var c = new ArrayBuffer(2 * t.length), p = new Uint16Array(c), d = (h = 0,
                t.length); h < d; h++)
                    p[h] = t.charCodeAt(h);
                return c
            }
            return new Uint8Array(null != t.length ? t : [t]).buffer
        }
    }
    , {
        "atob-lite": 1,
        "is-audio-buffer": 16,
        "is-data-uri": 19
    }],
    47: [function(e, t, r) {
        var n = ["values", "sort", "some", "slice", "reverse", "reduceRight", "reduce", "map", "keys", "lastIndexOf", "join", "indexOf", "includes", "forEach", "find", "findIndex", "copyWithin", "filter", "entries", "every", "fill"];
        if ("undefined" != typeof Int8Array)
            for (var i = n.length; i--; ) {
                var o = n[i];
                Int8Array.prototype[o] || (Int8Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Uint8Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Uint8Array.prototype[o] || (Uint8Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Uint8ClampedArray)
            for (i = n.length; i--; ) {
                o = n[i];
                Uint8ClampedArray.prototype[o] || (Uint8ClampedArray.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Int16Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Int16Array.prototype[o] || (Int16Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Uint16Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Uint16Array.prototype[o] || (Uint16Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Int32Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Int32Array.prototype[o] || (Int32Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Uint32Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Uint32Array.prototype[o] || (Uint32Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Float32Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Float32Array.prototype[o] || (Float32Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof Float64Array)
            for (i = n.length; i--; ) {
                o = n[i];
                Float64Array.prototype[o] || (Float64Array.prototype[o] = Array.prototype[o])
            }
        if ("undefined" != typeof TypedArray)
            for (i = n.length; i--; ) {
                o = n[i];
                TypedArray.prototype[o] || (TypedArray.prototype[o] = Array.prototype[o])
            }
    }
    , {}],
    48: [function(e, t, r) {
        (function(e) {
            function r(t) {
                try {
                    if (!e.localStorage)
                        return !1
                } catch (e) {
                    return !1
                }
                var r = e.localStorage[t];
                return null != r && "true" === String(r).toLowerCase()
            }
            t.exports = function(e, t) {
                if (r("noDeprecation"))
                    return e;
                var n = !1;
                return function() {
                    if (!n) {
                        if (r("throwDeprecation"))
                            throw new Error(t);
                        r("traceDeprecation") ? console.trace(t) : console.warn(t),
                        n = !0
                    }
                    return e.apply(this, arguments)
                }
            }
        }
        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {}],
    49: [function(e, t, r) {
        "use strict";
        const n = e("object-assign")
          , i = e("pcm-util")
          , o = e("audio-buffer-utils")
          , a = e("is-audio-buffer")
          , s = e("audio-buffer-list");
        function f(e, t) {
            if (!e || !e.context)
                throw Error("Pass AudioNode instance first argument");
            t || (t = {}),
            t.context = e.context,
            t = n({
                mode: f.SCRIPT_MODE,
                samplesPerFrame: i.defaults.samplesPerFrame,
                channels: i.defaults.channels
            }, t);
            let r = i.format(t);
            i.normalize(r);
            let u, l, h, c = t.context, p = t.channels, d = t.samplesPerFrame, g = c.sampleRate, b = !1, y = new s(0,p);
            if (t.mode === f.SCRIPT_MODE)
                u = function() {
                    let e = c.createBufferSource();
                    return e.loop = !0,
                    e.buffer = o.create(d, p, {
                        context: c
                    }),
                    (u = c.createScriptProcessor(d)).addEventListener("audioprocess", function(e) {
                        let t = l;
                        l = null,
                        t && t(),
                        h || o.copy(v(e.inputBuffer.length), e.outputBuffer)
                    }),
                    e.connect(u),
                    e.start(),
                    u
                }();
            else {
                if (t.mode !== f.BUFFER_MODE)
                    throw Error("Unknown mode. Choose from BUFFER_MODE or SCRIPT_MODE");
                u = function() {
                    (u = c.createBufferSource()).loop = !0,
                    u.buffer = o.create(2 * d, p, {
                        context: u.context
                    });
                    let e = u.buffer;
                    setTimeout(function n(i) {
                        if (h)
                            return;
                        let a = c.currentTime - r;
                        let s = a * g;
                        if (t - s < d) {
                            if (o.copy(v(d), e, t % e.length),
                            t += d,
                            l) {
                                let e = l;
                                l = null,
                                e()
                            }
                            n()
                        } else {
                            let e = (t - d) / g
                              , r = e - a;
                            setTimeout(n, 1e3 * r)
                        }
                    }),
                    u.start();
                    let t = 0
                      , r = c.currentTime;
                    return u
                }()
            }
            return u.connect(e),
            m.end = (()=>{
                h || (u.disconnect(),
                h = !0)
            }
            ),
            m;
            function m(e, t) {
                if (!h) {
                    if (null == e)
                        return m.end();
                    !function(e) {
                        a(e) || (e = o.create(e, p));
                        y.append(e),
                        b = !1
                    }(e),
                    l = t
                }
            }
            function v(e) {
                if (e = e || d,
                b)
                    return y;
                let t = y.slice(0, e);
                return y.consume(e),
                t.length < e && (t = o.pad(t, e)),
                t
            }
        }
        t.exports = f,
        f.WORKER_MODE = 2,
        f.SCRIPT_MODE = 1,
        f.BUFFER_MODE = 0
    }
    , {
        "audio-buffer-list": 2,
        "audio-buffer-utils": 3,
        "is-audio-buffer": 16,
        "object-assign": 23,
        "pcm-util": 25
    }],
    "web-audio-stream/writable": [function(e, t, r) {
        "use strict";
        var n = e("inherits")
          , i = e("stream").Writable
          , o = e("./write");
        function a(e, t) {
            if (!(this instanceof a))
                return new a(e,t);
            let r = o(e, t);
            i.call(this, {
                objectMode: !0,
                highWaterMark: 0,
                write: (e,t,n)=>r(e, n)
            }),
            this.inputsCount = 0,
            this.on("pipe", e=>{
                this.inputsCount++,
                e.once("end", ()=>{
                    this.end()
                }
                )
            }
            ).on("unpipe", e=>{
                this.inputsCount--
            }
            ),
            this.once("end", ()=>{
                r.end()
            }
            )
        }
        t.exports = a,
        n(a, i),
        a.WORKER_MODE = 2,
        a.SCRIPT_MODE = 1,
        a.BUFFER_MODE = 0,
        a.prototype.mode = a.SCRIPT_MODE,
        a.prototype.inputsCount = 0,
        a.prototype.end = function() {
            if (!this.isEnded) {
                this.isEnded = !0;
                var e = !1;
                return this.once("end", ()=>{
                    e = !0
                }
                ),
                i.prototype.end.call(this),
                setTimeout(()=>{
                    e || this.emit("end")
                }
                ),
                this
            }
        }
    }
    , {
        "./write": 49,
        inherits: 15,
        stream: 29
    }]
}, {}, []);
