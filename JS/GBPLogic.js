let GuessBlockPosition = (function() {
  /*
    @param settings:
            selector node element
    */
  let pattern = null;
  let isShow = false;
  let answer = null;
  let isMouseDown = false;
  function GBP(settings) {
    try {
      if (!settings.rows || !settings.cols)
        throw new SettingsError("dimensions");

      this.node = GBP.CreateGBP(settings.rows, settings.cols);
      if (!settings.pattern) throw new SettingsError("pattern");
      this.pattern = settings.pattern;
      Array.prototype.forEach.call(this.node.children, function(item) {
        item.addEventListener("mousedown", function() {
          this.classList.toggle("choose");
        });
        item.addEventListener("mouseenter", function() {
          if (isMouseDown) this.classList.toggle("choose");
        });
      });
      if (!settings.selector) throw new SettingsError("selector");
      GBP.ReplaceNE(settings.selector, this);
      this.node.addEventListener("mousedown", function() {
        isMouseDown = true;
      });
      this.node.addEventListener("mouseup", function() {
        isMouseDown = false;
      });
    } catch (e) {
      console.error(e);
    }
  }
  Object.defineProperties(GBP.prototype, {
    pattern: {
      get: function() {
        return pattern;
      },
      set: function(val) {
        let isshow = isShow;
        if (isshow) this.show();
        pattern = val;
        answer = rightAnswer = pattern.reduce(
          function(pre, item) {
            if (item) {
              ++pre.right;
            } else {
              ++pre.wrong;
            }
            return pre;
          },
          { right: 0, wrong: 0 }
        );
        if (isshow) this.show();
      }
    },
    isShow: {
      get: function() {
        return true;
      }
    },
    answer: {
      get: function() {
        return answer;
      }
    }
  });
  GBP.prototype.check = function() {
    let obj = {
      right: 0,
      wrong: 0,
      notAnswer: 0
    };
    isShow = !isShow;
    for (let i = 0; i < this.node.children.length; ++i) {
      if (this.pattern[i]) {
        this.node.children[i].classList.toggle("right");
        if (this.node.children[i].classList.contains("choose")) ++obj.right;
      } else {
        if (this.node.children[i].classList.contains("choose")) {
          this.node.children[i].classList.toggle("wrong");
          ++obj.wrong;
        }
      }
    }
    obj.notAnswer = answer.right - obj.right;
    return obj;
  };
  GBP.CreateGBP = function(rows, cols) {
    let gbp_container = document.createElement("div");
    let count = rows * cols;

    gbp_container.classList.add("gbp-container");
    gbp_container.style.width = cols * 50 + cols * 4 + "px";
    gbp_container.style.height = rows * 50 + rows * 4 + "px";
    for (let i = 0; i < count; ++i) {
      let block = document.createElement("div");
      block.classList.add("gbp-block");
      gbp_container.appendChild(block);
    }

    return gbp_container;
  };
  GBP.ReplaceNE = function(selector, gbp) {
    let nodeElement = document.querySelector(selector);
    let parent = nodeElement.parentNode;
    parent.replaceChild(
      gbp.nodeType && gbp.nodeType == 1 ? gbp : gbp.node,
      nodeElement
    );
  };
  GBP.GeneratePattern = function(rows, cols) {
    let pattern = [];
    for (let i = rows * cols; i > 0; --i) {
      pattern.push(Math.random() > 0.5 ? true : false);
    }
    return pattern;
  };
  return GBP;
})();

let SettingsError = (function() {
  function settingsError(property) {
    Error.call(this, property);
    this.name = "SettingsError";
    this.property = property;
    this.message = "missing property: " + this.property;
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
  }
  settingsError.prototype = Object.create(Error.prototype);
  settingsError.prototype.constructor = settingsError;
  return settingsError;
})();
