let GuessBlockPosition = (function() {
  /*
    @param settings:
            selector node element
    */
  let pattern = null;
  let isShow = false;
  let answer = { right: 0, wrong: 0, maxSelected: 0 };
  let isMouseDown = false;
  function GBP(settings) {
    let CreateNode = function(rows, cols) {
      let MouseDown = function(e) {
        if (e.target.classList.contains("choose")) e.target.unselect();
        else {
          if (answer.maxSelected != answer.right) {
            e.target.select();
            pattern[e.target.tabIndex] ? ++answer.right : ++answer.wrong;
            if (answer.maxSelected == answer.right + answer.wrong) {
              this.onCheck(this.check(), this);
            }
          }
        }
      }.bind(this);
      let gbp_container = document.createElement("div");
      let count = rows * cols;

      gbp_container.classList.add("gbp-container");
      gbp_container.style.width = cols * 50 + cols * 4 + "px";
      gbp_container.style.height = rows * 50 + rows * 4 + "px";

      for (let i = 0; i < count; ++i) {
        let block = document.createElement("div");
        block.tabIndex = i;
        block.select = function() {
          this.classList.add("choose");
          ++answer.selected;
        };
        block.unselect = function() {
          this.classList.remove("choose");
          --answer.selected;
        };
        block.addEventListener("mousedown", MouseDown);
        if (settings.onCheck)
          block.addEventListener("mouseenter", function(e) {
            if (isMouseDown) {
              MouseDown.call(this, e);
            }
          });
        block.classList.add("gbp-block");
        gbp_container.appendChild(block);
      }

      return gbp_container;
    }.bind(this);
    try {
      this.onCheck = settings.onCheck || function() {};
      if (!settings.rows || !settings.cols)
        throw new SettingsError("dimensions");

      this.node = CreateNode(settings.rows, settings.cols);
      if (!settings.pattern) throw new SettingsError("pattern");
      this.pattern = settings.pattern;

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
        if (isshow) this.check();
        pattern = val;
        answer = pattern.reduce(
          function(pre, item) {
            if (item) {
              ++pre.maxSelected;
            }
            return pre;
          },
          { right: 0, wrong: 0, maxSelected: 0 }
        );
        if (isshow) this.check();
      }
    },
    isShow: {
      get: function() {
        return true;
      }
    },
    answer: {
      get: function() {
        return {
          right: answer.right,
          wrong: answer.wrong,
          selected: answer.right + answer.wrong,
          maxSelected: answer.maxSelected
        };
      }
    }
  });
  GBP.prototype.check = function() {
    isShow = !isShow;
    for (let i = 0; i < this.node.children.length; ++i) {
      if (this.pattern[i]) {
        this.node.children[i].classList.toggle("right");
      } else {
        if (this.node.children[i].classList.contains("choose")) {
          this.node.children[i].classList.toggle("wrong");
        }
      }
    }
    obj.notAnswer = answer.right - obj.right;
    return obj;
  };
  GBP.getInfo = function() {
    let obj = {
      right: 0,
      wrong: 0,
      notAnswer: 0,
      maxSelected: answer.maxSelected,
      selected: this.answer.selected
    };
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
