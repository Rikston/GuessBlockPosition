let GuessBlockPosition = (function() {
  /*
    @param settings:
            selector node element
    */
  let pattern = null;
  let isShow = false;
  let information = { right: 0, wrong: 0, maxSelected: 0 };
  let isMouseDown = false;
  function GBP(settings) {
    let CreateNode = function(rows, cols) {
      let MouseDown = function(e) {
        if (e.target.classList.contains("choose")) e.target.unselect();
        else {
          if (information.maxSelected != this.information.selected) {
            e.target.select();
            pattern[e.target.tabIndex]
              ? ++information.right
              : ++information.wrong;
            if (information.maxSelected == this.information.selected) {
              this.onEqual(this.information, this);
              this.show();
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
          ++information.selected;
        };
        block.unselect = function() {
          this.classList.remove("choose");
          --information.selected;
        };
        block.addEventListener("mousedown", MouseDown);
        if (settings.onShow)
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
      this.onShow = settings.onShow || function() {};
      this.onHide = settings.onHide || function() {};
      this.onEqual = settings.onEqual || function() {};
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
        if (isshow) this.hide();
        this.clearSelected();
        pattern = val;
        information = pattern.reduce(
          function(pre, item) {
            if (item) {
              ++pre.maxSelected;
            }
            return pre;
          },
          { right: 0, wrong: 0, maxSelected: 0 }
        );
        if (isshow) this.show();
      }
    },
    isShow: {
      get: function() {
        return true;
      }
    },
    information: {
      get: function() {
        return {
          right: information.right,
          wrong: information.wrong,
          selected: information.right + information.wrong,
          maxSelected: information.maxSelected
        };
      }
    },
    isRight: {
      get: function() {
        return information.right == information.maxSelected;
      }
    }
  });
  GBP.prototype.show = function() {
    isShow = true;
    for (let i = 0; i < this.node.children.length; ++i) {
      if (this.pattern[i]) {
        this.node.children[i].classList.add("right");
      } else {
        if (this.node.children[i].classList.contains("choose")) {
          this.node.children[i].classList.add("wrong");
        }
      }
    }
    this.onShow(this.information, this);
  };
  GBP.prototype.hide = function() {
    isShow = false;
    for (let i = 0; i < this.node.children.length; ++i) {
      this.node.children[i].classList.remove("right", "wrong");
    }
    this.onHide(this.information, this);
  };
  GBP.prototype.clearSelected = function() {
    Array.prototype.forEach.call(this.node.children, function(item) {
      item.classList.remove("choose", "wrong", "right");
    });
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
    let length = null;
    if (rows instanceof GuessBlockPosition) length = rows.pattern.length;
    else length = rows * cols;
    for (let i = length; i > 0; --i) {
      pattern.push(Math.random() > 0.5 ? true : false);
    }
    if (rows.pattern) gbp.pattern = pattern;
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
