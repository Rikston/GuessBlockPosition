let TableLevel = (function() {
  let now = 0;
  let whatDoOnLevel = null;
  function tableLevel(settings) {
    function CreateNode(numberLevel) {
      let node = document.createElement("div");
      let kv = document.createElement("div");
      let key = document.createElement("div");
      let value = document.createElement("div");
      node.classList.add("info-block", settings.colorBlock || "blue");
      kv.classList.add("kv");
      key.classList.add("key", "big-title");
      value.classList.add("value");
      key.textContent = "Level";
      kv.appendChild(key);
      kv.appendChild(value);
      node.appendChild(kv);
      node.kv = kv;
      node.kv.key = key;
      node.kv.value = value;
      for (let i = 0; i < numberLevel; ++i) {
        let point = document.createElement("div");
        point.classList.add("point", "efor");
        value.appendChild(point);
      }
      return node;
    }

    if (!settings.numberLevel) throw new Error("no exist property numberLevel");
    this.node = CreateNode(settings.numberLevel);
    this.onNext = settings.onNext || function() {};
    whatDoOnLevel = settings.whatDoOnLevel || {};
    whatDoOnLevel.length = this.node.kv.value.children.length;
  }
  Object.defineProperties(tableLevel.prototype, {
    numberOfLevel: {
      get: function() {
        return this.node.kv.value.children.length;
      }
    },
    now: {
      get: function() {
        return {
          index: now,
          right: function() {
            console.log(this.node.kv.value.children);
            this.node.kv.value.children[now].classList.add("right");
          }.bind(this),
          wrong: function() {
            this.node.kv.value.children[now].classList.add("wrong");
          }.bind(this)
        };
      },
      set: function(value) {
        if (this.numberOfLevel < value) throw new RangeError("now");
        now = value;
        whatDoOnLevel[now] && whatDoOnLevel[now](this);
      }
    }
  });

  tableLevel.prototype.next = function() {
    this.onNext(this);
    this.now = ++now;
  };

  return tableLevel;
})();
