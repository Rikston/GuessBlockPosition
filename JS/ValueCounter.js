function Counter(settings) {
  let val = settings.value || 0;
  let max = settings.max || Infinity;
  let min = settings.min || -Infinity;
  this.step = settings.step || 1;
  this.node = document.createElement("div");
  this.node.classList.add("counter-box");
  this.round = settings.round || 0;
  this.buttonUp = document.createElement("div");
  this.buttonUp.classList.add("button-up");
  let i = document.createElement("i");
  i.classList.add("material-icons");
  i.textContent = "▲";
  this.buttonUp.appendChild(i.cloneNode(true));
  i.textContent = "▼";
  this.value = document.createElement("div");
  this.value.classList.add("counter-value");
  this.value.setAttribute("contenteditable", "true");
  this.value.textContent = val;
  this.buttonDown = document.createElement("div");
  this.buttonDown.classList.add("button-down");
  this.buttonDown.appendChild(i.cloneNode(true));
  this.node.appendChild(this.buttonUp);
  this.node.appendChild(this.value);
  this.node.appendChild(this.buttonDown);
  this.onChangeValue = function(e) {};
  this.buttonUp.addEventListener(
    "mousedown",
    function(e) {
      this.Value += this.step;
      this.onChangeValue({ value: this.Value, increase: true });
    }.bind(this)
  );
  this.buttonDown.addEventListener(
    "mousedown",
    function(e) {
      this.Value -= this.step;
      this.onChangeValue({ value: this.Value, increase: false });
    }.bind(this),
    true
  );
  this.node.addEventListener(
    "mousewheel",
    function(e) {
      if (e.deltaY < 0) this.Value += this.step;
      else this.Value -= this.step;
    }.bind(this),
    true
  );
  this.value.addEventListener(
    "input",
    function() {
      if (Number(this.value.textContent != NaN)) {
        this.Value = Number(this.value.textContent);
      }
    }.bind(this),
    true
  );
  this.value.addEventListener(
    "blur",
    function() {
      this.value.textContent = val;
    }.bind(this)
  );
  Object.defineProperties(this, {
    Value: {
      get: function() {
        return val;
      },
      set: function(value) {
        if (min <= value && value <= max) {
          this.value.textContent = value.toFixed(this.round);
          this.onChangeValue({
            value: value,
            increase: val > value ? false : true
          });
          val = value;
        }
      }
    }
  });
}

Counter.ReplaceCounter = function(selector) {
  let counter = null;
  if (typeof selector == "string") counter = document.querySelector(selector);
  if (selector && selector.nodeType == 1) counter = selector;
  if (!counter) {
    throw new ReferenceError("selector don't exist");
  }
  let newCounter = new Counter({
    value: Number(counter.getAttribute("value")),
    step: Number(counter.getAttribute("step")),
    max: Number(counter.getAttribute("max")),
    min: Number(counter.getAttribute("min")),
    round: Number(counter.getAttribute("round"))
  });
  let parent = counter.parentNode;
  parent.replaceChild(newCounter.node, counter);
  return newCounter;
};

Counter.ReplaceAllCounter = function(selector) {
  let counters = document.querySelectorAll(selector);
  let result = {};
  counters.forEach(function(item) {
    result[item.getAttribute("name")] = this.ReplaceCounter(item);
  }, this);
  return result;
};
