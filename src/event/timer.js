import "../core/document";
import "../core/vendor";

var d3_timer_queueHead,
    d3_timer_queueTail,
    d3_timer_interval, // is an interval (or frame) active?
    d3_timer_active, // active timer object

    d3_timer_frameNo = 0,
    d3_timer_frameRate = (1000 / 30),

    d3_timer_frame = function(callback) {
        setTimeout(callback, 0);
    };

// The timer will continue to fire until callback returns true.
d3.timer = function(callback, delay, then) {
  delay = delay || 0;
  then = d3_timer_time();

  // Add the callback to the tail of the queue.
  var time = then + delay, timer = {c: callback, t: time, f: false, n: null, i: 0};
  if (d3_timer_queueTail) d3_timer_queueTail.n = timer;
  else d3_timer_queueHead = timer;
  d3_timer_queueTail = timer;

  // Start animatin'!
  if (!d3_timer_interval) {
    d3_timer_interval = 1;
    d3_timer_frame(d3_timer_step);
  }
};

function d3_timer_time() {
   return d3_timer_frameNo * d3_timer_frameRate;
}

function d3_timer_step() {
  d3.timer.flush();

  d3_timer_frameNo++;

  if (d3_timer_queueHead) {
    d3_timer_interval = 1;
    d3_timer_frame(d3_timer_step);
  } else {
    d3_timer_interval = 0;
    d3_timer_frameNo = 0;
  }
}

d3.timer.flush = function() {
  d3_timer_mark();
  d3_timer_sweep();
};

function d3_timer_mark() {
  var now = d3_timer_time();
  d3_timer_active = d3_timer_queueHead;
  while (d3_timer_active) {
    if (now >= d3_timer_active.t) {
        d3_timer_active.i++;
        d3_timer_active.f = d3_timer_active.c((d3_timer_active.t + (d3_timer_active.i * d3_timer_frameRate)) - d3_timer_active.t);
    }
	d3_timer_active = d3_timer_active.n;
  }
  return now;
}

// Flush after callbacks to avoid concurrent queue modification.
// Returns the time of the earliest active timer, post-sweep.
function d3_timer_sweep() {
  var t0,
      t1 = d3_timer_queueHead,
      time = Infinity;

  while (t1) {
    if (t1.f) {
      t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
    } else {
      if (t1.t < time) time = t1.t;
      t1 = (t0 = t1).n;
    }
  }
  d3_timer_queueTail = t0;
  return time;
}
