/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
var GlobalParams = {
  video: {
    zIndex: 1
  },
  background: {
    zIndex: 0
  }
};
window.paella = window.paella || {};
paella.player = null;
paella.version = "6.2.2 - build: b561b69af1";

(function buildBaseUrl() {
  if (window.paella_debug_baseUrl) {
    paella.baseUrl = window.paella_debug_baseUrl;
  } else {
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1].src.split("/");
    script.pop(); // Remove javascript file name

    script.pop(); // Remove javascript/ folder name

    paella.baseUrl = script.join("/") + '/';
  }
})();

paella.events = {
  play: "paella:play",
  pause: "paella:pause",
  next: "paella:next",
  previous: "paella:previous",
  seeking: "paella:seeking",
  seeked: "paella:seeked",
  timeupdate: "paella:timeupdate",
  timeUpdate: "paella:timeupdate",
  seekTo: "paella:setseek",
  endVideo: "paella:endvideo",
  // Triggered when a single video stream ends (once per video)
  ended: "paella:ended",
  // Triggered when the video ends 
  seekToTime: "paella:seektotime",
  setTrim: "paella:settrim",
  setPlaybackRate: "paella:setplaybackrate",
  setVolume: 'paella:setVolume',
  setComposition: 'paella:setComposition',
  loadStarted: 'paella:loadStarted',
  loadComplete: 'paella:loadComplete',
  loadPlugins: 'paella:loadPlugins',
  error: 'paella:error',
  documentChanged: 'paella:documentChanged',
  didSaveChanges: 'paella:didsavechanges',
  controlBarWillHide: 'paella:controlbarwillhide',
  controlBarDidHide: 'paella:controlbardidhide',
  controlBarDidShow: 'paella:controlbardidshow',
  hidePopUp: 'paella:hidePopUp',
  showPopUp: 'paella:showPopUp',
  enterFullscreen: 'paella:enterFullscreen',
  exitFullscreen: 'paella:exitFullscreen',
  resize: 'paella:resize',
  // params: { width:paellaPlayerContainer width, height:paellaPlayerContainer height }
  videoZoomChanged: 'paella:videoZoomChanged',
  audioTagChanged: 'paella:audiotagchanged',
  zoomAvailabilityChanged: 'paella:zoomavailabilitychanged',
  qualityChanged: 'paella:qualityChanged',
  singleVideoReady: 'paella:singleVideoReady',
  singleVideoUnloaded: 'paella:singleVideoUnloaded',
  videoReady: 'paella:videoReady',
  videoUnloaded: 'paella:videoUnloaded',
  controlBarLoaded: 'paella:controlBarLoaded',
  flashVideoEvent: 'paella:flashVideoEvent',
  captionAdded: 'paella:caption:add',
  // Event triggered when new caption is available.
  captionsEnabled: 'paella:caption:enabled',
  // Event triguered when a caption es enabled.
  captionsDisabled: 'paella:caption:disabled',
  // Event triguered when a caption es disabled.
  profileListChanged: 'paella:profilelistchanged',
  setProfile: 'paella:setprofile',
  seekAvailabilityChanged: 'paella:seekAvailabilityChanged',
  trigger: function (event, params) {
    $(document).trigger(event, params);
  },
  bind: function (event, callback) {
    $(document).bind(event, function (event, params) {
      callback(event, params);
    });
  },
  setupExternalListener: function () {
    window.addEventListener("message", function (event) {
      if (event.data && event.data.event) {
        paella.events.trigger(event.data.event, event.data.params);
      }
    }, false);
  }
};
paella.events.setupExternalListener();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
// Paella Mouse Manager
///////////////////////////////////////////////////////
(() => {
  class MouseManager {
    get targetObject() {
      return this._targetObject;
    }

    set targetObject(t) {
      this._targetObject = t;
    }

    constructor() {
      paella.events.bind('mouseup', event => this.up(event));
      paella.events.bind('mousemove', event => this.move(event));
      paella.events.bind('mouseover', event => this.over(event));
    }

    down(targetObject, event) {
      this.targetObject = targetObject;

      if (this.targetObject && this.targetObject.down) {
        this.targetObject.down(event, event.pageX, event.pageY);
        event.cancelBubble = true;
      }

      return false;
    }

    up(event) {
      if (this.targetObject && this.targetObject.up) {
        this.targetObject.up(event, event.pageX, event.pageY);
        event.cancelBubble = true;
      }

      this.targetObject = null;
      return false;
    }

    out(event) {
      if (this.targetObject && this.targetObject.out) {
        this.targetObject.out(event, event.pageX, event.pageY);
        event.cancelBubble = true;
      }

      return false;
    }

    move(event) {
      if (this.targetObject && this.targetObject.move) {
        this.targetObject.move(event, event.pageX, event.pageY);
        event.cancelBubble = true;
      }

      return false;
    }

    over(event) {
      if (this.targetObject && this.targetObject.over) {
        this.targetObject.over(event, event.pageX, event.pageY);
        event.cancelBubble = true;
      }

      return false;
    }

  }

  paella.MouseManager = MouseManager;
})(); // paella.utils
///////////////////////////////////////////////////////


(function initSkinDeps() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = paella.baseUrl + 'resources/bootstrap/css/bootstrap.min.css';
  link.type = 'text/css';
  link.media = 'screen';
  link.charset = 'utf-8';
  document.head.appendChild(link);
})();

paella.utils = {
  mouseManager: new paella.MouseManager(),
  folders: {
    get: function (folder) {
      if (paella.player && paella.player.config && paella.player.config.folders && paella.player.config.folders[folder]) {
        return paella.player.config.folders[folder];
      }

      return undefined;
    },
    profiles: function () {
      return paella.baseUrl + (paella.utils.folders.get("profiles") || "config/profiles");
    },
    resources: function () {
      return paella.baseUrl + (paella.utils.folders.get("resources") || "resources");
    },
    skins: function () {
      return paella.baseUrl + (paella.utils.folders.get("skins") || paella.utils.folders.get("resources") + "/style");
    }
  },
  styleSheet: {
    removeById: function (id) {
      var outStyleSheet = $(document.head).find('#' + id)[0];

      if (outStyleSheet) {
        document.head.removeChild(outStyleSheet);
      }
    },
    remove: function (fileName) {
      var links = document.head.getElementsByTagName('link');

      for (var i = 0; i < links.length; ++i) {
        if (links[i].href) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    },
    add: function (fileName, id) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fileName;
      link.type = 'text/css';
      link.media = 'screen';
      link.charset = 'utf-8';
      if (id) link.id = id;
      document.head.appendChild(link);
    },
    swap: function (outFile, inFile) {
      this.remove(outFile);
      this.add(inFile);
    }
  },
  skin: {
    set: function (skinName) {
      var skinId = 'paellaSkin';
      paella.utils.styleSheet.removeById(skinId);
      paella.utils.styleSheet.add(paella.utils.folders.skins() + '/style_' + skinName + '.css');
      base.cookies.set("skin", skinName);
    },
    restore: function (defaultSkin) {
      var storedSkin = base.cookies.get("skin");

      if (storedSkin && storedSkin != "") {
        this.set(storedSkin);
      } else {
        this.set(defaultSkin);
      }
    }
  },
  timeParse: {
    timeToSeconds: function (timeString) {
      var hours = 0;
      var minutes = 0;
      var seconds = 0;

      if (/([0-9]+)h/i.test(timeString)) {
        hours = parseInt(RegExp.$1) * 60 * 60;
      }

      if (/([0-9]+)m/i.test(timeString)) {
        minutes = parseInt(RegExp.$1) * 60;
      }

      if (/([0-9]+)s/i.test(timeString)) {
        seconds = parseInt(RegExp.$1);
      }

      return hours + minutes + seconds;
    },
    secondsToTime: function (seconds) {
      var hrs = ~~(seconds / 3600);
      if (hrs < 10) hrs = '0' + hrs;
      var mins = ~~(seconds % 3600 / 60);
      if (mins < 10) mins = '0' + mins;
      var secs = Math.floor(seconds % 60);
      if (secs < 10) secs = '0' + secs;
      return hrs + ':' + mins + ':' + secs;
    },
    secondsToText: function (secAgo) {
      // Seconds
      if (secAgo <= 1) {
        return base.dictionary.translate("1 second ago");
      }

      if (secAgo < 60) {
        return base.dictionary.translate("{0} seconds ago").replace(/\{0\}/g, secAgo);
      } // Minutes


      var minAgo = Math.round(secAgo / 60);

      if (minAgo <= 1) {
        return base.dictionary.translate("1 minute ago");
      }

      if (minAgo < 60) {
        return base.dictionary.translate("{0} minutes ago").replace(/\{0\}/g, minAgo);
      } //Hours


      var hourAgo = Math.round(secAgo / (60 * 60));

      if (hourAgo <= 1) {
        return base.dictionary.translate("1 hour ago");
      }

      if (hourAgo < 24) {
        return base.dictionary.translate("{0} hours ago").replace(/\{0\}/g, hourAgo);
      } //Days


      var daysAgo = Math.round(secAgo / (60 * 60 * 24));

      if (daysAgo <= 1) {
        return base.dictionary.translate("1 day ago");
      }

      if (daysAgo < 24) {
        return base.dictionary.translate("{0} days ago").replace(/\{0\}/g, daysAgo);
      } //Months


      var monthsAgo = Math.round(secAgo / (60 * 60 * 24 * 30));

      if (monthsAgo <= 1) {
        return base.dictionary.translate("1 month ago");
      }

      if (monthsAgo < 12) {
        return base.dictionary.translate("{0} months ago").replace(/\{0\}/g, monthsAgo);
      } //Years


      var yearsAgo = Math.round(secAgo / (60 * 60 * 24 * 365));

      if (yearsAgo <= 1) {
        return base.dictionary.translate("1 year ago");
      }

      return base.dictionary.translate("{0} years ago").replace(/\{0\}/g, yearsAgo);
    },
    matterhornTextDateToDate: function (mhdate) {
      var d = new Date();
      d.setFullYear(parseInt(mhdate.substring(0, 4), 10));
      d.setMonth(parseInt(mhdate.substring(5, 7), 10) - 1);
      d.setDate(parseInt(mhdate.substring(8, 10), 10));
      d.setHours(parseInt(mhdate.substring(11, 13), 10));
      d.setMinutes(parseInt(mhdate.substring(14, 16), 10));
      d.setSeconds(parseInt(mhdate.substring(17, 19), 10));
      return d;
    }
  },
  objectFromString: function (str) {
    var arr = str.split(".");
    var fn = window || this;

    for (var i = 0, len = arr.length; i < len; i++) {
      fn = fn[arr[i]];
    }

    if (typeof fn !== "function") {
      throw new Error("constructor not found");
    }

    return fn;
  }
};

(function () {
  let g_delegateCallbacks = {};
  let g_dataDelegates = [];

  class DataDelegate {
    read(context, params, onSuccess) {
      if (typeof onSuccess == 'function') {
        onSuccess({}, true);
      }
    }

    write(context, params, value, onSuccess) {
      if (typeof onSuccess == 'function') {
        onSuccess({}, true);
      }
    }

    remove(context, params, onSuccess) {
      if (typeof onSuccess == 'function') {
        onSuccess({}, true);
      }
    }

  }

  paella.DataDelegate = DataDelegate;
  paella.dataDelegates = {};

  class Data {
    get enabled() {
      return this._enabled;
    }

    get dataDelegates() {
      return g_dataDelegates;
    }

    constructor(config) {
      this._enabled = config.data.enabled; // Delegate callbacks

      let executedCallbacks = [];

      for (let context in g_delegateCallbacks) {
        let callback = g_delegateCallbacks[context];
        let DelegateClass = null;
        let delegateName = null;

        if (!executedCallbacks.some(execCallbackData => {
          if (execCallbackData.callback == callback) {
            delegateName = execCallbackData.delegateName;
            return true;
          }
        })) {
          DelegateClass = g_delegateCallbacks[context]();
          delegateName = DelegateClass.name;
          paella.dataDelegates[delegateName] = DelegateClass;
          executedCallbacks.push({
            callback: callback,
            delegateName: delegateName
          });
        }

        if (!config.data.dataDelegates[context]) {
          config.data.dataDelegates[context] = delegateName;
        }
      }

      for (var key in config.data.dataDelegates) {
        try {
          var delegateName = config.data.dataDelegates[key];
          var DelegateClass = paella.dataDelegates[delegateName];
          var delegateInstance = new DelegateClass();
          g_dataDelegates[key] = delegateInstance;
        } catch (e) {
          console.warn("Warning: delegate not found - " + delegateName);
        }
      } // Default data delegate


      if (!this.dataDelegates["default"]) {
        this.dataDelegates["default"] = new paella.dataDelegates.DefaultDataDelegate();
      }
    }

    read(context, key, onSuccess) {
      var del = this.getDelegate(context);
      del.read(context, key, onSuccess);
    }

    write(context, key, params, onSuccess) {
      var del = this.getDelegate(context);
      del.write(context, key, params, onSuccess);
    }

    remove(context, key, onSuccess) {
      var del = this.getDelegate(context);
      del.remove(context, key, onSuccess);
    }

    getDelegate(context) {
      if (this.dataDelegates[context]) return this.dataDelegates[context];else return this.dataDelegates["default"];
    }

  }

  paella.Data = Data;

  paella.addDataDelegate = function (context, callback) {
    if (Array.isArray(context)) {
      context.forEach(ctx => {
        g_delegateCallbacks[ctx] = callback;
      });
    } else if (typeof context == "string") {
      g_delegateCallbacks[context] = callback;
    }
  };
})();

paella.addDataDelegate(["default", "trimming"], () => {
  paella.dataDelegates.DefaultDataDelegate = class CookieDataDelegate extends paella.DataDelegate {
    serializeKey(context, params) {
      if (typeof params == 'object') {
        params = JSON.stringify(params);
      }

      return context + '|' + params;
    }

    read(context, params, onSuccess) {
      var key = this.serializeKey(context, params);
      var value = base.cookies.get(key);

      try {
        value = unescape(value);
        value = JSON.parse(value);
      } catch (e) {}

      if (typeof onSuccess == 'function') {
        onSuccess(value, true);
      }
    }

    write(context, params, value, onSuccess) {
      var key = this.serializeKey(context, params);

      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }

      value = escape(value);
      base.cookies.set(key, value);

      if (typeof onSuccess == 'function') {
        onSuccess({}, true);
      }
    }

    remove(context, params, onSuccess) {
      var key = this.serializeKey(context, params);

      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }

      base.cookies.set(key, '');

      if (typeof onSuccess == 'function') {
        onSuccess({}, true);
      }
    }

  };
  return paella.dataDelegates.DefaultDataDelegate;
}); // Will be initialized inmediately after loading config.json, in PaellaPlayer.onLoadConfig()

paella.data = null;

(() => {
  // Include scripts in header
  let g_requiredScripts = {};

  paella.require = function (path) {
    if (!g_requiredScripts[path]) {
      g_requiredScripts[path] = new Promise((resolve, reject) => {
        let script = document.createElement("script");

        if (path.split(".").pop() == 'js') {
          script.src = path;
          script.async = false;
          document.head.appendChild(script);
          setTimeout(() => resolve(), 100);
        } else {
          reject(new Error("Unexpected file type"));
        }
      });
    }

    return g_requiredScripts[path];
  };

  class MessageBox {
    get modalContainerClassName() {
      return 'modalMessageContainer';
    }

    get frameClassName() {
      return 'frameContainer';
    }

    get messageClassName() {
      return 'messageContainer';
    }

    get errorClassName() {
      return 'errorContainer';
    }

    get currentMessageBox() {
      return this._currentMessageBox;
    }

    set currentMessageBox(m) {
      this._currentMessageBox = m;
    }

    get messageContainer() {
      return this._messageContainer;
    }

    get onClose() {
      return this._onClose;
    }

    set onClose(c) {
      this._onClose = c;
    }

    constructor() {
      this._messageContainer = null;
      $(window).resize(event => this.adjustTop());
    }

    showFrame(src, params) {
      var closeButton = true;
      var onClose = null;

      if (params) {
        closeButton = params.closeButton;
        onClose = params.onClose;
      }

      this.doShowFrame(src, closeButton, onClose);
    }

    doShowFrame(src, closeButton, onClose) {
      this.onClose = onClose;
      $('#playerContainer').addClass("modalVisible");

      if (this.currentMessageBox) {
        this.close();
      }

      var modalContainer = document.createElement('div');
      modalContainer.className = this.modalContainerClassName;
      modalContainer.style.position = 'fixed';
      modalContainer.style.top = '0px';
      modalContainer.style.left = '0px';
      modalContainer.style.right = '0px';
      modalContainer.style.bottom = '0px';
      modalContainer.style.zIndex = 999999;
      var messageContainer = document.createElement('div');
      messageContainer.className = this.frameClassName;
      modalContainer.appendChild(messageContainer);
      var iframeContainer = document.createElement('iframe');
      iframeContainer.src = src;
      iframeContainer.setAttribute("frameborder", "0");
      iframeContainer.style.width = "100%";
      iframeContainer.style.height = "100%";
      messageContainer.appendChild(iframeContainer);

      if (paella.player && paella.player.isFullScreen()) {
        paella.player.mainContainer.appendChild(modalContainer);
      } else {
        $('body')[0].appendChild(modalContainer);
      }

      this.currentMessageBox = modalContainer;
      this._messageContainer = messageContainer;
      this.adjustTop();

      if (closeButton) {
        this.createCloseButton();
      }
    }

    showElement(domElement, params) {
      var closeButton = true;
      var onClose = null;
      var className = this.messageClassName;

      if (params) {
        className = params.className;
        closeButton = params.closeButton;
        onClose = params.onClose;
      }

      this.doShowElement(domElement, closeButton, className, onClose);
    }

    showMessage(message, params) {
      var closeButton = true;
      var onClose = null;
      var className = this.messageClassName;

      if (params) {
        className = params.className;
        closeButton = params.closeButton;
        onClose = params.onClose;
      }

      this.doShowMessage(message, closeButton, className, onClose);
    }

    doShowElement(domElement, closeButton, className, onClose) {
      this.onClose = onClose;
      $('#playerContainer').addClass("modalVisible");

      if (this.currentMessageBox) {
        this.close();
      }

      if (!className) className = this.messageClassName;
      var modalContainer = document.createElement('div');
      modalContainer.className = this.modalContainerClassName;
      modalContainer.style.position = 'fixed';
      modalContainer.style.top = '0px';
      modalContainer.style.left = '0px';
      modalContainer.style.right = '0px';
      modalContainer.style.bottom = '0px';
      modalContainer.style.zIndex = 999999;
      var messageContainer = document.createElement('div');
      messageContainer.className = className;
      messageContainer.appendChild(domElement);
      modalContainer.appendChild(messageContainer);
      $('body')[0].appendChild(modalContainer);
      this.currentMessageBox = modalContainer;
      this._messageContainer = messageContainer;
      this.adjustTop();

      if (closeButton) {
        this.createCloseButton();
      }
    }

    doShowMessage(message, closeButton, className, onClose) {
      this.onClose = onClose;
      $('#playerContainer').addClass("modalVisible");

      if (this.currentMessageBox) {
        this.close();
      }

      if (!className) className = this.messageClassName;
      var modalContainer = document.createElement('div');
      modalContainer.className = this.modalContainerClassName;
      modalContainer.style.position = 'fixed';
      modalContainer.style.top = '0px';
      modalContainer.style.left = '0px';
      modalContainer.style.right = '0px';
      modalContainer.style.bottom = '0px';
      modalContainer.style.zIndex = 999999;
      var messageContainer = document.createElement('div');
      messageContainer.className = className;
      messageContainer.innerHTML = message;
      modalContainer.appendChild(messageContainer);

      if (paella.player && paella.player.isFullScreen()) {
        paella.player.mainContainer.appendChild(modalContainer);
      } else {
        $('body')[0].appendChild(modalContainer);
      }

      this.currentMessageBox = modalContainer;
      this._messageContainer = messageContainer;
      this.adjustTop();

      if (closeButton) {
        this.createCloseButton();
      }
    }

    showError(message, params) {
      var closeButton = false;
      var onClose = null;

      if (params) {
        closeButton = params.closeButton;
        onClose = params.onClose;
      }

      this.doShowError(message, closeButton, onClose);
    }

    doShowError(message, closeButton, onClose) {
      this.doShowMessage(message, closeButton, this.errorClassName, onClose);
    }

    createCloseButton() {
      if (this._messageContainer) {
        var closeButton = document.createElement('span');

        this._messageContainer.appendChild(closeButton);

        closeButton.className = 'paella_messageContainer_closeButton icon-cancel-circle';
        $(closeButton).click(event => this.onCloseButtonClick());
        $(window).keyup(evt => {
          if (evt.keyCode == 27) {
            this.onCloseButtonClick();
          }
        });
      }
    }

    adjustTop() {
      if (this.currentMessageBox) {
        var msgHeight = $(this._messageContainer).outerHeight();
        var containerHeight = $(this.currentMessageBox).height();
        var top = containerHeight / 2 - msgHeight / 2;
        this._messageContainer.style.marginTop = top + 'px';
      }
    }

    close() {
      if (this.currentMessageBox && this.currentMessageBox.parentNode) {
        var msgBox = this.currentMessageBox;
        var parent = msgBox.parentNode;
        $('#playerContainer').removeClass("modalVisible");
        $(msgBox).animate({
          opacity: 0.0
        }, 300, function () {
          parent.removeChild(msgBox);
        });

        if (this.onClose) {
          this.onClose();
        }
      }
    }

    onCloseButtonClick() {
      this.close();
    }

  }

  paella.MessageBox = MessageBox;
  paella.messageBox = new paella.MessageBox();
})();

paella.AntiXSS = {
  htmlEscape: function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  htmlUnescape: function (value) {
    return String(value).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }
};

function paella_DeferredResolved(param) {
  return new Promise(resolve => {
    resolve(param);
  });
}

function paella_DeferredRejected(param) {
  return new Promise((resolve, reject) => {
    reject(param);
  });
}

function paella_DeferredNotImplemented() {
  return paella_DeferredRejected(new Error("not implemented"));
}
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(() => {
  class Node {
    get identifier() {
      return this._identifier;
    }

    set identifier(id) {
      this._identifier = id;
    }

    get nodeList() {
      return this._nodeList;
    }

    get parent() {
      return this._parent;
    }

    set parent(p) {
      this._parent = p;
    }

    constructor(id) {
      this._nodeList = {};
      this.identifier = id;
    }

    addTo(parentNode) {
      parentNode.addNode(this);
    }

    addNode(childNode) {
      childNode.parent = this;
      this.nodeList[childNode.identifier] = childNode;
      return childNode;
    }

    getNode(id) {
      return this.nodeList[id];
    }

    removeNode(childNode) {
      if (this.nodeList[childNode.identifier]) {
        delete this.nodeList[childNode.identifier];
        return true;
      }

      return false;
    }

  }

  paella.Node = Node;

  class DomNode extends paella.Node {
    get domElement() {
      return this._domElement;
    }

    constructor(elementType, id, style) {
      super(id);
      this._domElement = document.createElement(elementType);
      this.domElement.id = id;
      if (style) this.style = style;
    }

    set style(s) {
      $(this.domElement).css(s);
    }

    addNode(childNode) {
      let returnValue = super.addNode(childNode);
      this.domElement.appendChild(childNode.domElement);
      return returnValue;
    }

    onresize() {}

    removeNode(childNode) {
      if (super.removeNode(childNode)) {
        this.domElement.removeChild(childNode.domElement);
      }
    }

  }

  paella.DomNode = DomNode;

  class Button extends paella.DomNode {
    get isToggle() {
      return this._isToggle;
    }

    set isToggle(t) {
      this._isToggle = t;
    }

    constructor(id, className, action, isToggle) {
      var style = {};
      super('div', id, style);
      this.isToggle = isToggle;
      this.domElement.className = className;

      if (isToggle) {
        $(this.domElement).click(event => {
          this.toggleIcon();
        });
      }

      $(this.domElement).click('click', action);
    }

    isToggled() {
      if (this.isToggle) {
        var element = this.domElement;
        return /([a-zA-Z0-9_]+)_active/.test(element.className);
      } else {
        return false;
      }
    }

    toggle() {
      this.toggleIcon();
    }

    toggleIcon() {
      var element = this.domElement;

      if (/([a-zA-Z0-9_]+)_active/.test(element.className)) {
        element.className = RegExp.$1;
      } else {
        element.className = element.className + '_active';
      }
    }

    show() {
      $(this.domElement).show();
    }

    hide() {
      $(this.domElement).hide();
    }

    visible() {
      return this.domElement.visible();
    }

  }

  paella.Button = Button;
})();
/*  #DCE OPC-407 overriding for debug log lines */
(function () {
  let g_profiles = [];

  paella.addProfile = function (cb) {
    cb().then(profileData => {
      if (profileData) {
        g_profiles.push(profileData);

        if (typeof profileData.onApply != "function") {
          profileData.onApply = function () {};
        }

        if (typeof profileData.onDeactivte != "function") {
          profileData.onDeactivate = function () {};
        }

        paella.events.trigger(paella.events.profileListChanged, {
          profileData: profileData
        });
      }
    });
  }; // Utility functions


  function hideBackground() {
    let bkgNode = this.container.getNode("videoContainerBackground");
    if (bkgNode) this.container.removeNode(bkgNode);
  }

  function showBackground(bkgData) {
    if (!bkgData) return;
    hideBackground.apply(this);
    this.backgroundData = bkgData;
    let style = {
      backgroundImage: `url(${paella.utils.folders.get("resources")}/style/${bkgData.content})`,
      backgroundSize: "100% 100%",
      zIndex: bkgData.layer,
      position: 'absolute',
      left: bkgData.rect.left + "px",
      right: bkgData.rect.right + "px",
      width: "100%",
      height: "100%"
    };
    this.container.addNode(new paella.DomNode('div', "videoContainerBackground", style));
  }

  function hideAllLogos() {
    if (this.logos == undefined) return;

    for (var i = 0; i < this.logos.length; ++i) {
      var logoId = this.logos[i].content.replace(/\./ig, "-");
      var logo = this.container.getNode(logoId);
      $(logo.domElement).hide();
    }
  }

  function showLogos(logos) {
    this.logos = logos;
    var relativeSize = new paella.RelativeVideoSize();

    for (var i = 0; i < logos.length; ++i) {
      var logo = logos[i];
      var logoId = logo.content.replace(/\./ig, "-");
      var logoNode = this.container.getNode(logoId);
      var rect = logo.rect;

      if (!logoNode) {
        style = {};
        logoNode = this.container.addNode(new paella.DomNode('img', logoId, style));
        logoNode.domElement.setAttribute('src', `${paella.utils.folders.get("resources")}/style/${logo.content}`);
      } else {
        $(logoNode.domElement).show();
      }

      var percentTop = Number(relativeSize.percentVSize(rect.top)) + '%';
      var percentLeft = Number(relativeSize.percentWSize(rect.left)) + '%';
      var percentWidth = Number(relativeSize.percentWSize(rect.width)) + '%';
      var percentHeight = Number(relativeSize.percentVSize(rect.height)) + '%';
      var style = {
        top: percentTop,
        left: percentLeft,
        width: percentWidth,
        height: percentHeight,
        position: 'absolute',
        zIndex: logo.zIndex
      };
      $(logoNode.domElement).css(style);
    }
  }

  function hideButtons() {
    if (this.buttons) {
      this.buttons.forEach(btn => {
        this.container.removeNode(this.container.getNode(btn.id));
      });
      this.buttons = null;
    }
  }

  function showButtons(buttons, profileData) {
    hideButtons.apply(this);

    if (buttons) {
      let relativeSize = new paella.RelativeVideoSize();
      this.buttons = buttons;
      buttons.forEach((btn, index) => {
        btn.id = "button_" + index;
        let rect = btn.rect;
        let percentTop = relativeSize.percentVSize(rect.top) + '%';
        let percentLeft = relativeSize.percentWSize(rect.left) + '%';
        let percentWidth = relativeSize.percentWSize(rect.width) + '%';
        let percentHeight = relativeSize.percentVSize(rect.height) + '%';
        let url = paella.baseUrl;
        url = url.replace(/\\/ig, '/');
        let style = {
          top: percentTop,
          left: percentLeft,
          width: percentWidth,
          height: percentHeight,
          position: 'absolute',
          zIndex: btn.layer,
          backgroundImage: `url(${paella.utils.folders.get("resources")}/style/${btn.icon})`,
          backgroundSize: '100% 100%',
          display: 'block'
        };
        let logoNode = this.container.addNode(new paella.DomNode('div', btn.id, style));
        logoNode.domElement.className = "paella-profile-button";
        logoNode.domElement.data = {
          action: btn.onClick,
          profileData: profileData
        };
        $(logoNode.domElement).click(function (evt) {
          this.data.action.apply(this.data.profileData, [evt]);
          evt.stopPropagation();
          return false;
        });
      });
    }
  }

  function getClosestRect(profileData, videoDimensions) {
    var minDiff = 10;
    var re = /([0-9\.]+)\/([0-9\.]+)/;
    var result = profileData.rect[0];
    var videoAspectRatio = videoDimensions.h == 0 ? 1.777777 : videoDimensions.w / videoDimensions.h;
    var profileAspectRatio = 1;
    var reResult = false;
    profileData.rect.forEach(function (rect) {
      if (reResult = re.exec(rect.aspectRatio)) {
        profileAspectRatio = Number(reResult[1]) / Number(reResult[2]);
      }

      var diff = Math.abs(profileAspectRatio - videoAspectRatio);

      if (minDiff > diff) {
        minDiff = diff;
        result = rect;
      }
    });
    return result;
  }

  function applyProfileWithJson(profileData, animate) {
    if (animate == undefined) animate = true;
    if (!profileData) return;

    let getProfile = content => {
      let result = null;
      profileData && profileData.videos.some(videoProfile => {
        if (videoProfile.content == content) {
          result = videoProfile;
        }

        return result != null;
      });
      return result;
    };

    let applyVideoRect = (profile, videoData, videoWrapper, player) => {
      let frameStrategy = this.profileFrameStrategy;

      if (frameStrategy) {
        let rect = getClosestRect(profile, videoData.res);
        let videoSize = videoData.res;
        let containerSize = {
          width: $(this.domElement).width(),
          height: $(this.domElement).height()
        };
        let scaleFactor = rect.width / containerSize.width;
        let scaledVideoSize = {
          width: videoSize.w * scaleFactor,
          height: videoSize.h * scaleFactor
        };
        rect.left = Number(rect.left);
        rect.top = Number(rect.top);
        rect.width = Number(rect.width);
        rect.height = Number(rect.height);
        rect = frameStrategy.adaptFrame(scaledVideoSize, rect);
        let visible = /true/i.test(profile.visible);
        rect.visible = visible;
        let layer = parseInt(profile.layer);
        videoWrapper.domElement.style.zIndex = layer;
        videoWrapper.setRect(rect, animate);
        videoWrapper.setVisible(visible, animate); // The disable/enable functions may not be called on main audio player

        let isMainAudioPlayer = paella.player.videoContainer.streamProvider.mainAudioPlayer == player;
        visible ? player.enable(isMainAudioPlayer) : player.disable(isMainAudioPlayer);
      }
    };

    profileData && profileData.onApply();
    hideAllLogos.apply(this);
    profileData && showLogos.apply(this, [profileData.logos]);
    hideBackground.apply(this);
    profileData && showBackground.apply(this, [profileData.background]);
    hideButtons.apply(this);
    profileData && showButtons.apply(this, [profileData.buttons, profileData]);
    this.streamProvider.videoStreams.forEach((streamData, index) => {
      let profile = getProfile(streamData.content);
      let player = this.streamProvider.videoPlayers[index];
      let videoWrapper = this.videoWrappers[index];
      base.log.debug(`PROFILE: checking video '${streamData.content}', player '${player._stream.content}', profile '${profile}'`);

      if (profile) {
        player.getVideoData().then(data => {
          applyVideoRect(profile, data, videoWrapper, player);
        });
      } else if (videoWrapper) {
        videoWrapper.setVisible(false, animate);

        if (paella.player.videoContainer.streamProvider.mainAudioPlayer != player) {
          player.disable();
        }
      }
    });
  }

  class Profiles {
    constructor() {
      paella.events.bind(paella.events.controlBarDidHide, () => this.hideButtons());
      paella.events.bind(paella.events.controlBarDidShow, () => this.showButtons());
      paella.events.bind(paella.events.profileListChanged, () => {
        if (paella.player && paella.player.videoContainer && (!this.currentProfile || this.currentProfileName != this.currentProfile.id)) {
          this.setProfile(this.currentProfileName, false);
        }
      });
    }

    get profileList() {
      return g_profiles;
    }

    getDefaultProfile() {
      if (paella.player.videoContainer.masterVideo() && paella.player.videoContainer.masterVideo().defaultProfile()) {
        return paella.player.videoContainer.masterVideo().defaultProfile();
      }

      if (paella.player && paella.player.config && paella.player.config.defaultProfile) {
        return paella.player.config.defaultProfile;
      }

      return undefined;
    }

    loadProfile(profileId) {
      let result = null;
      g_profiles.some(profile => {
        if (profile.id == profileId) {
          result = profile;
        }

        return result;
      });
      return result;
    }

    get currentProfile() {
      return this.getProfile(this._currentProfileName);
    }

    get currentProfileName() {
      return this._currentProfileName;
    }

    setProfile(profileName, animate) {
      if (!profileName) {
        return false;
      }

      animate = base.userAgent.browser.Explorer ? false : animate;

      if (this.currentProfile) {
        this.currentProfile.onDeactivate();
      }

      if (!paella.player.videoContainer.ready) {
        return false; // Nothing to do, the video is not loaded
      } else {
        let profileData = this.loadProfile(profileName) || g_profiles.length > 0 && g_profiles[0];

        if (!profileData && g_profiles.length == 0) {
          // Try to load the profile again later, maybe the profiles are not loaded yet
          setTimeout(() => {
            this.setProfile(profileName, animate);
          }, 100);
          return false;
        } else {
          this._currentProfileName = profileName;
          applyProfileWithJson.apply(paella.player.videoContainer, [profileData, animate]);
          return true;
        }
      }
    }

    getProfile(profileName) {
      let result = null;
      this.profileList.some(p => {
        if (p.id == profileName) {
          result = p;
          return true;
        }
      });
      return result;
    }

    placeVideos() {
      this.setProfile(this._currentProfileName, false);
    }

    hideButtons() {
      $('.paella-profile-button').hide();
    }

    showButtons() {
      $('.paella-profile-button').show();
    }

  }

  paella.profiles = new Profiles();
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(function () {
  class VideoQualityStrategy {
    static Factory() {
      var config = paella.player.config;

      try {
        var strategyClass = config.player.videoQualityStrategy;
        var ClassObject = paella.utils.objectFromString(strategyClass);
        var strategy = new ClassObject();

        if (strategy instanceof paella.VideoQualityStrategy) {
          return strategy;
        }
      } catch (e) {}

      return null;
    }

    getParams() {
      return paella.player.config.player.videoQualityStrategyParams || {};
    }

    getQualityIndex(source) {
      if (source.length > 0) {
        return source[source.length - 1];
      } else {
        return source;
      }
    }

  }

  paella.VideoQualityStrategy = VideoQualityStrategy;

  class BestFitVideoQualityStrategy extends paella.VideoQualityStrategy {
    getQualityIndex(source) {
      var index = source.length - 1;

      if (source.length > 0) {
        var selected = source[0];
        var win_w = $(window).width();
        var win_h = $(window).height();
        var win_res = win_w * win_h;

        if (selected.res && selected.res.w && selected.res.h) {
          var selected_res = parseInt(selected.res.w) * parseInt(selected.res.h);
          var selected_diff = Math.abs(win_res - selected_res);

          for (var i = 0; i < source.length; ++i) {
            var res = source[i].res;

            if (res) {
              var m_res = parseInt(source[i].res.w) * parseInt(source[i].res.h);
              var m_diff = Math.abs(win_res - m_res);

              if (m_diff <= selected_diff) {
                selected_diff = m_diff;
                index = i;
              }
            }
          }
        }
      }

      return index;
    }

  }

  paella.BestFitVideoQualityStrategy = BestFitVideoQualityStrategy;

  class LimitedBestFitVideoQualityStrategy extends paella.VideoQualityStrategy {
    getQualityIndex(source) {
      var index = source.length - 1;
      var params = this.getParams();

      if (source.length > 0) {
        //var selected = source[0];
        var selected = null;
        var win_h = $(window).height();
        var maxRes = params.maxAutoQualityRes || 720;
        var diff = Number.MAX_VALUE;
        source.forEach(function (item, i) {
          if (item.res && item.res.h <= maxRes) {
            var itemDiff = Math.abs(win_h - item.res.h);

            if (itemDiff < diff) {
              selected = item;
              index = i;
            }
          }
        });
      }

      return index;
    }

  }

  paella.LimitedBestFitVideoQualityStrategy = LimitedBestFitVideoQualityStrategy;

  class VideoFactory {
    isStreamCompatible(streamData) {
      return false;
    }

    getVideoObject(id, streamData, rect) {
      return null;
    }

  }

  paella.VideoFactory = VideoFactory;
  paella.videoFactories = paella.videoFactories || {};
  paella.videoFactory = {
    _factoryList: [],
    initFactories: function () {
      if (paella.videoFactories) {
        var This = this;
        paella.player.config.player.methods.forEach(function (method) {
          if (method.enabled && paella.videoFactories[method.factory]) {
            This.registerFactory(new paella.videoFactories[method.factory]());
          }
        });
        this.registerFactory(new paella.videoFactories.EmptyVideoFactory());
      }
    },
    getVideoObject: function (id, streamData, rect) {
      if (this._factoryList.length == 0) {
        this.initFactories();
      }

      var selectedFactory = null;

      if (this._factoryList.some(function (factory) {
        if (factory.isStreamCompatible(streamData)) {
          selectedFactory = factory;
          return true;
        }
      })) {
        return selectedFactory.getVideoObject(id, streamData, rect);
      }

      return null;
    },
    registerFactory: function (factory) {
      this._factoryList.push(factory);
    }
  };
})();
(function () {
  class AudioElementBase extends paella.DomNode {
    constructor(id, stream) {
      super('div', id);
      this._stream = stream;
    }

    get stream() {
      return this._stream;
    }

    setAutoplay() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    load() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    play() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    pause() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    isPaused() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    duration() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    setCurrentTime(time) {
      return Promise.reject(new Error("no such compatible video player"));
    }

    currentTime() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    setVolume(volume) {
      return Promise.reject(new Error("no such compatible video player"));
    }

    volume() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    setPlaybackRate(rate) {
      return Promise.reject(new Error("no such compatible video player"));
    }

    playbackRate() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    unload() {
      return Promise.reject(new Error("no such compatible video player"));
    }

    getQualities() {
      return Promise.resolve([{
        index: 0,
        res: {
          w: 0,
          h: 1
        },
        src: "",
        toString: function () {
          return "";
        },
        shortLabel: function () {
          return "";
        },
        compare: function () {
          return 0;
        }
      }]);
    }

    getCurrentQuality() {
      return Promise.resolve(0);
    }

    defaultProfile() {
      return null;
    }

    supportAutoplay() {
      return false;
    }

  }

  ;
  paella.AudioElementBase = AudioElementBase;
  paella.audioFactories = {};

  class AudioFactory {
    isStreamCompatible(streamData) {
      return false;
    }

    getAudioObject(id, streamData) {
      return null;
    }

  }

  paella.AudioFactory = AudioFactory;
  paella.audioFactory = {
    _factoryList: [],
    initFactories: function () {
      if (paella.audioFactories) {
        var This = this;
        paella.player.config.player.audioMethods = paella.player.config.player.audioMethods || {};
        paella.player.config.player.audioMethods.forEach(function (method) {
          if (method.enabled) {
            This.registerFactory(new paella.audioFactories[method.factory]());
          }
        });
      }
    },
    getAudioObject: function (id, streamData) {
      if (this._factoryList.length == 0) {
        this.initFactories();
      }

      var selectedFactory = null;

      if (this._factoryList.some(function (factory) {
        if (factory.isStreamCompatible(streamData)) {
          selectedFactory = factory;
          return true;
        }
      })) {
        return selectedFactory.getAudioObject(id, streamData);
      }

      return null;
    },
    registerFactory: function (factory) {
      this._factoryList.push(factory);
    }
  };
})();

(function () {
  function checkReady(cb) {
    let This = this;
    return new Promise((resolve, reject) => {
      if (This._ready) {
        resolve(typeof cb == 'function' ? cb() : true);
      } else {
        function doCheck() {
          if (This.audio.readyState >= This.audio.HAVE_CURRENT_DATA) {
            This._ready = true;
            resolve(typeof cb == 'function' ? cb() : true);
          } else {
            setTimeout(doCheck, 50);
          }
        }

        doCheck();
      }
    });
  }

  class MultiformatAudioElement extends paella.AudioElementBase {
    constructor(id, stream) {
      super(id, stream);
      this._streamName = "audio";
      this._audio = document.createElement('audio');
      this.domElement.appendChild(this._audio);
    }

    get audio() {
      return this._audio;
    }

    setAutoplay(ap) {
      this.audio.autoplay = ap;
    }

    load() {
      var This = this;
      var sources = this._stream.sources[this._streamName];
      var stream = sources.length > 0 ? sources[0] : null;
      this.audio.innerText = "";

      if (stream) {
        var sourceElem = this.audio.querySelector('source');

        if (!sourceElem) {
          sourceElem = document.createElement('source');
          this.audio.appendChild(sourceElem);
        }

        sourceElem.src = stream.src;
        if (stream.type) sourceElem.type = stream.type;
        this.audio.load();
        return checkReady.apply(this, [function () {
          return stream;
        }]);
      } else {
        return Promise.reject(new Error("Could not load video: invalid quality stream index"));
      }
    }

    play() {
      return checkReady.apply(this, [() => {
        this.audio.play();
      }]);
    }

    pause() {
      return checkReady.apply(this, [() => {
        this.audio.pause();
      }]);
    }

    isPaused() {
      return checkReady.apply(this, [() => {
        return this.audio.paused;
      }]);
    }

    duration() {
      return checkReady.apply(this, [() => {
        return this.audio.duration;
      }]);
    }

    setCurrentTime(time) {
      return checkReady.apply(this, [() => {
        this.audio.currentTime = time;
      }]);
    }

    currentTime() {
      return checkReady.apply(this, [() => {
        return this.audio.currentTime;
      }]);
    }

    setVolume(volume) {
      return checkReady.apply(this, [() => {
        return this.audio.volume = volume;
      }]);
    }

    volume() {
      return checkReady.apply(this, [() => {
        return this.audio.volume;
      }]);
    }

    setPlaybackRate(rate) {
      return checkReady.apply(this, [() => {
        this.audio.playbackRate = rate;
      }]);
    }

    playbackRate() {
      return checkReady.apply(this, [() => {
        return this.audio.playbackRate;
      }]);
    }

    unload() {
      return Promise.resolve();
    }

  }

  ;
  paella.MultiformatAudioElement = MultiformatAudioElement;

  class MultiformatAudioFactory {
    isStreamCompatible(streamData) {
      return true;
    }

    getAudioObject(id, streamData) {
      return new paella.MultiformatAudioElement(id, streamData);
    }

  }

  paella.audioFactories.MultiformatAudioFactory = MultiformatAudioFactory;
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/

/* #DCE OPC-374, OPC-357 MATT-2502 override default video rectangle dimensions to fit extra wide live combo (still needed in Paella v6.2.0)*/

/* #DCE OPC-407 override setCurrent time and more video event debug logs */
(() => {
  paella.Profiles = {
    profileList: null,
    getDefaultProfile: function () {
      if (paella.player.videoContainer.masterVideo() && paella.player.videoContainer.masterVideo().defaultProfile()) {
        return paella.player.videoContainer.masterVideo().defaultProfile();
      }

      if (paella.player && paella.player.config && paella.player.config.defaultProfile) {
        return paella.player.config.defaultProfile;
      }

      return undefined;
    },
    loadProfile: function (profileName, onSuccessFunction) {
      var defaultProfile = this.getDefaultProfile();
      this.loadProfileList(function (data) {
        var profileData;

        if (data[profileName]) {
          // Successful mapping
          profileData = data[profileName];
        } else if (data[defaultProfile]) {
          // Fallback to default profile
          profileData = data[defaultProfile];
        } else {
          // Unable to find or map defaultProfile in profiles.json
          base.log.debug("Error loading the default profile. Check your Paella Player configuration");
          return false;
        }

        onSuccessFunction(profileData);
      });
    },
    loadProfileList: function (onSuccessFunction) {
      var thisClass = this;

      if (this.profileList == null) {
        var params = {
          url: paella.utils.folders.profiles() + "/profiles.json"
        };
        base.ajax.get(params, function (data, mimetype, code) {
          if (typeof data == "string") {
            data = JSON.parse(data);
          }

          thisClass.profileList = data;
          onSuccessFunction(thisClass.profileList);
        }, function (data, mimetype, code) {
          base.log.debug("Error loading video profiles. Check your Paella Player configuration");
        });
      } else {
        onSuccessFunction(thisClass.profileList);
      }
    }
  };

  class RelativeVideoSize {
    get w() {
      return this._w || 1280;
    }

    set w(v) {
      this._w = v;
    }

    get h() {
      return this._h || 720;
    }

    set h(v) {
      this._h = v;
    }

    proportionalHeight(newWidth) {
      // #DCE MATT-liveSizeWindow
      if (paella.dce && paella.dce.relativeVideoSize) {
        return Math.floor(paella.dce.relativeVideoSize.h * newWidth / paella.dce.relativeVideoSize.w);
      }

      return Math.floor(this.h * newWidth / this.w);
    }

    proportionalWidth(newHeight) {
      // #DCE MATT-liveSizedWindow
      if (paella.dce && paella.dce.relativeVideoSize) {
        return Math.floor(paella.dce.relativeVideoSize.w * newHeight / paella.dce.relativeVideoSize.h);
      }

      return Math.floor(this.w * newHeight / this.h);
    }

    percentVSize(pxSize) {
      // #DCE MATT-liveSizedWindow
      if (paella.dce && paella.dce.relativeVideoSize) {
        return pxSize * 100 / paella.dce.relativeVideoSize.h;
      }

      return pxSize * 100 / this.h;
    }

    percentWSize(pxSize) {
      // #DCE MATT-liveSizedWindow
      if (paella.dce && paella.dce.relativeVideoSize) {
        return pxSize * 100 / paella.dce.relativeVideoSize.w;
      }

      return pxSize * 100 / this.w;
    }

    aspectRatio() {
      // #DCE MATT-liveSizedWindow
      if (paella.dce && paella.dce.relativeVideoSize) {
        return paella.dce.relativeVideoSize.w / paella.dce.relativeVideoSize.h;
      }

      return this.w / this.h;
    }

  }

  paella.RelativeVideoSize = RelativeVideoSize;

  class VideoRect extends paella.DomNode {
    constructor(id, domType, left, top, width, height) {
      super(domType, id, {});
      let zoomSettings = paella.player.config.player.videoZoom || {};
      let zoomEnabled = (zoomSettings.enabled !== undefined ? zoomSettings.enabled : true) && this.allowZoom();
      this.style = zoomEnabled ? {
        width: this._zoom + '%',
        height: "100%",
        position: 'absolute'
      } : {
        width: "100%",
        height: "100%"
      };
      this._rect = null;
      let eventCapture = document.createElement('div');
      setTimeout(() => this.domElement.parentElement.appendChild(eventCapture), 10);
      eventCapture.style.position = "absolute";
      eventCapture.style.top = "0px";
      eventCapture.style.left = "0px";
      eventCapture.style.right = "0px";
      eventCapture.style.bottom = "0px";
      this.eventCapture = eventCapture;

      if (zoomEnabled) {
        this._zoomAvailable = true;

        function checkZoomAvailable() {
          let minWindowSize = paella.player.config.player && paella.player.config.player.videoZoom && paella.player.config.player.videoZoom.minWindowSize || 500;
          let available = $(window).width() >= minWindowSize;

          if (this._zoomAvailable != available) {
            this._zoomAvailable = available;
            paella.events.trigger(paella.events.zoomAvailabilityChanged, {
              available: available
            });
          }
        }

        checkZoomAvailable.apply(this);
        $(window).resize(() => {
          checkZoomAvailable.apply(this);
        });
        this._zoom = 100;
        this._mouseCenter = {
          x: 0,
          y: 0
        };
        this._mouseDown = {
          x: 0,
          y: 0
        };
        this._zoomOffset = {
          x: 0,
          y: 0
        };
        this._maxZoom = zoomSettings.max || 400;
        $(this.domElement).css({
          width: "100%",
          height: "100%",
          left: "0%",
          top: "0%"
        });
        Object.defineProperty(this, 'zoom', {
          get: function () {
            return this._zoom;
          }
        });
        Object.defineProperty(this, 'zoomOffset', {
          get: function () {
            return this._zoomOffset;
          }
        });

        function mousePos(evt) {
          return {
            x: evt.originalEvent.offsetX,
            y: evt.originalEvent.offsetY
          };
        }

        function wheelDelta(evt) {
          let wheel = evt.originalEvent.deltaY * (paella.utils.userAgent.Firefox ? 2 : 1);
          let maxWheel = 6;
          return -Math.abs(wheel) < maxWheel ? wheel : maxWheel * Math.sign(wheel);
        }

        function touchesLength(p0, p1) {
          return Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));
        }

        function centerPoint(p0, p1) {
          return {
            x: (p1.x - p0.x) / 2 + p0.x,
            y: (p1.y - p0.y) / 2 + p0.y
          };
        }

        function panImage(o) {
          let center = {
            x: this._mouseCenter.x - o.x * 1.1,
            y: this._mouseCenter.y - o.y * 1.1
          };
          let videoSize = {
            w: $(this.domElement).width(),
            h: $(this.domElement).height()
          };
          let maxOffset = this._zoom - 100;
          let offset = {
            x: center.x * maxOffset / videoSize.w * (maxOffset / 100),
            y: center.y * maxOffset / videoSize.h * (maxOffset / 100)
          };

          if (offset.x > maxOffset) {
            offset.x = maxOffset;
          } else if (offset.x < 0) {
            offset.x = 0;
          } else {
            this._mouseCenter.x = center.x;
          }

          if (offset.y > maxOffset) {
            offset.y = maxOffset;
          } else if (offset.y < 0) {
            offset.y = 0;
          } else {
            this._mouseCenter.y = center.y;
          }

          $(this.domElement).css({
            left: "-" + offset.x + "%",
            top: "-" + offset.y + "%"
          });
          this._zoomOffset = {
            x: offset.x,
            y: offset.y
          };
          paella.events.trigger(paella.events.videoZoomChanged, {
            video: this
          });
        }

        let touches = [];
        $(eventCapture).on('touchstart', evt => {
          if (!this.allowZoom() || !this._zoomAvailable) return;
          touches = [];
          let videoOffset = $(this.domElement).offset();

          for (let i = 0; i < evt.originalEvent.targetTouches.length; ++i) {
            let touch = evt.originalEvent.targetTouches[i];
            touches.push({
              x: touch.screenX - videoOffset.left,
              y: touch.screenY - videoOffset.top
            });
          }

          if (touches.length > 1) evt.preventDefault();
        });
        $(eventCapture).on('touchmove', evt => {
          if (!this.allowZoom() || !this._zoomAvailable) return;
          let curTouches = [];
          let videoOffset = $(this.domElement).offset();

          for (let i = 0; i < evt.originalEvent.targetTouches.length; ++i) {
            let touch = evt.originalEvent.targetTouches[i];
            curTouches.push({
              x: touch.screenX - videoOffset.left,
              y: touch.screenY - videoOffset.top
            });
          }

          if (curTouches.length > 1 && touches.length > 1) {
            let l0 = touchesLength(touches[0], touches[1]);
            let l1 = touchesLength(curTouches[0], curTouches[1]);
            let delta = l1 - l0;
            let center = centerPoint(touches[0], touches[1]);
            this._mouseCenter = center;
            this._zoom += delta;
            this._zoom = this._zoom < 100 ? 100 : this._zoom;
            this._zoom = this._zoom > this._maxZoom ? this._maxZoom : this._zoom;
            let newVideoSize = {
              w: $(this.domElement).width(),
              h: $(this.domElement).height()
            };
            let mouse = this._mouseCenter;
            $(this.domElement).css({
              width: this._zoom + '%',
              height: this._zoom + '%'
            });
            let maxOffset = this._zoom - 100;
            let offset = {
              x: mouse.x * maxOffset / newVideoSize.w,
              y: mouse.y * maxOffset / newVideoSize.h
            };
            offset.x = offset.x < maxOffset ? offset.x : maxOffset;
            offset.y = offset.y < maxOffset ? offset.y : maxOffset;
            $(this.domElement).css({
              left: "-" + offset.x + "%",
              top: "-" + offset.y + "%"
            });
            this._zoomOffset = {
              x: offset.x,
              y: offset.y
            };
            paella.events.trigger(paella.events.videoZoomChanged, {
              video: this
            });
            touches = curTouches;
            evt.preventDefault();
          } else if (curTouches.length > 0) {
            let desp = {
              x: curTouches[0].x - touches[0].x,
              y: curTouches[0].y - touches[0].y
            };
            panImage.apply(this, [desp]);
            touches = curTouches;
            evt.preventDefault();
          }
        });
        $(eventCapture).on('touchend', evt => {
          if (!this.allowZoom() || !this._zoomAvailable) return;
          if (touches.length > 1) evt.preventDefault();
        });

        this.zoomIn = () => {
          if (this._zoom >= this._maxZoom || !this._zoomAvailable) return;

          if (!this._mouseCenter) {
            this._mouseCenter = {
              x: $(this.domElement).width() / 2,
              y: $(this.domElement).height() / 2
            };
          }

          this._zoom += 25;
          this._zoom = this._zoom < 100 ? 100 : this._zoom;
          this._zoom = this._zoom > this._maxZoom ? this._maxZoom : this._zoom;
          let newVideoSize = {
            w: $(this.domElement).width(),
            h: $(this.domElement).height()
          };
          let mouse = this._mouseCenter;
          $(this.domElement).css({
            width: this._zoom + '%',
            height: this._zoom + '%'
          });
          let maxOffset = this._zoom - 100;
          let offset = {
            x: mouse.x * maxOffset / newVideoSize.w * (maxOffset / 100),
            y: mouse.y * maxOffset / newVideoSize.h * (maxOffset / 100)
          };
          offset.x = offset.x < maxOffset ? offset.x : maxOffset;
          offset.y = offset.y < maxOffset ? offset.y : maxOffset;
          $(this.domElement).css({
            left: "-" + offset.x + "%",
            top: "-" + offset.y + "%"
          });
          this._zoomOffset = {
            x: offset.x,
            y: offset.y
          };
          paella.events.trigger(paella.events.videoZoomChanged, {
            video: this
          });
        };

        this.zoomOut = () => {
          if (this._zoom <= 100 || !this._zoomAvailable) return;

          if (!this._mouseCenter) {
            this._mouseCenter = {
              x: $(this.domElement).width() / 2,
              y: $(this.domElement).height() / 2
            };
          }

          this._zoom -= 25;
          this._zoom = this._zoom < 100 ? 100 : this._zoom;
          this._zoom = this._zoom > this._maxZoom ? this._maxZoom : this._zoom;
          let newVideoSize = {
            w: $(this.domElement).width(),
            h: $(this.domElement).height()
          };
          let mouse = this._mouseCenter;
          $(this.domElement).css({
            width: this._zoom + '%',
            height: this._zoom + '%'
          });
          let maxOffset = this._zoom - 100;
          let offset = {
            x: mouse.x * maxOffset / newVideoSize.w * (maxOffset / 100),
            y: mouse.y * maxOffset / newVideoSize.h * (maxOffset / 100)
          };
          offset.x = offset.x < maxOffset ? offset.x : maxOffset;
          offset.y = offset.y < maxOffset ? offset.y : maxOffset;
          $(this.domElement).css({
            left: "-" + offset.x + "%",
            top: "-" + offset.y + "%"
          });
          this._zoomOffset = {
            x: offset.x,
            y: offset.y
          };
          paella.events.trigger(paella.events.videoZoomChanged, {
            video: this
          });
        };

        $(eventCapture).on('mousewheel wheel', evt => {
          if (!this.allowZoom() || !this._zoomAvailable) return;
          let mouse = mousePos(evt);
          let wheel = wheelDelta(evt);
          if (this._zoom >= this._maxZoom && wheel > 0) return;
          this._zoom += wheel;
          this._zoom = this._zoom < 100 ? 100 : this._zoom;
          this._zoom = this._zoom > this._maxZoom ? this._maxZoom : this._zoom;
          let newVideoSize = {
            w: $(this.domElement).width(),
            h: $(this.domElement).height()
          };
          $(this.domElement).css({
            width: this._zoom + '%',
            height: this._zoom + '%'
          });
          let maxOffset = this._zoom - 100;
          let offset = {
            x: mouse.x * maxOffset / newVideoSize.w * (maxOffset / 100),
            y: mouse.y * maxOffset / newVideoSize.h * (maxOffset / 100)
          };
          offset.x = offset.x < maxOffset ? offset.x : maxOffset;
          offset.y = offset.y < maxOffset ? offset.y : maxOffset;
          $(this.domElement).css({
            left: "-" + offset.x + "%",
            top: "-" + offset.y + "%"
          });
          this._zoomOffset = {
            x: offset.x,
            y: offset.y
          };
          paella.events.trigger(paella.events.videoZoomChanged, {
            video: this
          });
          this._mouseCenter = mouse;
          evt.stopPropagation();
          return false;
        });
        $(eventCapture).on('mousedown', evt => {
          this._mouseDown = mousePos(evt);
          this.drag = true;
        });
        $(eventCapture).on('mousemove', evt => {
          if (!this.allowZoom() || !this._zoomAvailable) return; //this.drag = evt.buttons>0;

          if (this.drag) {
            paella.player.videoContainer.disablePlayOnClick();
            let mouse = mousePos(evt);
            panImage.apply(this, [{
              x: mouse.x - this._mouseDown.x,
              y: mouse.y - this._mouseDown.y
            }]);
            this._mouseDown = mouse;
          }
        });
        $(eventCapture).on('mouseup', evt => {
          if (!this.allowZoom() || !this._zoomAvailable) return;
          this.drag = false;
          setTimeout(() => paella.player.videoContainer.enablePlayOnClick(), 10);
        });
        $(eventCapture).on('mouseleave', evt => {
          this.drag = false;
        });
      }
    }

    allowZoom() {
      return true;
    }

    setZoom(zoom, left, top, tween = 0) {
      if (this.zoomAvailable()) {
        this._zoomOffset.x = left;
        this._zoomOffset.y = top;
        this._zoom = zoom;

        if (tween == 0) {
          $(this.domElement).css({
            width: this._zoom + '%',
            height: this._zoom + '%',
            left: "-" + this._zoomOffset.x + "%",
            top: "-" + this._zoomOffset.y + "%"
          });
        } else {
          $(this.domElement).stop(true, false).animate({
            width: this._zoom + '%',
            height: this._zoom + '%',
            left: "-" + this._zoomOffset.x + "%",
            top: "-" + this._zoomOffset.y + "%"
          }, tween, "linear");
        }

        paella.events.trigger(paella.events.videoZoomChanged, {
          video: this
        });
      }
    }

    captureFrame() {
      return Promise.resolve(null);
    }

    supportsCaptureFrame() {
      return Promise.resolve(false);
    } // zoomAvailable will only return true if the zoom is enabled, the
    // video plugin supports zoom and the current video resolution is higher than
    // the current video size


    zoomAvailable() {
      return this.allowZoom() && this._zoomAvailable;
    }

    disableEventCapture() {
      this.eventCapture.style.pointerEvents = 'none';
    }

    enableEventCapture() {
      this.eventCapture.style.pointerEvents = '';
    }

  }

  paella.VideoRect = VideoRect;

  class VideoElementBase extends paella.VideoRect {
    constructor(id, stream, containerType, left, top, width, height) {
      super(id, containerType, left, top, width, height);
      this._stream = stream;
      this._ready = false;
      this._autoplay = false;
      this._videoQualityStrategy = null;
      if (this._stream.preview) this.setPosterFrame(this._stream.preview);
    }

    get ready() {
      return this._ready;
    }

    get stream() {
      return this._stream;
    }

    defaultProfile() {
      return null;
    } // Initialization functions


    setVideoQualityStrategy(strategy) {
      this._videoQualityStrategy = strategy;
    }

    setPosterFrame(url) {
      base.log.debug("TODO: implement setPosterFrame() function");
    }

    setAutoplay(autoplay) {
      this._autoplay = autoplay;
    }

    setMetadata(data) {
      this._metadata = data;
    }

    load() {
      return paella_DeferredNotImplemented();
    }

    supportAutoplay() {
      return true;
    } // Playback functions


    getVideoData() {
      return paella_DeferredNotImplemented();
    }

    play() {
      base.log.debug("TODO: implement play() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    pause() {
      base.log.debug("TODO: implement pause() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    isPaused() {
      base.log.debug("TODO: implement isPaused() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    duration() {
      base.log.debug("TODO: implement duration() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    setCurrentTime(time) {
      base.log.debug("TODO: implement setCurrentTime() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    currentTime() {
      base.log.debug("TODO: implement currentTime() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    setVolume(volume) {
      base.log.debug("TODO: implement setVolume() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    volume() {
      base.log.debug("TODO: implement volume() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    setPlaybackRate(rate) {
      base.log.debug("TODO: implement setPlaybackRate() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    playbackRate() {
      base.log.debug("TODO: implement playbackRate() function in your VideoElementBase subclass");
      return paella_DeferredNotImplemented();
    }

    getQualities() {
      return paella_DeferredNotImplemented();
    }

    setQuality(index) {
      return paella_DeferredNotImplemented();
    }

    getCurrentQuality() {
      return paella_DeferredNotImplemented();
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented(); // { width:X, height:Y }
    }

    goFullScreen() {
      return paella_DeferredNotImplemented();
    }

    freeze() {
      return paella_DeferredNotImplemented();
    }

    unFreeze() {
      return paella_DeferredNotImplemented();
    }

    disable(isMainAudioPlayer) {
      console.log("Disable video requested");
    }

    enable(isMainAudioPlayer) {
      console.log("Enable video requested");
    } // Utility functions


    setClassName(className) {
      this.domElement.className = className;
    }

    _callReadyEvent() {
      paella.events.trigger(paella.events.singleVideoReady, {
        sender: this
      });
    }

    _callUnloadEvent() {
      paella.events.trigger(paella.events.singleVideoUnloaded, {
        sender: this
      });
    }

  }

  paella.VideoElementBase = VideoElementBase;

  class EmptyVideo extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height) {
      super(id, stream, 'div', left, top, width, height);
    } // Initialization functions


    setPosterFrame(url) {}

    setAutoplay(auto) {}

    load() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    play() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    pause() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    isPaused() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    duration() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    setCurrentTime(time) {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    currentTime() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    setVolume(volume) {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    volume() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    setPlaybackRate(rate) {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    playbackRate() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    unFreeze() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    freeze() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    unload() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

    getDimensions() {
      return paella_DeferredRejected(new Error("no such compatible video player"));
    }

  }

  paella.EmptyVideo = EmptyVideo;

  class EmptyVideoFactory extends paella.VideoFactory {
    isStreamCompatible(streamData) {
      return true;
    }

    getVideoObject(id, streamData, rect) {
      return new paella.EmptyVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.EmptyVideoFactory = EmptyVideoFactory;

  class Html5Video extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height, streamName) {
      super(id, stream, 'video', left, top, width, height);
      /* #DCE OPC-374 if super (i.e. VideoBase) set value to poster frame, use that value */

      this._posterFrame = this._posterFrame || null;
      this._currentQuality = null;
      this._autoplay = false;
      this._streamName = streamName || 'mp4';
      this._playbackRate = 1; // #DCE OPC-407 the seeking state of this player (ref videoContainer's _isSeekingCount)

      this._isSeeking = false;

      if (this._stream.sources[this._streamName]) {
        this._stream.sources[this._streamName].sort(function (a, b) {
          return a.res.h - b.res.h;
        });
      }

      this.video.preload = "auto";
      this.video.setAttribute("playsinline", "");
      this.video.setAttribute("tabindex", "-1");

      function onProgress(event) {
        if (!this._ready && this.video.readyState == 4) {
          this._ready = true;

          if (this._initialCurrentTime !== undefined) {
            this.video.currentTime = this._initialCurrentTime;
            delete this._initialCurrentTime;
          }

          this._callReadyEvent();
        }
      } // #DCE OPC-407 utility log


      this.debugEventVideoStatus = event => {
        base.log.debug(`HTML5: video event '${event}' on '${this.stream.content}' (${this._identifier})  videoSeekingFlag = ${this._isSeeking}`);
      };

      let evtCallback = event => {
        onProgress.apply(this, [event]);
      };

      $(this.video).bind('progress', evtCallback);
      $(this.video).bind('loadstart', evtCallback);
      $(this.video).bind('loadedmetadata', evtCallback);
      $(this.video).bind('canplay', evtCallback);
      $(this.video).bind('oncanplay', evtCallback); // Save current time to resume video

      $(this.video).bind('timeupdate', evt => {
        this._resumeCurrentTime = this.video.currentTime;
        this.debugEventVideoStatus('timeupdate');
      });
      $(this.video).bind('ended', evt => {
        paella.events.trigger(paella.events.endVideo);
        this.debugEventVideoStatus('ended');
      });
      $(this.video).bind('emptied', evt => {
        // #DCE OPC-407
        if ((this._resumeCurrentTime == 0 || this._resumeCurrentTime) && !isNaN(this._resumeCurrentTime)) {
          this.video.currentTime = this._resumeCurrentTime;
        }

        this.debugEventVideoStatus('emptied');
      }); // #DCE OPC-407

      $(this.video).bind('seeking', evt => {
        this._isSeeking = true; // set seek flag for video

        this.debugEventVideoStatus('seeking');
      });
      $(this.video).bind('seeked', evt => {
        this._isSeeking = false; // update seek flag for video

        this.debugEventVideoStatus('seeked');
      });
      $(this.video).bind('stalled', evt => {
        // failed to fetch data, but still trying
        this.debugEventVideoStatus('stalled');
      });
      $(this.video).bind('waiting', evt => {
        this.debugEventVideoStatus('waiting');
      });
      $(this.video).bind('suspend', evt => {
        this.debugEventVideoStatus('suspend');
      });
      $(this.video).bind('loadeddata', evt => {
        this._isSeeking = false; // make sure seek flag is off

        this.debugEventVideoStatus('loadeddata');
      });
      $(this.video).bind('durationchange', evt => {
        // #DCE OPC-407 might happen during a seek?
        this.debugEventVideoStatus('durationchange');
      }); // Fix safari setQuality bug (UPV)

      if (paella.utils.userAgent.browser.Safari) {
        $(this.video).bind('canplay canplaythrough', evt => {
          (this._resumeCurrentTime == 0 || this._resumeCurrentTime) && (this.video.currentTime = this._resumeCurrentTime);
          this._isSeeking = false; // #DCE OPC-407 make sure seek flag is off

          this.debugEventVideoStatus('canplay canplaythrough');
        });
      }
    }

    get video() {
      return this.domElement;
    }

    get ready() {
      // Fix Firefox specific issue when video reaches the end
      if (paella.utils.userAgent.browser.Firefox && this.video.currentTime == this.video.duration && this.video.readyState == 2) {
        // #DCE OPC-407 log verification of call from FF
        base.log.debug(`DCE Firefox end of video check: currentTime=${this.video.currentTime}, duration=${this.video.duration}, readyState=${this.video.readyState}`);
        this.video.currentTime = 0;
      }

      if (this.video.currentTime > this.video.duration) {
        console.log(`DCE WARNING end of video check currentTime=${this.video.currentTime} is greater than duration=${this.video.duration}, readyState=${this.video.readyState}`);
      }

      return this.video.readyState >= 3;
    }

    _deferredAction(action) {
      return new Promise((resolve, reject) => {
        function processResult(actionResult) {
          if (actionResult instanceof Promise) {
            actionResult.then(p => resolve(p)).catch(err => reject(err));
          } else {
            resolve(actionResult);
          }
        }

        if (this.ready) {
          processResult(action());
        } else {
          $(this.video).bind('canplay', () => {
            // #DCE OPC-407, ensure ready state is set
            this._ready = true;
            processResult(action());
            $(this.video).unbind('canplay');
          });
        }
      });
    }

    _getQualityObject(index, s) {
      return {
        index: index,
        res: s.res,
        src: s.src,
        toString: function () {
          return this.res.w == 0 ? "auto" : this.res.w + "x" + this.res.h;
        },
        shortLabel: function () {
          return this.res.w == 0 ? "auto" : this.res.h + "p";
        },
        compare: function (q2) {
          return this.res.w * this.res.h - q2.res.w * q2.res.h;
        }
      };
    }

    captureFrame() {
      return new Promise(resolve => {
        resolve({
          source: this.video,
          width: this.video.videoWidth,
          height: this.video.videoHeight
        });
      });
    }

    supportsCaptureFrame() {
      return Promise.resolve(true);
    } // Initialization functions


    getVideoData() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._deferredAction(() => {
          resolve({
            duration: This.video.duration,
            currentTime: This.video.currentTime,
            volume: This.video.volume,
            paused: This.video.paused,
            ended: This.video.ended,
            res: {
              w: This.video.videoWidth,
              h: This.video.videoHeight
            }
          });
        });
      });
    }

    setPosterFrame(url) {
      this._posterFrame = url;
    }

    setAutoplay(auto) {
      this._autoplay = auto;

      if (auto && this.video) {
        this.video.setAttribute("autoplay", auto);
      }
    }

    load() {
      var This = this;
      var sources = this._stream.sources[this._streamName];

      if (this._currentQuality === null && this._videoQualityStrategy) {
        this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
      }

      var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
      this.video.innerText = "";

      if (stream) {
        var sourceElem = this.video.querySelector('source');

        if (!sourceElem) {
          sourceElem = document.createElement('source');
          this.video.appendChild(sourceElem);
        }

        if (this._posterFrame) {
          this.video.setAttribute("poster", this._posterFrame);
        }

        sourceElem.src = stream.src;
        sourceElem.type = stream.type;
        this.video.load();
        this.video.playbackRate = this._playbackRate;
        return this._deferredAction(function () {
          return stream;
        });
      } else {
        return paella_DeferredRejected(new Error("Could not load video: invalid quality stream index"));
      }
    }

    disable(isMainAudioPlayer) {
      // #DCE OPC-393
      base.log.debug(`PROFILE: About to disabled '${this._identifier}' '${this._stream.content}', isMainAudioPlayer=${isMainAudioPlayer}`);
      if (isMainAudioPlayer) return;
      this._isDisabled = true;
      this._playState = !this.video.paused;
      this.video.pause();
    }

    enable(isMainAudioPlayer) {
      // #DCE OPC-393
      base.log.debug(`PROFILE: About to enable '${this._identifier}' '${this._stream.content}', isMainAudioPlayer=${isMainAudioPlayer}`);
      if (isMainAudioPlayer || !this._isDisabled) return;
      this._isDisabled = false;
      let This = this;
      paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
        if (paella.dce && paella.dce.videoDataSingle) videoData = paella.dce.videoDataSingle; // #DCE OPC-407 master toggled so data no good, used saved dce data

        let currentTime = videoData.currentTime;
        let paused = videoData.paused;
        let duration = videoData.duration;
        let shorttime = parseFloat(currentTime).toFixed(3); // #DCE OPC-401 ensure videos are in synch

        if (shorttime < 0.1) shorttime = 0.1; //iOS protection

        paella.player.videoContainer.seekToTime(shorttime);

        if (paused) {
          if (This._playState) {
            base.log.debug(`PROFILE: Video '${This._identifier}' '${This._stream.content}' was playing, but leaving it in paused state like the main video.`);
          } // and make sure it's really paused


          This.video.pause();
        } else {
          This.video.play();
        }
      });
    }

    getQualities() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          var sources = this._stream.sources[this._streamName];
          var index = -1;
          sources.forEach(s => {
            index++;
            result.push(this._getQualityObject(index, s));
          }); // #DCE OPC-407

          base.log.debug(`HTML5 Resolving '${result.length}' getQualities for '${this._identifier}'  '${this.stream.content}'`);
          resolve(result);
        }, 10);
      });
    }

    setQuality(index) {
      return new Promise(resolve => {
        var paused = this.video.paused;
        var sources = this._stream.sources[this._streamName];
        this._currentQuality = index < sources.length ? index : 0;
        var currentTime = this.video.currentTime;
        let This = this;

        let onSeek = function () {
          This.unFreeze().then(() => {
            resolve();
            This.video.removeEventListener('seeked', onSeek, false);
          });
        };

        this.freeze().then(() => {
          return this.load();
        }).then(() => {
          if (!paused) {
            this.play();
          }

          this.video.addEventListener('seeked', onSeek);
          this.video.currentTime = currentTime;
        });
      });
    }

    getCurrentQuality() {
      return new Promise(resolve => {
        resolve(this._getQualityObject(this._currentQuality, this._stream.sources[this._streamName][this._currentQuality]));
      });
    }

    play() {
      return this._deferredAction(() => {
        if (!this._isDisabled) {
          return this.video.play();
        } else {
          return Promise.resolve();
        }
      });
    }

    pause() {
      return this._deferredAction(() => {
        if (!this._isDisabled) {
          return this.video.pause();
        } else {
          return Promise.resolve();
        }
      });
    }

    isPaused() {
      return this._deferredAction(() => {
        return this.video.paused;
      });
    }

    duration() {
      return this._deferredAction(() => {
        return this.video.duration;
      });
    }

    setCurrentTime(time) {
      time = parseFloat(time).toFixed(3); // #DCE OPC-407 simplify for Safari

      return new Promise(resolve => {
        let paused = this.video.paused;
        let currentTime = this.video.currentTime;
        let This = this;
        base.log.debug(`HTML5: in setCurrentTime for '${this.stream.content}' time '${time}' is already seeking = ${this._isSeeking}`);

        let onSeek = function () {
          base.log.debug(`HTML5: "seeked" event, before isPaused Test, seekToTime= ${time} '${This.stream.content}'`);
          This._isSeeking = false;
          This.getVideoData().then(videoData => {
            if (!paused) {
              // #DCE OPC-407 do not play until all players are seeked.
              paella.player.videoContainer.playIfNonAreSeeking(This);
            } else {
              paella.player.videoContainer._seekingPlayers.delete(This);
            }

            base.log.debug(`HTML5: setCurrentTime seeked ${time} '${This.stream.content}' is seeking = ${This._isSeeking} number of seeking players ${paella.player.videoContainer._seekingPlayers.size}`);
            This.video.removeEventListener('seeked', onSeek, false);
            resolve();
          });
        };

        if (!this._isSeeking && (time === 0 || time) && !isNaN(time)) {
          base.log.debug(`HTML5: setting is Seeking to TRUE for '${this.stream.content}' for time ${time}`);
          this._isSeeking = true;

          paella.player.videoContainer._seekingPlayers.add(this);

          this.pause().then(() => {
            base.log.debug(`HTML5: setCurrentTime on video element directly: ${time} '${this.stream.content}' was paused = ${paused}, is now paused = ${this.video.paused} currentTime = ${this.video.currentTime}`);
            this.video.addEventListener('seeked', onSeek); // #DCE OPC-407 Warning don't use '"video.fastSeek" here. It creates a target estimate and does not go to requested time in Safari

            this.video.currentTime = time;
          });
        }
      });
    } // #DCE OPC-407 end setCurrentTime


    currentTime() {
      return this._deferredAction(() => {
        return this.video.currentTime;
      });
    }

    setVolume(volume) {
      return this._deferredAction(() => {
        this.video.volume = volume;

        if (volume == 0) {
          this.video.setAttribute("muted", "muted");
          this.video.muted = true;
        } else {
          this.video.removeAttribute("muted");
          this.video.muted = false;
        }
      });
    }

    volume() {
      return this._deferredAction(() => {
        return this.video.volume;
      });
    }

    setPlaybackRate(rate) {
      return this._deferredAction(() => {
        this._playbackRate = rate;
        this.video.playbackRate = rate;
      });
    }

    playbackRate() {
      return this._deferredAction(() => {
        return this.video.playbackRate;
      });
    }

    supportAutoplay() {
      let macOS10_12_safari = paella.utils.userAgent.system.MacOS && paella.utils.userAgent.system.Version.minor >= 12 && paella.utils.userAgent.browser.Safari;
      let iOS = paella.utils.userAgent.system.iOS; // Autoplay does not work from Chrome version 64

      let chrome_v64 = paella.utils.userAgent.browser.Chrome && paella.utils.userAgent.browser.Version.major == 64;

      if (macOS10_12_safari || iOS || chrome_v64) {
        return false;
      } else {
        return true;
      }
    }

    goFullScreen() {
      return this._deferredAction(() => {
        var elem = this.video;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      });
    }

    unFreeze() {
      return this._deferredAction(() => {
        var c = document.getElementById(this._identifier + "canvas");

        if (c) {
          $(c).remove();
        }
      });
    }

    freeze() {
      var This = this;
      return this._deferredAction(function () {
        var canvas = document.createElement("canvas");
        canvas.id = This._identifier + "canvas";
        canvas.className = "freezeFrame";
        canvas.width = This.video.videoWidth;
        canvas.height = This.video.videoHeight;
        canvas.style.cssText = This.video.style.cssText;
        canvas.style.zIndex = 2;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(This.video, 0, 0, Math.ceil(canvas.width / 16) * 16, Math.ceil(canvas.height / 16) * 16); //Draw image

        This.video.parentElement.appendChild(canvas);
      });
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.Html5Video = Html5Video;

  paella.Html5Video.IsAutoplaySupported = function (debug = false) {
    return new Promise(resolve => {
      // Create video element to test autoplay
      var video = document.createElement('video');
      video.src = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAC+htZGF0AAACqQYF//+l3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1NSByMjkwMSA3ZDBmZjIyIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDEgbWU9ZGlhIHN1Ym1lPTEgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MCBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTAgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9MCB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTEga2V5aW50PTMyMCBrZXlpbnRfbWluPTMyIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByYz1jcmYgbWJ0cmVlPTAgY3JmPTQwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgcGJfcmF0aW89MS4zMCBhcT0xOjEuMDAAgAAAAJBliIQD/2iscx5avG2BdVkxRtUop8zs5zVIqfxQM03W1oVb8spYPP0yjO506xIxgVQ4iSPGOtcDZBVYGqcTatSa730A8XTpnUDpUSrpyaCe/P8eLds/XenOFYMh8UIGMBwzhVOniajqOPFOmmFC20nufGOpJw81hGhgFwCO6a8acwB0P6LNhZZoRD0y2AZMQfEA0AAHAAAACEGaIRiEP5eAANAABwDSGK8UmBURhUGyINeXiuMlXvJnPVVQKigqVGy8PAuVNiWY94iJ/jL/HeT+/usIfmc/dsQ/TV87CTfXhD8C/4xCP3V+DJP8UP3iJdT8okfAuRJF8zkPgh5/J7XzGT8o9pJ+tvlST+g3uwh1330Q9qd4IbnwOQ9dexCHf8mQfVJ57wET8acsIcn6UT6p7yoP2uQ97fFAhrNARXaou2QkEJxrmP6ZBa7TiE6Uqx04OcnChy+OrfwfRWfSYRbS2wmENdDIKUQSkggeXbLb10CIHL5BPgiBydo+HEEPILBbH9zZOdw/77EbN8euVRS/ZcjbZ/D63aLDh1MTme4vfGzFjXkw9r7U8EhcddAmwXGKjo9o53+/8Rnm1rnt6yh3hLD9/htcZnjjGcW9ZQlj6DKIGrrPo/l6C6NyeVr07mB/N6VlGb5fkLBZM42iUNiIGnMJzShmmlFtEsO0mr5CMcFiJdrZQjdIxsYwpU4xlzmD2+oPtjSLVZiDh2lHDRmHubAxXMROEt0z4GkcCYCk832HaXZSM+4vZbUwJa2ysgmfAQMTEM9gxxct7h5xLdrMnHUnB2bXMO2rEnqnnjWHyFYTrzmZTjJ3N4qP+Pv5VHYzZuAa9jnrg35h5hu/Q87uewVnjbJrtcOOm6b9lltPS6n/mkxgxSyqLJVzr/bYt039aTYyhmveJTdeiG7kLfmn9bqjXfxdfZoz53RDcxw+jP7n7TtT8BsB3jUvxe7n5Gbrm9/5QzQ3cxxl9s6ojDMDg3R7Bx//b5rwuSI84z2fuP8/nPxj/wvHNccSL3n77sCEv+AUwlVzHAFkYCkDkdRIORiUg5GJSDkYlIORgKQsjI9E1d0PUP5zV31MSkvI+AAAAAtBmkMYjP/4v5j6wQDGGK/rogCQL/+rZ+PHZ8R11ITSYLDLmXtUdt5a5V+63JHBE/z0/3cCf4av6uOAGtQmr8mCvCxwSI/c7KILm624qm/Kb4fKK5P1GWvX/S84SiSuyTIfk3zVghdRlzZpLZXgddiJjKTGb43OFQCup1nyCbjWgjmOozS6mXGEDsuoVDkSR7/Q8ErEhAZqgHJ5yCxkICvpE+HztDoOSTYiiBCW6shBKQM/Aw5DdbsGWUc/3XEIhH8HXJSDU8mZDApXSSZR+4fbKiOTUHmUgYd7HOLNG544Zy3F+ZPqxMwuGkCo/HxfLXrebdQakkweTwTqUgIDlwvPC181Z5eZ7cDTV905pDXGj/KiRAk3p+hlgHPvRW35PT4b163gUGkmIl0Ds4OBn6G64lkPsnQPNFs8AtwH4PSeYoz9s5uh/jFX0tlr7f+xzN6PuDvyOmKvYhdYK5FLAOkbJ6E/r7fxRZ1g63PPgeLsfir/0iq9K7IW+eWH4ONNCdL5oyV/TSILB+ob8z1ZWUf9p50jIFh6l64geGZ785/8OQanz95/ZPwGF03PMeYdkuH6x5Q/gcx5bg2RejM+RPQ6Vg6D43WOe+1fDKbVqr9P6Y5S9fuwD56fvq62ESHISopAae8/mbMD2la4/h/K9uSYuhxZDNszxgmQmd2kQDoEU6g46KneCXN/b9b5Ez/4iQOfBj4EuXyfp8MlAlFg8P486y4HT9H680pqN9xN164m7ReXPWHU7pw7F9Pw3FEDjQrHHnM3KfE8KWrl2JyxrdR90wr+HPPrkO5v1XT88+iU5MfGOeswl1uQxhiAGn4O62zaMJmDbSrMNY4LEV/jc+TjMQJRwOsUrW8aDyVoo87t8G+Qtfm6fOy6DNK9crM2f3KQJ0YEPc5JM0eSQsjYSFkZFIWRkUgcB1El5HwAAAAIAZ5iRCX/y4AA7liudRsNCYNGAb/ocSIJGilo13xUupVcYzmaVbkEY3nch7y9pfI1qxo3V9n9Q+r84e3e7dCfx+aLdD6S8dDaqzc6eqH9onVdingfJndPc1yaRhn4JD1jsj85o/le4m9cE2W1F8unegGNvOuknfzBmz4/Us9R+kC7xW5e9Z1Z9JsGeb/z6XkKkxiNh1C3Ns5jTVxB9x1poY49zmq+xsXNh0uy75DZf0JM9Uq8ghKrZiQDyAlHf4dqw48mtmlozgUMkh7VJ7vbIW1UNI81pRTT7C3WOOa3mw0RNjAoMLjtm1+VqQBEhHw+6VBvNTwCBkyvjU+kVMA1OU8elyGQX0xTlHRM8iPGg3CO8B5AzpOm2M7J75cG3PPGc42ztXyYzat3TyZ54CyDqZi1/Mn4B6T1fhMSD0uk5lKsOHIktX1Sfud/I3Ew+McUpwm3bxVdAy7uiGeiXWbe3cMBmCruk4yW18G6dEf9prnjcT6HUZG5bBSQGYSQscX2KCZoWxWkVS0w6IkwqdVJ+Akyey/Hl0MyrcAMI6Sgq3HMn95sBcc4ZadQLT31gNKo6qyebwmyK63HlMTK40Zj3FGuboBQ3Zsg87Jf3Gg1SDlG6fRVl2+5Cc6q+0OcUNRyCfLIG157ZHTSCwD9UpZtZDLki0BCLgAAAAhBmmQYiv+BgQDyne7dSHRhSQ/D31OEhh0h14FMQDwlvgJODIIYGxb7iHQo1mvJn3hOUUli9mTrUMuuPv/W2bsX3X7l9k7jtvT/Cuf4Kmbbhn0zmtjx7GWFyjrJfyHHxs5mxuTjdr2/drXoPhh1rb2XOnE9H3BdBqm1I+K5Sd1hYCevn6PbJcDyUHpysOZeLu+VoYklOlicG52cbxZbzvVeiS4jb+qyJoL62Ox+nSrUhOkCNMf8dz5iEi+C5iYZciyXk6gmIvSJVQDNTiO2i1a6pGORhiNVWGAMBHNHyHbmWtqB9AYbSdGR5qQzHnGF9HWaHfTzIqQMNEioRwE00KEllO+UcuPFmOs0Kl9lgy1DgKSKfGaaVFc7RNrn0nOddM6OfOG51GuoJSCnOpRjIvLAMAAAAA1NfU1+Ro9v/o+AANDABwAABedtb292AAAAbG12aGQAAAAA18kDNdfJAzUAAAPoAAAAowABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAACknRyYWsAAABcdGtoZAAAAAPXyQM118kDNQAAAAEAAAAAAAAAnwAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAOAAAACAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAJ8AABZEAAEAAAAAAgptZGlhAAAAIG1kaGQAAAAA18kDNdfJAzUAAV+QAAA3qlXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAG1bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABdXN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAOAAgAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQAr/4QAaZ01ACuyiLy+AtQYBBkAAAATAAAEsI8SJZYABAAVo74OcgAAAABhzdHRzAAAAAAAAAAEAAAAFAAALIgAAABRzdHNzAAAAAAAAAAEAAAABAAAAEXNkdHAAAAAAIBAQGBAAAAAwY3R0cwAAAAAAAAAEAAAAAgAAFkQAAAABAAAhZgAAAAEAAAsiAAAAAQAAFkQAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAKHN0c3oAAAAAAAAAAAAAAAUAAANBAAAADAAAAA8AAAAMAAAADAAAACRzdGNvAAAAAAAAAAUAAAAwAAADdQAABhAAAAjPAAAKyQAAAlp0cmFrAAAAXHRraGQAAAAD18kDNdfJAzUAAAACAAAAAAAAAKMAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAABzAAAIQAABAAAAAAG+bWRpYQAAACBtZGhkAAAAANfJAzXXyQM1AACsRAAAHABVxAAAAAAAJWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABNb25vAAAAAXFtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAATVzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAAAAAAAAAAABYCAgAISCAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAAHAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAwc3RzegAAAAAAAAAAAAAABwAAAAQAAAAEAAACiwAAArAAAAHuAAABNwAAAAQAAAAsc3RjbwAAAAAAAAAHAAADcQAAA4EAAAOFAAAGHwAACNsAAArVAAAMDAAAABpzZ3BkAQAAAHJvbGwAAAACAAAAAf//AAAAHHNiZ3AAAAAAcm9sbAAAAAEAAAAHAAAAAQAAABR1ZHRhAAAADG5hbWVNb25vAAAAb3VkdGEAAABnbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAA6aWxzdAAAADKpdG9vAAAAKmRhdGEAAAABAAAAAEhhbmRCcmFrZSAxLjEuMiAyMDE4MDkwNTAw';
      video.load(); //video.style.display = 'none';

      if (debug) {
        video.style = "position: fixed; top: 0px; right: 0px; z-index: 1000000;";
        document.body.appendChild(video);
      } else {
        video.style.display = 'none';
      }

      video.playing = false;
      video.play().then(status => {
        resolve(true);
      }).catch(err => {
        resolve(false);
      });
    });
  };

  class Html5VideoFactory {
    isStreamCompatible(streamData) {
      try {
        if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS && paella.utils.userAgent.system.Version.major <= 10 && paella.utils.userAgent.system.Version.minor < 3) {
          return false;
        }

        for (var key in streamData.sources) {
          if (key == 'mp4' || key == 'mp3') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      ++paella.videoFactories.Html5VideoFactory.s_instances;
      return new paella.Html5Video(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.Html5VideoFactory = Html5VideoFactory;
  paella.videoFactories.Html5VideoFactory.s_instances = 0;

  class ImageVideo extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height) {
      super(id, stream, 'img', left, top, width, height);
      this._posterFrame = null;
      this._currentQuality = null;
      this._currentTime = 0;
      this._duration = 0;
      this._ended = false;
      this._playTimer = null;
      this._playbackRate = 1;
      this._frameArray = null;

      this._stream.sources.image.sort(function (a, b) {
        return a.res.h - b.res.h;
      });
    }

    get img() {
      return this.domElement;
    }

    get imgStream() {
      this._stream.sources.image[this._currentQuality];
    }

    get _paused() {
      return this._playTimer == null;
    }

    _deferredAction(action) {
      return new Promise(resolve => {
        if (this.ready) {
          resolve(action());
        } else {
          var resolve = () => {
            this._ready = true;
            resolve(action());
          };

          $(this.video).bind('paella:imagevideoready', resolve);
        }
      });
    }

    _getQualityObject(index, s) {
      return {
        index: index,
        res: s.res,
        src: s.src,
        toString: function () {
          return Number(this.res.w) + "x" + Number(this.res.h);
        },
        shortLabel: function () {
          return this.res.h + "p";
        },
        compare: function (q2) {
          return Number(this.res.w) * Number(this.res.h) - Number(q2.res.w) * Number(q2.res.h);
        }
      };
    }

    _loadCurrentFrame() {
      var This = this;

      if (this._frameArray) {
        var frame = this._frameArray[0];

        this._frameArray.some(function (f) {
          if (This._currentTime < f.time) {
            return true;
          } else {
            frame = f.src;
          }
        });

        this.img.src = frame;
      }
    } // Initialization functions

    /*allowZoom:function() {
    	return false;
    },*/


    getVideoData() {
      return new Promise(resolve => {
        this._deferredAction(() => {
          let imgStream = this._stream.sources.image[this._currentQuality];
          var videoData = {
            duration: this._duration,
            currentTime: this._currentTime,
            volume: 0,
            paused: this._paused,
            ended: this._ended,
            res: {
              w: imgStream.res.w,
              h: imgStream.res.h
            }
          };
          resolve(videoData);
        });
      });
    }

    setPosterFrame(url) {
      this._posterFrame = url;
    }

    setAutoplay(auto) {
      this._autoplay = auto;

      if (auto && this.video) {
        this.video.setAttribute("autoplay", auto);
      }
    }

    load() {
      var This = this;
      var sources = this._stream.sources.image;

      if (this._currentQuality === null && this._videoQualityStrategy) {
        this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
      }

      var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;

      if (stream) {
        this._frameArray = [];

        for (var key in stream.frames) {
          var time = Math.floor(Number(key.replace("frame_", "")));

          this._frameArray.push({
            src: stream.frames[key],
            time: time
          });
        }

        this._frameArray.sort(function (a, b) {
          return a.time - b.time;
        });

        this._ready = true;
        this._currentTime = 0;
        this._duration = stream.duration;

        this._loadCurrentFrame();

        paella.events.trigger("paella:imagevideoready");
        return this._deferredAction(function () {
          return stream;
        });
      } else {
        return paella_DeferredRejected(new Error("Could not load video: invalid quality stream index"));
      }
    }

    supportAutoplay() {
      return true;
    }

    getQualities() {
      return new Promise(resolve => {
        setTimeout(() => {
          var result = [];
          var sources = this._stream.sources[this._streamName];
          var index = -1;
          sources.forEach(s => {
            index++;
            result.push(this._getQualityObject(index, s));
          });
          resolve(result);
        }, 10);
      });
    }

    setQuality(index) {
      return new Promise(resolve => {
        let paused = this._paused;
        let sources = this._stream.sources.image;
        this._currentQuality = index < sources.length ? index : 0;
        var currentTime = this._currentTime;
        this.load().then(function () {
          this._loadCurrentFrame();

          resolve();
        });
      });
    }

    getCurrentQuality() {
      return new Promise(resolve => {
        resolve(this._getQualityObject(this._currentQuality, this._stream.sources.image[this._currentQuality]));
      });
    }

    play() {
      let This = this;
      return this._deferredAction(() => {
        This._playTimer = new base.Timer(function () {
          This._currentTime += 0.25 * This._playbackRate;

          This._loadCurrentFrame();
        }, 250);
        This._playTimer.repeat = true;
      });
    }

    pause() {
      let This = this;
      return this._deferredAction(() => {
        This._playTimer.repeat = false;
        This._playTimer = null;
      });
    }

    isPaused() {
      return this._deferredAction(() => {
        return this._paused;
      });
    }

    duration() {
      return this._deferredAction(() => {
        return this._duration;
      });
    }

    setCurrentTime(time) {
      return this._deferredAction(() => {
        this._currentTime = time;

        this._loadCurrentFrame();
      });
    }

    currentTime() {
      return this._deferredAction(() => {
        return this._currentTime;
      });
    }

    setVolume(volume) {
      return this._deferredAction(function () {// No audo sources in image video
      });
    }

    volume() {
      return this._deferredAction(function () {
        // No audo sources in image video
        return 0;
      });
    }

    setPlaybackRate(rate) {
      return this._deferredAction(() => {
        this._playbackRate = rate;
      });
    }

    playbackRate() {
      return this._deferredAction(() => {
        return this._playbackRate;
      });
    }

    goFullScreen() {
      return this._deferredAction(() => {
        var elem = this.img;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      });
    }

    unFreeze() {
      return this._deferredAction(function () {});
    }

    freeze() {
      return this._deferredAction(function () {});
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.ImageVideo = ImageVideo;

  class ImageVideoFactory {
    isStreamCompatible(streamData) {
      try {
        for (var key in streamData.sources) {
          if (key == 'image') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      return new paella.ImageVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.ImageVideoFactory = ImageVideoFactory;
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/

/* #DCE OPC-374, OPC-357 MATT-2502 override default video rectangle dimensions to fit extra wide live combo */
(() => {
  class BackgroundContainer extends paella.DomNode {
    constructor(id, image) {
      super('img', id, {
        position: 'relative',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        zIndex: GlobalParams.background.zIndex
      });
      this.domElement.setAttribute('src', image);
      this.domElement.setAttribute('alt', '');
      this.domElement.setAttribute('width', '100%');
      this.domElement.setAttribute('height', '100%');
    }

    setImage(image) {
      this.domElement.setAttribute('src', image);
    }

  }

  paella.BackgroundContainer = BackgroundContainer;

  class VideoOverlay extends paella.DomNode {
    get size() {
      if (!this._size) {
        this._size = {
          w: 1280,
          h: 720
        };
      }

      return this._size;
    }

    constructor() {
      var style = {
        position: 'absolute',
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
        overflow: 'hidden',
        zIndex: 10
      };
      super('div', 'overlayContainer', style);
      this.domElement.setAttribute("role", "main");
    }

    _generateId() {
      return Math.ceil(Date.now() * Math.random());
    }

    enableBackgroundMode() {
      this.domElement.className = 'overlayContainer background';
    }

    disableBackgroundMode() {
      this.domElement.className = 'overlayContainer';
    }

    clear() {
      this.domElement.innerText = "";
    }

    getVideoRect(index) {
      return paella.player.videoContainer.getVideoRect(index);
    }

    addText(text, rect, isDebug) {
      var textElem = document.createElement('div');
      textElem.innerText = text;
      textElem.className = "videoOverlayText";
      if (isDebug) textElem.style.backgroundColor = "red";
      return this.addElement(textElem, rect);
    }

    addElement(element, rect) {
      this.domElement.appendChild(element);
      element.style.position = 'absolute';
      element.style.left = this.getHSize(rect.left) + '%';
      element.style.top = this.getVSize(rect.top) + '%';
      element.style.width = this.getHSize(rect.width) + '%';
      element.style.height = this.getVSize(rect.height) + '%';
      return element;
    }

    getLayer(id, zindex) {
      id = id || this._generateId();
      return $(this.domElement).find("#" + id)[0] || this.addLayer(id, zindex);
    }

    addLayer(id, zindex) {
      zindex = zindex || 10;
      var element = document.createElement('div');
      element.className = "row";
      element.id = id || this._generateId();
      return this.addElement(element, {
        left: 0,
        top: 0,
        width: 1280,
        height: 720
      });
    }

    removeLayer(id) {
      var elem = $(this.domElement).find("#" + id)[0];

      if (elem) {
        this.domElement.removeChild(elem);
      }
    }

    removeElement(element) {
      if (element) {
        try {
          this.domElement.removeChild(element);
        } catch (e) {}
      }
    }

    getVSize(px) {
      return px * 100 / this.size.h;
    }

    getHSize(px) {
      return px * 100 / this.size.w;
    }

  }

  paella.VideoOverlay = VideoOverlay;

  class VideoWrapper extends paella.DomNode {
    constructor(id, left, top, width, height) {
      var relativeSize = new paella.RelativeVideoSize(); // #DCE give full dimensions of initial video if sizes were not passed

      var percentTop = relativeSize.percentVSize(top) || 0 + '%';
      var percentLeft = relativeSize.percentWSize(left) || 0 + '%';
      var percentWidth = relativeSize.percentWSize(width) || 100 + '%';
      var percentHeight = relativeSize.percentVSize(height) || 100 + '%';
      var style = {
        top: percentTop,
        left: percentLeft,
        width: percentWidth,
        height: percentHeight,
        position: 'absolute',
        //zIndex: GlobalParams.video.zIndex, //#DCE use from style
        overflow: 'hidden'
      };
      super('div', id, style);
      this._rect = {
        left: left,
        top: top,
        width: width,
        height: height
      };
      this.domElement.className = "videoWrapper";
    }

    setRect(rect, animate) {
      this._rect = JSON.parse(JSON.stringify(rect));
      var relativeSize = new paella.RelativeVideoSize(); // #DCE MATT-2502 override the UPV default relative video container ratio
      // *ONLY* for the extra short and wide "3.55/1" ratio, 16x9+16x9 (32x9), DCE live stream.
      // The override has to be set globally for access by all instances of new paella.RelativeVideoSize().

      if (paella.dce && paella.player.videoContainer.isMonostream && rect.aspectRatio == "3.55/1") {
        // #DCE MH-relative size old style intercept of the paella.RelativeVideoSize()
        // #DCE OPC-357 TODO: hoping RelativeVideoSize.w and h can be overridden in newer Paella
        // [followup] Sadly no, still needed for UPV Paella v6.2.0
        paella.dce.relativeVideoSize = paella.dce.relativeVideoSize || {};
        paella.dce.relativeVideoSize.h = rect.height;
        paella.dce.relativeVideoSize.w = rect.width;
      }

      var percentTop = relativeSize.percentVSize(rect.top) + '%';
      var percentLeft = relativeSize.percentWSize(rect.left) + '%';
      var percentWidth = relativeSize.percentWSize(rect.width) + '%';
      var percentHeight = relativeSize.percentVSize(rect.height) + '%';
      var style = {
        top: percentTop,
        left: percentLeft,
        width: percentWidth,
        height: percentHeight,
        position: 'absolute'
      };

      if (animate) {
        this.disableClassName();
        var thisClass = this;
        $(this.domElement).animate(style, 400, function () {
          thisClass.enableClassName();
          paella.events.trigger(paella.events.setComposition, {
            video: thisClass
          });
        });
        this.enableClassNameAfter(400);
      } else {
        $(this.domElement).css(style);
        paella.events.trigger(paella.events.setComposition, {
          video: this
        });
      }
    }

    getRect() {
      return this._rect;
    }

    disableClassName() {
      this.classNameBackup = this.domElement.className;
      this.domElement.className = "";
    }

    enableClassName() {
      this.domElement.className = this.classNameBackup;
    }

    enableClassNameAfter(millis) {
      setTimeout("$('#" + this.domElement.id + "')[0].className = '" + this.classNameBackup + "'", millis);
    }

    setVisible(visible, animate) {
      if (typeof (visible == "string")) {
        visible = /true/i.test(visible) ? true : false;
      }

      if (visible && animate) {
        $(this.domElement).show();
        $(this.domElement).animate({
          opacity: 1.0
        }, 300);
      } else if (visible && !animate) {
        $(this.domElement).show();
      } else if (!visible && animate) {
        $(this.domElement).animate({
          opacity: 0.0
        }, 300);
      } else if (!visible && !animate) {
        $(this.domElement).hide();
      }
    }

    setLayer(layer) {
      this.domElement.style.zIndex = layer;
    }

  }

  paella.VideoWrapper = VideoWrapper;

  class VideoContainerBase extends paella.DomNode {
    constructor(id) {
      var style = {
        position: 'absolute',
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
        overflow: 'hidden'
      };
      super('div', id, style);
      this._trimming = {
        enabled: false,
        start: 0,
        end: 0
      };
      this.timeupdateEventTimer = null;
      this.timeupdateInterval = 250;
      this.masterVideoData = null;
      this.slaveVideoData = null;
      this.currentMasterVideoData = null;
      this.currentSlaveVideoData = null;
      this._maxSyncDelay = 0.3; // #DCE OPC-401

      this._syncHits = 0; // #DCE OPC-407

      this._videoSyncTimeMillis = 5000;
      this._force = false;
      this._playOnClickEnabled = true;
      this._seekDisabled = false;
      this._seekingPlayers = new Set(); //#DCE OPC-407 array of players in seeking state

      this._waitingToPlayPlayers = new Set(); //#DCE OPC-407 array of players in waiting to play state
      // #DCE OPC-401

      setTimeout(function () {
        let repeat = true;
        paella.player.videoContainer.syncVideos(repeat);
      }, this._videoSyncTimeMillis);
      $(this.domElement).click(evt => {
        // #DCE OPC-384 enable play button on screen for mobile
        // if (this.firstClick && base.userAgent.browser.IsMobileVersion) return;
        if (this.firstClick && !this._playOnClickEnabled) return;
        paella.player.videoContainer.paused().then(paused => {
          this.firstClick = true;

          if (paused) {
            paella.player.play();
          } else {
            paella.player.pause();
          }
        });
      });
      this.domElement.addEventListener("touchstart", event => {
        if (paella.player.controls) {
          paella.player.controls.restartHideTimer();
        }
      });
      let endedTimer = null;
      let thisClass = this; // #DCE OPC-407

      paella.events.bind(paella.events.endVideo, event => {
        // #DCE OPC-407 make sure state is paused and set to 0 time
        thisClass.pause();
        thisClass.seekToTime(0);

        if (endedTimer) {
          clearTimeout(endedTimer);
          endedTimer = null;
        }

        endedTimer = setTimeout(() => {
          paella.events.trigger(paella.events.ended);
        }, 1000);
      });
    }

    get seekDisabled() {
      return this._seekDisabled;
    }

    set seekDisabled(v) {
      let changed = v != this._seekDisabled;
      this._seekDisabled = v;

      if (changed) {
        paella.events.trigger(paella.events.seekAvailabilityChanged, {
          disabled: this._seekDisabled,
          enabled: !this._seekDisabled
        });
      }
    }

    get seekEnabled() {
      return !this._seekDisabled;
    }

    set seekEnabled(v) {
      let changed = v == this._seekDisabled;
      this._seekDisabled = !v;

      if (changed) {
        paella.events.trigger(paella.events.seekAvailabilityChanged, {
          disabled: this._seekDisabled,
          enabled: !this._seekDisabled
        });
      }
    } // #DCE OPC-407 only play if all players are not seeking


    playIfNonAreSeeking(player) {
      let seekingCount, waitingForPlayCount;
      if (!player || !player.stream) return;

      this._seekingPlayers.delete(player);

      this._waitingToPlayPlayers.add(player);

      seekingCount = this._seekingPlayers.size;
      waitingForPlayCount = this._waitingToPlayPlayers.size;
      base.log.debug(`HTML5: PLAY? playIfNonAreSeeking '${player.stream.content}' ('${player._identifier}'), seeking players: '${seekingCount}', waiting to player players: '${waitingForPlayCount}'.`); // #DCE OPC-407 helpful debugging

      this._waitingToPlayPlayers.forEach(p => base.log.debug(`HTML5: PLAY? Waiting to Play '${p.stream.content}'`));

      this._seekingPlayers.forEach(p => base.log.debug(`HTML5: PLAY? Still seeking '${p.stream.content}'`));

      if (seekingCount === 0) {
        this.currentTime().then(currentTime => {
          this._waitingToPlayPlayers.forEach(p => {
            let timeOffset = Math.abs(p.video.currentTime - currentTime);

            if (timeOffset > 0.5) {
              base.log.debug(`HTML5: PLAY? compensating for time offset '${timeOffset}' for '${p.stream.content}' '${p._identifier}'.`);
              p.video.currentTime = currentTime;
            }

            p.play();
            base.log.debug(`HTML5: PLAY? starting play for '${p.stream.content}' at '${p.video.currentTime}'.`);
          });

          this._waitingToPlayPlayers = new Set();
        });
      } else {
        base.log.debug(`HTML5: PLAY? there are '${seekingCount}' players still seeking, '${player.stream.content}' will wait until all finish seeking.`);
      }
    } // #DCE OPC-354, OPC-389, OPC-401
    // https://github.com/polimediaupv/paella/issues/447


    repeatSyncVideo(repeat) {
      repeat = repeat || true;
      let self = this;

      if (repeat) {
        setTimeout(function () {
          paella.player.videoContainer.syncVideos(true);
        }, self._videoSyncTimeMillis);
      }
    }

    syncVideos(repeat) {
      repeat = repeat || false;
      let self = this;

      if (paella.player.videoContainer._seekingPlayers.size > 0) {
        base.log.debug(`HTML5: Video Seek is already running, not synching Videos`);
        this.repeatSyncVideo(repeat);
        return;
      }

      if (base.userAgent.system.iPhone) {
        // #DCE only show one video on iPhone, for now, keep hiden one paused
        base.log.debug(`HTML5: Video synch disabled for iPhone, not synching Videos`);
        return;
      } // #DCE OPC-407 synch videos not matching the master


      paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
        let currentTime = videoData.currentTime;
        let streams = paella.player.videoContainer.streamProvider.videoPlayers;
        let promises = [];
        let updated = [];
        let shortbuffer = 0.1;
        let seekTime = shortbuffer;
        let isPaused = videoData.paused;
        streams.forEach(v => {
          if (paella.player.videoContainer.isMonostream || !v.video) {
            return;
          }

          if (v._isSeeking) {
            base.log.debug(`HTML5: Not synching video=${v._identifier}, content=${v._stream.content} is already seeking`);
            return;
          }

          let diff = Math.abs(v.video.currentTime - currentTime);
          base.log.debug(`HTML5-SYNC: About to check sync on '${v._stream.content}' (${v._identifier}) paused='${v.video.paused}' timediff=${diff} currentTime=${v.video.currentTime}`);

          if (v !== paella.player.videoContainer.streamProvider.mainAudioPlayer && !v.video.paused && diff > self._maxSyncDelay) {
            let seekTime = shortbuffer > currentTime ? shortbuffer : parseFloat(currentTime).toFixed(3);

            if (!isPaused) {
              seekTime += self._maxSyncDelay - shortbuffer; // add future buffer to catch running audio
            }

            base.log.debug(`HTML5: About to sync '${v._stream.content}' (${v._identifier}) paused=${v.video.paused}, timediff=${diff}, settingToTime=${seekTime}`);
            updated.push(v);
            promises.push(v.setCurrentTime(seekTime));
            self._syncHits++;
          }
        });
        Promise.all(promises).then(function () {
          if (updated.length > 0) {
            base.log.debug(`HTML5: Synced ${updated.length} videos for ${seekTime}, number of times synched = ${self._syncHits}`);
          }

          if (repeat) {
            setTimeout(function () {
              paella.player.videoContainer.syncVideos(true);
            }, self._videoSyncTimeMillis);
          }
        }).catch(error => {
          base.log.debug(`HTML5: Unable to synch video(s) to time '${seekTime}': ${error.message}`);
        });
      });
    }

    triggerTimeupdate() {
      var paused = 0;
      var duration = 0;
      this.paused().then(p => {
        paused = p;
        return this.duration();
      }).then(d => {
        duration = d;
        return this.currentTime();
      }).then(currentTime => {
        if (!paused || this._force) {
          this._force = false;
          paella.events.trigger(paella.events.timeupdate, {
            videoContainer: this,
            currentTime: currentTime,
            duration: duration
          });
        }
      });
    }

    startTimeupdate() {
      this.timeupdateEventTimer = new Timer(timer => {
        this.triggerTimeupdate();
      }, this.timeupdateInterval);
      this.timeupdateEventTimer.repeat = true;
    }

    stopTimeupdate() {
      if (this.timeupdateEventTimer) {
        this.timeupdateEventTimer.repeat = false;
      }

      this.timeupdateEventTimer = null;
    }

    enablePlayOnClick() {
      this._playOnClickEnabled = true;
    }

    disablePlayOnClick() {
      this._playOnClickEnabled = false;
    }

    isPlayOnClickEnabled() {
      return this._playOnClickEnabled;
    }

    play() {
      this.startTimeupdate();
      setTimeout(() => paella.events.trigger(paella.events.play), 50);
    }

    pause() {
      paella.events.trigger(paella.events.pause);
      this.stopTimeupdate();
    }

    seekTo(newPositionPercent) {
      if (this._seekDisabled) {
        console.log("Warning: Seek is disabled");
        return;
      }

      var thisClass = this; // #DCE OPC_407 start the seek load spinner

      paella.player.loader.seekload();
      base.log.debug(`HTML5: seekTo before, percent = ${newPositionPercent}`);
      this.setCurrentPercent(newPositionPercent).then(timeData => {
        // #DCE OPC_407 end the seek load spinner
        base.log.debug(`HTML5: seekTo after, percent = ${newPositionPercent}`);
        paella.player.loader.loadComplete();
        thisClass._force = true;
        this.triggerTimeupdate();
        paella.events.trigger(paella.events.seekToTime, {
          newPosition: timeData.time
        });
        paella.events.trigger(paella.events.seekTo, {
          newPositionPercent: newPositionPercent
        });
      });
    }

    seekToTime(time) {
      if (this._seekDisabled) {
        console.log("Seek is disabled");
        return;
      }

      base.log.debug(`HTML5: seekToTime before, time = ${time}`); //#DCE OPC-407 seek log

      this.setCurrentTime(time).then(timeData => {
        base.log.debug(`HTML5: seekToTime after, time = ${time}`); //#DCE OPC-407 seek log

        this._force = true;
        this.triggerTimeupdate();
        let percent = timeData.time * 100 / timeData.duration;
        paella.events.trigger(paella.events.seekToTime, {
          newPosition: timeData.time
        });
        paella.events.trigger(paella.events.seekTo, {
          newPositionPercent: percent
        });
      });
    }

    setPlaybackRate(params) {
      paella.events.trigger(paella.events.setPlaybackRate, {
        rate: params
      });
    }

    setVolume(params) {}

    volume() {
      return 1;
    }

    trimStart() {
      return new Promise(resolve => {
        resolve(this._trimming.start);
      });
    }

    trimEnd() {
      return new Promise(resolve => {
        resolve(this._trimming.end);
      });
    }

    trimEnabled() {
      return new Promise(resolve => {
        resolve(this._trimming.enabled);
      });
    }

    trimming() {
      return new Promise(resolve => {
        resolve(this._trimming);
      });
    }

    enableTrimming() {
      this._trimming.enabled = true;
      let cap = paella.captions.getActiveCaptions();
      if (cap !== undefined) paella.plugins.captionsPlugin.buildBodyContent(cap._captions, "list");
      paella.events.trigger(paella.events.setTrim, {
        trimEnabled: this._trimming.enabled,
        trimStart: this._trimming.start,
        trimEnd: this._trimming.end
      });
    }

    disableTrimming() {
      this._trimming.enabled = false;
      let cap = paella.captions.getActiveCaptions();
      if (cap !== undefined) paella.plugins.captionsPlugin.buildBodyContent(cap._captions, "list");
      paella.events.trigger(paella.events.setTrim, {
        trimEnabled: this._trimming.enabled,
        trimStart: this._trimming.start,
        trimEnd: this._trimming.end
      });
    }

    setTrimming(start, end) {
      return new Promise(resolve => {
        let currentTime = 0;
        this.currentTime(true).then(c => {
          currentTime = c;
          return this.duration();
        }).then(duration => {
          this._trimming.start = Math.floor(start);
          this._trimming.end = Math.floor(end);

          if (this._trimming.enabled) {
            if (currentTime < this._trimming.start) {
              this.setCurrentTime(0);
            }

            if (currentTime > this._trimming.end) {
              this.setCurrentTime(duration);
            }

            let cap = paella.captions.getActiveCaptions();
            if (cap !== undefined) paella.plugins.captionsPlugin.buildBodyContent(cap._captions, "list");
          }

          paella.events.trigger(paella.events.setTrim, {
            trimEnabled: this._trimming.enabled,
            trimStart: this._trimming.start,
            trimEnd: this._trimming.end
          });
          resolve();
        });
      });
    }

    setTrimmingStart(start) {
      return this.setTrimming(start, this._trimming.end);
    }

    setTrimmingEnd(end) {
      return this.setTrimming(this._trimming.start, end);
    }

    setCurrentPercent(percent) {
      var duration = 0;
      return new Promise(resolve => {
        this.duration().then(d => {
          duration = d;
          return this.trimming();
        }).then(trimming => {
          var position = 0;

          if (trimming.enabled) {
            var start = trimming.start;
            var end = trimming.end;
            duration = end - start;
            var trimedPosition = percent * duration / 100;
            position = parseFloat(trimedPosition);
          } else {
            position = percent * duration / 100;
          }

          base.log.debug(`HTML5: in setCurrentPercent '${percent}' before call setCurrentTime to '${position}'`); //#DCE OPC-407

          return this.setCurrentTime(position);
        }).then(function (timeData) {
          resolve(timeData);
        });
      });
    }

    setCurrentTime(time) {
      base.log.debug("VideoContainerBase.setCurrentTime(" + time + ")");
    }

    currentTime() {
      base.log.debug("VideoContainerBase.currentTime()");
      return 0;
    }

    duration() {
      base.log.debug("VideoContainerBase.duration()");
      return 0;
    }

    paused() {
      base.log.debug("VideoContainerBase.paused()");
      return true;
    }

    setupVideo(onSuccess) {
      base.log.debug("VideoContainerBase.setupVide()");
    }

    isReady() {
      base.log.debug("VideoContainerBase.isReady()");
      return true;
    }

    onresize() {
      super.onresize(onresize);
    }

  }

  paella.VideoContainerBase = VideoContainerBase; // Profile frame strategies

  class ProfileFrameStrategy {
    static Factory() {
      var config = paella.player.config;

      try {
        var strategyClass = config.player.profileFrameStrategy;
        var ClassObject = paella.utils.objectFromString(strategyClass);
        var strategy = new ClassObject();

        if (strategy instanceof paella.ProfileFrameStrategy) {
          return strategy;
        }
      } catch (e) {}

      return null;
    }

    valid() {
      return true;
    }

    adaptFrame(videoDimensions, frameRect) {
      return frameRect;
    }

  }

  paella.ProfileFrameStrategy = ProfileFrameStrategy;

  class LimitedSizeProfileFrameStrategy extends ProfileFrameStrategy {
    adaptFrame(videoDimensions, frameRect) {
      if (videoDimensions.width < frameRect.width || videoDimensions.height < frameRect.height) {
        var frameRectCopy = JSON.parse(JSON.stringify(frameRect));
        frameRectCopy.width = videoDimensions.width;
        frameRectCopy.height = videoDimensions.height;
        var diff = {
          w: frameRect.width - videoDimensions.width,
          h: frameRect.height - videoDimensions.height
        };
        frameRectCopy.top = frameRectCopy.top + diff.h / 2;
        frameRectCopy.left = frameRectCopy.left + diff.w / 2;
        return frameRectCopy;
      }

      return frameRect;
    }

  }

  paella.LimitedSizeProfileFrameStrategy = LimitedSizeProfileFrameStrategy;

  class StreamProvider {
    constructor(videoData) {
      this._mainStream = null;
      this._videoStreams = [];
      this._audioStreams = [];
      this._mainPlayer = null;
      this._audioPlayer = null;
      this._videoPlayers = [];
      this._audioPlayers = [];
      this._players = [];
      this._autoplay = base.parameters.get('autoplay') == 'true' || this.isLiveStreaming;
      this._startTime = 0;
    }

    init(videoData) {
      if (videoData.length == 0) throw Error("Empty video data.");
      this._videoData = videoData;

      if (!this._videoData.some(stream => {
        return stream.role == "master";
      })) {
        this._videoData[0].role = "master";
      }

      this._videoData.forEach((stream, index) => {
        stream.type = stream.type || 'video';

        if (stream.role == 'master') {
          this._mainStream = stream;
        }

        if (stream.type == 'video') {
          this._videoStreams.push(stream);
        } else if (stream.type == 'audio') {
          this._audioStreams.push(stream);
        }
      });

      if (this._videoStreams.length == 0) {
        throw new Error("No video streams found. Paella Player requires at least one video stream.");
      } // Create video players


      let autoplay = this.autoplay;

      this._videoStreams.forEach((videoStream, index) => {
        let rect = {
          x: 0,
          y: 0,
          w: 1280,
          h: 720
        };
        let player = paella.videoFactory.getVideoObject(`video_${index}`, videoStream, rect);
        player.setVideoQualityStrategy(this._qualityStrategy);
        player.setAutoplay(autoplay);

        if (videoStream == this._mainStream) {
          this._mainPlayer = player;
          this._audioPlayer = player;
        } else {
          player.setVolume(0);
        }

        this._videoPlayers.push(player);

        this._players.push(player);
      }); // Create audio player


      this._audioStreams.forEach((audioStream, index) => {
        let player = paella.audioFactory.getAudioObject(`audio_${index}`, audioStream);
        player.setAutoplay(autoplay);

        if (player) {
          this._audioPlayers.push(player);

          this._players.push(player);
        }
      });
    }

    loadVideos() {
      let promises = [];

      this._players.forEach(player => {
        promises.push(player.load());
      });

      return Promise.all(promises);
    }

    get startTime() {
      return this._startTime;
    }

    set startTime(s) {
      this._startTime = s;
    }

    get isMonostream() {
      return this._videoStreams.length == 1;
    }

    get mainStream() {
      return this._mainStream;
    }

    get videoStreams() {
      //return this._videoData;
      return this._videoStreams;
    }

    get audioStreams() {
      return this._audioStreams;
    }

    get streams() {
      return this._videoStreams.concat(this._audioStreams);
    }

    get videoPlayers() {
      return this._videoPlayers;
    }

    get audioPlayers() {
      return this._audioPlayers;
    }

    get players() {
      return this._videoPlayers.concat(this._audioPlayers);
    }

    callPlayerFunction(fnName) {
      let promises = [];
      let functionArguments = [];

      for (let i = 1; i < arguments.length; ++i) {
        functionArguments.push(arguments[i]);
      }

      this.players.forEach(player => {
        promises.push(player[fnName](...functionArguments));
        base.log.debug(`HTML5: Video pushing promise '${fnName}' args '${functionArguments}' on player '${player.stream.content}' '${player._identifier}'`);
      });
      return new Promise((resolve, reject) => {
        Promise.all(promises).then(() => {
          base.log.debug(`HTML5: promises finished '${fnName}' args '${functionArguments}'`);

          if (fnName == 'play' && !this._firstPlay) {
            this._firstPlay = true;

            if (this._startTime) {
              this.players.forEach(p => p.setCurrentTime(this._startTime));
            }
          }

          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    }

    get mainVideoPlayer() {
      return this._mainPlayer;
    }

    get mainAudioPlayer() {
      return this._audioPlayer;
    }

    get isLiveStreaming() {
      return paella.player.isLiveStream();
    }

    set qualityStrategy(strategy) {
      this._qualityStrategy = strategy;

      this._videoPlayers.forEach(player => {
        player.setVideoQualityStrategy(strategy);
      });
    }

    get qualityStrategy() {
      return this._qualityStrategy || null;
    }

    get autoplay() {
      return this.supportAutoplay && this._autoplay;
    }

    set autoplay(ap) {
      if (!this.supportAutoplay || this.isLiveStreaming) return;
      this._autoplay = ap;

      if (this.videoPlayers) {
        this.videoPlayers.forEach(player => player.setAutoplay(ap));
        this.audioPlayers.forEach(player => player.setAutoplay(ap));
      }
    }

    get supportAutoplay() {
      return this.videoPlayers.every(player => player.supportAutoplay());
    }

  }

  paella.StreamProvider = StreamProvider;

  function addVideoWrapper(id, videoPlayer) {
    let wrapper = new paella.VideoWrapper(id);
    wrapper.addNode(videoPlayer);
    this.videoWrappers.push(wrapper);
    this.container.addNode(wrapper);
    return wrapper;
  }

  class VideoContainer extends paella.VideoContainerBase {
    get streamProvider() {
      return this._streamProvider;
    }

    get ready() {
      return this._ready;
    }

    get isMonostream() {
      return this._streamProvider.isMonostream;
    }

    get trimmingHandler() {
      return this._trimmingHandler;
    }

    get videoWrappers() {
      return this._videoWrappers;
    }

    get container() {
      return this._container;
    }

    get profileFrameStrategy() {
      return this._profileFrameStrategy;
    }

    get sourceData() {
      return this._sourceData;
    }

    constructor(id) {
      super(id);
      this._streamProvider = new paella.StreamProvider();
      this._ready = false;
      this._videoWrappers = [];
      this._container = new paella.DomNode('div', 'playerContainer_videoContainer_container', {
        position: 'relative',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '1024px',
        height: '567px'
      });

      this._container.domElement.setAttribute('role', 'main');

      this.addNode(this._container);
      this.overlayContainer = new paella.VideoOverlay(this.domElement);
      this.container.addNode(this.overlayContainer);
      this.setProfileFrameStrategy(paella.ProfileFrameStrategy.Factory());
      this.setVideoQualityStrategy(paella.VideoQualityStrategy.Factory());
      this._audioTag = paella.player.config.player.defaultAudioTag || paella.dictionary.currentLanguage();
      this._audioPlayer = null;
      this._volume = 1;
    } // Playback and status functions


    play() {
      return new Promise((resolve, reject) => {
        this.streamProvider.startTime = this._startTime;
        this.streamProvider.callPlayerFunction('play').then(() => {
          super.play();
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    }

    pause() {
      return new Promise((resolve, reject) => {
        this.streamProvider.callPlayerFunction('pause').then(() => {
          super.pause();
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    }

    setCurrentTime(time) {
      return new Promise((resolve, reject) => {
        let wasPlaying = false;
        this.trimming().then(trimmingData => {
          if (trimmingData.enabled) {
            time += trimmingData.start;

            if (time < trimmingData.start) {
              time = trimmingData.start;
            }

            if (time > trimmingData.end) {
              time = trimmingData.end;
            }
          } //#DCE OPC-407 pause if not already paused before setting time


          return this.paused();
        }).then(paused => {
          if (!paused) {
            wasPlaying = true;
            return this.pause();
          } else {
            return Promise.resolve();
          }
        }).then(() => {
          return this.streamProvider.callPlayerFunction('setCurrentTime', time);
        }).then(() => {
          //#DCE OPC-407 play if was playing before setting time
          if (wasPlaying) {
            return this.play();
          } else {
            return Promise.resolve();
          }
        }).then(() => {
          return this.duration(false);
        }).then(duration => {
          resolve({
            time: time,
            duration: duration
          });
        }).catch(err => {
          reject(err);
        });
      });
    }

    currentTime(ignoreTrimming = false) {
      return new Promise(resolve => {
        let trimmingData = null;
        let p = ignoreTrimming ? Promise.resolve({
          enabled: false
        }) : this.trimming();
        p.then(t => {
          trimmingData = t; // #DCE protection from early load plugin logging

          if (!this.masterVideo()) {
            return 0;
          }

          return this.masterVideo().currentTime();
        }).then(time => {
          if (trimmingData.enabled) {
            time = time - trimmingData.start;
          }

          if (time < 0) time = 0;
          resolve(time);
        });
      });
    }

    setPlaybackRate(rate) {
      this.streamProvider.callPlayerFunction('setPlaybackRate', rate);
      super.setPlaybackRate(rate);
    }

    setVolume(params) {
      if (typeof params == 'object') {
        console.warn("videoContainer.setVolume(): set parameter as object is deprecated");
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          this._audioPlayer.setVolume(params).then(() => {
            paella.events.trigger(paella.events.setVolume, {
              master: params
            });
            resolve(params);
          }).catch(err => {
            reject(err);
          });
        });
      }
    }

    volume() {
      return this._audioPlayer.volume();
    }

    duration(ignoreTrimming = false) {
      return new Promise(resolve => {
        let trimmingData = null;
        let p = ignoreTrimming ? Promise.resolve({
          enabled: false
        }) : this.trimming();
        p.then(t => {
          trimmingData = t;
          return this.masterVideo().duration();
        }).then(duration => {
          if (trimmingData.enabled) {
            duration = trimmingData.end - trimmingData.start;
          }

          resolve(duration);
        });
      });
    }

    paused() {
      return this.masterVideo().isPaused();
    } // Video quality functions


    getQualities() {
      return this.masterVideo().getQualities();
    }

    setQuality(index) {
      let qualities = [];
      let promises = [];
      this.streamProvider.videoPlayers.forEach(player => {
        let playerData = {
          player: player,
          promise: player.getQualities()
        };
        qualities.push(playerData);
        promises.push(playerData.promise);
      });
      return new Promise(resolve => {
        let resultPromises = [];
        Promise.all(promises).then(() => {
          qualities.forEach(data => {
            data.promise.then(videoQualities => {
              let videoQuality = videoQualities.length > index ? index : videoQualities.length - 1;
              resultPromises.push(data.player.setQuality(videoQuality));
            });
          });
          return Promise.all(resultPromises);
        }).then(() => {
          //setTimeout(() => {
          paella.events.trigger(paella.events.qualityChanged);
          resolve(); //},10);
        });
      });
    }

    getCurrentQuality() {
      return this.masterVideo().getCurrentQuality();
    } // Current audio functions


    get audioTag() {
      return this._audioTag;
    }

    get audioPlayer() {
      return this._audioPlayer;
    }

    getAudioTags() {
      return new Promise(resolve => {
        let lang = [];
        let p = this.streamProvider.players;
        p.forEach(player => {
          if (player.stream.audioTag) {
            lang.push(player.stream.audioTag);
          }
        });
        resolve(lang);
      });
    }

    setAudioTag(lang) {
      return new Promise(resolve => {
        let audioSet = false;
        let promises = [];
        let This = this;
        let firstAudioPlayer = this.streamProvider.players.find(player => {
          return player.stream.audioTag == lang;
        });

        if (firstAudioPlayer) {
          audioSet = true;
          this._audioPlayer = firstAudioPlayer;
        } else {
          this.streamProvider.players.forEach(player => {
            if (!firstAudioPlayer) {
              firstAudioPlayer = player;
            }

            if (!audioSet && player.stream.audioTag == lang) {
              audioSet = true;
              this._audioPlayer = player;
            }

            promises.push(player.setVolume(0));
          });
        } // NOTE: The audio only streams must define a valid audio tag


        if (!audioSet && this.streamProvider.mainVideoPlayer) {
          this._audioPlayer = this.streamProvider.mainVideoPlayer;
        } else if (!audioSet && firstAudioPlayer) {
          this._audioPlayer = firstAudioPlayer;
        }

        Promise.all(promises).then(() => {
          return this._audioPlayer.setVolume(this._volume);
        }).then(() => {
          this._audioTag = this._audioPlayer.stream.audioTag;
          paella.events.trigger(paella.events.audioTagChanged);
          resolve();
        });
      });
    }

    setProfileFrameStrategy(strategy) {
      this._profileFrameStrategy = strategy;
    }

    setVideoQualityStrategy(strategy) {
      this.streamProvider.qualityStrategy = strategy;
    }

    autoplay() {
      return this.streamProvider.autoplay;
    }

    supportAutoplay() {
      return this.streamProvider.supportAutoplay;
    }

    setAutoplay(ap = true) {
      this.streamProvider.autoplay = ap;
      return this.streamProvider.supportAutoplay;
    }

    masterVideo() {
      return this.streamProvider.mainVideoPlayer || this.audioPlayer;
    }

    getVideoRect(videoIndex) {
      if (this.videoWrappers.length > videoIndex) {
        return this.videoWrappers[videoIndex].getRect();
      } else {
        throw new Error(`Video wrapper with index ${videoIndex} not found`);
      }
    }

    setStreamData(videoData) {
      var urlParamTime = base.parameters.get("time");
      var hashParamTime = base.hashParams.get("time");
      var timeString = hashParamTime ? hashParamTime : urlParamTime ? urlParamTime : "0s";
      var startTime = paella.utils.timeParse.timeToSeconds(timeString);

      if (startTime) {
        this._startTime = startTime;
      }

      videoData.forEach(stream => {
        for (var type in stream.sources) {
          let source = stream.sources[type];
          source.forEach(item => {
            if (item.res) {
              item.res.w = Number(item.res.w);
              item.res.h = Number(item.res.h);
            }
          });
        }
      });
      this._sourceData = videoData;
      return new Promise((resolve, reject) => {
        this.streamProvider.init(videoData);
        let streamDataAudioTag = null;
        videoData.forEach(video => {
          if (video.audioTag && streamDataAudioTag == null) {
            streamDataAudioTag = video.audioTag;
          }

          if (video.audioTag == this._audioTag) {
            streamDataAudioTag = this._audioTag;
          }
        });

        if (streamDataAudioTag != this._audioTag && streamDataAudioTag != null) {
          this._audioTag = streamDataAudioTag;
        }

        this.streamProvider.videoPlayers.forEach((player, index) => {
          addVideoWrapper.apply(this, ['videoPlayerWrapper_' + index, player]);
          player.setAutoplay(this.autoplay());
        });
        this.streamProvider.loadVideos().catch(err => {
          reject(err);
        }).then(() => {
          return this.setAudioTag(this.audioTag);
        }).then(() => {
          let endedTimer = null;
          let eventBindingObject = this.masterVideo().video || this.masterVideo().audio;
          $(eventBindingObject).bind('timeupdate', evt => {
            this.trimming().then(trimmingData => {
              let current = evt.currentTarget.currentTime;
              let duration = evt.currentTarget.duration;

              if (trimmingData.enabled) {
                current -= trimmingData.start;
                duration = trimmingData.end - trimmingData.start;
              }

              paella.events.trigger(paella.events.timeupdate, {
                videoContainer: this,
                currentTime: current,
                duration: duration
              });

              if (current >= duration) {
                // #DCE OPC-407 log end of video
                base.log.debug(`HTML5: end of video, about to pause and set all times to 0: currentTime=${current}, duration=${duration}`);
                this.streamProvider.callPlayerFunction('pause');
                this.streamProvider.callPlayerFunction('setCurrentTime', 0); // #DCE OPC-407 mimic 5x

                if (endedTimer) {
                  clearTimeout(endedTimer);
                  endedTimer = null;
                }

                endedTimer = setTimeout(() => {
                  paella.events.trigger(paella.events.ended);
                }, 1000);
              }
            });
          });
          this._ready = true;
          paella.events.trigger(paella.events.videoReady);
          let profileToUse = base.parameters.get('profile') || base.cookies.get('profile') || paella.profiles.getDefaultProfile();

          if (paella.profiles.setProfile(profileToUse, false)) {
            resolve();
          } else if (!paella.profiles.setProfile(paella.profiles.getDefaultProfile(), false)) {
            resolve();
          }
        });
      });
    }

    resizePortrait() {
      var width = paella.player.isFullScreen() == true ? $(window).width() : $(this.domElement).width();
      var relativeSize = new paella.RelativeVideoSize();
      var height = relativeSize.proportionalHeight(width);
      this.container.domElement.style.width = width + 'px';
      this.container.domElement.style.height = height + 'px';
      var containerHeight = paella.player.isFullScreen() == true ? $(window).height() : $(this.domElement).height();
      var newTop = containerHeight / 2 - height / 2;
      this.container.domElement.style.top = newTop + "px";
    }

    resizeLandscape() {
      var height = paella.player.isFullScreen() == true ? $(window).height() : $(this.domElement).height();
      var relativeSize = new paella.RelativeVideoSize();
      var width = relativeSize.proportionalWidth(height);
      this.container.domElement.style.width = width + 'px';
      this.container.domElement.style.height = height + 'px';
      this.container.domElement.style.top = '0px';
    }

    onresize() {
      super.onresize();
      var relativeSize = new paella.RelativeVideoSize();
      var aspectRatio = relativeSize.aspectRatio();
      var width = paella.player.isFullScreen() == true ? $(window).width() : $(this.domElement).width();
      var height = paella.player.isFullScreen() == true ? $(window).height() : $(this.domElement).height();
      var containerAspectRatio = width / height;

      if (containerAspectRatio > aspectRatio) {
        this.resizeLandscape();
      } else {
        this.resizePortrait();
      } //paella.profiles.setProfile(paella.player.selectedProfile,false)

    }

  }

  paella.VideoContainer = VideoContainer;
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(function () {
  class PluginManager {
    setupPlugin(plugin) {
      plugin.setup();
      this.enabledPlugins.push(plugin);

      if (eval("plugin instanceof paella.UIPlugin")) {
        plugin.checkVisibility();
      }
    }

    checkPluginsVisibility() {
      this.enabledPlugins.forEach(function (plugin) {
        if (eval("plugin instanceof paella.UIPlugin")) {
          plugin.checkVisibility();
        }
      });
    }

    constructor() {
      this.targets = null;
      this.pluginList = [];
      this.eventDrivenPlugins = [];
      this.enabledPlugins = [];
      this.doResize = true;
      this.targets = {};
      paella.events.bind(paella.events.loadPlugins, event => {
        this.loadPlugins("paella.DeferredLoadPlugin");
      });
      var timer = new base.Timer(() => {
        if (paella.player && paella.player.controls && this.doResize) paella.player.controls.onresize();
      }, 1000);
      timer.repeat = true;
    }

    setTarget(pluginType, target) {
      if (target.addPlugin) {
        this.targets[pluginType] = target;
      }
    }

    getTarget(pluginType) {
      // PluginManager can handle event-driven events:
      if (pluginType == "eventDriven") {
        return this;
      } else {
        var target = this.targets[pluginType];
        return target;
      }
    }

    registerPlugin(plugin) {
      // Registra los plugins en una lista y los ordena
      this.importLibraries(plugin);
      this.pluginList.push(plugin);
      this.pluginList.sort(function (a, b) {
        return a.getIndex() - b.getIndex();
      });
    }

    importLibraries(plugin) {
      plugin.getDependencies().forEach(function (lib) {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = 'javascript/' + lib + '.js';
        document.head.appendChild(script);
      });
    } // callback => function(plugin,pluginConfig)


    loadPlugins(pluginBaseClass) {
      if (pluginBaseClass != undefined) {
        var This = this;
        this.foreach(function (plugin, config) {
          // Prevent load a plugin twice
          if (plugin.isLoaded()) return;

          if (eval("plugin instanceof " + pluginBaseClass)) {
            if (config.enabled) {
              base.log.debug("Load plugin (" + pluginBaseClass + "): " + plugin.getName());
              plugin.config = config;
              plugin.load(This);
            }
          }
        });
      }
    }

    foreach(callback) {
      var enablePluginsByDefault = false;
      var pluginsConfig = {};

      try {
        enablePluginsByDefault = paella.player.config.plugins.enablePluginsByDefault;
      } catch (e) {}

      try {
        pluginsConfig = paella.player.config.plugins.list;
      } catch (e) {}

      this.pluginList.forEach(function (plugin) {
        var name = plugin.getName();
        var config = pluginsConfig[name];

        if (!config) {
          config = {
            enabled: enablePluginsByDefault
          };
        }

        callback(plugin, config);
      });
    }

    addPlugin(plugin) {
      // Prevent add a plugin twice
      if (plugin.__added__) return;
      plugin.__added__ = true;
      plugin.checkEnabled(isEnabled => {
        if (plugin.type == "eventDriven" && isEnabled) {
          paella.pluginManager.setupPlugin(plugin);
          this.eventDrivenPlugins.push(plugin);
          var events = plugin.getEvents();

          var eventBind = function (event, params) {
            plugin.onEvent(event.type, params);
          };

          for (var i = 0; i < events.length; ++i) {
            var eventName = events[i];
            paella.events.bind(eventName, eventBind);
          }
        }
      });
    }

    getPlugin(name) {
      for (var i = 0; i < this.pluginList.length; ++i) {
        if (this.pluginList[i].getName() == name) return this.pluginList[i];
      }

      return null;
    }

    registerPlugins() {
      g_pluginCallbackList.forEach(pluginCallback => {
        let PluginClass = pluginCallback();
        let pluginInstance = new PluginClass();

        if (pluginInstance.getInstanceName()) {
          paella.plugins = paella.plugins || {};
          paella.plugins[pluginInstance.getInstanceName()] = pluginInstance;
        }

        paella.pluginManager.registerPlugin(pluginInstance);
      });
    }

  }

  paella.PluginManager = PluginManager;
  paella.pluginManager = new paella.PluginManager();
  let g_pluginCallbackList = [];

  paella.addPlugin = function (cb) {
    g_pluginCallbackList.push(cb);
  };

  class Plugin {
    get type() {
      return "";
    }

    isLoaded() {
      return this.__loaded__;
    }

    getDependencies() {
      return [];
    }

    load(pluginManager) {
      if (this.__loaded__) return;
      this.__loaded__ = true;
      var target = pluginManager.getTarget(this.type);

      if (target && target.addPlugin) {
        target.addPlugin(this);
      }
    }

    getInstanceName() {
      return null;
    }

    getRootNode(id) {
      return null;
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    setup() {}

    getIndex() {
      return 0;
    }

    getName() {
      return "";
    }

  }

  paella.Plugin = Plugin;

  class FastLoadPlugin extends paella.Plugin {}

  class EarlyLoadPlugin extends paella.Plugin {}

  class DeferredLoadPlugin extends paella.Plugin {}

  paella.FastLoadPlugin = FastLoadPlugin;
  paella.EarlyLoadPlugin = EarlyLoadPlugin;
  paella.DeferredLoadPlugin = DeferredLoadPlugin;

  class PopUpContainer extends paella.DomNode {
    constructor(id, className) {
      var style = {};
      super('div', id, style);
      this.containers = null;
      this.currentContainerId = -1;
      this.domElement.className = className;
      this.containers = {};
    }

    hideContainer(identifier, button) {
      var container = this.containers[identifier];

      if (container && this.currentContainerId == identifier) {
        container.identifier = identifier;
        paella.events.trigger(paella.events.hidePopUp, {
          container: container
        });
        container.plugin.willHideContent();
        $(container.element).hide();
        container.button.className = container.button.className.replace(' selected', '');
        $(this.domElement).css({
          width: '0px'
        });
        this.currentContainerId = -1;
        container.plugin.didHideContent();
      }
    }

    showContainer(identifier, button) {
      var thisClass = this;
      var width = 0;

      function hideContainer(container) {
        paella.events.trigger(paella.events.hidePopUp, {
          container: container
        });
        container.plugin.willHideContent();
        $(container.element).hide();
        $(thisClass.domElement).css({
          width: '0px'
        });
        container.button.className = container.button.className.replace(' selected', '');
        thisClass.currentContainerId = -1;
        container.plugin.didHideContent();
      }

      function showContainer(container) {
        paella.events.trigger(paella.events.showPopUp, {
          container: container
        });
        container.plugin.willShowContent();
        container.button.className = container.button.className + ' selected';
        $(container.element).show();
        width = $(container.element).width();

        if (container.plugin.getAlignment() == 'right') {
          var right = $(button.parentElement).width() - $(button).position().left - $(button).width();
          $(thisClass.domElement).css({
            width: width + 'px',
            right: right + 'px',
            left: ''
          });
        } else {
          var left = $(button).position().left;
          $(thisClass.domElement).css({
            width: width + 'px',
            left: left + 'px',
            right: ''
          });
        }

        thisClass.currentContainerId = identifier;
        container.plugin.didShowContent();
      }

      var container = this.containers[identifier];

      if (container && this.currentContainerId != identifier && this.currentContainerId != -1) {
        var prevContainer = this.containers[this.currentContainerId];
        hideContainer(prevContainer);
        showContainer(container);
      } else if (container && this.currentContainerId == identifier) {
        hideContainer(container);
      } else if (container) {
        showContainer(container);
      }
    }

    registerContainer(identifier, domElement, button, plugin) {
      var containerInfo = {
        identifier: identifier,
        button: button,
        element: domElement,
        plugin: plugin
      };
      this.containers[identifier] = containerInfo;

      if (plugin.closeOnMouseOut && plugin.closeOnMouseOut()) {
        let popUpId = identifier;
        let btn = button;
        $(domElement).mouseleave(function (evt) {
          paella.player.controls.playbackControl().hidePopUp(popUpId, btn);
        });
      } // this.domElement.appendChild(domElement);


      $(domElement).hide();
      button.popUpIdentifier = identifier;
      button.sourcePlugin = plugin;
      $(button).click(function (event) {
        if (!this.plugin.isPopUpOpen()) {
          paella.player.controls.playbackControl().showPopUp(this.popUpIdentifier, this);
        } else {
          paella.player.controls.playbackControl().hidePopUp(this.popUpIdentifier, this);
        }
      });
      $(button).keyup(function (event) {
        if (event.keyCode == 13 && !this.plugin.isPopUpOpen()) {
          paella.player.controls.playbackControl().showPopUp(this.popUpIdentifier, this);
        } else if (event.keyCode == 27) {
          paella.player.controls.playbackControl().hidePopUp(this.popUpIdentifier, this);
        }
      });
      plugin.containerManager = this;
    }

  }

  paella.PopUpContainer = PopUpContainer;

  class TimelineContainer extends paella.PopUpContainer {
    hideContainer(identifier, button) {
      var container = this.containers[identifier];

      if (container && this.currentContainerId == identifier) {
        paella.events.trigger(paella.events.hidePopUp, {
          container: container
        });
        container.plugin.willHideContent();
        $(container.element).hide();
        container.button.className = container.button.className.replace(' selected', '');
        this.currentContainerId = -1;
        $(this.domElement).css({
          height: '0px'
        });
        container.plugin.didHideContent();
      }
    }

    showContainer(identifier, button) {
      var height = 0;
      var container = this.containers[identifier];

      if (container && this.currentContainerId != identifier && this.currentContainerId != -1) {
        var prevContainer = this.containers[this.currentContainerId];
        prevContainer.button.className = prevContainer.button.className.replace(' selected', '');
        container.button.className = container.button.className + ' selected';
        paella.events.trigger(paella.events.hidePopUp, {
          container: prevContainer
        });
        prevContainer.plugin.willHideContent();
        $(prevContainer.element).hide();
        prevContainer.plugin.didHideContent();
        paella.events.trigger(paella.events.showPopUp, {
          container: container
        });
        container.plugin.willShowContent();
        $(container.element).show();
        this.currentContainerId = identifier;
        height = $(container.element).height();
        $(this.domElement).css({
          height: height + 'px'
        });
        container.plugin.didShowContent();
      } else if (container && this.currentContainerId == identifier) {
        paella.events.trigger(paella.events.hidePopUp, {
          container: container
        });
        container.plugin.willHideContent();
        $(container.element).hide();
        container.button.className = container.button.className.replace(' selected', '');
        $(this.domElement).css({
          height: '0px'
        });
        this.currentContainerId = -1;
        container.plugin.didHideContent();
      } else if (container) {
        paella.events.trigger(paella.events.showPopUp, {
          container: container
        });
        container.plugin.willShowContent();
        container.button.className = container.button.className + ' selected';
        $(container.element).show();
        this.currentContainerId = identifier;
        height = $(container.element).height();
        $(this.domElement).css({
          height: height + 'px'
        });
        container.plugin.didShowContent();
      }
    }

  }

  paella.TimelineContainer = TimelineContainer;

  class UIPlugin extends paella.DeferredLoadPlugin {
    get ui() {
      return this._ui;
    }

    set ui(val) {
      this._ui = val;
    }

    checkVisibility() {
      var modes = this.config.visibleOn || [paella.PaellaPlayer.mode.standard, paella.PaellaPlayer.mode.fullscreen, paella.PaellaPlayer.mode.embed];
      var visible = false;
      modes.forEach(function (m) {
        if (m == paella.player.getPlayerMode()) {
          visible = true;
        }
      });

      if (visible) {
        this.showUI();
      } else {
        this.hideUI();
      }
    }

    hideUI() {
      this.ui.setAttribute('aria-hidden', 'true');
      $(this.ui).hide();
    }

    showUI() {
      var thisClass = this;
      paella.pluginManager.enabledPlugins.forEach(function (p) {
        if (p == thisClass) {
          thisClass.ui.setAttribute('aria-hidden', 'false');
          $(thisClass.ui).show();
        }
      });
    }

  }

  paella.UIPlugin = UIPlugin;

  class ButtonPlugin extends paella.UIPlugin {
    get type() {
      return 'button';
    }

    constructor() {
      super();
      this.subclass = '';
      this.container = null;
      this.containerManager = null;
    }

    getAlignment() {
      return 'left'; // or right
    } // Returns the button subclass.


    getSubclass() {
      return "myButtonPlugin";
    }

    getIconClass() {
      return "";
    }

    addSubclass($subclass) {
      $(this.container).addClass($subclass);
    }

    removeSubclass($subclass) {
      $(this.container).removeClass($subclass);
    }

    action(button) {// Implement this if you want to do something when the user push the plugin button
    }

    getName() {
      return "ButtonPlugin";
    }

    getMinWindowSize() {
      return this.config.minWindowSize || 0;
    }

    buildContent(domElement) {// Override if your plugin
    }

    willShowContent() {
      base.log.debug(this.getName() + " willDisplayContent");
    }

    didShowContent() {
      base.log.debug(this.getName() + " didDisplayContent");
    }

    willHideContent() {
      base.log.debug(this.getName() + " willHideContent");
    }

    didHideContent() {
      base.log.debug(this.getName() + " didHideContent");
    }

    getButtonType() {
      //return paella.ButtonPlugin.type.popUpButton;
      //return paella.ButtonPlugin.type.timeLineButton;
      return paella.ButtonPlugin.type.actionButton;
    }

    getText() {
      return "";
    }

    getAriaLabel() {
      return "";
    }

    setText(text) {
      this.container.innerHTML = '<span class="button-text">' + paella.AntiXSS.htmlEscape(text) + '</span>';

      if (this._i) {
        this.container.appendChild(this._i);
      }
    }

    hideButton() {
      this.hideUI();
    }

    showButton() {
      this.showUI();
    } // Utility functions: do not override


    changeSubclass(newSubclass) {
      this.subclass = newSubclass;
      this.container.className = this.getClassName();
    }

    changeIconClass(newClass) {
      this._i.className = 'button-icon ' + newClass;
    }

    getClassName() {
      return paella.ButtonPlugin.kClassName + ' ' + this.getAlignment() + ' ' + this.subclass;
    }

    getContainerClassName() {
      if (this.getButtonType() == paella.ButtonPlugin.type.timeLineButton) {
        return paella.ButtonPlugin.kTimeLineClassName + ' ' + this.getSubclass();
      } else if (this.getButtonType() == paella.ButtonPlugin.type.popUpButton) {
        return paella.ButtonPlugin.kPopUpClassName + ' ' + this.getSubclass();
      }
    }

    setToolTip(message) {
      this.button.setAttribute("title", message);
      this.button.setAttribute("aria-label", message);
    }

    getDefaultToolTip() {
      return "";
    }

    isPopUpOpen() {
      return this.button.popUpIdentifier == this.containerManager.currentContainerId;
    }

    getExpandableContent() {
      return null;
    }

    expand() {
      if (this._expand) {
        $(this._expand).show();
      }
    }

    contract() {
      if (this._expand) {
        $(this._expand).hide();
      }
    }

    static BuildPluginButton(plugin, id) {
      plugin.subclass = plugin.getSubclass();
      var elem = document.createElement('div');
      let ariaLabel = plugin.getAriaLabel();

      if (ariaLabel != "") {
        elem = document.createElement('button');
      }

      elem.className = plugin.getClassName();
      elem.id = id;
      let buttonText = document.createElement('span');
      buttonText.className = "button-text";
      buttonText.innerHTML = paella.AntiXSS.htmlEscape(plugin.getText());
      buttonText.plugin = plugin;
      elem.appendChild(buttonText);

      if (ariaLabel) {
        elem.setAttribute("tabindex", 1000 + plugin.getIndex());
        elem.setAttribute("aria-label", ariaLabel);
      }

      elem.setAttribute("alt", "");
      elem.plugin = plugin;
      plugin.button = elem;
      plugin.container = elem;
      plugin.ui = elem;
      plugin.setToolTip(plugin.getDefaultToolTip());
      let icon = document.createElement('i');
      icon.className = 'button-icon ' + plugin.getIconClass();
      icon.plugin = plugin;
      elem.appendChild(icon);
      plugin._i = icon;

      function onAction(self) {
        paella.userTracking.log("paella:button:action", self.plugin.getName());
        self.plugin.action(self);
      }

      $(elem).click(function (event) {
        onAction(this);
      });
      $(elem).keyup(function (event) {
        event.preventDefault();
      });
      $(elem).focus(function (event) {
        plugin.expand();
      });
      return elem;
    }

    static BuildPluginExpand(plugin, id) {
      let expandContent = plugin.getExpandableContent();

      if (expandContent) {
        let expand = document.createElement('span');
        expand.plugin = plugin;
        expand.className = 'expandable-content ' + plugin.getClassName();
        plugin._expand = expand;
        expand.appendChild(expandContent);
        $(plugin._expand).hide();
        return expand;
      }

      return null;
    }

    static BuildPluginPopUp(parent, plugin, id) {
      plugin.subclass = plugin.getSubclass();
      var elem = document.createElement('div');
      parent.appendChild(elem);
      elem.className = plugin.getContainerClassName();
      elem.id = id;
      elem.plugin = plugin;
      plugin.buildContent(elem);
      return elem;
    }

  }

  paella.ButtonPlugin = ButtonPlugin;
  paella.ButtonPlugin.alignment = {
    left: 'left',
    right: 'right'
  };
  paella.ButtonPlugin.kClassName = 'buttonPlugin';
  paella.ButtonPlugin.kPopUpClassName = 'buttonPluginPopUp';
  paella.ButtonPlugin.kTimeLineClassName = 'buttonTimeLine';
  paella.ButtonPlugin.type = {
    actionButton: 1,
    popUpButton: 2,
    timeLineButton: 3
  };

  class VideoOverlayButtonPlugin extends paella.ButtonPlugin {
    get type() {
      return 'videoOverlayButton';
    } // Returns the button subclass.


    getSubclass() {
      return "myVideoOverlayButtonPlugin" + " " + this.getAlignment();
    }

    action(button) {// Implement this if you want to do something when the user push the plugin button
    }

    getName() {
      return "VideoOverlayButtonPlugin";
    }

    get tabIndex() {
      return -1;
    }

  }

  paella.VideoOverlayButtonPlugin = VideoOverlayButtonPlugin;

  class EventDrivenPlugin extends paella.EarlyLoadPlugin {
    get type() {
      return 'eventDriven';
    }

    constructor() {
      super();
      var events = this.getEvents();

      for (var i = 0; i < events.length; ++i) {
        var event = events[i];

        if (event == paella.events.loadStarted) {
          this.onEvent(paella.events.loadStarted);
        }
      }
    }

    getEvents() {
      return [];
    }

    onEvent(eventType, params) {}

    getName() {
      return "EventDrivenPlugin";
    }

  }

  paella.EventDrivenPlugin = EventDrivenPlugin;
})();
(function () {
  function buildVideoCanvas(stream) {
    if (!paella.WebGLCanvas) {
      class WebGLCanvas extends bg.app.WindowController {
        constructor(stream) {
          super();
          this._stream = stream;
        }

        get canvasType() {
          return "video360";
        }

        get stream() {
          return this._stream;
        }

        get video() {
          return this.texture ? this.texture.video : null;
        }

        get camera() {
          return this._camera;
        }

        get texture() {
          return this._texture;
        }

        loaded() {
          return new Promise(resolve => {
            let checkLoaded = () => {
              if (this.video) {
                resolve(this);
              } else {
                setTimeout(checkLoaded, 100);
              }
            };

            checkLoaded();
          });
        }

        registerPlugins() {
          bg.base.Loader.RegisterPlugin(new bg.base.TextureLoaderPlugin());
          bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
          bg.base.Loader.RegisterPlugin(new bg.base.VWGLBLoaderPlugin());
        }

        loadVideoTexture() {
          return bg.base.Loader.Load(this.gl, this.stream.src);
        }

        buildVideoSurface(sceneRoot, videoTexture) {
          let sphere = bg.scene.PrimitiveFactory.Sphere(this.gl, 1, 50);
          let sphereNode = new bg.scene.Node(this.gl);
          sphereNode.addComponent(sphere);
          sphere.getMaterial(0).texture = videoTexture;
          sphere.getMaterial(0).lightEmission = 0;
          sphere.getMaterial(0).lightEmissionMaskInvert = false;
          sphere.getMaterial(0).cullFace = false;
          sphereNode.addComponent(new bg.scene.Transform(bg.Matrix4.Scale(1, -1, 1)));
          sceneRoot.addChild(sphereNode);
        }

        buildCamera() {
          let cameraNode = new bg.scene.Node(this.gl, "Camera");
          let camera = new bg.scene.Camera();
          cameraNode.addComponent(camera);
          cameraNode.addComponent(new bg.scene.Transform());
          let projection = new bg.scene.OpticalProjectionStrategy();
          projection.far = 100;
          projection.focalLength = 55;
          camera.projectionStrategy = projection;
          let oc = new bg.manipulation.OrbitCameraController();
          oc.maxPitch = 90;
          oc.minPitch = -90;
          oc.maxDistance = 0;
          oc.minDistance = 0;
          this._cameraController = oc;
          cameraNode.addComponent(oc);
          return cameraNode;
        }

        buildScene() {
          this._root = new bg.scene.Node(this.gl, "Root node");
          this.registerPlugins();
          this.loadVideoTexture().then(texture => {
            this._texture = texture;
            this.buildVideoSurface(this._root, texture);
          });
          let lightNode = new bg.scene.Node(this.gl, "Light");
          let light = new bg.base.Light();
          light.ambient = bg.Color.White();
          light.diffuse = bg.Color.Black();
          light.specular = bg.Color.Black();
          lightNode.addComponent(new bg.scene.Light(light));

          this._root.addChild(lightNode);

          let cameraNode = this.buildCamera();
          this._camera = cameraNode.component("bg.scene.Camera");

          this._root.addChild(cameraNode);
        }

        init() {
          bg.Engine.Set(new bg.webgl1.Engine(this.gl));
          this.buildScene();
          this._renderer = bg.render.Renderer.Create(this.gl, bg.render.RenderPath.FORWARD);
          this._inputVisitor = new bg.scene.InputVisitor();
        }

        frame(delta) {
          if (this.texture) {
            this.texture.update();
          }

          this._renderer.frame(this._root, delta);

          this.postReshape();
        }

        display() {
          this._renderer.display(this._root, this._camera);
        }

        reshape(width, height) {
          this._camera.viewport = new bg.Viewport(0, 0, width, height);

          if (!this._camera.projectionStrategy) {
            this._camera.projection.perspective(60, this._camera.viewport.aspectRatio, 0.1, 100);
          }
        }

        mouseDrag(evt) {
          this._inputVisitor.mouseDrag(this._root, evt);

          this.postRedisplay();
        }

        mouseWheel(evt) {
          this._inputVisitor.mouseWheel(this._root, evt);

          this.postRedisplay();
        }

        touchMove(evt) {
          this._inputVisitor.touchMove(this._root, evt);

          this.postRedisplay();
        }

        mouseDown(evt) {
          this._inputVisitor.mouseDown(this._root, evt);
        }

        touchStar(evt) {
          this._inputVisitor.touchStar(this._root, evt);
        }

        mouseUp(evt) {
          this._inputVisitor.mouseUp(this._root, evt);
        }

        mouseMove(evt) {
          this._inputVisitor.mouseMove(this._root, evt);
        }

        mouseOut(evt) {
          this._inputVisitor.mouseOut(this._root, evt);
        }

        touchEnd(evt) {
          this._inputVisitor.touchEnd(this._root, evt);
        }

      }

      paella.WebGLCanvas = WebGLCanvas;
    }

    return paella.WebGLCanvas;
  }

  let g_canvasCallbacks = {};
  let g_canvasClasses = {};

  paella.addCanvasPlugin = function (canvasType, canvasPluginCallback) {
    g_canvasCallbacks[canvasType] = canvasPluginCallback;
  };

  function loadCanvasPlugins() {
    for (let canvasType in g_canvasCallbacks) {
      g_canvasClasses[canvasType] = g_canvasCallbacks[canvasType]();
    }
  }

  paella.getVideoCanvas = function (type, stream) {
    return new Promise((resolve, reject) => {
      if (!window.$paella_bg) {
        paella.require(`${paella.baseUrl}javascript/bg2e-es2015.js`).then(() => {
          window.$paella_bg = bg;
          loadCanvasPlugins();
          resolve(buildVideoCanvas(stream));
        }).catch(err => {
          console.error(err);
          reject(err);
        });
      } else {
        resolve(buildVideoCanvas(stream));
      }
    });
  };
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(function () {
  class CaptionParserManager {
    addPlugin(plugin) {
      var self = this;
      var ext = plugin.ext;

      if ((Array.isArray && Array.isArray(ext) || ext instanceof Array) == false) {
        ext = [ext];
      }

      if (ext.length == 0) {
        base.log.debug("No extension provided by the plugin " + plugin.getName());
      } else {
        base.log.debug("New captionParser added: " + plugin.getName());
        ext.forEach(function (f) {
          self._formats[f] = plugin;
        });
      }
    }

    constructor() {
      this._formats = {};
      paella.pluginManager.setTarget('captionParser', this);
    }

  }

  let captionParserManager = new CaptionParserManager();

  class SearchCallback extends base.AsyncLoaderCallback {
    constructor(caption, text) {
      super();
      this.name = "captionSearchCallback";
      this.caption = caption;
      this.text = text;
    }

    load(onSuccess, onError) {
      this.caption.search(this.text, (err, result) => {
        if (err) {
          onError();
        } else {
          this.result = result;
          onSuccess();
        }
      });
    }

  }

  paella.captions = {
    parsers: {},
    _captions: {},
    _activeCaption: undefined,
    addCaptions: function (captions) {
      var cid = captions._captionsProvider + ':' + captions._id;
      this._captions[cid] = captions;
      paella.events.trigger(paella.events.captionAdded, cid);
    },
    getAvailableLangs: function () {
      var ret = [];
      var self = this;
      Object.keys(this._captions).forEach(function (k) {
        var c = self._captions[k];
        ret.push({
          id: k,
          lang: c._lang
        });
      });
      return ret;
    },
    getCaptions: function (cid) {
      if (cid && this._captions[cid]) {
        return this._captions[cid];
      }

      return undefined;
    },
    getActiveCaptions: function (cid) {
      return this._activeCaption;
    },
    setActiveCaptions: function (cid) {
      this._activeCaption = this.getCaptions(cid);

      if (this._activeCaption != undefined) {
        paella.events.trigger(paella.events.captionsEnabled, cid);
      } else {
        paella.events.trigger(paella.events.captionsDisabled);
      }

      return this._activeCaption;
    },
    getCaptionAtTime: function (cid, time) {
      var c = this.getCaptions(cid);

      if (c != undefined) {
        return c.getCaptionAtTime(time);
      }

      return undefined;
    },
    search: function (text, next) {
      var self = this;
      var asyncLoader = new base.AsyncLoader();
      this.getAvailableLangs().forEach(function (l) {
        asyncLoader.addCallback(new SearchCallback(self.getCaptions(l.id), text));
      });
      asyncLoader.load(function () {
        var res = [];
        Object.keys(asyncLoader.callbackArray).forEach(function (k) {
          res = res.concat(asyncLoader.getCallback(k).result);
        });
        if (next) next(false, res);
      }, function () {
        if (next) next(true);
      });
    }
  };

  class Caption {
    constructor(id, format, url, lang, next) {
      this._id = id;
      this._format = format;
      this._url = url;
      this._captions = undefined;
      this._index = undefined;

      if (typeof lang == "string") {
        lang = {
          code: lang,
          txt: lang
        };
      }

      this._lang = lang;
      this._captionsProvider = "downloadCaptionsProvider";
      this.reloadCaptions(next);
    }

    canEdit(next) {
      // next(err, canEdit)
      next(false, false);
    }

    goToEdit() {}

    reloadCaptions(next) {
      var self = this;
      jQuery.ajax({
        url: self._url,
        cache: false,
        type: 'get',
        dataType: "text"
      }).then(function (dataRaw) {
        var parser = captionParserManager._formats[self._format];

        if (parser == undefined) {
          base.log.debug("Error adding captions: Format not supported!");
          paella.player.videoContainer.duration(true).then(duration => {
            self._captions = [{
              id: 0,
              begin: 0,
              end: duration,
              content: base.dictionary.translate("Error! Captions format not supported.")
            }];

            if (next) {
              next(true);
            }
          });
        } else {
          parser.parse(dataRaw, self._lang.code, function (err, c) {
            if (!err) {
              self._captions = c;
              self._index = lunr(function () {
                var thisLunr = this;
                thisLunr.ref('id');
                thisLunr.field('content', {
                  boost: 10
                });

                self._captions.forEach(function (cap) {
                  thisLunr.add({
                    id: cap.id,
                    content: cap.content
                  });
                });
              });
            }

            if (next) {
              next(err);
            }
          });
        }
      }).fail(function (error) {
        base.log.debug("Error loading captions: " + self._url);

        if (next) {
          next(true);
        }
      });
    }

    getCaptions() {
      return this._captions;
    }

    getCaptionAtTime(time) {
      if (this._captions != undefined) {
        for (var i = 0; i < this._captions.length; ++i) {
          var l_cap = this._captions[i];

          if (l_cap.begin <= time && l_cap.end >= time) {
            return l_cap;
          }
        }
      }

      return undefined;
    }

    getCaptionById(id) {
      if (this._captions != undefined) {
        for (var i = 0; i < this._captions.length; ++i) {
          let l_cap = this._captions[i];

          if (l_cap.id == id) {
            return l_cap;
          }
        }
      }

      return undefined;
    }

    search(txt, next) {
      var self = this;

      if (this._index == undefined) {
        if (next) {
          next(true, "Error. No captions found.");
        }
      } else {
        var results = [];
        paella.player.videoContainer.trimming().then(trimming => {
          this._index.search(txt).forEach(function (s) {
            var c = self.getCaptionById(s.ref);

            if (trimming.enabled && (c.end < trimming.start || c.begin > trimming.end)) {
              return;
            }

            results.push({
              time: c.begin,
              content: c.content,
              score: s.score
            });
          });

          if (next) {
            next(false, results);
          }
        });
      }
    }

  }

  paella.captions.Caption = Caption;

  class CaptionParserPlugIn extends paella.FastLoadPlugin {
    get type() {
      return 'captionParser';
    }

    getIndex() {
      return -1;
    }

    get ext() {
      if (!this._ext) {
        this._ext = [];
      }

      return this._ext;
    }

    parse(content, lang, next) {
      throw new Error('paella.CaptionParserPlugIn#parse must be overridden by subclass');
    }

  }

  paella.CaptionParserPlugIn = CaptionParserPlugIn;
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(function () {
  var searchServiceManager = {
    _plugins: [],
    addPlugin: function (plugin) {
      this._plugins.push(plugin);
    },
    initialize: function () {
      paella.pluginManager.setTarget('SearchServicePlugIn', this);
    }
  };

  class SearchCallback extends base.AsyncLoaderCallback {
    constructor(plugin, text) {
      super();
      this.name = "searchCallback";
      this.plugin = plugin;
      this.text = text;
    }

    load(onSuccess, onError) {
      this.plugin.search(this.text, (err, result) => {
        if (err) {
          onError();
        } else {
          this.result = result;
          onSuccess();
        }
      });
    }

  }

  paella.searchService = {
    search: function (text, next) {
      let asyncLoader = new base.AsyncLoader();
      paella.userTracking.log("paella:searchService:search", text);

      searchServiceManager._plugins.forEach(function (p) {
        asyncLoader.addCallback(new SearchCallback(p, text));
      });

      asyncLoader.load(function () {
        var res = [];
        Object.keys(asyncLoader.callbackArray).forEach(function (k) {
          res = res.concat(asyncLoader.getCallback(k).result);
        });
        if (next) next(false, res);
      }, function () {
        if (next) next(true);
      });
    }
  };

  class SearchServicePlugIn extends paella.FastLoadPlugin {
    get type() {
      return 'SearchServicePlugIn';
    }

    getIndex() {
      return -1;
    }

    search(text, next) {
      throw new Error('paella.SearchServicePlugIn#search must be overridden by subclass');
    }

  }

  paella.SearchServicePlugIn = SearchServicePlugIn;
  searchServiceManager.initialize();
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/

/* #DCE OPC-407 override inherited class for SaverPlugIn from FastLoad to EarlyLoad so the videos will be initialized to avoid undefined errors */
(function () {
  var userTrackingManager = {
    _plugins: [],
    addPlugin: function (plugin) {
      plugin.checkEnabled(isEnabled => {
        if (isEnabled) {
          plugin.setup();

          this._plugins.push(plugin);
        }
      });
    },
    initialize: function () {
      paella.pluginManager.setTarget('userTrackingSaverPlugIn', this);
    }
  };
  paella.userTracking = {};
  userTrackingManager.initialize(); // #DCE OPC-407 load user tracking saver plugin after video elements are set (i.e. EarlyLoad versus FastLoad)

  class SaverPlugIn extends paella.EarlyLoadPlugin {
    get type() {
      return 'userTrackingSaverPlugIn';
    }

    getIndex() {
      return -1;
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    log(event, params) {
      throw new Error('paella.userTracking.SaverPlugIn#log must be overridden by subclass');
    }

  }

  paella.userTracking.SaverPlugIn = SaverPlugIn;
  var evsentsToLog = {};

  paella.userTracking.log = function (event, params) {
    if (evsentsToLog[event] != undefined) {
      evsentsToLog[event].cancel();
    }

    evsentsToLog[event] = new base.Timer(function (timer) {
      userTrackingManager._plugins.forEach(function (p) {
        p.log(event, params);
      });

      delete evsentsToLog[event];
    }, 500);
  }; //////////////////////////////////////////////////////////
  // Log automatic events
  //////////////////////////////////////////////////////////
  // Log simple events


  [paella.events.play, paella.events.pause, paella.events.endVideo, paella.events.showEditor, paella.events.hideEditor, paella.events.enterFullscreen, paella.events.exitFullscreen, paella.events.loadComplete].forEach(function (event) {
    paella.events.bind(event, function (ev, params) {
      paella.userTracking.log(event);
    });
  }); // Log show/hide PopUp

  [paella.events.showPopUp, paella.events.hidePopUp].forEach(function (event) {
    paella.events.bind(event, function (ev, params) {
      paella.userTracking.log(event, params.identifier);
    });
  }); // Log captions Events

  [// paella.events.captionAdded, 
  paella.events.captionsEnabled, paella.events.captionsDisabled].forEach(function (event) {
    paella.events.bind(event, function (ev, params) {
      var log;

      if (params != undefined) {
        var c = paella.captions.getCaptions(params);
        log = {
          id: params,
          lang: c._lang,
          url: c._url
        };
      }

      paella.userTracking.log(event, log);
    });
  }); // Log setProfile

  [paella.events.setProfile].forEach(function (event) {
    paella.events.bind(event, function (ev, params) {
      paella.userTracking.log(event, params.profileName);
    });
  }); // Log seek events

  [paella.events.seekTo, paella.events.seekToTime].forEach(function (event) {
    paella.events.bind(event, function (ev, params) {
      var log;

      try {
        JSON.stringify(params);
        log = params;
      } catch (e) {}

      paella.userTracking.log(event, log);
    });
  }); // Log param events

  [paella.events.setVolume, paella.events.resize, paella.events.setPlaybackRate, paella.events.qualityChanged].forEach(function (event) {
    paella.events.bind(event, function (ev, params) {
      var log;

      try {
        JSON.stringify(params);
        log = params;
      } catch (e) {}

      paella.userTracking.log(event, log);
    });
  });
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/

/* #DCE Override for embed control bar alignment and CS50 flexbox style*/
(() => {
  class TimeControl extends paella.DomNode {
    constructor(id) {
      super('div', id, {
        left: "0%"
      });
      this.domElement.className = 'timeControlOld';
      this.domElement.className = 'timeControl'; //this.domElement.innerText = "0:00:00";

      var thisClass = this;
      paella.events.bind(paella.events.timeupdate, function (event, params) {
        thisClass.onTimeUpdate(params);
      });
    }

    onTimeUpdate(memo) {
      this.domElement.innerText = this.secondsToHours(parseInt(memo.currentTime));
    }

    secondsToHours(sec_numb) {
      var hours = Math.floor(sec_numb / 3600);
      var minutes = Math.floor((sec_numb - hours * 3600) / 60);
      var seconds = sec_numb - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return hours + ':' + minutes + ':' + seconds;
    }

  }

  paella.TimeControl = TimeControl;

  class PlaybackBar extends paella.DomNode {
    constructor(id) {
      var style = {};
      super('div', id, style);
      this.playbackFullId = '';
      this.updatePlayBar = true;
      this.timeControlId = '';
      this._images = null;
      this._keys = null;
      this._prev = null;
      this._next = null;
      this._videoLength = null;
      this._lastSrc = null;
      this._aspectRatio = 1.777777778;
      this._hasSlides = null;
      this._imgNode = null;
      this._canvas = null;
      this.domElement.className = "playbackBar";
      this.domElement.setAttribute("alt", ""); //this.domElement.setAttribute("title", "Timeline Slider");

      this.domElement.setAttribute("aria-label", "Timeline Slider");
      this.domElement.setAttribute("role", "slider");
      this.domElement.setAttribute("aria-valuemin", "0");
      this.domElement.setAttribute("aria-valuemax", "100");
      this.domElement.setAttribute("aria-valuenow", "0");
      this.domElement.setAttribute("tabindex", "1100");
      $(this.domElement).keyup(event => {
        var currentTime = 0;
        var duration = 0;
        paella.player.videoContainer.currentTime().then(t => {
          currentTime = t;
          return paella.player.videoContainer.duration();
        }).then(d => {
          duration = d;
          var curr, selectedPosition;

          switch (event.keyCode) {
            case 37:
              //Left
              curr = 100 * currentTime / duration;
              selectedPosition = curr - 5;
              paella.player.videoContainer.seekTo(selectedPosition);
              break;

            case 39:
              //Right
              curr = 100 * currentTime / duration;
              selectedPosition = curr + 5;
              paella.player.videoContainer.seekTo(selectedPosition);
              break;
          }
        });
      });
      this.playbackFullId = id + "_full";
      this.timeControlId = id + "_timeControl";
      var playbackFull = new paella.DomNode('div', this.playbackFullId, {
        width: '0%'
      });
      playbackFull.domElement.className = "playbackBarFull";
      this.addNode(playbackFull);
      this.addNode(new paella.TimeControl(this.timeControlId));
      var thisClass = this;
      paella.events.bind(paella.events.timeupdate, function (event, params) {
        thisClass.onTimeUpdate(params);
      });
      $(this.domElement).bind('mousedown', function (event) {
        paella.utils.mouseManager.down(thisClass, event);
        event.stopPropagation();
      });
      $(playbackFull.domElement).bind('mousedown', function (event) {
        paella.utils.mouseManager.down(thisClass, event);
        event.stopPropagation();
      });

      if (!base.userAgent.browser.IsMobileVersion) {
        $(this.domElement).bind('mousemove', function (event) {
          thisClass.movePassive(event);
          paella.utils.mouseManager.move(event);
        });
        $(playbackFull.domElement).bind('mousemove', function (event) {
          paella.utils.mouseManager.move(event);
        });
        $(this.domElement).bind("mouseout", function (event) {
          thisClass.mouseOut(event);
        });
      }

      $(this.domElement).bind('mouseup', function (event) {
        paella.utils.mouseManager.up(event);
      });
      $(playbackFull.domElement).bind('mouseup', function (event) {
        paella.utils.mouseManager.up(event);
      });

      if (paella.player.isLiveStream()) {
        // #DCE start, need CS50 inline playback bar to take up space during live event
        // $(this.domElement).hide();
        $(this.domElement).css("visibility", "hidden"); // #DCE end, swapped paella5's jQuery ".hide()" (display:none) for DCE CS50's visibility hidden
      }

      paella.events.bind(paella.events.seekAvailabilityChanged, (e, data) => {
        if (data.enabled) {
          $(playbackFull.domElement).removeClass("disabled");
        } else {
          $(playbackFull.domElement).addClass("disabled");
        }
      });
    }

    mouseOut(event) {
      if (this._hasSlides) {
        $("#divTimeImageOverlay").remove();
      } else {
        $("#divTimeOverlay").remove();
      }
    }

    drawTimeMarks() {
      let trimming = {};
      paella.player.videoContainer.trimming().then(t => {
        trimming = t;
        return this.imageSetup();
      }).then(() => {
        // Updated duration value. The duration may change during playback, because it's
        // possible to set the trimming during playback (for instance, using a plugin)
        let duration = trimming.enabled ? trimming.end - trimming.start : this._videoLength;
        let parent = $("#playerContainer_controls_playback_playbackBar");
        this.clearCanvas();

        if (this._keys && paella.player.config.player.slidesMarks.enabled) {
          this._keys.forEach(l => {
            let timeInstant = parseInt(l) - trimming.start;

            if (timeInstant > 0) {
              var aux = timeInstant * parent.width() / this._videoLength; // conversion to canvas


              this.drawTimeMark(aux);
            }
          });
        }
      });
    }

    drawTimeMark(sec) {
      var ht = 12; //default height value

      var ctx = this.getCanvasContext();
      ctx.fillStyle = paella.player.config.player.slidesMarks.color;
      ctx.fillRect(sec, 0, 1, ht);
    }

    clearCanvas() {
      if (this._canvas) {
        var ctx = this.getCanvasContext();
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }

    getCanvas() {
      if (!this._canvas) {
        var parent = $("#playerContainer_controls_playback_playbackBar");
        var canvas = document.createElement("canvas");
        canvas.className = "playerContainer_controls_playback_playbackBar_canvas";
        canvas.id = "playerContainer_controls_playback_playbackBar_canvas";
        canvas.width = parent.width();
        var ht = canvas.height = parent.height();
        parent.prepend(canvas);
        this._canvas = document.getElementById("playerContainer_controls_playback_playbackBar_canvas");
      }

      return this._canvas;
    }

    getCanvasContext() {
      return this.getCanvas().getContext("2d");
    }

    movePassive(event) {
      var This = this;

      function updateTimePreview(duration, trimming) {
        // CONTROLS_BAR POSITON
        var p = $(This.domElement);
        var pos = p.offset();
        var width = p.width();
        var left = event.clientX - pos.left;
        left = left < 0 ? 0 : left;
        var position = left * 100 / width; // GET % OF THE STREAM

        var time = position * duration / 100;

        if (trimming.enabled) {
          time += trimming.start;
        }

        var hou = Math.floor((time - trimming.start) / 3600) % 24;
        hou = ("00" + hou).slice(hou.toString().length);
        var min = Math.floor((time - trimming.start) / 60) % 60;
        min = ("00" + min).slice(min.toString().length);
        var sec = Math.floor((time - trimming.start) % 60);
        sec = ("00" + sec).slice(sec.toString().length);
        var timestr = hou + ":" + min + ":" + sec; // CREATING THE OVERLAY

        if (This._hasSlides) {
          if ($("#divTimeImageOverlay").length == 0) This.setupTimeImageOverlay(timestr, pos.top, width);else {
            $("#divTimeOverlay")[0].innerText = timestr; //IF CREATED, UPDATE TIME AND IMAGE
          } // CALL IMAGEUPDATE

          This.imageUpdate(time);
        } else {
          if ($("#divTimeOverlay").length == 0) {
            This.setupTimeOnly(timestr, pos.top, width);
          } else {
            $("#divTimeOverlay")[0].innerText = timestr;
          }
        } // UPDATE POSITION IMAGE OVERLAY


        if (This._hasSlides) {
          var ancho = $("#divTimeImageOverlay").width();
          var posx = event.clientX - ancho / 2;

          if (event.clientX > ancho / 2 + pos.left && event.clientX < pos.left + width - ancho / 2) {
            // LEFT
            $("#divTimeImageOverlay").css("left", posx); // CENTER THE DIV HOVER THE MOUSE
          } else if (event.clientX < width / 2) $("#divTimeImageOverlay").css("left", pos.left);else $("#divTimeImageOverlay").css("left", pos.left + width - ancho);
        } // UPDATE POSITION TIME OVERLAY


        var ancho2 = $("#divTimeOverlay").width();
        var posx2 = event.clientX - ancho2 / 2;

        if (event.clientX > ancho2 / 2 + pos.left && event.clientX < pos.left + width - ancho2 / 2) {
          $("#divTimeOverlay").css("left", posx2); // CENTER THE DIV HOVER THE MOUSE
        } else if (event.clientX < width / 2) $("#divTimeOverlay").css("left", pos.left);else $("#divTimeOverlay").css("left", pos.left + width - ancho2 - 2);

        if (This._hasSlides) {
          $("#divTimeImageOverlay").css("bottom", $('.playbackControls').height());
        }
      }

      paella.player.videoContainer.duration();
      let duration = 0;
      paella.player.videoContainer.duration().then(function (d) {
        duration = d;
        return paella.player.videoContainer.trimming();
      }).then(function (trimming) {
        updateTimePreview(duration, trimming);
      });
    }

    imageSetup() {
      return new Promise(resolve => {
        paella.player.videoContainer.duration().then(duration => {
          //  BRING THE IMAGE ARRAY TO LOCAL
          this._images = {};
          var n = paella.initDelegate.initParams.videoLoader.frameList;

          if (!n || Object.keys(n).length === 0) {
            this._hasSlides = false;
            return;
          } else {
            this._hasSlides = true;
          }

          this._images = n; // COPY TO LOCAL

          this._videoLength = duration; // SORT KEYS FOR SEARCH CLOSEST

          this._keys = Object.keys(this._images);
          this._keys = this._keys.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
          }); // SORT FRAME NUMBERS STRINGS
          //NEXT

          this._next = 0;
          this._prev = 0;
          resolve();
        });
      });
    }

    imageUpdate(sec) {
      var src = $("#imgOverlay").attr('src');
      $(this._imgNode).show();

      if (sec > this._next || sec < this._prev) {
        src = this.getPreviewImageSrc(sec);

        if (src) {
          this._lastSrc = src;
          $("#imgOverlay").attr('src', src); // UPDATING IMAGE
        } else {
          this.hideImg();
        }
      } // RELOAD IF OUT OF INTERVAL
      else {
          if (src != undefined) {
            return;
          } else {
            $("#imgOverlay").attr('src', this._lastSrc);
          } // KEEP LAST IMAGE

        }
    }

    hideImg() {
      $(this._imgNode).hide();
    }

    getPreviewImageSrc(sec) {
      var keys = Object.keys(this._images);
      keys.push(sec);
      keys.sort(function (a, b) {
        return parseInt(a) - parseInt(b);
      });
      var n = keys.indexOf(sec) - 1;
      n = n > 0 ? n : 0;
      var i = keys[n];
      var next = keys[n + 2];
      var prev = keys[n];
      next = next == undefined ? keys.length - 1 : parseInt(next);
      this._next = next;
      prev = prev == undefined ? 0 : parseInt(prev);
      this._prev = prev;
      i = parseInt(i);

      if (this._images[i]) {
        return this._images[i].url || this._images[i].url;
      } else return false;
    }

    setupTimeImageOverlay(time_str, top, width) {
      var div = document.createElement("div");
      div.className = "divTimeImageOverlay";
      div.id = "divTimeImageOverlay";
      var aux = Math.round(width / 10);
      div.style.width = Math.round(aux * self._aspectRatio) + "px"; //KEEP ASPECT RATIO 4:3
      //div.style.height = Math.round(aux)+"px";

      if (this._hasSlides) {
        var img = document.createElement("img");
        img.className = "imgOverlay";
        img.id = "imgOverlay";
        this._imgNode = img;
        div.appendChild(img);
      }

      var div2 = document.createElement("div");
      div2.className = "divTimeOverlay";
      div2.style.top = top - 20 + "px";
      div2.id = "divTimeOverlay";
      div2.innerText = time_str;
      div.appendChild(div2); //CHILD OF CONTROLS_BAR

      $(this.domElement).parent().append(div);
    }

    setupTimeOnly(time_str, top, width) {
      var div2 = document.createElement("div");
      div2.className = "divTimeOverlay";
      div2.style.top = top - 20 + "px";
      div2.id = "divTimeOverlay";
      div2.innerText = time_str; //CHILD OF CONTROLS_BAR

      $(this.domElement).parent().append(div2);
    }

    playbackFull() {
      return this.getNode(this.playbackFullId);
    }

    timeControl() {
      return this.getNode(this.timeControlId);
    }

    setPlaybackPosition(percent) {
      this.playbackFull().domElement.style.width = percent + '%';
    }

    isSeeking() {
      return !this.updatePlayBar;
    }

    onTimeUpdate(memo) {
      if (this.updatePlayBar) {
        var currentTime = memo.currentTime;
        var duration = memo.duration;
        this.setPlaybackPosition(currentTime * 100 / duration);
      }
    }

    down(event, x, y) {
      this.updatePlayBar = false;
      this.move(event, x, y);
    }

    move(event, x, y) {
      var width = $(this.domElement).width();
      var selectedPosition = x - $(this.domElement).offset().left; // pixels

      if (selectedPosition < 0) {
        selectedPosition = 0;
      } else if (selectedPosition > width) {
        selectedPosition = 100;
      } else {
        selectedPosition = selectedPosition * 100 / width; // percent
      }

      this.setPlaybackPosition(selectedPosition);
    }

    up(event, x, y) {
      var width = $(this.domElement).width();
      var selectedPosition = x - $(this.domElement).offset().left; // pixels

      if (selectedPosition < 0) {
        selectedPosition = 0;
      } else if (selectedPosition > width) {
        selectedPosition = 100;
      } else {
        selectedPosition = selectedPosition * 100 / width; // percent
      }

      paella.player.videoContainer.seekTo(selectedPosition);
      this.updatePlayBar = true;
    }

    onresize() {
      let playbackBar = $("#playerContainer_controls_playback_playbackBar");
      this.getCanvas().width = playbackBar.width();
      this.drawTimeMarks();
    }

  }

  paella.PlaybackBar = PlaybackBar;

  class PlaybackControl extends paella.DomNode {
    addPlugin(plugin) {
      var id = 'buttonPlugin' + this.buttonPlugins.length;
      this.buttonPlugins.push(plugin);
      var button = paella.ButtonPlugin.BuildPluginButton(plugin, id);
      button.plugin = plugin;
      let expand = paella.ButtonPlugin.BuildPluginExpand(plugin, id);
      plugin.button = button;
      plugin._expandElement = expand;
      this.pluginsContainer.domElement.appendChild(button);

      if (expand) {
        let This = this;
        $(button).mouseover(function (evt) {
          evt.target.plugin.expand();
          This._expandedPlugin = evt.target.plugin;
        });
        this.pluginsContainer.domElement.appendChild(expand);
      }

      $(button).hide();
      plugin.checkEnabled(isEnabled => {
        var parent;

        if (isEnabled) {
          $(plugin.button).show();
          paella.pluginManager.setupPlugin(plugin);
          var id = 'buttonPlugin' + this.buttonPlugins.length;

          if (plugin.getButtonType() == paella.ButtonPlugin.type.popUpButton) {
            parent = this.popUpPluginContainer.domElement;
            var popUpContent = paella.ButtonPlugin.BuildPluginPopUp(parent, plugin, id + '_container');
            this.popUpPluginContainer.registerContainer(plugin.getName(), popUpContent, button, plugin);
          } else if (plugin.getButtonType() == paella.ButtonPlugin.type.timeLineButton) {
            parent = this.timeLinePluginContainer.domElement;
            var timeLineContent = paella.ButtonPlugin.BuildPluginPopUp(parent, plugin, id + '_timeline');
            this.timeLinePluginContainer.registerContainer(plugin.getName(), timeLineContent, button, plugin);
          }
        } else {
          this.pluginsContainer.domElement.removeChild(plugin.button);
        }
      });
    }

    constructor(id) {
      var style = {};
      super('div', id, style);
      this.playbackBarId = '';
      this.pluginsContainer = null;
      this._popUpPluginContainer = null;
      this._timeLinePluginContainer = null;
      this.playbackPluginsWidth = 0;
      this.popupPluginsWidth = 0;
      this.minPlaybackBarSize = 120;
      this.playbackBarInstance = null;
      this.buttonPlugins = [];
      this.domElement.className = 'playbackControls';
      this.playbackBarId = id + '_playbackBar';
      var thisClass = this;
      this.pluginsContainer = new paella.DomNode('div', id + '_playbackBarPlugins');
      this.pluginsContainer.domElement.className = 'playbackBarPlugins';
      this.pluginsContainer.domElement.setAttribute("role", "toolbar"); // #DCE start embedd the playbackbar into the plugin listing for flex display

      this.pluginsContainer.addNode(new paella.PlaybackBar(this.playbackBarId));
      this.addNode(this.pluginsContainer); // this.addNode(new paella.PlaybackBar(this.playbackBarId));
      // #DCE end flexify the playback bar

      paella.pluginManager.setTarget('button', this);
      $(window).mousemove(evt => {
        if (this._expandedPlugin && $(window).height() - evt.clientY > 50) {
          this._expandedPlugin.contract();

          this._expandPlugin = null;
        }
      });
    }

    get popUpPluginContainer() {
      if (!this._popUpPluginContainer) {
        this._popUpPluginContainer = new paella.PopUpContainer(this.identifier + '_popUpPluginContainer', 'popUpPluginContainer');
        this.addNode(this._popUpPluginContainer);
      }

      return this._popUpPluginContainer;
    }

    get timeLinePluginContainer() {
      if (!this._timeLinePluginContainer) {
        this._timeLinePluginContainer = new paella.TimelineContainer(this.identifier + '_timelinePluginContainer', 'timelinePluginContainer');
        this.addNode(this._timeLinePluginContainer);
      }

      return this._timeLinePluginContainer;
    }

    showPopUp(identifier, button) {
      this.popUpPluginContainer.showContainer(identifier, button);
      this.timeLinePluginContainer.showContainer(identifier, button);
      this.hideCrossTimelinePopupButtons(identifier, this.popUpPluginContainer, this.timeLinePluginContainer);
    } // #DCE OPC-407 close popups across popup type:
    // hide popUpPluginContainer popups when timeLinePluginContainer popup is active and visa versa


    hideCrossTimelinePopupButtons(identifier, popupContainer, timelineContainer) {
      var container = popupContainer.containers[identifier];
      var prevContainer = timelineContainer.containers[timelineContainer.currentContainerId];

      if (container && prevContainer) {
        prevContainer.button.className = prevContainer.button.className.replace(' selected', '');
        paella.events.trigger(paella.events.hidePopUp, {
          container: prevContainer
        });
        prevContainer.plugin.willHideContent();
        $(prevContainer.element).hide();
        prevContainer.plugin.didHideContent();
        return;
      }

      container = timelineContainer.containers[identifier];
      prevContainer = popupContainer.containers[popupContainer.currentContainerId];

      if (container && prevContainer) {
        popupContainer.hideContainer(prevContainer.identifier);
      }
    } // #DCE end closing popups across popup type


    hidePopUp(identifier, button) {
      this.popUpPluginContainer.hideContainer(identifier, button);
      this.timeLinePluginContainer.hideContainer(identifier, button);
    }

    playbackBar() {
      if (this.playbackBarInstance == null) {
        //#DCE start embedded
        // this.playbackBarInstance = this.getNode(this.playbackBarId);
        this.playbackBarInstance = this.pluginsContainer.getNode(this.playbackBarId); //#DCE end embedded
      }

      return this.playbackBarInstance;
    }

    onresize() {
      var windowSize = $(this.domElement).width();
      base.log.debug("resize playback bar (width=" + windowSize + ")");

      for (var i = 0; i < this.buttonPlugins.length; ++i) {
        var plugin = this.buttonPlugins[i];
        var minSize = plugin.getMinWindowSize();

        if (minSize > 0 && windowSize < minSize) {
          plugin.hideUI();
        } else {
          plugin.checkVisibility();
        }
      } // #DCE start embed playback bar for flex sizing
      //this.getNode(this.playbackBarId).onresize();


      this.pluginsContainer.getNode(this.playbackBarId).onresize(); // #DCE end embed playback bar for flex sizing
    }

  }

  paella.PlaybackControl = PlaybackControl;

  class ControlsContainer extends paella.DomNode {
    addPlugin(plugin) {
      var id = 'videoOverlayButtonPlugin' + this.buttonPlugins.length;
      this.buttonPlugins.push(plugin);
      var button = paella.ButtonPlugin.BuildPluginButton(plugin, id);
      this.videoOverlayButtons.domElement.appendChild(button);
      plugin.button = button;
      $(button).hide();
      plugin.checkEnabled(function (isEnabled) {
        if (isEnabled) {
          $(plugin.button).show();
          paella.pluginManager.setupPlugin(plugin);
        }
      });
    }

    constructor(id) {
      super('div', id);
      this.playbackControlId = '';
      this.editControlId = '';
      this.isEnabled = true;
      this.autohideTimer = null;
      this.hideControlsTimeMillis = 3000;
      this.playbackControlInstance = null;
      this.videoOverlayButtons = null;
      this.buttonPlugins = [];
      this._hidden = false;
      this._over = false;
      this.viewControlId = id + '_view';
      this.playbackControlId = id + '_playback';
      this.editControlId = id + '_editor';
      this.addNode(new paella.PlaybackControl(this.playbackControlId));
      var thisClass = this;
      paella.events.bind(paella.events.showEditor, function (event) {
        thisClass.onShowEditor();
      });
      paella.events.bind(paella.events.hideEditor, function (event) {
        thisClass.onHideEditor();
      });
      paella.events.bind(paella.events.play, function (event) {
        thisClass.onPlayEvent();
      });
      paella.events.bind(paella.events.pause, function (event) {
        thisClass.onPauseEvent();
      });
      $(document).mousemove(function (event) {
        paella.player.controls.restartHideTimer();
      });
      $(this.domElement).bind("mousemove", function (event) {
        thisClass._over = true;
      });
      $(this.domElement).bind("mouseout", function (event) {
        thisClass._over = false;
      });
      paella.events.bind(paella.events.endVideo, function (event) {
        thisClass.onEndVideoEvent();
      });
      paella.events.bind('keydown', function (event) {
        thisClass.onKeyEvent();
      });
      this.videoOverlayButtons = new paella.DomNode('div', id + '_videoOverlayButtonPlugins');
      this.videoOverlayButtons.domElement.className = 'videoOverlayButtonPlugins';
      this.videoOverlayButtons.domElement.setAttribute("role", "toolbar");
      this.addNode(this.videoOverlayButtons);
      paella.pluginManager.setTarget('videoOverlayButton', this);
    }

    onShowEditor() {
      var editControl = this.editControl();
      if (editControl) $(editControl.domElement).hide();
    }

    onHideEditor() {
      var editControl = this.editControl();
      if (editControl) $(editControl.domElement).show();
    }

    enterEditMode() {
      var playbackControl = this.playbackControl();
      var editControl = this.editControl();

      if (playbackControl && editControl) {
        $(playbackControl.domElement).hide();
      }
    }

    exitEditMode() {
      var playbackControl = this.playbackControl();
      var editControl = this.editControl();

      if (playbackControl && editControl) {
        $(playbackControl.domElement).show();
      }
    }

    playbackControl() {
      if (this.playbackControlInstance == null) {
        this.playbackControlInstance = this.getNode(this.playbackControlId);
      }

      return this.playbackControlInstance;
    }

    editControl() {
      return this.getNode(this.editControlId);
    }

    disable() {
      this.isEnabled = false;
      this.hide();
    }

    enable() {
      this.isEnabled = true;
      this.show();
    }

    isHidden() {
      return this._hidden;
    }

    hide() {
      var This = this;
      this._doHide = true;

      function hideIfNotCanceled() {
        if (This._doHide) {
          $(This.domElement).css({
            opacity: 0.0
          }); // #DCE MATT-1595, already transaprent, leave width alone (no hide!)
          // fix for staggered control bar plugin display
          // $(This.domElement).hide();
          // #DCE MATT-1595 end

          This.domElement.setAttribute('aria-hidden', 'true');
          This._hidden = true;
          paella.events.trigger(paella.events.controlBarDidHide);
        }
      }

      paella.events.trigger(paella.events.controlBarWillHide);

      if (this._doHide) {
        if (!base.userAgent.browser.IsMobileVersion && !base.userAgent.browser.Explorer) {
          $(this.domElement).animate({
            opacity: 0.0
          }, {
            duration: 300,
            complete: hideIfNotCanceled
          });
        } else {
          hideIfNotCanceled();
        }
      }
    }

    showPopUp(identifier) {
      this.playbackControl().showPopUp(identifier);
    }

    hidePopUp(identifier) {
      this.playbackControl().hidePopUp(identifier);
    }

    show() {
      if (this.isEnabled) {
        $(this.domElement).stop();
        this._doHide = false;
        this.domElement.style.opacity = 1.0;
        this.domElement.setAttribute('aria-hidden', 'false');
        this._hidden = false;
        $(this.domElement).show();
        paella.events.trigger(paella.events.controlBarDidShow);
      }
    }

    autohideTimeout() {
      var playbackBar = this.playbackControl().playbackBar();

      if (playbackBar.isSeeking() || this._over) {
        paella.player.controls.restartHideTimer();
      } else {
        paella.player.controls.hideControls();
      }
    }

    hideControls() {
      paella.player.videoContainer.paused().then(paused => {
        if (!paused) {
          this.hide();
        } else {
          this.show();
        }
      });
    }

    showControls() {
      this.show();
    }

    onPlayEvent() {
      this.restartHideTimer();
    }

    onPauseEvent() {
      this.clearAutohideTimer();
    }

    onEndVideoEvent() {
      this.show();
      this.clearAutohideTimer();
    }

    onKeyEvent() {
      this.restartHideTimer();
      paella.player.videoContainer.paused().then(function (paused) {
        if (!paused) {
          paella.player.controls.restartHideTimer();
        }
      });
    }

    cancelHideBar() {
      this.restartTimerEvent();
    }

    restartTimerEvent() {
      if (this.isHidden()) {
        this.showControls();
      }

      this._doHide = false;
      paella.player.videoContainer.paused(paused => {
        if (!paused) {
          this.restartHideTimer();
        }
      });
    }

    clearAutohideTimer() {
      if (this.autohideTimer != null) {
        this.autohideTimer.cancel();
        this.autohideTimer = null;
      }
    }

    restartHideTimer() {
      this.showControls();
      this.clearAutohideTimer();
      var thisClass = this;
      this.autohideTimer = new base.Timer(function (timer) {
        thisClass.autohideTimeout();
      }, this.hideControlsTimeMillis);
    }

    onresize() {
      this.playbackControl().onresize();
    }

  }

  paella.ControlsContainer = ControlsContainer;
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(function () {
  class LoaderContainer extends paella.DomNode {
    constructor(id) {
      super('div', id, {
        position: 'fixed',
        backgroundColor: 'black',
        opacity: '0.7',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        zIndex: 10000
      });
      this.timer = null;
      this.loader = null;
      this.loaderPosition = 0;
      this.loader = this.addNode(new paella.DomNode('i', '', {
        width: "100px",
        height: "100px",
        color: "white",
        display: "block",
        fontSize: "100px",

        /*  #DCE OPC-374 Center spinner in middle of visible window */
        left: "40%",
        top: "40%",
        position: "absolute"
      }));
      this.loader.domElement.className = "icon-spinner";
      paella.events.bind(paella.events.loadComplete, (event, params) => {
        this.loadComplete(params);
      });
      this.timer = this.makeRotateTimer();
      this.timer.repeat = true;
    } //#DCE OPC-407 re-use this during seeks


    makeRotateTimer() {
      return new base.Timer(timer => {
        //thisClass.loader.domElement.style.backgroundPosition = thisClass.loaderPosition + 'px';
        this.loader.domElement.style.transform = `rotate(${this.loaderPosition}deg`;
        this.loaderPosition += 45;
      }, 250);
    }

    loadComplete(params) {
      $(this.domElement).hide();
      this.timer.repeat = false;
    } //#DCE OPC-407 seek load


    seekload(params) {
      $(this.domElement).show();
      this.timer = this.makeRotateTimer();
      this.timer.repeat = true;
    }

  }

  paella.LoaderContainer = LoaderContainer;
  paella.Keys = {
    Space: 32,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
  };

  class KeyPlugin extends paella.FastLoadPlugin {
    get type() {
      return 'keyboard';
    }

    onKeyPress(key) {
      console.log(key);
      return false;
    }

  }

  paella.KeyPlugin = KeyPlugin;

  class KeyManager {
    get isPlaying() {
      return this._isPlaying;
    }

    set isPlaying(p) {
      this._isPlaying = p;
    }

    get enabled() {
      return this._enabled !== undefined ? this._enabled : true;
    }

    set enabled(e) {
      this._enabled = e;
    }

    constructor() {
      this._isPlaying = false;
      var thisClass = this;
      paella.events.bind(paella.events.loadComplete, function (event, params) {
        thisClass.loadComplete(event, params);
      });
      paella.events.bind(paella.events.play, function (event) {
        thisClass.onPlay();
      });
      paella.events.bind(paella.events.pause, function (event) {
        thisClass.onPause();
      });
      paella.pluginManager.setTarget('keyboard', this);
      this._pluginList = [];
    }

    addPlugin(plugin) {
      if (plugin.checkEnabled(e => {
        this._pluginList.push(plugin);

        plugin.setup();
      })) ;
    }

    loadComplete(event, params) {
      var thisClass = this;
      paella.events.bind("keyup", function (event) {
        thisClass.keyUp(event);
      });
    }

    onPlay() {
      this.isPlaying = true;
    }

    onPause() {
      this.isPlaying = false;
    }

    keyUp(event) {
      if (!this.enabled) return;

      this._pluginList.some(plugin => {
        return plugin.onKeyPress(event);
      });
    }

  }

  paella.keyManager = new KeyManager();
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(() => {
  class VideoLoader {
    constructor() {
      this.metadata = {
        // Video metadata
        title: "",
        duration: 0
      };
      this.streams = []; // {sources:{mp4:{src:"videourl.mp4",type:"video/mp4"},
      //			 ogg:{src:"videourl.ogv",type:"video/ogg"},
      //			 webm:{src:"videourl.webm",type:"video/webm"},
      //			 flv:{src:"videourl.flv",type:"video/x-flv"},
      //			 rtmp:{src:"rtmp://server.com/endpoint/url.loquesea",type="video/mp4 | video/x-flv"},
      //			 image:{frames:{frame_1:'frame_1.jpg',...frame_n:'frame_n.jpg'},duration:183},
      //	preview:'video_preview.jpg'}

      this.frameList = []; // frameList[timeInstant] = { id:"frame_id", mimetype:"image/jpg", time:timeInstant, url:"image_url"}

      this.loadStatus = false;
      this.codecStatus = false;
    }

    getMetadata() {
      return this.metadata;
    }

    getVideoId() {
      return paella.initDelegate.getId();
    }

    getVideoUrl() {
      // This function must to return the base video URL
      return "";
    }

    getDataUrl() {// This function must to return the location of the video data file
    }

    loadVideo(onSuccess) {
      // This function must to:
      //	- load this.streams and this.frameList
      // 	- Check streams compatibility using this.isStreamCompatible(streamIndex)
      //	- Set this.loadStatus = true if load is Ok, or false if something gone wrong
      //	- Set this.codecStatus = true if the browser can reproduce all streams
      //	- Call onSuccess()
      onSuccess();
    }

  }

  paella.VideoLoader = VideoLoader;

  class AccessControl {
    canRead() {
      return paella_DeferredResolved(true);
    }

    canWrite() {
      return paella_DeferredResolved(false);
    }

    userData() {
      return paella_DeferredResolved({
        username: 'anonymous',
        name: 'Anonymous',
        avatar: paella.utils.folders.resources() + '/images/default_avatar.png',
        isAnonymous: true
      });
    }

    getAuthenticationUrl(callbackParams) {
      var authCallback = this._authParams.authCallbackName && window[this._authParams.authCallbackName];

      if (!authCallback && paella.player.config.auth) {
        authCallback = paella.player.config.auth.authCallbackName && window[paella.player.config.auth.authCallbackName];
      }

      if (typeof authCallback == "function") {
        return authCallback(callbackParams);
      }

      return "";
    }

  }

  paella.AccessControl = AccessControl;

  class PlayerBase {
    checkCompatibility() {
      let message = "";

      if (base.parameters.get('ignoreBrowserCheck')) {
        return true;
      }

      if (base.userAgent.browser.IsMobileVersion) return true;
      let isCompatible = base.userAgent.browser.Chrome || base.userAgent.browser.Safari || base.userAgent.browser.Firefox || base.userAgent.browser.Opera || base.userAgent.browser.Edge || base.userAgent.browser.Explorer && base.userAgent.browser.Version.major >= 9;

      if (isCompatible) {
        return true;
      } else {
        var errorMessage = base.dictionary.translate("It seems that your browser is not HTML 5 compatible");
        paella.events.trigger(paella.events.error, {
          error: errorMessage
        });
        message = errorMessage + '<div style="display:block;width:470px;height:140px;margin-left:auto;margin-right:auto;font-family:Verdana,sans-sherif;font-size:12px;"><a href="http://www.google.es/chrome" style="color:#004488;float:left;margin-right:20px;"><img src="' + paella.utils.folders.resources() + 'images/chrome.png" style="width:80px;height:80px" alt="Google Chrome"></img><p>Google Chrome</p></a><a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home" style="color:#004488;float:left;margin-right:20px;"><img src="' + paella.utils.folders.resources() + 'images/explorer.png" style="width:80px;height:80px" alt="Internet Explorer 9"></img><p>Internet Explorer 9</p></a><a href="http://www.apple.com/safari/" style="float:left;margin-right:20px;color:#004488"><img src="' + paella.utils.folders.resources() + 'images/safari.png" style="width:80px;height:80px" alt="Safari"></img><p>Safari 5</p></a><a href="http://www.mozilla.org/firefox/" style="float:left;color:#004488"><img src="' + paella.utils.folders.resources() + 'images/firefox.png" style="width:80px;height:80px" alt="Firefox"></img><p>Firefox 12</p></a></div>';
        message += '<div style="margin-top:30px;"><a id="ignoreBrowserCheckLink" href="#" onclick="window.location = window.location + \'&ignoreBrowserCheck=true\'">' + base.dictionary.translate("Continue anyway") + '</a></div>';
        paella.messageBox.showError(message, {
          height: '40%'
        });
      }

      return false;
    }

    constructor(playerId) {
      this.config = null;
      this.playerId = '';
      this.mainContainer = null;
      this.videoContainer = null;
      this.controls = null;
      this.accessControl = null;

      if (base.parameters.get('log') != undefined) {
        var log = 0;

        switch (base.parameters.get('log')) {
          case "error":
            log = base.Log.kLevelError;
            break;

          case "warn":
            log = base.Log.kLevelWarning;
            break;

          case "debug":
            log = base.Log.kLevelDebug;
            break;

          case "log":
          case "true":
            log = base.Log.kLevelLog;
            break;
        }

        base.log.setLevel(log);
      }

      if (!this.checkCompatibility()) {
        base.log.debug('It seems that your browser is not HTML 5 compatible');
      } else {
        paella.player = this;
        this.playerId = playerId;
        this.mainContainer = $('#' + this.playerId)[0];
        var thisClass = this;
        paella.events.bind(paella.events.loadComplete, function (event, params) {
          thisClass.loadComplete(event, params);
        });
      }
    }

    get repoUrl() {
      return paella.player.videoLoader._url || paella.player.config.standalone && paella.player.config.standalone.repository;
    }

    get videoUrl() {
      return paella.player.videoLoader.getVideoUrl();
    }

    get dataUrl() {
      return paella.player.videoLoader.getDataUrl();
    }

    get videoId() {
      return paella.initDelegate.getId();
    }

    loadComplete(event, params) {}

    get auth() {
      return {
        login: function (redirect) {
          redirect = redirect || window.location.href;
          var url = paella.initDelegate.initParams.accessControl.getAuthenticationUrl(redirect);

          if (url) {
            window.location.href = url;
          }
        },
        // The following functions returns promises
        canRead: function () {
          return paella.initDelegate.initParams.accessControl.canRead();
        },
        canWrite: function () {
          return paella.initDelegate.initParams.accessControl.canWrite();
        },
        userData: function () {
          return paella.initDelegate.initParams.accessControl.userData();
        }
      };
    }

  }

  paella.PlayerBase = PlayerBase;

  class InitDelegate {
    get initParams() {
      if (!this._initParams) {
        this._initParams = {
          configUrl: paella.baseUrl + 'config/config.json',
          dictionaryUrl: paella.baseUrl + 'localization/paella',
          accessControl: null,
          videoLoader: null // Other parameters set externally:
          //	config: json containing the configuration file
          //	loadConfig: function(defaultConfigUrl). Returns a promise with the config.json data
          //	url: attribute. Contains the repository base URL
          //	videoUrl: function. Returns the base URL of the video (example: baseUrl + videoID)
          //	dataUrl: function. Returns the full URL to get the data.json file
          //	loadVideo: Function. Returns a promise with the data.json file content

        };
      }

      return this._initParams;
    }

    constructor(params) {
      if (arguments.length == 2) {
        this._config = arguments[0];
      }

      if (params) {
        for (var key in params) {
          this.initParams[key] = params[key];
        }
      }

      if (!this.initParams.getId) {
        this.initParams.getId = function () {
          return base.parameters.get('id') || "noid";
        };
      }
    }

    getId() {
      return this.initParams.getId();
    }

    loadDictionary() {
      return new Promise(resolve => {
        base.ajax.get({
          url: this.initParams.dictionaryUrl + "_" + base.dictionary.currentLanguage() + '.json'
        }, function (data, type, returnCode) {
          base.dictionary.addDictionary(data);
          resolve(data);
        }, function (data, type, returnCode) {
          resolve();
        });
      });
    }

    loadConfig() {
      let loadAccessControl = data => {
        var AccessControlClass = Class.fromString(data.player.accessControlClass || "paella.AccessControl");
        this.initParams.accessControl = new AccessControlClass();
      };

      if (this.initParams.config) {
        return new Promise(resolve => {
          loadAccessControl(this.initParams.config);
          resolve(this.initParams.config);
        });
      } else if (this.initParams.loadConfig) {
        return new Promise((resolve, reject) => {
          this.initParams.loadConfig(this.initParams.configUrl).then(data => {
            loadAccessControl(data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          var configUrl = this.initParams.configUrl;
          var params = {};
          params.url = configUrl;
          base.ajax.get(params, (data, type, returnCode) => {
            try {
              data = JSON.parse(data);
            } catch (e) {}

            loadAccessControl(data);
            resolve(data);
          }, function (data, type, returnCode) {
            paella.messageBox.showError(base.dictionary.translate("Error! Config file not found. Please configure paella!")); //onSuccess({});
          });
        });
      }
    }

  }

  paella.InitDelegate = InitDelegate;
  window.paellaPlayer = null;
  paella.plugins = {};
  paella.plugins.events = {};
  paella.initDelegate = null;
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/

/*
 * #DCE OPC-407 overriding 09_paella_player UPV 6.2.2 goFullScreen() to revert it to Paella5x version of only checking iOS.
 * Removing the "&& (paella.utils.userAgent.browser.Version.major < 12 || !paella.utils.userAgent.system.iPad)"
 * Because it prevents fullscreen for FireFox and Chrome for iOS iPad.
 * NOTE: DCE config disables reload on full screen, the possible reason that fullsreen is working on iPad < 13. *Still in test for iOS 13 iPad*
 */
(() => {
  class PaellaPlayer extends paella.PlayerBase {
    getPlayerMode() {
      if (paella.player.isFullScreen()) {
        return paella.PaellaPlayer.mode.fullscreen;
      } else if (window.self !== window.top) {
        return paella.PaellaPlayer.mode.embed;
      }

      return paella.PaellaPlayer.mode.standard;
    }

    checkFullScreenCapability() {
      var fs = document.getElementById(paella.player.mainContainer.id);

      if (fs.webkitRequestFullScreen || fs.mozRequestFullScreen || fs.msRequestFullscreen || fs.requestFullScreen) {
        return true;
      }

      if (base.userAgent.browser.IsMobileVersion && paella.player.videoContainer.isMonostream) {
        return true;
      }

      return false;
    }

    addFullScreenListeners() {
      var thisClass = this;

      var onFullScreenChangeEvent = function () {
        setTimeout(function () {
          paella.pluginManager.checkPluginsVisibility();
        }, 1000);
        var fs = document.getElementById(paella.player.mainContainer.id);

        if (paella.player.isFullScreen()) {
          fs.style.width = '100%';
          fs.style.height = '100%';
        } else {
          fs.style.width = '';
          fs.style.height = '';
        }

        if (thisClass.isFullScreen()) {
          paella.events.trigger(paella.events.enterFullscreen);
        } else {
          paella.events.trigger(paella.events.exitFullscreen);
        }
      };

      if (!this.eventFullScreenListenerAdded) {
        this.eventFullScreenListenerAdded = true;
        document.addEventListener("fullscreenchange", onFullScreenChangeEvent, false);
        document.addEventListener("webkitfullscreenchange", onFullScreenChangeEvent, false);
        document.addEventListener("mozfullscreenchange", onFullScreenChangeEvent, false);
        document.addEventListener("MSFullscreenChange", onFullScreenChangeEvent, false);
        document.addEventListener("webkitendfullscreen", onFullScreenChangeEvent, false);
      }
    }

    isFullScreen() {
      var webKitIsFullScreen = document.webkitIsFullScreen === true;
      var msIsFullScreen = document.msFullscreenElement !== undefined && document.msFullscreenElement !== null;
      var mozIsFullScreen = document.mozFullScreen === true;
      var stdIsFullScreen = document.fullScreenElement !== undefined && document.fullScreenElement !== null;
      return webKitIsFullScreen || msIsFullScreen || mozIsFullScreen || stdIsFullScreen;
    }

    goFullScreen() {
      if (!this.isFullScreen()) {
        // #DCE OPC-407 revert to UPV Paella 5x
        if (base.userAgent.system.iOS) {
          paella.player.videoContainer.masterVideo().goFullScreen();
        } else {
          var fs = document.getElementById(paella.player.mainContainer.id);

          if (fs.webkitRequestFullScreen) {
            fs.webkitRequestFullScreen();
          } else if (fs.mozRequestFullScreen) {
            fs.mozRequestFullScreen();
          } else if (fs.msRequestFullscreen) {
            fs.msRequestFullscreen();
          } else if (fs.requestFullScreen) {
            fs.requestFullScreen();
          }
        }
      }
    }

    exitFullScreen() {
      if (this.isFullScreen()) {
        if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen()) {
          document.msExitFullscreen();
        } else if (document.cancelFullScreen) {
          document.cancelFullScreen();
        }
      }
    }

    setProfile(profileName, animate) {
      if (paella.profiles.setProfile(profileName, animate)) {
        let profileData = paella.player.getProfile(profileName);

        if (profileData && !paella.player.videoContainer.isMonostream) {
          base.cookies.set('lastProfile', profileName);
        }

        paella.events.trigger(paella.events.setProfile, {
          profileName: profileName
        });
      }
    }

    getProfile(profileName) {
      return paella.profiles.getProfile(profileName);
    }

    constructor(playerId) {
      super(playerId);
      this.player = null;
      this.videoIdentifier = '';
      this.loader = null; // Video data:

      this.videoData = null; // if initialization ok

      if (this.playerId == playerId) {
        this.loadPaellaPlayer();
        var thisClass = this;
      }
    }

    get selectedProfile() {
      return paella.profiles.currentProfileName;
    }

    loadPaellaPlayer() {
      var This = this;
      this.loader = new paella.LoaderContainer('paellaPlayer_loader');
      $('body')[0].appendChild(this.loader.domElement);
      paella.events.trigger(paella.events.loadStarted);
      paella.initDelegate.loadDictionary().then(function () {
        return paella.initDelegate.loadConfig();
      }).then(function (config) {
        This.accessControl = paella.initDelegate.initParams.accessControl;
        This.videoLoader = paella.initDelegate.initParams.videoLoader;
        This.onLoadConfig(config);

        if (config.skin) {
          var skin = config.skin.default || 'dark';
          paella.utils.skin.restore(skin);
        }
      });
    }

    onLoadConfig(configData) {
      paella.data = new paella.Data(configData);
      paella.pluginManager.registerPlugins();
      this.config = configData;
      this.videoIdentifier = paella.initDelegate.getId();

      if (this.videoIdentifier) {
        if (this.mainContainer) {
          this.videoContainer = new paella.VideoContainer(this.playerId + "_videoContainer");
          var videoQualityStrategy = new paella.BestFitVideoQualityStrategy();

          try {
            var StrategyClass = this.config.player.videoQualityStrategy;
            var ClassObject = Class.fromString(StrategyClass);
            videoQualityStrategy = new ClassObject();
          } catch (e) {
            base.log.warning("Error selecting video quality strategy: strategy not found");
          }

          this.videoContainer.setVideoQualityStrategy(videoQualityStrategy);
          this.mainContainer.appendChild(this.videoContainer.domElement);
        }

        $(window).resize(function (event) {
          paella.player.onresize();
        });
        this.onload();
      }

      paella.pluginManager.loadPlugins("paella.FastLoadPlugin");
    }

    onload() {
      var thisClass = this;
      var ac = this.accessControl;
      var canRead = false;
      var userData = {};
      this.accessControl.canRead().then(function (c) {
        canRead = c;
        return thisClass.accessControl.userData();
      }).then(function (d) {
        userData = d;

        if (canRead) {
          thisClass.loadVideo();
        } else if (userData.isAnonymous) {
          var redirectUrl = paella.initDelegate.initParams.accessControl.getAuthenticationUrl("player/?id=" + paella.player.videoIdentifier);
          var message = '<div>' + base.dictionary.translate("You are not authorized to view this resource") + '</div>';

          if (redirectUrl) {
            message += '<div class="login-link"><a href="' + redirectUrl + '">' + base.dictionary.translate("Login") + '</a></div>';
          }

          thisClass.unloadAll(message);
        } else {
          let errorMessage = base.dictionary.translate("You are not authorized to view this resource");
          thisClass.unloadAll(errorMessage);
          paella.events.trigger(paella.events.error, {
            error: errorMessage
          });
        }
      }).catch(error => {
        let errorMessage = base.dictionary.translate(error);
        thisClass.unloadAll(errorMessage);
        paella.events.trigger(paella.events.error, {
          error: errorMessage
        });
      });
    }

    onresize() {
      this.videoContainer.onresize();
      if (this.controls) this.controls.onresize(); // Resize the layout profile

      if (this.videoContainer.ready) {
        var cookieProfile = paella.utils.cookies.get('lastProfile');

        if (cookieProfile) {
          this.setProfile(cookieProfile, false);
        } else {
          this.setProfile(paella.player.selectedProfile, false);
        }
      }

      paella.events.trigger(paella.events.resize, {
        width: $(this.videoContainer.domElement).width(),
        height: $(this.videoContainer.domElement).height()
      });
    }

    unloadAll(message) {
      var loaderContainer = $('#paellaPlayer_loader')[0];
      this.mainContainer.innerText = "";
      paella.messageBox.showError(message);
    }

    reloadVideos(masterQuality, slaveQuality) {
      if (this.videoContainer) {
        this.videoContainer.reloadVideos(masterQuality, slaveQuality);
        this.onresize();
      }
    }

    loadVideo() {
      if (this.videoIdentifier) {
        var This = this;
        var loader = paella.player.videoLoader;
        this.onresize();
        loader.loadVideo(() => {
          var playOnLoad = false;
          This.videoContainer.setStreamData(loader.streams).then(function () {
            paella.events.trigger(paella.events.loadComplete);
            This.addFullScreenListeners();
            This.onresize(); // If the player has been loaded using lazyLoad, the video should be
            // played as soon as it loads

            if (This.videoContainer.autoplay() || g_lazyLoadInstance != null) {
              This.play();
            } else if (loader.metadata.preview) {
              This.lazyLoadContainer = new LazyThumbnailContainer(loader.metadata.preview);
              document.body.appendChild(This.lazyLoadContainer.domElement);
            }
          }).catch(error => {
            console.log(error);
            paella.messageBox.showError(base.dictionary.translate("Could not load the video"));
          });
        });
      }
    }

    showPlaybackBar() {
      if (!this.controls) {
        this.controls = new paella.ControlsContainer(this.playerId + '_controls');
        this.mainContainer.appendChild(this.controls.domElement);
        this.controls.onresize();
        paella.events.trigger(paella.events.loadPlugins, {
          pluginManager: paella.pluginManager
        });
      }
    }

    isLiveStream() {
      var loader = paella.initDelegate.initParams.videoLoader;

      var checkSource = function (sources, index) {
        if (sources.length > index) {
          var source = sources[index];

          for (var key in source.sources) {
            if (typeof source.sources[key] == "object") {
              for (var i = 0; i < source.sources[key].length; ++i) {
                var stream = source.sources[key][i];
                if (stream.isLiveStream) return true;
              }
            }
          }
        }

        return false;
      };

      return checkSource(loader.streams, 0) || checkSource(loader.streams, 1);
    }

    loadPreviews() {
      var streams = paella.initDelegate.initParams.videoLoader.streams;
      var slavePreviewImg = null;
      var masterPreviewImg = streams[0].preview;

      if (streams.length >= 2) {
        slavePreviewImg = streams[1].preview;
      }

      if (masterPreviewImg) {
        var masterRect = paella.player.videoContainer.overlayContainer.getVideoRect(0);
        this.masterPreviewElem = document.createElement('img');
        this.masterPreviewElem.src = masterPreviewImg;
        paella.player.videoContainer.overlayContainer.addElement(this.masterPreviewElem, masterRect);
      }

      if (slavePreviewImg) {
        var slaveRect = paella.player.videoContainer.overlayContainer.getVideoRect(1);
        this.slavePreviewElem = document.createElement('img');
        this.slavePreviewElem.src = slavePreviewImg;
        paella.player.videoContainer.overlayContainer.addElement(this.slavePreviewElem, slaveRect);
      }

      paella.events.bind(paella.events.timeUpdate, function (event) {
        paella.player.unloadPreviews();
      });
    }

    unloadPreviews() {
      if (this.masterPreviewElem) {
        paella.player.videoContainer.overlayContainer.removeElement(this.masterPreviewElem);
        this.masterPreviewElem = null;
      }

      if (this.slavePreviewElem) {
        paella.player.videoContainer.overlayContainer.removeElement(this.slavePreviewElem);
        this.slavePreviewElem = null;
      }
    }

    loadComplete(event, params) {
      var thisClass = this; //var master = paella.player.videoContainer.masterVideo();

      paella.pluginManager.loadPlugins("paella.EarlyLoadPlugin");

      if (paella.player.videoContainer._autoplay) {
        this.play();
      }
    }

    play() {
      if (this.lazyLoadContainer) {
        document.body.removeChild(this.lazyLoadContainer.domElement);
        this.lazyLoadContainer = null;
      }

      return new Promise((resolve, reject) => {
        this.videoContainer.play().then(() => {
          if (!this.controls) {
            this.showPlaybackBar();
            paella.events.trigger(paella.events.controlBarLoaded);
            this.controls.onresize();
          }

          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    }

    pause() {
      return this.videoContainer.pause();
    }

    playing() {
      return new Promise(resolve => {
        this.paused().then(p => {
          resolve(!p);
        });
      });
    }

    paused() {
      return this.videoContainer.paused();
    }

  }

  paella.PaellaPlayer = PaellaPlayer;
  window.PaellaPlayer = PaellaPlayer;
  paella.PaellaPlayer.mode = {
    standard: 'standard',
    fullscreen: 'fullscreen',
    embed: 'embed'
  };

  class LazyThumbnailContainer extends paella.DomNode {
    constructor(src) {
      super('img', 'lazyLoadThumbnailContainer', {});
      this.domElement.src = src;
      this.domElement.alt = "";
    }

    setImage(url) {
      this.domElement.src = url;
    }

    onClick(closure) {
      this.domElement.onclick = closure;
    }

  }

  let g_lazyLoadInstance = null;

  class PaellaPlayerLazy extends PaellaPlayer {
    constructor(playerId, initDelegate) {
      super(playerId, initDelegate);
      g_lazyLoadInstance = this;
    }

    set onPlay(closure) {
      this._onPlayClosure = closure;
    }

    loadComplete(event, params) {}

    onLoadConfig(configData) {
      //paella.data = new paella.Data(configData);
      this.config = configData;
      this.videoIdentifier = paella.initDelegate.getId();

      if (this.videoIdentifier) {
        $(window).resize(function (event) {
          paella.player.onresize();
        });
        this.onload();
      }
    }

    loadVideo() {
      if (this.videoIdentifier) {
        var This = this;
        var loader = paella.player.videoLoader;
        this.onresize();
        loader.loadVideo(() => {
          if (!loader.metadata.preview) {
            paella.load(this.playerId, paella.loaderFunctionParams);
            g_lazyLoadInstance = null; // Lazy load is disabled when the video has no preview
          } else {
            this.lazyLoadContainer = new LazyThumbnailContainer(loader.metadata.preview);
            document.body.appendChild(this.lazyLoadContainer.domElement);
            this.lazyLoadContainer.onClick(() => {
              document.body.removeChild(this.lazyLoadContainer.domElement);
              this.lazyLoadContainer = null;
              this._onPlayClosure && this._onPlayClosure();
            });
            paella.events.trigger(paella.events.loadComplete);
          }
        });
      }
    }

    onresize() {}

  }

  paella.PaellaPlayerLazy = PaellaPlayerLazy;
  /* Initializer function */

  window.initPaellaEngage = function (playerId, initDelegate) {
    if (!initDelegate) {
      initDelegate = new paella.InitDelegate();
    }

    paella.initDelegate = initDelegate;
    paellaPlayer = new PaellaPlayer(playerId, paella.initDelegate);
  };
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(() => {
  // Default Video Loader
  //
  class DefaultVideoLoader extends paella.VideoLoader {
    constructor(data) {
      super(data);
      this._url = null;

      if (typeof data == "object") {
        this._data = data;
      } else {
        try {
          this._data = JSON.parse(data);
        } catch (e) {
          this._url = data;
        }
      }
    }

    getVideoUrl() {
      if (paella.initDelegate.initParams.videoUrl) {
        return typeof paella.initDelegate.initParams.videoUrl == "function" ? paella.initDelegate.initParams.videoUrl() : paella.initDelegate.initParams.videoUrl;
      } else {
        let url = this._url || paella.player.config.standalone && paella.player.config.standalone.repository || '';
        return (/\/$/.test(url) ? url : url + '/') + paella.initDelegate.getId() + '/';
      }
    }

    getDataUrl() {
      if (paella.initDelegate.initParams.dataUrl) {
        return typeof paella.initDelegate.initParams.dataUrl == 'function' ? paella.initDelegate.initParams.dataUrl() : paella.initDelegate.initParams.dataUrl;
      } else {
        return this.getVideoUrl() + 'data.json';
      }
    }

    loadVideo(onSuccess) {
      let loadVideoDelegate = paella.initDelegate.initParams.loadVideo;
      let url = this._url || this.getDataUrl();

      if (this._data) {
        this.loadVideoData(this._data, onSuccess);
      } else if (loadVideoDelegate) {
        loadVideoDelegate().then(data => {
          this._data = data;
          this.loadVideoData(this._data, onSuccess);
        });
      } else if (url) {
        var This = this;
        base.ajax.get({
          url: this.getDataUrl()
        }, function (data, type, err) {
          if (typeof data == "string") {
            try {
              data = JSON.parse(data);
            } catch (e) {}
          }

          This._data = data;
          This.loadVideoData(This._data, onSuccess);
        }, function (data, type, err) {
          switch (err) {
            case 401:
              paella.messageBox.showError(base.dictionary.translate("You are not logged in"));
              break;

            case 403:
              paella.messageBox.showError(base.dictionary.translate("You are not authorized to view this resource"));
              break;

            case 404:
              paella.messageBox.showError(base.dictionary.translate("The specified video identifier does not exist"));
              break;

            default:
              paella.messageBox.showError(base.dictionary.translate("Could not load the video"));
          }
        });
      }
    }

    loadVideoData(data, onSuccess) {
      var This = this;

      if (data.metadata) {
        this.metadata = data.metadata;
      }

      if (data.streams) {
        data.streams.forEach(function (stream) {
          This.loadStream(stream);
        });
      }

      if (data.frameList) {
        this.loadFrameData(data);
      }

      if (data.captions) {
        this.loadCaptions(data.captions);
      }

      if (data.blackboard) {
        this.loadBlackboard(data.streams[0], data.blackboard);
      }

      this.streams = data.streams;
      this.frameList = data.frameList;
      this.loadStatus = this.streams.length > 0;
      onSuccess();
    }

    loadFrameData(data) {
      var This = this;

      if (data.frameList && data.frameList.forEach) {
        var newFrames = {};
        data.frameList.forEach(function (frame) {
          if (!/^[a-zA-Z]+:\/\//.test(frame.url) && !/^data:/.test(frame.url)) {
            frame.url = This.getVideoUrl() + frame.url;
          }

          if (frame.thumb && !/^[a-zA-Z]+:\/\//.test(frame.thumb) && !/^data:/.test(frame.thumb)) {
            frame.thumb = This.getVideoUrl() + frame.thumb;
          }

          var id = frame.time;
          newFrames[id] = frame;
        });
        data.frameList = newFrames;
      }
    }

    loadStream(stream) {
      var This = this;

      if (stream.preview && !/^[a-zA-Z]+:\/\//.test(stream.preview) && !/^data:/.test(stream.preview)) {
        stream.preview = This.getVideoUrl() + stream.preview;
      }

      if (!stream.sources) {
        return;
      }

      if (stream.sources.image) {
        stream.sources.image.forEach(function (image) {
          if (image.frames.forEach) {
            var newFrames = {};
            image.frames.forEach(function (frame) {
              if (frame.src && !/^[a-zA-Z]+:\/\//.test(frame.src) && !/^data:/.test(frame.src)) {
                frame.src = This.getVideoUrl() + frame.src;
              }

              if (frame.thumb && !/^[a-zA-Z]+:\/\//.test(frame.thumb) && !/^data:/.test(frame.thumb)) {
                frame.thumb = This.getVideoUrl() + frame.thumb;
              }

              var id = "frame_" + frame.time;
              newFrames[id] = frame.src;
            });
            image.frames = newFrames;
          }
        });
      }

      for (var type in stream.sources) {
        if (stream.sources[type]) {
          if (type != 'image') {
            var source = stream.sources[type];
            source.forEach(function (sourceItem) {
              var pattern = /^[a-zA-Z\:]+\:\/\//gi;

              if (typeof sourceItem.src == "string") {
                if (sourceItem.src.match(pattern) == null) {
                  sourceItem.src = This.getVideoUrl() + sourceItem.src;
                }
              }

              sourceItem.type = sourceItem.mimetype;
            });
          }
        } else {
          delete stream.sources[type];
        }
      }
    }

    loadCaptions(captions) {
      if (captions) {
        for (var i = 0; i < captions.length; ++i) {
          var url = captions[i].url;

          if (!/^[a-zA-Z]+:\/\//.test(url)) {
            url = this.getVideoUrl() + url;
          }

          var c = new paella.captions.Caption(i, captions[i].format, url, {
            code: captions[i].lang,
            txt: captions[i].text
          });
          paella.captions.addCaptions(c);
        }
      }
    }

    loadBlackboard(stream, blackboard) {
      var This = this;

      if (!stream.sources.image) {
        stream.sources.image = [];
      }

      var imageObject = {
        count: blackboard.frames.length,
        duration: blackboard.duration,
        mimetype: blackboard.mimetype,
        res: blackboard.res,
        frames: {}
      };
      blackboard.frames.forEach(function (frame) {
        var id = "frame_" + Math.round(frame.time);

        if (!/^[a-zA-Z]+:\/\//.test(frame.src)) {
          frame.src = This.getVideoUrl() + frame.src;
        }

        imageObject.frames[id] = frame.src;
      });
      stream.sources.image.push(imageObject);
    }

  }

  paella.DefaultVideoLoader = DefaultVideoLoader;

  class DefaultInitDelegate extends paella.InitDelegate {}

  paella.DefaultInitDelegate = DefaultInitDelegate;

  function getManifestFromParameters(params) {
    let master = null;

    if (master = paella.utils.parameters.get('video')) {
      let slave = paella.utils.parameters.get('videoSlave');
      slave = slave && decodeURIComponent(slave);
      let masterPreview = paella.utils.parameters.get('preview');
      masterPreview = masterPreview && decodeURIComponent(masterPreview);
      let slavePreview = paella.utils.parameters.get('previewSlave');
      slavePreview = slavePreview && decodeURIComponent(slavePreview);
      let title = paella.utils.parameters.get('preview') || "Untitled Video";
      let data = {
        metadata: {
          title: title
        },
        streams: [{
          sources: {
            mp4: [{
              src: decodeURIComponent(master),
              mimetype: "video/mp4",
              res: {
                w: 0,
                h: 0
              }
            }]
          },
          preview: masterPreview
        }]
      };

      if (slave) {
        data.streams.push({
          sources: {
            mp4: [{
              src: slave,
              mimetype: "video/mp4",
              res: {
                w: 0,
                h: 0
              }
            }]
          },
          preview: slavePreview
        });
      }

      return data;
    }

    return null;
  }
  /*
   *	playerContainer	Player DOM container id
   *	params.configUrl		Url to the config json file
   *	params.config			Use this configuration file
   *	params.data				Paella video data schema
   *	params.url				Repository URL
   */


  paella.load = function (playerContainer, params) {
    paella.loaderFunctionParams = params;
    var auth = params && params.auth || {}; // Build custom init data using url parameters

    let data = getManifestFromParameters(params);

    if (data) {
      params.data = data;
    }

    var initObjects = params;
    initObjects.videoLoader = new paella.DefaultVideoLoader(params.data || params.url);
    paella.initDelegate = new paella.DefaultInitDelegate(initObjects);
    new PaellaPlayer(playerContainer, paella.initDelegate);
  };

  paella.lazyLoad = function (playerContainer, params) {
    paella.loaderFunctionParams = params;
    var auth = params && params.auth || {}; // Check autoplay. If autoplay is enabled, this function must call paella.load()

    paella.Html5Video.IsAutoplaySupported().then(supported => {
      if (supported) {
        // Build custom init data using url parameters
        let data = getManifestFromParameters(params);

        if (data) {
          params.data = data;
        }

        var initObjects = params;
        initObjects.videoLoader = new paella.DefaultVideoLoader(params.data || params.url);
        paella.initDelegate = new paella.DefaultInitDelegate(initObjects);
        let lazyLoad = new paella.PaellaPlayerLazy(playerContainer, paella.initDelegate);

        lazyLoad.onPlay = () => {
          $('#' + playerContainer).innerHTML = "";
          paella.load(playerContainer, params);
        };
      } else {
        paella.load(playerContainer, params);
      }
    });
  };
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
(() => {
  class RightBarPlugin extends paella.DeferredLoadPlugin {
    get type() {
      return 'rightBarPlugin';
    }

    getName() {
      return "es.upv.paella.RightBarPlugin";
    }

    buildContent(domElement) {}

  }

  paella.RightBarPlugin = RightBarPlugin;

  class TabBarPlugin extends paella.DeferredLoadPlugin {
    get type() {
      return 'tabBarPlugin';
    }

    getName() {
      return "es.upv.paella.TabBarPlugin";
    }

    getTabName() {
      return "New Tab";
    }

    action(tab) {}

    buildContent(domElement) {}

    setToolTip(message) {
      this.button.setAttribute("title", message);
      this.button.setAttribute("aria-label", message);
    }

    getDefaultToolTip() {
      return "";
    }

  }

  paella.TabBarPlugin = TabBarPlugin;

  class ExtendedAdapter {
    constructor() {
      this.rightContainer = null;
      this.bottomContainer = null;
      this.rightBarPlugins = [];
      this.tabBarPlugins = [];
      this.currentTabIndex = 0;
      this.bottomContainerTabs = null;
      this.bottomContainerContent = null;
      this.rightContainer = document.createElement('div'); //this.rightContainer.id = this.settings.rightContainerId;

      this.rightContainer.className = "rightPluginContainer";
      this.bottomContainer = document.createElement('div'); //this.bottomContainer.id = this.settings.bottomContainerId;

      this.bottomContainer.className = "tabsPluginContainer";
      var tabs = document.createElement('div'); //tabs.id = 'bottomContainer_tabs';

      tabs.className = 'tabsLabelContainer';
      this.bottomContainerTabs = tabs;
      this.bottomContainer.appendChild(tabs);
      var bottomContent = document.createElement('div'); //bottomContent.id = 'bottomContainer_content';

      bottomContent.className = 'tabsContentContainer';
      this.bottomContainerContent = bottomContent;
      this.bottomContainer.appendChild(bottomContent);
      this.initPlugins();
    }

    initPlugins() {
      paella.pluginManager.setTarget('rightBarPlugin', this);
      paella.pluginManager.setTarget('tabBarPlugin', this);
    }

    addPlugin(plugin) {
      var thisClass = this;
      plugin.checkEnabled(function (isEnabled) {
        if (isEnabled) {
          paella.pluginManager.setupPlugin(plugin);

          if (plugin.type == 'rightBarPlugin') {
            thisClass.rightBarPlugins.push(plugin);
            thisClass.addRightBarPlugin(plugin);
          }

          if (plugin.type == 'tabBarPlugin') {
            thisClass.tabBarPlugins.push(plugin);
            thisClass.addTabPlugin(plugin);
          }
        }
      });
    }

    showTab(tabIndex) {
      var i = 0;
      var labels = this.bottomContainer.getElementsByClassName("tabLabel");
      var contents = this.bottomContainer.getElementsByClassName("tabContent");

      for (i = 0; i < labels.length; ++i) {
        if (labels[i].getAttribute("tab") == tabIndex) {
          labels[i].className = "tabLabel enabled";
        } else {
          labels[i].className = "tabLabel disabled";
        }
      }

      for (i = 0; i < contents.length; ++i) {
        if (contents[i].getAttribute("tab") == tabIndex) {
          contents[i].className = "tabContent enabled";
        } else {
          contents[i].className = "tabContent disabled";
        }
      }
    }

    addTabPlugin(plugin) {
      var thisClass = this;
      var tabIndex = this.currentTabIndex; // Add tab

      var tabItem = document.createElement('div');
      tabItem.setAttribute("tab", tabIndex);
      tabItem.className = "tabLabel disabled";
      tabItem.innerText = plugin.getTabName();
      tabItem.plugin = plugin;
      $(tabItem).click(function (event) {
        if (/disabled/.test(this.className)) {
          thisClass.showTab(tabIndex);
          this.plugin.action(this);
        }
      });
      $(tabItem).keyup(function (event) {
        if (event.keyCode == 13) {
          if (/disabledTabItem/.test(this.className)) {
            thisClass.showTab(tabIndex);
            this.plugin.action(this);
          }
        }
      });
      this.bottomContainerTabs.appendChild(tabItem); // Add tab content

      var tabContent = document.createElement('div');
      tabContent.setAttribute("tab", tabIndex);
      tabContent.className = "tabContent disabled " + plugin.getSubclass();
      this.bottomContainerContent.appendChild(tabContent);
      plugin.buildContent(tabContent);
      plugin.button = tabItem;
      plugin.container = tabContent;
      plugin.button.setAttribute("tabindex", 3000 + plugin.getIndex());
      plugin.button.setAttribute("alt", "");
      plugin.setToolTip(plugin.getDefaultToolTip()); // Show tab

      if (this.firstTabShown === undefined) {
        this.showTab(tabIndex);
        this.firstTabShown = true;
      }

      ++this.currentTabIndex;
    }

    addRightBarPlugin(plugin) {
      var container = document.createElement('div');
      container.className = "rightBarPluginContainer " + plugin.getSubclass();
      this.rightContainer.appendChild(container);
      plugin.buildContent(container);
    }

  }

  paella.ExtendedAdapter = ExtendedAdapter;
  paella.extendedAdapter = new paella.ExtendedAdapter();
})();
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/

/*
Class ("paella.editor.EmbedPlayer", base.AsyncLoaderCallback,{
	editar:null,

	initialize:function() {
		this.editor = paella.editor.instance;
	},

	load:function(onSuccess,onError) {
		var barHeight = this.editor.bottomBar.getHeight() + 20;
		var rightBarWidth = this.editor.rightBar.getWidth() + 20;
		$(paella.player.mainContainer).css({
			'position':'fixed',
			"width":"",
			"bottom":barHeight + "px",
			"right":rightBarWidth + "px",
			"left":"20px",
			"top":"20px"
		});
		paella.player.mainContainer.className = "paellaMainContainerEditorMode";
		new Timer(function(timer) {
			paella.player.controls.disable();
			paella.player.onresize();
			if (onSuccess) {
				onSuccess();
			}
		},500);
	},

	restorePlayer:function() {
		$('body')[0].appendChild(paella.player.mainContainer);
		paella.player.controls.enable();
		paella.player.mainContainer.className = "";
		$(paella.player.mainContainer).css({
			'position':'',
			"width":"",
			"bottom":"",
			"left":"",
			"right":"",
			"top":""
		});
		paella.player.onresize();
	},

	onresize:function() {
		var barHeight = this.editor.bottomBar.getHeight() + 20;
		var rightBarWidth = this.editor.rightBar.getWidth() + 20;
		$(paella.player.mainContainer).css({
			'position':'fixed',
			"width":"",
			"bottom":barHeight + "px",
			"right":rightBarWidth + "px",
			"left":"20px",
			"top":"20px"
		});

	}
});

*/
/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
///////////////////////////////////////////////////////
// Deprecated functions/objects
//
//    Will be removed in next paella version.
///////////////////////////////////////////////////////
function DeprecatedClass(name, replacedBy, p) {
  Class(name, p, {
    initialize: function () {
      base.log.warning(name + " is deprecated, use " + replacedBy + " instead.");
      this.parent.apply(this, arguments);
    }
  });
}

function DeprecatedFunc(name, replacedBy, func) {
  function ret() {
    base.log.warning(name + " is deprecated, use " + replacedBy + " instead.");
    func.apply(this, arguments);
  }

  return ret;
} // Pella Dictionary
///////////////////////////////////////////////////////


DeprecatedClass("paella.Dictionary", "base.Dictionary", base.Dictionary);
paella.dictionary = base.dictionary; // Paella AsyncLoader
///////////////////////////////////////////////////////

DeprecatedClass("paella.AsyncLoaderCallback", "base.AsyncLoaderCallback", base.AsyncLoaderCallback);
DeprecatedClass("paella.AjaxCallback", "base.AjaxCallback", base.AjaxCallback);
DeprecatedClass("paella.JSONCallback", "base.JSONCallback", base.JSONCallback);
DeprecatedClass("paella.DictionaryCallback", "base.DictionaryCallback", base.DictionaryCallback);
DeprecatedClass("paella.AsyncLoader", "base.AsyncLoader", base.AsyncLoader); // Paella Timer
///////////////////////////////////////////////////////

DeprecatedClass("paella.Timer", "base.Timer", base.Timer);
DeprecatedClass("paella.utils.Timer", "base.Timer", base.Timer); // Paella Ajax
///////////////////////////////////////////////////////

paella.ajax = {};
paella.ajax['send'] = DeprecatedFunc("paella.ajax.send", "base.ajax.send", base.ajax.send);
paella.ajax['get'] = DeprecatedFunc("paella.ajax.get", "base.ajax.get", base.ajax.get);
paella.ajax['put'] = DeprecatedFunc("paella.ajax.put", "base.ajax.put", base.ajax.put);
paella.ajax['post'] = DeprecatedFunc("paella.ajax.post", "base.ajax.post", base.ajax.post);
paella.ajax['delete'] = DeprecatedFunc("paella.ajax.delete", "base.ajax.delete", base.ajax.send); // Paella UI
///////////////////////////////////////////////////////

paella.ui = {};

paella.ui.Container = function (params) {
  var elem = document.createElement('div');
  if (params.id) elem.id = params.id;
  if (params.className) elem.className = params.className;
  if (params.style) $(elem).css(params.style);
  return elem;
}; // paella.utils
///////////////////////////////////////////////////////


paella.utils.ajax = base.ajax;
paella.utils.cookies = base.cookies;
paella.utils.parameters = base.parameters;
paella.utils.require = base.require;
paella.utils.importStylesheet = base.importStylesheet;
paella.utils.language = base.dictionary.currentLanguage;
paella.utils.uuid = base.uuid;
paella.utils.userAgent = base.userAgent; // paella.debug
///////////////////////////////////////////////////////

paella.debug = {
  log: function (msg) {
    base.log.warning("paella.debug.log is deprecated, use base.debug.[error/warning/debug/log] instead.");
    base.log.log(msg);
  }
};
paella.debugReady = true;
// #DCE's version of the caption plugin, adapted from UPV's caption plugin
// Adapted for Paella 6.1.2
// TODO: assets new updates with the latest UPV caption plugin!
paella.addPlugin(function () {
  return class DceCaptionsPlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this._searchTimerTime = 1500;
      this._searchTimer = null;
      this._pluginButton = null;
      this._open = 0; // 0 closed, 1 st click

      this._parent = null;
      this._body = null;
      this._inner = null;
      this._bar = null;
      this._input = null;
      this._select = null;
      this._editor = null;
      this._activeCaptions = null;
      this._lastSel = null;
      this._browserLang = null;
      this._defaultBodyHeight = 280;
      this._autoScroll = true;
      this._searchOnCaptions = null;
      this._headerNoteKey = "automated", this._headerNoteMessage = "Automated Transcription - Provided by IBM Watson";
      this._hasTranscriptText = null;
      this._noTextFoundMessage = "No text was found during transcription.";
      this._dceLangDefault = null;
      /*  OPC-407 reselect lang option when CC button clicked */

      this._dceLangDefaultFound = null;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return 'dceCaptionsPluginButton';
    }

    getIconClass() {
      return 'icon-closed-captions';
    }

    getName() {
      return "edu.harvard.dce.paella.captionsPlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Captions");
    }

    getIndex() {
      return 664;
    }

    closeOnMouseOut() {
      return false;
      /* UPV https://github.com/polimediaupv/paella/commit/34f99cfcfe6bc9a52331bdab2a0c4948102cd716 */
    }

    checkEnabled(onSuccess) {
      if (paella.captions.getAvailableLangs().length > 0) {
        onSuccess(true);
      } else {
        onSuccess(false);
      }
    }

    showUI() {
      if (paella.captions.getAvailableLangs().length >= 1) {
        super.showUI();
      }
    }

    setup() {
      var self = this; // HIDE UI IF NO Captions

      if (paella.captions.getAvailableLangs().length < 1) {
        paella.plugins.captionsPlugin.hideUI();
      } // MATT-2219 prevent activating the CC video overlay


      if (!self._hasTranscriptText) {
        paella.events.trigger(paella.events.captionsDisabled);
      } // MATT-2219 #DCE Assume no caption text if first language has no caption text


      var id = paella.captions.getAvailableLangs()[0].id;
      self._hasTranscriptText = paella.captions.getCaptions(id)._captions !== undefined;

      if (!self._hasTranscriptText) {
        // don't do binds when no transcode text to scroll
        return;
      } // end  MATT-2219
      //BINDS


      paella.events.bind(paella.events.captionsEnabled, function (event, params) {
        self.onChangeSelection(params);
      });
      paella.events.bind(paella.events.captionsDisabled, function (event, params) {
        self.onChangeSelection(params);
      });
      paella.events.bind(paella.events.captionAdded, function (event, params) {
        self.onCaptionAdded(params);
        paella.plugins.captionsPlugin.showUI();
      });
      paella.events.bind(paella.events.timeUpdate, function (event, params) {
        if (self._searchOnCaptions) {
          self.updateCaptionHiglighted(params);
        }
      });
      paella.events.bind(paella.events.controlBarWillHide, function (evt) {
        self.cancelHideBar();
      });
      self._activeCaptions = paella.captions.getActiveCaptions();
      self._searchOnCaptions = self.config.searchOnCaptions || false;
    }

    cancelHideBar() {
      var thisClass = this;

      if (thisClass._open > 0) {
        paella.player.controls.cancelHideBar();
      }
    }

    updateCaptionHiglighted(time) {
      var thisClass = this;
      var sel = null;
      var id = null;

      if (time) {
        id = thisClass.searchIntervaltoHighlight(time);

        if (id != null) {
          sel = $(".bodyInnerContainer[sec-id='" + id + "']");

          if (sel != thisClass._lasSel) {
            $(thisClass._lasSel).removeClass("Highlight");
          }

          if (sel) {
            $(sel).addClass("Highlight");

            if (thisClass._autoScroll) {
              thisClass.updateScrollFocus(id);
            }

            thisClass._lasSel = sel;
          }
        }
      }
    }

    searchIntervaltoHighlight(time) {
      var thisClass = this;
      var resul = null;

      if (paella.captions.getActiveCaptions()) {
        var n = paella.captions.getActiveCaptions()._captions;

        n.forEach(function (l) {
          if (l.begin < time.currentTime && time.currentTime < l.end) thisClass.resul = l.id;
        });
      }

      if (thisClass.resul != null) return thisClass.resul;else return null;
    }

    updateScrollFocus(id) {
      var thisClass = this;
      var resul = 0;
      var t = $(".bodyInnerContainer").slice(0, id);
      t = t.toArray();
      t.forEach(function (l) {
        var i = $(l).outerHeight(true);
        resul += i;
      });
      var x = parseInt(resul / 280);
      $(".dceCaptionsBody").scrollTop(x * thisClass._defaultBodyHeight);
    }

    onCaptionAdded(obj) {
      var thisClass = this;
      var newCap = paella.captions.getCaptions(obj); // #DCE Do not replace existing captions when toggling single-view video (DCE specific).

      if (obj && thisClass._select.options && thisClass._select.options.length > 0 && $(`.captionsSelector option[value='${obj}']`).length > 0) {
        return;
      }

      var defOption = document.createElement("option"); // NO ONE SELECT

      defOption.text = newCap._lang.txt; // #DCE WARN, the txt is a language, not On/Off.

      defOption.value = obj;

      thisClass._select.add(defOption);
    }

    changeSelection() {
      var thisClass = this;
      var sel = $(thisClass._select).val();

      if (sel == "") {
        $(thisClass._body).empty();
        paella.captions.setActiveCaptions(sel);
        return;
      } // BREAK IF NO ONE SELECTED


      paella.captions.setActiveCaptions(sel);
      thisClass._activeCaptions = sel;

      if (thisClass._searchOnCaptions) {
        thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
      }

      thisClass.setButtonHideShow();
      thisClass.onClose();
      paella.player.controls.hidePopUp(thisClass.getName());
    }

    onChangeSelection(obj) {
      var thisClass = this;

      if (thisClass._activeCaptions != obj) {
        $(thisClass._body).empty();

        if (obj == undefined) {
          thisClass._select.value = "";
          $(thisClass._input).prop('disabled', true);
        } else {
          $(thisClass._input).prop('disabled', false);
          thisClass._select.value = obj;
          thisClass._dceLangDefaultFound = true;

          if (thisClass._searchOnCaptions) {
            thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
          }
        }

        thisClass._activeCaptions = obj;
        thisClass.setButtonHideShow();
      }

      if (thisClass._open) {
        // OPC-407 close after selection
        thisClass.onClose();
        paella.player.controls.hidePopUp(thisClass.getName());
      }
    }

    action() {
      var self = this;
      self._browserLang = base.dictionary.currentLanguage();
      self._autoScroll = true;

      switch (self._open) {
        case 0:
          self.onOpen();
          break;

        case 1:
          self.onClose();
          break;
      }
    }

    onOpen() {
      if (this._browserLang && paella.captions.getActiveCaptions() == undefined) {
        this.selectDefaultOrBrowserLang(this._browserLang);
      } // OPC-407 re-enable existing captions on click open


      if (this._select && this._select.value === "" && this._dceLangDefaultFound) {
        this._select.value = this._dceLangDefault;
        this.changeSelection();
      }

      this._open = 1;
      paella.keyManager.enabled = false;
    }

    onClose() {
      paella.keyManager.enabled = true;
      this._open = 0;
    }

    buildContent(domElement) {
      var thisClass = this; //captions CONTAINER

      thisClass._parent = document.createElement('div');
      thisClass._parent.className = 'dceCaptionsPluginContainer'; //captions BAR

      thisClass._bar = document.createElement('div');
      thisClass._bar.className = 'dceCaptionsBar'; //captions BODY

      if (thisClass._hasTranscriptText) {
        // build caption search and select UI elements
        if (thisClass._searchOnCaptions) {
          thisClass.buildSearch();
          thisClass.buildSelect();
        }
      } else {
        // create the empty body
        thisClass._body = document.createElement('div');
        thisClass._body.className = 'dceCaptionsBody';

        thisClass._parent.appendChild(thisClass._body);

        thisClass._inner = document.createElement('div');
        thisClass._inner.className = 'bodyInnerContainer';
        thisClass._inner.innerHTML = thisClass._noTextFoundMessage;

        thisClass._body.appendChild(thisClass._inner);
      } //BUTTON EDITOR


      thisClass._editor = document.createElement("button");
      thisClass._editor.className = "editorButton";
      thisClass._editor.innerHTML = "";

      thisClass._bar.appendChild(thisClass._editor); //BUTTON jQuery


      $(thisClass._editor).prop("disabled", true);
      $(thisClass._editor).click(function () {
        var c = paella.captions.getActiveCaptions();
        paella.userTracking.log("paella:caption:edit", {
          id: c._captionsProvider + ':' + c._id,
          lang: c._lang
        });
        c.goToEdit();
      });

      if (paella.dce && paella.dce.captiontags) {
        thisClass._addTagHeader(thisClass._parent, paella.dce.captiontags);
      }

      domElement.appendChild(thisClass._parent);
    }

    buildSearch() {
      var thisClass = this;
      thisClass._body = document.createElement('div');
      thisClass._body.className = 'dceCaptionsBody';

      thisClass._parent.appendChild(thisClass._body); //BODY JQUERY


      $(thisClass._body).scroll(function () {
        thisClass._autoScroll = false;
      }); //INPUT

      thisClass._input = document.createElement("input");
      thisClass._input.className = "captionsBarInput";
      thisClass._input.type = "text";
      thisClass._input.id = "captionsBarInput";
      thisClass._input.name = "captionsString";
      thisClass._input.placeholder = base.dictionary.translate("Search captions");

      thisClass._bar.appendChild(thisClass._input); //INPUT jQuery


      $(thisClass._input).change(function () {
        var text = $(thisClass._input).val();
        thisClass.doSearch(text);
      });
      $(thisClass._input).keyup(function () {
        var text = $(thisClass._input).val();

        if (thisClass._searchTimer != null) {
          thisClass._searchTimer.cancel();
        }

        thisClass._searchTimer = new base.Timer(function (timer) {
          thisClass.doSearch(text);
        }, thisClass._searchTimerTime);
      });
    }

    buildSelect() {
      var thisClass = this; //SELECT

      thisClass._select = document.createElement("select");
      thisClass._select.className = "captionsSelector";
      var defOption = document.createElement("option"); // NO ONE SELECT

      defOption.text = base.dictionary.translate("Off");
      defOption.value = "";

      thisClass._select.add(defOption);

      var langs = paella.captions.getAvailableLangs();

      if (Array.isArray(langs) && langs.length > 0) {
        // In our case, there should only be one language.
        // We are going to label it 'On', so that functionally, the select
        // control behaves as an on/off switch for captions
        // Later, when captions and transcripts are in separate plugins, this
        // select control will be removed entirely.
        var option = document.createElement("option");
        option.text = base.dictionary.translate("On");
        option.value = langs[0].id;
        thisClass._dceLangDefault = langs[0].id;

        thisClass._select.add(option);
      }

      thisClass._bar.appendChild(thisClass._select);

      thisClass._parent.appendChild(thisClass._bar); //jQuery SELECT


      $(thisClass._select).change(function () {
        thisClass.changeSelection();
      });
    }

    selectDefaultOrBrowserLang(code) {
      var thisClass = this;
      var provider = null;
      var fallbackProvider = null;
      paella.captions.getAvailableLangs().forEach(function (l) {
        if (l.lang.code === code) {
          provider = l.id;
        } else if (l.lang.code === paella.player.config.defaultCaptionLang) {
          fallbackProvider = l.id;
        }
      });

      if (provider || fallbackProvider) {
        paella.captions.setActiveCaptions(provider || fallbackProvider);
      }
      /*
      else{
      $(thisClass._input).prop("disabled",true);
      }
       */

    }

    doSearch(text) {
      var thisClass = this;
      var c = paella.captions.getActiveCaptions();

      if (c) {
        if (text == "") {
          thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
        } else {
          c.search(text, function (err, resul) {
            if (!err) {
              thisClass.buildBodyContent(resul, "search");
            }
          });
        }
      }
    }

    setButtonHideShow() {
      var thisClass = this;
      var editor = $('.editorButton');
      var c = paella.captions.getActiveCaptions();
      var res = null;

      if (c != null) {
        $(thisClass._select).width('39%');
        c.canEdit(function (err, r) {
          res = r;
        });

        if (res) {
          $(editor).prop("disabled", false);
          $(editor).show();
        } else {
          $(editor).prop("disabled", true);
          $(editor).hide();
          $(thisClass._select).width('47%');
        }
      } else {
        $(editor).prop("disabled", true);
        $(editor).hide();
        $(thisClass._select).width('47%');
      }

      if (!thisClass._searchOnCaptions) {
        if (res) {
          $(thisClass._select).width('92%');
        } else {
          $(thisClass._select).width('100%');
        }
      }
    }

    buildBodyContent(obj, type) {
      var thisClass = this;
      $(thisClass._body).empty();
      obj.forEach(function (l) {
        thisClass._inner = document.createElement('div');
        thisClass._inner.className = 'bodyInnerContainer';
        thisClass._inner.innerHTML = l.content;

        if (type == "list") {
          thisClass._inner.setAttribute('sec-begin', l.begin);

          thisClass._inner.setAttribute('sec-end', l.end);

          thisClass._inner.setAttribute('sec-id', l.id);

          thisClass._autoScroll = true;
        }

        if (type == "search") {
          thisClass._inner.setAttribute('sec-begin', l.time);
        }

        thisClass._body.appendChild(thisClass._inner);

        $(thisClass._inner).click(function () {
          var secBegin = $(this).attr("sec-begin");
          paella.player.videoContainer.seekToTime(parseInt(secBegin));
        });
      });
    }

    _addTagHeader(container, tags) {
      var self = this;
      if (!tags) return;

      if ((Array.isArray && Array.isArray(tags) || tags instanceof Array) == false) {
        tags = [tags];
      }

      tags.forEach(function (t) {
        if (t == self._headerNoteKey) {
          var messageDiv = document.createElement("div");
          messageDiv.id = "dceCaptionNote";
          messageDiv.innerHTML = self._headerNoteMessage;
          $(container).prepend(messageDiv);
        }
      });
    }

  };
});
paella.addPlugin(function () {
  class FlexSkipPlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'left';
    }

    getName() {
      return "edu.harvard.dce.paella.flexSkipPlugin";
    }

    getIndex() {
      return 121;
    }

    getSubclass() {
      return 'flexSkip_Rewind_10';
    }

    getIconClass() {
      return 'icon-back-10-s';
    }

    formatMessage() {
      return 'Rewind 10 seconds';
    }

    getDefaultToolTip() {
      return base.dictionary.translate(this.formatMessage());
    }

    checkEnabled(onSuccess) {
      onSuccess(!paella.player.isLiveStream());
    }

    action(button) {
      paella.player.videoContainer.currentTime().then(function (currentTime) {
        paella.player.videoContainer.seekToTime(currentTime - 10);
      });
    }

  }

  paella.plugins.FlexSkipPlugin = FlexSkipPlugin;
  return FlexSkipPlugin;
});
paella.addPlugin(function () {
  return class FlexSkipForwardPlugin extends paella.plugins.FlexSkipPlugin {
    getIndex() {
      return 122;
    }

    getName() {
      return "edu.harvard.dce.paella.flexSkipForwardPlugin";
    }

    getSubclass() {
      return 'flexSkip_Forward_30';
    }

    getIconClass() {
      return 'icon-forward-30-s';
    }

    formatMessage() {
      return 'Forward 30 seconds';
    }

    action(button) {
      paella.player.videoContainer.currentTime().then(function (currentTime) {
        paella.player.videoContainer.seekToTime(currentTime + 30);
      });
    }

  };
});
// A version of the deprecated es.upv.paella.UserTrackingCollectorPlugIn,
// shaved down to just send the heartbeat.
// Update for Paella 6.1.2
// NOTE: This plugin sends a constant usage ping, where as the
// es.upv.paella.opencast.userTrackingSaverPlugIn sends change events
// Keeping as FastLoadPlugin because FastLoadPlugin are loaded after loadcompleted
paella.addPlugin(function () {
  return class HeartbeatSender extends paella.EarlyLoadPlugin {
    constructor() {
      super();
      this.heartbeatTimer = null;
    }

    getName() {
      return "edu.harvard.dce.paella.heartbeatSender";
    }

    load(eventType, params) {
      base.log.debug(`HUDCE HeartBeat timer loading with heartbeat interval: ${this.config.heartBeatTime}ms`);
      var thisClass = this;

      if (this.config.heartBeatTime > 0) {
        thisClass.heartbeatTimer = new base.Timer(thisClass.registerHeartbeat.bind(thisClass), thisClass.config.heartBeatTime);
        thisClass.heartbeatTimer.repeat = true;
      }
    }

    registerHeartbeat(timer) {
      var thisClass = this;
      paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', thisClass.getHeartbeatURL(videoData));
        xhr.send();
      });
    }

    getHeartbeatURL(videoData) {
      var videoCurrentTime = parseInt(videoData.currentTime + paella.player.videoContainer.trimStart(), 10); // In the case of a live stream and a config setting that says to not
      // play on load, paella.player.videoContainer.paused() will always
      // return true, so it's not reliable then.
      // However, our live stream player does not allow pausing. If you are
      // watching live stream, you are playing. So, we can count on that to
      // determine play state.

      var isPlaying = paella.player.isLiveStream() ? "live" : (!videoData.paused).toString();
      var url = '/usertracking/?';
      url += this.queryStringFromDict({
        _method: 'PUT',
        id: paella.player.videoIdentifier,
        type: 'HEARTBEAT',
        'in': videoCurrentTime,
        'out': videoCurrentTime,
        playing: isPlaying,
        resource: paella.opencast.resourceId,
        _: new Date().getTime()
      }); // Example heartbeat URL:
      // https://localhost:3000/_method=PUT&id=74b6c02f-afbb-42bc-8145-344153a1792e&type=HEARTBEAT&in=0&out=0&playing=false&resource=%2F2015%2F03%2F33383%2FL10&_=1441381319430'

      return url;
    }

    queryStringFromDict(dict) {
      var qs = '';

      for (var key in dict) {
        if (qs.length > 0) {
          qs += '&';
        }

        qs += key + '=' + encodeURIComponent(dict[key]);
      }

      return qs;
    }

  };
});
// #DCE's version of the info plugin
// Updated for Paella 6.1.2
// TODO: compare with the new Paella user tracking plugins!
paella.addPlugin(function () {
  return class InfoPlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this._classHandoutKey = 'Class Handout';
      this._classHandouts = [];
      this._privacyPolicyLink = 'https://www.extension.harvard.edu/privacy-policy';
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showInfoPluginButton";
    }

    getIconClass() {
      return 'icon-menu-dots';
    }

    getIndex() {
      return 3030;
    }

    getMinWindowSize() {
      return 300;
    }

    getName() {
      return "edu.harvard.dce.paella.infoPlugin";
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    getDefaultToolTip() {
      return paella.dictionary.translate("Information");
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    buildContent(domElement) {
      var thisClass = this;
      var popUp = jQuery('<div id="dce-info-popup"></div>');
      var buttonActions = ['About player', 'Report a problem', 'System status', 'Privacy policy', thisClass._classHandoutKey, 'All Course Videos']; // #DCE MATT-2438, remove the 'All Course Videos' when the player is directly embedded

      if (paella.player.getPlayerMode() === paella.PaellaPlayer.mode.embed) {
        buttonActions = ['About player', 'Report a problem', 'System status', 'Privacy policy', thisClass._classHandoutKey];
      }

      popUp.append(thisClass.getItemTitle());
      buttonActions.forEach(function (item) {
        if (thisClass.checkItemEnabled(item)) {
          popUp.append(thisClass.getItemButton(item));
        }
      });
      jQuery(domElement).append(popUp);
    }

    getItemTitle() {
      var mpInfo = paella.opencast._episode.mediapackage;
      var titleDiv = mpInfo.title ? '<span>' + mpInfo.title + '</span>' : '';
      var seriesTitleDiv = mpInfo.seriestitle ? '<span>' + mpInfo.seriestitle + '</span>' : '';
      var elem = jQuery('<div />');
      elem.attr({
        'class': 'infoPubTitle'
      }).html(seriesTitleDiv + titleDiv);
      return elem;
    }

    getItemButton(buttonAction) {
      var thisClass = this;
      var elem = jQuery('<div />');
      elem.attr({
        'class': 'infoItemButton'
      }).text(buttonAction);
      elem.click(function (event) {
        thisClass.onItemClick(buttonAction);
      });
      return elem;
    }

    onItemClick(buttonAction) {
      switch (buttonAction) {
        case 'About player':
          var param = paella.player.isLiveStream() ? "show=live" : "show=vod";

          if (typeof paella.plugins.timedCommentsHeatmapPlugin != "undefined" && paella.plugins.timedCommentsHeatmapPlugin.isEnabled) {
            param = param + "&timedcomments";
          }

          window.open('watchAbout.html?' + param);
          break;

        case 'Privacy policy':
          window.open(this._privacyPolicyLink);
          break;

        case 'Report a problem':
          var paramsP = 'ref=' + this.getVideoUrl() + '&server=MH';

          if (paella.opencast && paella.opencast._episode) {
            paramsP += paella.opencast._episode.dcIsPartOf ? '&offeringId=' + paella.opencast._episode.dcIsPartOf : '';
            paramsP += paella.opencast._episode.dcType ? '&typeNum=' + paella.opencast._episode.dcType : '';
            paramsP += paella.opencast._episode.dcContributor ? '&ps=' + paella.opencast._episode.dcContributor : '';
            paramsP += paella.opencast._episode.dcCreated ? '&cDate=' + paella.opencast._episode.dcCreated : '';
            paramsP += paella.opencast._episode.dcSpatial ? '&cAgent=' + paella.opencast._episode.dcSpatial : '';
            paramsP += paella.opencast._episode.id ? '&id=' + paella.opencast._episode.id : '';
          }

          window.open('../ui/index.html#/rap?' + paramsP);
          break;

        case 'System status':
          window.open('http://status.dce.harvard.edu');
          break;

        case 'All Course Videos':
          if (paella.opencast && paella.opencast._episode && paella.opencast._episode.dcIsPartOf) {
            var seriesId = paella.opencast._episode.dcIsPartOf; // MATT-1373 reference combined pub list page when series looks like the DCE <academicYear><term><crn>

            if (seriesId.toString().match('^[0-9]{11}$')) {
              var academicYear = seriesId.toString().slice(0, 4);
              var academicTerm = seriesId.toString().slice(4, 6);
              var courseCrn = seriesId.toString().slice(6, 11);
              location.href = '../ui/index.html#/' + academicYear + '/' + academicTerm + '/' + courseCrn;
            } else {
              // For an unknown series signature, reference the old 1.4x MH only, pub list page
              location.href = '../ui/publicationListing.shtml?seriesId=' + seriesId;
            }
          } else {
            message = 'No other lectures found.';
            paella.messageBox.showMessage(message);
          }

          break;

        case this._classHandoutKey:
          // Only one handout enabled
          if (this._classHandouts.length > 0) {
            window.open(this._classHandouts[0].url);
          }

          break;
      }

      paella.events.trigger(paella.events.hidePopUp, {
        identifier: this.getName()
      });
    }

    getVideoUrl() {
      return document.location.href;
    }

    checkItemEnabled(item) {
      if (item === this._classHandoutKey) {
        var isenabled = this.checkClassHandouts();
        return isenabled;
      } else {
        return true;
      }
    }

    checkClassHandouts() {
      // retrieve any attached handouts (type "attachment/notes")
      var attachments = paella.opencast._episode.mediapackage.attachments.attachment;

      if (!(attachments instanceof Array)) {
        attachments = [attachments];
      } // Checking for multiple handouts, but only enabling one


      for (var i = 0; i < attachments.length; ++i) {
        var attachment = attachments[i];

        if (attachment !== undefined) {
          if (attachment.type == "attachment/notes") {
            this._classHandouts.push(attachment);
          }
        }
      }

      var isenabled = this._classHandouts.length > 0;
      return isenabled;
    }

  };
});
// MATT-2217 #DCE disable fullscreen & slide frame plugin on iPhone device
// This plugin waits 200ms (changed via config) after the "loadPlugins" event before
// overriding the only param that can disable a UPV plugin after it's been loaded (its default min window size).
// Update for Paella 6.1.2
//TODO: is this override still needed to override the diplay of Paella plugs fullScreenPlugin and frameControlPlugin??
paella.addPlugin(function () {
  return class IphonePluginDisablerPlugin extends paella.EventDrivenPlugin {
    constructor() {
      super();
      this._actiondelay = 200;
    }

    setup() {
      // override the default via config
      this._actiondelay = this.config.actiondelay || this._actiondelay;
    }

    getName() {
      return "edu.harvard.dce.paella.iphonePluginDisablerPlugin";
    }

    getEvents() {
      return [paella.events.loadPlugins];
    }

    onEvent(event, params) {
      this.disable();
    }

    checkEnabled(onSuccess) {
      onSuccess(navigator.userAgent.match(/(iPhone)/g));
    }

    disable() {
      window.setTimeout(function () {
        // Not a fan, but need to give plugins a chance to load before overriding the attributes.
        paella.plugins.fullScreenPlugin.getMinWindowSize = function () {
          return 10000;
        };

        paella.plugins.frameControlPlugin.getMinWindowSize = function () {
          return 10000;
        };
      }, 200);
    }

  };
});
// PresentationOnlyPlugin toggle purpose: Turn off presenter source to reduce bandwidth when presentation only view.
// One activation on qualities change (called directly).
// The crux: must set videoContainer sources and reload videos when changing from single to multi or multi to single
// The quirks:
//   - if last saved profile was presenterOnly, reload switches back to multi view default profile
//   - assumes 1:1 on res/quality numbers between source & master
//   - assumes a single slave (not multiple slaves)
//
// Update for Paella 6.1.2
// TODO: does Paella now shut off the undisplayed stream so that this plugin is no longer needed?
// TODO: all the masterVideo NEEDS to be refactored for 6.1.2
paella.addPlugin(function () {
  return class PresentationOnlyPlugin extends paella.EventDrivenPlugin {
    constructor() {
      super();
      this.isCurrentlySingleStream = false;
      this._master = null;
      this._slave = null;
      this._preferredMethodMaster = null;
      this._preferredMethodSlave = null; // This profile must exist in the profile.json

      this._presentationOnlyProfile = 'monostream';
      this._currentQuality = '';
      this._currentProfile = '';
      this._currentPlaybackRate = 1;
      this._lastMultiProfile = null;
      this._currentState = [];
      this._isEnabled = false;
    }

    getName() {
      return "edu.harvard.dce.paella.presentationOnlyPlugin";
    }

    getEvents() {
      // init DCE event that is thrown from here
      paella.events.donePresenterOnlyToggle = "dce:donePresenterOnlyToggle"; // listen to set profile and load events

      return [paella.events.setProfile, paella.events.loadPlugins];
    }

    onEvent(eventType, params) {
      switch (eventType) {
        case paella.events.setProfile:
        case paella.events.loadPlugins:
          this._firstLoadAction(params);

          break;
      }
    }

    checkEnabled(onSuccess) {
      // As long as multivideo loads as multi video this is true the first time around
      if (!this._isEnabled && !paella.player.isLiveStream() && !paella.player.videoContainer.isMonostream) {
        this._isEnabled = true;
      }

      onSuccess(this._isEnabled);
    }
    /**
     * Called directly by qualitiesPresentationPlugin
     * 1. if on single and mutli coming across, change to multi of passed res
     * 2. if on multi and single coming accross, change to single and passed res
     * 3. if on same data.type and different res change, change res
     * 4. if on same data.type and same res, don't do anything
     *
     */


    toggleResolution(data) {
      var thisClass = this;
      var isSingle = paella.player.videoContainer.isMonostream;

      if (!isSingle && data.type === paella.plugins.singleMultipleQualitiesPlugin.singleStreamLabel) {
        thisClass._toggleMultiToSingleProfile(data);
      } else if (isSingle && data.type === paella.plugins.singleMultipleQualitiesPlugin.multiStreamLabel) {
        thisClass._toggleSingleToMultiProfile(data);
      } else if (data.label === thisClass._currentQuality) {
        base.log.debug("PO: no work needed, same quality " + data.label + ", reso:" + data.reso + ", reso2: " + data.reso2);
        paella.events.trigger(paella.events.donePresenterOnlyToggle);
      } else {
        base.log.debug("PO: no source swap needed, toggling res quality to " + data.index);
        paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
          // "paella.pluginManager.doResize" is a custom #DCE param
          //  used to prevent getMasterVideo timer collisions during source swap
          //  see DCE opencast-paella vendor override src/05_plugin_base.js
          paella.pluginManager.doResize = false;

          thisClass._saveCurrentState(videoData, data.index);

          thisClass._addMasterReloadListener(videoData);

          paella.player.videoContainer.setQuality(data.index).then(function () {
            thisClass._restoreState(videoData);

            paella.pluginManager.doResize = true;
            paella.events.trigger(paella.events.donePresenterOnlyToggle);
          });
        });
      }

      thisClass._currentQuality = data.label;
    }

    _getSources() {
      if (this._slave === null) {
        base.log.debug("PO: Getting  original stream sources");

        this._getStreamSources();
      }
    }

    _firstLoadAction(params) {
      if (this._currentProfile !== '') {
        base.log.debug("PO: not first time load, saving state " + params.profileName);
        this._currentProfile = params.profileName;
        return false;
      }

      base.log.debug("PO: first time load: correcting monostream load on mutlivideo pub.");
      this._currentProfile = base.cookies.get('lastProfile');

      if (this._presentationOnlyProfile === this._currentProfile && !paella.player.videoContainer.isMonostream) {
        this.isCurrentlySingleStream = paella.player.videoContainer.isMonostream;

        if (paella.player.config.defaultProfile) {
          base.log.debug("PO: saved profile is " + this._currentProfile + ", but changing to " + paella.player.config.defaultProfile);
          this._currentProfile = paella.player.config.defaultProfile;
          paella.player.setProfile(this._currentProfile);
        } else {
          base.log.debug("PO: Cannot change to multivideo profile because cannot find paella.player.config.defaultProfile");
        }
      }

      this.isCurrentlySingleStream = paella.player.videoContainer.isMonostream;
      this._lastMultiProfile = this._currentProfile;
      return true;
    }

    _toggleMultiToSingleProfile(data) {
      base.log.debug("PO: toggle from Multi to Single with resolution " + data.reso);
      var sources = null;

      this._getSources();

      base.log.debug("PO: getting slave (presentation ) " + JSON.stringify(this._slave)); // unset previously set roles  (v5.2+)

      this._slave.role = undefined;
      sources = [this._slave];

      this._toggleSources(sources, true, data.index);

      paella.plugins.viewModeTogglePlugin.turnOffVisibility();
    }

    _toggleSingleToMultiProfile(data) {
      base.log.debug("PO: toggle from Single to Multi with master " + data.reso + " and slave " + data.reso2);
      var sources = null;

      this._getSources();

      base.log.debug("PO: getting slave (presentation) " + JSON.stringify(this._slave) + ", and master (presenter) " + JSON.stringify(this._master)); // unset previously set roles (v5.2+)

      this._slave.role = undefined;
      this._master.role = undefined;
      sources = [this._master, this._slave];

      this._toggleSources(sources, false, data.index);

      paella.plugins.viewModeTogglePlugin.turnOnVisibility();
    }

    _saveCurrentState(data, index) {
      this._currentState = data;
      this._currentPlaybackRate = paella.player.videoContainer.masterVideo()._playbackRate; // currentQuality used by DCE requestedOrBestFitVideoQualityStrategy during reload

      paella.dce.currentQuality = index; // save current volume to player config to be used during video recreate

      if (paella.player.config.player.audio) {
        paella.player.config.player.audio.master = data.volume;
      }
    }

    _restoreState(videoData) {
      var self = this;
      paella.player.videoContainer.seekToTime(videoData.currentTime); // #DCE, Un-pause the plugin manager's timer from looking to master video duration
      // "paella.pluginManager.doResize" is a custom #DCE param,
      // see DCE opencast-paella vendor override: src/05_plugin_base.js

      paella.pluginManager.doResize = true;
      paella.player.videoContainer.setVolume({
        'master': videoData.volume,
        'slave': 0
      }).then(function () {
        base.log.debug("PO: after set volume to " + videoData.volume); // Reset playback rate via playback button (ensure correct UI) if playback rate is not the default of 1.

        var playbackRateButton = $('#' + self._currentPlaybackRate.toString().replace(".", "\\.") + 'x_button');

        if (self.currentPlaybackRate != 1 && $(playbackRateButton).length) {
          $(playbackRateButton).click();
        } //start 'em up if needed


        if (!videoData.paused) {
          paella.player.paused().then(function (stillPaused) {
            if (stillPaused) {
              paella.player.play();
            }
          });
        } // completely swapping out sources requires res selection update


        paella.events.trigger(paella.events.donePresenterOnlyToggle);
      });
    }

    _getStreamSources() {
      var self = this;
      var loader = paella.player.videoLoader;
      self._master = loader.streams[0];
      self._slave = loader.streams[1];
    } // in Paella5 setStreamData() loads master & slave videos, to they need to be unloaded first.


    _toggleSources(sources, isPresOnly, resIndex) {
      var self = this;

      if (self._slave === null) {
        base.log.error("PO: Stream resources were not properly retrieved at set up");
        return;
      }

      var wasSingle = paella.player.videoContainer.isMonostream;
      paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
        self._saveCurrentState(videoData, resIndex); // pause videos to temporarily stop update timers


        paella.player.videoContainer.pause().then(function () {
          // Pause the plugin manager's timer from looking for master video duration
          // "paella.pluginManager.doResize" is a custom #DCE param,
          //  see DCE opencast-paella vendor override src/05_plugin_base.js
          paella.pluginManager.doResize = false;
          base.log.debug("PO: Turned off doResize and paused videos, about to remove nodes");

          self._removeVideoNodes();

          if (!wasSingle) {
            // set the cookie to monostream so setStreamData correctly sets single stream initialization
            base.cookies.set("lastProfile", self._presentationOnlyProfile);
            self._lastMultiProfile = paella.player.videoContainer.getCurrentProfileName();
          } else {
            // set the to the default profile
            base.cookies.set("lastProfile", self._lastMultiProfile);
          }

          if (sources !== null) {
            base.log.debug("PO: Before videoContainer.setStreamData's sources to reload video container(s) " + sources);
            paella.player.videoContainer.setStreamData(sources).then(function () {
              base.log.debug("PO: Successfully changed stream sources");

              if (isPresOnly && !wasSingle) {
                base.log.debug("PO: Changed source multi to single, monostream " + paella.player.videoContainer.isMonostream);
              } else if (!isPresOnly && wasSingle) {
                base.log.debug("PO: Changed source single to multi, monostream " + paella.player.videoContainer.isMonostream);
              } else {
                base.log.debug("PO: WARN Unexpected toggle state.");
              }

              self._restoreState(videoData);
            });
          }
        });
      });
    } // in Paella5, need to manually remove nodes before reseting video source data


    _removeVideoNodes() {
      var video1node = paella.player.videoContainer.masterVideo();
      var video2node = paella.player.videoContainer.slaveVideo(); // ensure swf object is removed

      if (typeof swfobject !== "undefined") {
        swfobject.removeSWF("playerContainer_videoContainer_1Movie");
      }

      paella.player.videoContainer.videoWrappers[0].removeNode(video1node);

      if (video2node && paella.player.videoContainer.videoWrappers.length > 1) {
        paella.player.videoContainer.videoWrappers[1].removeNode(video2node);
      } // empty the set of video wrappers


      paella.player.videoContainer.videoWrappers = []; // remove video container wrapper nodes

      var masterWrapper = paella.player.videoContainer.container.getNode("masterVideoWrapper");
      paella.player.videoContainer.container.removeNode(masterWrapper);
      var slaveWrapper = paella.player.videoContainer.container.getNode("slaveVideoWrapper");

      if (slaveWrapper) {
        paella.player.videoContainer.container.removeNode(slaveWrapper);
      } // clear existing stream provider data


      paella.player.videoContainer._streamProvider.constructor();

      base.log.debug("PO: removed video1 and video2 nodes");
    } // Video load listener to unfreeze a frozen moster video with a seek event


    _addMasterReloadListener(state) {
      base.log.debug("PO: about to bind master reload 'emptied' event");
      var video1node = paella.player.videoContainer.masterVideo();
      $(video1node.video).bind('emptied', function (evt) {
        base.log.debug("PO: on event 'emptied', doing seekToTime to unfreeze master " + JSON.stringify(state));
        paella.player.videoContainer.seekToTime(state.currentTime);
        $(this).unbind('emptied');
      }); // needed for Safari

      $(video1node.video).bind('canplay canplaythrough', function (evt) {
        if (!paella.pluginManager.doResize) {
          base.log.debug("PO: on event " + evt.type + ", doing seekToTime to unfreeze master");
          paella.player.videoContainer.seekToTime(state.currentTime);
        }

        $(this).unbind('canplay canplaythrough');
      });
    }

  };
});
// based on es.upv.paella.multipleQualitiesPlugin, "paella.plugins.MultipleQualitiesPlugin"
// Update for Paella 6.1.2
// TODO: ensure this is only active for mp4 not hls
// TODO: all the masterVideo NEEDS to be refactored for 6.1.2
paella.addPlugin(function () {
  return class SingleMultipleQualitiesPlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this.currentUrl = null;
      this.currentMaster = null;
      this.currentSlave = null;
      this.currentLabel = '';
      this._currentQuality = null;
      this.availableMasters = [];
      this.availableSlaves = [];
      this.showWidthRes = null;
      this._domElement = null; // to filter out presentations without a matching file str match
      // the default value can be changed by the config file.

      this._presenterHasAudioTag = 'multiaudio';
      this.presentationOnlyLabel = 'Go_to_Presentation_Only';
      this.singleStreamLabel = 'SINGLESTREAM';
      this.bothVideosLabel = 'Go_to_Both_Videos';
      this.multiStreamLabel = 'MULTISTREAM';
      this.toggleButton = null;
      this.singleLabelButton = null;
      this.multiLabelButton = null;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showMultipleQualitiesPlugin";
    }

    getIconClass() {
      return 'icon-qualities-toggle';
    }

    getIndex() {
      return 448;
    }

    getMinWindowSize() {
      return 550;
    }

    getName() {
      return "edu.harvard.edu.paella.singleMultipleQualitiesPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Change video quality");
    }

    checkEnabled(onSuccess) {
      var This = this;
      paella.player.videoContainer.getQualities().then(function (q) {
        onSuccess(This.availableSlaves.length > 0 || q.length > 1);
      });
    }

    setup() {
      var This = this;
      This.initData();
      This.setQualityLabel(); // Inserting a new event type (triggered by DCE presentationOnlyPlugin)

      paella.events.donePresenterOnlyToggle = "dce:donePresenterOnlyToggle"; // Inserting a new event type (triggered by DCE singleVideoPlugin)

      paella.events.doneSingleVideoToggle = "dce:doneSingleVideoToggle"; //config

      This.showWidthRes = This.config.showWidthRes !== undefined ? This.config.showWidthRes : true;
      paella.events.bind(paella.events.qualityChanged, function (event) {
        This.setQualityLabel();
      });
      paella.events.bind(paella.events.donePresenterOnlyToggle, function (event) {
        This.turnOnVisibility();
      });
      paella.events.bind(paella.events.doneSingleVideoToggle, function (event) {
        This.rebuildContent();
      });
    }

    initData() {
      var key, j;
      var container = paella.player.videoContainer.getNode("playerContainer_videoContainer_container");
      this.currentMaster = paella.player.videoContainer.masterVideo();
      this.currentSlave = paella.player.videoContainer.slaveVideo ? paella.player.videoContainer.slaveVideo() : null;
      var minVerticalRes = parseInt(this.config.minVerticalRes);
      var maxVerticalRes = parseInt(this.config.maxVerticalRes);

      if (this.config.presenterHasAudioTag) {
        this._presenterHasAudioTag = this.config.presenterHasAudioTag;
      } // Search for the resolutions


      var allMasterSources = paella.player.videoContainer.sourceData[0].sources;

      for (key in allMasterSources) {
        // This assumes the video container has a stream name attribute (i.e.'rtmp', 'mp4', etc).
        // Note: this does not differentiate on sub-types of "rtmp" stream (i.e. video/x-flv, video/mp4).
        // The strategy may need to be revisited in the future to filter out stream source types of "hls", "mpd", etc.
        if (key === this.currentMaster._streamName) {
          for (j = 0; j < allMasterSources[key].length; ++j) {
            if (isNaN(minVerticalRes) == false && parseInt(allMasterSources[key][j].res.h) < minVerticalRes) {
              continue;
            }

            if (isNaN(maxVerticalRes) == false && parseInt(allMasterSources[key][j].res.h) > maxVerticalRes) {
              continue;
            }

            this.availableMasters.push(allMasterSources[key][j]);
          }
        }
      }

      if (this.currentSlave) {
        var allSlaveSources = paella.player.videoContainer.sourceData[1].sources;

        for (key in allSlaveSources) {
          for (j = 0; j < allSlaveSources[key].length; ++j) {
            if (allSlaveSources[key][j].type.split("/")[1] == this.currentSlave._streamName || // #DCE  OPC-357-HLS-VOD  hls type ->  x-mpegURL <> hls ( Fix for singlestream paella problem)
            // NOTE -  This plugin is not being used for DCE HLS VOD, the default paella one is
            key === this.currentSlave._streamName) {
              if (isNaN(minVerticalRes) == false && parseInt(allSlaveSources[key][j].res.h) < minVerticalRes) {
                continue;
              }

              if (isNaN(maxVerticalRes) == false && parseInt(allSlaveSources[key][j].res.h) > maxVerticalRes) {
                continue;
              }

              this.availableSlaves.push(allSlaveSources[key][j]);
            }
          }
        }
      } // Sort the available resolutions


      function sortfunc(a, b) {
        var ia = parseInt(a.res.h);
        var ib = parseInt(b.res.h);
        return ia < ib ? -1 : ia > ib ? 1 : 0;
      }

      this.availableMasters.sort(sortfunc);
      this.availableSlaves.sort(sortfunc);
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    buildContent(domElement) {
      var This = this;
      paella.player.videoContainer.getCurrentQuality().then(function (q) {
        This._currentQuality = q;

        This._buildContent(domElement);
      });
    }

    rebuildContent() {
      var self = this;
      self.availableMasters = [];
      self.availableSlaves = [];
      $(self._domElement).empty();
      self.initData();

      self._buildContent(self._domElement);
    }

    _buildContent(domElement) {
      var self = this;
      self._domElement = domElement;
      var w,
          h,
          d,
          e,
          b = 0;
      var percen1, percen2, reso2, act_percen;
      percen1 = 100 / this.availableMasters.length;

      if (this.availableSlaves.length == 0 && this.availableMasters.length > 0) {
        this._buildSingleStreamDom(this.availableMasters);

        return;
      }

      percen2 = 100 / this.availableSlaves.length;

      if (this.availableSlaves.length > 0 && !this._isFiltered()) {
        this._buildSingleStreamDom(this.availableSlaves);
      }

      if (this.availableMasters.length >= this.availableSlaves.length) {
        this._buildMultiStreamDom(percen2, this.availableMasters, this.availableSlaves);
      } else {
        this._buildMultiStreamDom(percen1, this.availableSlaves, this.availableMasters);
      }
    }

    _buildSingleStreamDom(availableSlaves) {
      var w,
          h,
          d,
          e,
          b = 0;
      var reso;
      this.singleLabelButton = this.getItemButton(this.singleStreamLabel, this.singleStreamLabel);

      this._domElement.appendChild(this.singleLabelButton);

      for (var i = 0; i < availableSlaves.length; i++) {
        w = availableSlaves[i].res.w;
        h = availableSlaves[i].res.h;
        reso = w + "x" + h;

        if (this.showWidthRes) {
          this._domElement.appendChild(this.getItemButton(this.singleStreamLabel, reso, reso, reso, i));
        } else {
          this._domElement.appendChild(this.getItemButton(this.singleStreamLabel, h + "p", reso, reso, i));
        }
      }
    }

    _buildMultiStreamDom(percent, availableA, availableB) {
      var w,
          h,
          d,
          e,
          b = 0;
      var reso2;
      var act_percen = percent; // no mutli label when no slaves

      if (availableB.length > 0) {
        this.multiLabelButton = this.getItemButton(this.multiStreamLabel, this.multiStreamLabel);

        this._domElement.appendChild(this.multiLabelButton);
      }

      for (var i = 0; i < availableA.length; i++) {
        w = availableA[i].res.w;
        h = availableA[i].res.h;

        if (availableB.length > 0) {
          if (percent * (i + 1) < act_percen) {
            d = availableB[b].res.w;
            e = availableB[b].res.h;
            reso2 = d + "x" + e;
          } else {
            act_percen = percent + act_percen;
            d = availableB[b].res.w;
            e = availableB[b].res.h;
            reso2 = d + "x" + e;
            b++;
          }
        }

        if (this.showWidthRes) {
          this._domElement.appendChild(this.getItemButton(this.multiStreamLabel, w + "x" + h, w + "x" + h, reso2, i));
        } else {
          this._domElement.appendChild(this.getItemButton(this.multiStreamLabel, h + "p", w + "x" + h, reso2, i));
        }
      }
    }

    getCurrentResType() {
      if (paella.player.videoContainer.isMonostream) {
        return this.singleStreamLabel;
      } else {
        return this.multiStreamLabel;
      }
    }

    getCurrentResLabel() {
      if (this.showWidthRes) {
        return this._currentQuality.res.w + "x" + this._currentQuality.res.h;
      } else {
        return this._currentQuality.shortLable();
      }
    }

    getItemButton(type, label, reso, reso2, index) {
      var elem = document.createElement('div');

      if (this._isCurrentRes(label, type)) {
        elem.className = this.getButtonItemClass(label, true);
      } else {
        elem.className = this.getButtonItemClass(label, false);
      }

      elem.id = label + '_button';
      elem.innerHTML = label;
      elem.data = {
        index: index,
        type: type,
        label: label,
        reso: reso,
        reso2: reso2,
        plugin: this
      };

      if (type !== label) {
        $(elem).click(function (event) {
          this.data.plugin.onItemClick(elem.data);
          $('.multipleQualityItem').removeClass('selected');
          $(this).addClass('selected');
        });
      }

      return elem;
    }

    onItemClick(data) {
      var self = this;
      paella.player.controls.hidePopUp(self.getName());
      paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
        if (typeof paella.plugins.presentationOnlyPlugin !== "undefined") {
          paella.plugins.presentationOnlyPlugin.checkEnabled(function (isEnabled) {
            if (isEnabled) {
              self.turnOffVisibility();
              paella.plugins.presentationOnlyPlugin.toggleResolution(data);
            } else {
              paella.pluginManager.doResize = false;

              self._addMasterReloadListener(videoData);

              paella.player.videoContainer.setQuality(data.index).then(function () {
                self.setQualityLabel();
                paella.pluginManager.doResize = true;
              });
            }
          });
        } else {
          paella.player.videoContainer.setQuality(data.index).then(function () {
            self.setQualityLabel();
          });
        }
      });
      var arr = self._domElement.children;

      for (var i = 0; i < arr.length; i++) {
        arr[i].className = self.getButtonItemClass(i, false);
      }

      this._setResCookie(data.index);
    } // paella5 style


    setQualityLabel() {
      var This = this;
      paella.player.videoContainer.getCurrentQuality().then(function (q) {
        This.setText(q.shortLabel());
        This.currentLabel = q.shortLabel();
        This._currentQuality = q;
      });
    }

    getButtonItemClass(profileName, selected) {
      return 'multipleQualityItemDce ' + profileName + (selected ? ' selected' : '');
    }

    turnOffVisibility() {
      paella.PaellaPlayer.mode.none = 'none';
      this.config.visibleOn = [paella.PaellaPlayer.mode.none];
      this.hideUI();
    }

    turnOnVisibility() {
      this.config.visibleOn = undefined;
      this.checkVisibility();
      this.setQualityLabel();
    }

    _isCurrentRes(label, type) {
      var currentResLabel = this.getCurrentResLabel();
      var currentResType = this.getCurrentResType();
      console.log("DCE-DEBUG - label:" + label + ", curLabel:" + currentResLabel + " type:" + type + ", curreType:" + currentResType);

      if (label === currentResLabel && type === currentResType) {
        return true;
      } else {
        return false;
      }
    }

    _isFiltered() {
      var track1Data = paella.opencast._episode.mediapackage.media.track[0];

      if (track1Data && track1Data.tags && track1Data.tags.tag && !track1Data.tags.tag.contains(this._presenterHasAudioTag)) {
        base.log.debug("Not providing the presentation-only view because media is not tagged with " + this._presenterHasAudioTag);
        return true;
      }

      return false;
    } // Unfreeze the frozen quality res changed videos with a seek event


    _addMasterReloadListener(state) {
      base.log.debug("PO: about to bind master reload 'emptied' event");
      var video1node = paella.player.videoContainer.masterVideo();
      $(video1node.video).bind('emptied', function (evt) {
        base.log.debug("PO: on event 'emptied', doing seekToTime to unfreeze master ");
        paella.player.videoContainer.seekToTime(state.currentTime);
        $(this).unbind('emptied');
      }); // needed for Safari

      $(video1node.video).bind('canplay canplaythrough', function (evt) {
        if (!paella.pluginManager.doResize) {
          base.log.debug("PO: on event " + evt.type + ", doing seekToTime to unfreeze master");
          paella.player.videoContainer.seekToTime(state.currentTime);
        }

        $(this).unbind('canplay canplaythrough');
      });
    }

    _setResCookie(index) {
      var resCookie;

      if (index == this.availableMasters.length - 1) {
        resCookie = 'high';
      } else if (index == 0) {
        resCookie = 'low';
      } else {
        resCookie = 'medium';
      }

      base.cookies.set("lastResolution", resCookie);
    }

  };
});
// #DCE MATT-2467 retrieve resolution from param or fallback to best fit strategy
class RequestedOrBestFitVideoQualityStrategy extends paella.VideoQualityStrategy {
  // From the UPV BestFitVideoQualityStrategy
  getBestFit(source, index) {
    var selected = source[0];
    var win_w = $(window).width();
    var win_h = $(window).height();
    var win_res = win_w * win_h;

    if (selected.res && selected.res.w && selected.res.h) {
      var selected_res = parseInt(selected.res.w) * parseInt(selected.res.h);
      var selected_diff = Math.abs(win_res - selected_res);

      for (var i = 0; i < source.length; ++i) {
        var res = source[i].res;

        if (res) {
          var m_res = parseInt(source[i].res.w) * parseInt(source[i].res.h);
          var m_diff = Math.abs(win_res - m_res);

          if (m_diff <= selected_diff) {
            selected_diff = m_diff;
            index = i;
          }
        }
      }
    }

    return index;
  }

  getQualityIndex(source) {
    var index = source.length - 1; // retrieve URL param, if it was passed

    var requestedResolution = base.parameters.get('res');

    if (!requestedResolution) {
      requestedResolution = base.cookies.get('lastResolution');
    } // Use current quality index from custom param (used for source toggle)


    var currentQualityIndex = paella.dce.currentQuality;

    if (currentQualityIndex > -1 && currentQualityIndex < source.length) {
      base.log.debug("returning currentQualityIndex" + currentQualityIndex);
      return currentQualityIndex;
    }

    if (source.length > 0) {
      switch (requestedResolution) {
        case "high":
          index = source.length - 1;
          break;

        case "medium":
          // takes medium res or the lower of 2 medium res (i.e. if only 2 res, high and low, it takes the low)
          index = source.length % 2 === 0 ? source.length / 2 - 1 : (source.length - 1) / 2;
          break;

        case "low":
          index = 0;
          break;

        default:
          index = this.getBestFit(source, index);
      }
    }

    return index;
  }

}

;
paella.RequestedOrBestFitVideoQualityStrategy = RequestedOrBestFitVideoQualityStrategy;
// #DCE OPC-374 trigger a player resize at setComposition when video is live.
// For RTMP, paella.player.onresize is never called to fix the view dimension.
paella.addPlugin(function () {
  return class ResizeLiveStream extends paella.EventDrivenPlugin {
    getName() {
      return "edu.harvard.dce.paella.resizeLiveStream";
    }

    checkEnabled(onSuccess) {
      if (paella.player.isLiveStream()) {
        onSuccess(true);
      } else {
        onSuccess(false);
      }
    }

    getEvents() {
      return [paella.events.setComposition];
    }

    onEvent(eventType, params) {
      let timer = new paella.Timer(function (timer) {
        paella.player.onresize();
      }, 1000);
      timer.repeat = false;
    }

  };
});
// MATT-2192 Safari version 10.0.1 control bar disappears after exiting full. This is temp fix (bug was submitted via Apple developer)
// Adapted for Paella 6.2.2  (Safari iOS fullscreen icon disappears after exiting fullscreen)
paella.addPlugin(function () {
  return class Safari10ExitFullScreenControlBarMagicFix extends paella.EventDrivenPlugin {
    constructor() {
      super();
    }

    getName() {
      return "edu.harvard.dce.safari10ExitFullScreenControlBarMagicFix";
    }

    getEvents() {
      return [paella.events.exitFullscreen];
    }

    onEvent(eventType, params) {
      this.magicFix();
    }

    checkEnabled(onSuccess) {
      // Only for Safari
      if (base.userAgent.browser.Safari) {
        onSuccess(true);
      } else {
        onSuccess(false);
      }
    }

    magicFix() {
      if ($("#playerContainer_controls").length == 0) return;
      var self = this;
      var randomSmallMaxHeight = "6px";
      var safariMagicDelayInMs = 1000;
      var maxHeightOrig = $("#playerContainer_controls").css("max-height");
      $("#playerContainer_controls").css({
        "max-height": randomSmallMaxHeight
      }); // Do the magic pause!

      setTimeout(function () {
        self.resetMaxHeight(maxHeightOrig);

        if (base.userAgent.system.iOS) {
          // Mitigate missing fullScreen icon on exiting full screen in Safari iOS
          self.retryOnExitFullScreen();
        }
      }, safariMagicDelayInMs);
    }

    resetMaxHeight(maxHeightOrig) {
      $("#playerContainer_controls").css({
        "max-height": maxHeightOrig
      });
    }

    retryOnExitFullScreen() {
      let fullScreenPlugin = paella.pluginManager.pluginList.find(p => p.getName() === "es.upv.paella.fullScreenButtonPlugin");

      if (fullScreenPlugin && fullScreenPlugin.onExitFullscreen) {
        fullScreenPlugin.onExitFullscreen();
      }
    }

  };
});
/** #DCE SingleVideoTogglePlugin
 * Purpose: reduce bandwidth on mobile by toggling between presentation & presenter video.
 * Uses audio from the visible track (no enabled if special HUDCE tag: multiaudio is not set)
 *
 * Updated for Paella 6x
 * Adapted for Paella 6.1.2
 * For Paella 6.2.0, the viewModeToggleProfilesPlugin module is required.
 */
paella.addPlugin(function () {
  return class SingleVideoTogglePlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this._iOSProfile = 'one_big';
      this._masterVideo = null;
      this._toggleIndex = 1; //toggle to presentation when button pressed first time
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Switch videos");
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showViewModeButton";
    }

    getIconClass() {
      return 'icon-presentation-mode';
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Change video layout");
    }

    getIndex() {
      return 450;
    }

    getInstanceName() {
      return "singleVideoTogglePlugin";
    }

    getName() {
      return "edu.harvard.dce.paella.singleVideoTogglePlugin";
    }

    _currentPlayerProfile() {
      return paella.player.selectedProfile;
    }

    checkEnabled(onSuccess) {
      // Only enable for iOS (not Android) TODO: test with Safari on Android?
      onSuccess(base.userAgent.system.iOS && paella.dce && paella.dce.sources && paella.dce.sources.length > 1 && !paella.dce.blankAudio);
    }

    getCurrentMasterVideo() {
      return paella.dce.videoPlayers.find(player => {
        return player === paella.player.videoContainer.masterVideo();
      });
    }

    action(button) {
      let This = this;
      paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
        paella.dce.videoDataSingle = videoData;
        paella.dce.videoDataSingle.playbackRate = paella.player.videoContainer.masterVideo().video.playbackRate; // pause videos to temporarily stop update timers

        paella.player.videoContainer.pause().then(function () {
          paella.pluginManager.doResize = false; // Remove the existing video nodes

          This._resetVideoNodes();

          paella.player.videoLoader._data.metadata.preview = null; // toggle each source sequentially

          let index = This._toggleIndex++ % paella.dce.sources.length;
          paella.player.videoLoader._data.streams = [paella.dce.sources[index]]; // Load with the updated loader data

          paella.player.loadVideo(); // reset state

          This._resetPlayerState();
        });
      });
    }

    _resetPlayerState() {
      paella.player.videoContainer.seekToTime(paella.dce.videoDataSingle.currentTime);
      paella.player.videoContainer.setVolume(paella.dce.videoDataSingle.volume);
      paella.player.videoContainer.setPlaybackRate(paella.dce.videoDataSingle.playbackRate); // User is required to click play to restart toggled video
    } // in Paella5 & 6, must manually remove nodes before reseting video source data


    _resetVideoNodes() {
      for (let i = 0; i < paella.player.videoContainer.videoWrappers.length; i++) {
        let wrapper = paella.player.videoContainer.videoWrappers[i];
        let wrapperNodes = [].concat(wrapper.nodeList);

        for (let j = 0; j < wrapperNodes.length; j++) {
          wrapper.removeNode(wrapperNodes[j]);
        }

        paella.player.videoContainer.removeNode(wrapper);
        $("#videoPlayerWrapper_0").remove(); // because removeNode doesn't remove wrappers
      } // clear existing stream provider data


      paella.player.videoContainer._streamProvider._mainStream = null;
      paella.player.videoContainer._streamProvider._videoStreams = [];
      paella.player.videoContainer._streamProvider._audioStreams = [];
      paella.player.videoContainer._streamProvider._mainPlayer = null;
      paella.player.videoContainer._streamProvider._audioPlayer = null;
      paella.player.videoContainer._streamProvider._videoPlayers = [];
      paella.player.videoContainer._streamProvider._audioPlayers = [];
      paella.player.videoContainer._streamProvider._players = [];
      base.log.debug("PO: removed all video nodes");
    }

  };
});
/**
 * #DCE MATT-1794, UI pluging for user to access one or more Mediapackage attachments
 * of type "attachment/notes". For example, a PDF handout.
 * This plugin is modeled on Paella's mh_downloads.js
 * This plugin is dependent on paella.TabBarPlugin.
 */
paella.addPlugin(function () {
  return class TabBarHandoutDownloadPlugin extends paella.TabBarPlugin {
    constructor() {
      super();
      this._domElement = null;
      this._attachments = [];
    }

    getSubclass() {
      return "handouts";
    }

    getIconClass() {
      return 'icon-folder';
    }

    getTabName() {
      return "Handouts";
    }

    getName() {
      return "edu.harvard.dce.paella.tabBarHandoutDownloadPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Class Handouts");
    }

    buildContent(domElement) {
      this.domElement = domElement;
      this.loadContent();
    }

    checkEnabled(onSuccess) {
      // retrieve any attached handouts (type "attachment/notes")
      var attachments = paella.opencast.episode.mediapackage.attachments.attachment;

      if (!(attachments instanceof Array)) {
        attachments = [attachments];
      }

      for (var i = 0; i < attachments.length; ++i) {
        var attachment = attachments[i];

        if (attachment !== undefined) {
          if (attachment.type == "attachment/notes") {
            this._attachments.push(attachment);
          }
        }
      }

      var isenabled = this._attachments.length > 0;
      onSuccess(isenabled);
    }

    loadContent() {
      var container = document.createElement('div');
      container.className = 'handoutsTabBarContainer';

      for (var i = 0; i < this._attachments.length; ++i) {
        var attachment = this._attachments[i];

        if (attachment !== undefined) {
          if (attachment.type == "attachment/notes") {
            container.appendChild(this.createLink(attachment, i));
          }
        }
      }

      this.domElement.appendChild(container);
    }

    createLink(attachment, tabindexcount) {
      var elem = document.createElement('div');
      elem.className = 'handoutLinkContainer';
      var link = document.createElement('a');
      link.className = 'handoutLinkItem';
      link.innerHTML = this.getTextInfo(attachment);
      link.setAttribute('tabindex', 4050 + tabindexcount);
      link.setAttribute('target', '_blank');
      link.href = attachment.url;
      elem.appendChild(link);
      return elem;
    }

    getTextInfo(attachment) {
      var text = ''; // parse the handout file name as the text

      if (attachment.url) {
        text = '<span class="handoutLinkText fileName">' + attachment.url.substr(attachment.url.lastIndexOf("/") + 1) + '</span>';
      } // in case it sends an attachment mimetype


      var mimetype = '';

      if (attachment.mimetype) {
        text += ' <span class="handoutLinkText MIMEType">[' + paella.dictionary.translate(attachment.mimetype) + ']' + '</span>';
      }

      return text;
    }

  };
});
// Same as MHAnnotationServiceDefaultDataDelegate except returns the root level annotation data
// Adapted for Paella 6.1.2
paella.addDataDelegate("timedComments", () => {
  return class TimedCommentsDataDelegate extends paella.DataDelegate {
    // #DCE MATT-2245 Get the user's annotation name
    getMyPseudoName(context, params, onSuccess) {
      var mpId = params.id;
      base.ajax.get({
        url: '/annotation/property',
        params: {
          mediaPackageId: mpId,
          type: "paella/" + context,
          propertyName: "userName"
        }
      }, function (data, contentType, returnCode) {
        // 200: returns user name, 204: if no user name
        if (returnCode == '204') {
          data = null;
        }

        onSuccess(data, true);
      }, function (data, contentType, returnCode) {
        onSuccess(data, false);
      });
    } // #DCE MATT-2245 Update or Set the user's annotation name


    setMyPseudoName(context, params, onSuccess) {
      var mpId = params.id;
      var userName = params.newPseudoName;
      base.ajax.post({
        url: '/annotation/property',
        params: {
          mediaPackageId: mpId,
          propertyValue: userName,
          type: "paella/" + context,
          propertyName: "userName"
        }
      }, function (data, contentType, returnCode) {
        onSuccess(data, returnCode, true);
      }, function (data, contentType, returnCode) {
        onSuccess(data, returnCode, false);
      });
    } // This is the "READ" entry point for this Data Delegate


    read(context, params, onSuccess) {
      var thisClass = this;
      var question = params.question;
      var episodeId = params.id;
      var ifModifiedSince = params.ifModifiedSince;

      if (question === 'canAnnotate') {
        thisClass.isCanAnnotate(context, episodeId, onSuccess);
      } else if (question === 'getMyPseudoName') {
        thisClass.getMyPseudoName(context, params, onSuccess);
      } else {
        thisClass.getAnnotations(context, episodeId, ifModifiedSince, onSuccess);
      }
    } // This is the "WRITE" entry point for this Data Delegate
    // #DCE note: This saves annotations as public in a digest format with question/answer.
    // Write creates a new note


    write(context, params, value, onSuccess) {
      var thisClass = this;

      if (params.update) {
        thisClass.updateExistingAnnot(context, params, value, onSuccess);
      } else if (params.newPseudoName) {
        // MATT-2245 set or change user's annot pseudo name
        thisClass.setMyPseudoName(context, params, onSuccess);
      } else {
        thisClass.createNewAnnot(context, params, value, onSuccess);
      }
    }

    isCanAnnotate(context, episodeId, onSuccess) {
      base.ajax.get({
        url: '/annotation/canAnnotate',
        params: {
          mediaPackageId: episodeId,
          type: "paella/" + context
        }
      }, function (data, contentType, returnCode) {
        var canAnnotate = data;
        onSuccess(data, true);
      }, function (data, contentType, returnCode) {
        onSuccess(data, false);
      });
    }

    getAnnotations(context, episodeId, ifModifiedByDate, onSuccess) {
      var commentResultsLimit = 30000; //set to large limit, default is 10

      base.ajax.get({
        url: '/annotation/annotations.json',
        params: {
          limit: commentResultsLimit,
          episode: episodeId,
          ifModifiedSince: ifModifiedByDate,
          type: "paella/" + context
        }
      }, function (data, contentType, returnCode) {
        if (returnCode === 304) {
          if (onSuccess) onSuccess('No change', true);
          return true;
        }

        var annotations = data.annotations.annotation;
        var total = data.annotations.total;

        if (!(annotations instanceof Array)) {
          annotations = [annotations];
        }

        if (total > 0) {
          try {
            value = JSON.parse(annotations);
          } catch (err) {
            base.log.debug("TC Error " + err + " unable to json parse " + annotations);
          } // Transform stringfied value into json object


          annotations = annotations.map(function (obj) {
            var rObj = obj;

            if (obj.value && typeof obj.value !== 'object') {
              try {
                rObj.value = JSON.parse(obj.value);
              } catch (err) {
                base.log.debug("TC Error " + err + " unable to json parse " + obj.value);
              }
            }

            return rObj;
          });
          if (onSuccess) onSuccess(annotations, true);
        } else {
          if (onSuccess) onSuccess(undefined, false);
        }
      }, function (data, contentType, returnCode) {
        onSuccess(undefined, false);
      });
    }

    createNewAnnot(context, params, value, onSuccess) {
      var thisClass = this;
      var episodeId = params.id;
      var inpoint = params.inpoint;
      var isprivate = params.isprivate;
      if (typeof value == 'object') value = JSON.stringify(value);
      base.ajax.put({
        url: '/annotation/',
        params: {
          episode: episodeId,
          type: 'paella/' + context,
          value: value,
          'in': inpoint,
          'out': inpoint + 10,
          // default 10 sec duration
          isPrivate: isprivate //boolean

        }
      }, function (data, contentType, returnCode) {
        onSuccess({}, true);
      }, function (data, contentType, returnCode) {
        onSuccess({}, false);
      });
    } // Update adds a reply to an existing comment


    updateExistingAnnot(context, params, value, onSuccess) {
      var thisClass = this;
      var annotationId = params.annotationId;
      if (typeof value == 'object') value = JSON.stringify(value);
      base.ajax.put({
        url: '/annotation/' + annotationId,
        params: {
          value: value
        }
      }, function (data, contentType, returnCode) {
        onSuccess({}, true);
      }, function (data, contentType, returnCode) {
        onSuccess({}, false);
      });
    }

    remove(context, params, onSuccess) {
      var episodeId = params.id;
      base.ajax.get({
        url: '/annotation/annotations.json',
        params: {
          episode: episodeId,
          type: "paella/" + context
        }
      }, function (data, contentType, returnCode) {
        var annotations = data.annotations.annotation;

        if (annotations) {
          if (!(annotations instanceof Array)) {
            annotations = [annotations];
          }

          var asyncLoader = new base.AsyncLoader();

          for (var i = 0; i < annotations.length; ++i) {
            var annotationId = data.annotations.annotation.annotationId;
            asyncLoader.addCallback(new paella.JSONCallback({
              url: '/annotation/' + annotationId
            }, "DELETE"));
          }

          asyncLoader.load(function () {
            if (onSuccess) {
              onSuccess({}, true);
            }
          }, function () {
            onSuccess({}, false);
          });
        } else {
          if (onSuccess) {
            onSuccess({}, true);
          }
        }
      }, function (data, contentType, returnCode) {
        if (onSuccess) {
          onSuccess({}, false);
        }
      });
    }

  };
});
// #DCE
// Adapted for Paella 6.1.2
paella.addPlugin(function () {
  return class TimedCommentsHeatmapPlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this.INTERVAL_LENGTH = 5;
      this.inPosition = 0;
      this.outPosition = 0;
      this.canvas = null;
      this.commentHeatmapTimer = null;
      this.footPrintData = {};
      this.ifModifiedSinceDate = "1999-12-31T23:59:59Z"; //yyyy-MM-dd'T'HH:mm:ss'Z';

      this.ifModifiedSinceClientOffset = null;
      this.isEnabled = false;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "commentHeatmap comments";
    }

    getIndex() {
      return 450;
    }

    getIconClass() {
      return 'icon-comments';
    }

    getMinWindowSize() {
      return 550;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Show comments");
    }

    getName() {
      return "edu.harvard.dce.paella.timedCommentsHeatmapPlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.timeLineButton;
    } // comment heatmap needs to align with DCE CS50 style playback bar


    resize() {
      if (this.isEnabled && $("#playerContainer_controls_playback_playbackBar").length > 0) {
        var offset = $("#playerContainer_controls_playback_playbackBar").offset();
        var width = $("#playerContainer_controls_playback_playbackBar").width();
        $(".commentHeatmapContainer").css("margin-left", offset.left + "px");
        $(".commentHeatmapContainer").css("width", width + "px");
      }
    }

    setup() {
      var thisClass = this; // Bind to window resize, 'paella.events.resize' does not capture window resize events

      $(window).resize(function (event) {
        thisClass.resize();
      }); // Get the client side offset to the server side date

      if (paella.opencast.me && paella.opencast.me.timestamp) {
        thisClass.ifModifiedSinceClientOffset = new Date() - paella.opencast.me.timestamp;
      } else {
        thisClass.ifModifiedSinceServerDate = 0;
      }

      switch (this.config.skin) {
        case 'custom':
          this.fillStyle = this.config.fillStyle;
          this.strokeStyle = this.config.strokeStyle;
          break;

        case 'dark':
          this.fillStyle = '#727272';
          this.strokeStyle = '#424242';
          break;

        case 'light':
          this.fillStyle = '#d8d8d8';
          this.strokeStyle = '#ffffff';
          break;

        default:
          this.fillStyle = '#d8d8d8';
          this.strokeStyle = '#ffffff';
          break;
      }
    }

    checkEnabled(onSuccess) {
      var thisClass = this;
      paella.data.read('timedComments', {
        id: paella.initDelegate.getId(),
        question: 'canAnnotate'
      }, function (data) {
        base.log.debug("TC canAnnotate " + data);

        if (data === "true") {
          // prevent annots on live stream for now, until test live video inpoints
          thisClass.isEnabled = !paella.player.isLiveStream();
          onSuccess(!paella.player.isLiveStream());
        } else {
          onSuccess(false);
        }
      });
    }

    buildContent(domElement) {
      var container = document.createElement('div');
      container.className = 'commentHeatmapContainer';
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'commentHeatmapCanvas';
      this.canvas.className = 'commentHeatmapCanvas';
      container.appendChild(this.canvas);
      domElement.appendChild(container);
    }

    willShowContent() {
      var thisClass = this;
      thisClass.loadcommentHeatmap();
      base.log.debug("TC showing comments heatmap" + new Date()); // new event type created by timedCommentsOverlayPlugin

      if (paella.events.showTimedComments) {
        paella.events.trigger(paella.events.showTimedComments, {
          sender: this
        });
      }

      thisClass.commentHeatmapTimer = new base.Timer(function (timer) {
        thisClass.loadcommentHeatmap(true);
      }, 5000);
      thisClass.commentHeatmapTimer.repeat = true;
    }

    refreshPrints(annotData) {
      var thisClass = this;

      if (annotData) {
        paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
          thisClass.loadfootPrintData(annotData, status, videoData);

          if (paella.events.refreshTimedComments) {
            paella.events.trigger(paella.events.refreshTimedComments, {
              data: annotData
            });
          }
        });
      }
    }

    didHideContent() {
      if (this.commentHeatmapTimer != null) {
        this.commentHeatmapTimer.cancel();
        this.commentHeatmapTimer = null;
      }

      if (paella.events.hideTimedComments) {
        paella.events.trigger(paella.events.hideTimedComments, {
          sender: this
        });
      }
    } //Footprint reload sends annotations updated event (caught by any plugin interested in updated comments)


    loadcommentHeatmap(refreshOnly) {
      var thisClass = this;
      var lastRequestDateStr; // use server time

      var currentServerTime = new Date() - thisClass.ifModifiedSinceClientOffset;
      lastRequestDateStr = thisClass.makeISODateString(new Date(currentServerTime));
      paella.data.read('timedComments', {
        id: paella.initDelegate.getId(),
        ifModifiedSince: thisClass.ifModifiedSinceDate
      }, function (data, status) {
        if (data === 'No change') {
          base.log.debug("TC No change in data since  " + thisClass.ifModifiedSinceDate);
        } else if (refreshOnly) {
          base.log.debug("TC Refreshing prints, found " + (data ? data.length : 0));
          thisClass.refreshPrints(data);
        } else {
          paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
            thisClass.loadfootPrintData(data, status, videoData);
          });
        }

        thisClass.ifModifiedSinceDate = lastRequestDateStr;
      });
    }

    loadfootPrintData(annotations, status, videoData) {
      var thisClass = this;
      var footPrintData = {};

      if (annotations && typeof annotations !== 'object') {
        annotations = JSON.parse(annotations);
      }

      var data = thisClass.makeHeatmapData(annotations);
      var duration = Math.floor(videoData.duration);
      var trimStart = Math.floor(paella.player.videoContainer.trimStart());
      var lastPosition = -1;
      var firstTime = true; // iterate over the data and back fill the gaps for the video duration

      for (var i = 0; i < data.length; i++) {
        var currentPos = data[i].position - trimStart; // A. back fill from start of lecture to the first comment

        if (firstTime && currentPos > 0) {
          firstTime = false;

          for (var x = 0; x < currentPos; x++) {
            footPrintData[x] = 0;
          }
        } // B. back fill from last position to current position


        if (currentPos <= duration) {
          var currentViews = data[i].views; // fill in gaps between data points

          if (currentPos - 1 != lastPosition) {
            for (var j = lastPosition + 1; j < currentPos; j++) {
              footPrintData[j] = 0;
            }
          } //  C. save the current view count


          footPrintData[currentPos] = currentViews;
        } // D. if on the last comment data point, forward fill to end of the duration


        if (i + 1 == data.length && currentPos + 1 < duration) {
          for (var z = currentPos + 1; z <= duration; z++) {
            footPrintData[z] = 0;
          }
        } // save current position to back fill in the next loop


        lastPosition = currentPos;
      }

      thisClass.drawcommentHeatmap(footPrintData); // align with playback bar

      thisClass.resize(); // Make the heatmap hot (seek onclick)

      $("#commentHeatmapCanvas").click(function (e) {
        var self = this;
        paella.player.videoContainer.masterVideo().getVideoData().then(function (videoData) {
          var offset = $(self).offset();
          var relX = e.pageX - offset.left;
          var relWidth = parseInt($(self).css('width')) | 1;
          var dur = videoData.duration | 0;
          var seekTo = parseInt(relX / relWidth * dur);
          paella.player.videoContainer.seekToTime(seekTo);
        });
      });
    }

    drawcommentHeatmap(footPrintData) {
      if (this.canvas) {
        var duration = Object.keys(footPrintData).length;
        var ctx = this.canvas.getContext("2d");
        var h = 2;
        var i;

        for (i = 0; i < duration; ++i) {
          if (footPrintData[i] > h) {
            h = footPrintData[i];
          }
        }

        this.canvas.setAttribute("width", duration);
        this.canvas.setAttribute("height", h);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = this.fillStyle; //'#faa166'; //'#9ED4EE';

        ctx.strokeStyle = this.strokeStyle; //'#fa8533'; //"#0000FF";

        ctx.lineWidth = 2;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        for (i = 0; i < duration; ++i) {
          ctx.beginPath();
          ctx.moveTo(i, h);
          ctx.lineTo(i, h - footPrintData[i]);
          ctx.lineTo(i + 1, h - footPrintData[i + 1]);
          ctx.lineTo(i + 1, h);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(i, h - footPrintData[i]);
          ctx.lineTo(i + 1, h - footPrintData[i + 1]);
          ctx.closePath();
          ctx.stroke();
        }
      }
    } // without the milliseconds


    makeISODateString(d) {
      function pad(n) {
        return n < 10 ? '0' + n : n;
      }

      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z';
    }

    makeHeatmapData(timedComments) {
      var This = this;
      var temp = {};
      var list = [];
      if (!timedComments) return list;
      timedComments.forEach(function (comment) {
        var i = comment.inpoint;

        if (!temp[i]) {
          temp[i] = 1;
        } else {
          var count = temp[i];
          temp[i] = count + 1;
        }
      });
      Object.keys(temp).forEach(function (key) {
        var item = {};
        item['position'] = key;
        item['views'] = temp[key];
        list.push(item);
      });
      return list;
    }

  };
});
/** WARNING this plugin is tied to the syntax provided by Opencast 1x Annoation Service.
/* The annotation format assumes an embedded annoation value surrounded by
/* Opencast annoation service metadata */

/* Example of expect syntax:
/*   {
/*      "annotationId": 235367673,
/*      "mediapackageId": "137c0efa-798b-494d-a2a8-e1d76d6421d7",
/*      "sessionId": "q3rwk2r3z86m12dt7dv643mmc",
/*      "inpoint": 4,
/*      "outpoint": 410,
/*      "length": 406,
/*      "type": "paella/timedComments",
/*      "isPrivate": false,
/*      "value": {"timedComment": {
/*               "value": "This is my comment text",
/*               "parent": "235367659",
/*               "userName": "student4",
/*               "mode": "reply"
/*      }}
/*      "created": "2016-09-02T13:44:43-04:00"
/* }
/* NOTE: the value object, above, is destringified by the custom data delegate.
/*
/* versus a normalized syntax
/* {
/*    "annotationId": 235367673,
/*    "created": "2016-09-02T13:44:43.364Z",
/*    "value": "This is my comment text",
/*    "parent": "235367659",
/*    "userName": "student4",
/*    "mode": "reply",
/*    "inpoint": 4,
/*    "outpoint": 410,
/*    "isPrivate": false
/* }
/*
/* */
// Adapted for Paella 6.1.2
paella.addPlugin(function () {
  return class TimedCommentsOverlay extends paella.EventDrivenPlugin {
    constructor() {
      super();
      this.containerId = 'paella_plugin_TimedCommentsOverlay';
      this.container = null;
      this.innerContainer = null;
      this.lastEvent = null;
      this.publishCommentTextArea = null;
      this.publishCommentButtons = null;
      this.publishCommentisPrivate = null;
      this.canPublishAComment = false;
      this._shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      this._curActiveTop = null;
      this._curScrollTop = 0;
      this._adminRoles = ["ROLE_ADMIN"]; // default, configurable via config plugin attribute "adminRoles"

      this._isAdmin = false;
      this._isActive = false;
      this._isAutoScroll = false;
      this._annotations = null, //will store the annotations
      this._rootElement = null;
      this._prevProfile = null, //we store the profile we had before opening the annotation
      this._optimalProfile = 'tiny_presentation';
      this._userData = undefined;
      this._aliasUtil = null; // This instaitiates a paella.plugins.TimedCommentsUsernameAlias
      // TODO: move these to template files

      this.tc_comment = '<div class="tc_comment"><div class="tc_comment_text"></div><div class="tc_comment_data"><div class="user_icon"></div><div class="user_name"></div>, <div class="user_comment_date"></div></div></div>';
      this.tc_reply = '<div class="tc_comment tc_reply"><div class="tc_comment_text tc_reply_text"></div><div class="tc_comment_data"><div class="user_icon"></div><div class="user_name"></div>, <div class="user_comment_date"></div></div></div>';
      this.tc_reply_box = '<div class="tc_comment tc_reply_box"><form class="tc_new_reply_form" role="form"><input type="text" class="tc_reply_textarea" aria-label="reply text area" placeholder="Type a reply [enter to submit] 256 char" maxlength="256"></input></form></div>';
      this.tc_new_comment = '<div class="tc_new_comment"><div id="tc_current_timestamp" class="tc_timestamp"></div><form class="tc_new_comment_form" role="form"><div class="tc_comment tc_comment_box"><input type="text" class="tc_comment_textarea" aria-label="Create a new comment" placeholder="Type new comment at the current time [enter to submit] 256 char" maxlength="256"></input><input type="hidden" id="tc_comment_private_checkbox" value="false" /></div></form></div>';
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    getIndex() {
      return 449;
    }

    getName() {
      return "edu.harvard.dce.paella.timedCommentsOverlayPlugin";
    }

    getEvents() {
      // Inserting a new event types
      paella.events.refreshTimedComments = "dce:refreshTimedComments";
      paella.events.showTimedComments = "dce:showTimedComments";
      paella.events.hideTimedComments = "dce:hideTimedComments";
      return [paella.events.showTimedComments, paella.events.hideTimedComments, paella.events.refreshTimedComments, paella.events.play, paella.events.timeupdate, paella.events.pause, paella.events.endVideo];
    }

    init() {
      this._adminRoles = config.adminRoles;
    }

    setup() {
      // custom helper util for username alias create and change
      this._aliasUtil = new paella.TimedCommentsUsernameAlias();

      if (this.config.adminRoles) {
        this._adminRoles = this.config.adminRoles;
      }
    }

    onEvent(eventType, params) {
      var thisClass = this;

      switch (eventType) {
        case paella.events.play:
          // play means focus is off the comment box so it's ok to scroll
          thisClass._isAutoScroll = true;
          thisClass.updateCurrentTimeStamp();

          if (thisClass._isActive) {
            paella.player.videoContainer.currentTime().then(function (time) {
              thisClass.scrollTimedComments(thisClass._isAutoScroll, time);
            });
          }

          break;

        case paella.events.timeupdate:
          thisClass.updateCurrentTimeStamp();

          if (thisClass._isActive) {
            paella.player.videoContainer.currentTime().then(function (time) {
              thisClass.scrollTimedComments(thisClass._isAutoScroll, time);
            });
          }

          break;

        case paella.events.pause:
        case paella.events.endVideo:
          thisClass._isAutoScroll = false;
          break;

        case paella.events.showTimedComments:
          thisClass.loadTimedComments();

          if (paella.player.playing()) {
            thisClass._isAutoScroll = true;
          }

          break;

        case paella.events.hideTimedComments:
          thisClass._isActive = false;

          if (thisClass._rootElement) {
            thisClass.unloadTimedComments();
          }

          break;

        case paella.events.refreshTimedComments:
          if (thisClass._isActive) {
            thisClass.reloadComments(params.data);
          }

      }

      thisClass.lastEvent = eventType;
    } // This gets the user access roles from Opencast user service
    // Required to determin if user is logged in as admin.


    getUserData() {
      var self = this;
      var defer = new $.Deferred(); // always refresh userdata

      paella.opencast.getUserInfo().then(function (me) {
        self._userData = me; // If not loggged in as admin, do the pseudo name check

        if (!self.hasAdminRole(me.roles)) {
          self._aliasUtil.getPseudoName().then(function (pseudoName) {
            // replacing OC username with annot pseudo name and
            // also setting flag that its an annot pseudoname
            self._userData.username = pseudoName;
            self._userData.pseudoName = pseudoName;
            defer.resolve(self._userData);
          });
        } else {
          self._isAdmin = true;
          defer.resolve(self._userData);
        }
      }, function () {
        defer.reject();
      });
      return defer;
    }

    reloadComments(annotData) {
      var thisClass = this;
      thisClass._curScrollTop = $("#innerAnnotation") ? $("#innerAnnotation").scrollTop() : 0; // isActive is set back to true in data load promise

      thisClass._isActive = false;

      if (thisClass._rootElement) {
        $(thisClass._rootElement).empty();
        $(thisClass._rootElement).resizable('destroy');
        $(thisClass._rootElement).draggable('destroy');
      }

      thisClass.loadTimedComments(annotData);
    }

    unloadTimedComments() {
      var thisClass = this;

      if (thisClass._rootElement) {
        $(thisClass._rootElement).remove();
      }
    }

    loadTimedComments(annotData) {
      var thisClass = this;

      if (annotData) {
        thisClass.loadWithData(annotData);
      } else {
        paella.data.read('timedComments', {
          id: paella.initDelegate.getId()
        }, function (data, status) {
          thisClass.loadWithData(data);
        });
      }
    }

    loadWithData(data) {
      var thisClass = this;
      thisClass._annotations = data;
      thisClass.sortAnnotations();
      paella.player.videoContainer.currentTime().then(function (time) {
        thisClass.getUserData().then(function (userData) {
          thisClass.drawTimedComments(time, userData);
        }).then(function () {
          $("#innerAnnotation").animate({
            scrollTop: thisClass._curScrollTop
          }, 100); // create the alias input DOM element

          thisClass._aliasUtil.initAliasDialogElement(thisClass); // changing the layout profile that is most optimal to show comments


          thisClass.changeToOptimalVideoProfile(thisClass._optimalProfile);
          thisClass._isActive = true;
        });
      });
    } // Sort annotations for display in annotation UI


    sortAnnotations() {
      var thisClass = this;
      var commentList = [];
      var replyList = [];
      var replyMap = {};

      if (thisClass._annotations) {
        // DCE modification is that Each comment and reply are in a separate annotation
        // to sort, create a map of comment replies and a separate collection of comment parents
        thisClass._annotations.forEach(function (annot) {
          var timedComment = annot.value.timedComment;

          if (timedComment.mode == 'comment') {
            commentList.push(annot);
          } else {
            var mapList = replyMap[annot.value.timedComment.parent];

            if (!mapList) {
              mapList = [];
            }

            mapList.push(annot);
            replyMap[annot.value.timedComment.parent] = mapList;
          }
        }); // Sort comments by inpoint, then by annotation date


        commentList = commentList.sort(function (a, b) {
          // First, sort by inpoint (a comment and its replies will have the same inpoint)
          // multiple comments can share the same inpoint
          var ret = a.inpoint - b.inpoint;

          if (ret != 0) {
            return a.inpoint > b.inpoint ? 1 : -1;
          } // secondly by created time


          var adate = new Date(a.created).getTime();
          var bdate = new Date(b.created).getTime();
          return adate > bdate ? 1 : adate < bdate ? -1 : 0;
        }); // Sort individual reply groups by annot date

        commentList.forEach(function (comment) {
          // sort individual reply groups
          var mapList = replyMap[comment.annotationId];

          if (mapList) {
            // not all comments have replies
            mapList = mapList.sort(function (a, b) {
              var adate = new Date(a.created).getTime();
              var bdate = new Date(b.created).getTime();
              return adate > bdate ? 1 : adate < bdate ? -1 : 0;
            }); // concat each sorted reply group

            replyList = replyList.concat(mapList);
          }
        }); // merge back together into the single list

        thisClass._annotations = thisClass.mergeCommentsReplies(commentList, replyList);
      }
    } // add the sorted replies in with the parent comments


    mergeCommentsReplies(comments, replies) {
      var combined = [];
      var ci = 0;
      var ri = 0;

      while (ci < comments.length || ri < replies.length) {
        var currentCommentMpId = comments[ci].annotationId + "";
        combined.push(comments[ci++]);

        while (ri < replies.length && replies[ri].value.timedComment.parent === currentCommentMpId) {
          combined.push(replies[ri++]);
        }
      }

      return combined;
    }

    changeToOptimalVideoProfile(profile) {
      if (paella.Profiles && paella.Profiles.profileList && paella.Profiles.profileList[profile]) {
        paella.events.trigger(paella.events.setProfile, {
          profileName: profile
        });
      }
    }

    drawTimedComments(time, userData) {
      var thisClass = this;
      var defer = new $.Deferred(); //Difficult to stop player clickthrough in overlayContainer, so moving it up a level to playerContainer
      //var overlayContainer = $("#overlayContainer");

      var overlayContainer = $('#playerContainer');

      if (!overlayContainer) {
        base.log.debug("TC Unable to find overlayContainer. Cannot show comments.");
        return;
      }

      if (thisClass._rootElement) {
        $(thisClass._rootElement).empty();
      } else {
        thisClass._rootElement = document.createElement("div");
      }

      thisClass._rootElement.className = 'timedComments';
      thisClass._rootElement.id = 'TimedCommentPlugin_Comments'; // The first child is the innerAnnotation content body if there are annotations already there

      if (thisClass._annotations) {
        var innerAnnots = thisClass.buildInnerAnnotationElement(thisClass._annotations);
        $(thisClass._rootElement).append(innerAnnots);
      } // The next child is the new comment input form


      var newCommentForm = $(thisClass.tc_new_comment);
      $(thisClass._rootElement).append(newCommentForm); // send custom attributes and get handles on input elements

      var commentAreaId = thisClass._rootElement.id + "_commentText";
      var commentTextArea = $(newCommentForm).find('input.tc_comment_textarea');
      var commentisPrivate = $(newCommentForm).find('input#tc_comment_private_checkbox');
      $(commentTextArea).attr('id', commentAreaId);
      thisClass.publishCommentTextArea = commentTextArea;
      thisClass.publishCommentisPrivate = commentisPrivate; // append all to the overlay container

      overlayContainer.append(thisClass._rootElement); // update the comment time

      var currentTime = Math.floor(time);

      if ($('#tc_current_timestamp').length > 0) {
        $('#tc_current_timestamp').html(paella.utils.timeParse.secondsToTime(currentTime));
      } else {
        base.log.debug("TC Unable to find tc_current_timestamp. Cannot set current time for new comment.");
      } // movable & resizable comments box


      $('#TimedCommentPlugin_Comments').draggable({
        cancel: "#dceAnnotUserPseudoName, #innerAnnotation, .tc_new_comment"
      });
      $('#TimedCommentPlugin_Comments').resizable({
        minWidth: 200,
        minHeight: 200
      }); // Admins have a special view

      if (thisClass.hasAdminRole(userData.roles)) {
        // Disable input if user is logged in as admin
        $(".timedComments").find('input').attr('disabled', 'disabled').attr('placeholder', 'You must log out of Engage server to annotate'); // Enable edit of existing comments

        $(".tc_comment_text").attr("contenteditable", "true");
        $(".tc_comment_text").attr('data-type', 'update');
        $(".tc_comment_text").addClass("tc_admin_edit");
        $(".tc_comment_text").keydown(function (event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            thisClass.onTextAreaSubmit(this);
            return false;
          }
        });
      } // Halt comment refreshes when typing a comment or repy


      $('.tc_reply_textarea, .tc_comment_textarea, .tc_admin_edit, #tc_alias_input').focusin(function () {
        thisClass._isActive = false; // stop all typing leaks to underlying player

        paella.keyManager.enabled = false;
      }).focusout(function () {
        thisClass._isActive = true; // re-enable typing leaks to underlying player

        paella.keyManager.enabled = true;
      }); // stop keypress from leaking through to underlying div (video play/pause)

      $('.tc_reply_textarea, .tc_comment_textarea').keydown(function (event) {
        var charCode = typeof event.which == "number" ? event.which : event.keyCode;

        switch (charCode) {
          // spacebar event
          case 32:
            event.preventDefault();
            event.stopImmediatePropagation();
            $(this).val($(this).val() + " ");
            return false;
          // enter key event

          case 13:
            event.preventDefault();
            event.stopImmediatePropagation();
            thisClass.onTextAreaSubmit(this);
            return false;
        }

        event.stopImmediatePropagation();
      }); // prevent space bar event trickle pause/play & use enter for submit (short comments)

      $('.tc_reply_textarea, .tc_comment_textarea, #tc_alias_input, #dceAnnotUserPseudoName').keyup(function (event) {
        var charCode = typeof event.which == "number" ? event.which : event.keyCode;

        switch (event.keyCode) {
          // spacebar event, prevent click through
          case 32:
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
          // enter key event

          case 13:
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }
      }); // stop click from leaking through to underlying div (video play/pause)

      $('#TimedCommentPlugin_Comments').click(function (event) {
        event.stopImmediatePropagation();
      }); // Allow user to scroll when moues over timed contents area, i.e. stop autoscoll

      $('#TimedCommentPlugin_Comments').on({
        mouseenter(event) {
          thisClass._isAutoScroll = false;
        },

        mouseleave(event) {
          thisClass._isAutoScroll = true;
        }

      });

      if (!thisClass._isAdmin) {
        thisClass._aliasUtil.addWelcomePseudoNameHeader(userData.username);
      }

      return defer.resolve();
    } // builds the series of timestamp blocks (blocks of 1 comment & its replies)


    buildInnerAnnotationElement(comments) {
      const thisClass = this;
      $(thisClass.innerContainer).empty();
      let innerAnnotation = document.createElement('div');
      innerAnnotation.id = "innerAnnotation";
      thisClass.innerContainer = innerAnnotation;
      var timeBlockcount = 0;
      let newEl;
      var commentBlock;
      var previousParentId; // hold current time stamp element

      var timeStampBlockEl; // Just so that we don't repeat code...

      function addReplyBox() {
        // Add the reply box at the end of the block containing comment plus its replies
        newEl = $(thisClass.tc_reply_box); // Set the button and input ids

        var textAreaId = timeStampBlockEl.id + "_replyText";
        var replyTextArea = $(newEl).find('input.tc_reply_textarea');
        $(replyTextArea).attr('id', textAreaId);
        $(replyTextArea).attr("data-type", "reply");
        $(commentBlock).append(newEl);
        timeStampBlockEl.appendChild(commentBlock);
        innerAnnotation.appendChild(timeStampBlockEl);
      }

      comments.forEach(function (l) {
        var parsedComments = l.value;

        if (parsedComments && typeof parsedComments !== 'object') {
          parsedComments = JSON.parse(parsedComments);
        }

        if (parsedComments["timedComment"]) {
          var comment = parsedComments["timedComment"];

          if (comment.mode == "comment") {
            // This is the comment
            if (previousParentId) {
              // Add previous reply box
              addReplyBox();
            }

            previousParentId = l.annotationId;
            ++timeBlockcount;
            base.log.debug("creating comment block for " + l.annotationId);
            timeStampBlockEl = document.createElement('div');
            timeStampBlockEl.className = "tc_timestamp_block";
            timeStampBlockEl.setAttribute('data-sec-begin', l.inpoint);
            timeStampBlockEl.setAttribute('data-sec-end', l.outpoint);
            timeStampBlockEl.setAttribute('data-sec-id', l.annotationId);
            timeStampBlockEl.id = 'TimedCommentPlugin_Comments_' + timeBlockcount; // The innerAnnotation's first child is the timestamp

            var timeStampEl = document.createElement('div');
            timeStampEl.className = "tc_timestamp";
            timeStampEl.setAttribute('data-sec-begin-button', l.inpoint);
            var timeStampText = paella.utils.timeParse.secondsToTime(l.inpoint);
            timeStampEl.innerHTML = timeStampText;
            timeStampBlockEl.appendChild(timeStampEl); // jump to time on click on just the timestamp div

            $(timeStampEl).click(function (e) {
              var secBegin = $(this).attr("data-sec-begin-button");
              paella.player.videoContainer.seekToTime(parseInt(secBegin));
            });
            commentBlock = document.createElement("div");
            commentBlock.className = "tc_comment_block";
            commentBlock.setAttribute('data-parent-id', l.annotationId);
            commentBlock.setAttribute('data-inpoint', l.inpoint);
            commentBlock.setAttribute('data-private', l.isPrivate); // create the comment

            newEl = $(thisClass.tc_comment);
          } else {
            // This is a reply
            newEl = $(thisClass.tc_reply);
          }

          newEl.attr('data-annot-id', l.annotationId);
          var friendlyDateStrig = thisClass.getFriendlyDate(l.created);
          $(newEl).find(".tc_comment_text").html(comment.value);
          $(newEl).find(".user_name").html(comment.userName);
          $(newEl).find(".user_comment_date").html(friendlyDateStrig);
          $(commentBlock).append(newEl);
        }
      });

      if (previousParentId) {
        // Add last reply box
        addReplyBox();
      }

      return innerAnnotation;
    }

    onTextAreaSubmit(textareaDiv) {
      var thisClass = this;
      $(textareaDiv).addClass("submit-text-div");
      var txtValue = $(textareaDiv).val();
      var txtType = $(textareaDiv).attr('data-type');

      if (txtType === "update") {
        thisClass.updateAnnot(textareaDiv);
      } else if (txtValue.replace(/\s/g, '') !== "") {
        // only allow unempty text
        thisClass.getUserData().then(function (userData) {
          if (!userData.pseudoName) {
            // The update action will call the submitSwitch
            thisClass._isActive = false;
            paella.keyManager.enabled = false;

            thisClass._aliasUtil.updatePseudoName();
          } else {
            thisClass.submitSwitch();
          }
        });
      }
    }

    submitSwitch() {
      var textareaDiv = $(".submit-text-div");
      var thisClass = this;
      var txtType = $(textareaDiv).attr('data-type');

      if (txtType === "reply") {
        thisClass.addReply(textareaDiv);
      } else {
        thisClass.addComment();
      }

      $(textareaDiv).removeClass("submit-text-div");
    }

    updateAnnot(textareaDiv) {
      var thisClass = this;
      var confirmText = 'Ok to make update: "' + $(textareaDiv).text() + '" ?';

      if (confirm(confirmText)) {
        thisClass.editComment(textareaDiv);
      } else {
        // reload to change back
        thisClass.reloadComments();
      }
    }

    updateCurrentTimeStamp() {
      // updated to use new promise for current time
      paella.player.videoContainer.currentTime().then(function (time) {
        var currentTime = Math.floor(time);
        var currentTimeDiv = $('#tc_current_timestamp');

        if (currentTimeDiv) {
          currentTimeDiv.html(paella.utils.timeParse.secondsToTime(currentTime));
        }
      });
    }

    scrollTimedComments(doScroll, time) {
      var thisClass = this;
      var currentTime = Math.floor(time); // no need to update anything else if no comments or scrolling is off

      if ($(".tc_timestamp_block").length < 1 || $("#innerAnnotation").hasClass('scrolling')) return;
      var newTopActive = null,
          lastBeforeTime = null,
          lastAfterTime = null;
      $(".tc_timestamp_block").filter(function () {
        if ($(this).attr("data-sec-begin") <= currentTime && $(this).attr("data-sec-end") >= currentTime) {
          if (newTopActive === null) {
            newTopActive = this;
          }

          $(this).addClass("active");
        } else {
          $(this).removeClass("active");
        }

        if ($(this).attr("data-sec-end") < currentTime) {
          lastBeforeTime = this;
        }

        if (lastAfterTime === null && $(this).attr("data-sec-begin") > currentTime) {
          // get the fist one (sorted ASC)
          lastAfterTime = this;
        }
      });

      if (newTopActive === null && (lastBeforeTime || lastAfterTime)) {
        if (lastBeforeTime) {
          newTopActive = lastBeforeTime;
        } else {
          newTopActive = lastAfterTime;
        }
      }

      if (newTopActive != thisClass._curActiveTop && doScroll) {
        thisClass._curActiveTop = newTopActive;
        base.log.debug("TC, going to scroll element " + $(newTopActive).attr('id') + " currently at " + $(newTopActive).position().top + " from top, scroll positon is currently at " + $("#innerAnnotation").scrollTop());
        var scrollTo = $("#innerAnnotation").scrollTop() + $(newTopActive).position().top - 15;
        if (scrollTo < 0) scrollTo = 0;
        $("#innerAnnotation").animate({
          scrollTop: scrollTo
        }, 100).removeClass('scrolling');
      } else {
        $("#innerAnnotation").removeClass('scrolling');
      }

      this._curScrollTop = $("#innerAnnotation").scrollTop();
    } // new comment creates a new annotation entry


    editComment(textArea) {
      var thisClass = this;
      thisClass._curScrollTop = $("#innerAnnotation").scrollTop();
      var txtValue = paella.AntiXSS.htmlEscape($(textArea).text());
      var id = $(textArea).parent().attr("data-annot-id");
      var commentValue = null;
      $(thisClass._annotations).each(function (index, annot) {
        if (annot.annotationId.toString() === id.toString()) {
          commentValue = annot.value;

          if (commentValue && typeof commentValue !== 'object') {
            commentValue = JSON.parse(commentValue);
          }
        }
      });
      commentValue.timedComment.value = txtValue;
      paella.data.write('timedComments', {
        id: paella.initDelegate.getId(),
        update: true,
        annotationId: id
      }, commentValue, function (response, status) {
        if (status) thisClass.reloadComments();
      });
    } // new comment creates a new annotation entry


    addComment() {
      var thisClass = this;
      thisClass._curScrollTop = $("#innerAnnotation").scrollTop();
      var txtValue = paella.AntiXSS.htmlEscape(thisClass.publishCommentTextArea.val());
      var isPrivate = thisClass.publishCommentisPrivate.val() === true ? true : false;
      thisClass.getUserData().then(function (user) {
        var newComment = {};
        newComment.userName = user.username;
        newComment.mode = "comment";
        newComment.value = txtValue; // NOTE newComment.created is set by server to server time

        var data = {
          timedComment: newComment
        };
        paella.player.videoContainer.currentTime().then(function (time) {
          thisClass.writeComment(data, time, isPrivate);
        });
      }, // else log issue
      base.log.debug("TC, unable to retrieve user information, cannot write comment"));
    }

    writeComment(data, inPoint, isPrivate) {
      var thisClass = this;
      paella.player.videoContainer.currentTime().then(function (time) {
        paella.data.write('timedComments', {
          id: paella.initDelegate.getId(),
          inpoint: Math.floor(inPoint),
          isprivate: isPrivate
        }, data, function (response, status) {
          if (status) thisClass.reloadComments();
        });
      });
    } //#DCE Rute 7/21: adding a reply creates a new annotation entry. The inpoint is the same as the
    // parent annotation to help sorting.


    addReply(textArea) {
      var thisClass = this;
      thisClass._curScrollTop = $("#innerAnnotation").scrollTop();
      var txtValue = paella.AntiXSS.htmlEscape($(textArea).val()); // retrieve parent annotation data from the encompasing comment block

      var commentBlock = $(textArea).closest(".tc_comment_block");
      var parentAnnotId = commentBlock.attr("data-parent-id");
      var isPrivate = commentBlock.attr("data-private");
      var inPoint = commentBlock.attr("data-inpoint"); // create the new reply

      thisClass.getUserData().then(function (user) {
        var newComment = {};
        newComment.userName = user.username;
        newComment.mode = "reply";
        newComment.value = txtValue;
        newComment.parent = parentAnnotId.toString(); // NOTE newComment.created is set by server to server time

        var data = {
          timedComment: newComment
        };
        thisClass.writeComment(data, inPoint, isPrivate);
      }, // else log issue
      base.log.debug("TC, unable to retrieve user information, cannot write comment"));
    }

    hideContent() {
      var thisClass = this;
      $(thisClass.container).hide();
    } //"created": "2017-01-26T14:32:52-05:00"


    getFriendlyDate(dateString) {
      var result;
      var date = new Date(dateString);
      var options = {
        month: "short",
        day: "2-digit",
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }; // check Safari (v9 & v10) and mobile browser date format support

      if (typeof Intl == 'object' && typeof Intl.DateTimeFormat == 'function') {
        result = new Intl.DateTimeFormat("en-US", options).format(date) + " US ET";
      } else {
        // browsers that don't support Intl.DateTimeFormat
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var hour = ('00' + date.getHours()).slice(-2);
        var minute = ('00' + date.getMinutes()).slice(-2);
        result = this._shortMonths[monthIndex] + " " + day + ", " + hour + ":" + minute + " US ET";
      }

      return result;
    }

    getDomFromHTMLString(template) {
      var thisClass = this;
      parser = new DOMParser();
      return parser.parseFromString(template, "text/html"); // returns a HTMLDocument, which also is a Document.
    }

    hasAdminRole(userRoles) {
      if (userRoles == null || !Array.isArray(this._adminRoles)) return false; // Protect if Opencast sends a single value instead of an array (as it does in mp json)

      if (!Array.isArray(userRoles)) {
        userRoles = [userRoles];
      }

      return this._adminRoles.some(function (role) {
        // Break and return true if one admin role is part of userRoles array
        return $.inArray(role, userRoles) !== -1;
      });
    }

  };
});
/* MATT-2245 username alias UI
 * for the timedcomments.
 * This is a service accessed from timedCommentsOverlay
 * Adapted for Paella 6.1.2
 */
class TimedCommentsUsernameAlias {
  constructor() {
    this._currentPseudoNameDivId = "dceAnnotUserPseudoName";
    this._currentPseudoName = null;
    this._createPseudoNameMaxLen = 16;
    this._createPseudoNameDiv = null;
    this._host = null;
    this.tc_alias_dialog = '<div id="dialog-form-alias"><form id="form-alias" accept-charset="UTF-8"> \
    <label class="alias" for="tc_alias_input">Username Alias:</label> \
    <input placeholder="student alias" maxlength="16" type="text" name="tc_alias_input" id="tc_alias_input" class="alias text" /> \
    <div class="alias" id="alias-input-info"></div></div>';
  }

  getPseudoName() {
    var thisClass = this;
    var defer = new $.Deferred();
    paella.data.read('timedComments', {
      id: paella.initDelegate.getId(),
      question: 'getMyPseudoName'
    }, function (data) {
      base.log.debug("TC user's pseuduo name " + data);
      thisClass._currentPseudoName = data;
      defer.resolve(data);
    }, function () {
      base.log.debug("TC ERROR getting user's pseuduo name -1.");
      defer.reject();
    });
    return defer;
  }

  setPseudoName(newPseudoName, pseudoNameInputElem) {
    var thisClass = this;
    var defer = new $.Deferred();
    base.log.debug("TC about to set pseuduo name " + newPseudoName);
    paella.data.write('timedComments', {
      id: paella.initDelegate.getId(),
      newPseudoName: newPseudoName
    }, "fillervalue", function (data, returnCode, isSuccess) {
      if (returnCode === 400 || returnCode === 409) {
        $(pseudoNameInputElem).val("");
        $(pseudoNameInputElem).attr('placeholder', 'Alias "' + newPseudoName + '" is already taken, try again or leave blank');
        defer.reject(returnCode);
      } else if (isSuccess) {
        base.log.debug("TC user's pseuduo name " + data);
        thisClass._currentPseudoName = data;
        defer.resolve(data);
      } else {
        $(pseudoNameInputElem).attr('placeholder', 'Unable to set "' + newPseudoName + '" at the moment. Try again later.');
        defer.reject(returnCode);
      }
    });
    return defer;
  }

  initAliasDialogElement(hostClass) {
    var thisClass = this;
    thisClass._host = hostClass;
    var isNew = thisClass._currentPseudoName == null;

    if (thisClass._createPseudoNameDiv) {
      $(thisClass._createPseudoNameDiv).remove();
    }

    var action;

    if (isNew) {
      action = function () {
        hostClass._isActive = false;
        var alias = $('#tc_alias_input').val();

        if (alias && alias !== null) {
          thisClass.setPseudoName(alias, $('#tc_alias_input')).then(function () {
            base.log.debug("TC Successfully set a new pseuduo name." + alias);
            hostClass.submitSwitch();
            hostClass._isActive = true;
            paella.keyManager.enabled = true;
            return false;
          }).fail(function (reason) {
            base.log.debug('TC The set pseudoname promise is rejected: ' + reason);
            thisClass.updatePseudoName(alias);
            return false;
          });
        } else {
          base.log.debug("TC Letting system set a default pseuduo name." + alias);
          hostClass._isActive = true;
          paella.keyManager.enabled = true;
          hostClass.submitSwitch();
          return false;
        }
      }; // Else its an update

    } else {
      action = function () {
        var value = $('#tc_alias_input').val();

        if (value && value !== "" && value !== thisClass._currentPseudoName) {
          thisClass.setPseudoName(value).then(function () {
            hostClass.reloadComments();
            hostClass._isActive = true;
            paella.keyManager.enabled = true;
            $("#dialog-form-alias").dialog("close");
          }).fail(function (reason) {
            // For user to make another pseudoname choice or cancel
            base.log.debug('TC The set pseudoname ' + value + ' is rejected: ' + reason);
            hostClass._isActive = false;
            thisClass.updatePseudoName(value);
            return false;
          });
        } else {
          base.log.debug("TC not changing custom alias"); // Restart data refresh

          hostClass._isActive = true;
          paella.keyManager.enabled = true;
          $("#dialog-form-alias").dialog("close");
        }
      };
    } // Build the alias input element


    thisClass.buildAliasDriver(isNew, action);
  } // MATT-2245 dialog requires jQuery-UI


  buildAliasDriver(isNew, action) {
    var thisClass = this;

    var cancelFunction = function () {
      $(this).dialog("close");
    };

    var buttonInfo = [];

    if (isNew) {
      buttonInfo.push({
        text: "Continue",
        click: action
      });
    } else {
      buttonInfo.push({
        text: "Cancel",
        click: cancelFunction
      });
      buttonInfo.push({
        text: "Submit",
        click: action
      });
    } // Create DOM dialog element to the root


    var newAliasInputDialog = $(thisClass.tc_alias_dialog);
    thisClass._createPseudoNameDiv = newAliasInputDialog;
    $('#playerContainer').append(newAliasInputDialog);
    $("#form-alias").submit(function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      action();
      return false;
    });
    $("#dialog-form-alias").dialog({
      modal: true,
      zIndex: 998,
      autoOpen: false,
      closeOnEscape: true,
      dialogClass: "no-close alias-prompt",
      closeText: "hideThisView",
      resizable: false,
      height: 160,
      width: 300,
      buttons: buttonInfo,

      close() {
        $("#dialog-form-alias").css('zIndex', '');
      }

    });
  } // pass text for the dialog box and id of target to display near


  showAliasDialog(aliasLabel, promptNote, targetElem) {
    $("#dialog-form-alias").find('label').text(aliasLabel);
    $("#alias-input-info").text(promptNote);
    $("#dialog-form-alias").dialog("open");
    $("#dialog-form-alias").dialog("option", "modal", true);
    $(".ui-dialog.alias-prompt").css("zIndex", 998);
    $('#tc_alias_input').focus();
  }

  updatePseudoName(retryPseduoname) {
    var thisClass = this;
    var targetElement;
    var labelText = "";
    var placeholderText = "";
    var currentAlias = thisClass._currentPseudoName;
    var aliasMaxLength = thisClass._createPseudoNameMaxLen;
    var changePromptNote = aliasMaxLength + " char max (UTF-8)";

    if (currentAlias) {
      targetElement = $('#' + thisClass._currentPseudoNameDivId);
      placeholderText = thisClass._currentPseudoName;
      labelText = "Do you want to change your alias?";

      if (retryPseduoname) {
        labelText = 'The name "' + retryPseduoname + '" is already taken. Do you want to try another?';
      } else {
        // reset prompt
        $('#tc_alias_input').val(thisClass._currentPseudoName);
      }
    } else {
      targetElement = $(".submit-text-div")[0];
      placeholderText = "Student alias";
      labelText = "Add a username alias:";

      if (retryPseduoname) {
        labelText = 'The name "' + retryPseduoname + '" is already taken. Try another name or leave blank to accept the default.';
      }
    }

    $('#tc_alias_input').attr('placeholder', placeholderText);
    $('#tc_alias_input').attr('maxlength', aliasMaxLength);
    thisClass.showAliasDialog(labelText, changePromptNote, targetElement);
  }

  addWelcomePseudoNameHeader(username) {
    var thisClass = this;

    if (username) {
      var messageDiv = document.createElement("div");
      $(messageDiv).attr("data-type", "pseudoname");
      $(messageDiv).attr("contenteditable", "true");
      messageDiv.id = thisClass._currentPseudoNameDivId;
      messageDiv.innerHTML = "Welcome back " + username;
      $(messageDiv).insertBefore($("#innerAnnotation"));
      $(messageDiv).css('cursor', 'pointer');
      $(messageDiv).click(function (event) {
        // Stop the refresh while alias box is enabled
        thisClass._host._isActive = false;
        paella.keyManager.enabled = false;
        event.preventDefault();
        event.stopPropagation();
        thisClass.updatePseudoName();
        return false;
      });
    }
  }

}

;
paella.TimedCommentsUsernameAlias = TimedCommentsUsernameAlias; // #DCE end timedcomments alias service, adapted for Paella 6.1.2
// DCE TopAlignVideoPlugin
// Engage this plugin via true in config AND param in URL  "...align=top"
// purpose: Video takes all top space to provide non-overlapping room for the control bar.
// MATT-1999/MATT-2001 Top aligned video required to embed player compactly in iframe without obscursing video with control bar.
// Impl Strategy: Set profile top = 0 and top align video container and video elemements to overwrite default core calculations.
// Adapted for Paella 6.1.2
paella.addPlugin(function () {
  return class TopAlignMonoVideoPlugin extends paella.EventDrivenPlugin {
    getName() {
      return "edu.harvard.dce.paella.topAlignMonoVideoPlugin";
    }

    getEvents() {
      return [paella.events.setProfile, paella.events.singleVideoReady, paella.events.resize];
    }

    checkEnabled(onSuccess) {
      // Expect "...?...&align=top" in url
      var topAlign = paella.utils.parameters.get('align');
      onSuccess(topAlign == 'top');
    }

    onEvent(eventType, params) {
      // Only top align during monostream view
      if (paella.player.videoContainer.isMonostream) {
        paella.player.videoContainer.container.domElement.style.top = "0%";
      }
    }

  };
});
// #DCE simplified button to toggle a fixed set of profiles
// Adapted for Paella 6.1.2
// For Paella 6.2.0, the viewModeToggleProfilesPlugin module is required.
paella.addPlugin(function () {
  return class ViewModeTogglePlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this._toggle = false;
    }

    _getToggle() {
      this._toggle = !this._toggle;
      return this._toggle;
    } // The presenter & presnetation video are toggled in each profile


    _profileOrder() {
      return ['side_by_side', 'one_tiny_and_one_big', 'one_big'];
    }

    _currentPlayerProfile() {
      return paella.player.selectedProfile;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Switch video layouts");
    }

    getIndex() {
      return 450;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "viewModeToggleButton";
    }

    getIconClass() {
      return 'icon-presentation-mode';
    }

    getName() {
      return "edu.harvard.dce.paella.viewModeTogglePlugin";
    }

    action(button) {
      var profileOrder = this._profileOrder();

      var numProfiles = profileOrder.length;
      var lastProfileIndex = profileOrder.indexOf(this._currentPlayerProfile());
      var chosenProfile = '';

      var toToggle = this._getToggle();

      if (lastProfileIndex == numProfiles - 1 && !toToggle) {
        chosenProfile = profileOrder[0];
      } else if (!toToggle) {
        chosenProfile = profileOrder[lastProfileIndex + 1];
      } else {
        // same profile but switched videos (videos toggle inside the profile config)
        chosenProfile = this._currentPlayerProfile();
        this.toggleProfileVideos(chosenProfile);
      }

      base.log.debug("Now triggering event setProfile on '" + chosenProfile + "' toggling video '" + toToggle + "'");
      var overlayContainer = paella.player.videoContainer.overlayContainer;

      if (overlayContainer) {
        overlayContainer.clear();
      }

      paella.player.setProfile(chosenProfile);
    }

    checkEnabled(onSuccess) {
      onSuccess(!paella.player.videoContainer.isMonostream && !base.userAgent.system.iOS);
    } // called by Mutli-Single view (presentationOnlyPlugin)


    turnOffVisibility() {
      paella.PaellaPlayer.mode.none = 'none';
      this.config.visibleOn = [paella.PaellaPlayer.mode.none];
      this.hideUI();
    } // called by Mutli-Single view (presentationOnlyPlugin)


    turnOnVisibility() {
      this.config.visibleOn = undefined;
      this.checkVisibility();
    }

    toggleProfileVideos(profileId) {
      let profile = paella.profiles.getProfile(profileId);

      if (profile && profile.validContent && profile.validContent.length >= 2 && profile.switch) {
        profile.switch();
      }
    }

  };
});
// #DCE required profiles for DCE's' ViewModeTogglePlugin adapted for Paella 6.2.0
paella.addProfile(() => {
  return new Promise((resolve, reject) => {
    paella.events.bind(paella.events.videoReady, () => {
      const validContent = ["presenter", "presentation"];
      let streams = paella.player.videoContainer.streamProvider.videoStreams;
      let available = streams.every(v => validContent.includes(v.content)) && streams.length == validContent.length;

      if (!available) {
        resolve(null);
      } else {
        // do not allow multi-video to load to single video view on first load unless on an iOS
        if (base.userAgent.system.iOS) {
          base.cookies.set('lastProfile', 'one_big');
        } else if (base.cookies.get('lastProfile') === 'one_big') {
          base.cookies.set('lastProfile', paella.player.config.defaultProfile || 'side_by_side');
        }

        resolve({
          "id": "side_by_side",
          "name": {
            "es": "Presentación y presentador"
          },
          "icon": "slide_professor_icon.png",
          validContent: validContent,
          "videos": [{
            content: validContent[0],
            "rect": [{
              "aspectRatio": "16/9",
              "width": "432",
              "height": "243",
              "top": "241",
              "left": "845"
            }, {
              "aspectRatio": "16/10",
              "width": "432",
              "height": "270",
              "top": "229",
              "left": "845"
            }, {
              "aspectRatio": "4/3",
              "width": "432",
              "height": "324",
              "top": "206",
              "left": "845"
            }],
            "visible": "true",
            "layer": "1"
          }, {
            content: validContent[1],
            "rect": [{
              "aspectRatio": "16/9",
              "width": "832",
              "height": "468",
              "top": "133",
              "left": "5"
            }, {
              "aspectRatio": "16/10",
              "width": "832",
              "height": "520",
              "top": "102",
              "left": "5"
            }, {
              "aspectRatio": "4/3",
              "width": "828",
              "height": "621",
              "top": "52",
              "left": "5"
            }],
            "visible": "true",
            "layer": "1"
          }],
          "background": {
            "content": "",
            "zIndex": 5,
            "rect": {
              "left": "0",
              "top": "0",
              "width": "1280",
              "height": "720"
            },
            "visible": "true",
            "layer": "0"
          },
          logos: [],
          buttons: [],
          onApply: function () {},
          switch: function () {
            // prep toggle for next setProfile
            let v0 = this.videos[0].content;
            let v1 = this.videos[1].content;
            this.videos[0].content = v1;
            this.videos[1].content = v0;
          }
        });
      }
    });
  });
});
paella.addProfile(() => {
  return new Promise((resolve, reject) => {
    paella.events.bind(paella.events.videoReady, () => {
      const validContent = ["presenter", "presentation"];
      let streams = paella.player.videoContainer.streamProvider.videoStreams;
      let available = streams.every(v => validContent.includes(v.content)) && streams.length == validContent.length;

      if (!available) {
        resolve(null);
      } else {
        resolve({
          "id": "one_tiny_and_one_big",
          "name": {
            "en": "Tiny and Big"
          },
          "icon": "professor_slide_icon.png",
          validContent: validContent,
          "videos": [{
            content: validContent[0],
            "rect": [{
              "aspectRatio": "16/9",
              "width": "416",
              "height": "234",
              "top": "35",
              "left": "850"
            }, {
              "aspectRatio": "16/10",
              "width": "416",
              "height": "260",
              "top": "35",
              "left": "850"
            }, {
              "aspectRatio": "4/3",
              "width": "416",
              "height": "312",
              "top": "35",
              "left": "850"
            }],
            "visible": "true",
            "layer": "2"
          }, {
            content: validContent[1],
            "rect": [{
              "aspectRatio": "16/9",
              "width": "1154",
              "height": "649",
              "top": "10",
              "left": "10"
            }, {
              "aspectRatio": "16/10",
              "width": "1050",
              "height": "656",
              "top": "10",
              "left": "117"
            }, {
              "aspectRatio": "4/3",
              "width": "932",
              "height": "699",
              "top": "10",
              "left": "50"
            }],
            "visible": "true",
            "layer": "1"
          }],
          "background": {
            "content": "",
            "zIndex": 5,
            "rect": {
              "left": "0",
              "top": "0",
              "width": "1280",
              "height": "720"
            },
            "visible": "true",
            "layer": "0"
          },
          logos: [],
          buttons: [],
          onApply: function () {},
          switch: function () {
            // prep toggle for next setProfile
            let v0 = this.videos[0].content;
            let v1 = this.videos[1].content;
            this.videos[0].content = v1;
            this.videos[1].content = v0;
          }
        });
      }
    });
  });
}); // end tiny_presenter profile

paella.addProfile(() => {
  return new Promise((resolve, reject) => {
    paella.events.bind(paella.events.videoReady, () => {
      const validContent = ["presenter", "presentation"];
      let streams = paella.player.videoContainer.streamProvider.videoStreams;
      let available = streams.every(v => validContent.includes(v.content)) && streams.length == validContent.length;

      if (!available) {
        resolve(null);
      } else {
        resolve({
          id: "one_big",
          name: {
            es: "Un stream"
          },
          hidden: false,
          icon: "",
          validContent: validContent,
          videos: [{
            content: validContent[0],
            rect: [{
              aspectRatio: "1/1",
              left: 280,
              top: 0,
              width: 720,
              height: 720
            }, {
              aspectRatio: "6/5",
              left: 208,
              top: 0,
              width: 864,
              height: 720
            }, {
              aspectRatio: "5/4",
              left: 190,
              top: 0,
              width: 900,
              height: 720
            }, {
              aspectRatio: "4/3",
              left: 160,
              top: 0,
              width: 960,
              height: 720
            }, {
              aspectRatio: "11/8",
              left: 145,
              top: 0,
              width: 990,
              height: 720
            }, {
              aspectRatio: "1.41/1",
              left: 132,
              top: 0,
              width: 1015,
              height: 720
            }, {
              aspectRatio: "1.43/1",
              left: 125,
              top: 0,
              width: 1029,
              height: 720
            }, {
              aspectRatio: "3/2",
              left: 100,
              top: 0,
              width: 1080,
              height: 720
            }, {
              aspectRatio: "16/10",
              left: 64,
              top: 0,
              width: 1152,
              height: 720
            }, {
              aspectRatio: "5/3",
              left: 40,
              top: 0,
              width: 1200,
              height: 720
            }, {
              aspectRatio: "16/9",
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            }, {
              aspectRatio: "1.85/1",
              left: 0,
              top: 14,
              width: 1280,
              height: 692
            }, {
              aspectRatio: "2.35/1",
              left: 0,
              top: 87,
              width: 1280,
              height: 544
            }, {
              aspectRatio: "2.41/1",
              left: 0,
              top: 94,
              width: 1280,
              height: 531
            }, {
              aspectRatio: "2.76/1",
              left: 0,
              top: 128,
              width: 1280,
              height: 463
            }],
            visible: true,
            layer: 1
          }, {
            content: validContent[1],
            "rect": [{
              "aspectRatio": "16/9",
              "width": "0",
              "height": "0",
              "top": "0",
              "left": "0"
            }],
            "visible": false,
            "layer": "2"
          }],
          background: {
            content: "",
            zIndex: 5,
            rect: {
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            },
            visible: false,
            layer: 0
          },
          logos: [],
          buttons: [],
          onApply: function () {},
          switch: function () {
            // prep toggle for next setProfile
            let vc0 = this.validContent[0];
            let vc1 = this.validContent[1];
            this.validContent[0] = vc1;
            this.validContent[1] = vc0;
            this.videos[0].content = vc1;
            this.videos[1].content = vc0;
          }
        });
      }
    });
  });
});
paella.addPlugin(function () {
  /////////////////////////////////////////////////
  // WebVTT Parser
  /////////////////////////////////////////////////
  return class WebVTTParserPlugin extends paella.CaptionParserPlugIn {
    get ext() {
      return ["vtt"];
    }

    getName() {
      return "es.teltek.paella.captions.WebVTTParserPlugin";
    }

    parse(content, lang, next) {
      var captions = [];
      var self = this;
      var lls = content.split("\n");
      var c;
      var id = 0;
      var skip = false;

      for (var idx = 0; idx < lls.length; ++idx) {
        var ll = lls[idx].trim();

        if (/^WEBVTT/.test(ll) && c === undefined || ll.length === 0) {
          continue;
        }

        if ((/^[0-9]+$/.test(ll) || /^[0-9]+ -/.test(ll)) && lls[idx - 1].trim().length === 0) {
          continue;
        }

        if (/^NOTE/.test(ll) || /^STYLE/.test(ll)) {
          skip = true;
          continue;
        }

        if (/^(([0-9]+:)?[0-9]{2}:[0-9]{2}.[0-9]{3} --> ([0-9]+:)?[0-9]{2}:[0-9]{2}.[0-9]{3})/.test(ll)) {
          skip = false;

          if (c != undefined) {
            captions.push(c);
            id++;
          }

          c = {
            id: id,
            begin: self.parseTimeTextToSeg(ll.split("-->")[0]),
            end: self.parseTimeTextToSeg(ll.split("-->")[1])
          };
          continue;
        }

        if (c !== undefined && !skip) {
          ll = ll.replace(/^- /, "");
          ll = ll.replace(/<[^>]*>/g, "");

          if (c.content === undefined) {
            c.content = ll;
          } else {
            c.content += "\n" + ll;
          }
        }
      }

      captions.push(c);

      if (captions.length > 0) {
        next(false, captions);
      } else {
        next(true);
      }
    }

    parseTimeTextToSeg(ttime) {
      var nseg = 0;
      var factor = 1;
      ttime = /(([0-9]+:)?[0-9]{2}:[0-9]{2}.[0-9]{3})/.exec(ttime);
      var split = ttime[0].split(":");

      for (var i = split.length - 1; i >= 0; i--) {
        factor = Math.pow(60, split.length - 1 - i);
        nseg += split[i] * factor;
      }

      return nseg;
    }

  };
});
paella.addPlugin(function () {
  return class xAPISaverPlugin extends paella.userTracking.SaverPlugIn {
    getName() {
      return "es.teltek.paella.usertracking.xAPISaverPlugin";
    }

    setup() {
      this.endpoint = this.config.endpoint;
      this.auth = this.config.auth;
      this.user_info = {};
      this.paused = true;
      this.played_segments = "";
      this.played_segments_segment_start = null;
      this.played_segments_segment_end = null;
      this.progress = 0;
      this.duration = 0;
      this.current_time = [];
      this.completed = false;
      this.volume = null;
      this.speed = null;
      this.language = "us-US";
      this.quality = null;
      this.fullscreen = false;
      this.title = "No title available";
      this.description = "";
      this.user_agent = "";
      this.total_time = 0;
      this.total_time_start = 0;
      this.total_time_end = 0;
      this.session_id = "";
      let self = this;

      this._loadDeps().then(function () {
        let conf = {
          "endpoint": self.endpoint,
          "auth": "Basic " + toBase64(self.auth)
        };
        ADL.XAPIWrapper.changeConfig(conf);
      });

      paella.events.bind(paella.events.timeUpdate, function (event, params) {
        self.current_time.push(params.currentTime);

        if (self.current_time.length >= 10) {
          self.current_time = self.current_time.slice(-10);
        }

        var a = Math.round(self.current_time[0]);
        var b = Math.round(self.current_time[9]);

        if (params.currentTime !== 0 && a + 1 >= b && b - 1 >= a) {
          self.progress = self.get_progress(params.currentTime, params.duration);

          if (self.progress >= 0.95 && self.completed === false) {
            self.completed = true;
            self.end_played_segment(params.currentTime);
            self.start_played_segment(params.currentTime);
            self.send_completed(params.currentTime, self.progress);
          }
        }
      });
    }

    get_session_data() {
      var myparams = ADL.XAPIWrapper.searchParams();
      var agent = JSON.stringify({
        "mbox": this.user_info.email
      });
      var timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - 1);
      timestamp = timestamp.toISOString();
      myparams['activity'] = window.location.href;
      myparams['verb'] = 'http://adlnet.gov/expapi/verbs/terminated';
      myparams['since'] = timestamp;
      myparams['limit'] = 1;
      myparams['agent'] = agent;
      var ret = ADL.XAPIWrapper.getStatements(myparams);

      if (ret.statements.length === 1) {
        this.played_segments = ret.statements[0].result.extensions['https://w3id.org/xapi/video/extensions/played-segments'];
        this.progress = ret.statements[0].result.extensions['https://w3id.org/xapi/video/extensions/progress'];
        ADL.XAPIWrapper.lrs.registration = ret.statements[0].context.registration;
      } else {
        ADL.XAPIWrapper.lrs.registration = ADL.ruuid();
      }
    }

    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }

      return "";
    }

    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    checkCookie() {
      var user_info = this.getCookie("user_info");

      if (user_info === "") {
        user_info = JSON.stringify(generateName());
      }

      this.setCookie("user_info", user_info);
      return JSON.parse(user_info);
    }

    checkEnabled(onSuccess) {
      this._url = this.config.url;
      this._index = this.config.index || "paellaplayer";
      this._type = this.config.type || "usertracking";
      onSuccess(true);
    }

    _loadDeps() {
      return new Promise((resolve, reject) => {
        if (!window.$paella_mpd) {
          require(['resources/deps/xapiwrapper.min.js'], function () {
            require(['resources/deps/random_name_generator.js'], function () {
              window.$paella_bg2e = true;
              resolve(window.$paella_bg2e);
            });
          });
        } else {
          defer.resolve(window.$paella_mpd);
        }
      });
    }

    log(event, params) {
      var p = params;
      let self = this; // console.log(event)
      // console.log(params)

      switch (event) {
        //Retrieve initial parameters from player
        case "paella:loadComplete":
          this.user_agent = navigator.userAgent.toString();
          this.get_title();
          this.get_description();
          paella.player.videoContainer.duration().then(function (duration) {
            return paella.player.videoContainer.streamProvider.mainAudioPlayer.volume().then(function (volume) {
              return paella.player.videoContainer.getCurrentQuality().then(function (quality) {
                return paella.player.auth.userData().then(function (user_info) {
                  self.duration = duration;
                  self.volume = volume;
                  self.speed = 1;

                  if (paella.player.videoContainer.streamProvider.mainAudioPlayer.stream.language) {
                    self.language = paella.player.videoContainer.streamProvider.mainAudioPlayer.stream.language.replace("_", "-");
                  }

                  self.quality = quality.shortLabel();

                  if (user_info.email && user_info.name) {
                    self.user_info = user_info;
                  } else {
                    self.user_info = self.checkCookie();
                  }

                  self.get_session_data();
                  self.send_initialized();
                });
              });
            });
          });

          window.onbeforeunload = function (e) {
            if (!self.paused) {
              self.send_pause(self);
            } //TODO Algunas veces se envia terminated antes que paused


            self.send_terminated(self); // var dialogText = 'Dialog text here';
            // e.returnValue = dialogText;
            // window.onbeforeunload = null;
            // return dialogText;
          };

          break;

        case "paella:play":
          this.send_play(self);
          break;

        case "paella:pause":
          this.send_pause(self);
          break;

        case "paella:seektotime":
          this.send_seek(self, params);
          break;
        //Player options

        case "paella:setVolume":
          paella.player.videoContainer.currentTime().then(function (currentTime) {
            var current_time = self.format_float(currentTime);
            self.volume = params.master; //self.send_interacted(current_time, {"https://w3id.org/xapi/video/extensions/volume": params.master})

            var interacted = {
              "https://w3id.org/xapi/video/extensions/volume": self.format_float(params.master)
            };
            self.send_interacted(current_time, interacted);
          });
          break;

        case "paella:setplaybackrate":
          paella.player.videoContainer.currentTime().then(function (currentTime) {
            var current_time = self.format_float(currentTime);
            self.speed = params.rate;
            var interacted = {
              "https://w3id.org/xapi/video/extensions/speed": params.rate + "x"
            };
            self.send_interacted(current_time, interacted);
          });
          break;

        case "paella:qualityChanged":
          paella.player.videoContainer.currentTime().then(function (currentTime) {
            return paella.player.videoContainer.getCurrentQuality().then(function (quality) {
              self.quality = quality.shortLabel();
              var current_time = self.format_float(currentTime);
              var interacted = {
                "https://w3id.org/xapi/video/extensions/quality": quality.shortLabel()
              };
              self.send_interacted(current_time, interacted);
            });
          });
          break;

        case "paella:enterFullscreen":
        case "paella:exitFullscreen":
          paella.player.videoContainer.currentTime().then(function (currentTime) {
            var current_time = self.format_float(currentTime);
            self.fullscreen ? self.fullscreen = false : self.fullscreen = true;
            var interacted = {
              "https://w3id.org/xapi/video/extensions/full-screen": self.fullscreen
            };
            self.send_interacted(current_time, interacted);
          });
          break;

        default:
          break;
      }
    }

    send(params) {
      var agent = new ADL.XAPIStatement.Agent(this.user_info.email, this.user_info.name);
      var verb = new ADL.XAPIStatement.Verb(params.verb.id, params.verb.description);
      var activity = new ADL.XAPIStatement.Activity(window.location.href, this.title, this.description);
      activity.definition.type = "https://w3id.org/xapi/video/activity-type/video";
      paella.player.videoContainer.streamProvider.mainAudioPlayer.volume().then(function (volume) {});
      var statement = new ADL.XAPIStatement(agent, verb, activity);
      statement.result = params.result;

      if (params.verb.id === "http://adlnet.gov/expapi/verbs/initialized") {
        statement.generateId();
        this.session_id = statement.id;
      }

      var ce_base = {
        "https://w3id.org/xapi/video/extensions/session-id": this.session_id,
        "https://w3id.org/xapi/video/extensions/length": Math.floor(this.duration),
        "https://w3id.org/xapi/video/extensions/user-agent": this.user_agent
      };
      var ce_interactions = {
        "https://w3id.org/xapi/video/extensions/volume": this.format_float(this.volume),
        "https://w3id.org/xapi/video/extensions/speed": this.speed + "x",
        "https://w3id.org/xapi/video/extensions/quality": this.quality,
        "https://w3id.org/xapi/video/extensions/full-screen": this.fullscreen
      };
      var context_extensions = {};

      if (params.interacted) {
        context_extensions = $.extend({}, ce_base, params.interacted);
      } else {
        context_extensions = $.extend({}, ce_base, ce_interactions);
      }

      statement.context = {
        "language": this.language,
        "extensions": context_extensions,
        "contextActivities": {
          "category": [{
            "objectType": "Activity",
            "id": "https://w3id.org/xapi/video"
          }]
        }
      }; // Dispatch the statement to the LRS

      var result = ADL.XAPIWrapper.sendStatement(statement);
    }

    send_initialized() {
      var statement = {
        "verb": {
          "id": "http://adlnet.gov/expapi/verbs/initialized",
          "description": "initalized"
        }
      };
      this.send(statement);
    }

    send_terminated(self) {
      paella.player.videoContainer.currentTime().then(function (end_time) {
        var statement = {
          "verb": {
            "id": "http://adlnet.gov/expapi/verbs/terminated",
            "description": "terminated"
          },
          "result": {
            "extensions": {
              "https://w3id.org/xapi/video/extensions/time": end_time,
              "https://w3id.org/xapi/video/extensions/progress": self.progress,
              "https://w3id.org/xapi/video/extensions/played-segments": self.played_segments
            }
          }
        };
        self.send(statement);
      });
    }

    send_play(self) {
      this.paused = false;
      this.total_time_start = new Date().getTime() / 1000;
      paella.player.videoContainer.currentTime().then(function (currentTime) {
        var start_time = self.format_float(currentTime); //When the video starts we force start_time to 0

        if (start_time <= 1) {
          start_time = 0;
        }

        self.start_played_segment(start_time);
        var statement = {
          "verb": {
            "id": "https://w3id.org/xapi/video/verbs/played",
            "description": "played"
          },
          "result": {
            "extensions": {
              "https://w3id.org/xapi/video/extensions/time": start_time
            }
          }
        };
        self.send(statement);
      });
    }

    send_pause(self) {
      this.paused = true;
      this.total_time_end = new Date().getTime() / 1000;
      this.total_time += this.total_time_end - this.total_time_start;
      paella.player.videoContainer.currentTime().then(function (currentTime) {
        //return paella.player.videoContainer.duration().then(function(duration) {
        var end_time = self.format_float(currentTime); //self.progress = self.get_progress(end_time, duration)
        //If a video end, the player go to the video start and raise a pause event with currentTime = 0

        if (end_time === 0) {
          end_time = self.duration;
        }

        self.end_played_segment(end_time);
        var statement = {
          "verb": {
            "id": "https://w3id.org/xapi/video/verbs/paused",
            "description": "paused"
          },
          "result": {
            "extensions": {
              "https://w3id.org/xapi/video/extensions/time": end_time,
              "https://w3id.org/xapi/video/extensions/progress": self.progress,
              "https://w3id.org/xapi/video/extensions/played-segments": self.played_segments
            }
          }
        };
        self.send(statement);
      }); //});
    }

    send_seek(self, params) {
      var seekedto = this.format_float(params.newPosition); //FIXME Metodo para obtener el instante desde donde empieza el seek

      var a = this.current_time.filter(function (value) {
        return value <= seekedto - 1;
      });

      if (a.length === 0) {
        a = this.current_time.filter(function (value) {
          return value >= seekedto + 1;
        });
      } //In some cases, when you seek to the end of the video the array contains zeros at the end


      var seekedfrom = a.filter(Number).pop();
      this.current_time = [];
      this.current_time.push(seekedto); // Fin de FIXME
      //If the video is paused it's not neccesary create a new segment, because the pause event already close a segment

      self.progress = self.get_progress(seekedfrom, self.duration);

      if (!this.paused) {
        this.end_played_segment(seekedfrom);
        this.start_played_segment(seekedto);
      } //paella.player.videoContainer.duration().then(function(duration) {
      //var progress = self.get_progress(seekedfrom, duration)


      var statement = {
        "verb": {
          "id": "https://w3id.org/xapi/video/verbs/seeked",
          "description": "seeked"
        },
        "result": {
          "extensions": {
            "https://w3id.org/xapi/video/extensions/time-from": seekedfrom,
            "https://w3id.org/xapi/video/extensions/time-to": seekedto,
            // Aqui tambien deberiamos de enviar los segmentos reproducidos y el porcentaje
            "https://w3id.org/xapi/video/extensions/progress": self.progress,
            "https://w3id.org/xapi/video/extensions/played-segments": self.played_segments
          }
        }
      };
      self.send(statement); //})
    }

    send_completed(time, progress) {
      var statement = {
        "verb": {
          "id": "http://adlnet.gov/xapi/verbs/completed",
          "description": "completed"
        },
        "result": {
          "completion": true,
          "success": true,
          "duration": "PT" + this.total_time + "S",
          "extensions": {
            "https://w3id.org/xapi/video/extensions/time": time,
            "https://w3id.org/xapi/video/extensions/progress": progress,
            "https://w3id.org/xapi/video/extensions/played-segments": this.played_segments
          }
        }
      };
      this.send(statement);
    }

    send_interacted(current_time, interacted) {
      var statement = {
        "verb": {
          "id": "http://adlnet.gov/expapi/verbs/interacted",
          "description": "interacted"
        },
        "result": {
          "extensions": {
            "https://w3id.org/xapi/video/extensions/time": current_time
          }
        },
        "interacted": interacted
      };
      this.send(statement);
    }

    start_played_segment(start_time) {
      this.played_segments_segment_start = start_time;
    }

    end_played_segment(end_time) {
      var arr;
      arr = this.played_segments === "" ? [] : this.played_segments.split("[,]");
      arr.push(this.played_segments_segment_start + "[.]" + end_time);
      this.played_segments = arr.join("[,]");
      this.played_segments_segment_end = end_time; //this.played_segments_segment_start = null;
    }

    format_float(number) {
      number = parseFloat(number); //Ensure that number is a float

      return parseFloat(number.toFixed(3));
    }

    get_title() {
      if (paella.player.videoLoader.getMetadata().i18nTitle) {
        this.title = paella.player.videoLoader.getMetadata().i18nTitle;
      } else if (paella.player.videoLoader.getMetadata().title) {
        this.title = paella.player.videoLoader.getMetadata().title;
      }
    }

    get_description() {
      if (paella.player.videoLoader.getMetadata().i18nTitle) {
        this.description = paella.player.videoLoader.getMetadata().i18nDescription;
      } else {
        this.description = paella.player.videoLoader.getMetadata().description;
      }
    }

    get_progress(currentTime, duration) {
      var arr, arr2; //get played segments array

      arr = this.played_segments === "" ? [] : this.played_segments.split("[,]");

      if (this.played_segments_segment_start != null) {
        arr.push(this.played_segments_segment_start + "[.]" + currentTime);
      }

      arr2 = [];
      arr.forEach(function (v, i) {
        arr2[i] = v.split("[.]");
        arr2[i][0] *= 1;
        arr2[i][1] *= 1;
      }); //sort the array

      arr2.sort(function (a, b) {
        return a[0] - b[0];
      }); //normalize the segments

      arr2.forEach(function (v, i) {
        if (i > 0) {
          if (arr2[i][0] < arr2[i - 1][1]) {
            //overlapping segments: this segment's starting point is less than last segment's end point.
            //console.log(arr2[i][0] + " < " + arr2[i-1][1] + " : " + arr2[i][0] +" = " +arr2[i-1][1] );
            arr2[i][0] = arr2[i - 1][1];
            if (arr2[i][0] > arr2[i][1]) arr2[i][1] = arr2[i][0];
          }
        }
      }); //calculate progress_length

      var progress_length = 0;
      arr2.forEach(function (v, i) {
        if (v[1] > v[0]) progress_length += v[1] - v[0];
      });
      var progress = 1 * (progress_length / duration).toFixed(2);
      return progress;
    }

  };
});
// #DCE OPC-374, OPC-357 overridding plugins/es.upv.defaultProfiles/main.js
// for MATT-2502 adding 16x9+16x9 (3.55/1) monostream live stream ratio
paella.addPlugin(function () {
  return class SingleStreamProfilePlugin extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.singleStreamProfilePlugin";
    }

    checkEnabled(onSuccess) {
      let config = this.config;
      config.videoSets.forEach((videoSet, index) => {
        let validContent = videoSet.content;

        if (validContent.length == 1) {
          let streamCount = 0;
          paella.player.videoContainer.streamProvider.videoStreams.forEach(v => {
            if (validContent.indexOf(v.content) != -1) {
              streamCount++;
            }
          });

          if (streamCount >= 1) {
            onSuccess(true);
            paella.addProfile(() => {
              return new Promise((resolve, reject) => {
                resolve({
                  id: videoSet.id,
                  name: {
                    es: "Un stream"
                  },
                  hidden: false,
                  icon: videoSet.icon,
                  videos: [{
                    content: validContent[0],
                    rect: [{
                      aspectRatio: "1/1",
                      left: 280,
                      top: 0,
                      width: 720,
                      height: 720
                    }, {
                      aspectRatio: "6/5",
                      left: 208,
                      top: 0,
                      width: 864,
                      height: 720
                    }, {
                      aspectRatio: "5/4",
                      left: 190,
                      top: 0,
                      width: 900,
                      height: 720
                    }, {
                      aspectRatio: "4/3",
                      left: 160,
                      top: 0,
                      width: 960,
                      height: 720
                    }, {
                      aspectRatio: "11/8",
                      left: 145,
                      top: 0,
                      width: 990,
                      height: 720
                    }, {
                      aspectRatio: "1.41/1",
                      left: 132,
                      top: 0,
                      width: 1015,
                      height: 720
                    }, {
                      aspectRatio: "1.43/1",
                      left: 125,
                      top: 0,
                      width: 1029,
                      height: 720
                    }, {
                      aspectRatio: "3/2",
                      left: 100,
                      top: 0,
                      width: 1080,
                      height: 720
                    }, {
                      aspectRatio: "16/10",
                      left: 64,
                      top: 0,
                      width: 1152,
                      height: 720
                    }, {
                      aspectRatio: "5/3",
                      left: 40,
                      top: 0,
                      width: 1200,
                      height: 720
                    }, {
                      aspectRatio: "16/9",
                      left: 0,
                      top: 0,
                      width: 1280,
                      height: 720
                    }, {
                      aspectRatio: "1.85/1",
                      left: 0,
                      top: 14,
                      width: 1280,
                      height: 692
                    }, {
                      aspectRatio: "2.35/1",
                      left: 0,
                      top: 87,
                      width: 1280,
                      height: 544
                    }, {
                      aspectRatio: "2.41/1",
                      left: 0,
                      top: 94,
                      width: 1280,
                      height: 531
                    }, {
                      aspectRatio: "2.76/1",
                      left: 0,
                      top: 128,
                      width: 1280,
                      height: 463
                    }, //#DCE MATT-2502, OPC-374 add 16x9+16x9 (3.55/1) monostream live stream ratio
                    // Using "top:0", because relative resize box is also being overridden to 3.55/1
                    {
                      aspectRatio: "3.55/1",
                      left: 0,
                      top: 0,
                      width: 960,
                      height: 270
                    } // end #DCE
                    ],
                    visible: true,
                    layer: 1
                  }],
                  background: {
                    content: "slide_professor_paella.jpg",
                    zIndex: 5,
                    rect: {
                      left: 0,
                      top: 0,
                      width: 1280,
                      height: 720
                    },
                    visible: true,
                    layer: 0
                  },
                  logos: [],
                  //#DCE OPC-374 hide paella logo overlay :(
                  buttons: [],
                  onApply: function () {}
                });
              });
            });
          } else {
            onSuccess(false);
          }
        }
      });
    }

  };
});
paella.addPlugin(function () {
  return class DualStreamProfilePlugin extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.dualStreamProfilePlugin";
    }

    checkEnabled(onSuccess) {
      let config = this.config;
      config.videoSets.forEach((videoSet, index) => {
        let validContent = videoSet.content;

        if (validContent.length == 2) {
          let streamCount = 0;
          paella.player.videoContainer.streamProvider.videoStreams.forEach(v => {
            if (validContent.indexOf(v.content) != -1) {
              streamCount++;
            }
          });

          if (streamCount >= 2) {
            onSuccess(true);
            paella.addProfile(() => {
              return new Promise((resolve, reject) => {
                resolve({
                  id: videoSet.id,
                  name: {
                    es: "Dos streams con posición dinámica"
                  },
                  hidden: false,
                  icon: videoSet.icon,
                  videos: [{
                    content: validContent[0],
                    rect: [{
                      aspectRatio: "16/9",
                      left: 712,
                      top: 302,
                      width: 560,
                      height: 315
                    }, {
                      aspectRatio: "16/10",
                      left: 712,
                      top: 267,
                      width: 560,
                      height: 350
                    }, {
                      aspectRatio: "4/3",
                      left: 712,
                      top: 198,
                      width: 560,
                      height: 420
                    }, {
                      aspectRatio: "5/3",
                      left: 712,
                      top: 281,
                      width: 560,
                      height: 336
                    }, {
                      aspectRatio: "5/4",
                      left: 712,
                      top: 169,
                      width: 560,
                      height: 448
                    }],
                    visible: true,
                    layer: 1
                  }, {
                    content: validContent[1],
                    rect: [{
                      aspectRatio: "16/9",
                      left: 10,
                      top: 225,
                      width: 695,
                      height: 390
                    }, {
                      aspectRatio: "16/10",
                      left: 10,
                      top: 183,
                      width: 695,
                      height: 434
                    }, {
                      aspectRatio: "4/3",
                      left: 10,
                      top: 96,
                      width: 695,
                      height: 521
                    }, {
                      aspectRatio: "5/3",
                      left: 10,
                      top: 200,
                      width: 695,
                      height: 417
                    }, {
                      aspectRatio: "5/4",
                      left: 10,
                      top: 62,
                      width: 695,
                      height: 556
                    }],
                    visible: true,
                    layer: "1"
                  }],
                  background: {
                    content: "slide_professor_paella.jpg",
                    zIndex: 5,
                    rect: {
                      left: 0,
                      top: 0,
                      width: 1280,
                      height: 720
                    },
                    visible: true,
                    layer: 0
                  },
                  logos: [{
                    content: "paella_logo.png",
                    zIndex: 5,
                    rect: {
                      top: 10,
                      left: 10,
                      width: 49,
                      height: 42
                    }
                  }],
                  buttons: [{
                    rect: {
                      left: 682,
                      top: 565,
                      width: 45,
                      height: 45
                    },
                    onClick: function (event) {
                      this.switch();
                    },
                    label: "Switch",
                    icon: "icon_rotate.svg",
                    layer: 2
                  }, {
                    rect: {
                      left: 682,
                      top: 515,
                      width: 45,
                      height: 45
                    },
                    onClick: function (event) {
                      this.switchMinimize();
                    },
                    label: "Minimize",
                    icon: "minimize.svg",
                    layer: 2
                  }],
                  onApply: function () {},
                  switch: function () {
                    let v0 = this.videos[0].content;
                    let v1 = this.videos[1].content;
                    this.videos[0].content = v1;
                    this.videos[1].content = v0;
                    paella.profiles.placeVideos();
                  },
                  switchMinimize: function () {
                    if (this.minimized) {
                      this.minimized = false;
                      this.videos = [{
                        content: validContent[0],
                        rect: [{
                          aspectRatio: "16/9",
                          left: 712,
                          top: 302,
                          width: 560,
                          height: 315
                        }, {
                          aspectRatio: "16/10",
                          left: 712,
                          top: 267,
                          width: 560,
                          height: 350
                        }, {
                          aspectRatio: "4/3",
                          left: 712,
                          top: 198,
                          width: 560,
                          height: 420
                        }, {
                          aspectRatio: "5/3",
                          left: 712,
                          top: 281,
                          width: 560,
                          height: 336
                        }, {
                          aspectRatio: "5/4",
                          left: 712,
                          top: 169,
                          width: 560,
                          height: 448
                        }],
                        visible: true,
                        layer: 1
                      }, {
                        content: validContent[1],
                        rect: [{
                          aspectRatio: "16/9",
                          left: 10,
                          top: 225,
                          width: 695,
                          height: 390
                        }, {
                          aspectRatio: "16/10",
                          left: 10,
                          top: 183,
                          width: 695,
                          height: 434
                        }, {
                          aspectRatio: "4/3",
                          left: 10,
                          top: 96,
                          width: 695,
                          height: 521
                        }, {
                          aspectRatio: "5/3",
                          left: 10,
                          top: 200,
                          width: 695,
                          height: 417
                        }, {
                          aspectRatio: "5/4",
                          left: 10,
                          top: 62,
                          width: 695,
                          height: 556
                        }],
                        visible: true,
                        layer: 2
                      }];
                      this.buttons = [{
                        rect: {
                          left: 682,
                          top: 565,
                          width: 45,
                          height: 45
                        },
                        onClick: function (event) {
                          this.switch();
                        },
                        label: "Switch",
                        icon: "icon_rotate.svg",
                        layer: 2
                      }, {
                        rect: {
                          left: 682,
                          top: 515,
                          width: 45,
                          height: 45
                        },
                        onClick: function (event) {
                          this.switchMinimize();
                        },
                        label: "Minimize",
                        icon: "minimize.svg",
                        layer: 2
                      }];
                    } else {
                      this.minimized = true;
                      this.videos = [{
                        content: validContent[0],
                        rect: [{
                          aspectRatio: "16/9",
                          left: 0,
                          top: 0,
                          width: 1280,
                          height: 720
                        }, {
                          aspectRatio: "16/10",
                          left: 64,
                          top: 0,
                          width: 1152,
                          height: 720
                        }, {
                          aspectRatio: "5/3",
                          left: 40,
                          top: 0,
                          width: 1200,
                          height: 720
                        }, {
                          aspectRatio: "5/4",
                          left: 190,
                          top: 0,
                          width: 900,
                          height: 720
                        }, {
                          aspectRatio: "4/3",
                          left: 160,
                          top: 0,
                          width: 960,
                          height: 720
                        }],
                        visible: true,
                        layer: 1
                      }, {
                        content: validContent[1],
                        rect: [{
                          aspectRatio: "16/9",
                          left: 50,
                          top: 470,
                          width: 350,
                          height: 197
                        }, {
                          aspectRatio: "16/10",
                          left: 50,
                          top: 448,
                          width: 350,
                          height: 219
                        }, {
                          aspectRatio: "5/3",
                          left: 50,
                          top: 457,
                          width: 350,
                          height: 210
                        }, {
                          aspectRatio: "5/4",
                          left: 50,
                          top: 387,
                          width: 350,
                          height: 280
                        }, {
                          aspectRatio: "4/3",
                          left: 50,
                          top: 404,
                          width: 350,
                          height: 262
                        }],
                        visible: true,
                        layer: 2
                      }];
                      this.buttons = [{
                        rect: {
                          left: 388,
                          top: 465,
                          width: 45,
                          height: 45
                        },
                        onClick: function (event) {
                          this.switch();
                        },
                        label: "Switch",
                        icon: "icon_rotate.svg",
                        layer: 2
                      }, {
                        rect: {
                          left: 388,
                          top: 415,
                          width: 45,
                          height: 45
                        },
                        onClick: function (event) {
                          this.switchMinimize();
                        },
                        label: "Switch",
                        icon: "minimize.svg",
                        layer: 2
                      }];
                    }

                    paella.profiles.placeVideos();
                  }
                });
              });
            });
          } else {
            onSuccess(false);
          }
        }
      });
    }

  };
});
paella.addPlugin(function () {
  return class TripleStreamProfilePlugin extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.tripleStreamProfilePlugin";
    }

    checkEnabled(onSuccess) {
      let config = this.config;
      config.videoSets.forEach((videoSet, index) => {
        let validContent = videoSet.content;

        if (validContent.length == 3) {
          let streamCount = 0;
          paella.player.videoContainer.streamProvider.videoStreams.forEach(v => {
            if (validContent.indexOf(v.content) != -1) {
              streamCount++;
            }
          });

          if (streamCount >= 3) {
            onSuccess(true);
            paella.addProfile(() => {
              return new Promise((resolve, reject) => {
                resolve({
                  id: videoSet.id,
                  name: {
                    es: "Tres streams posición dinámica"
                  },
                  hidden: false,
                  icon: videoSet.icon,
                  videos: [{
                    content: validContent[0],
                    rect: [{
                      aspectRatio: "16/9",
                      left: 239,
                      top: 17,
                      width: 803,
                      height: 451
                    }],
                    visible: true,
                    layer: 1
                  }, {
                    content: validContent[1],
                    rect: [{
                      aspectRatio: "16/9",
                      left: 44,
                      top: 482,
                      width: 389,
                      height: 218
                    }],
                    visible: true,
                    layer: 1
                  }, {
                    content: validContent[2],
                    rect: [{
                      aspectRatio: "16/9",
                      left: 847,
                      top: 482,
                      width: 389,
                      height: 218
                    }],
                    visible: true,
                    layer: 1
                  }],
                  background: {
                    content: "slide_professor_paella.jpg",
                    zIndex: 5,
                    rect: {
                      left: 0,
                      top: 0,
                      width: 1280,
                      height: 720
                    },
                    visible: true,
                    layer: 0
                  },
                  logos: [{
                    content: "paella_logo.png",
                    zIndex: 5,
                    rect: {
                      top: 10,
                      left: 10,
                      width: 49,
                      height: 42
                    }
                  }],
                  buttons: [{
                    rect: {
                      left: 618,
                      top: 495,
                      width: 45,
                      height: 45
                    },
                    onClick: function (event) {
                      this.rotate();
                    },
                    label: "Rotate",
                    icon: "icon_rotate.svg",
                    layer: 2
                  }],
                  onApply: function () {},
                  rotate: function () {
                    let v0 = this.videos[0].content;
                    let v1 = this.videos[1].content;
                    let v2 = this.videos[2].content;
                    this.videos[0].content = v2;
                    this.videos[1].content = v0;
                    this.videos[2].content = v1;
                    paella.profiles.placeVideos();
                  }
                });
              });
            });
          } else {
            onSuccess(false);
          }
        }
      });
    }

  };
});
paella.addProfile(() => {
  return new Promise((resolve, reject) => {
    paella.events.bind(paella.events.videoReady, () => {
      let available = paella.player.videoContainer.streamProvider.videoStreams.some(v => v.content == "blackboard");

      if (!available) {
        resolve(null);
      } else {
        resolve({
          id: "blackboard_video_stream",
          name: {
            es: "Pizarra"
          },
          hidden: false,
          icon: "s_p_blackboard.svg",
          videos: [{
            content: "presentation",
            rect: [{
              aspectRatio: "16/9",
              left: 10,
              top: 70,
              width: 432,
              height: 243
            }],
            visible: true,
            layer: 1
          }, {
            content: "blackboard",
            rect: [{
              aspectRatio: "16/9",
              left: 450,
              top: 135,
              width: 816,
              height: 459
            }],
            visible: true,
            layer: 1
          }, {
            content: "presenter",
            rect: [{
              aspectRatio: "16/9",
              left: 10,
              top: 325,
              width: 432,
              height: 324
            }],
            visible: true,
            layer: 1
          }],
          //blackBoardImages: {left:10,top:325,width:432,height:324},
          background: {
            content: "slide_professor_paella.jpg",
            zIndex: 5,
            rect: {
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            },
            visible: true,
            layer: 0
          },
          logos: [{
            content: "paella_logo.png",
            zIndex: 5,
            rect: {
              top: 10,
              left: 10,
              width: 49,
              height: 42
            }
          }],
          buttons: [{
            rect: {
              left: 422,
              top: 295,
              width: 45,
              height: 45
            },
            onClick: function (event) {
              this.rotate();
            },
            label: "Rotate",
            icon: "icon_rotate.svg",
            layer: 2
          }],
          rotate: function () {
            let v0 = this.videos[0].content;
            let v1 = this.videos[1].content;
            let v2 = this.videos[2].content;
            this.videos[0].content = v2;
            this.videos[1].content = v0;
            this.videos[2].content = v1;
            paella.profiles.placeVideos();
          }
        });
      }
    });
  });
});
paella.addProfile(() => {
  return new Promise((resolve, reject) => {
    paella.events.bind(paella.events.videoReady, () => {
      // TODO: videoContainer.sourceData is deprecated. Update this code
      var n = paella.player.videoContainer.sourceData[0].sources;

      if (!n.chroma) {
        resolve(null);
      } else {
        resolve({
          id: "chroma",
          name: {
            es: "Polimedia"
          },
          hidden: false,
          icon: "chroma.svg",
          videos: [{
            content: "presenter",
            rect: [{
              aspectRatio: "16/9",
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            }, {
              aspectRatio: "16/10",
              left: 64,
              top: 0,
              width: 1152,
              height: 720
            }, {
              aspectRatio: "5/3",
              left: 40,
              top: 0,
              width: 1200,
              height: 720
            }, {
              aspectRatio: "5/4",
              left: 190,
              top: 0,
              width: 900,
              height: 720
            }, {
              aspectRatio: "4/3",
              left: 160,
              top: 0,
              width: 960,
              height: 720
            }],
            visible: "true",
            layer: "1"
          }, {
            content: "presentation",
            rect: [{
              aspectRatio: "16/9",
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            }, {
              aspectRatio: "16/10",
              left: 64,
              top: 0,
              width: 1152,
              height: 720
            }, {
              aspectRatio: "5/3",
              left: 40,
              top: 0,
              width: 1200,
              height: 720
            }, {
              aspectRatio: "5/4",
              left: 190,
              top: 0,
              width: 900,
              height: 720
            }, {
              aspectRatio: "4/3",
              left: 160,
              top: 0,
              width: 960,
              height: 720
            }],
            visible: "true",
            layer: "0"
          }],
          background: {
            content: "default_background_paella.jpg",
            zIndex: 5,
            rect: {
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            },
            visible: "true",
            layer: "0"
          },
          logos: [{
            content: "paella_logo.png",
            zIndex: 5,
            rect: {
              top: 10,
              left: 10,
              width: 49,
              height: 42
            }
          }]
        });
      }
    });
  });
});
/*
paella.plugins.TrimmingTrackPlugin = Class.create(paella.editor.MainTrackPlugin,{
	trimmingTrack:null,
	trimmingData:{s:0,e:0},

	getTrackItems:function() {
		if (this.trimmingTrack==null) {
			this.trimmingTrack = {id:1,s:0,e:0};
			this.trimmingTrack.s = paella.player.videoContainer.trimStart();
			this.trimmingTrack.e = paella.player.videoContainer.trimEnd();
			this.trimmingData.s = this.trimmingTrack.s;
			this.trimmingData.e = this.trimmingTrack.e;
		}		
		var tracks = [];
		tracks.push(this.trimmingTrack);
		return tracks;
	},
		
	getName:function() { return "es.upv.paella.editor.trimmingTrackPlugin"; },

	getTools:function() {
		if(this.config.enableResetButton) {
			return [
				{name:'reset', label:base.dictionary.translate('Reset'), hint:base.dictionary.translate('Resets the trimming bar to the default length of the video.')}
			];
		}
	},

	onToolSelected:function(toolName) {
		if(this.config.enableResetButton) {
		    if(toolName=='reset') {
			this.trimmingTrack = {id:1,s:0,e:0};
			this.trimmingTrack.s = 0;
			this.trimmingTrack.e = paella.player.videoContainer.duration(true);
			return true;
			}
		}
	},

	getTrackName:function() {
		return base.dictionary.translate("Trimming");
	},
	
	getColor:function() {
		return 'rgb(0, 51, 107)';
	},
	
	//checkEnabled:function(isEnabled) {
	//	isEnabled(paella.plugins.trimmingLoaderPlugin.config.enabled);
		//isEnabled(paella.player.config.trimming && paella.player.config.trimming.enabled);
		//},
	
	onSave:function(onDone) {
		paella.player.videoContainer.enableTrimming();
		paella.player.videoContainer.setTrimmingStart(this.trimmingTrack.s);
		paella.player.videoContainer.setTrimmingEnd(this.trimmingTrack.e);

		this.trimmingData.s = this.trimmingTrack.s;
		this.trimmingData.e = this.trimmingTrack.e;
		
		paella.data.write('trimming',{id:paella.initDelegate.getId()},{start:this.trimmingTrack.s,end:this.trimmingTrack.e},function(data,status) {
			onDone(status);
		});
	},
	
	onDiscard:function(onDone) {
		this.trimmingTrack.s = this.trimmingData.s;
		this.trimmingTrack.e = this.trimmingData.e;
		onDone(true);
	},
	
	allowDrag:function() {
		return false;
	},
	
	onTrackChanged:function(id,start,end) {
		//Checks if the trimming is valid (start >= 0 and end <= duration_of_the_video)
		playerEnd = paella.player.videoContainer.duration(true);
		start = (start < 0)? 0 : start;
		end = (end > playerEnd)? playerEnd : end;
		this.trimmingTrack.s = start;
		this.trimmingTrack.e = end;
		this.parent(id,start,end);
	},

	contextHelpString:function() {
		// TODO: Implement this using the standard base.dictionary class
		if (base.dictionary.currentLanguage()=="es") {
			return "Utiliza la herramienta de recorte para definir el instante inicial y el instante final de la clase. Para cambiar la duración solo hay que arrastrar el inicio o el final de la pista \"Recorte\", en la linea de tiempo.";
		}
		else {
			return "Use this tool to define the start and finish time.";
		}
	}
});

paella.plugins.trimmingTrackPlugin = new paella.plugins.TrimmingTrackPlugin();

*/
paella.addPlugin(function () {
  return class TrimmingLoaderPlugin extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.trimmingPlayerPlugin";
    }

    getEvents() {
      return [paella.events.controlBarLoaded, paella.events.showEditor, paella.events.hideEditor];
    }

    onEvent(eventType, params) {
      switch (eventType) {
        case paella.events.controlBarLoaded:
          this.loadTrimming();
          break;

        case paella.events.showEditor:
          paella.player.videoContainer.disableTrimming();
          break;

        case paella.events.hideEditor:
          if (paella.player.config.trimming && paella.player.config.trimming.enabled) {
            paella.player.videoContainer.enableTrimming();
          }

          break;
      }
    }

    loadTrimming() {
      var videoId = paella.initDelegate.getId();
      paella.data.read('trimming', {
        id: videoId
      }, function (data, status) {
        if (data && status && data.end > 0) {
          paella.player.videoContainer.enableTrimming();
          paella.player.videoContainer.setTrimming(data.start, data.end).then(() => {});
        } else {
          // Check for optional trim 'start' and 'end', in seconds, in location args
          var startTime = base.parameters.get('start');
          var endTime = base.parameters.get('end');

          if (startTime && endTime) {
            paella.player.videoContainer.setTrimming(startTime, endTime).then(function () {
              return paella.player.videoContainer.enableTrimming();
            });
          }
        }
      });
    }

  };
});
paella.addPlugin(function () {
  return class AirPlayPlugin extends paella.ButtonPlugin {
    getIndex() {
      return 552;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "AirPlayButton";
    }

    getIconClass() {
      return 'icon-airplay';
    }

    getName() {
      return "es.upv.paella.airPlayPlugin";
    }

    checkEnabled(onSuccess) {
      this._visible = false; // PIP is only available with single stream videos

      if (paella.player.videoContainer.streamProvider.videoStreams.length != 1) {
        onSuccess(false);
      } else {
        onSuccess(window.WebKitPlaybackTargetAvailabilityEvent);
      }
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Emit to AirPlay.");
    }

    setup() {
      let video = paella.player.videoContainer.masterVideo().video;

      if (window.WebKitPlaybackTargetAvailabilityEvent) {
        video.addEventListener('webkitplaybacktargetavailabilitychanged', event => {
          switch (event.availability) {
            case "available":
              this._visible = true;
              break;

            case "not-available":
              this._visible = false;
              break;
          }

          this.updateClassName();
        });
      }
    }

    action(button) {
      let video = paella.player.videoContainer.masterVideo().video;
      video.webkitShowPlaybackTargetPicker();
    }

    updateClassName() {
      this.button.className = this.getButtonItemClass(true);
    }

    getButtonItemClass(selected) {
      return 'buttonPlugin ' + this.getSubclass() + " " + this.getAlignment() + " " + (this._visible ? "available" : "not-available");
    }

  };
});
paella.addPlugin(function () {
  return class ArrowSlidesNavigator extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.arrowSlidesNavigatorPlugin";
    }

    checkEnabled(onSuccess) {
      if (!paella.initDelegate.initParams.videoLoader.frameList || Object.keys(paella.initDelegate.initParams.videoLoader.frameList).length == 0 || paella.player.videoContainer.isMonostream) {
        onSuccess(false);
      } else {
        onSuccess(true);
      }
    }

    setup() {
      var self = this;
      this._showArrowsIn = this.config.showArrowsIn || 'slave';
      this.createOverlay();
      self._frames = [];
      var frames = paella.initDelegate.initParams.videoLoader.frameList;
      var numFrames;

      if (frames) {
        var framesKeys = Object.keys(frames);
        numFrames = framesKeys.length;
        framesKeys.map(function (i) {
          return Number(i, 10);
        }).sort(function (a, b) {
          return a - b;
        }).forEach(function (key) {
          self._frames.push(frames[key]);
        });
      }
    }

    createOverlay() {
      var self = this;
      let overlayContainer = paella.player.videoContainer.overlayContainer;

      if (!this.arrows) {
        this.arrows = document.createElement('div');
        this.arrows.id = "arrows";
        this.arrows.style.marginTop = "25%";
        let arrowNext = document.createElement('div');
        arrowNext.className = "buttonPlugin arrowSlideNavidator nextButton right icon-next2";
        this.arrows.appendChild(arrowNext);
        let arrowPrev = document.createElement('div');
        arrowPrev.className = "buttonPlugin arrowSlideNavidator prevButton left icon-previous2";
        this.arrows.appendChild(arrowPrev);
        $(arrowNext).click(function (e) {
          self.goNextSlide();
          e.stopPropagation();
        });
        $(arrowPrev).click(function (e) {
          self.goPrevSlide();
          e.stopPropagation();
        });
      }

      if (this.container) {
        overlayContainer.removeElement(this.container);
      }

      let rect = null;
      let element = null;

      if (!paella.profiles.currentProfile) {
        return null;
      }

      this.config.content = this.config.content || ["presentation"];
      let profilesContent = [];
      paella.profiles.currentProfile.videos.forEach(profileData => {
        profilesContent.push(profileData.content);
      }); // Default content, if the "content" setting is not set in the configuration file

      let selectedContent = profilesContent.length == 1 ? profilesContent[0] : profilesContent.length > 1 ? profilesContent[1] : "";
      this.config.content.some(preferredContent => {
        if (profilesContent.indexOf(preferredContent) != -1) {
          selectedContent = preferredContent;
          return true;
        }
      });

      if (!selectedContent) {
        this.container = overlayContainer.addLayer();
        this.container.style.marginRight = "0";
        this.container.style.marginLeft = "0";
        this.arrows.style.marginTop = "25%";
      } else {
        let videoIndex = 0;
        paella.player.videoContainer.streamProvider.streams.forEach((stream, index) => {
          if (stream.type == "video" && selectedContent == stream.content) {
            videoIndex = index;
          }
        });
        element = document.createElement('div');
        rect = overlayContainer.getVideoRect(videoIndex); // content

        this.container = overlayContainer.addElement(element, rect);
        this.visible = rect.visible;
        this.arrows.style.marginTop = "33%";
      }

      this.container.appendChild(this.arrows);
      this.hideArrows();
    }

    getCurrentRange() {
      return new Promise(resolve => {
        if (this._frames.length < 1) {
          resolve(null);
        } else {
          let trimming = null;
          let duration = 0;
          paella.player.videoContainer.duration().then(d => {
            duration = d;
            return paella.player.videoContainer.trimming();
          }).then(t => {
            trimming = t;
            return paella.player.videoContainer.currentTime();
          }).then(currentTime => {
            if (!this._frames.some((f1, i, array) => {
              if (i + 1 == array.length) {
                return;
              }

              let f0 = i == 0 ? f1 : this._frames[i - 1];
              let f2 = this._frames[i + 1];
              let t0 = trimming.enabled ? f0.time - trimming.start : f0.time;
              let t1 = trimming.enabled ? f1.time - trimming.start : f1.time;
              let t2 = trimming.enabled ? f2.time - trimming.start : f2.time;

              if (t1 < currentTime && t2 > currentTime || t1 == currentTime) {
                let range = {
                  prev: t0,
                  next: t2
                };

                if (t0 < 0) {
                  range.prev = t1 > 0 ? t1 : 0;
                }

                resolve(range);
                return true;
              }
            })) {
              let t0 = this._frames[this._frames.length - 2].time;
              let t1 = this._frames[this._frames.length - 1].time;
              resolve({
                prev: trimming.enabled ? t0 - trimming.start : t0,
                next: trimming.enabled ? t1 - trimming.start : t1
              });
            }
          });
        }
      });
    }

    goNextSlide() {
      var self = this;
      let trimming;
      this.getCurrentRange().then(range => {
        return paella.player.videoContainer.seekToTime(range.next);
      }).then(() => {
        paella.player.videoContainer.play();
      });
    }

    goPrevSlide() {
      var self = this;
      let trimming = null;
      this.getCurrentRange().then(range => {
        return paella.player.videoContainer.seekToTime(range.prev);
      }).then(() => {
        paella.player.videoContainer.play();
      });
    }

    showArrows() {
      if (this.visible) $(this.arrows).show();
    }

    hideArrows() {
      $(this.arrows).hide();
    }

    getEvents() {
      return [paella.events.controlBarDidShow, paella.events.controlBarDidHide, paella.events.setComposition];
    }

    onEvent(eventType, params) {
      var self = this;

      switch (eventType) {
        case paella.events.controlBarDidShow:
          this.showArrows();
          break;

        case paella.events.controlBarDidHide:
          this.hideArrows();
          break;

        case paella.events.setComposition:
          this.createOverlay();
          break;
      }
    }

  };
});
paella.addPlugin(function () {
  return class AudioSelector extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "audioSelector";
    }

    getIconClass() {
      return 'icon-headphone';
    }

    getIndex() {
      return 2040;
    }

    getName() {
      return "es.upv.paella.audioSelector";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Set audio stream");
    }

    closeOnMouseOut() {
      return true;
    }

    checkEnabled(onSuccess) {
      paella.player.videoContainer.getAudioTags().then(tags => {
        this._tags = tags;
        onSuccess(tags.length > 1);
      });
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    buildContent(domElement) {
      this._tags.forEach(tag => {
        domElement.appendChild(this.getItemButton(tag));
      });
    }

    getItemButton(lang) {
      var elem = document.createElement('div');
      let currentTag = paella.player.videoContainer.audioTag;
      let label = lang.replace(/[-\_]/g, " ");
      elem.className = this.getButtonItemClass(label, lang == currentTag);
      elem.id = "audioTagSelectorItem_" + lang;
      elem.innerText = label;
      elem.data = lang;
      $(elem).click(function (event) {
        $('.videoAudioTrackItem').removeClass('selected');
        $('.videoAudioTrackItem.' + this.data).addClass('selected');
        paella.player.videoContainer.setAudioTag(this.data);
      });
      return elem;
    }

    setQualityLabel() {
      var This = this;
      paella.player.videoContainer.getCurrentQuality().then(function (q) {
        This.setText(q.shortLabel());
      });
    }

    getButtonItemClass(tag, selected) {
      return 'videoAudioTrackItem ' + tag + (selected ? ' selected' : '');
    }

  };
});
paella.addPlugin(function () {
  return class BlackBoard2 extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.blackBoardPlugin";
    }

    getIndex() {
      return 10;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "blackBoardButton2";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("BlackBoard");
    }

    checkEnabled(onSuccess) {
      this._blackBoardProfile = "s_p_blackboard2";
      this._blackBoardDIV = null;
      this._hasImages = null;
      this._active = false;
      this._creationTimer = 500;
      this._zImages = null;
      this._videoLength = null;
      this._keys = null;
      this._currentImage = null;
      this._next = null;
      this._prev = null;
      this._lensDIV = null;
      this._lensContainer = null;
      this._lensWidth = null;
      this._lensHeight = null;
      this._conImg = null;
      this._zoom = 250;
      this._currentZoom = null;
      this._maxZoom = 500;
      this._mousePos = null;
      this._containerRect = null;
      onSuccess(true);
    }

    getEvents() {
      return [paella.events.setProfile, paella.events.timeUpdate];
    }

    onEvent(event, params) {
      var self = this;

      switch (event) {
        case paella.events.setProfile:
          if (params.profileName != self._blackBoardProfile) {
            if (self._active) {
              self.destroyOverlay();
              self._active = false;
            }

            break;
          } else {
            if (!self._hasImages) {
              paella.player.setProfile("slide_professor");
            }

            if (self._hasImages && !self._active) {
              self.createOverlay();
              self._active = true;
            }
          }

          break;

        case paella.events.timeUpdate:
          if (self._active && self._hasImages) {
            paella.player.videoContainer.trimming().then(trimmingData => {
              if (trimmingData.enabled) {
                params.currentTime += trimmingData.start;
              }

              self.imageUpdate(event, params);
            });
          }

          break;
      }
    }

    setup() {
      var self = this;
      var n = paella.player.videoContainer.sourceData[0].sources;

      if (n.hasOwnProperty("image")) {
        self._hasImages = true; //  BRING THE IMAGE ARRAY TO LOCAL

        self._zImages = {};
        self._zImages = paella.player.videoContainer.sourceData[0].sources.image[0].frames; // COPY TO LOCAL

        self._videoLength = paella.player.videoContainer.sourceData[0].sources.image[0].duration; // video duration in frames
        // SORT KEYS FOR SEARCH CLOSEST

        self._keys = Object.keys(self._zImages);
        self._keys = self._keys.sort(function (a, b) {
          a = a.slice(6);
          b = b.slice(6);
          return parseInt(a) - parseInt(b);
        });
      } else {
        self._hasImages = false;

        if (paella.player.selectedProfile == self._blackBoardProfile) {
          let defaultprofile = paella.player.config.defaultProfile;
          paella.player.setProfile(defaultprofile);
        }
      } //NEXT


      this._next = 0;
      this._prev = 0;

      if (paella.player.selectedProfile == self._blackBoardProfile) {
        self.createOverlay();
        self._active = true;
      }

      self._mousePos = {};
      paella.Profiles.loadProfile(self._blackBoardProfile, function (profileData) {
        self._containerRect = profileData.blackBoardImages;
      });
    }

    createLens() {
      var self = this;

      if (self._currentZoom == null) {
        self._currentZoom = self._zoom;
      }

      var lens = document.createElement("div");
      lens.className = "lensClass";
      self._lensDIV = lens;
      var p = $('.conImg').offset();
      var width = $('.conImg').width();
      var height = $('.conImg').height();
      lens.style.width = width / (self._currentZoom / 100) + "px";
      lens.style.height = height / (self._currentZoom / 100) + "px";
      self._lensWidth = parseInt(lens.style.width);
      self._lensHeight = parseInt(lens.style.height);
      $(self._lensContainer).append(lens);
      $(self._lensContainer).mousemove(function (event) {
        let mouseX = event.pageX - p.left;
        let mouseY = event.pageY - p.top;
        self._mousePos.x = mouseX;
        self._mousePos.y = mouseY;
        let lensTop = mouseY - self._lensHeight / 2;
        lensTop = lensTop < 0 ? 0 : lensTop;
        lensTop = lensTop > height - self._lensHeight ? height - self._lensHeight : lensTop;
        let lensLeft = mouseX - self._lensWidth / 2;
        lensLeft = lensLeft < 0 ? 0 : lensLeft;
        lensLeft = lensLeft > width - self._lensWidth ? width - self._lensWidth : lensLeft;
        self._lensDIV.style.left = lensLeft + "px";
        self._lensDIV.style.top = lensTop + "px";

        if (self._currentZoom != 100) {
          let x = lensLeft * 100 / (width - self._lensWidth);
          let y = lensTop * 100 / (height - self._lensHeight);
          self._blackBoardDIV.style.backgroundPosition = x.toString() + '% ' + y.toString() + '%';
        } else if (self._currentZoom == 100) {
          var xRelative = mouseX * 100 / width;
          var yRelative = mouseY * 100 / height;
          self._blackBoardDIV.style.backgroundPosition = xRelative.toString() + '% ' + yRelative.toString() + '%';
        }

        self._blackBoardDIV.style.backgroundSize = self._currentZoom + '%';
      });
      $(self._lensContainer).bind('wheel mousewheel', function (e) {
        let delta;

        if (e.originalEvent.wheelDelta !== undefined) {
          delta = e.originalEvent.wheelDelta;
        } else {
          delta = e.originalEvent.deltaY * -1;
        }

        if (delta > 0 && self._currentZoom < self._maxZoom) {
          self.reBuildLens(10);
        } else if (self._currentZoom > 100) {
          self.reBuildLens(-10);
        } else if (self._currentZoom == 100) {
          self._lensDIV.style.left = 0 + "px";
          self._lensDIV.style.top = 0 + "px";
        }

        self._blackBoardDIV.style.backgroundSize = self._currentZoom + "%";
      });
    }

    reBuildLens(zoomValue) {
      var self = this;
      self._currentZoom += zoomValue;
      var p = $('.conImg').offset();
      var width = $('.conImg').width();
      var height = $('.conImg').height();
      self._lensDIV.style.width = width / (self._currentZoom / 100) + "px";
      self._lensDIV.style.height = height / (self._currentZoom / 100) + "px";
      self._lensWidth = parseInt(self._lensDIV.style.width);
      self._lensHeight = parseInt(self._lensDIV.style.height);

      if (self._currentZoom != 100) {
        let mouseX = self._mousePos.x;
        let mouseY = self._mousePos.y;
        let lensTop = mouseY - self._lensHeight / 2;
        lensTop = lensTop < 0 ? 0 : lensTop;
        lensTop = lensTop > height - self._lensHeight ? height - self._lensHeight : lensTop;
        let lensLeft = mouseX - self._lensWidth / 2;
        lensLeft = lensLeft < 0 ? 0 : lensLeft;
        lensLeft = lensLeft > width - self._lensWidth ? width - self._lensWidth : lensLeft;
        self._lensDIV.style.left = lensLeft + "px";
        self._lensDIV.style.top = lensTop + "px";
        let x = lensLeft * 100 / (width - self._lensWidth);
        let y = lensTop * 100 / (height - self._lensHeight);
        self._blackBoardDIV.style.backgroundPosition = x.toString() + '% ' + y.toString() + '%';
      }
    }

    destroyLens() {
      var self = this;

      if (self._lensDIV) {
        $(self._lensDIV).remove();
        self._blackBoardDIV.style.backgroundSize = 100 + '%';
        self._blackBoardDIV.style.opacity = 0;
      } //self._currentZoom = self._zoom;

    }

    createOverlay() {
      var self = this;
      var blackBoardDiv = document.createElement("div");
      blackBoardDiv.className = "blackBoardDiv";
      self._blackBoardDIV = blackBoardDiv;
      self._blackBoardDIV.style.opacity = 0;
      var lensContainer = document.createElement("div");
      lensContainer.className = "lensContainer";
      self._lensContainer = lensContainer;
      var conImg = document.createElement("img");
      conImg.className = "conImg";
      self._conImg = conImg;

      if (self._currentImage) {
        self._conImg.src = self._currentImage;
        $(self._blackBoardDIV).css('background-image', 'url(' + self._currentImage + ')');
      }

      $(lensContainer).append(conImg);
      $(self._lensContainer).mouseenter(function () {
        self.createLens();
        self._blackBoardDIV.style.opacity = 1.0;
      });
      $(self._lensContainer).mouseleave(function () {
        self.destroyLens();
      });
      setTimeout(function () {
        // TIMER FOR NICE VIEW
        let overlayContainer = paella.player.videoContainer.overlayContainer;
        overlayContainer.addElement(blackBoardDiv, overlayContainer.getVideoRect(0));
        overlayContainer.addElement(lensContainer, self._containerRect);
      }, self._creationTimer);
    }

    destroyOverlay() {
      var self = this;

      if (self._blackBoardDIV) {
        $(self._blackBoardDIV).remove();
      }

      if (self._lensContainer) {
        $(self._lensContainer).remove();
      }
    }

    imageUpdate(event, params) {
      var self = this;
      var sec = Math.round(params.currentTime);
      var src = $(self._blackBoardDIV).css('background-image');

      if ($(self._blackBoardDIV).length > 0) {
        if (self._zImages.hasOwnProperty("frame_" + sec)) {
          // SWAP IMAGES WHEN PLAYING
          if (src == self._zImages["frame_" + sec]) {
            return;
          } else {
            src = self._zImages["frame_" + sec];
          }
        } else if (sec > self._next || sec < self._prev) {
          src = self.returnSrc(sec);
        } // RELOAD IF OUT OF INTERVAL
        else {
            return;
          } //PRELOAD NEXT IMAGE


        var image = new Image();

        image.onload = function () {
          $(self._blackBoardDIV).css('background-image', 'url(' + src + ')'); // UPDATING IMAGE
        };

        image.src = src;
        self._currentImage = src;
        self._conImg.src = self._currentImage;
      }
    }

    returnSrc(sec) {
      var prev = 0;

      for (let i = 0; i < this._keys.length; i++) {
        var id = parseInt(this._keys[i].slice(6));
        var lastId = parseInt(this._keys[this._keys.length - 1].slice(6));

        if (sec < id) {
          // PREVIOUS IMAGE
          this._next = id;
          this._prev = prev;
          this._imageNumber = i - 1;
          return this._zImages["frame_" + prev]; // return previous and keep next change
        } else if (sec > lastId && sec < this._videoLength) {
          // LAST INTERVAL
          this._next = this._videoLength;
          this._prev = lastId;
          return this._zImages["frame_" + prev];
        } else {
          prev = id;
        }
      }
    }

  };
});
paella.addPlugin(() => {
  return class BreaksPlayerPlugin extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.breaksPlayerPlugin";
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    setup() {
      this.breaks = [];
      this.status = false;
      this.lastTime = 0;
      paella.data.read('breaks', {
        id: paella.player.videoIdentifier
      }, data => {
        if (data && typeof data == 'object' && data.breaks && data.breaks.length > 0) {
          this.breaks = data.breaks;
        }
      });
    }

    getEvents() {
      return [paella.events.timeUpdate];
    }

    onEvent(eventType, params) {
      paella.player.videoContainer.currentTime(true).then(currentTime => {
        // The event type checking must to be done using the time difference, because
        // the timeUpdate event may arrive before the seekToTime event
        let diff = Math.abs(currentTime - this.lastTime);
        this.checkBreaks(currentTime, diff >= 1 ? paella.events.seekToTime : paella.events.timeUpdate);
        this.lastTime = currentTime;
      });
    }

    checkBreaks(currentTime, eventType) {
      let breakMessage = "";

      if (this.breaks.some(breakItem => {
        if (breakItem.s <= currentTime && breakItem.e >= currentTime) {
          if (eventType == paella.events.timeUpdate && !this.status) {
            this.skipTo(breakItem.e);
          }

          breakMessage = breakItem.text;
          return true;
        }
      })) {
        this.showMessage(breakMessage);
        this.status = true;
      } else {
        this.hideMessage();
        this.status = false;
      }
    }

    skipTo(time) {
      paella.player.videoContainer.trimming().then(trimming => {
        if (trimming.enabled) {
          paella.player.videoContainer.seekToTime(time + trimming.start);
        } else {
          paella.player.videoContainer.seekToTime(time);
        }
      });
    }

    showMessage(text) {
      if (this.currentText != text) {
        if (this.messageContainer) {
          paella.player.videoContainer.overlayContainer.removeElement(this.messageContainer);
        }

        var rect = {
          left: 100,
          top: 350,
          width: 1080,
          height: 40
        };
        this.currentText = text;
        this.messageContainer = paella.player.videoContainer.overlayContainer.addText(paella.dictionary.translate(text), rect);
        this.messageContainer.className = 'textBreak';
        this.currentText = text;
      }
    }

    hideMessage() {
      if (this.messageContainer) {
        paella.player.videoContainer.overlayContainer.removeElement(this.messageContainer);
        this.messageContainer = null;
      }

      this.currentText = "";
    }

  };
});
paella.addPlugin(function () {
  /////////////////////////////////////////////////
  // DFXP Parser
  /////////////////////////////////////////////////
  return class DFXPParserPlugin extends paella.CaptionParserPlugIn {
    get ext() {
      return ["dfxp"];
    }

    getName() {
      return "es.upv.paella.captions.DFXPParserPlugin";
    }

    parse(content, lang, next) {
      var captions = [];
      var self = this;
      var xml = $(content);
      var g_lang = xml.attr("xml:lang");
      var lls = xml.find("div");

      for (var idx = 0; idx < lls.length; ++idx) {
        var ll = $(lls[idx]);
        var l_lang = ll.attr("xml:lang");

        if (l_lang == undefined || l_lang == "") {
          if (g_lang == undefined || g_lang == "") {
            base.log.debug("No xml:lang found! Using '" + lang + "' lang instead.");
            l_lang = lang;
          } else {
            l_lang = g_lang;
          }
        } //


        if (l_lang == lang) {
          ll.find("p").each(function (i, cap) {
            var c = {
              id: i,
              begin: self.parseTimeTextToSeg(cap.getAttribute("begin")),
              end: self.parseTimeTextToSeg(cap.getAttribute("end")),
              content: $(cap).text().trim()
            };
            captions.push(c);
          });
          break;
        }
      }

      if (captions.length > 0) {
        next(false, captions);
      } else {
        next(true);
      }
    }

    parseTimeTextToSeg(ttime) {
      var nseg = 0;
      var segtime = /^([0-9]*([.,][0-9]*)?)s/.test(ttime);

      if (segtime) {
        nseg = parseFloat(RegExp.$1);
      } else {
        var split = ttime.split(":");
        var h = parseInt(split[0]);
        var m = parseInt(split[1]);
        var s = parseInt(split[2]);
        nseg = s + m * 60 + h * 60 * 60;
      }

      return nseg;
    }

  };
});
paella.addPlugin(function () {
  return class CaptionsPlugin extends paella.ButtonPlugin {
    getInstanceName() {
      return "captionsPlugin";
    } // plugin instance will be available in paella.plugins.captionsPlugin


    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return 'captionsPluginButton';
    }

    getIconClass() {
      return 'icon-captions';
    }

    getName() {
      return "es.upv.paella.captionsPlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Subtitles");
    }

    getIndex() {
      return 509;
    }

    closeOnMouseOut() {
      return false;
    }

    checkEnabled(onSuccess) {
      this._searchTimerTime = 1500;
      this._searchTimer = null;
      this._pluginButton = null;
      this._open = 0; // 0 closed, 1 st clic;

      this._parent = null;
      this._body = null;
      this._inner = null;
      this._bar = null;
      this._input = null;
      this._select = null;
      this._editor = null;
      this._activeCaptions = null;
      this._lastSel = null;
      this._browserLang = null;
      this._defaultBodyHeight = 280;
      this._autoScroll = true;
      this._searchOnCaptions = null;
      onSuccess(true);
    }

    showUI() {
      if (paella.captions.getAvailableLangs().length >= 1) {
        super.showUI();
      }
    }

    setup() {
      var self = this; // HIDE UI IF NO Captions

      if (!paella.captions.getAvailableLangs().length) {
        paella.plugins.captionsPlugin.hideUI();
      } //BINDS


      paella.events.bind(paella.events.captionsEnabled, function (event, params) {
        self.onChangeSelection(params);
      });
      paella.events.bind(paella.events.captionsDisabled, function (event, params) {
        self.onChangeSelection(params);
      });
      paella.events.bind(paella.events.captionAdded, function (event, params) {
        self.onCaptionAdded(params);
        paella.plugins.captionsPlugin.showUI();
      });
      paella.events.bind(paella.events.timeUpdate, function (event, params) {
        if (self._searchOnCaptions) {
          self.updateCaptionHiglighted(params);
        }
      });
      paella.events.bind(paella.events.controlBarWillHide, function (evt) {
        self.cancelHideBar();
      });
      self._activeCaptions = paella.captions.getActiveCaptions();
      self._searchOnCaptions = self.config.searchOnCaptions || false;
    }

    cancelHideBar() {
      var thisClass = this;

      if (thisClass._open > 0) {
        paella.player.controls.cancelHideBar();
      }
    }

    updateCaptionHiglighted(time) {
      var thisClass = this;
      var sel = null;
      var id = null;

      if (time) {
        paella.player.videoContainer.trimming().then(trimming => {
          let offset = trimming.enabled ? trimming.start : 0;
          let c = paella.captions.getActiveCaptions();
          let caption = c && c.getCaptionAtTime(time.currentTime + offset);
          let id = caption && caption.id;

          if (id != null) {
            sel = $(".bodyInnerContainer[sec-id='" + id + "']");

            if (sel != thisClass._lasSel) {
              $(thisClass._lasSel).removeClass("Highlight");
            }

            if (sel) {
              $(sel).addClass("Highlight");

              if (thisClass._autoScroll) {
                thisClass.updateScrollFocus(id);
              }

              thisClass._lasSel = sel;
            }
          }
        });
      }
    }

    updateScrollFocus(id) {
      var thisClass = this;
      var resul = 0;
      var t = $(".bodyInnerContainer").slice(0, id);
      t = t.toArray();
      t.forEach(function (l) {
        var i = $(l).outerHeight(true);
        resul += i;
      });
      var x = parseInt(resul / 280);
      $(".captionsBody").scrollTop(x * thisClass._defaultBodyHeight);
    }

    onCaptionAdded(obj) {
      var thisClass = this;
      var newCap = paella.captions.getCaptions(obj);
      var defOption = document.createElement("option"); // NO ONE SELECT

      defOption.text = newCap._lang.txt;
      defOption.value = obj;

      thisClass._select.add(defOption);
    }

    changeSelection() {
      var thisClass = this;
      var sel = $(thisClass._select).val();

      if (sel == "") {
        $(thisClass._body).empty();
        paella.captions.setActiveCaptions(sel);
        return;
      } // BREAK IF NO ONE SELECTED


      paella.captions.setActiveCaptions(sel);
      thisClass._activeCaptions = sel;

      if (thisClass._searchOnCaptions) {
        thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
      }

      thisClass.setButtonHideShow();
    }

    onChangeSelection(obj) {
      var thisClass = this;

      if (thisClass._activeCaptions != obj) {
        $(thisClass._body).empty();

        if (obj == undefined) {
          thisClass._select.value = "";
          $(thisClass._input).prop('disabled', true);
        } else {
          $(thisClass._input).prop('disabled', false);
          thisClass._select.value = obj;

          if (thisClass._searchOnCaptions) {
            thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
          }
        }

        thisClass._activeCaptions = obj;
        thisClass.setButtonHideShow();
      }
    }

    action() {
      var self = this;
      self._browserLang = base.dictionary.currentLanguage();
      self._autoScroll = true;

      switch (self._open) {
        case 0:
          if (self._browserLang && paella.captions.getActiveCaptions() == undefined) {
            self.selectDefaultBrowserLang(self._browserLang);
          }

          self._open = 1;
          paella.keyManager.enabled = false;
          break;

        case 1:
          paella.keyManager.enabled = true;
          self._open = 0;
          break;
      }
    }

    buildContent(domElement) {
      var thisClass = this; //captions CONTAINER

      thisClass._parent = document.createElement('div');
      thisClass._parent.className = 'captionsPluginContainer'; //captions BAR

      thisClass._bar = document.createElement('div');
      thisClass._bar.className = 'captionsBar'; //captions BODY

      if (thisClass._searchOnCaptions) {
        thisClass._body = document.createElement('div');
        thisClass._body.className = 'captionsBody';

        thisClass._parent.appendChild(thisClass._body); //BODY JQUERY


        $(thisClass._body).scroll(function () {
          thisClass._autoScroll = false;
        }); //INPUT

        thisClass._input = document.createElement("input");
        thisClass._input.className = "captionsBarInput";
        thisClass._input.type = "text";
        thisClass._input.id = "captionsBarInput";
        thisClass._input.name = "captionsString";
        thisClass._input.placeholder = base.dictionary.translate("Search captions");

        thisClass._bar.appendChild(thisClass._input); //INPUT jQuery


        $(thisClass._input).change(function () {
          var text = $(thisClass._input).val();
          thisClass.doSearch(text);
        });
        $(thisClass._input).keyup(function () {
          var text = $(thisClass._input).val();

          if (thisClass._searchTimer != null) {
            thisClass._searchTimer.cancel();
          }

          thisClass._searchTimer = new base.Timer(function (timer) {
            thisClass.doSearch(text);
          }, thisClass._searchTimerTime);
        });
      } //SELECT


      thisClass._select = document.createElement("select");
      thisClass._select.className = "captionsSelector";
      var defOption = document.createElement("option"); // NO ONE SELECT

      defOption.text = base.dictionary.translate("None");
      defOption.value = "";

      thisClass._select.add(defOption);

      paella.captions.getAvailableLangs().forEach(function (l) {
        var option = document.createElement("option");
        option.text = l.lang.txt;
        option.value = l.id;

        thisClass._select.add(option);
      });

      thisClass._bar.appendChild(thisClass._select);

      thisClass._parent.appendChild(thisClass._bar); //jQuery SELECT


      $(thisClass._select).change(function () {
        thisClass.changeSelection();
      }); //BUTTON EDITOR

      thisClass._editor = document.createElement("button");
      thisClass._editor.className = "editorButton";
      thisClass._editor.innerText = "";

      thisClass._bar.appendChild(thisClass._editor); //BUTTON jQuery


      $(thisClass._editor).prop("disabled", true);
      $(thisClass._editor).click(function () {
        var c = paella.captions.getActiveCaptions();
        paella.userTracking.log("paella:caption:edit", {
          id: c._captionsProvider + ':' + c._id,
          lang: c._lang
        });
        c.goToEdit();
      });
      domElement.appendChild(thisClass._parent);
    }

    selectDefaultBrowserLang(code) {
      var thisClass = this;
      var provider = null;
      paella.captions.getAvailableLangs().forEach(function (l) {
        if (l.lang.code == code) {
          provider = l.id;
        }
      });

      if (provider) {
        paella.captions.setActiveCaptions(provider);
      }
      /*
      else{
      	$(thisClass._input).prop("disabled",true);
      }
      */

    }

    doSearch(text) {
      var thisClass = this;
      var c = paella.captions.getActiveCaptions();

      if (c) {
        if (text == "") {
          thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
        } else {
          c.search(text, function (err, resul) {
            if (!err) {
              thisClass.buildBodyContent(resul, "search");
            }
          });
        }
      }
    }

    setButtonHideShow() {
      var thisClass = this;
      var editor = $('.editorButton');
      var c = paella.captions.getActiveCaptions();
      var res = null;

      if (c != null) {
        $(thisClass._select).width('39%');
        c.canEdit(function (err, r) {
          res = r;
        });

        if (res) {
          $(editor).prop("disabled", false);
          $(editor).show();
        } else {
          $(editor).prop("disabled", true);
          $(editor).hide();
          $(thisClass._select).width('47%');
        }
      } else {
        $(editor).prop("disabled", true);
        $(editor).hide();
        $(thisClass._select).width('47%');
      }

      if (!thisClass._searchOnCaptions) {
        if (res) {
          $(thisClass._select).width('92%');
        } else {
          $(thisClass._select).width('100%');
        }
      }
    }

    buildBodyContent(obj, type) {
      paella.player.videoContainer.trimming().then(trimming => {
        var thisClass = this;
        $(thisClass._body).empty();
        obj.forEach(function (l) {
          if (trimming.enabled && (l.end < trimming.start || l.begin > trimming.end)) {
            return;
          }

          thisClass._inner = document.createElement('div');
          thisClass._inner.className = 'bodyInnerContainer';
          thisClass._inner.innerText = l.content;

          if (type == "list") {
            thisClass._inner.setAttribute('sec-begin', l.begin);

            thisClass._inner.setAttribute('sec-end', l.end);

            thisClass._inner.setAttribute('sec-id', l.id);

            thisClass._autoScroll = true;
          }

          if (type == "search") {
            thisClass._inner.setAttribute('sec-begin', l.time);
          }

          thisClass._body.appendChild(thisClass._inner); //JQUERY


          $(thisClass._inner).hover(function () {
            $(this).css('background-color', 'rgba(250, 161, 102, 0.5)');
          }, function () {
            $(this).removeAttr('style');
          });
          $(thisClass._inner).click(function () {
            var secBegin = $(this).attr("sec-begin");
            paella.player.videoContainer.trimming().then(trimming => {
              let offset = trimming.enabled ? trimming.start : 0;
              paella.player.videoContainer.seekToTime(secBegin - offset + 0.1);
            });
          });
        });
      });
    }

  };
});
paella.addPlugin(function () {
  return class CaptionsOnScreen extends paella.EventDrivenPlugin {
    checkEnabled(onSuccess) {
      this.containerId = 'paella_plugin_CaptionsOnScreen';
      this.container = null;
      this.innerContainer = null;
      this.top = null;
      this.actualPos = null;
      this.lastEvent = null;
      this.controlsPlayback = null;
      this.captions = false;
      this.captionProvider = null;
      onSuccess(!paella.player.isLiveStream());
    }

    setup() {}

    getEvents() {
      return [paella.events.controlBarDidHide, paella.events.resize, paella.events.controlBarDidShow, paella.events.captionsEnabled, paella.events.captionsDisabled, paella.events.timeUpdate];
    }

    onEvent(eventType, params) {
      var thisClass = this;

      switch (eventType) {
        case paella.events.controlBarDidHide:
          if (thisClass.lastEvent == eventType || thisClass.captions == false) break;
          thisClass.moveCaptionsOverlay("down");
          break;

        case paella.events.resize:
          if (thisClass.captions == false) break;

          if (paella.player.controls.isHidden()) {
            thisClass.moveCaptionsOverlay("down");
          } else {
            thisClass.moveCaptionsOverlay("top");
          }

          break;

        case paella.events.controlBarDidShow:
          if (thisClass.lastEvent == eventType || thisClass.captions == false) break;
          thisClass.moveCaptionsOverlay("top");
          break;

        case paella.events.captionsEnabled:
          thisClass.buildContent(params);
          thisClass.captions = true;

          if (paella.player.controls.isHidden()) {
            thisClass.moveCaptionsOverlay("down");
          } else {
            thisClass.moveCaptionsOverlay("top");
          }

          break;

        case paella.events.captionsDisabled:
          thisClass.hideContent();
          thisClass.captions = false;
          break;

        case paella.events.timeUpdate:
          if (thisClass.captions) {
            thisClass.updateCaptions(params);
          }

          break;
      }

      thisClass.lastEvent = eventType;
    }

    buildContent(provider) {
      var thisClass = this;
      thisClass.captionProvider = provider;

      if (thisClass.container == null) {
        // PARENT
        thisClass.container = document.createElement('div');
        thisClass.container.className = "CaptionsOnScreen";
        thisClass.container.id = thisClass.containerId;
        thisClass.innerContainer = document.createElement('div');
        thisClass.innerContainer.className = "CaptionsOnScreenInner";
        thisClass.container.appendChild(thisClass.innerContainer);
        if (thisClass.controlsPlayback == null) thisClass.controlsPlayback = $('#playerContainer_controls_playback');
        paella.player.videoContainer.domElement.appendChild(thisClass.container);
      } else {
        $(thisClass.container).show();
      }
    }

    updateCaptions(time) {
      if (this.captions) {
        paella.player.videoContainer.trimming().then(trimming => {
          let offset = trimming.enabled ? trimming.start : 0;
          var c = paella.captions.getActiveCaptions();
          var caption = c.getCaptionAtTime(time.currentTime + offset);

          if (caption) {
            $(this.container).show();
            this.innerContainer.innerText = caption.content;
            this.moveCaptionsOverlay("auto");
          } else {
            this.innerContainer.innerText = "";
            this.hideContent();
          }
        });
      }
    }

    hideContent() {
      var thisClass = this;
      $(thisClass.container).hide();
    }

    moveCaptionsOverlay(pos) {
      var thisClass = this;
      var marginbottom = 10;
      if (thisClass.controlsPlayback == null) thisClass.controlsPlayback = $('#playerContainer_controls_playback');

      if (pos == "auto" || pos == undefined) {
        pos = paella.player.controls.isHidden() ? "down" : "top";
      }

      if (pos == "down") {
        var t = thisClass.container.offsetHeight;
        t -= thisClass.innerContainer.offsetHeight + marginbottom;
        thisClass.innerContainer.style.bottom = 0 - t + "px";
      }

      if (pos == "top") {
        var t2 = thisClass.controlsPlayback.offset().top;
        t2 -= thisClass.innerContainer.offsetHeight + marginbottom;
        thisClass.innerContainer.style.bottom = 0 - t2 + "px";
      }
    }

    getIndex() {
      return 1050;
    }

    getName() {
      return "es.upv.paella.overlayCaptionsPlugin";
    }

  };
});
(() => {
  function buildChromaVideoCanvas(stream, canvas) {
    class ChromaVideoCanvas extends bg.app.WindowController {
      constructor(stream) {
        super();
        this.stream = stream;
        this._chroma = bg.Color.White();
        this._crop = new bg.Vector4(0.3, 0.01, 0.3, 0.01);
        this._transform = bg.Matrix4.Identity().translate(0.6, -0.04, 0);
        this._bias = 0.01;
      }

      get chroma() {
        return this._chroma;
      }

      get bias() {
        return this._bias;
      }

      get crop() {
        return this._crop;
      }

      get transform() {
        return this._transform;
      }

      set chroma(c) {
        this._chroma = c;
      }

      set bias(b) {
        this._bias = b;
      }

      set crop(c) {
        this._crop = c;
      }

      set transform(t) {
        this._transform = t;
      }

      get video() {
        return this.texture ? this.texture.video : null;
      }

      loaded() {
        return new Promise(resolve => {
          let checkLoaded = () => {
            if (this.video) {
              resolve(this);
            } else {
              setTimeout(checkLoaded, 100);
            }
          };

          checkLoaded();
        });
      }

      buildShape() {
        this.plist = new bg.base.PolyList(this.gl);
        this.plist.vertex = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0];
        this.plist.texCoord0 = [0, 0, 1, 0, 1, 1, 0, 1];
        this.plist.index = [0, 1, 2, 2, 3, 0];
        this.plist.build();
      }

      buildShader() {
        let vshader = `
						attribute vec4 position;
						attribute vec2 texCoord;
						uniform mat4 inTransform;
						varying vec2 vTexCoord;
						void main() {
							gl_Position = inTransform * position;
							vTexCoord = texCoord;
						}
					`;
        let fshader = `
						precision mediump float;
						varying vec2 vTexCoord;
						uniform sampler2D inTexture;
						uniform vec4 inChroma;
						uniform float inBias;
						uniform vec4 inCrop;
						void main() {
							vec4 result = texture2D(inTexture,vTexCoord);
							
							if ((result.r>=inChroma.r-inBias && result.r<=inChroma.r+inBias &&
								result.g>=inChroma.g-inBias && result.g<=inChroma.g+inBias &&
								result.b>=inChroma.b-inBias && result.b<=inChroma.b+inBias) ||
								(vTexCoord.x<inCrop.x || vTexCoord.x>inCrop.z || vTexCoord.y<inCrop.w || vTexCoord.y>inCrop.y)
							)
							{
								discard;
							}
							else {
								gl_FragColor = result;
							}
						}
					`;
        this.shader = new bg.base.Shader(this.gl);
        this.shader.addShaderSource(bg.base.ShaderType.VERTEX, vshader);
        this.shader.addShaderSource(bg.base.ShaderType.FRAGMENT, fshader);
        status = this.shader.link();

        if (!this.shader.status) {
          console.log(this.shader.compileError);
          console.log(this.shader.linkError);
        }

        this.shader.initVars(["position", "texCoord"], ["inTransform", "inTexture", "inChroma", "inBias", "inCrop"]);
      }

      init() {
        // Use WebGL V1 engine
        bg.Engine.Set(new bg.webgl1.Engine(this.gl));
        bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
        this.buildShape();
        this.buildShader();
        this.pipeline = new bg.base.Pipeline(this.gl);
        bg.base.Pipeline.SetCurrent(this.pipeline);
        this.pipeline.clearColor = bg.Color.Transparent();
        bg.base.Loader.Load(this.gl, this.stream.src).then(texture => {
          this.texture = texture;
        });
      }

      frame(delta) {
        if (this.texture) {
          this.texture.update();
        }
      }

      display() {
        this.pipeline.clearBuffers(bg.base.ClearBuffers.COLOR | bg.base.ClearBuffers.DEPTH);

        if (this.texture) {
          this.shader.setActive();
          this.shader.setInputBuffer("position", this.plist.vertexBuffer, 3);
          this.shader.setInputBuffer("texCoord", this.plist.texCoord0Buffer, 2);
          this.shader.setMatrix4("inTransform", this.transform);
          this.shader.setTexture("inTexture", this.texture || bg.base.TextureCache.WhiteTexture(this.gl), bg.base.TextureUnit.TEXTURE_0);
          this.shader.setVector4("inChroma", this.chroma);
          this.shader.setValueFloat("inBias", this.bias);
          this.shader.setVector4("inCrop", new bg.Vector4(this.crop.x, 1.0 - this.crop.y, 1.0 - this.crop.z, this.crop.w));
          this.plist.draw();
          this.shader.disableInputBuffer("position");
          this.shader.disableInputBuffer("texCoord");
          this.shader.clearActive();
        }
      }

      reshape(width, height) {
        let canvas = this.canvas.domElement;
        canvas.width = width;
        canvas.height = height;
        this.pipeline.viewport = new bg.Viewport(0, 0, width, height);
      }

      mouseMove(evt) {
        this.postRedisplay();
      }

    }

    let controller = new ChromaVideoCanvas(stream);
    let mainLoop = bg.app.MainLoop.singleton;
    mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
    mainLoop.canvas = canvas;
    mainLoop.run(controller);
    return controller.loaded();
  }

  class ChromaVideo extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height, streamName) {
      super(id, stream, 'canvas', left, top, width, height);
      this._posterFrame = null;
      this._currentQuality = null;
      this._autoplay = false;
      this._streamName = null;
      this._streamName = streamName || 'chroma';
      var This = this;

      if (this._stream.sources[this._streamName]) {
        this._stream.sources[this._streamName].sort(function (a, b) {
          return a.res.h - b.res.h;
        });
      }

      this.video = null;

      function onProgress(event) {
        if (!This._ready && This.video.readyState == 4) {
          This._ready = true;

          if (This._initialCurrentTipe !== undefined) {
            This.video.currentTime = This._initialCurrentTime;
            delete This._initialCurrentTime;
          }

          This._callReadyEvent();
        }
      }

      function evtCallback(event) {
        onProgress.apply(This, event);
      }

      function onUpdateSize() {
        if (This.canvasController) {
          let canvas = This.canvasController.canvas.domElement;
          This.canvasController.reshape($(canvas).width(), $(canvas).height());
        }
      }

      let timer = new paella.Timer(function (timer) {
        onUpdateSize();
      }, 500);
      timer.repeat = true;
    }

    defaultProfile() {
      return 'chroma';
    }

    _setVideoElem(video) {
      $(this.video).bind('progress', evtCallback);
      $(this.video).bind('loadstart', evtCallback);
      $(this.video).bind('loadedmetadata', evtCallback);
      $(this.video).bind('canplay', evtCallback);
      $(this.video).bind('oncanplay', evtCallback);
    }

    _loadDeps() {
      return new Promise((resolve, reject) => {
        if (!window.$paella_bg2e) {
          paella.require(paella.baseUrl + 'javascript/bg2e-es2015.js').then(() => {
            window.$paella_bg2e = bg;
            resolve(window.$paella_bg2e);
          }).catch(err => {
            console.error(err.message);
            reject();
          });
        } else {
          defer.resolve(window.$paella_bg2e);
        }
      });
    }

    _deferredAction(action) {
      return new Promise((resolve, reject) => {
        if (this.video) {
          resolve(action());
        } else {
          $(this.video).bind('canplay', () => {
            this._ready = true;
            resolve(action());
          });
        }
      });
    }

    _getQualityObject(index, s) {
      return {
        index: index,
        res: s.res,
        src: s.src,
        toString: function () {
          return this.res.w + "x" + this.res.h;
        },
        shortLabel: function () {
          return this.res.h + "p";
        },
        compare: function (q2) {
          return this.res.w * this.res.h - q2.res.w * q2.res.h;
        }
      };
    } // Initialization functions


    allowZoom() {
      return false;
    }

    getVideoData() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._deferredAction(() => {
          resolve({
            duration: This.video.duration,
            currentTime: This.video.currentTime,
            volume: This.video.volume,
            paused: This.video.paused,
            ended: This.video.ended,
            res: {
              w: This.video.videoWidth,
              h: This.video.videoHeight
            }
          });
        });
      });
    }

    setPosterFrame(url) {
      this._posterFrame = url;
    }

    setAutoplay(auto) {
      this._autoplay = auto;

      if (auto && this.video) {
        this.video.setAttribute("autoplay", auto);
      }
    }

    load() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._loadDeps().then(() => {
          var sources = this._stream.sources[this._streamName];

          if (this._currentQuality === null && this._videoQualityStrategy) {
            this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
          }

          var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
          this.video = null;
          this.domElement.parentNode.style.backgroundColor = "transparent";

          if (stream) {
            this.canvasController = null;
            buildChromaVideoCanvas(stream, this.domElement).then(canvasController => {
              this.canvasController = canvasController;
              this.video = canvasController.video;
              this.video.pause();

              if (stream.crop) {
                this.canvasController.crop = new bg.Vector4(stream.crop.left, stream.crop.top, stream.crop.right, stream.crop.bottom);
              }

              if (stream.displacement) {
                this.canvasController.transform = bg.Matrix4.Translation(stream.displacement.x, stream.displacement.y, 0);
              }

              if (stream.chromaColor) {
                this.canvasController.chroma = new bg.Color(stream.chromaColor[0], stream.chromaColor[1], stream.chromaColor[2], stream.chromaColor[3]);
              }

              if (stream.chromaBias) {
                this.canvasController.bias = stream.chromaBias;
              }

              resolve(stream);
            });
          } else {
            reject(new Error("Could not load video: invalid quality stream index"));
          }
        });
      });
    }

    getQualities() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          var sources = this._stream.sources[this._streamName];
          var index = -1;
          sources.forEach(s => {
            index++;
            result.push(this._getQualityObject(index, s));
          });
          resolve(result);
        }, 10);
      });
    }

    setQuality(index) {
      return new Promise(resolve => {
        var paused = this.video.paused;
        var sources = this._stream.sources[this._streamName];
        this._currentQuality = index < sources.length ? index : 0;
        var currentTime = this.video.currentTime;
        this.freeze().then(() => {
          this._ready = false;
          return this.load();
        }).then(() => {
          if (!paused) {
            this.play();
          }

          $(this.video).on('seeked', () => {
            this.unFreeze();
            resolve();
            $(this.video).off('seeked');
          });
          this.video.currentTime = currentTime;
        });
      });
    }

    getCurrentQuality() {
      return new Promise(resolve => {
        resolve(this._getQualityObject(this._currentQuality, this._stream.sources[this._streamName][this._currentQuality]));
      });
    }

    play() {
      return this._deferredAction(() => {
        bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.AUTO;
        this.video.play();
      });
    }

    pause() {
      return this._deferredAction(() => {
        bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.MANUAL;
        this.video.pause();
      });
    }

    isPaused() {
      return this._deferredAction(() => {
        return this.video.paused;
      });
    }

    duration() {
      return this._deferredAction(() => {
        return this.video.duration;
      });
    }

    setCurrentTime(time) {
      return this._deferredAction(() => {
        this.video.currentTime = time;
        $(this.video).on('seeked', () => {
          this.canvasController.postRedisplay();
          $(this.video).off('seeked');
        });
      });
    }

    currentTime() {
      return this._deferredAction(() => {
        return this.video.currentTime;
      });
    }

    setVolume(volume) {
      return this._deferredAction(() => {
        this.video.volume = volume;
      });
    }

    volume() {
      return this._deferredAction(() => {
        return this.video.volume;
      });
    }

    setPlaybackRate(rate) {
      return this._deferredAction(() => {
        this.video.playbackRate = rate;
      });
    }

    playbackRate() {
      return this._deferredAction(() => {
        return this.video.playbackRate;
      });
    }

    goFullScreen() {
      return this._deferredAction(() => {
        var elem = this.video;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      });
    }

    unFreeze() {
      return this._deferredAction(() => {
        var c = document.getElementById(this.video.className + "canvas");
        $(c).remove();
      });
    }

    freeze() {
      var This = this;
      return this._deferredAction(function () {});
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.ChromaVideo = ChromaVideo;

  class ChromaVideoFactory extends paella.VideoFactory {
    isStreamCompatible(streamData) {
      try {
        if (paella.ChromaVideo._loaded) {
          return false;
        }

        if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
          return false;
        }

        for (var key in streamData.sources) {
          if (key == 'chroma') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      paella.ChromaVideo._loaded = true;
      ++paella.videoFactories.Html5VideoFactory.s_instances;
      return new paella.ChromaVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.ChromaVideoFactory = ChromaVideoFactory;
})();
/*
paella.addPlugin(function() {
	return class CommentsPlugin extends paella.TabBarPlugin {
		get divPublishComment() { return this._divPublishComment; }
		set divPublishComment(v) { this._divPublishComment = v; }
		get divComments() { return this._divComments; }
		set divComments(v) { this._divComments = v; }
		get publishCommentTextArea() { return this._publishCommentTextArea; }
		set publishCommentTextArea(v) { this._publishCommentTextArea = v; }
		get publishCommentButtons() { return this._publishCommentButtons; }
		set publishCommentButtons(v) { this._publishCommentButtons = v; }
		get canPublishAComment() { return this._canPublishAComment; }
		set canPublishAComment(v) { this._canPublishAComment = v; }
		get comments() { return this._comments; }
		set comments(v) { this._comments = v; }
		get commentsTree() { return this._commentsTree; }
		set commentsTree(v) { this._commentsTree = v; }
		get domElement() { return this._domElement; }
		set domElement(v) { this._domElement = v; }
	
		getSubclass() { return "showCommentsTabBar"; }
		getName() { return "es.upv.paella.commentsPlugin"; }
		getTabName() { return base.dictionary.translate("Comments"); }
		checkEnabled(onSuccess) { onSuccess(true); }
		getIndex() { return 40; }
		getDefaultToolTip() { return base.dictionary.translate("Comments"); }
						
		action(tab) {
			this.loadContent();
		}
				
		buildContent(domElement) {
			this.domElement = domElement;
			this.canPublishAComment = paella.initDelegate.initParams.accessControl.permissions.canWrite;
			this.loadContent();
		}
					
		loadContent() {
			this.divRoot = this.domElement;
			this.divRoot.innerText ="";
			
			this.divPublishComment = document.createElement('div');
			this.divPublishComment.className = 'CommentPlugin_Publish';
			this.divPublishComment.id = 'CommentPlugin_Publish';

			this.divComments = document.createElement('div'); 
			this.divComments.className = 'CommentPlugin_Comments';
			this.divComments.id = 'CommentPlugin_Comments';

			if(this.canPublishAComment){
				this.divRoot.appendChild(this.divPublishComment);
				this.createPublishComment();
			}
			this.divRoot.appendChild(this.divComments);
			
			this.reloadComments();
		}
		
		//Allows the user to write a new comment
		createPublishComment() {
			var thisClass = this;
			var rootID = this.divPublishComment.id+"_entry";
			
			var divEntry;
			divEntry = document.createElement('div');
			divEntry.id = rootID;
			divEntry.className = 'comments_entry';
			
			var divSil;
			divSil = document.createElement('img');
			divSil.className = "comments_entry_silhouette";
			divSil.style.width = "48px";
			divSil.src = paella.initDelegate.initParams.accessControl.userData.avatar;
			divSil.id = rootID+"_silhouette";
			divEntry.appendChild(divSil);
			
			var divTextAreaContainer;
			divTextAreaContainer = document.createElement('div');
			divTextAreaContainer.className = "comments_entry_container";
			divTextAreaContainer.id = rootID+"_textarea_container";
			divEntry.appendChild(divTextAreaContainer);
			
			this.publishCommentTextArea = document.createElement('textarea');
			this.publishCommentTextArea.id = rootID+"_textarea";
			this.publishCommentTextArea.onclick = function(){paella.keyManager.enabled = false;};
			this.publishCommentTextArea.onblur = function(){paella.keyManager.enabled = true;};
			divTextAreaContainer.appendChild(this.publishCommentTextArea);
			
			this.publishCommentButtons = document.createElement('div');
			this.publishCommentButtons.id = rootID+"_buttons_area";
			divTextAreaContainer.appendChild(this.publishCommentButtons);
			
			var btnAddComment;
			btnAddComment = document.createElement('button');
			btnAddComment.id = rootID+"_btnAddComment";
			btnAddComment.className = "publish";
			btnAddComment.onclick = function(){
				var txtValue = thisClass.publishCommentTextArea.value;
				if (txtValue.replace(/\s/g,'') != "") {
					thisClass.addComment();
				}
			};
			btnAddComment.innerText = base.dictionary.translate("Publish");
			
			this.publishCommentButtons.appendChild(btnAddComment);
			
			divTextAreaContainer.commentsTextArea = this.publishCommentTextArea;
			divTextAreaContainer.commentsBtnAddComment = btnAddComment;
			divTextAreaContainer.commentsBtnAddCommentToInstant = this.btnAddCommentToInstant;
			
			this.divPublishComment.appendChild(divEntry);
		}
			
		addComment() {
			var thisClass = this;
			var txtValue = paella.AntiXSS.htmlEscape(thisClass.publishCommentTextArea.value);
			//var txtValue = thisClass.publishCommentTextArea.value;
			var now = new Date();
			
			this.comments.push({
				id: base.uuid(),
				userName:paella.initDelegate.initParams.accessControl.userData.name,
				mode: "normal",
				value: txtValue,
				created: now
			});

			var data = {
				allComments: this.comments
			};
			
			paella.data.write('comments',{id:paella.initDelegate.getId()},data,function(response,status){
				if (status) {thisClass.loadContent();}
			});
		}
		
		addReply(annotationID, domNodeId) {
			var thisClass = this;
			var textArea = document.getElementById(domNodeId);
			var txtValue = paella.AntiXSS.htmlEscape(textArea.value);
			var now = new Date();
			
			paella.keyManager.enabled = true;

			this.comments.push({
				id: base.uuid(),
				userName:paella.initDelegate.initParams.accessControl.userData.name,
				mode: "reply",
				parent: annotationID,
				value: txtValue,
				created: now
			});

			var data = {
				allComments: this.comments
			};
			
			paella.data.write('comments',{id:paella.initDelegate.getId()},data,function(response,status){
				if (status) thisClass.reloadComments();
			});
		}
		
		reloadComments() {     
			var thisClass = this;
			thisClass.commentsTree = [];
			thisClass.comments = [];
			this.divComments.innerText ="";
			
			paella.data.read('comments',{id:paella.initDelegate.getId()},function(data,status) {
				var i;
				var valueText;
				var comment;
				if (data && typeof(data)=='object' && data.allComments && data.allComments.length>0) {
					thisClass.comments = data.allComments;
					var tempDict = {};

					// obtain normal comments  
					for (i =0; i < data.allComments.length; ++i ) {
						valueText = data.allComments[i].value;
													
						if (data.allComments[i].mode !== "reply") { 
							comment = {};
							comment["id"] = data.allComments[i].id;
							comment["userName"] = data.allComments[i].userName;
							comment["mode"] = data.allComments[i].mode;
							comment["value"] = valueText;
							comment["created"] = data.allComments[i].created;
							comment["replies"] = [];    

							thisClass.commentsTree.push(comment); 
							tempDict[comment["id"]] = thisClass.commentsTree.length - 1;
						}
					}
				
					// obtain reply comments
					for (i =0; i < data.allComments.length; ++i ){
						valueText = data.allComments[i].value;

						if (data.allComments[i].mode === "reply") { 
							comment = {};
							comment["id"] = data.allComments[i].id;
							comment["userName"] = data.allComments[i].userName;
							comment["mode"] = data.allComments[i].mode;
							comment["value"] = valueText;
							comment["created"] = data.allComments[i].created;

							var index = tempDict[data.allComments[i].parent];
							thisClass.commentsTree[index]["replies"].push(comment);
						}
					}
					thisClass.displayComments();
				} 
			});
		}
		
		displayComments() {
			var thisClass = this;
			for (var i =0; i < thisClass.commentsTree.length; ++i ){
				var comment = thisClass.commentsTree[i];
				var e = thisClass.createACommentEntry(comment);
				thisClass.divComments.appendChild(e);
			} 
		}
		
		createACommentEntry(comment) {
			var thisClass = this;
			var rootID = this.divPublishComment.id+"_entry"+comment["id"];
			var users;
			
			var divEntry;
			divEntry = document.createElement('div');
			divEntry.id = rootID;
			divEntry.className = "comments_entry";
			
			var divSil;
			divSil = document.createElement('img');
			divSil.className = "comments_entry_silhouette";
			divSil.id = rootID+"_silhouette";

			divEntry.appendChild(divSil);
			
			var divCommentContainer;
			divCommentContainer = document.createElement('div');
			divCommentContainer.className = "comments_entry_container";
			divCommentContainer.id = rootID+"_comment_container";
			divEntry.appendChild(divCommentContainer);
			
			var divCommentMetadata;
			divCommentMetadata = document.createElement('div');
			divCommentMetadata.id = rootID+"_comment_metadata"; 
			divCommentContainer.appendChild(divCommentMetadata);
			
			
			
	//		var datePublish = comment["created"];
			var datePublish = "";
			if (comment["created"]) {
				var dateToday=new Date();
				var dateComment = paella.utils.timeParse.matterhornTextDateToDate(comment["created"]);			
				datePublish = paella.utils.timeParse.secondsToText((dateToday.getTime()-dateComment.getTime())/1000);
			}
			
			// var headLine = "<span class='comments_entry_username'>" + comment["userName"] + "</span>";
			// headLine += "<span class='comments_entry_datepublish'>" + datePublish + "</span>";
			// divCommentMetadata.innerHTML = headLine;
			
			
			var divCommentValue;
			divCommentValue = document.createElement('div');
			divCommentValue.id = rootID+"_comment_value";
			divCommentValue.className = "comments_entry_comment";
			divCommentContainer.appendChild(divCommentValue);		
			
			divCommentValue.innerText = comment["value"];
			
			var divCommentReply = document.createElement('div');
			divCommentReply.id = rootID+"_comment_reply";
			divCommentContainer.appendChild(divCommentReply);
			
			paella.data.read('userInfo',{username:comment["userName"]}, function(data,status) {
				if (data) {
					divSil.src = data.avatar;
					
					var headLine = "<span class='comments_entry_username'>" + data.name + " " + data.lastname + "</span>";
					headLine += "<span class='comments_entry_datepublish'>" + datePublish + "</span>";				
					divCommentMetadata.innerHTML = headLine;
				}
			});

			if (this.canPublishAComment == true) {
				//var btnRplyComment = document.createElement('button');
				var btnRplyComment = document.createElement('div');
				btnRplyComment.className = "reply_button";
				btnRplyComment.innerText = base.dictionary.translate("Reply");
				
				btnRplyComment.id = rootID+"_comment_reply_button";
				btnRplyComment.onclick = function(){
					var e = thisClass.createAReplyEntry(comment["id"]);
					this.style.display="none";
					this.parentElement.parentElement.appendChild(e);
				};
				divCommentReply.appendChild(btnRplyComment);
			}
			
			for (var i =0; i < comment.replies.length; ++i ){
				var e = thisClass.createACommentReplyEntry(comment["id"], comment["replies"][i]);
				divCommentContainer.appendChild(e);
			}
			return divEntry;
		}
		
		createACommentReplyEntry(parentID, comment) {
			var thisClass = this;
			var rootID = this.divPublishComment.id+"_entry_" + parentID + "_reply_" + comment["id"];

			var divEntry;
			divEntry = document.createElement('div');
			divEntry.id = rootID;
			divEntry.className = "comments_entry";
			
			var divSil;
			divSil = document.createElement('img');
			divSil.className = "comments_entry_silhouette";
			divSil.id = rootID+"_silhouette";

			divEntry.appendChild(divSil);
				
			var divCommentContainer;
			divCommentContainer = document.createElement('div');
			divCommentContainer.className = "comments_entry_container";
			divCommentContainer.id = rootID+"_comment_container";
			divEntry.appendChild(divCommentContainer);
				
			var divCommentMetadata;
			divCommentMetadata = document.createElement('div');
			divCommentMetadata.id = rootID+"_comment_metadata"; 
			divCommentContainer.appendChild(divCommentMetadata);
	//		var datePublish = comment["created"];
			var datePublish = "";
			if (comment["created"]) {
				var dateToday=new Date();
				var dateComment = paella.utils.timeParse.matterhornTextDateToDate(comment["created"]);			
				datePublish = paella.utils.timeParse.secondsToText((dateToday.getTime()-dateComment.getTime())/1000);
			}
			
			// var headLine = "<span class='comments_entry_username'>" + comment["userName"] + "</span>";
			// headLine += "<span class='comments_entry_datepublish'>" + datePublish + "</span>";
			// divCommentMetadata.innerHTML = headLine;
			
			var divCommentValue;
			divCommentValue = document.createElement('div');
			divCommentValue.id = rootID+"_comment_value";
			divCommentValue.className = "comments_entry_comment";
			divCommentContainer.appendChild(divCommentValue);		
			
			divCommentValue.innerText = comment["value"];
			
			paella.data.read('userInfo',{username:comment["userName"]}, function(data,status) {
				if (data) {
					divSil.src = data.avatar;
					
					var headLine = "<span class='comments_entry_username'>" + data.name + " " + data.lastname + "</span>";
					headLine += "<span class='comments_entry_datepublish'>" + datePublish + "</span>";				
					divCommentMetadata.innerHTML = headLine;
				}
			});	
				
			return divEntry;
		}
		
		//Allows the user to write a new reply
		createAReplyEntry(annotationID) {
			var thisClass = this;
			var rootID = this.divPublishComment.id+"_entry_" + annotationID + "_reply";

			var divEntry;
			divEntry = document.createElement('div');
			divEntry.id = rootID+"_entry";
			divEntry.className = "comments_entry";
			
			var divSil;
			divSil = document.createElement('img');
			divSil.className = "comments_entry_silhouette";
			divSil.style.width = "48px";		
			divSil.id = rootID+"_silhouette";
			divSil.src = paella.initDelegate.initParams.accessControl.userData.avatar;
			divEntry.appendChild(divSil);
			
			var divCommentContainer;
			divCommentContainer = document.createElement('div');
			divCommentContainer.className = "comments_entry_container comments_reply_container";
			divCommentContainer.id = rootID+"_reply_container";
			divEntry.appendChild(divCommentContainer);
		
			var textArea;
			textArea = document.createElement('textArea');
			textArea.onclick = function(){paella.keyManager.enabled = false;};
			textArea.draggable = false;
			textArea.id = rootID+"_textarea";
			divCommentContainer.appendChild(textArea);
			
			this.publishCommentButtons = document.createElement('div');
			this.publishCommentButtons.id = rootID+"_buttons_area";
			divCommentContainer.appendChild(this.publishCommentButtons);
			
			var btnAddComment;
			btnAddComment = document.createElement('button');
			btnAddComment.id = rootID+"_btnAddComment";
			btnAddComment.className = "publish";
			btnAddComment.onclick = function(){
				var txtValue = textArea.value;
				if (txtValue.replace(/\s/g,'') != "") {
					thisClass.addReply(annotationID,textArea.id);
				}
			};
			btnAddComment.innerText = base.dictionary.translate("Reply");
			
			this.publishCommentButtons.appendChild(btnAddComment);
			
			return divEntry;
		}
	}
});
*/
/*
paella.addPlugin(function() {

	return class DescriptionPlugin extends paella.TabBarPlugin {
		getSubclass() { return "showDescriptionTabBar"; }
		getName() { return "es.upv.paella.descriptionPlugin"; }
		getTabName() { return "Descripción"; }
				
		get domElement() { return this._domElement || null; }
		set domElement(d) { this._domElement = d; }
				
		buildContent(domElement) {
			this.domElement = domElement;
			this.loadContent();
		}
				
		action(tab) {
			this.loadContent();
		}
				
		loadContent() {
			var container = this.domElement;
			container.innerText = "Loading...";
			new paella.Timer(function(t) {
				container.innerText = "Loading done";
			},2000);
		}
	}
})
*/
paella.addPlugin(function () {
  return class extendedTabAdapterPlugin extends paella.ButtonPlugin {
    get currentUrl() {
      return this._currentUrl;
    }

    set currentUrl(v) {
      this._currentUrl = v;
    }

    get currentMaster() {
      return this._currentMaster;
    }

    set currentMaster(v) {
      this._currentMaster = v;
    }

    get currentSlave() {
      return this._currentSlave;
    }

    set currentSlave(v) {
      this._currentSlave = v;
    }

    get availableMasters() {
      return this._availableMasters;
    }

    set availableMasters(v) {
      this._availableMasters = v;
    }

    get availableSlaves() {
      return this._availableSlaves;
    }

    set availableSlaves(v) {
      this._availableSlaves = v;
    }

    get showWidthRes() {
      return this._showWidthRes;
    }

    set showWidthRes(v) {
      this._showWidthRes = v;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "extendedTabAdapterPlugin";
    }

    getIconClass() {
      return 'icon-folder';
    }

    getIndex() {
      return 2030;
    }

    getName() {
      return "es.upv.paella.extendedTabAdapterPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Extended Tab Adapter");
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    buildContent(domElement) {
      domElement.appendChild(paella.extendedAdapter.bottomContainer);
    }

  };
});
paella.addPlugin(function () {
  return class FootPrintsPlugin extends paella.ButtonPlugin {
    get INTERVAL_LENGTH() {
      return this._INTERVAL_LENGTH;
    }

    set INTERVAL_LENGTH(v) {
      this._INTERVAL_LENGTH = v;
    }

    get inPosition() {
      return this._inPosition;
    }

    set inPosition(v) {
      this._inPosition = v;
    }

    get outPosition() {
      return this._outPosition;
    }

    set outPosition(v) {
      this._outPosition = v;
    }

    get canvas() {
      return this._canvas;
    }

    set canvas(v) {
      this._canvas = v;
    }

    get footPrintsTimer() {
      return this._footPrintsTimer;
    }

    set footPrintsTimer(v) {
      this._footPrintsTimer = v;
    }

    get footPrintsData() {
      return this._footPrintsData;
    }

    set footPrintsData(v) {
      this._footPrintsData = v;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "footPrints";
    }

    getIconClass() {
      return 'icon-stats';
    }

    getIndex() {
      return 590;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Show statistics");
    }

    getName() {
      return "es.upv.paella.footprintsPlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.timeLineButton;
    }

    setup() {
      this._INTERVAL_LENGTH = 5;
      var thisClass = this;
      paella.events.bind(paella.events.timeUpdate, function (event) {
        thisClass.onTimeUpdate();
      });

      switch (this.config.skin) {
        case 'custom':
          this.fillStyle = this.config.fillStyle;
          this.strokeStyle = this.config.strokeStyle;
          break;

        case 'dark':
          this.fillStyle = '#727272';
          this.strokeStyle = '#424242';
          break;

        case 'light':
          this.fillStyle = '#d8d8d8';
          this.strokeStyle = '#ffffff';
          break;

        default:
          this.fillStyle = '#d8d8d8';
          this.strokeStyle = '#ffffff';
          break;
      }
    }

    checkEnabled(onSuccess) {
      onSuccess(!paella.player.isLiveStream());
    }

    buildContent(domElement) {
      var container = document.createElement('div');
      container.className = 'footPrintsContainer';
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'footPrintsCanvas';
      this.canvas.className = 'footPrintsCanvas';
      container.appendChild(this.canvas);
      domElement.appendChild(container);
    }

    onTimeUpdate() {
      let currentTime = -1;
      paella.player.videoContainer.currentTime().then(c => {
        currentTime = c;
        return paella.player.videoContainer.trimming();
      }).then(trimming => {
        let videoCurrentTime = Math.round(currentTime + (trimming.enabled ? trimming.start : 0));

        if (this.inPosition <= videoCurrentTime && videoCurrentTime <= this.inPosition + this.INTERVAL_LENGTH) {
          this.outPosition = videoCurrentTime;

          if (this.inPosition + this.INTERVAL_LENGTH === this.outPosition) {
            this.trackFootPrint(this.inPosition, this.outPosition);
            this.inPosition = this.outPosition;
          }
        } else {
          this.trackFootPrint(this.inPosition, this.outPosition);
          this.inPosition = videoCurrentTime;
          this.outPosition = videoCurrentTime;
        }
      });
    }

    trackFootPrint(inPosition, outPosition) {
      var data = {
        "in": inPosition,
        "out": outPosition
      };
      paella.data.write('footprints', {
        id: paella.initDelegate.getId()
      }, data);
    }

    willShowContent() {
      var thisClass = this;
      this.loadFootprints();
      this.footPrintsTimer = new base.Timer(function (timer) {
        thisClass.loadFootprints();
      }, 5000);
      this.footPrintsTimer.repeat = true;
    }

    didHideContent() {
      if (this.footPrintsTimer != null) {
        this.footPrintsTimer.cancel();
        this.footPrintsTimer = null;
      }
    }

    loadFootprints() {
      var thisClass = this;
      paella.data.read('footprints', {
        id: paella.initDelegate.getId()
      }, function (data, status) {
        var footPrintsData = {};
        paella.player.videoContainer.duration().then(function (duration) {
          var trimStart = Math.floor(paella.player.videoContainer.trimStart());
          var lastPosition = -1;
          var lastViews = 0;

          for (var i = 0; i < data.length; i++) {
            var position = data[i].position - trimStart;

            if (position < duration) {
              var views = data[i].views;

              if (position - 1 != lastPosition) {
                for (var j = lastPosition + 1; j < position; j++) {
                  footPrintsData[j] = lastViews;
                }
              }

              footPrintsData[position] = views;
              lastPosition = position;
              lastViews = views;
            }
          }

          thisClass.drawFootPrints(footPrintsData);
        });
      });
    }

    drawFootPrints(footPrintsData) {
      if (this.canvas) {
        var duration = Object.keys(footPrintsData).length;
        var ctx = this.canvas.getContext("2d");
        var h = 20;
        var i;

        for (i = 0; i < duration; ++i) {
          if (footPrintsData[i] > h) {
            h = footPrintsData[i];
          }
        }

        this.canvas.setAttribute("width", duration);
        this.canvas.setAttribute("height", h);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = this.fillStyle; //'#faa166'; //'#9ED4EE';

        ctx.strokeStyle = this.strokeStyle; //'#fa8533'; //"#0000FF";

        ctx.lineWidth = 2;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        for (i = 0; i < duration - 1; ++i) {
          ctx.beginPath();
          ctx.moveTo(i, h);
          ctx.lineTo(i, h - footPrintsData[i]);
          ctx.lineTo(i + 1, h - footPrintsData[i + 1]);
          ctx.lineTo(i + 1, h);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(i, h - footPrintsData[i]);
          ctx.lineTo(i + 1, h - footPrintsData[i + 1]);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

  };
});
paella.addPlugin(function () {
  return class FrameCaptionsSearchPlugIn extends paella.SearchServicePlugIn {
    getName() {
      return "es.upv.paella.frameCaptionsSearchPlugin";
    }

    search(text, next) {
      let re = RegExp(text, "i");
      let results = [];

      for (var key in paella.player.videoLoader.frameList) {
        var value = paella.player.videoLoader.frameList[key];

        if (typeof value == "object") {
          if (re.test(value.caption)) {
            results.push({
              time: key,
              content: value.caption,
              score: 0
            });
          }
        }
      }

      if (next) {
        next(false, results);
      }
    }

  };
});
paella.addPlugin(function () {
  return class FrameControlPlugin extends paella.ButtonPlugin {
    get frames() {
      return this._frames;
    }

    set frames(v) {
      this._frames = v;
    }

    get highResFrames() {
      return this._highResFrames;
    }

    set highResFrames(v) {
      this._highResFrames = v;
    }

    get currentFrame() {
      return this._currentFrame;
    }

    set currentFrame(v) {
      this._currentFrame = v;
    }

    get navButtons() {
      return this._navButtons;
    }

    set navButtons(v) {
      this._navButtons = v;
    }

    get buttons() {
      if (!this._buttons) {
        this._buttons = [];
      }

      return this._buttons;
    }

    set buttons(v) {
      this._buttons = v;
    }

    get contx() {
      return this._contx;
    }

    set contx(v) {
      this._contx = v;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "frameControl";
    }

    getIconClass() {
      return 'icon-photo';
    }

    getIndex() {
      return 510;
    }

    getName() {
      return "es.upv.paella.frameControlPlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.timeLineButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Navigate by slides");
    }

    checkEnabled(onSuccess) {
      this._img = null;
      this._searchTimer = null;
      this._searchTimerTime = 250;
      if (paella.initDelegate.initParams.videoLoader.frameList == null) onSuccess(false);else if (paella.initDelegate.initParams.videoLoader.frameList.length === 0) onSuccess(false);else if (Object.keys(paella.initDelegate.initParams.videoLoader.frameList).length == 0) onSuccess(false);else onSuccess(true);
    }

    setup() {
      this._showFullPreview = this.config.showFullPreview || "auto";
      var thisClass = this;
      var oldClassName;
      var blockCounter = 1;
      var correctJump = 0;
      var selectedItem = -1;
      var jumpAtItem;
      var Keys = {
        Tab: 9,
        Return: 13,
        Esc: 27,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40
      };
      $(this.button).keyup(function (event) {
        var visibleItems = Math.floor(thisClass.contx.offsetWidth / 100);
        var rest = thisClass.buttons.length % visibleItems;
        var blocks = Math.floor(thisClass.buttons.length / visibleItems);

        if (thisClass.isPopUpOpen()) {
          if (event.keyCode == Keys.Left) {
            if (selectedItem > 0) {
              thisClass.buttons[selectedItem].className = oldClassName;
              selectedItem--;
              if (blockCounter > blocks) correctJump = visibleItems - rest;
              jumpAtItem = visibleItems * (blockCounter - 1) - 1 - correctJump;

              if (selectedItem == jumpAtItem && selectedItem != 0) {
                thisClass.navButtons.left.scrollContainer.scrollLeft -= visibleItems * 105;
                --blockCounter;
              }

              if (this.hiResFrame) thisClass.removeHiResFrame();

              if (!base.userAgent.browser.IsMobileVersion) {
                thisClass.buttons[selectedItem].frameControl.onMouseOver(null, thisClass.buttons[selectedItem].frameData);
              }

              oldClassName = thisClass.buttons[selectedItem].className;
              thisClass.buttons[selectedItem].className = 'frameControlItem selected';
            }
          } else if (event.keyCode == Keys.Right) {
            if (selectedItem < thisClass.buttons.length - 1) {
              if (selectedItem >= 0) {
                thisClass.buttons[selectedItem].className = oldClassName;
              }

              selectedItem++;
              if (blockCounter == 1) correctJump = 0;
              jumpAtItem = visibleItems * blockCounter - correctJump;

              if (selectedItem == jumpAtItem) {
                thisClass.navButtons.left.scrollContainer.scrollLeft += visibleItems * 105;
                ++blockCounter;
              }

              if (this.hiResFrame) thisClass.removeHiResFrame();

              if (!base.userAgent.browser.IsMobileVersion) {
                thisClass.buttons[selectedItem].frameControl.onMouseOver(null, thisClass.buttons[selectedItem].frameData);
              }

              oldClassName = thisClass.buttons[selectedItem].className;
              thisClass.buttons[selectedItem].className = 'frameControlItem selected';
            }
          } else if (event.keyCode == Keys.Return) {
            thisClass.buttons[selectedItem].frameControl.onClick(null, thisClass.buttons[selectedItem].frameData);
            oldClassName = 'frameControlItem current';
          } else if (event.keyCode == Keys.Esc) {
            thisClass.removeHiResFrame();
          }
        }
      });
    }

    buildContent(domElement) {
      var thisClass = this;
      this.frames = [];
      var container = document.createElement('div');
      container.className = 'frameControlContainer';
      thisClass.contx = container;
      var content = document.createElement('div');
      content.className = 'frameControlContent';
      this.navButtons = {
        left: document.createElement('div'),
        right: document.createElement('div')
      };
      this.navButtons.left.className = 'frameControl navButton left';
      this.navButtons.right.className = 'frameControl navButton right';
      var frame = this.getFrame(null);
      domElement.appendChild(this.navButtons.left);
      domElement.appendChild(container);
      container.appendChild(content);
      domElement.appendChild(this.navButtons.right);
      this.navButtons.left.scrollContainer = container;
      $(this.navButtons.left).click(function (event) {
        this.scrollContainer.scrollLeft -= 100;
      });
      this.navButtons.right.scrollContainer = container;
      $(this.navButtons.right).click(function (event) {
        this.scrollContainer.scrollLeft += 100;
      });
      content.appendChild(frame);
      var itemWidth = $(frame).outerWidth(true);
      content.innerText = '';
      $(window).mousemove(function (event) {
        if ($(content).offset().top > event.pageY || !$(content).is(":visible") || $(content).offset().top + $(content).height() < event.pageY) {
          thisClass.removeHiResFrame();
        }
      });
      var frames = paella.initDelegate.initParams.videoLoader.frameList;
      var numFrames;

      if (frames) {
        var framesKeys = Object.keys(frames);
        numFrames = framesKeys.length;
        framesKeys.map(function (i) {
          return Number(i, 10);
        }).sort(function (a, b) {
          return a - b;
        }).forEach(function (key) {
          var frameItem = thisClass.getFrame(frames[key]);
          content.appendChild(frameItem, 'frameContrlItem_' + numFrames);
          thisClass.frames.push(frameItem);
        });
      }

      $(content).css({
        width: numFrames * itemWidth + 'px'
      });
      paella.events.bind(paella.events.setTrim, (event, params) => {
        this.updateFrameVisibility(params.trimEnabled, params.trimStart, params.trimEnd);
      });
      paella.player.videoContainer.trimming().then(trimData => {
        this.updateFrameVisibility(trimData.enabled, trimData.start, trimData.end);
      });
      paella.events.bind(paella.events.timeupdate, (event, params) => this.onTimeUpdate(params.currentTime));
    }

    showHiResFrame(url, caption) {
      var frameRoot = document.createElement("div");
      var frame = document.createElement("div");
      var hiResImage = document.createElement('img');
      this._img = hiResImage;
      hiResImage.className = 'frameHiRes';
      hiResImage.setAttribute('src', url);
      hiResImage.setAttribute('style', 'width: 100%;');
      $(frame).append(hiResImage);
      $(frameRoot).append(frame);
      frameRoot.setAttribute('style', 'display: table;');
      frame.setAttribute('style', 'display: table-cell; vertical-align:middle;');

      if (this.config.showCaptions === true) {
        var captionContainer = document.createElement('p');
        captionContainer.className = "frameCaption";
        captionContainer.innerText = caption || "";
        frameRoot.append(captionContainer);
        this._caption = captionContainer;
      }

      let overlayContainer = paella.player.videoContainer.overlayContainer;

      switch (this._showFullPreview) {
        case "auto":
          var streams = paella.initDelegate.initParams.videoLoader.streams;

          if (streams.length == 1) {
            overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(0));
          } else if (streams.length >= 2) {
            overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(1));
          }

          overlayContainer.enableBackgroundMode();
          this.hiResFrame = frameRoot;
          break;

        case "master":
          overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(0));
          overlayContainer.enableBackgroundMode();
          this.hiResFrame = frameRoot;
          break;

        case "slave":
          var streams = paella.initDelegate.initParams.videoLoader.streams;

          if (streams.length >= 2) {
            overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(0));
            overlayContainer.enableBackgroundMode();
            this.hiResFrame = frameRoot;
          }

          break;
      }
    }

    removeHiResFrame() {
      var thisClass = this;
      var overlayContainer = paella.player.videoContainer.overlayContainer;

      if (this.hiResFrame) {
        overlayContainer.removeElement(this.hiResFrame);
      }

      overlayContainer.disableBackgroundMode();
      thisClass._img = null;
    }

    updateFrameVisibility(trimEnabled, trimStart, trimEnd) {
      var i;

      if (!trimEnabled) {
        for (i = 0; i < this.frames.length; ++i) {
          $(this.frames[i]).show();
        }
      } else {
        for (i = 0; i < this.frames.length; ++i) {
          var frameElem = this.frames[i];
          var frameData = frameElem.frameData;

          if (frameData.time < trimStart) {
            if (this.frames.length > i + 1 && this.frames[i + 1].frameData.time > trimStart) {
              $(frameElem).show();
            } else {
              $(frameElem).hide();
            }
          } else if (frameData.time > trimEnd) {
            $(frameElem).hide();
          } else {
            $(frameElem).show();
          }
        }
      }
    }

    getFrame(frameData, id) {
      var frame = document.createElement('div');
      frame.className = 'frameControlItem';
      if (id) frame.id = id;

      if (frameData) {
        this.buttons.push(frame);
        frame.frameData = frameData;
        frame.frameControl = this;
        var image = frameData.thumb ? frameData.thumb : frameData.url;
        var labelTime = paella.utils.timeParse.secondsToTime(frameData.time);
        frame.innerHTML = '<img src="' + image + '" alt="" class="frameControlImage" title="' + labelTime + '" aria-label="' + labelTime + '"></img>';

        if (!base.userAgent.browser.IsMobileVersion) {
          $(frame).mouseover(function (event) {
            this.frameControl.onMouseOver(event, this.frameData);
          });
        }

        $(frame).mouseout(function (event) {
          this.frameControl.onMouseOut(event, this.frameData);
        });
        $(frame).click(function (event) {
          this.frameControl.onClick(event, this.frameData);
        });
      }

      return frame;
    }

    onMouseOver(event, frameData) {
      var frames = paella.initDelegate.initParams.videoLoader.frameList;
      var frame = frames[frameData.time];

      if (frame) {
        var image = frame.url;

        if (this._img) {
          this._img.setAttribute('src', image);

          if (this.config.showCaptions === true) {
            this._caption.innerText = frame.caption || "";
          }
        } else {
          this.showHiResFrame(image, frame.caption);
        }
      }

      if (this._searchTimer != null) {
        clearTimeout(this._searchTimer);
      }
    }

    onMouseOut(event, frameData) {
      this._searchTimer = setTimeout(timer => this.removeHiResFrame(), this._searchTimerTime);
    }

    onClick(event, frameData) {
      paella.player.videoContainer.trimming().then(trimming => {
        let time = trimming.enabled ? frameData.time - trimming.start : frameData.time;

        if (time > 0) {
          paella.player.videoContainer.seekToTime(time + 1);
        } else {
          paella.player.videoContainer.seekToTime(0);
        }
      });
    }

    onTimeUpdate(currentTime) {
      var frame = null;
      paella.player.videoContainer.trimming().then(trimming => {
        let time = trimming.enabled ? currentTime + trimming.start : currentTime;

        for (var i = 0; i < this.frames.length; ++i) {
          if (this.frames[i].frameData && this.frames[i].frameData.time <= time) {
            frame = this.frames[i];
          } else {
            break;
          }
        }

        if (this.currentFrame != frame && frame) {
          //this.navButtons.left.scrollContainer.scrollLeft += 100;
          if (this.currentFrame) this.currentFrame.className = 'frameControlItem';
          this.currentFrame = frame;
          this.currentFrame.className = 'frameControlItem current';
        }
      });
    }

  };
});
paella.addPlugin(function () {
  return class FullScreenPlugin extends paella.ButtonPlugin {
    getIndex() {
      return 551;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showFullScreenButton";
    }

    getIconClass() {
      return 'icon-fullscreen';
    }

    getName() {
      return "es.upv.paella.fullScreenButtonPlugin";
    }

    checkEnabled(onSuccess) {
      this._reload = null;
      var enabled = paella.player.checkFullScreenCapability();
      onSuccess(enabled);
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Go Fullscreen");
    }

    setup() {
      this._reload = this.config.reloadOnFullscreen ? this.config.reloadOnFullscreen.enabled : false;
      paella.events.bind(paella.events.enterFullscreen, event => this.onEnterFullscreen());
      paella.events.bind(paella.events.exitFullscreen, event => this.onExitFullscreen());
    }

    action(button) {
      if (paella.player.isFullScreen()) {
        paella.player.exitFullScreen();
      } else if ((!paella.player.checkFullScreenCapability() || base.userAgent.browser.Explorer) && window.location !== window.parent.location) {
        // Iframe and no fullscreen support
        var url = window.location.href;
        paella.player.pause();
        paella.player.videoContainer.currentTime().then(currentTime => {
          var obj = this.secondsToHours(currentTime);
          window.open(url + "&time=" + obj.h + "h" + obj.m + "m" + obj.s + "s&autoplay=true");
        });
        return;
      } else {
        paella.player.goFullScreen();
      }

      if (paella.player.config.player.reloadOnFullscreen && paella.player.videoContainer.supportAutoplay()) {
        setTimeout(() => {
          if (this._reload) {
            paella.player.videoContainer.setQuality(null).then(() => {}); //paella.player.reloadVideos();
          }
        }, 1000);
      }
    }

    secondsToHours(sec_numb) {
      var hours = Math.floor(sec_numb / 3600);
      var minutes = Math.floor((sec_numb - hours * 3600) / 60);
      var seconds = Math.floor(sec_numb - hours * 3600 - minutes * 60);
      var obj = {};

      if (hours < 10) {
        hours = "0" + hours;
      }

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      obj.h = hours;
      obj.m = minutes;
      obj.s = seconds;
      return obj;
    }

    onEnterFullscreen() {
      this.setToolTip(base.dictionary.translate("Exit Fullscreen"));
      this.button.className = this.getButtonItemClass(true);
      this.changeIconClass('icon-windowed');
    }

    onExitFullscreen() {
      this.setToolTip(base.dictionary.translate("Go Fullscreen"));
      this.button.className = this.getButtonItemClass(false);
      this.changeIconClass('icon-fullscreen');
      setTimeout(() => {
        paella.player.onresize();
      }, 100);
    }

    getButtonItemClass(selected) {
      return 'buttonPlugin ' + this.getAlignment() + ' ' + this.getSubclass() + (selected ? ' active' : '');
    }

  };
});
paella.addPlugin(function () {
  return class HelpPlugin extends paella.ButtonPlugin {
    getIndex() {
      return 509;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "helpButton";
    }

    getIconClass() {
      return 'icon-help';
    }

    getName() {
      return "es.upv.paella.helpPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Show help") + ' (' + base.dictionary.translate("Paella version:") + ' ' + paella.version + ')';
    }

    checkEnabled(onSuccess) {
      var availableLangs = this.config && this.config.langs || [];
      onSuccess(availableLangs.length > 0);
    }

    action(button) {
      var mylang = base.dictionary.currentLanguage();
      var availableLangs = this.config && this.config.langs || [];
      var idx = availableLangs.indexOf(mylang);

      if (idx < 0) {
        idx = 0;
      } //paella.messageBox.showFrame("http://paellaplayer.upv.es/?page=usage");


      let url = "resources/style/help/help_" + availableLangs[idx] + ".html";

      if (base.userAgent.browser.IsMobileVersion) {
        window.open(url);
      } else {
        paella.messageBox.showFrame(url);
      }
    }

  };
});
(() => {
  class HLSPlayer extends paella.Html5Video {
    get config() {
      let config = {
        autoStartLoad: true,
        startPosition: -1,
        capLevelToPlayerSize: true,
        debug: false,
        defaultAudioCodec: undefined,
        initialLiveManifestSize: 1,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        lowBufferWatchdogPeriod: 0.5,
        highBufferWatchdogPeriod: 3,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.2,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableWorker: true,
        enableSoftwareAES: true,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 1,
        manifestLoadingRetryDelay: 500,
        manifestLoadingMaxRetryTimeout: 64000,
        startLevel: undefined,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 4,
        levelLoadingRetryDelay: 500,
        levelLoadingMaxRetryTimeout: 64000,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 500,
        fragLoadingMaxRetryTimeout: 64000,
        startFragPrefetch: false,
        appendErrorMaxRetry: 3,
        // loader: customLoader,
        // fLoader: customFragmentLoader,
        // pLoader: customPlaylistLoader,
        // xhrSetup: XMLHttpRequestSetupCallback,
        // fetchSetup: FetchSetupCallback,
        // abrController: customAbrController,
        // timelineController: TimelineController,
        enableWebVTT: true,
        enableCEA708Captions: true,
        stretchShortVideoTrack: false,
        maxAudioFramesDrift: 1,
        forceKeyFrameOnDiscontinuity: true,
        abrEwmaFastLive: 5.0,
        abrEwmaSlowLive: 9.0,
        abrEwmaFastVoD: 4.0,
        abrEwmaSlowVoD: 15.0,
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        minAutoBitrate: 0
      };
      let pluginConfig = {};
      paella.player.config.player.methods.some(methodConfig => {
        if (methodConfig.factory == "HLSVideoFactory") {
          pluginConfig = methodConfig.config || {};
          return true;
        }
      });

      for (let key in config) {
        if (pluginConfig[key] != undefined) {
          config[key] = pluginConfig[key];
        }
      }

      return config;
    }

    constructor(id, stream, left, top, width, height) {
      super(id, stream, left, top, width, height, 'hls');
    }

    _loadDeps() {
      return new Promise((resolve, reject) => {
        if (!window.$paella_hls) {
          require([paella.baseUrl + 'resources/deps/hls.min.js'], function (hls) {
            window.$paella_hls = hls;
            resolve(window.$paella_hls);
          });
        } else {
          resolve(window.$paella_hls);
        }
      });
    }

    allowZoom() {
      return true;
    }

    load() {
      if (this._posterFrame) {
        this.video.setAttribute("poster", this._posterFrame);
      }

      if (base.userAgent.system.iOS) // ||
        //	base.userAgent.browser.Safari)
        {
          return super.load();
        } else {
        let This = this;
        return new Promise((resolve, reject) => {
          var source = this._stream.sources.hls;

          if (source && source.length > 0) {
            source = source[0];

            this._loadDeps().then(function (Hls) {
              if (Hls.isSupported()) {
                let cfg = This.config;
                This._hls = new Hls(cfg);

                This._hls.loadSource(source.src);

                This._hls.attachMedia(This.video);

                This.autoQuality = true;

                This._hls.on(Hls.Events.LEVEL_SWITCHED, function (ev, data) {
                  This._qualities = This._qualities || [];
                  This.qualityIndex = This.autoQuality ? This._qualities.length - 1 : data.level;
                  paella.events.trigger(paella.events.qualityChanged, {});
                  if (console && console.log) console.log(`HLS: quality level changed to ${data.level}`);
                });

                This._hls.on(Hls.Events.ERROR, function (event, data) {
                  //deal with nonfatal media errors that might come from redirects after session expiration
                  if (data.fatal) {
                    switch (data.type) {
                      case Hls.ErrorTypes.NETWORK_ERROR:
                        base.log.error("paella.HLSPlayer: Fatal network error encountered, try to recover: " + data.details);

                        This._hls.startLoad();

                        break;

                      case Hls.ErrorTypes.MEDIA_ERROR:
                        base.log.error("paella.HLSPlayer: Fatal media error encountered, try to recover :" + data.details);

                        This._hls.recoverMediaError();

                        break;

                      default:
                        base.log.error("paella.HLSPlayer: Fatal Error. Can not recover: " + data.details);

                        This._hls.destroy();

                        reject(new Error("invalid media"));
                        break;
                    }
                  } else {
                    // #DCE OPC-374 DEBUG log non-fatal errors
                    base.log.debug("paella.HLSPlayer: Error '" + data.type + "': " + data.details);
                  }
                });

                This._hls.on(Hls.Events.MANIFEST_PARSED, function () {
                  This._deferredAction(function () {
                    resolve();
                  });
                });
              }
            });
          } else {
            reject(new Error("Invalid source"));
          }
        });
      }
    }

    getQualities() {
      if (base.userAgent.system.iOS) // ||
        //		base.userAgent.browser.Safari)
        {
          return new Promise((resolve, reject) => {
            resolve([{
              index: 0,
              res: "",
              src: "",
              toString: function () {
                return "auto";
              },
              shortLabel: function () {
                return "auto";
              },
              compare: function (q2) {
                return 0;
              }
            }]);
          });
        } else {
        let This = this;
        return new Promise(resolve => {
          if (!this._qualities || this._qualities.length == 0) {
            This._qualities = [];

            This._hls.levels.forEach(function (q, index) {
              This._qualities.push(This._getQualityObject(index, {
                index: index,
                res: {
                  w: q.width,
                  h: q.height
                },
                bitrate: q.bitrate
              }));
            });

            This._qualities.push(This._getQualityObject(This._qualities.length, {
              index: This._qualities.length,
              res: {
                w: 0,
                h: 0
              },
              bitrate: 0
            }));
          }

          This.qualityIndex = This._qualities.length - 1;
          resolve(This._qualities);
        });
      }
    }

    printQualityes() {
      return new Promise((resolve, reject) => {
        this.getCurrentQuality().then(cq => {
          return this.getNextQuality();
        }).then(nq => {
          resolve();
        });
      });
    }

    setQuality(index) {
      if (base.userAgent.system.iOS) // ||
        //base.userAgent.browser.Safari)
        {
          return Promise.resolve();
        } else if (index !== null) {
        try {
          this.qualityIndex = index;
          let level = index;
          this.autoQuality = false;

          if (index == this._qualities.length - 1) {
            level = -1;
            this.autoQuality = true;
          }

          this._hls.currentLevel = level;
        } catch (err) {}

        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    }

    getNextQuality() {
      return new Promise((resolve, reject) => {
        let index = this.qualityIndex;
        resolve(this._qualities[index]);
      });
    }

    getCurrentQuality() {
      if (base.userAgent.system.iOS) // ||
        //base.userAgent.browser.Safari)
        {
          return Promise.resolve(0);
        } else {
        return new Promise((resolve, reject) => {
          resolve(this._qualities[this.qualityIndex]);
        });
      }
    }

  }

  paella.HLSPlayer = HLSPlayer;

  class HLSVideoFactory extends paella.VideoFactory {
    get config() {
      let hlsConfig = null;
      paella.player.config.player.methods.some(methodConfig => {
        if (methodConfig.factory == "HLSVideoFactory") {
          hlsConfig = methodConfig;
        }

        return hlsConfig != null;
      });
      return hlsConfig || {
        iOSMaxStreams: 1,
        androidMaxStreams: 1
      };
    }

    isStreamCompatible(streamData) {
      if (paella.videoFactories.HLSVideoFactory.s_instances === undefined) {
        paella.videoFactories.HLSVideoFactory.s_instances = 0;
      }

      try {
        let cfg = this.config;

        if (base.userAgent.system.iOS && paella.videoFactories.HLSVideoFactory.s_instances >= cfg.iOSMaxStreams || base.userAgent.system.Android && paella.videoFactories.HLSVideoFactory.s_instances >= cfg.androidMaxStreams) //	In some old mobile devices, playing a high number of HLS streams may cause that the browser tab crash
          {
            return false;
          }

        for (var key in streamData.sources) {
          if (key == 'hls') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      ++paella.videoFactories.HLSVideoFactory.s_instances;
      return new paella.HLSPlayer(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.HLSVideoFactory = HLSVideoFactory;
})();
/*
 * #DCE OPC-384 alt-M mute to mute, but only mute.
 * Ref https://github.com/polimediaupv/paella/pull/438
*/
paella.addPlugin(() => {
  return class DefaultKeyPlugin extends paella.KeyPlugin {
    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    getName() {
      return "es.upv.paella.defaultKeysPlugin";
    }

    setup() {}

    onKeyPress(event) {
      // Matterhorn standard keys
      if (event.altKey && event.ctrlKey) {
        if (event.which == paella.Keys.P) {
          this.togglePlayPause();
          return true;
        } else if (event.which == paella.Keys.S) {
          this.pause();
          return true;
        } else if (event.which == paella.Keys.M) {
          this.mute();
          return true;
        } else if (event.which == paella.Keys.U) {
          this.volumeUp();
          return true;
        } else if (event.which == paella.Keys.D) {
          this.volumeDown();
          return true;
        }
      } else {
        // Paella player keys
        if (event.which == paella.Keys.Space) {
          this.togglePlayPause();
          return true;
        } else if (event.which == paella.Keys.Up) {
          this.volumeUp();
          return true;
        } else if (event.which == paella.Keys.Down) {
          this.volumeDown();
          return true;
        } else if (event.which == paella.Keys.M) {
          this.mute();
          return true;
        }
      }

      return false;
    }

    togglePlayPause() {
      paella.player.videoContainer.paused().then(p => {
        p ? paella.player.play() : paella.player.pause();
      });
    }

    pause() {
      paella.player.pause();
    }

    mute() {
      // #DCE override ref https://github.com/polimediaupv/paella/pull/438 
      paella.player.videoContainer.setVolume(0);
    }

    volumeUp() {
      var videoContainer = paella.player.videoContainer;
      videoContainer.volume().then(function (volume) {
        volume += 0.1;
        volume = volume > 1 ? 1.0 : volume;
        paella.player.videoContainer.setVolume(volume);
      });
    }

    volumeDown() {
      var videoContainer = paella.player.videoContainer;
      videoContainer.volume().then(function (volume) {
        volume -= 0.1;
        volume = volume < 0 ? 0.0 : volume;
        paella.player.videoContainer.setVolume(volume);
      });
    }

  };
});
paella.addPlugin(() => {
  return class LegalPlugin extends paella.VideoOverlayButtonPlugin {
    getIndex() {
      return 0;
    }

    getSubclass() {
      return "legal";
    }

    getAlignment() {
      return paella.player.config.plugins.list[this.getName()].position;
    }

    getDefaultToolTip() {
      return "";
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    setup() {
      let plugin = paella.player.config.plugins.list[this.getName()];
      let title = document.createElement('a');
      title.innerText = plugin.label;
      this._url = plugin.legalUrl;
      title.className = "";
      this.button.appendChild(title);
    }

    action(button) {
      window.open(this._url);
    }

    getName() {
      return "es.upv.paella.legalPlugin";
    }

  };
});
paella.addPlugin(function () {
  return class LiveStreamIndicator extends paella.VideoOverlayButtonPlugin {
    isEditorVisible() {
      return paella.editor.instance != null;
    }

    getIndex() {
      return 10;
    }

    getSubclass() {
      return "liveIndicator";
    }

    getAlignment() {
      return 'right';
    }

    getDefaultToolTip() {
      return base.dictionary.translate("This video is a live stream");
    }

    getName() {
      return "es.upv.paella.liveStreamingIndicatorPlugin";
    }

    checkEnabled(onSuccess) {
      onSuccess(paella.player.isLiveStream());
    }

    setup() {}

    action(button) {
      paella.messageBox.showMessage(base.dictionary.translate("Live streaming mode: This is a live video, so, some capabilities of the player are disabled"));
    }

  };
});
(() => {
  class MpegDashVideo extends paella.Html5Video {
    constructor(id, stream, left, top, width, height) {
      super(id, stream, left, top, width, height);
      this._posterFrame = null;
      this._player = null;
    }

    _loadDeps() {
      return new Promise((resolve, reject) => {
        if (!window.$paella_mpd) {
          require([paella.baseUrl + 'resources/deps/dash.all.js'], function () {
            window.$paella_mpd = true;
            resolve(window.$paella_mpd);
          });
        } else {
          resolve(window.$paella_mpd);
        }
      });
    }

    _getQualityObject(item, index, bitrates) {
      var total = bitrates.length;
      var percent = Math.round(index * 100 / total);
      var label = index == 0 ? "min" : index == total - 1 ? "max" : percent + "%";
      return {
        index: index,
        res: {
          w: null,
          h: null
        },
        bitrate: item.bitrate,
        src: null,
        toString: function () {
          return percent;
        },
        shortLabel: function () {
          return label;
        },
        compare: function (q2) {
          return this.bitrate - q2.bitrate;
        }
      };
    }

    load() {
      let This = this;
      return new Promise((resolve, reject) => {
        var source = this._stream.sources.mpd;

        if (source && source.length > 0) {
          source = source[0];

          this._loadDeps().then(function () {
            var context = dashContext;
            var player = dashjs.MediaPlayer().create();
            var dashContext = context;
            player.initialize(This.video, source.src, true);
            player.getDebug().setLogToBrowserConsole(false);
            This._player = player;
            player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function (a, b) {
              var bitrates = player.getBitrateInfoListFor("video");

              This._deferredAction(function () {
                if (!This._firstPlay) {
                  This._player.pause();

                  This._firstPlay = true;
                }

                resolve();
              });
            });
          });
        } else {
          reject(new Error("Invalid source"));
        }
      });
    }

    supportAutoplay() {
      return true;
    }

    getQualities() {
      return new Promise(resolve => {
        this._deferredAction(() => {
          if (!this._qualities) {
            this._qualities = [];

            this._player.getBitrateInfoListFor("video").sort((a, b) => {
              return a.bitrate - b.bitrate;
            }).forEach((item, index, bitrates) => {
              this._qualities.push(this._getQualityObject(item, index, bitrates));
            });

            this.autoQualityIndex = this._qualities.length;

            this._qualities.push({
              index: this.autoQualityIndex,
              res: {
                w: null,
                h: null
              },
              bitrate: -1,
              src: null,
              toString: function () {
                return "auto";
              },
              shortLabel: function () {
                return "auto";
              },
              compare: function (q2) {
                return this.bitrate - q2.bitrate;
              }
            });
          }

          resolve(this._qualities);
        });
      });
    }

    setQuality(index) {
      return new Promise((resolve, reject) => {
        let currentQuality = this._player.getQualityFor("video");

        if (index == this.autoQualityIndex) {
          this._player.setAutoSwitchQuality(true);

          resolve();
        } else if (index != currentQuality) {
          this._player.setAutoSwitchQuality(false);

          this._player.off(dashjs.MediaPlayer.events.METRIC_CHANGED);

          this._player.on(dashjs.MediaPlayer.events.METRIC_CHANGED, (a, b) => {
            if (a.type == "metricchanged") {
              if (currentQuality != this._player.getQualityFor("video")) {
                currentQuality = this._player.getQualityFor("video");
                resolve();
              }
            }
          });

          this._player.setQualityFor("video", index);
        } else {
          resolve();
        }
      });
    }

    getCurrentQuality() {
      return new Promise((resolve, reject) => {
        if (this._player.getAutoSwitchQuality()) {
          // auto quality
          resolve({
            index: this.autoQualityIndex,
            res: {
              w: null,
              h: null
            },
            bitrate: -1,
            src: null,
            toString: function () {
              return "auto";
            },
            shortLabel: function () {
              return "auto";
            },
            compare: function (q2) {
              return this.bitrate - q2.bitrate;
            }
          });
        } else {
          var index = this._player.getQualityFor("video");

          resolve(this._getQualityObject(this._qualities[index], index, this._player.getBitrateInfoListFor("video")));
        }
      });
    }

    unFreeze() {
      return paella_DeferredNotImplemented();
    }

    freeze() {
      return paella_DeferredNotImplemented();
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

  }

  paella.MpegDashVideo = MpegDashVideo;

  class MpegDashVideoFactory extends paella.VideoFactory {
    isStreamCompatible(streamData) {
      try {
        if (base.userAgent.system.iOS) {
          return false;
        }

        for (var key in streamData.sources) {
          if (key == 'mpd') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      ++paella.videoFactories.Html5VideoFactory.s_instances;
      return new paella.MpegDashVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.MpegDashVideoFactory = MpegDashVideoFactory;
})();
paella.addPlugin(function () {
  return class MultipleQualitiesPlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showMultipleQualitiesPlugin";
    }

    getIconClass() {
      return 'icon-screen';
    } // #DCE OPC-374 overriding the index to reposition the button


    getIndex() {
      return 100;
    }

    getName() {
      return "es.upv.paella.multipleQualitiesPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Change video quality");
    }

    closeOnMouseOut() {
      return true;
    }

    checkEnabled(onSuccess) {
      this._available = [];
      paella.player.videoContainer.getQualities().then(q => {
        this._available = q;
        onSuccess(q.length > 1);
      });
    }

    setup() {
      this.setQualityLabel();
      paella.events.bind(paella.events.qualityChanged, event => this.setQualityLabel());
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    buildContent(domElement) {
      this._available.forEach(q => {
        var title = q.shortLabel();
        domElement.appendChild(this.getItemButton(q));
      });
    }

    getItemButton(quality) {
      var elem = document.createElement('div');
      let This = this;
      paella.player.videoContainer.getCurrentQuality().then((currentIndex, currentData) => {
        var label = quality.shortLabel();
        elem.className = this.getButtonItemClass(label, quality.index == currentIndex);
        elem.id = label;
        elem.innerText = label;
        elem.data = quality;
        $(elem).click(function (event) {
          $('.multipleQualityItem').removeClass('selected');
          $('.multipleQualityItem.' + this.data.toString()).addClass('selected');
          paella.player.videoContainer.setQuality(this.data.index).then(() => {
            paella.player.controls.hidePopUp(This.getName());
            This.setQualityLabel();
          });
        });
      });
      return elem;
    }

    setQualityLabel() {
      paella.player.videoContainer.getCurrentQuality().then(q => {
        this.setText(q.shortLabel());
      });
    }

    getButtonItemClass(profileName, selected) {
      return 'multipleQualityItem ' + profileName + (selected ? ' selected' : '');
    }

  };
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
paella.addPlugin(function () {
  return class MHDescriptionPlugin extends paella.TabBarPlugin {
    get domElement() {
      return this._domElement;
    }

    set domElement(v) {
      this._domElement = v;
    }

    get desc() {
      return this._desc;
    }

    set desc(v) {
      this._desc = v;
    }

    constructor() {
      super();
      this._desc = {
        date: '',
        contributor: '',
        language: '',
        views: '',
        serie: '',
        serieId: '',
        presenter: '',
        description: '',
        title: '',
        subject: ''
      };
    }

    getSubclass() {
      return 'showMHDescriptionTabBar';
    }

    getName() {
      return 'es.upv.paella.opencast.descriptionPlugin';
    }

    getTabName() {
      return paella.dictionary.translate('Description');
    }

    getIndex() {
      return 10;
    }

    getDefaultToolTip() {
      return paella.dictionary.translate('Description');
    }

    checkEnabled(onSuccess) {
      var self = this;
      paella.opencast.getEpisode().then(function (episode) {
        self._episode = episode;
        onSuccess(true);
      }, function () {
        onSuccess(false);
      });
    }

    buildContent(domElement) {
      this.domElement = domElement;
      this.loadContent();
    }

    action(tab) {}

    loadContent() {
      var thisClass = this;

      if (thisClass._episode.dcTitle) {
        this.desc.title = thisClass._episode.dcTitle;
      }

      if (thisClass._episode.dcCreator) {
        this.desc.presenter = thisClass._episode.dcCreator;
      }

      if (thisClass._episode.dcContributor) {
        this.desc.contributor = thisClass._episode.dcContributor;
      }

      if (thisClass._episode.dcDescription) {
        this.desc.description = thisClass._episode.dcDescription;
      }

      if (thisClass._episode.dcLanguage) {
        this.desc.language = thisClass._episode.dcLanguage;
      }

      if (thisClass._episode.dcSubject) {
        this.desc.subject = thisClass._episode.dcSubject;
      }

      if (thisClass._episode.mediapackage.series) {
        this.desc.serie = thisClass._episode.mediapackage.seriestitle;
        this.desc.serieId = thisClass._episode.mediapackage.series;
      }

      this.desc.date = 'n.a.';
      var dcCreated = thisClass._episode.dcCreated;

      if (dcCreated) {
        var sd = new Date();
        sd.setFullYear(parseInt(dcCreated.substring(0, 4), 10));
        sd.setMonth(parseInt(dcCreated.substring(5, 7), 10) - 1);
        sd.setDate(parseInt(dcCreated.substring(8, 10), 10));
        sd.setHours(parseInt(dcCreated.substring(11, 13), 10));
        sd.setMinutes(parseInt(dcCreated.substring(14, 16), 10));
        sd.setSeconds(parseInt(dcCreated.substring(17, 19), 10));
        this.desc.date = sd.toLocaleString();
      }

      paella.ajax.get({
        url: '/usertracking/stats.json',
        params: {
          id: thisClass._episode.id
        }
      }, function (data, contentType, returnCode) {
        thisClass.desc.views = data.stats.views;
        thisClass.insertDescription();
      }, function (data, contentType, returnCode) {
        thisClass.insertDescription();
      });
    }

    insertDescription() {
      var divDate = document.createElement('div');
      divDate.className = 'showMHDescriptionTabBarElement';
      var divContributor = document.createElement('div');
      divContributor.className = 'showMHDescriptionTabBarElement';
      var divLanguage = document.createElement('div');
      divLanguage.className = 'showMHDescriptionTabBarElement';
      var divViews = document.createElement('div');
      divViews.className = 'showMHDescriptionTabBarElement';
      var divTitle = document.createElement('div');
      divTitle.className = 'showMHDescriptionTabBarElement';
      var divSubject = document.createElement('div');
      divSubject.className = 'showMHDescriptionTabBarElement';
      var divSeries = document.createElement('div');
      divSeries.className = 'showMHDescriptionTabBarElement';
      var divPresenter = document.createElement('div');
      divPresenter.className = 'showMHDescriptionTabBarElement';
      var divDescription = document.createElement('div');
      divDescription.className = 'showMHDescriptionTabBarElement';
      divDate.innerHTML = paella.dictionary.translate('Date') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.date) + '</span>';
      divContributor.innerHTML = paella.dictionary.translate('Contributor') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.contributor) + '</span>';
      divLanguage.innerHTML = paella.dictionary.translate('Language') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.language) + '</span>';
      divViews.innerHTML = paella.dictionary.translate('Views') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.views) + '</span>';
      divTitle.innerHTML = paella.dictionary.translate('Title') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.title) + '</span>';
      divSubject.innerHTML = paella.dictionary.translate('Subject') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.subject) + '</span>';

      if (this.desc.presenter == '') {
        divPresenter.innerHTML = paella.dictionary.translate('Presenter') + ': <span class="showMHDescriptionTabBarValue"></span>';
      } else {
        divPresenter.innerHTML = paella.dictionary.translate('Presenter') + ': <span class="showMHDescriptionTabBarValue"><a tabindex="4001" href="/engage/ui/index.html?q=' + this.desc.presenter + '">' + paella.AntiXSS.htmlEscape(this.desc.presenter) + '</a></span>';
      }

      if (this.desc.serieId == '') {
        divSeries.innerHTML = paella.dictionary.translate('Series') + ': <span class="showMHDescriptionTabBarValue"></span>';
      } else {
        divSeries.innerHTML = paella.dictionary.translate('Series') + ': <span class="showMHDescriptionTabBarValue"><a tabindex="4002" href="/engage/ui/index.html?epFrom=' + this.desc.serieId + '">' + paella.AntiXSS.htmlEscape(this.desc.serie) + '</a></span>';
      }

      divDescription.innerHTML = paella.dictionary.translate('Description') + ': <span class="showMHDescriptionTabBarValue">' + paella.AntiXSS.htmlEscape(this.desc.description) + '</span>'; //---------------------------//

      var divLeft = document.createElement('div');
      divLeft.className = 'showMHDescriptionTabBarLeft';
      divLeft.appendChild(divTitle);
      divLeft.appendChild(divPresenter);
      divLeft.appendChild(divSeries);
      divLeft.appendChild(divDate);
      divLeft.appendChild(divViews); //---------------------------//

      var divRight = document.createElement('div');
      divRight.className = 'showMHDescriptionTabBarRight';
      divRight.appendChild(divContributor);
      divRight.appendChild(divSubject);
      divRight.appendChild(divLanguage);
      divRight.appendChild(divDescription);
      this.domElement.appendChild(divLeft);
      this.domElement.appendChild(divRight);
    }

  };
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
paella.addPlugin(function () {
  return class DownloadsPlugin extends paella.TabBarPlugin {
    getSubclass() {
      return 'downloadsTabBar';
    }

    getName() {
      return 'es.upv.paella.opencast.downloadsPlugin';
    }

    getTabName() {
      return paella.dictionary.translate('Downloads');
    }

    getIndex() {
      return 30;
    }

    getDefaultToolTip() {
      return paella.dictionary.translate('Downloads');
    }

    get domElement() {
      return this._domElement;
    }

    set domElement(v) {
      this._domElement = v;
    }

    checkEnabled(onSuccess) {
      var self = this;
      paella.opencast.getEpisode().then(function (episode) {
        self._episode = episode;
        onSuccess(true);
      }, function () {
        onSuccess(false);
      });
    }

    buildContent(domElement) {
      this.domElement = domElement;
      this.loadContent();
    }

    action(tab) {}

    loadContent() {
      var self = this;
      var container = document.createElement('div');
      container.className = 'downloadsTabBarContainer';
      var tracks = self._episode.mediapackage.media.track;

      if (!(tracks instanceof Array)) {
        tracks = [tracks];
      }

      for (var i = 0; i < tracks.length; ++i) {
        var track = tracks[i];
        var download = false;

        if (track.tags != undefined && track.tags.tag != undefined && track.mimetype.indexOf('video') >= 0 && track.url.indexOf('rtmp://') < 0) {
          for (var j = 0; j < track.tags.tag.length; j++) {
            if (track.tags.tag[j] === 'engage-download') {
              download = true;
              break;
            }
          }
        }

        if (download) {
          paella.debug.log(track.type);
          container.appendChild(this.createLink(track, i));
        }
      }

      this.domElement.appendChild(container);
    }

    createLink(track, tabindexcount) {
      var elem = document.createElement('div');
      elem.className = 'downloadsLinkContainer';
      var link = document.createElement('a');
      link.className = 'downloadsLinkItem';
      link.innerHTML = this.getTextInfo(track);
      link.setAttribute('tabindex', 4000 + tabindexcount);
      link.href = track.url;
      elem.appendChild(link);
      return elem;
    }

    getTextInfo(track) {
      var text = '';

      if (track.video) {
        text = '<span class="downloadLinkText TypeFile Video">' + paella.dictionary.translate('Video file') + '</span>';
      } else if (track.audio) {
        text = '<span class="downloadLinkText TypeFile Audio">' + paella.dictionary.translate('Audio file') + '</span>';
      } // track


      var trackText = '<span class="downloadLinkText Track">' + track.type + '</span>'; // Resolution

      var resolution = '';

      if (track.video) {
        if (track.video.resolution) {
          resolution = track.video.resolution;
        }

        if (track.video.framerate) {
          resolution += '@' + track.video.framerate + 'fps';
        }
      } // mimetype


      var mimetype = '';

      if (track.mimetype) {
        mimetype = track.mimetype;
      }

      if (mimetype) text += ' <span class="downloadLinkText MIMEType">[' + paella.dictionary.translate(mimetype) + ']</span>';
      text += ': ' + trackText;
      if (resolution) text += ' <span class="downloadLinkText Resolution">(' + resolution + ')</span>';
      return text;
    }

  };
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */

/*global Class*/
paella.addPlugin(function () {
  return class EpisodesFromSeries extends paella.ButtonPlugin {
    getSubclass() {
      return 'EpisodesFromSeries';
    }

    getName() {
      return 'es.upv.paella.opencast.episodesFromSeries';
    }

    getIndex() {
      return 10;
    }

    getDefaultToolTip() {
      return paella.dictionary.translate('Related Videos');
    }

    getAlignment() {
      return 'right';
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getIconClass() {
      return 'icon-list';
    }

    checkEnabled(onSuccess) {
      var self = this;
      paella.opencast.getEpisode().then(function (episode) {
        self._episode = episode;

        if (episode.mediapackage.series) {
          onSuccess(true);
        } else {
          onSuccess(false);
        }
      }).catch(function () {
        onSuccess(false);
      });
    }

    buildContent(domElement) {
      var self = this;
      var serieId = self._episode.mediapackage.series;
      var serieTitle = self._episode.mediapackage.seriestitle;
      var episodesFromSeriesTitle = document.createElement('div');
      episodesFromSeriesTitle.id = 'episodesFromSeriesTitle';
      episodesFromSeriesTitle.className = 'episodesFromSeriesTitle';

      if (serieId) {
        episodesFromSeriesTitle.innerHTML = '<span class=\'episodesFromSeriesTitle_Bold\'>' + paella.dictionary.translate('Videos in this series:') + '</span> ' + paella.AntiXSS.htmlEscape(serieTitle);
      } else {
        episodesFromSeriesTitle.innerHTML = '<span class=\'episodesFromSeriesTitle_Bold\'>' + paella.dictionary.translate('Available videos:') + '</span>';
      }

      var episodesFromSeriesListing = document.createElement('div');
      episodesFromSeriesListing.id = 'episodesFromSeriesListing';
      episodesFromSeriesListing.className = 'episodesFromSeriesListing';
      domElement.appendChild(episodesFromSeriesTitle);
      domElement.appendChild(episodesFromSeriesListing);
      var params = {
        limit: 5,
        page: 0,
        sid: serieId
      };
      var mySearch = new SearchEpisode(paella.player.config, params);
      mySearch.doSearch(params, document.getElementById('episodesFromSeriesListing'));
    }

  };
});
/************************************************************************************/

var SearchEpisode = Class.create({
  config: null,
  proxyUrl: '',
  recordingEntryID: '',
  useJsonp: false,
  divLoading: null,
  divResults: null,
  AsyncLoaderPublishCallback: Class.create(paella.AsyncLoaderCallback, {
    config: null,
    recording: null,
    initialize: function (config, recording) {
      this.parent('AsyncLoaderPublishCallback');
      this.config = config;
      this.recording = recording;
    },
    load: function (onSuccess, onError) {
      var thisClass = this;
      paella.data.read('publish', {
        id: this.recording.id
      }, function (data, status) {
        if (status == true) {
          if (data == true || data == 'True') {
            thisClass.recording.entry_published_class = 'published';
          } else if (data == false || data == 'False') {
            thisClass.recording.entry_published_class = 'unpublished';
          } else if (data == 'undefined') {
            thisClass.recording.entry_published_class = 'pendent';
          } else {
            thisClass.recording.entry_published_class = 'no_publish_info';
          }

          onSuccess();
        } else {
          thisClass.recording.entry_published_class = 'no_publish_info';
          onSuccess();
        }
      });
    }
  }),
  createDOMElement: function (type, id, className) {
    var elem = document.createElement(type);
    elem.id = id;
    elem.className = className;
    return elem;
  },
  doSearch: function (params, domElement) {
    var thisClass = this;
    this.recordingEntryID = domElement.id + '_entry_';
    domElement.innerText = ''; // loading div

    this.divLoading = this.createDOMElement('div', thisClass.recordingEntryID + '_loading', 'recordings_loading');
    this.divLoading.innerText = paella.dictionary.translate('Searching...');
    domElement.appendChild(this.divLoading); // header div

    var divHeader = this.createDOMElement('div', thisClass.recordingEntryID + '_header', 'recordings_header');
    domElement.appendChild(divHeader);
    this.divResults = this.createDOMElement('div', thisClass.recordingEntryID + '_header_results', 'recordings_header_results');
    divHeader.appendChild(this.divResults);
    var divNavigation = this.createDOMElement('div', thisClass.recordingEntryID + '_header_navigation', 'recordings_header_navigation');
    divHeader.appendChild(divNavigation); // loading results

    thisClass.setLoading(true);
    paella.ajax.get({
      url: '/search/episode.json',
      params: params
    }, function (data, contentType, returnCode, dataRaw) {
      thisClass.processSearchResults(data, params, domElement, divNavigation);
    }, function (data, contentType, returnCode) {});
  },
  processSearchResults: function (response, params, divList, divNavigation) {
    var thisClass = this;

    if (typeof response == 'string') {
      response = JSON.parse(response);
    }

    var resultsAvailable = response !== undefined && response['search-results'] !== undefined && response['search-results'].total !== undefined;

    if (resultsAvailable === false) {
      paella.debug.log('Seach failed, respons:  ' + response);
      return;
    }

    var totalItems = parseInt(response['search-results'].total);

    if (totalItems === 0) {
      if (params.q === undefined) {
        thisClass.setResults('No recordings');
      } else {
        thisClass.setResults('No recordings found: "' + params.q + '"');
      }
    } else {
      var offset = parseInt(response['search-results'].offset);
      var limit = parseInt(response['search-results'].limit);
      var startItem = offset;
      var endItem = offset + limit;

      if (startItem < endItem) {
        startItem = startItem + 1;
      }

      if (params.q === undefined) {
        thisClass.setResults('Results ' + startItem + '-' + endItem + ' of ' + totalItems);
      } else {
        thisClass.setResults('Results ' + startItem + '-' + endItem + ' of ' + totalItems + ' for "' + params.q + '"');
      } // *******************************
      // *******************************
      // TODO


      var asyncLoader = new paella.AsyncLoader();
      var results = response['search-results'].result;

      if (!(results instanceof Array)) {
        results = [results];
      } //There are annotations of the desired type, deleting...


      for (var i = 0; i < results.length; ++i) {
        asyncLoader.addCallback(new thisClass.AsyncLoaderPublishCallback(thisClass.config, results[i]));
      }

      asyncLoader.load(function () {
        var i; // create navigation div

        if (results.length < totalItems) {
          // current page
          var currentPage = 1;

          if (params.offset !== undefined) {
            currentPage = params.offset / params.limit + 1;
          } // max page


          var maxPage = parseInt(totalItems / params.limit);
          if (totalItems % 10 != 0) maxPage += 1;
          maxPage = Math.max(1, maxPage); // previous link

          var divPrev = document.createElement('div');
          divPrev.id = thisClass.recordingEntryID + '_header_navigation_prev';
          divPrev.className = 'recordings_header_navigation_prev';

          if (currentPage > 1) {
            var divPrevLink = document.createElement('a');
            divPrevLink.param_offset = (currentPage - 2) * params.limit;
            divPrevLink.param_limit = params.limit;
            divPrevLink.param_q = params.q;
            divPrevLink.param_sid = params.sid;
            $(divPrevLink).click(function (event) {
              var params = {};
              params.offset = this.param_offset;
              params.limit = this.param_limit;
              params.q = this.param_q;
              params.sid = this.param_sid;
              thisClass.doSearch(params, divList);
            });
            divPrevLink.innerText = paella.dictionary.translate('Previous');
            divPrev.appendChild(divPrevLink);
          } else {
            divPrev.innerText = paella.dictionary.translate('Previous');
          }

          divNavigation.appendChild(divPrev);
          var divPage = document.createElement('div');
          divPage.id = thisClass.recordingEntryID + '_header_navigation_page';
          divPage.className = 'recordings_header_navigation_page';
          divPage.innerText = paella.dictionary.translate('Page:');
          divNavigation.appendChild(divPage); // take care for the page buttons

          var spanBeforeSet = false;
          var spanAfterSet = false;
          var offsetPages = 2;

          for (i = 1; i <= maxPage; i++) {
            var divPageId = document.createElement('div');
            divPageId.id = thisClass.recordingEntryID + '_header_navigation_pageid_' + i;
            divPageId.className = 'recordings_header_navigation_pageid';

            if (!spanBeforeSet && currentPage >= 5 && i > 1 && currentPage - (offsetPages + 2) != 1) {
              divPageId.innerText = '...';
              i = currentPage - (offsetPages + 1);
              spanBeforeSet = true;
            } else if (!spanAfterSet && i - offsetPages > currentPage && maxPage - 1 > i && i > 4) {
              divPageId.innerText = '...';
              i = maxPage - 1;
              spanAfterSet = true;
            } else {
              if (i !== currentPage) {
                var divPageIdLink = document.createElement('a');
                divPageIdLink.param_offset = (i - 1) * params.limit;
                divPageIdLink.param_limit = params.limit;
                divPageIdLink.param_q = params.q;
                divPageIdLink.param_sid = params.sid;
                $(divPageIdLink).click(function (event) {
                  var params = {};
                  params.offset = this.param_offset;
                  params.limit = this.param_limit;
                  params.q = this.param_q;
                  params.sid = this.param_sid;
                  thisClass.doSearch(params, divList);
                });
                divPageIdLink.innerText = i;
                divPageId.appendChild(divPageIdLink);
              } else {
                divPageId.innerText = i;
              }
            }

            divNavigation.appendChild(divPageId);
          } // next link


          var divNext = document.createElement('div');
          divNext.id = thisClass.recordingEntryID + '_header_navigation_next';
          divNext.className = 'recordings_header_navigation_next';

          if (currentPage < maxPage) {
            var divNextLink = document.createElement('a');
            divNextLink.param_offset = currentPage * params.limit;
            divNextLink.param_limit = params.limit;
            divNextLink.param_q = params.q;
            divNextLink.param_sid = params.sid;
            $(divNextLink).click(function (event) {
              var params = {};
              params.offset = this.param_offset;
              params.limit = this.param_limit;
              params.q = this.param_q;
              params.sid = this.param_sid;
              thisClass.doSearch(params, divList);
            });
            divNextLink.innerText = paella.dictionary.translate('Next');
            divNext.appendChild(divNextLink);
          } else {
            divNext.innerText = paella.dictionary.translate('Next');
          }

          divNavigation.appendChild(divNext);
        } // create recording divs


        for (i = 0; i < results.length; ++i) {
          var recording = results[i];
          var divRecording = thisClass.createRecordingEntry(i, recording);
          divList.appendChild(divRecording);
        }
      }, null);
    } // finished loading


    thisClass.setLoading(false);
  },
  setLoading: function (loading) {
    if (loading == true) {
      this.divLoading.style.display = 'block';
    } else {
      this.divLoading.style.display = 'none';
    }
  },
  setResults: function (results) {
    this.divResults.innerText = results;
  },
  getUrlOfAttachmentWithType: function (recording, type) {
    for (var i = 0; i < recording.mediapackage.attachments.attachment.length; ++i) {
      var attachment = recording.mediapackage.attachments.attachment[i];

      if (attachment.type === type) {
        return attachment.url;
      }
    }

    return '';
  },
  createRecordingEntry: function (index, recording) {
    var rootID = this.recordingEntryID + index;
    var divEntry = document.createElement('div');
    divEntry.id = rootID;
    divEntry.className = 'recordings_entry ' + recording.entry_published_class;

    if (index % 2 == 1) {
      divEntry.className = divEntry.className + ' odd_entry';
    } else {
      divEntry.className = divEntry.className + ' even_entry';
    }

    var previewUrl = this.getUrlOfAttachmentWithType(recording, 'presentation/search+preview');

    if (previewUrl == '') {
      previewUrl = this.getUrlOfAttachmentWithType(recording, 'presenter/search+preview');
    }

    var divPreview = document.createElement('div');
    divPreview.id = rootID + '_preview_container';
    divPreview.className = 'recordings_entry_preview_container';
    var imgLink = document.createElement('a');
    imgLink.setAttribute('tabindex', '-1');
    imgLink.id = rootID + '_preview_link';
    imgLink.className = 'recordings_entry_preview_link';
    imgLink.href = 'watch.html?id=' + recording.id;
    var imgPreview = document.createElement('img');
    imgPreview.setAttribute('alt', '');
    imgPreview.setAttribute('title', recording.dcTitle);
    imgPreview.setAttribute('aria-label', recording.dcTitle);
    imgPreview.id = rootID + '_preview';
    imgPreview.src = previewUrl;
    imgPreview.className = 'recordings_entry_preview';
    imgLink.appendChild(imgPreview);
    divPreview.appendChild(imgLink);
    divEntry.appendChild(divPreview);
    var divResultText = document.createElement('div');
    divResultText.id = rootID + '_text_container';
    divResultText.className = 'recordings_entry_text_container'; // title

    var divResultTitleText = document.createElement('div');
    divResultTitleText.id = rootID + '_text_title_container';
    divResultTitleText.className = 'recordings_entry_text_title_container';
    var titleResultText = document.createElement('a');
    titleResultText.setAttribute('tabindex', '-1');
    titleResultText.id = rootID + '_text_title';
    titleResultText.innerText = recording.dcTitle;
    titleResultText.className = 'recordings_entry_text_title';
    titleResultText.href = 'watch.html?id=' + recording.id;
    divResultTitleText.appendChild(titleResultText);
    divResultText.appendChild(divResultTitleText); // author

    var author = '&nbsp;';
    var author_search = '';

    if (recording.dcCreator) {
      author = 'by ' + recording.dcCreator;
      author_search = recording.dcCreator;
    }

    var divResultAuthorText = document.createElement('div');
    divResultAuthorText.id = rootID + '_text_author_container';
    divResultAuthorText.className = 'recordings_entry_text_author_container';
    var authorResultText = document.createElement('a');
    authorResultText.setAttribute('tabindex', '-1');
    authorResultText.id = rootID + '_text_title';
    authorResultText.innerText = author;
    authorResultText.className = 'recordings_entry_text_title';

    if (author_search != '') {
      authorResultText.href = 'index.html?q=' + encodeURIComponent(author_search);
    }

    divResultAuthorText.appendChild(authorResultText);
    divResultText.appendChild(divResultAuthorText); // date time
    //var timeDate = recording.mediapackage.start;

    var timeDate = recording.dcCreated;

    if (timeDate) {
      var offsetHours = parseInt(timeDate.substring(20, 22), 10);
      var offsetMinutes = parseInt(timeDate.substring(23, 25), 10);

      if (timeDate.substring(19, 20) == '-') {
        offsetHours = -offsetHours;
        offsetMinutes = -offsetMinutes;
      }

      var sd = new Date();
      sd.setUTCFullYear(parseInt(timeDate.substring(0, 4), 10));
      sd.setUTCMonth(parseInt(timeDate.substring(5, 7), 10) - 1);
      sd.setUTCDate(parseInt(timeDate.substring(8, 10), 10));
      sd.setUTCHours(parseInt(timeDate.substring(11, 13), 10) - offsetHours);
      sd.setUTCMinutes(parseInt(timeDate.substring(14, 16), 10) - offsetMinutes);
      sd.setUTCSeconds(parseInt(timeDate.substring(17, 19), 10));
      timeDate = sd.toLocaleString();
    } else {
      timeDate = 'n.a.';
    }

    var divResultDateText = document.createElement('div');
    divResultDateText.id = rootID + '_text_date';
    divResultDateText.className = 'recordings_entry_text_date';
    divResultDateText.innerText = timeDate;
    divResultText.appendChild(divResultDateText);
    divEntry.appendChild(divResultText);
    divEntry.setAttribute('tabindex', '10000');
    $(divEntry).keyup(function (event) {
      if (event.keyCode == 13) {
        window.location.href = 'watch.html?id=' + recording.id;
      }
    });
    divEntry.setAttribute('alt', '');
    divEntry.setAttribute('title', recording.dcTitle);
    divEntry.setAttribute('aria-label', recording.dcTitle);
    return divEntry;
  }
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
// #DCE override of modules/engage-paella-player/src/main/paella-opencast/plugins/es.upv.paella.opencast.loader/01_prerequisites.js
// Override for DCE auth and getting series from engage search (vs series remote)
class Opencast {
  constructor() {
    this._me = undefined, this._episode = undefined, this._series = undefined, this._acl = undefined;
  }

  getUserInfo() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self._me) {
        resolve(self._me);
      } else {
        base.ajax.get({
          url: '/info/me.json'
        }, function (data, contentType, code) {
          self._me = data;
          resolve(data);
        }, function (data, contentType, code) {
          reject();
        });
      }
    });
  }

  getEpisode() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self._episode) {
        resolve(self._episode);
      } else {
        var episodeId = paella.utils.parameters.get('id');
        base.ajax.get({
          url: '/search/episode.json',
          params: {
            'id': episodeId
          }
        }, function (data, contentType, code) {
          //#DCE auth result check
          var jsonData = data;
          if (typeof jsonData == "string") jsonData = JSON.parse(jsonData); // test if result is Harvard auth or episode data

          if (!self.isHarvardDceAuthOk(jsonData)) {
            reject(jsonData);
            return; // #DCE no more action here the redirect in the reject path reloads page
          } // #DCE end auth check
          // #DCE verify that results returned at least one episode


          var totalItems = parseInt(data['search-results'].total);

          if (totalItems === 0) {
            // #DCE OPC-374 allow catch to show the message to user
            //self.showLoadErrorMessage(paella.dictionary.translate("No recordings found for episode id") + ": \"" + episodeId + "\"");
            // #DCE OPC-374 passing magic number 0 for no results found
            reject(totalItems);
          } // #DCE end total check


          if (data['search-results'].result) {
            self._episode = data['search-results'].result; // #DCE set logger helper

            self.setHarvardDCEresourceId(self._episode);
            resolve(self._episode);
          } else {
            reject();
          }
        }, function (data, contentType, code) {
          reject();
        });
      }
    });
  }

  getSeries() {
    var self = this;
    return this.getEpisode().then(function (episode) {
      return new Promise((resolve, reject) => {
        if (self._series) {
          resolve(self.series);
        } else {
          var serie = episode.mediapackage.series;

          if (serie != undefined) {
            // #DCE use search/series instead of series endpoint directly
            self.searchSeriesToSeriesSeries(serie, function (data, contentType, code) {
              self._series = data;
              resolve(self._series);
            }, // #DCE end
            function (data, contentType, code) {
              reject();
            });
          } else {
            reject();
          }
        }
      });
    });
  }

  getACL() {
    var self = this;
    return this.getEpisode().then(function (episode) {
      return new Promise((resolve, reject) => {
        var serie = episode.mediapackage.series;

        if (serie != undefined) {
          base.ajax.get({
            url: '/series/' + serie + '/acl.json'
          }, function (data, contentType, code) {
            self._acl = data;
            resolve(self._acl);
          }, function (data, contentType, code) {
            reject();
          });
        } else {
          reject();
        }
      });
    });
  } // ------------------------------------------------------------
  // #DCE(naomi): start of dce auth addition


  isHarvardDceAuthOk(jsonData) {
    // check that search-results are ok
    var resultsAvailable = jsonData !== undefined && jsonData['search-results'] !== undefined && jsonData['search-results'].total !== undefined; // if search-results not ok, maybe auth-results?

    if (resultsAvailable === false) {
      var authResultsAvailable = jsonData !== undefined && jsonData['dce-auth-results'] !== undefined && jsonData['dce-auth-results'].dceReturnStatus !== undefined; // auth-results not present, some other error

      if (authResultsAvailable === false) {
        paella.debug.log("Seach failed, response:  " + jsonData);
        var message = "Cannot access specified video; authorization failed (" + jsonData + ")";
        paella.messageBox.showError(message);
        $(document).trigger(paella.events.error, {
          error: message
        });
      } // (MATT-2212) DCE auth redirect is performed within the getEpisode() failure path (via isHarvardDceAuthRedirect below)


      return false;
    } else {
      return true;
    }
  } // This method is used when getEpisode fails in order to determine if auth redirect is possible (MATT-2212)


  doHarvardDceAuthRedirect(jsonData) {
    if (jsonData && jsonData['dce-auth-results']) {
      var authResult = jsonData['dce-auth-results'];

      if (authResult && authResult.dceReturnStatus) {
        var returnStatus = authResult.dceReturnStatus;

        if (("401" == returnStatus || "403" == returnStatus) && authResult.dceLocation) {
          window.location.replace(authResult.dceLocation);
        } else {
          var message = "Cannot access specified video; authorization failed (" + authResult.dceErrorMessage + ")";
          paella.debug.log(message);
          paella.messageBox.showError(message);
          $(document).trigger(paella.events.error, {
            error: message
          });
        }
      }
    }
  } // #DCE(naomi): end of dce auth addition
  // ------------------------------------------------------------
  // #DCE(gregLogan): start of get resourceId for usertracking "logging helper code"


  setHarvardDCEresourceId(result) {
    var type,
        offeringId = "";

    if (result != undefined) {
      if (result.dcIsPartOf != undefined) {
        offeringId = result.dcIsPartOf.toString();
      }

      if (result.dcType != undefined) {
        type = result.dcType.toString();
      }
    }

    if (offeringId && type) {
      paella.opencast.resourceId = (offeringId.length >= 11 ? "/" + offeringId.substring(0, 4) + "/" + offeringId.substring(4, 6) + "/" + offeringId.substring(6, 11) + "/" : "") + type;
    } else {
      paella.opencast.resourceId = "";
    }
  } // #DCE(greg): end of usertracking param set helper
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // #DCE(karen): START, get search/series and tranform result into series/series format
  // This tranforms the series data into the expected upstream series format


  searchSeriesToSeriesSeries(serie, onSuccess, onError) {
    base.ajax.get({
      url: '/search/series.json',
      params: {
        'id': serie
      }
    }, function (data, contentType, code) {
      var jsonData = data;

      try {
        if (typeof jsonData == "string") jsonData = JSON.parse(jsonData);
      } catch (e) {
        showLoadErrorMessage(paella.dictionary.translate("Unable to parse series id") + "\"" + serie + "\" data: " + data);

        if (typeof onError == 'function') {
          onError();
        }

        return;
      } // #DCE verify that results returned at least one series


      var totalItems = parseInt(jsonData['search-results'].total);

      if (totalItems === 0) {
        showLoadErrorMessage(paella.dictionary.translate("No series found for series id") + ": \"" + serie + "\"");

        if (typeof onError == 'function') {
          onError();
        }

        return;
      } else {
        var dcObject = {};
        var seriesResult = jsonData['search-results'].result;

        for (var key in seriesResult) {
          // trim out "dc" and lower case first letter
          var keyTrimmed = key.replace(/^dc/, '');
          keyTrimmed = keyTrimmed.charAt(0).toLowerCase() + keyTrimmed.slice(1);
          dcObject[keyTrimmed] = [{
            "value": seriesResult[key]
          }];
        }

        if (typeof onSuccess == 'function') {
          onSuccess(dcObject);
        }
      }
    });
  } // #DCE(karen): END transform series format
  // ------------------------------------------------------------
  //#DCE start show not found error


  showLoadErrorMessage(message) {
    paella.messageBox.showError(message);
    $(document).trigger(paella.events.error, {
      error: message
    });
  } //#DCE end show not found error
  // -----------------------------------------------------------


} // Patch to work with MH jetty server.


base.ajax.send = function (type, params, onSuccess, onFail) {
  this.assertParams(params);
  var ajaxObj = jQuery.ajax({
    url: params.url,
    data: params.params,
    cache: false,
    type: type
  });

  if (typeof onSuccess == 'function') {
    ajaxObj.done(function (data, textStatus, jqXHR) {
      var contentType = jqXHR.getResponseHeader('content-type');
      onSuccess(data, contentType, jqXHR.status, jqXHR.responseText);
    });
  }

  if (typeof onFail == 'function') {
    ajaxObj.fail(function (jqXHR, textStatus, error) {
      var data = jqXHR.responseText;
      var contentType = jqXHR.getResponseHeader('content-type');

      if (jqXHR.status == 200 && typeof jqXHR.responseText == 'string') {
        try {
          data = JSON.parse(jqXHR.responseText);
        } catch (e) {
          onFail(textStatus + ' : ' + error, 'text/plain', jqXHR.status, jqXHR.responseText);
        }

        onSuccess(data, contentType, jqXHR.status, jqXHR.responseText);
      } else {
        onFail(textStatus + ' : ' + error, 'text/plain', jqXHR.status, jqXHR.responseText);
      }
    });
  }
};
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */

/*

User login, data and permissions: paella.AccessControl

Extend paella.AccessControl and implement the checkAccess method:

#DCE OPC-357 override me info structure for OCv5x 

*/

/*global paella_DeferredResolved*/
class OpencastAccessControl extends paella.AccessControl {
  constructor() {
    super();
    this._read = undefined, this._write = undefined, this._userData = undefined;
  }

  getName() {
    return 'es.upv.paella.opencast.OpencastAccessControl';
  }

  canRead() {
    return paella.opencast.getEpisode().then(() => {
      return paella_DeferredResolved(true);
    }).catch(() => {
      return paella_DeferredResolved(false);
    });
  }

  canWrite() {
    return paella.opencast.getUserInfo().then(function (me) {
      return paella.opencast.getACL().then(function (acl) {
        var canWrite = false;
        var roles = me.roles;

        if (!(roles instanceof Array)) {
          roles = [roles];
        }

        if (acl.acl && acl.acl.ace) {
          var aces = acl.acl.ace;

          if (!(aces instanceof Array)) {
            aces = [aces];
          }

          roles.some(function (currentRole) {
            if (currentRole == me.org.adminRole) {
              canWrite = true;
            } else {
              aces.some(function (currentAce) {
                if (currentRole == currentAce.role) {
                  if (currentAce.action == 'write') {
                    canWrite = true;
                  }
                }

                return canWrite == true;
              });
            }

            return canWrite == true;
          });
        }

        return paella_DeferredResolved(canWrite);
      });
    });
  }

  userData() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self._userData) {
        resolve(self._userData);
      } else {
        paella.opencast.getUserInfo().then(function (me) {
          var isAnonymous = me.roles.length == 1 && me.roles[0] == me.org.anonymousRole;
          self._userData = {
            // #DCE OPC-357 override for me.username OCv5x
            username: me.username || me.user.username,
            name: me.name || me.username || me.user.name || me.user.username || '',
            // end #DCE override
            avatar: paella.utils.folders.resources() + '/images/default_avatar.png',
            isAnonymous: isAnonymous
          };
          resolve(self._userData);
        }, function () {
          reject();
        });
      }
    });
  }

  getAuthenticationUrl(callbackParams) {
    return 'auth.html?redirect=' + encodeURIComponent(window.location.href);
  }

}
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
class OpencastToPaellaConverter {
  constructor() {
    // #DCE From upstream pull #1064 (for OPC-389 pesenter as master)
    this._config = paella.player.config.plugins.list['es.upv.paella.opencast.loader'] || {};
    this._orderTracks = this._config.orderTracks || ['presenter/delivery', 'presenter/preview', 'presentation/delivery', 'presentation/preview'];
  }

  getFilterStream() {
    var filterStream;
    var streams = this._config.streams || [];
    streams.some(function (curretStream) {
      return curretStream.filter.system.some(function (currentFilter) {
        if (currentFilter == '*' || base.userAgent.system[currentFilter]) {
          filterStream = curretStream;
          return true;
        }
      });
    });

    if (!filterStream) {
      filterStream = {
        'filter': {
          'system': ['*']
        },
        'tracks': {
          'flavors': ['*/*'],
          'tags': ['*']
        }
      };
    }

    return filterStream;
  }

  getAudioTagConfig() {
    return this._config.audioTag || {
      '*/*': '*'
    };
  }

  getSourceTypeFromTrack(track) {
    var sourceType = null;
    var protocol = /^(.*):\/\/.*$/.exec(track.url);

    if (protocol) {
      switch (protocol[1]) {
        case 'rtmp':
        case 'rtmps':
          switch (track.mimetype) {
            case 'video/mp4':
            case 'video/ogg':
            case 'video/webm':
            case 'video/x-flv':
              sourceType = 'rtmp';
              break;

            default:
              paella.debug.log(`OpencastToPaellaConverter: MimeType (${track.mimetype}) not supported!`);
              break;
          }

          break;

        case 'http':
        case 'https':
          switch (track.mimetype) {
            case 'video/mp4':
            case 'video/ogg':
            case 'video/webm':
              sourceType = track.mimetype.split('/')[1];
              break;

            case 'video/x-flv':
              sourceType = 'flv';
              break;

            case 'application/x-mpegURL':
              sourceType = 'hls';
              break;

            case 'application/dash+xml':
              sourceType = 'mpd';
              break;

            case 'audio/m4a':
              sourceType = 'audio';
              break;

            default:
              paella.debug.log(`OpencastToPaellaConverter: MimeType (${track.mimetype}) not supported!`);
              break;
          }

          break;

        default:
          paella.debug.log(`OpencastToPaellaConverter: Protocol (${protocol[1]}) not supported!`);
          break;
      }
    }

    return sourceType;
  }

  getStreamSourceFromTrack(track) {
    var res = new Array(0, 0); // #DCE OPC-357-HLS-VOD
    // The special DCE "master" tagged track (top level HLS index) contains
    // sub tracks and no resolution attribute at the top level.

    if (track.video instanceof Object) {
      if (!track.master) {
        res = track.video.resolution.split('x');
      } // #DCE OPC-357-HLS-VOD, parse sub-video data from the speical "master" tagged track
      // The other HLS flavored tracks must eventually be ignored when master track exists
      else if (track.video[0]) {
          // multiple resolutions/streams within "master" track
          let cnt = Object.keys(track.video);

          for (var i = 0; i < cnt.length; i++) {
            let tmpres = track.video[i].resolution.split('x');

            if (parseInt(tmpres[0]) > parseInt(res[0])) {
              // pick largest
              res = tmpres;
            }
          }
        }
    } //#DCE end


    var src = track.url;
    var urlSplitRtmp = /^(rtmps?:\/\/[^/]*\/[^/]*)\/(.*)$/.exec(track.url);

    if (urlSplitRtmp != null) {
      var rtmp_server = urlSplitRtmp[1];
      var rtmp_stream = urlSplitRtmp[2];
      src = {
        server: encodeURIComponent(rtmp_server),
        stream: encodeURIComponent(rtmp_stream)
      };
    } // #DCE source.master identifies that track as containing an HLS master index
    // not to be confused with former Paella master-slave terminology


    var source = {
      master: track.master === true,
      //#DCE OPC-357-HLS-VOD
      role: track.role,
      //#DCE OPC-393 load presenter as master role (i.e. main audio track)
      src: src,
      isLiveStream: track.live === true
    };

    if (track.video) {
      source.mimetype = track.mimetype;
      source.res = {
        w: res[0],
        h: res[1]
      };
    }

    return source;
  }

  getAudioTagFromTrack(currentTrack) {
    let audioTagConfig = this.getAudioTagConfig();
    let audioTag;
    let tags = [];

    if (currentTrack.tags && currentTrack.tags.tag) {
      tags = currentTrack.tags.tag;

      if (!(tags instanceof Array)) {
        tags = [tags];
      }
    }

    tags.some(function (tag) {
      if (tag.startsWith('audioTag:')) {
        audioTag = tag.slice(9);
        return true;
      }
    });

    if (!audioTag) {
      Object.entries(audioTagConfig).some(function (atc) {
        let sflavor = currentTrack.type.split('/');
        let smask = atc[0].split('/');

        if ((smask[0] == '*' || smask[0] == sflavor[0]) && (smask[1] == '*' || smask[1] == sflavor[1])) {
          audioTag = atc[1] == '*' ? base.dictionary.currentLanguage() : atc[1];
          return true;
        }
      });
    }

    return audioTag;
  } // #DCE OPC-357-HLS-VOD


  findPreferredStream(streams) {
    try {
      if (Object.keys(streams.sources).indexOf("hls") > -1) {
        let master = null;
        streams.sources["hls"].forEach(function (s) {
          console.log(s);

          if (s['master']) {
            master = s;
          } // Look for a playlist with attribute 'master' set from Opencast


          if (!first) {
            first = s;
          }
        });

        if (master) {
          streams.sources["hls"] = [];
          streams.sources["hls"].push(master); // Display only the master playlist
        }

        if (streams.sources["mp4"]) {
          // Remove the mp4 (i.e. other HLS segments) regardless if 'master' was found
          delete streams.sources["mp4"];
        }
      }
    } catch (e) {
      console.log("Cannot filter videosource for HLS");
    }

    return streams;
  } // #DCE end

  /**
   * Extract a stream identified by a given flavor from the media packages track list and try to find a corresponding
   * image attachment for the selected track.
   * @param episode   result structure from search service
   * @param flavor    flavor used for track selection
   * @param subFlavor subflavor used for track selection
   */


  getStreamFromFlavor(episode, flavor, subFlavor) {
    let hasSpecialDceMasterHlsIndexTrack = false; // #DCE OPC-357

    var currentStream = {
      sources: {},
      preview: '',
      content: flavor,
      dceBlankAudio: false // #DCE OPC-389

    };
    var tracks = episode.mediapackage.media.track;
    var attachments = episode.mediapackage.attachments.attachment;

    if (!(tracks instanceof Array)) {
      tracks = tracks ? [tracks] : [];
    }

    if (!(attachments instanceof Array)) {
      attachments = attachments ? [attachments] : [];
    } // Read the tracks!!


    tracks.forEach(currentTrack => {
      if (currentTrack.type == flavor + '/' + subFlavor) {
        var sourceType = this.getSourceTypeFromTrack(currentTrack);

        if (sourceType) {
          if (!currentStream.sources[sourceType] || !(currentStream.sources[sourceType] instanceof Array)) {
            currentStream.sources[sourceType] = [];
          } // #DCE OPC-389 special audio tag fix for old publications with audio on presenter but a blank audio on presentation track.
          // From config: audio required tag ~= 'multiaudio', audio tag required flavor ~= 'presentation/delivery'


          let dceAudioTag = paella.player.config.dceRequiredAudioTag;
          let dceAudioFlavor = paella.player.config.dceRequiredAudioTagFlavor;
          let dceIsAudioTagRequiredFlavor = currentTrack.type === dceAudioFlavor;
          let dceIsMissingAudioTag = currentTrack.tags && currentTrack.tags.tag && !currentTrack.tags.tag.contains(dceAudioTag);
          let dceRoleMasterDefaultFlavor = paella.player.config.dceRoleMasterDefaultFlavor;

          if (dceIsAudioTagRequiredFlavor && dceIsMissingAudioTag) {
            base.log.debug(`Removing blank audio attribute from source '${dceAudioFlavor}' because it does not have tag '${dceAudioTag}'`);
            currentTrack.audio = null;
            currentStream.dceBlankAudio = true; // #DCE OPC-389

            paella.dce.blankAudio = true; // #DCE OPC-407 to prevent single video toggle on blank audio
          } // #DCE OPC-393 always make "presenter" flavor the role: master video (i.e. main audio track)


          if (flavor === dceRoleMasterDefaultFlavor) {
            base.log.debug(`LOAD: found master role '${currentTrack.type}'`);
            currentStream.role = "master";
          } // end #DCE OPC-389 and OPC-393


          if (currentTrack.master) {
            //#DCE OPC-357
            hasSpecialDceMasterHlsIndexTrack = true;
          }

          if (currentTrack.audio) {
            currentStream.audioTag = this.getAudioTagFromTrack(currentTrack);
          }

          currentStream.sources[sourceType].push(this.getStreamSourceFromTrack(currentTrack));

          if (currentTrack.video) {
            currentStream.type = 'video';
          } else if (currentTrack.audio) {
            currentStream.type = 'audio';
          }
        }
      }
    }); // #DCE OPC-357, Where there's a master HLS index, remove all non-master HLS sources

    if (hasSpecialDceMasterHlsIndexTrack && currentStream.sources.hls) {
      var filteredHls = currentStream.sources.hls.filter(track => track.master);
      currentStream.sources.hls = filteredHls;
    } // Read the attachments


    var duration = parseInt(episode.mediapackage.duration / 1000);
    var imageSource = {
      type: 'image/jpeg',
      frames: {},
      count: 0,
      duration: duration,
      res: {
        w: 320,
        h: 180
      }
    };
    var imageSourceHD = {
      type: 'image/jpeg',
      frames: {},
      count: 0,
      duration: duration,
      res: {
        w: 1280,
        h: 720
      }
    };
    attachments.forEach(currentAttachment => {
      if (currentAttachment.type == `${flavor}/player+preview`) {
        currentStream.preview = currentAttachment.url;
      } else if (currentAttachment.type == `${flavor}/segment+preview+hires`) {
        if (/time=T(\d+):(\d+):(\d+)/.test(currentAttachment.ref)) {
          time = parseInt(RegExp.$1) * 60 * 60 + parseInt(RegExp.$2) * 60 + parseInt(RegExp.$3);
          imageSourceHD.frames['frame_' + time] = currentAttachment.url;
          imageSourceHD.count = imageSourceHD.count + 1;
        }
      } else if (currentAttachment.type == `${flavor}/segment+preview`) {
        if (/time=T(\d+):(\d+):(\d+)/.test(currentAttachment.ref)) {
          var time = parseInt(RegExp.$1) * 60 * 60 + parseInt(RegExp.$2) * 60 + parseInt(RegExp.$3);
          imageSource.frames['frame_' + time] = currentAttachment.url;
          imageSource.count = imageSource.count + 1;
        }
      }
    });
    var imagesArray = [];

    if (imageSource.count > 0) {
      imagesArray.push(imageSource);
    }

    if (imageSourceHD.count > 0) {
      imagesArray.push(imageSourceHD);
    }

    if (imagesArray.length > 0) {
      currentStream.sources.image = imagesArray;
    }

    return currentStream;
  }

  getContentToImport(episode) {
    var filterStream = this.getFilterStream();
    var flavors = [];
    var tracks = episode.mediapackage.media.track;

    if (!(tracks instanceof Array)) {
      tracks = [tracks];
    }

    tracks.forEach(currentTrack => {
      let importF = filterStream.tracks.flavors.some(function (cFlavour) {
        let smask = cFlavour.split('/');
        let sflavour = currentTrack.type.split('/');
        return (smask[0] == '*' || smask[0] == sflavour[0]) && (smask[1] == '*' || smask[1] == sflavour[1]);
      });
      let importT = false;
      let tags = [];

      if (currentTrack.tags && currentTrack.tags.tag) {
        tags = currentTrack.tags.tag;

        if (!(tags instanceof Array)) {
          tags = [tags];
        }
      }

      importT = filterStream.tracks.tags.some(function (cTag) {
        return cTag == '*' || tags.some(function (t) {
          return cTag == t;
        });
      });

      if (importF || importT) {
        if (flavors.indexOf(currentTrack.type) < 0) {
          flavors.push(currentTrack.type);
        }
      }
    }); // #DCE From upstream pull #1064 (for OPC-389 pesenter as master)
    // Sort the streams

    for (let i = this._orderTracks.length - 1; i >= 0; i--) {
      let flavor = this._orderTracks[i];

      if (flavors.indexOf(flavor) > 0) {
        flavors.splice(flavors.indexOf(flavor), 1);
        flavors.unshift(flavor);
      }
    }

    return flavors;
  }

  getStreams(episode) {
    // Get the streams
    var paellaStreams = [];
    var flavors = this.getContentToImport(episode);
    flavors.forEach(flavorStr => {
      var [flavor, subFlavor] = flavorStr.split('/');
      var stream = this.getStreamFromFlavor(episode, flavor, subFlavor);
      paellaStreams.push(stream);
    }); // #DCE OPC-357-HLS-VOD - Look for HLS, use master playlist only if it exists
    // otherwise use any HLS playlists, if no playlist, use mp4s
    // this.findPreferredStream(paellaStreams);

    return paellaStreams;
  }

  getCaptions(episode) {
    var captions = [];
    var attachments = episode.mediapackage.attachments.attachment;
    var catalogs = episode.mediapackage.metadata.catalog;

    if (!(attachments instanceof Array)) {
      attachments = attachments ? [attachments] : [];
    }

    if (!(catalogs instanceof Array)) {
      catalogs = catalogs ? [catalogs] : [];
    } // Read the attachments


    attachments.forEach(currentAttachment => {
      try {
        let captions_regex = /^captions\/([^+]+)(\+(.+))?/g;
        let captions_match = captions_regex.exec(currentAttachment.type);

        if (captions_match) {
          let captions_format = captions_match[1];
          let captions_lang = captions_match[3]; // TODO: read the lang from the dfxp file
          //if (captions_format == "dfxp") {}

          if (!captions_lang && currentAttachment.tags && currentAttachment.tags.tag) {
            if (!(currentAttachment.tags.tag instanceof Array)) {
              currentAttachment.tags.tag = [currentAttachment.tags.tag];
            }

            currentAttachment.tags.tag.forEach(tag => {
              if (tag.startsWith('lang:')) {
                let split = tag.split(':');
                captions_lang = split[1];
              }
            });
          } // #DCE OPC-374 fall back lang TODO: submit to upstream


          captions_lang = captions_lang || paella.player.config.defaultCaptionLang;
          let captions_label = captions_lang || 'unknown language'; //base.dictionary.translate("CAPTIONS_" + captions_lang);

          captions.push({
            id: currentAttachment.id,
            lang: captions_lang,
            text: captions_label,
            url: currentAttachment.url,
            format: captions_format
          });
        }
      } catch (err) {
        /**/
      }
    }); // #DCE OPC-351 TEMP fix to ignore catalog captions when attachement captions exist

    if (captions.length > 0) {
      return captions;
    } // Read the catalogs


    catalogs.forEach(currentCatalog => {
      try {
        // backwards compatibility:
        // Catalogs flavored as 'captions/timedtext' are assumed to be dfxp
        if (currentCatalog.type == 'captions/timedtext') {
          let captions_lang;

          if (currentCatalog.tags && currentCatalog.tags.tag) {
            if (!(currentCatalog.tags.tag instanceof Array)) {
              currentCatalog.tags.tag = [currentCatalog.tags.tag];
            }

            currentCatalog.tags.tag.forEach(tag => {
              if (tag.startsWith('lang:')) {
                let split = tag.split(':');
                captions_lang = split[1];
              }
            });
          } // #DCE OPC-374 fall back lang TODO: submit to upstream


          captions_lang = captions_lang || paella.player.config.defaultCaptionLang;
          let captions_label = captions_lang || 'unknown language';
          captions.push({
            id: currentCatalog.id,
            lang: captions_lang,
            text: captions_label,
            url: currentCatalog.url,
            format: 'dfxp'
          });
        }
      } catch (err) {
        /**/
      }
    });
    return captions;
  }

  getSegments(episode) {
    var segments = [];
    var attachments = episode.mediapackage.attachments.attachment;

    if (!(attachments instanceof Array)) {
      attachments = attachments ? [attachments] : [];
    } // Read the attachments


    var opencastFrameList = {};
    attachments.forEach(currentAttachment => {
      try {
        if (currentAttachment.type == 'presentation/segment+preview+hires') {
          if (/time=T(\d+):(\d+):(\d+)/.test(currentAttachment.ref)) {
            time = parseInt(RegExp.$1) * 60 * 60 + parseInt(RegExp.$2) * 60 + parseInt(RegExp.$3);

            if (!opencastFrameList[time]) {
              opencastFrameList[time] = {
                id: 'frame_' + time,
                mimetype: currentAttachment.mimetype,
                time: time,
                url: currentAttachment.url,
                thumb: currentAttachment.url
              };
            }

            opencastFrameList[time].url = currentAttachment.url;
          }
        } else if (currentAttachment.type == 'presentation/segment+preview') {
          if (/time=T(\d+):(\d+):(\d+)/.test(currentAttachment.ref)) {
            var time = parseInt(RegExp.$1) * 60 * 60 + parseInt(RegExp.$2) * 60 + parseInt(RegExp.$3);

            if (!opencastFrameList[time]) {
              opencastFrameList[time] = {
                id: 'frame_' + time,
                mimetype: currentAttachment.mimetype,
                time: time,
                url: currentAttachment.url,
                thumb: currentAttachment.url
              };
            }

            opencastFrameList[time].thumb = currentAttachment.url;
          }
        }
      } catch (err) {
        /**/
      }
    });
    Object.keys(opencastFrameList).forEach((key, index) => {
      segments.push(opencastFrameList[key]);
    });
    return segments;
  }

  getPreviewImage(episode) {
    let presenterPreview;
    let presentationPreview;
    let otherPreview;
    var attachments = episode.mediapackage.attachments.attachment;

    if (!(attachments instanceof Array)) {
      attachments = attachments ? [attachments] : [];
    }

    attachments.forEach(currentAttachment => {
      if (currentAttachment.type == 'presenter/player+preview') {
        presenterPreview = currentAttachment.url;
      }

      if (currentAttachment.type == 'presentation/player+preview') {
        presentationPreview = currentAttachment.url;
      }

      if (currentAttachment.type.endsWith('/player+preview')) {
        otherPreview = currentAttachment.url;
      }
    }); // #DCE OPC-354 DCE uploads to presenter Preview, prefer presenter over presentation preview

    return presenterPreview || presentationPreview || otherPreview;
  }

  convertToDataJson(episode) {
    var streams = this.getStreams(episode);
    var captions = this.getCaptions(episode);
    var segments = this.getSegments(episode);
    var data = {
      metadata: {
        title: episode.mediapackage.title,
        duration: episode.mediapackage.duration / 1000,
        preview: this.getPreviewImage(episode)
      },
      streams: streams,
      frameList: segments,
      captions: captions
    };
    return data;
  }

}
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
class MHAnnotationServiceDefaultDataDelegate extends paella.DataDelegate {
  constructor() {
    super();
  }

  read(context, params, onSuccess) {
    var episodeId = params.id;
    paella.ajax.get({
      url: '/annotation/annotations.json',
      params: {
        episode: episodeId,
        type: 'paella/' + context
      }
    }, function (data, contentType, returnCode) {
      var annotations = data.annotations.annotation;

      if (!(annotations instanceof Array)) {
        annotations = [annotations];
      }

      if (annotations.length > 0) {
        if (annotations[0] && annotations[0].value !== undefined) {
          var value = annotations[0].value;

          try {
            value = JSON.parse(value);
          } catch (err) {
            /**/
          }

          if (onSuccess) onSuccess(value, true);
        } else {
          if (onSuccess) onSuccess(undefined, false);
        }
      } else {
        if (onSuccess) onSuccess(undefined, false);
      }
    }, function (data, contentType, returnCode) {
      onSuccess(undefined, false);
    });
  }

  write(context, params, value, onSuccess) {
    var thisClass = this;
    var episodeId = params.id;
    if (typeof value == 'object') value = JSON.stringify(value);
    paella.ajax.get({
      url: '/annotation/annotations.json',
      params: {
        episode: episodeId,
        type: 'paella/' + context
      }
    }, function (data, contentType, returnCode) {
      var annotations = data.annotations.annotation;

      if (annotations == undefined) {
        annotations = [];
      }

      if (!(annotations instanceof Array)) {
        annotations = [annotations];
      }

      if (annotations.length == 0) {
        paella.ajax.put({
          url: '/annotation/',
          params: {
            episode: episodeId,
            type: 'paella/' + context,
            value: value,
            'in': 0
          }
        }, function (data, contentType, returnCode) {
          onSuccess({}, true);
        }, function (data, contentType, returnCode) {
          onSuccess({}, false);
        });
      } else if (annotations.length == 1) {
        var annotationId = annotations[0].annotationId;
        paella.ajax.put({
          url: '/annotation/' + annotationId,
          params: {
            value: value
          }
        }, function (data, contentType, returnCode) {
          onSuccess({}, true);
        }, function (data, contentType, returnCode) {
          onSuccess({}, false);
        });
      } else if (annotations.length > 1) {
        thisClass.remove(context, params, function (notUsed, removeOk) {
          if (removeOk) {
            thisClass.write(context, params, value, onSuccess);
          } else {
            onSuccess({}, false);
          }
        });
      }
    }, function (data, contentType, returnCode) {
      onSuccess({}, false);
    });
  }

  remove(context, params, onSuccess) {
    var episodeId = params.id;
    paella.ajax.get({
      url: '/annotation/annotations.json',
      params: {
        episode: episodeId,
        type: 'paella/' + context
      }
    }, function (data, contentType, returnCode) {
      var annotations = data.annotations.annotation;

      if (annotations) {
        if (!(annotations instanceof Array)) {
          annotations = [annotations];
        }

        var asyncLoader = new paella.AsyncLoader();

        for (var i = 0; i < annotations.length; ++i) {
          var annotationId = data.annotations.annotation.annotationId;
          asyncLoader.addCallback(new paella.JSONCallback({
            url: '/annotation/' + annotationId
          }, 'DELETE'));
        }

        asyncLoader.load(function () {
          if (onSuccess) {
            onSuccess({}, true);
          }
        }, function () {
          onSuccess({}, false);
        });
      } else {
        if (onSuccess) {
          onSuccess({}, true);
        }
      }
    }, function (data, contentType, returnCode) {
      if (onSuccess) {
        onSuccess({}, false);
      }
    });
  }

}

class MHAnnotationServiceTrimmingDataDelegate extends MHAnnotationServiceDefaultDataDelegate {
  constructor() {
    super();
  }

  read(context, params, onSuccess) {
    super.read(context, params, function (data, success) {
      if (success) {
        if (data.trimming) {
          if (onSuccess) {
            onSuccess(data.trimming, success);
          }
        } else {
          if (onSuccess) {
            onSuccess(data, success);
          }
        }
      } else {
        if (onSuccess) {
          onSuccess(data, success);
        }
      }
    });
  }

  write(context, params, value, onSuccess) {
    super.write(context, params, {
      trimming: value
    }, onSuccess);
  }

}

class MHFootPrintsDataDelegate extends paella.DataDelegate {
  constructor() {
    super();
  }

  read(context, params, onSuccess) {
    var episodeId = params.id;
    paella.ajax.get({
      url: '/usertracking/footprint.json',
      params: {
        id: episodeId
      }
    }, function (data, contentType, returnCode) {
      if (returnCode == 200 && contentType == 'application/json') {
        var footPrintsData = data.footprints.footprint;

        if (data.footprints.total == '1') {
          footPrintsData = [footPrintsData];
        }

        if (onSuccess) {
          onSuccess(footPrintsData, true);
        }
      } else {
        if (onSuccess) {
          onSuccess({}, false);
        }
      }
    }, function (data, contentType, returnCode) {
      if (onSuccess) {
        onSuccess({}, false);
      }
    });
  }

  write(context, params, value, onSuccess) {
    var episodeId = params.id;
    paella.ajax.get({
      url: '/usertracking/',
      params: {
        _method: 'PUT',
        id: episodeId,
        type: 'FOOTPRINT',
        in: value.in,
        out: value.out
      }
    }, function (data, contentType, returnCode) {
      var ret = false;

      if (returnCode == 201) {
        ret = true;
      }

      if (onSuccess) {
        onSuccess({}, ret);
      }
    }, function (data, contentType, returnCode) {
      if (onSuccess) {
        onSuccess({}, false);
      }
    });
  }

}

class OpencastTrackCameraDataDelegate extends paella.DataDelegate {
  read(context, params, onSuccess) {
    let attachments = paella.opencast._episode.mediapackage.attachments.attachment;
    let trackhdUrl;

    if (attachments === undefined) {
      return;
    }

    for (let i = 0; i < attachments.length; i++) {
      if (attachments[i].type.indexOf('trackhd') > 0) {
        trackhdUrl = attachments[i].url;
      }
    }

    if (trackhdUrl) {
      paella.utils.ajax.get({
        url: trackhdUrl
      }, data => {
        if (typeof data == 'string') {
          try {
            data = JSON.parse(data);
          } catch (err) {
            /**/
          }
        }

        data.positions.sort((a, b) => {
          return a.time - b.time;
        });
        onSuccess(data);
      }, () => onSuccess(null));
    } else {
      onSuccess(null);
    }
  }

}
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */

/*global Opencast
         MHAnnotationServiceDefaultDataDelegate
         MHAnnotationServiceTrimmingDataDelegate
         MHFootPrintsDataDelegate
         OpencastTrackCameraDataDelegate
         OpencastToPaellaConverter
         OpencastAccessControl
*/

/* #DCE OPC-359 override Opencast engage-paella-player/src/main/paella-opencast/plugins/es.upv.paella.opencast.loader/05_loader.js 
   for DCE specific auth handling. TEST if stream toggling still neeede for ios and multi to single
   TODO: next iteration, use the Opencat preferred location for paella config
*/
function initPaellaOpencast() {
  if (!paella.opencast) {
    paella.opencast = new Opencast();
    paella.dataDelegates.MHAnnotationServiceDefaultDataDelegate = MHAnnotationServiceDefaultDataDelegate;
    paella.dataDelegates.MHAnnotationServiceTrimmingDataDelegate = MHAnnotationServiceTrimmingDataDelegate;
    paella.dataDelegates.MHFootPrintsDataDelegate = MHFootPrintsDataDelegate;
    paella.dataDelegates.OpencastTrackCameraDataDelegate = OpencastTrackCameraDataDelegate;
    paella.OpencastAccessControl = OpencastAccessControl;
    window.OpencastAccessControl = OpencastAccessControl;
  }
}

function loadOpencastPaella(containerId) {
  initPaellaOpencast();
  paella.load(containerId, {
    // #DCE OPC-357 revert to original path during migration
    //configUrl:'/ui/config/paella/config.json',
    configUrl: '/engage/player/config/config.json',
    loadVideo: function () {
      return new Promise((resolve, reject) => {
        paella.opencast.getEpisode().then(episode => {
          var converter = new OpencastToPaellaConverter();
          var data = converter.convertToDataJson(episode);

          if (data.streams.length < 1) {
            paella.messageBox.showError(paella.dictionary.translate('Error loading video! No video tracks found'));
          } else {
            paella.dce = paella.dce || {};
            paella.dce.sources = data.streams; // #DCE toggle presenter & presenation option when ios (bypass paella5 exclusion of presentation video)
            // This is still necessary in Paellav6x: Hide the slave stream from paella if ios, will be used in singleVideoToggle
            // Toggling video players with profiles and hard swap the main Audio player doesn't work. Safari video elements become "suspended"

            if (base.userAgent.system.iOS) {
              data.streams = [];
              data.streams[0] = paella.dce.sources[0];
            }

            resolve(data);
          }
        }).catch(jsonData => {
          // #DCE start specific DCE auth handling, formally in isHarvardDceAuth() (MATT-2212)
          if (jsonData && jsonData['dce-auth-results']) {
            paella.opencast.doHarvardDceAuthRedirect(jsonData);
            base.log.debug("Successfully performed DCE auth redirect"); // #DCE end specific DCE auth handling
          } else if (jsonData == 0) {
            var errMsg = paella.dictionary.translate('No recordings found for episode id {id}').replace(/\{id\}/g, paella.utils.parameters.get('id') || '');
            paella.messageBox.showError(errMsg);
          } else {
            // #DCE OPC-374 Opencast makes user log in if 0 results, DCE has already done auth by this point and knows 0 means 0 to this user.
            //var oacl = new OpencastAccessControl();
            //oacl.userData().then(user => {
            //  if (user.isAnonymous) {
            //    window.location.href = oacl.getAuthenticationUrl();
            //  } else {
            var errMsg = paella.dictionary.translate('Error loading video {id}').replace(/\{id\}/g, paella.utils.parameters.get('id') || '');
            paella.messageBox.showError(errMsg); // }
            //});
          }
        });
      });
    }
  });
}
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
paella.addPlugin(function () {
  return class logIn extends paella.VideoOverlayButtonPlugin {
    constructor() {
      super();
    }

    getName() {
      return 'es.upv.paella.opencast.logIn';
    }

    getSubclass() {
      return 'logIn';
    }

    getIconClass() {
      return 'icon-user';
    }

    getAlignment() {
      return 'right';
    }

    getIndex() {
      return 10;
    }

    getDefaultToolTip() {
      return base.dictionary.translate('Log in');
    }

    checkEnabled(onSuccess) {
      paella.initDelegate.initParams.accessControl.userData().then(userdata => {
        onSuccess(userdata.isAnonymous);
      });
    }

    action(button) {
      window.location.href = paella.initDelegate.initParams.accessControl.getAuthenticationUrl();
    }

  };
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
/////////////////////////////////////////////////
// OCR Segments Search
/////////////////////////////////////////////////
paella.addPlugin(function () {
  return class searchPlugin extends paella.SearchServicePlugIn {
    constructor() {
      super();
    }

    getName() {
      return 'es.upv.paella.opencast.searchPlugin';
    }

    search(text, next) {
      if (text === '' || text === undefined) {
        next(false, []);
      } else {
        var episodeId = paella.utils.parameters.get('id');
        paella.ajax.get({
          url: '/search/episode.json',
          params: {
            id: episodeId,
            q: text,
            limit: 1000
          }
        }, function (data, contentType, returnCode) {
          paella.debug.log('Searching episode=' + episodeId + ' q=' + text);
          var segmentsAvailable = data !== undefined && data['search-results'] !== undefined && data['search-results'].result !== undefined && data['search-results'].result.segments !== undefined && data['search-results'].result.segments.segment.length > 0;
          var searchResult = [];

          if (segmentsAvailable) {
            var segments = data['search-results'].result.segments;
            var i, segment;

            for (i = 0; i < segments.segment.length; ++i) {
              segment = segments.segment[i];
              var relevance = parseInt(segment.relevance);

              if (relevance > 0) {
                searchResult.push({
                  content: segment.text,
                  scote: segment.relevance,
                  time: parseInt(segment.time) / 1000
                });
              }
            }

            next(false, searchResult);
          } else {
            paella.debug.log('No Revelance');
            next(false, []);
          }
        }, function (data, contentType, returnCode) {
          next(true);
        });
      }
    }

  };
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
paella.addPlugin(function () {
  return class TranscriptionTabBarPlugin extends paella.TabBarPlugin {
    get divContainer() {
      return this._divContainer;
    }

    set divContainer(v) {
      this._divContainer = v;
    }

    get divSearchBar() {
      return this._divSearchBar;
    }

    set divSearchBar(v) {
      this._divSearchBar = v;
    }

    get divLoading() {
      return this._divLoading;
    }

    set divLoading(v) {
      this._divLoading = v;
    }

    get divResults() {
      return this._divResults;
    }

    set divResults(v) {
      this._divResults = v;
    }

    get divSearch() {
      return this._divSearch;
    }

    set divSearch(v) {
      this._divSearch = v;
    }

    get divSearchBarRelevance() {
      return this._divSearchBarRelevance;
    }

    set divSearchBarRelevance(v) {
      this._divSearchBarRelevance = v;
    }

    get resultsEntryID() {
      return this._resultsEntryID;
    }

    set resultsEntryID(v) {
      this._resultsEntryID = v;
    }

    get foundAlready() {
      return this._foundAlready;
    }

    set foundAlready(v) {
      this._foundAlready = v;
    }

    get lastHit() {
      return this._lastHit;
    }

    set lastHit(v) {
      this._lastHit = v;
    }

    get proxyUrl() {
      return this._proxyUrl;
    }

    set proxyUrl(v) {
      this._proxyUrl = v;
    }

    get useJsonp() {
      return this._useJsonp;
    }

    set useJsonp(v) {
      this._useJsonp = v;
    }

    constructor() {
      super();
      this._resultsEntryID = '', this._foundAlready = false, // flag if something has already been found
      this._lastHit = '', // storage for latest successful search hit
      this._proxyUrl = '', this._useJsonp = false;
    }

    getSubclass() {
      return 'searchTabBar';
    }

    getName() {
      return 'es.upv.paella.opencast.transcriptionTabBarPlugin';
    }

    getTabName() {
      return paella.dictionary.translate('Transcription');
    }

    getIndex() {
      return 20;
    }

    getDefaultToolTip() {
      return paella.dictionary.translate('Transcription');
    }

    checkEnabled(onSuccess) {
      var self = this;
      paella.opencast.getEpisode().then(function (episode) {
        self._episode = episode;
        onSuccess(episode.segments != undefined);
      }, function () {
        onSuccess(false);
      });
    }

    buildContent(domElement) {
      this.domElement = domElement;
      this.loadContent();
    }

    action(tab) {}

    loadContent() {
      this.divContainer = document.createElement('div');
      this.divContainer.className = 'searchTabBarContainer';
      this.divSearchBar = document.createElement('div');
      this.divSearchBar.className = 'searchTabBarSearchBar';
      this.divLoading = document.createElement('div');
      this.divLoading.className = 'searchTabBarLoading';
      this.divResults = document.createElement('div');
      this.divResults.className = 'searchTabBarResults';
      this.divSearch = document.createElement('div');
      this.divSearch.className = 'searchTabBarSearch';
      this.divContainer.appendChild(this.divSearchBar);
      this.divContainer.appendChild(this.divLoading);
      this.divContainer.appendChild(this.divSearch);
      this.divContainer.appendChild(this.divResults);
      this.domElement.appendChild(this.divContainer);
      this.prepareSearchBar();
      this.loadSegmentText();
    }

    setLoading(b) {
      if (b == true) {
        this.divLoading.style.display = 'block';
        this.divResults.style.display = 'none';
      } else {
        this.divLoading.style.display = 'none';
        this.divResults.style.display = 'block';
      }
    }

    prepareSearchBar() {
      var thisClass = this;
      var divSearchBarLeft = document.createElement('div');
      divSearchBarLeft.className = 'searchBar';
      this.divSearchBarRelevance = document.createElement('div');
      this.divSearchBarRelevance.className = 'relevanceInfo'; // -------  Left

      var inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = paella.dictionary.translate('Search in this event');
      inputElement.setAttribute('size', '30');
      inputElement.setAttribute('dir', 'lrt');
      inputElement.setAttribute('spellcheck', 'true');
      inputElement.setAttribute('x-webkit-speech', '');
      inputElement.setAttribute('tabindex', '4000');

      inputElement.onfocus = function () {
        this.value = '';
        this.onfocus = undefined;
      };

      inputElement.onkeyup = function () {
        thisClass.doSearch(this.value);
      };

      divSearchBarLeft.appendChild(inputElement); // -------  Right

      var r1 = document.createElement('div');
      var r2 = document.createElement('div');
      var r3 = document.createElement('div');
      var r4 = document.createElement('div');
      r1.className = 'text';
      r2.className = 'lt30';
      r3.className = 'lt70';
      r4.className = 'gt70';
      r1.innerText = paella.dictionary.translate('Search relevance:');
      r2.innerHTML = '&lt; 30%';
      r3.innerHTML = '&lt; 70%';
      r4.innerHTML = '&gt; 70%';
      this.divSearchBarRelevance.appendChild(r1);
      this.divSearchBarRelevance.appendChild(r2);
      this.divSearchBarRelevance.appendChild(r3);
      this.divSearchBarRelevance.appendChild(r4);
      this.divSearchBar.appendChild(divSearchBarLeft);
      this.divSearchBar.appendChild(this.divSearchBarRelevance);
    }

    loadSegmentText() {
      var self = this;
      this.setLoading(true);
      this.divResults.innerText = '';

      if (self._episode.segments === undefined) {
        paella.debug.log('Segment Text data not available');
      } else {
        var segments = self._episode.segments;

        for (var i = 0; i < segments.segment.length; ++i) {
          var segment = segments.segment[i];
          this.appendSegmentTextEntry(segment);
        }
      }

      this.setLoading(false);
    }

    appendSegmentTextEntry(segment) {
      var divEntry = document.createElement('div');
      divEntry.className = 'searchTabBarResultEntry';
      divEntry.id = 'searchTabBarResultEntry_' + segment.index;
      divEntry.setAttribute('tabindex', 4100 + parseInt(segment.index));
      $(divEntry).click(function (event) {
        $(document).trigger(paella.events.seekToTime, {
          time: segment.time / 1000
        });
      });
      $(divEntry).keyup(function (event) {
        if (event.keyCode == 13) {
          $(document).trigger(paella.events.seekToTime, {
            time: segment.time / 1000
          });
        }
      });
      var divPreview = document.createElement('div');
      divPreview.className = 'searchTabBarResultEntryPreview';

      if (segment && segment.previews && segment.previews.preview) {
        var imgPreview = document.createElement('img');
        imgPreview.src = segment.previews.preview.$;
        divPreview.appendChild(imgPreview);
      }

      divEntry.appendChild(divPreview);
      var divResultText = document.createElement('div');
      divResultText.className = 'searchTabBarResultEntryText';
      var textResultText = document.createElement('a');
      textResultText.innerHTML = '<span class=\'time\'>' + paella.utils.timeParse.secondsToTime(segment.time / 1000) + '</span> ' + paella.AntiXSS.htmlEscape(segment.text);
      divResultText.appendChild(textResultText);
      divEntry.appendChild(divResultText);
      this.divResults.appendChild(divEntry);
    }

    doSearch(value) {
      var thisClass = this;

      if (value != '') {
        this.divSearchBarRelevance.style.display = 'none'; //"block";
      } else {
        this.divSearchBarRelevance.style.display = 'none';
      }

      this.setLoading(true);
      var segmentsAvailable = false;
      paella.ajax.get({
        url: '/search/episode.json',
        params: {
          id: thisClass._episode.id,
          q: value,
          limit: 1000
        }
      }, function (data, contentType, returnCode) {
        paella.debug.log('Searching episode=' + thisClass._episode.id + ' q=' + value);
        segmentsAvailable = data !== undefined && data['search-results'] !== undefined && data['search-results'].result !== undefined && data['search-results'].result.segments !== undefined && data['search-results'].result.segments.segment.length > 0;

        if (value === '') {
          thisClass.setNotSearch();
        } else {
          thisClass.setResultAvailable(value);
        }

        if (segmentsAvailable) {
          var segments = data['search-results'].result.segments;
          var maxRelevance = 0;
          var i, segment;

          for (i = 0; i < segments.segment.length; ++i) {
            segment = segments.segment[i];

            if (maxRelevance < parseInt(segment.relevance)) {
              maxRelevance = parseInt(segment.relevance);
            }
          }

          paella.debug.log('Search Max Revelance ' + maxRelevance);

          for (i = 0; i < segments.segment.length; ++i) {
            segment = segments.segment[i];
            var relevance = parseInt(segment.relevance);
            var relevanceClass = '';

            if (value !== '') {
              if (relevance <= 0) {
                relevanceClass = 'none_relevance';
              } else if (relevance < Math.round(maxRelevance * 30 / 100)) {
                relevanceClass = 'low_relevance';
              } else if (relevance < Math.round(maxRelevance * 70 / 100)) {
                relevanceClass = 'medium_relevance';
              } else {
                relevanceClass = 'high_relevance';
              }
            }

            var divEntry = $('#searchTabBarResultEntry_' + segment.index);
            divEntry[0].className = 'searchTabBarResultEntry ' + relevanceClass;
          }

          if (!thisClass.foundAlready) {
            thisClass.foundAlready = true;
          }

          thisClass.lastHit = value;
        } else {
          paella.debug.log('No Revelance');

          if (thisClass.foundAlready) {
            thisClass.setNoActualResultAvailable(value);
          }
        }

        thisClass.setLoading(false);
      }, function (data, contentType, returnCode) {
        thisClass.setLoading(false);
      });
    }

    setNoActualResultAvailable(searchValue) {
      this.divSearch.innerText = paella.dictionary.translate('Results for \'{0}\' (no actual results for \'{1}\' found)').replace(/\{0\}/g, this.lastHit).replace(/\{1\}/g, searchValue);
    }

    setResultAvailable(searchValue) {
      this.divSearch.innerText = paella.dictionary.translate('Results for \'{0}\'').replace(/\{0\}/g, searchValue);
    }

    setNotSearch() {
      this.divSearch.innerText = '';
    }

  };
});
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
paella.addPlugin(function () {
  return class userTrackingSaverPlugIn extends paella.userTracking.SaverPlugIn {
    getName() {
      return 'es.upv.paella.opencast.userTrackingSaverPlugIn';
    }

    checkEnabled(onSuccess) {
      paella.ajax.get({
        url: '/usertracking/detailenabled'
      }, function (data, contentType, returnCode) {
        if (data == 'true') {
          onSuccess(true);
        } else {
          onSuccess(false);
        }
      }, function (data, contentType, returnCode) {
        onSuccess(false);
      });
    }

    log(event, params) {
      var videoCurrentTime;
      paella.player.videoContainer.currentTime().then(ct => {
        videoCurrentTime = parseInt(ct + paella.player.videoContainer.trimStart());
        return paella.player.videoContainer.paused();
      }).then(paused => {
        var opencastLog = {
          _method: 'PUT',
          'id': paella.player.videoIdentifier,
          'type': undefined,
          'in': videoCurrentTime,
          'out': videoCurrentTime,
          'playing': !paused
        };

        switch (event) {
          case paella.events.play:
            opencastLog.type = 'PLAY';
            break;

          case paella.events.pause:
            opencastLog.type = 'PAUSE';
            break;

          case paella.events.seekTo:
          case paella.events.seekToTime:
            opencastLog.type = 'SEEK';
            break;

          case paella.events.resize:
            opencastLog.type = 'RESIZE-TO-' + params.width + 'x' + params.height;
            break;

          case 'paella:searchService:search':
            opencastLog.type = 'SEARCH-' + params;
            break;

          default:
            opencastLog.type = event;
            var opt = params;

            if (opt != undefined) {
              if (typeof params == 'object') {
                opt = JSON.stringify(params);
              }

              opencastLog.type = event + ';' + opt;
            }

            break;
        }

        opencastLog.type = opencastLog.type.substr(0, 128);
        paella.ajax.get({
          url: '/usertracking/',
          params: opencastLog
        });
      });
    }

  };
});
paella.addPlugin(function () {
  return class PIPModePlugin extends paella.ButtonPlugin {
    getIndex() {
      return 551;
    }

    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "PIPModeButton";
    }

    getIconClass() {
      return 'icon-pip';
    }

    getName() {
      return "es.upv.paella.pipModePlugin";
    }

    checkEnabled(onSuccess) {
      var mainVideo = paella.player.videoContainer.masterVideo();
      var video = mainVideo.video; // PIP is only available with single stream videos

      if (paella.player.videoContainer.streamProvider.videoStreams.length != 1) {
        onSuccess(false);
      } else if (video && video.webkitSetPresentationMode) {
        onSuccess(true);
      } else if (video && 'pictureInPictureEnabled' in document) {
        onSuccess(true);
      } else {
        onSuccess(false);
      }
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Set picture-in-picture mode.");
    }

    setup() {}

    action(button) {
      var video = paella.player.videoContainer.masterVideo().video;

      if (video.webkitSetPresentationMode) {
        if (video.webkitPresentationMode == "picture-in-picture") {
          video.webkitSetPresentationMode("inline");
        } else {
          video.webkitSetPresentationMode("picture-in-picture");
        }
      } else if ('pictureInPictureEnabled' in document) {
        if (video !== document.pictureInPictureElement) {
          video.requestPictureInPicture();
        } else {
          document.exitPictureInPicture();
        }
      }
    }

  };
});
/** #DCE Overriding playbutton.js for checkEnabled override for live stream events */
paella.addPlugin(function () {
  return class PlayPauseButtonPlugin extends paella.ButtonPlugin {
    constructor() {
      super();
      this.playIconClass = 'icon-play';
      this.pauseIconClass = 'icon-pause';
      this.playSubclass = 'playButton';
      this.pauseSubclass = 'pauseButton';
    }

    getAlignment() {
      return 'left';
    }

    getSubclass() {
      return this.playSubclass;
    }

    getIconClass() {
      return this.playIconClass;
    }

    getName() {
      return "es.upv.paella.playPauseButtonPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Play");
    }

    getIndex() {
      return 110;
    }

    checkEnabled(onSuccess) {
      //onSuccess(true);
      // #DCE OPC-374 disable play-pause button for live
      onSuccess(!paella.player.isLiveStream());
    }

    setup() {
      if (paella.player.playing()) {
        this.changeIconClass(this.playIconClass);
      }

      paella.events.bind(paella.events.play, event => {
        this.changeIconClass(this.pauseIconClass);
        this.changeSubclass(this.pauseSubclass);
        this.setToolTip(paella.dictionary.translate("Pause"));
      });
      paella.events.bind(paella.events.pause, event => {
        this.changeIconClass(this.playIconClass);
        this.changeSubclass(this.playSubclass);
        this.setToolTip(paella.dictionary.translate("Play"));
      });
      paella.events.bind(paella.events.ended, event => {
        this.changeIconClass(this.playIconClass);
        this.changeSubclass(this.playSubclass);
        this.setToolTip(paella.dictionary.translate("Play"));
      });
    }

    action(button) {
      paella.player.videoContainer.paused().then(function (paused) {
        if (paused) {
          paella.player.play();
        } else {
          paella.player.pause();
        }
      });
    }

  };
});
paella.addPlugin(function () {
  return class PlayButtonOnScreen extends paella.EventDrivenPlugin {
    constructor() {
      super();
      this.containerId = 'paella_plugin_PlayButtonOnScreen';
      this.container = null;
      this.enabled = true;
      this.isPlaying = false;
      this.showIcon = true;
      this.firstPlay = false;
    }

    checkEnabled(onSuccess) {
      onSuccess(!paella.player.isLiveStream() || base.userAgent.system.Android || base.userAgent.system.iOS || !paella.player.videoContainer.supportAutoplay());
    }

    getIndex() {
      return 1010;
    }

    getName() {
      return "es.upv.paella.playButtonOnScreenPlugin";
    }

    setup() {
      var thisClass = this;
      this.container = document.createElement('div');
      this.container.className = "playButtonOnScreen";
      this.container.id = this.containerId;
      this.container.style.width = "100%";
      this.container.style.height = "100%";
      paella.player.videoContainer.domElement.appendChild(this.container);
      $(this.container).click(function (event) {
        thisClass.onPlayButtonClick();
      });
      var icon = document.createElement('canvas');
      icon.className = "playButtonOnScreenIcon";
      this.container.appendChild(icon);

      function repaintCanvas() {
        var width = jQuery(thisClass.container).innerWidth();
        var height = jQuery(thisClass.container).innerHeight();
        icon.width = width;
        icon.height = height;
        var iconSize = width < height ? width / 3 : height / 3;
        var ctx = icon.getContext('2d'); // Play Icon size: 300x300

        ctx.translate((width - iconSize) / 2, (height - iconSize) / 2);
        ctx.beginPath();
        ctx.arc(iconSize / 2, iconSize / 2, iconSize / 2, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.fillStyle = '#8f8f8f';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(iconSize / 3, iconSize / 4);
        ctx.lineTo(3 * iconSize / 4, iconSize / 2);
        ctx.lineTo(iconSize / 3, 3 * iconSize / 4);
        ctx.lineTo(iconSize / 3, iconSize / 4);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
      }

      paella.events.bind(paella.events.resize, repaintCanvas);
      repaintCanvas();
    }

    getEvents() {
      return [paella.events.endVideo, paella.events.play, paella.events.pause, paella.events.showEditor, paella.events.hideEditor];
    }

    onEvent(eventType, params) {
      switch (eventType) {
        case paella.events.endVideo:
          this.endVideo();
          break;

        case paella.events.play:
          this.play();
          break;

        case paella.events.pause:
          this.pause();
          break;

        case paella.events.showEditor:
          this.showEditor();
          break;

        case paella.events.hideEditor:
          this.hideEditor();
          break;
      }
    }

    onPlayButtonClick() {
      this.firstPlay = true;
      this.checkStatus();
    }

    endVideo() {
      this.isPlaying = false;
      this.showIcon = true; //#DCE OPC-407, Ref https://github.com/polimediaupv/paella/pull/450

      this.checkStatus();
    }

    play() {
      this.isPlaying = true;
      this.showIcon = false;
      this.checkStatus();
    }

    pause() {
      this.isPlaying = false;
      this.showIcon = true;
      this.checkStatus();
    }

    showEditor() {
      this.enabled = false;
      this.checkStatus();
    }

    hideEditor() {
      this.enabled = true;
      this.checkStatus();
    }

    checkStatus() {
      if (this.enabled && this.isPlaying || !this.enabled || !this.showIcon) {
        $(this.container).hide();
      } else {
        $(this.container).show();
      }
    }

  };
});
paella.addPlugin(function () {
  return class PlaybackRate extends paella.ButtonPlugin {
    getAlignment() {
      return 'left';
    }

    getSubclass() {
      return "showPlaybackRateButton";
    }

    getIconClass() {
      return 'icon-screen';
    }

    getIndex() {
      return 140;
    }

    getName() {
      return "es.upv.paella.playbackRatePlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Set playback rate");
    }

    checkEnabled(onSuccess) {
      this.buttonItems = null;
      this.buttons = [];
      this.selected_button = null;
      this.defaultRate = null;
      this._domElement = null;
      this.available_rates = null;
      var enabled = !base.userAgent.browser.IsMobileVersion && paella.player.videoContainer.masterVideo() instanceof paella.Html5Video;
      onSuccess(enabled);
    }

    closeOnMouseOut() {
      return true;
    }

    setup() {
      this.defaultRate = 1.0; // #DCE OPC-374 adding 2x rate in situ, the Add2xPlaybackChoice plugin doesn't work for this

      this.available_rates = this.config.availableRates || [0.75, 1, 1.25, 1.5, 2];
    }

    buildContent(domElement) {
      this._domElement = domElement;
      this.buttonItems = {};
      this.available_rates.forEach(rate => {
        domElement.appendChild(this.getItemButton(rate + "x", rate));
      });
    }

    getItemButton(label, rate) {
      var elem = document.createElement('div');

      if (rate == 1.0) {
        elem.className = this.getButtonItemClass(label, true);
      } else {
        elem.className = this.getButtonItemClass(label, false);
      }

      elem.id = label + '_button';
      elem.innerText = label;
      elem.data = {
        label: label,
        rate: rate,
        plugin: this
      };
      $(elem).click(function (event) {
        this.data.plugin.onItemClick(this, this.data.label, this.data.rate);
      });
      return elem;
    }

    onItemClick(button, label, rate) {
      var self = this;
      paella.player.videoContainer.setPlaybackRate(rate);
      this.setText(label);
      paella.player.controls.hidePopUp(this.getName());
      var arr = self._domElement.children;

      for (var i = 0; i < arr.length; i++) {
        arr[i].className = self.getButtonItemClass(i, false);
      }

      button.className = self.getButtonItemClass(i, true);
    }

    getText() {
      return "1x";
    }

    getProfileItemButton(profile, profileData) {
      var elem = document.createElement('div');
      elem.className = this.getButtonItemClass(profile, false);
      elem.id = profile + '_button';
      elem.data = {
        profile: profile,
        profileData: profileData,
        plugin: this
      };
      $(elem).click(function (event) {
        this.data.plugin.onItemClick(this, this.data.profile, this.data.profileData);
      });
      return elem;
    }

    getButtonItemClass(profileName, selected) {
      return 'playbackRateItem ' + profileName + (selected ? ' selected' : '');
    }

  };
});
paella.addPlugin(function () {
  return class RatePlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "rateButtonPlugin";
    }

    getIconClass() {
      return 'icon-star';
    }

    getIndex() {
      return 540;
    }

    getName() {
      return "es.upv.paella.ratePlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Rate this video");
    }

    checkEnabled(onSuccess) {
      this.buttonItems = null;
      this.buttons = [];
      this.selected_button = null;
      this.score = 0;
      this.count = 0;
      this.myScore = 0;
      this.canVote = false;
      this.scoreContainer = {
        header: null,
        rateButtons: null
      };
      paella.data.read('rate', {
        id: paella.initDelegate.getId()
      }, (data, status) => {
        if (data && typeof data == 'object') {
          this.score = Number(data.mean).toFixed(1);
          this.count = data.count;
          this.myScore = data.myScore;
          this.canVote = data.canVote;
        }

        onSuccess(status);
      });
    }

    setup() {}

    setScore(s) {
      this.score = s;
      this.updateScore();
    }

    closeOnMouseOut() {
      return true;
    }

    updateHeader() {
      let score = base.dictionary.translate("Not rated");

      if (this.count > 0) {
        score = '<i class="glyphicon glyphicon-star"></i>';
        score += ` ${this.score} ${this.count} ${base.dictionary.translate('votes')}`;
      }

      this.scoreContainer.header.innerHTML = `
			<div>
				<h4>${base.dictionary.translate('Video score')}:</h4>
				<h5>
					${score}
				</h5>
				</h4>
				<h4>${base.dictionary.translate('Vote:')}</h4>
			</div>
			`;
    }

    updateRateButtons() {
      this.scoreContainer.rateButtons.className = "rateButtons";
      this.buttons = [];

      if (this.canVote) {
        this.scoreContainer.rateButtons.innerText = "";

        for (let i = 0; i < 5; ++i) {
          let btn = this.getStarButton(i + 1);
          this.buttons.push(btn);
          this.scoreContainer.rateButtons.appendChild(btn);
        }
      } else {
        this.scoreContainer.rateButtons.innerHTML = `<h5>${base.dictionary.translate('Login to vote')}</h5>`;
      }

      this.updateVote();
    }

    buildContent(domElement) {
      var This = this;
      This._domElement = domElement;
      var header = document.createElement('div');
      domElement.appendChild(header);
      header.className = "rateContainerHeader";
      this.scoreContainer.header = header;
      this.updateHeader();
      var rateButtons = document.createElement('div');
      this.scoreContainer.rateButtons = rateButtons;
      domElement.appendChild(rateButtons);
      this.updateRateButtons();
    }

    getStarButton(score) {
      let This = this;
      let elem = document.createElement('i');
      elem.data = {
        score: score,
        active: false
      };
      elem.className = "starButton glyphicon glyphicon-star-empty";
      $(elem).click(function (event) {
        This.vote(this.data.score);
      });
      return elem;
    }

    vote(score) {
      this.myScore = score;
      let data = {
        mean: this.score,
        count: this.count,
        myScore: score,
        canVote: this.canVote
      };
      paella.data.write('rate', {
        id: paella.initDelegate.getId()
      }, data, result => {
        paella.data.read('rate', {
          id: paella.initDelegate.getId()
        }, (data, status) => {
          if (data && typeof data == 'object') {
            this.score = Number(data.mean).toFixed(1);
            this.count = data.count;
            this.myScore = data.myScore;
            this.canVote = data.canVote;
          }

          this.updateHeader();
          this.updateRateButtons();
        });
      });
    }

    updateVote() {
      this.buttons.forEach((item, index) => {
        item.className = index < this.myScore ? "starButton glyphicon glyphicon-star" : "starButton glyphicon glyphicon-star-empty";
      });
    }

  };
});
(() => {
  class RTMPVideo extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height) {
      super(id, stream, 'div', left, top, width, height);
      this._posterFrame = null;
      this._currentQuality = null;
      this._duration = 0;
      this._paused = true;
      this._streamName = null;
      this._flashId = null;
      this._swfContainer = null;
      this._flashVideo = null;
      this._volume = 1;
      this._flashId = id + 'Movie';
      this._streamName = 'rtmp';
      var This = this;

      this._stream.sources.rtmp.sort(function (a, b) {
        return a.res.h - b.res.h;
      });

      var processEvent = function (eventName, params) {
        if (eventName != "loadedmetadata" && eventName != "pause" && !This._isReady) {
          This._isReady = true;
          This._duration = params.duration;
          $(This.swfContainer).trigger("paella:flashvideoready");
        }

        if (eventName == "progress") {
          try {
            This.flashVideo.setVolume(This._volume);
          } catch (e) {}

          base.log.debug("Flash video event: " + eventName + ", progress: " + This.flashVideo.currentProgress());
        } else if (eventName == "ended") {
          base.log.debug("Flash video event: " + eventName);
          paella.events.trigger(paella.events.pause);
          paella.player.controls.showControls();
        } else {
          base.log.debug("Flash video event: " + eventName);
        }
      };

      var eventReceived = function (eventName, params) {
        params = params.split(",");
        var processedParams = {};

        for (var i = 0; i < params.length; ++i) {
          var splitted = params[i].split(":");
          var key = splitted[0];
          var value = splitted[1];

          if (value == "NaN") {
            value = NaN;
          } else if (/^true$/i.test(value)) {
            value = true;
          } else if (/^false$/i.test(value)) {
            value = false;
          } else if (!isNaN(parseFloat(value))) {
            value = parseFloat(value);
          }

          processedParams[key] = value;
        }

        processEvent(eventName, processedParams);
      };

      paella.events.bind(paella.events.flashVideoEvent, function (event, params) {
        if (This.flashId == params.source) {
          eventReceived(params.eventName, params.values);
        }
      });
    }

    get swfContainer() {
      return this._swfContainer;
    }

    get flashId() {
      return this._flashId;
    }

    get flashVideo() {
      return this._flashVideo;
    }

    _createSwfObject(swfFile, flashVars) {
      var id = this.identifier;
      var parameters = {
        wmode: 'transparent'
      };
      var domElement = document.createElement('div');
      this.domElement.appendChild(domElement);
      domElement.id = id + "Movie";
      this._swfContainer = domElement;

      if (swfobject.hasFlashPlayerVersion("9.0.0")) {
        swfobject.embedSWF(swfFile, domElement.id, "100%", "100%", "9.0.0", "", flashVars, parameters, null, function callbackFn(e) {
          if (e.success == false) {
            var message = document.createElement('div');
            var header = document.createElement('h3');
            header.innerText = base.dictionary.translate("Flash player problem");
            var text = document.createElement('div');
            text.innerHTML = base.dictionary.translate("A problem occurred trying to load flash player.") + "<br>" + base.dictionary.translate("Please go to {0} and install it.").replace("{0}", "<a style='color: #800000; text-decoration: underline;' href='http://www.adobe.com/go/getflash'>http://www.adobe.com/go/getflash</a>") + '<br>' + base.dictionary.translate("If the problem presist, contact us.");
            var link = document.createElement('a');
            link.setAttribute("href", "http://www.adobe.com/go/getflash");
            link.innerHTML = '<img style="margin:5px;" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Obtener Adobe Flash Player" />';
            message.appendChild(header);
            message.appendChild(text);
            message.appendChild(link);
            paella.messageBox.showError(message.innerHTML);
          }
        });
      } else {
        var message = document.createElement('div');
        var header = document.createElement('h3');
        header.innerText = base.dictionary.translate("Flash player needed");
        var text = document.createElement('div');
        text.innerHTML = base.dictionary.translate("You need at least Flash player 9 installed.") + "<br>" + base.dictionary.translate("Please go to {0} and install it.").replace("{0}", "<a style='color: #800000; text-decoration: underline;' href='http://www.adobe.com/go/getflash'>http://www.adobe.com/go/getflash</a>");
        var link = document.createElement('a');
        link.setAttribute("href", "http://www.adobe.com/go/getflash");
        link.innerHTML = '<img style="margin:5px;" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Obtener Adobe Flash Player" />';
        message.appendChild(header);
        message.appendChild(text);
        message.appendChild(link);
        paella.messageBox.showError(message.innerHTML);
      }

      var flashObj = $('#' + domElement.id)[0];
      return flashObj;
    }

    _deferredAction(action) {
      return new Promise((resolve, reject) => {
        if (this.ready) {
          resolve(action());
        } else {
          $(this.swfContainer).bind('paella:flashvideoready', () => {
            this._ready = true;
            resolve(action());
          });
        }
      });
    }

    _getQualityObject(index, s) {
      return {
        index: index,
        res: s.res,
        src: s.src,
        toString: function () {
          return this.res.w + "x" + this.res.h;
        },
        shortLabel: function () {
          return this.res.h + "p";
        },
        compare: function (q2) {
          return this.res.w * this.res.h - q2.res.w * q2.res.h;
        }
      };
    } // Initialization functions


    getVideoData() {
      let FlashVideoPlugin = this;
      return new Promise((resolve, reject) => {
        this._deferredAction(() => {
          let videoData = {
            duration: FlashVideoPlugin.flashVideo.duration(),
            currentTime: FlashVideoPlugin.flashVideo.getCurrentTime(),
            volume: FlashVideoPlugin.flashVideo.getVolume(),
            paused: FlashVideoPlugin._paused,
            ended: FlashVideoPlugin._ended,
            res: {
              w: FlashVideoPlugin.flashVideo.getWidth(),
              h: FlashVideoPlugin.flashVideo.getHeight()
            }
          };
          resolve(videoData);
        });
      });
    }

    setPosterFrame(url) {
      if (this._posterFrame == null) {
        this._posterFrame = url;
        var posterFrame = document.createElement('img');
        posterFrame.src = url;
        posterFrame.className = "videoPosterFrameImage";
        posterFrame.alt = "poster frame";
        this.domElement.appendChild(posterFrame);
        this._posterFrameElement = posterFrame;
      } //	this.video.setAttribute("poster",url);

    }

    setAutoplay(auto) {
      this._autoplay = auto;
    }

    load() {
      var This = this;
      var sources = this._stream.sources.rtmp;

      if (this._currentQuality === null && this._videoQualityStrategy) {
        this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
      }

      var isValid = function (stream) {
        return stream.src && typeof stream.src == 'object' && stream.src.server && stream.src.stream;
      };

      var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;

      if (stream) {
        if (!isValid(stream)) {
          return paella_DeferredRejected(new Error("Invalid video data"));
        } else {
          var subscription = false;

          if (stream.src.requiresSubscription === undefined && paella.player.config.player.rtmpSettings) {
            subscription = paella.player.config.player.rtmpSettings.requiresSubscription || false;
          } else if (stream.src.requiresSubscription) {
            subscription = stream.src.requiresSubscription;
          }

          var parameters = {};
          var swfName = 'resources/deps/player_streaming.swf';

          if (this._autoplay) {
            parameters.autoplay = this._autoplay;
          }

          if (base.parameters.get('debug') == "true") {
            parameters.debugMode = true;
          }

          parameters.playerId = this.flashId;
          parameters.isLiveStream = stream.isLiveStream !== undefined ? stream.isLiveStream : false;
          parameters.server = stream.src.server;
          parameters.stream = stream.src.stream;
          parameters.subscribe = subscription;

          if (paella.player.config.player.rtmpSettings && paella.player.config.player.rtmpSettings.bufferTime !== undefined) {
            parameters.bufferTime = paella.player.config.player.rtmpSettings.bufferTime;
          }

          this._flashVideo = this._createSwfObject(swfName, parameters);
          $(this.swfContainer).trigger("paella:flashvideoready");
          return this._deferredAction(function () {
            return stream;
          });
        }
      } else {
        return paella_DeferredRejected(new Error("Could not load video: invalid quality stream index"));
      }
    }

    getQualities() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          var sources = this._stream.sources.rtmp;
          var index = -1;
          sources.forEach(s => {
            index++;
            result.push(this._getQualityObject(index, s));
          });
          resolve(result);
        }, 50);
      });
    }

    setQuality(index) {
      index = index !== undefined && index !== null ? index : 0;
      return new Promise((resolve, reject) => {
        var paused = this._paused;
        var sources = this._stream.sources.rtmp;
        this._currentQuality = index < sources.length ? index : 0;
        var source = sources[index];
        this._ready = false;
        this._isReady = false;
        this.load().then(function () {
          resolve();
        });
      });
    }

    getCurrentQuality() {
      return new Promise((resolve, reject) => {
        resolve(this._getQualityObject(this._currentQuality, this._stream.sources.rtmp[this._currentQuality]));
      });
    }

    play() {
      var This = this;
      return this._deferredAction(function () {
        if (This._posterFrameElement) {
          This._posterFrameElement.parentNode.removeChild(This._posterFrameElement);

          This._posterFrameElement = null;
        }

        This._paused = false;
        This.flashVideo.play();
      });
    }

    pause() {
      var This = this;
      return this._deferredAction(function () {
        This._paused = true;
        This.flashVideo.pause();
      });
    }

    isPaused() {
      var This = this;
      return this._deferredAction(function () {
        return This._paused;
      });
    }

    duration() {
      var This = this;
      return this._deferredAction(function () {
        return This.flashVideo.duration();
      });
    }

    setCurrentTime(time) {
      var This = this;
      return this._deferredAction(function () {
        var duration = This.flashVideo.duration();
        This.flashVideo.seekTo(time * 100 / duration);
      });
    }

    currentTime() {
      var This = this;
      return this._deferredAction(function () {
        return This.flashVideo.getCurrentTime();
      });
    }

    setVolume(volume) {
      var This = this;
      this._volume = volume;
      return this._deferredAction(function () {
        This.flashVideo.setVolume(volume);
      });
    }

    volume() {
      var This = this;
      return this._deferredAction(function () {
        return This.flashVideo.getVolume();
      });
    }

    setPlaybackRate(rate) {
      var This = this;
      return this._deferredAction(function () {
        This._playbackRate = rate;
      });
    }

    playbackRate() {
      var This = this;
      return this._deferredAction(function () {
        return This._playbackRate;
      });
    }

    goFullScreen() {
      return paella_DeferredNotImplemented();
    }

    unFreeze() {
      return this._deferredAction(function () {});
    }

    freeze() {
      return this._deferredAction(function () {});
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.RTMPVideo = RTMPVideo;

  class RTMPVideoFactory extends paella.VideoFactory {
    isStreamCompatible(streamData) {
      try {
        if (base.userAgent.system.iOS || base.userAgent.system.Android) {
          return false;
        }

        for (var key in streamData.sources) {
          if (key == 'rtmp') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      return new paella.RTMPVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.RTMPVideoFactory = RTMPVideoFactory;
})();
/////////////////////////////////////////////////
// Caption Search
/////////////////////////////////////////////////
paella.addPlugin(function () {
  return class CaptionsSearchPlugIn extends paella.SearchServicePlugIn {
    getName() {
      return "es.upv.paella.search.captionsSearchPlugin";
    }

    search(text, next) {
      paella.captions.search(text, next);
    }

  };
});
paella.addPlugin(function () {
  return class SearchPlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return 'searchButton';
    }

    getIconClass() {
      return 'icon-binoculars';
    }

    getName() {
      return "es.upv.paella.searchPlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Search");
    }

    getIndex() {
      return 510;
    }

    closeOnMouseOut() {
      return true;
    }

    checkEnabled(onSuccess) {
      this._open = false;
      this._sortDefault = 'time';
      this._colorSearch = false;
      this._localImages = null;
      this._searchTimer = null;
      this._searchTimerTime = 1500;
      this._searchBody = null;
      this._trimming = null;
      onSuccess(true);
    }

    setup() {
      var self = this;
      $('.searchButton').click(function (event) {
        if (self._open) {
          self._open = false;
        } else {
          self._open = true;
          setTimeout(function () {
            $("#searchBarInput").focus();
          }, 0);
        }
      }); //GET THE FRAME LIST

      self._localImages = paella.initDelegate.initParams.videoLoader.frameList; //config

      self._colorSearch = self.config.colorSearch || false;
      self._sortDefault = self.config.sortType || "time";
      paella.events.bind(paella.events.controlBarWillHide, function (evt) {
        if (self._open) paella.player.controls.cancelHideBar();
      });
      paella.player.videoContainer.trimming().then(trimData => {
        self._trimming = trimData;
      });
    }

    prettyTime(seconds) {
      // TIME FORMAT
      var hou = Math.floor(seconds / 3600) % 24;
      hou = ("00" + hou).slice(hou.toString().length);
      var min = Math.floor(seconds / 60) % 60;
      min = ("00" + min).slice(min.toString().length);
      var sec = Math.floor(seconds % 60);
      sec = ("00" + sec).slice(sec.toString().length);
      var timestr = hou + ":" + min + ":" + sec;
      return timestr;
    }

    search(text, cb) {
      paella.searchService.search(text, cb);
    }

    getPreviewImage(time) {
      var thisClass = this;
      var keys = Object.keys(thisClass._localImages);
      keys.push(time);
      keys.sort(function (a, b) {
        return parseInt(a) - parseInt(b);
      });
      var n = keys.indexOf(time) - 1;
      n = n > 0 ? n : 0;
      var i = keys[n];
      i = parseInt(i);
      return thisClass._localImages[i].url;
    }

    createLoadingElement(parent) {
      var loadingResults = document.createElement('div');
      loadingResults.className = "loader";
      var htmlLoader = "<svg version=\"1.1\" id=\"loader-1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">" + "<path fill=\"#000\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">" + "<animateTransform attributeType=\"xml\"" + "attributeName=\"transform\"" + "type=\"rotate\"" + "from=\"0 25 25\"" + "to=\"360 25 25\"" + "dur=\"0.6s\"" + "repeatCount=\"indefinite\"/>" + "</path>" + "</svg>";
      loadingResults.innerHTML = htmlLoader;
      parent.appendChild(loadingResults);
      var sBodyText = document.createElement('p');
      sBodyText.className = 'sBodyText';
      sBodyText.innerText = base.dictionary.translate("Searching") + "...";
      parent.appendChild(sBodyText);
    }

    createNotResultsFound(parent) {
      var noResults = document.createElement('div');
      noResults.className = "noResults";
      noResults.innerText = base.dictionary.translate("Sorry! No results found.");
      parent.appendChild(noResults);
    }

    doSearch(txt, searchBody) {
      var thisClass = this;
      $(searchBody).empty(); //LOADING CONTAINER

      thisClass.createLoadingElement(searchBody);
      thisClass.search(txt, function (err, results) {
        $(searchBody).empty(); //BUILD SEARCH RESULTS

        if (!err) {
          if (results.length == 0) {
            // 0 RESULTS FOUND
            thisClass.createNotResultsFound(searchBody);
          } else {
            for (var i = 0; i < results.length; i++) {
              // FILL THE BODY CONTAINER WITH RESULTS
              if (thisClass._trimming.enabled && results[i].time <= thisClass._trimming.start) {
                continue;
              } //SEARCH SORT TYPE (TIME oR SCoRE)


              if (thisClass._sortDefault == 'score') {
                results.sort(function (a, b) {
                  return b.score - a.score;
                });
              }

              if (thisClass._sortDefault == 'time') {
                results.sort(function (a, b) {
                  return a.time - b.time;
                });
              }

              var sBodyInnerContainer = document.createElement('div');
              sBodyInnerContainer.className = 'sBodyInnerContainer'; //COLOR

              if (thisClass._colorSearch) {
                if (results[i].score <= 0.3) {
                  $(sBodyInnerContainer).addClass('redScore');
                }

                if (results[i].score >= 0.7) {
                  $(sBodyInnerContainer).addClass('greenScore');
                }
              }

              var TimePicContainer = document.createElement('div');
              TimePicContainer.className = 'TimePicContainer';
              var sBodyPicture = document.createElement('img');
              sBodyPicture.className = 'sBodyPicture';
              sBodyPicture.src = thisClass.getPreviewImage(results[i].time);
              var sBodyText = document.createElement('p');
              sBodyText.className = 'sBodyText';
              let time = thisClass._trimming.enabled ? results[i].time - thisClass._trimming.start : results[i].time;
              sBodyText.innerHTML = "<span class='timeSpan'>" + thisClass.prettyTime(time) + "</span>" + paella.AntiXSS.htmlEscape(results[i].content);
              TimePicContainer.appendChild(sBodyPicture);
              sBodyInnerContainer.appendChild(TimePicContainer);
              sBodyInnerContainer.appendChild(sBodyText);
              searchBody.appendChild(sBodyInnerContainer); //ADD SECS TO DOM FOR EASY HANDLE

              sBodyInnerContainer.setAttribute('sec', time); //jQuery Binds for the search

              $(sBodyInnerContainer).hover(function () {
                $(this).css('background-color', '#faa166');
              }, function () {
                $(this).removeAttr('style');
              });
              $(sBodyInnerContainer).click(function () {
                var sec = $(this).attr("sec");
                paella.player.videoContainer.seekToTime(parseInt(sec));
                paella.player.play();
              });
            }
          }
        }
      });
    }

    buildContent(domElement) {
      var thisClass = this;
      var myUrl = null; //SEARCH CONTAINER

      var searchPluginContainer = document.createElement('div');
      searchPluginContainer.className = 'searchPluginContainer'; //SEARCH BODY

      var searchBody = document.createElement('div');
      searchBody.className = 'searchBody';
      searchPluginContainer.appendChild(searchBody);
      thisClass._searchBody = searchBody; //SEARCH BAR

      var searchBar = document.createElement('div');
      searchBar.className = 'searchBar';
      searchPluginContainer.appendChild(searchBar); //INPUT

      var input = document.createElement("input");
      input.className = "searchBarInput";
      input.type = "text";
      input.id = "searchBarInput";
      input.name = "searchString";
      input.placeholder = base.dictionary.translate("Search");
      searchBar.appendChild(input);
      $(input).change(function () {
        var text = $(input).val();

        if (thisClass._searchTimer != null) {
          thisClass._searchTimer.cancel();
        }

        if (text != "") {
          thisClass.doSearch(text, searchBody);
        }
      });
      $(input).keyup(function (event) {
        if (event.keyCode != 13) {
          //IF no ENTER PRESSED SETUP THE TIMER
          var text = $(input).val();

          if (thisClass._searchTimer != null) {
            thisClass._searchTimer.cancel();
          }

          if (text != "") {
            thisClass._searchTimer = new base.Timer(function (timer) {
              thisClass.doSearch(text, searchBody);
            }, thisClass._searchTimerTime);
          } else {
            $(thisClass._searchBody).empty();
          }
        }
      });
      $(input).focus(function () {
        paella.keyManager.enabled = false;
      });
      $(input).focusout(function () {
        paella.keyManager.enabled = true;
      });
      domElement.appendChild(searchPluginContainer);
    }

  };
});
paella.addPlugin(function () {
  return class ShowEditorPlugin extends paella.VideoOverlayButtonPlugin {
    getName() {
      return "es.upv.paella.showEditorPlugin";
    }

    getSubclass() {
      return "showEditorButton";
    }

    getIconClass() {
      return 'icon-pencil';
    }

    getAlignment() {
      return 'right';
    }

    getIndex() {
      return 10;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Enter editor mode");
    }

    checkEnabled(onSuccess) {
      if (this.config.editorUrl) {
        paella.initDelegate.initParams.accessControl.canWrite().then(canWrite => {
          var enabled = canWrite; // && !base.userAgent.browser.IsMobileVersion && !paella.player.isLiveStream());					

          onSuccess(enabled);
        });
      } else {
        onSuccess(false);
      }
    }

    action(button) {
      var editorUrl = this.config.editorUrl.replace("{id}", paella.player.videoIdentifier);
      window.location.href = editorUrl;
    }

  };
});
paella.addPlugin(function () {
  return class SocialPlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showSocialPluginButton";
    }

    getIconClass() {
      return 'icon-social';
    }

    getIndex() {
      return 560;
    }

    getName() {
      return "es.upv.paella.socialPlugin";
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Share this video");
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    closeOnMouseOut() {
      return true;
    }

    setup() {
      this.buttonItems = null;
      this.socialMedia = null;
      this.buttons = [];
      this.selected_button = null;

      if (base.dictionary.currentLanguage() == 'es') {
        var esDict = {
          'Custom size:': 'Tamaño personalizado:',
          'Choose your embed size. Copy the text and paste it in your html page.': 'Elija el tamaño del video a embeber. Copie el texto y péguelo en su página html.',
          'Width:': 'Ancho:',
          'Height:': 'Alto:'
        };
        base.dictionary.addDictionary(esDict);
      }

      var thisClass = this;
      var Keys = {
        Tab: 9,
        Return: 13,
        Esc: 27,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40
      };
      $(this.button).keyup(function (event) {
        if (thisClass.isPopUpOpen()) {
          if (event.keyCode == Keys.Up) {
            if (thisClass.selected_button > 0) {
              if (thisClass.selected_button < thisClass.buttons.length) thisClass.buttons[thisClass.selected_button].className = 'socialItemButton ' + thisClass.buttons[thisClass.selected_button].data.mediaData;
              thisClass.selected_button--;
              thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
            }
          } else if (event.keyCode == Keys.Down) {
            if (thisClass.selected_button < thisClass.buttons.length - 1) {
              if (thisClass.selected_button >= 0) thisClass.buttons[thisClass.selected_button].className = 'socialItemButton ' + thisClass.buttons[thisClass.selected_button].data.mediaData;
              thisClass.selected_button++;
              thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
            }
          } else if (event.keyCode == Keys.Return) {
            thisClass.onItemClick(thisClass.buttons[thisClass.selected_button].data.mediaData);
          }
        }
      });
    }

    buildContent(domElement) {
      this.buttonItems = {};
      this.socialMedia = ['facebook', 'twitter', 'embed'];
      this.socialMedia.forEach(mediaData => {
        var buttonItem = this.getSocialMediaItemButton(mediaData);
        this.buttonItems[this.socialMedia.indexOf(mediaData)] = buttonItem;
        domElement.appendChild(buttonItem);
        this.buttons.push(buttonItem);
      });
      this.selected_button = this.buttons.length;
    }

    getSocialMediaItemButton(mediaData) {
      var elem = document.createElement('div');
      elem.className = 'socialItemButton ' + mediaData;
      elem.id = mediaData + '_button';
      elem.data = {
        mediaData: mediaData,
        plugin: this
      };
      $(elem).click(function (event) {
        this.data.plugin.onItemClick(this.data.mediaData);
      });
      return elem;
    }

    onItemClick(mediaData) {
      var url = this.getVideoUrl();

      switch (mediaData) {
        case 'twitter':
          window.open('http://twitter.com/home?status=' + url);
          break;

        case 'facebook':
          window.open('http://www.facebook.com/sharer.php?u=' + url);
          break;

        case 'embed':
          this.embedPress();
          break;
      }

      paella.player.controls.hidePopUp(this.getName());
    }

    getVideoUrl() {
      var url = document.location.href;
      return url;
    }

    embedPress() {
      var host = document.location.protocol + "//" + document.location.host;
      var pathname = document.location.pathname;
      var p = pathname.split("/");

      if (p.length > 0) {
        p[p.length - 1] = "embed.html";
      }

      var id = paella.initDelegate.getId();
      var url = host + p.join("/") + "?id=" + id; //var paused = paella.player.videoContainer.paused();
      //$(document).trigger(paella.events.pause);

      var divSelectSize = "<div style='display:inline-block;'> " + "    <div class='embedSizeButton' style='width:110px; height:73px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 620x349 </span></div>" + "    <div class='embedSizeButton' style='width:100px; height:65px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 540x304 </span></div>" + "    <div class='embedSizeButton' style='width:90px;  height:58px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 460x259 </span></div>" + "    <div class='embedSizeButton' style='width:80px;  height:50px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 380x214 </span></div>" + "    <div class='embedSizeButton' style='width:70px;  height:42px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 300x169 </span></div>" + "</div><div style='display:inline-block; vertical-align:bottom; margin-left:10px;'>" + "    <div>" + base.dictionary.translate("Custom size:") + "</div>" + "    <div>" + base.dictionary.translate("Width:") + " <input id='social_embed_width-input' class='embedSizeInput' maxlength='4' type='text' name='Costum width min 300px' alt='Costum width min 300px' title='Costum width min 300px' value=''></div>" + "    <div>" + base.dictionary.translate("Height:") + " <input id='social_embed_height-input' class='embedSizeInput' maxlength='4' type='text' name='Costum width min 300px' alt='Costum width min 300px' title='Costum width min 300px' value=''></div>" + "</div>";
      var divEmbed = "<div id='embedContent' style='text-align:left; font-size:14px; color:black;'><div id=''>" + divSelectSize + "</div> <div id=''>" + base.dictionary.translate("Choose your embed size. Copy the text and paste it in your html page.") + "</div> <div id=''><textarea id='social_embed-textarea' class='social_embed-textarea' rows='4' cols='1' style='font-size:12px; width:95%; overflow:auto; margin-top:5px; color:black;'></textarea></div>  </div>";
      paella.messageBox.showMessage(divEmbed, {
        closeButton: true,
        width: '750px',
        height: '210px',

        onClose() {//      if (paused == false) {$(document).trigger(paella.events.play);}
        }

      });
      var w_e = $('#social_embed_width-input')[0];
      var h_e = $('#social_embed_height-input')[0];

      w_e.onkeyup = function (event) {
        var width = parseInt(w_e.value);
        var height = parseInt(h_e.value);

        if (isNaN(width)) {
          w_e.value = "";
        } else {
          if (width < 300) {
            $("#social_embed-textarea")[0].value = "Embed width too low. The minimum value is a width of 300.";
          } else {
            if (isNaN(height)) {
              height = (width / (16 / 9)).toFixed();
              h_e.value = height;
            }

            $("#social_embed-textarea")[0].value = '<iframe allowfullscreen src="' + url + '" style="border:0px #FFFFFF none;" name="Paella Player" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" width="' + width + '" height="' + height + '"></iframe>';
          }
        }
      };

      var embs = $(".embedSizeButton");

      for (var i = 0; i < embs.length; i = i + 1) {
        var e = embs[i];

        e.onclick = function (event) {
          var value = event.target ? event.target.textContent : event.toElement.textContent;

          if (value) {
            var size = value.trim().split("x");
            w_e.value = size[0];
            h_e.value = size[1];
            $("#social_embed-textarea")[0].value = '<iframe allowfullscreen src="' + url + '" style="border:0px #FFFFFF none;" name="Paella Player" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" width="' + size[0] + '" height="' + size[1] + '"></iframe>';
          }
        };
      }
    }

  };
});
paella.addPlugin(function () {
  return class ThemeChooserPlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "themeChooserPlugin";
    }

    getIconClass() {
      return 'icon-paintbrush';
    }

    getIndex() {
      return 2030;
    }

    getName() {
      return "es.upv.paella.themeChooserPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Change theme");
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    checkEnabled(onSuccess) {
      this.currentUrl = null;
      this.currentMaster = null;
      this.currentSlave = null;
      this.availableMasters = [];
      this.availableSlaves = [];

      if (paella.player.config.skin && paella.player.config.skin.available && paella.player.config.skin.available instanceof Array && paella.player.config.skin.available.length > 0) {
        onSuccess(true);
      } else {
        onSuccess(false);
      }
    }

    buildContent(domElement) {
      var This = this;
      paella.player.config.skin.available.forEach(function (item) {
        var elem = document.createElement('div');
        elem.className = "themebutton";
        elem.innerText = item.replace('-', ' ').replace('_', ' ');
        $(elem).click(function (event) {
          paella.utils.skin.set(item);
          paella.player.controls.hidePopUp(This.getName());
        });
        domElement.appendChild(elem);
      });
    }

  };
});
paella.addDataDelegate("cameraTrack", () => {
  return class TrackCameraDataDelegate extends paella.DataDelegate {
    read(context, params, onSuccess) {
      let videoUrl = paella.player.videoLoader.getVideoUrl();

      if (videoUrl) {
        videoUrl += 'trackhd.json';
        paella.utils.ajax.get({
          url: videoUrl
        }, data => {
          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch (err) {}
          }

          data.positions.sort((a, b) => {
            return a.time - b.time;
          });
          onSuccess(data);
        }, () => onSuccess(null));
      } else {
        onSuccess(null);
      }
    }

    write(context, params, value, onSuccess) {}

    remove(context, params, onSuccess) {}

  };
});

(() => {
  // Used to connect the toolbar button with the track4k plugin
  let g_track4kPlugin = null;

  function updatePosition(positionData, nextFrameData) {
    let twinTime = nextFrameData ? (nextFrameData.time - positionData.time) * 1000 : 100;
    if (twinTime > 2000) twinTime = 2000;
    let rect = positionData && positionData.rect || [0, 0, 0, 0];
    let offset_x = Math.abs(rect[0]);
    let offset_y = Math.abs(rect[1]);
    let view_width = rect[2];
    let view_height = rect[3];
    let zoom = this._videoData.originalWidth / view_width;
    let left = offset_x / this._videoData.originalWidth;
    let top = offset_y / this._videoData.originalHeight;
    paella.player.videoContainer.masterVideo().setZoom(zoom * 100, left * zoom * 100, top * zoom * 100, twinTime);
  }

  function nextFrame(time) {
    let index = -1;
    time = Math.round(time);

    this._trackData.some((data, i) => {
      if (data.time >= time) {
        index = i;
      }

      return index !== -1;
    }); // Index contains the current frame index


    if (this._trackData.length > index + 1) {
      return this._trackData[index + 1];
    } else {
      return null;
    }
  }

  function prevFrame(time) {
    let frame = this._trackData[0];
    time = Math.round(time);

    this._trackData.some((data, i, frames) => {
      if (frames[i + 1]) {
        if (data.time <= time && frames[i + 1].time > time) {
          return true;
        }
      } else {
        return true;
      }

      frame = data;
      return false;
    });

    return frame;
  }

  function curFrame(time) {
    let frameRect = null;
    time = Math.round(time);

    this._trackData.some((data, i, frames) => {
      if (data.time <= time) {
        if (frames[i + 1]) {
          if (frames[i + 1].time > time) {
            frameRect = data;
          }
        } else {
          frameRect = data;
        }
      }

      return frameRect !== null;
    });

    return frameRect;
  }

  paella.addPlugin(function () {
    return class Track4KPlugin extends paella.EventDrivenPlugin {
      constructor() {
        super();
        g_track4kPlugin = this;
        this._videoData = {};
        this._trackData = [];
        this._enabled = true;
      }

      checkEnabled(cb) {
        paella.data.read('cameraTrack', {
          id: paella.initDelegate.getId()
        }, data => {
          if (data) {
            this._videoData.width = data.width;
            this._videoData.height = data.height;
            this._videoData.originalWidth = data.originalWidth;
            this._videoData.originalHeight = data.originalHeight;
            this._trackData = data.positions;
            this._enabled = true;
          } else {
            this._enabled = false;
          }

          cb(this._enabled);
        });
      }

      get enabled() {
        return this._enabled;
      }

      set enabled(e) {
        this._enabled = e;

        if (this._enabled) {
          let thisClass = this;
          paella.player.videoContainer.currentTime().then(function (time) {
            thisClass.updateZoom(time);
          });
        }
      }

      getName() {
        return "es.upv.paella.track4kPlugin";
      }

      getEvents() {
        return [paella.events.timeupdate, paella.events.play, paella.events.seekToTime];
      }

      onEvent(eventType, data) {
        if (!this._trackData.length) return;

        if (eventType === paella.events.play) {} else if (eventType === paella.events.timeupdate) {
          this.updateZoom(data.currentTime);
        } else if (eventType === paella.events.seekToTime) {
          this.seekTo(data.newPosition);
        }
      }

      updateZoom(currentTime) {
        if (this._enabled) {
          let data = curFrame.apply(this, [currentTime]);
          let nextFrameData = nextFrame.apply(this, [currentTime]);

          if (data && this._lastPosition !== data) {
            this._lastPosition = data;
            updatePosition.apply(this, [data, nextFrameData]);
          }
        }
      }

      seekTo(time) {
        let data = prevFrame.apply(this, [time]);

        if (data && this._enabled) {
          this._lastPosition = data;
          updatePosition.apply(this, [data]);
        }
      }

    };
  });
  paella.addPlugin(function () {
    return class VideoZoomTrack4KPlugin extends paella.ButtonPlugin {
      getAlignment() {
        return 'right';
      }

      getSubclass() {
        return "videoZoomToolbar";
      }

      getIconClass() {
        return 'icon-screen';
      }

      closeOnMouseOut() {
        return true;
      }

      getIndex() {
        return 2030;
      }

      getName() {
        return "es.upv.paella.videoZoomTrack4kPlugin";
      }

      getDefaultToolTip() {
        return base.dictionary.translate("Set video zoom");
      }

      getButtonType() {
        return paella.ButtonPlugin.type.popUpButton;
      }

      checkEnabled(onSuccess) {
        let players = paella.player.videoContainer.streamProvider.videoPlayers;
        let pluginData = paella.player.config.plugins.list[this.getName()];
        let playerIndex = pluginData.targetStreamIndex;
        let autoByDefault = pluginData.autoModeByDefault;
        this.targetPlayer = players.length > playerIndex ? players[playerIndex] : null;
        g_track4kPlugin.enabled = autoByDefault;
        onSuccess(paella.player.config.player.videoZoom.enabled && this.targetPlayer && this.targetPlayer.allowZoom());
      }

      setup() {
        if (this.config.autoModeByDefault) {
          this.zoomAuto();
        } else {
          this.resetZoom();
        }
      }

      buildContent(domElement) {
        this.changeIconClass("icon-mini-zoom-in");

        g_track4kPlugin.updateTrackingStatus = () => {
          if (g_track4kPlugin.enabled) {
            $('.zoom-auto').addClass("autoTrackingActivated");
            $('.icon-mini-zoom-in').addClass("autoTrackingActivated");
          } else {
            $('.zoom-auto').removeClass("autoTrackingActivated");
            $('.icon-mini-zoom-in').removeClass("autoTrackingActivated");
          }
        };

        paella.events.bind(paella.events.videoZoomChanged, (evt, target) => {
          g_track4kPlugin.updateTrackingStatus;
        });
        g_track4kPlugin.updateTrackingStatus;

        function getZoomButton(className, onClick, content) {
          let btn = document.createElement('div');
          btn.className = `videoZoomToolbarItem ${className}`;

          if (content) {
            btn.innerText = content;
          } else {
            btn.innerHTML = `<i class="glyphicon glyphicon-${className}"></i>`;
          }

          $(btn).click(onClick);
          return btn;
        }

        domElement.appendChild(getZoomButton('zoom-in', evt => {
          this.zoomIn();
        }));
        domElement.appendChild(getZoomButton('zoom-out', evt => {
          this.zoomOut();
        }));
        domElement.appendChild(getZoomButton('picture', evt => {
          this.resetZoom();
        }));
        domElement.appendChild(getZoomButton('zoom-auto', evt => {
          this.zoomAuto();
          paella.player.controls.hidePopUp(this.getName());
        }, "auto"));
      }

      zoomIn() {
        g_track4kPlugin.enabled = false;
        this.targetPlayer.zoomIn();
      }

      zoomOut() {
        g_track4kPlugin.enabled = false;
        this.targetPlayer.zoomOut();
      }

      resetZoom() {
        g_track4kPlugin.enabled = false;
        this.targetPlayer.setZoom(100, 0, 0, 500);
        if (g_track4kPlugin.updateTrackingStatus) g_track4kPlugin.updateTrackingStatus();
      }

      zoomAuto() {
        g_track4kPlugin.enabled = !g_track4kPlugin.enabled;
        if (g_track4kPlugin.updateTrackingStatus) g_track4kPlugin.updateTrackingStatus();
      }

    };
  });
})();
(() => {
  paella.plugins.translectures = {};
  /*
  Class ("paella.captions.translectures.Caption", paella.captions.Caption, {
  	initialize: function(id, format, url, lang, editURL, next) {
  		this.parent(id, format, url, lang, next);
  		this._captionsProvider = "translecturesCaptionsProvider";
  		this._editURL = editURL;
  	},
  	
  	canEdit: function(next) {
  		// next(err, canEdit)
  		next(false, ((this._editURL != undefined)&&(this._editURL != "")));
  	},
  	
  	goToEdit: function() {		
  		var self = this;
  		paella.player.auth.userData().then(function(userData){
  			if (userData.isAnonymous == true) {
  				self.askForAnonymousOrLoginEdit();
  			}
  			else {
  				self.doEdit();
  			}		
  		});	
  	},
  		
  	doEdit: function() {
  		window.location.href = this._editURL;		
  	},
  	doLoginAndEdit: function() {
  		paella.player.auth.login(this._editURL);
  	},
  	
  	askForAnonymousOrLoginEdit: function() {
  		var self = this;
  
  		var messageBoxElem = document.createElement('div');
  		messageBoxElem.className = "translecturesCaptionsMessageBox";
  
  		var messageBoxTitle = document.createElement('div');
  		messageBoxTitle.className = "title";
  		messageBoxTitle.innerText = base.dictionary.translate("You are trying to modify the transcriptions, but you are not Logged in!");		
  		messageBoxElem.appendChild(messageBoxTitle);
  
  		var messageBoxAuthContainer = document.createElement('div');
  		messageBoxAuthContainer.className = "authMethodsContainer";
  		messageBoxElem.appendChild(messageBoxAuthContainer);
  
  		// Anonymous edit
  		var messageBoxAuth = document.createElement('div');
  		messageBoxAuth.className = "authMethod";
  		messageBoxAuthContainer.appendChild(messageBoxAuth);
  
  		var messageBoxAuthLink = document.createElement('a');
  		messageBoxAuthLink.href = "#";
  		messageBoxAuthLink.style.color = "#004488";
  		messageBoxAuth.appendChild(messageBoxAuthLink);
  
  		var messageBoxAuthLinkImg = document.createElement('img');
  		messageBoxAuthLinkImg.src = "resources/style/caption_mlangs_anonymous.png";
  		messageBoxAuthLinkImg.alt = "Anonymous";
  		messageBoxAuthLinkImg.style.height = "100px";
  		messageBoxAuthLink.appendChild(messageBoxAuthLinkImg);
  
  		var messageBoxAuthLinkText = document.createElement('p');
  		messageBoxAuthLinkText.innerText = base.dictionary.translate("Continue editing the transcriptions anonymously");
  		messageBoxAuthLink.appendChild(messageBoxAuthLinkText);
  
  		$(messageBoxAuthLink).click(function() {
  			self.doEdit();
  		});
  
  		// Auth edit
  		messageBoxAuth = document.createElement('div');
  		messageBoxAuth.className = "authMethod";
  		messageBoxAuthContainer.appendChild(messageBoxAuth);
  
  		messageBoxAuthLink = document.createElement('a');
  		messageBoxAuthLink.href = "#";
  		messageBoxAuthLink.style.color = "#004488";
  		messageBoxAuth.appendChild(messageBoxAuthLink);
  
  		messageBoxAuthLinkImg = document.createElement('img');
  		messageBoxAuthLinkImg.src = "resources/style/caption_mlangs_lock.png";
  		messageBoxAuthLinkImg.alt = "Login";
  		messageBoxAuthLinkImg.style.height = "100px";
  		messageBoxAuthLink.appendChild(messageBoxAuthLinkImg);
  
  		messageBoxAuthLinkText = document.createElement('p');
  		messageBoxAuthLinkText.innerText = base.dictionary.translate("Log in and edit the transcriptions");
  		messageBoxAuthLink.appendChild(messageBoxAuthLinkText);
  
  
  		$(messageBoxAuthLink).click(function() {
  			self.doLoginAndEdit();
  		});
  
  		// Show UI		
  		paella.messageBox.showElement(messageBoxElem);
  	}
  });
  
  paella.captions.translectures.Caption = Caption;
  
  Class ("paella.plugins.translectures.CaptionsPlugIn", paella.EventDrivenPlugin, {
  		
  	getName:function() { return "es.upv.paella.translecture.captionsPlugin"; },
  	getEvents:function() { return []; },
  	onEvent:function(eventType,params) {},
  
  	checkEnabled: function(onSuccess) {
  		var self = this;
  		var video_id = paella.player.videoIdentifier;
  				
  		if ((this.config.tLServer == undefined) || (this.config.tLdb == undefined)){
  			base.log.warning(this.getName() + " plugin not configured!");
  			onSuccess(false);
  		}
  		else {
  			var langs_url = (this.config.tLServer + "/langs?db=${tLdb}&id=${videoId}").replace(/\$\{videoId\}/ig, video_id).replace(/\$\{tLdb\}/ig, this.config.tLdb);
  			base.ajax.get({url: langs_url},
  				function(data, contentType, returnCode, dataRaw) {					
  					if (data.scode == 0) {
  						data.langs.forEach(function(l){
  							var l_get_url = (self.config.tLServer + "/dfxp?format=1&pol=0&db=${tLdb}&id=${videoId}&lang=${tl.lang.code}")
  								.replace(/\$\{videoId\}/ig, video_id)
  								.replace(/\$\{tLdb\}/ig, self.config.tLdb)
  								.replace(/\$\{tl.lang.code\}/ig, l.code);
  														
  							var l_edit_url;							
  							if (self.config.tLEdit) {
  								l_edit_url = self.config.tLEdit
  									.replace(/\$\{videoId\}/ig, video_id)
  									.replace(/\$\{tLdb\}/ig, self.config.tLdb)
  									.replace(/\$\{tl.lang.code\}/ig, l.code);
  							}
  							
  							var l_txt = l.value;
  				            switch(l.type){
  						    	case 0:
  						    		l_txt += " (" + paella.dictionary.translate("Auto") + ")";
  						    		break;
  						    	case 1:
  						    		l_txt += " (" + paella.dictionary.translate("Under review") + ")";
  						    		break;
  						    }
  														
  							var c = new paella.captions.translectures.Caption(l.code , "dfxp", l_get_url, {code: l.code, txt: l_txt}, l_edit_url);
  							paella.captions.addCaptions(c);
  						});
  						onSuccess(false);
  					}
  					else {
  						base.log.debug("Error getting available captions from translectures: " + langs_url);
  						onSuccess(false);
  					}
  				},						
  				function(data, contentType, returnCode) {
  					base.log.debug("Error getting available captions from translectures: " + langs_url);
  					onSuccess(false);
  				}
  			);			
  		}
  	}	
  });
  
  //new paella.plugins.translectures.CaptionsPlugIn();
  */
})();
paella.addPlugin(function () {
  return class ElasticsearchSaverPlugin extends paella.userTracking.SaverPlugIn {
    getName() {
      return "es.upv.paella.usertracking.elasticsearchSaverPlugin";
    }

    checkEnabled(onSuccess) {
      this.type = 'userTrackingSaverPlugIn';
      this._url = this.config.url;
      this._index = this.config.index || "paellaplayer";
      this._type = this.config.type || "usertracking";
      var enabled = true;

      if (this._url == undefined) {
        enabled = false;
        base.log.debug("No ElasticSearch URL found in config file. Disabling ElasticSearch PlugIn");
      }

      onSuccess(enabled);
    }

    log(event, params) {
      var p = params;

      if (typeof p != "object") {
        p = {
          value: p
        };
      }

      let currentTime = 0;
      paella.player.videoContainer.currentTime().then(t => {
        currentTime = t;
        return paella.player.videoContainer.paused();
      }).then(paused => {
        var log = {
          date: new Date(),
          video: paella.initDelegate.getId(),
          playing: !paused,
          time: parseInt(currentTime + paella.player.videoContainer.trimStart()),
          event: event,
          params: p
        };
        paella.ajax.post({
          url: this._url + "/" + this._index + "/" + this._type + "/",
          params: JSON.stringify(log)
        });
      });
    }

  };
});
paella.addPlugin(function () {
  return class GoogleAnalyticsTracking extends paella.userTracking.SaverPlugIn {
    getName() {
      return "es.upv.paella.usertracking.GoogleAnalyticsSaverPlugin";
    }

    checkEnabled(onSuccess) {
      var trackingID = this.config.trackingID;
      var domain = this.config.domain || "auto";

      if (trackingID) {
        base.log.debug("Google Analitycs Enabled");
        /* jshint ignore:start */

        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
          }, i[r].l = 1 * new Date();
          a = s.createElement(o), m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m);
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', '__gaTracker');
        /* jshint ignore:end */


        __gaTracker('create', trackingID, domain);

        __gaTracker('send', 'pageview');

        onSuccess(true);
      } else {
        base.log.debug("No Google Tracking ID found in config file. Disabling Google Analitycs PlugIn");
        onSuccess(false);
      }
    }

    log(event, params) {
      if (this.config.category === undefined || this.config.category === true) {
        var category = this.config.category || "PaellaPlayer";
        var action = event;
        var label = "";

        try {
          label = JSON.stringify(params);
        } catch (e) {}

        __gaTracker('send', 'event', category, action, label);
      }
    }

  };
});
var _paq = _paq || [];

paella.addPlugin(function () {
  return class PiwikAnalyticsTracking extends paella.userTracking.SaverPlugIn {
    getName() {
      return "es.upv.paella.usertracking.piwikSaverPlugIn";
    }

    checkEnabled(onSuccess) {
      if (this.config.tracker && this.config.siteId) {
        _paq.push(['trackPageView']);

        _paq.push(['enableLinkTracking']);

        (function () {
          var u = this.config.tracker;

          _paq.push(['setTrackerUrl', u + '/piwik.php']);

          _paq.push(['setSiteId', this.config.siteId]);

          var d = document,
              g = d.createElement('script'),
              s = d.getElementsByTagName('script')[0];
          g.type = 'text/javascript';
          g.async = true;
          g.defer = true;
          g.src = u + 'piwik.js';
          s.parentNode.insertBefore(g, s);
          onSuccess(true);
        })();
      } else {
        onSuccess(false);
      }
    }

    log(event, params) {
      var category = this.config.category || "PaellaPlayer";
      var action = event;
      var label = "";

      try {
        label = JSON.stringify(params);
      } catch (e) {}

      _paq.push(['trackEvent', category, action, label]);
    }

  };
});
(() => {
  function buildVideo360Canvas(stream, canvas) {
    class Video360Canvas extends bg.app.WindowController {
      constructor(stream) {
        super();
        this.stream = stream;
      }

      get video() {
        return this.texture ? this.texture.video : null;
      }

      loaded() {
        return new Promise(resolve => {
          let checkLoaded = () => {
            if (this.video) {
              resolve(this);
            } else {
              setTimeout(checkLoaded, 100);
            }
          };

          checkLoaded();
        });
      }

      buildScene() {
        this._root = new bg.scene.Node(this.gl, "Root node");
        bg.base.Loader.RegisterPlugin(new bg.base.TextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VWGLBLoaderPlugin());
        bg.base.Loader.Load(this.gl, this.stream.src).then(texture => {
          this.texture = texture;
          let sphere = bg.scene.PrimitiveFactory.Sphere(this.gl, 1, 50);
          let sphereNode = new bg.scene.Node(this.gl);
          sphereNode.addComponent(sphere);
          sphere.getMaterial(0).texture = texture;
          sphere.getMaterial(0).lightEmission = 0.0;
          sphere.getMaterial(0).lightEmissionMaskInvert = false;
          sphere.getMaterial(0).cullFace = false;
          sphereNode.addComponent(new bg.scene.Transform(bg.Matrix4.Scale(1, -1, 1)));

          this._root.addChild(sphereNode);
        });
        let lightNode = new bg.scene.Node(this.gl, "Light");
        let l = new bg.base.Light();
        l.ambient = bg.Color.White();
        l.diffuse = bg.Color.Black();
        l.specular = bg.Color.Black();
        lightNode.addComponent(new bg.scene.Light(l));

        this._root.addChild(lightNode);

        this._camera = new bg.scene.Camera();
        let cameraNode = new bg.scene.Node("Camera");
        cameraNode.addComponent(this._camera);
        cameraNode.addComponent(new bg.scene.Transform(bg.Matrix4.Translation(0, 0, 0)));
        let oc = new bg.manipulation.OrbitCameraController();
        cameraNode.addComponent(oc);
        oc.maxPitch = 90;
        oc.minPitch = -90;
        oc.maxDistance = 0;
        oc.minDistace = 0;

        this._root.addChild(cameraNode);
      }

      init() {
        bg.Engine.Set(new bg.webgl1.Engine(this.gl));
        this.buildScene();
        this._renderer = bg.render.Renderer.Create(this.gl, bg.render.RenderPath.FORWARD);
        this._inputVisitor = new bg.scene.InputVisitor();
      }

      frame(delta) {
        if (this.texture) {
          this.texture.update();
        }

        this._renderer.frame(this._root, delta);

        this.postReshape();
      }

      display() {
        this._renderer.display(this._root, this._camera);
      }

      reshape(width, height) {
        this._camera.viewport = new bg.Viewport(0, 0, width, height);

        this._camera.projection.perspective(60, this._camera.viewport.aspectRatio, 0.1, 100);
      } // Pass the input events to the scene


      mouseDown(evt) {
        this._inputVisitor.mouseDown(this._root, evt);
      }

      mouseDrag(evt) {
        this._inputVisitor.mouseDrag(this._root, evt);

        this.postRedisplay();
      }

      mouseWheel(evt) {
        this._inputVisitor.mouseWheel(this._root, evt);

        this.postRedisplay();
      }

      touchStart(evt) {
        this._inputVisitor.touchStart(this._root, evt);
      }

      touchMove(evt) {
        this._inputVisitor.touchMove(this._root, evt);

        this.postRedisplay();
      } // You may pass also the following events, but they aren't used by the camera controller


      mouseUp(evt) {
        this._inputVisitor.mouseUp(this._root, evt);
      }

      mouseMove(evt) {
        this._inputVisitor.mouseMove(this._root, evt);
      }

      mouseOut(evt) {
        this._inputVisitor.mouseOut(this._root, evt);
      }

      touchEnd(evt) {
        this._inputVisitor.touchEnd(this._root, evt);
      }

    }

    let controller = new Video360Canvas(stream);
    let mainLoop = bg.app.MainLoop.singleton;
    mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
    mainLoop.canvas = canvas;
    mainLoop.run(controller);
    return controller.loaded();
  }

  class Video360 extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height, streamName) {
      super(id, stream, 'canvas', 0, 0, 1280, 720);
      this._posterFrame = null;
      this._currentQuality = null;
      this._autoplay = false;
      this._streamName = null;
      this._streamName = streamName || 'video360';
      var This = this;
      paella.player.videoContainer.disablePlayOnClick();

      if (this._stream.sources[this._streamName]) {
        this._stream.sources[this._streamName].sort(function (a, b) {
          return a.res.h - b.res.h;
        });
      }

      this.video = null;

      function onProgress(event) {
        if (!This._ready && This.video.readyState == 4) {
          This._ready = true;

          if (This._initialCurrentTipe !== undefined) {
            This.video.currentTime = This._initialCurrentTime;
            delete This._initialCurrentTime;
          }

          This._callReadyEvent();
        }
      }

      function evtCallback(event) {
        onProgress.apply(This, event);
      }

      function onUpdateSize() {
        if (This.canvasController) {
          let canvas = This.canvasController.canvas.domElement; //This.canvasController.reshape($(canvas).width(),$(canvas).height());
        }
      }

      let timer = new paella.Timer(function (timer) {
        onUpdateSize();
      }, 500);
      timer.repeat = true;
    }

    defaultProfile() {
      return 'chroma';
    }

    _setVideoElem(video) {
      $(this.video).bind('progress', evtCallback);
      $(this.video).bind('loadstart', evtCallback);
      $(this.video).bind('loadedmetadata', evtCallback);
      $(this.video).bind('canplay', evtCallback);
      $(this.video).bind('oncanplay', evtCallback);
    }

    _deferredAction(action) {
      return new Promise((resolve, reject) => {
        if (this.video) {
          resolve(action());
        } else {
          $(this.video).bind('canplay', () => {
            this._ready = true;
            resolve(action());
          });
        }
      });
    }

    _getQualityObject(index, s) {
      return {
        index: index,
        res: s.res,
        src: s.src,
        toString: function () {
          return this.res.w + "x" + this.res.h;
        },
        shortLabel: function () {
          return this.res.h + "p";
        },
        compare: function (q2) {
          return this.res.w * this.res.h - q2.res.w * q2.res.h;
        }
      };
    } // Initialization functions


    allowZoom() {
      return false;
    }

    getVideoData() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._deferredAction(() => {
          resolve({
            duration: This.video.duration,
            currentTime: This.video.currentTime,
            volume: This.video.volume,
            paused: This.video.paused,
            ended: This.video.ended,
            res: {
              w: This.video.videoWidth,
              h: This.video.videoHeight
            }
          });
        });
      });
    }

    setPosterFrame(url) {
      this._posterFrame = url;
    }

    setAutoplay(auto) {
      this._autoplay = auto;

      if (auto && this.video) {
        this.video.setAttribute("autoplay", auto);
      }
    }

    load() {
      var This = this;
      return new Promise((resolve, reject) => {
        let sources = this._stream.sources[this._streamName];

        if (this._currentQuality === null && this._videoQualityStrategy) {
          this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
        }

        let stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
        paella.getVideoCanvas().then(WebGLVideoCanvas => {
          class MyWebGLVideoCanvas extends WebGLVideoCanvas {
            buildVideoSurface(sceneRoot, videoTexture) {
              let sphere = bg.scene.PrimitiveFactory.Sphere(this.gl, 1, 50);
              let sphereNode = new bg.scene.Node(this.gl);
              sphereNode.addComponent(sphere);
              sphere.getMaterial(0).texture = videoTexture;
              sphere.getMaterial(0).lightEmission = 0;
              sphere.getMaterial(0).lightEmissionMaskInvert = false;
              sphere.getMaterial(0).cullFace = false;
              sphereNode.addComponent(new bg.scene.Transform(bg.Matrix4.Scale(1, -1, 1)));
              sceneRoot.addChild(sphereNode);
            }

            mouseWheel(evt) {
              console.log(evt);
              let proj = this.camera && this.camera.projectionStrategy;

              if (proj) {
                let minFocalLength = 30;
                let maxFocalLength = 200;
                proj.focalLength = proj.focalLength + evt.delta;

                if (proj.focalLength < minFocalLength) {
                  proj.focalLength = minFocalLength;
                } else if (proj.focalLength > maxFocalLength) {
                  proj.focalLength = maxFocalLength;
                }

                this.postRedisplay();
              }
            }

          }

          ;
          this.video = null;

          if (stream) {
            this.canvasController = null;
            let controller = new MyWebGLVideoCanvas(stream);
            let mainLoop = bg.app.MainLoop.singleton;
            mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
            mainLoop.canvas = this.domElement;
            mainLoop.run(controller);
            return controller.loaded();
          } else {
            reject(new Error("Could not load video: invalid quality stream index"));
          }
        }).then(canvasController => {
          this.canvasController = canvasController;
          this.video = canvasController.video;
          this.video.pause();
          this.disableEventCapture();
          resolve(stream);
        });
      });
    }

    getQualities() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          var sources = this._stream.sources[this._streamName];
          var index = -1;
          sources.forEach(s => {
            index++;
            result.push(this._getQualityObject(index, s));
          });
          resolve(result);
        }, 10);
      });
    }

    setQuality(index) {
      return new Promise(resolve => {
        var paused = this.video.paused;
        var sources = this._stream.sources[this._streamName];
        this._currentQuality = index < sources.length ? index : 0;
        var currentTime = this.video.currentTime;
        this.freeze().then(() => {
          this._ready = false;
          return this.load();
        }).then(() => {
          if (!paused) {
            this.play();
          }

          $(this.video).on('seeked', () => {
            this.unFreeze();
            resolve();
            $(this.video).off('seeked');
          });
          this.video.currentTime = currentTime;
        });
      });
    }

    getCurrentQuality() {
      return new Promise(resolve => {
        resolve(this._getQualityObject(this._currentQuality, this._stream.sources[this._streamName][this._currentQuality]));
      });
    }

    play() {
      return this._deferredAction(() => {
        bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.AUTO;
        this.video.play();
      });
    }

    pause() {
      return this._deferredAction(() => {
        bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.MANUAL;
        this.video.pause();
      });
    }

    isPaused() {
      return this._deferredAction(() => {
        return this.video.paused;
      });
    }

    duration() {
      return this._deferredAction(() => {
        return this.video.duration;
      });
    }

    setCurrentTime(time) {
      return this._deferredAction(() => {
        this.video.currentTime = time;
        $(this.video).on('seeked', () => {
          this.canvasController.postRedisplay();
          $(this.video).off('seeked');
        });
      });
    }

    currentTime() {
      return this._deferredAction(() => {
        return this.video.currentTime;
      });
    }

    setVolume(volume) {
      return this._deferredAction(() => {
        this.video.volume = volume;
      });
    }

    volume() {
      return this._deferredAction(() => {
        return this.video.volume;
      });
    }

    setPlaybackRate(rate) {
      return this._deferredAction(() => {
        this.video.playbackRate = rate;
      });
    }

    playbackRate() {
      return this._deferredAction(() => {
        return this.video.playbackRate;
      });
    }

    goFullScreen() {
      return this._deferredAction(() => {
        var elem = this.video;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      });
    }

    unFreeze() {
      return this._deferredAction(() => {
        var c = document.getElementById(this.video.className + "canvas");
        $(c).remove();
      });
    }

    freeze() {
      var This = this;
      return this._deferredAction(function () {});
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.Video360 = Video360;

  class Video360Factory extends paella.VideoFactory {
    isStreamCompatible(streamData) {
      try {
        if (paella.ChromaVideo._loaded) {
          return false;
        }

        if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
          return false;
        }

        for (var key in streamData.sources) {
          if (key == 'video360') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      paella.ChromaVideo._loaded = true;
      ++paella.videoFactories.Html5VideoFactory.s_instances;
      return new paella.Video360(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.Video360Factory = Video360Factory;
})();
(() => {
  function buildVideo360ThetaCanvas(stream, canvas) {
    function cyln2world(a, e) {
      return new bg.Vector3(Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e));
    }

    function world2fish(x, y, z) {
      let nz = z;
      if (z < -1.0) nz = -1.0;else if (z > 1.0) nz = 1.0;
      return new bg.Vector2(Math.atan2(y, x), Math.acos(nz) / Math.PI); // 0.0 to 1.0
    }

    function calcTexUv(i, j, lens) {
      const world = cyln2world(((i + 90) / 180.0 - 1.0) * Math.PI, // rotate 90 deg for polygon
      (0.5 - j / 180.0) * Math.PI);
      const ar = world2fish(Math.sin(-0.5 * Math.PI) * world.z + Math.cos(-0.5 * Math.PI) * world.x, world.y, Math.cos(-0.5 * Math.PI) * world.z - Math.sin(-0.5 * Math.PI) * world.x);
      const fishRad = 0.883;
      const fishRad2 = fishRad * 0.88888888888888;
      const fishCenter = 1.0 - 0.44444444444444;
      const x = lens === 0 ? fishRad * ar.y * Math.cos(ar.x) * 0.5 + 0.25 : fishRad * (1.0 - ar.y) * Math.cos(-1.0 * ar.x + Math.PI) * 0.5 + 0.75;
      const y = lens === 0 ? fishRad2 * ar.y * Math.sin(ar.x) + fishCenter : fishRad2 * (1.0 - ar.y) * Math.sin(-1.0 * ar.x + Math.PI) + fishCenter;
      return new bg.Vector2(x, y);
    }

    function buildViewerNode(ctx) {
      let radius = 1;
      let node = new bg.scene.Node(ctx);
      let drw = new bg.scene.Drawable();
      node.addComponent(drw);
      let plist = new bg.base.PolyList(ctx);
      let vertex = [];
      let normals = [];
      let uvs = [];
      let index = [];

      for (let j = 0; j <= 180; j += 5) {
        for (let i = 0; i <= 360; i += 5) {
          vertex.push(new bg.Vector3(Math.sin(Math.PI * j / 180.0) * Math.sin(Math.PI * i / 180.0) * radius, Math.cos(Math.PI * j / 180.0) * radius, Math.sin(Math.PI * j / 180.0) * Math.cos(Math.PI * i / 180.0) * radius));
          normals.push(new bg.Vector3(0, 0, -1));
        }
        /* devide texture */


        for (let k = 0; k <= 180; k += 5) {
          uvs.push(calcTexUv(k, j, 0));
        }

        for (let l = 180; l <= 360; l += 5) {
          uvs.push(calcTexUv(l, j, 1));
        }
      }

      function addFace(v0, v1, v2, n0, n1, n2, uv0, uv1, uv2) {
        plist.vertex.push(v0.x);
        plist.vertex.push(v0.y);
        plist.vertex.push(v0.z);
        plist.vertex.push(v1.x);
        plist.vertex.push(v1.y);
        plist.vertex.push(v1.z);
        plist.vertex.push(v2.x);
        plist.vertex.push(v2.y);
        plist.vertex.push(v2.z);
        plist.normal.push(n0.x);
        plist.normal.push(n0.y);
        plist.normal.push(n0.z);
        plist.normal.push(n1.x);
        plist.normal.push(n1.y);
        plist.normal.push(n1.z);
        plist.normal.push(n2.x);
        plist.normal.push(n2.z);
        plist.normal.push(n2.z);
        plist.texCoord0.push(uv0.x);
        plist.texCoord0.push(uv0.y);
        plist.texCoord0.push(uv1.x);
        plist.texCoord0.push(uv1.y);
        plist.texCoord0.push(uv2.x);
        plist.texCoord0.push(uv2.y);
        plist.index.push(plist.index.length);
        plist.index.push(plist.index.length);
        plist.index.push(plist.index.length);
      }

      for (let m = 0; m < 36; m++) {
        for (let n = 0; n < 72; n++) {
          const v = m * 73 + n;
          const t = n < 36 ? m * 74 + n : m * 74 + n + 1;
          [uvs[t + 0], uvs[t + 1], uvs[t + 74]], [uvs[t + 1], uvs[t + 75], uvs[t + 74]];
          let v0 = vertex[v + 0];
          let n0 = normals[v + 0];
          let uv0 = uvs[t + 0];
          let v1 = vertex[v + 1];
          let n1 = normals[v + 1];
          let uv1 = uvs[t + 1];
          let v2 = vertex[v + 73];
          let n2 = normals[v + 73];
          let uv2 = uvs[t + 74];
          let v3 = vertex[v + 74];
          let n3 = normals[v + 74];
          let uv3 = uvs[t + 75];
          addFace(v0, v1, v2, n0, n1, n2, uv0, uv1, uv2);
          addFace(v1, v3, v2, n1, n3, n2, uv1, uv3, uv2);
        }
      }

      plist.build();
      drw.addPolyList(plist);
      let trx = bg.Matrix4.Scale(-1, 1, 1);
      node.addComponent(new bg.scene.Transform(trx));
      return node;
    }

    class Video360ThetaCanvas extends bg.app.WindowController {
      constructor(stream) {
        super();
        this.stream = stream;
      }

      get video() {
        return this.texture ? this.texture.video : null;
      }

      loaded() {
        return new Promise(resolve => {
          let checkLoaded = () => {
            if (this.video) {
              resolve(this);
            } else {
              setTimeout(checkLoaded, 100);
            }
          };

          checkLoaded();
        });
      }

      buildScene() {
        this._root = new bg.scene.Node(this.gl, "Root node");
        bg.base.Loader.RegisterPlugin(new bg.base.TextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VWGLBLoaderPlugin());
        bg.base.Loader.Load(this.gl, this.stream.src).then(texture => {
          this.texture = texture; //let sphere = bg.scene.PrimitiveFactory.Sphere(this.gl,1,50);
          //let sphereNode = new bg.scene.Node(this.gl);

          let viewerNode = buildViewerNode(this.gl);
          let sphere = viewerNode.component("bg.scene.Drawable");
          sphere.getMaterial(0).texture = texture;
          sphere.getMaterial(0).lightEmission = 1.0;
          sphere.getMaterial(0).lightEmissionMaskInvert = true;
          sphere.getMaterial(0).cullFace = false;

          this._root.addChild(viewerNode);

          this.postRedisplay();
        });
        let lightNode = new bg.scene.Node(this.gl, "Light");

        this._root.addChild(lightNode);

        this._camera = new bg.scene.Camera();
        let cameraNode = new bg.scene.Node("Camera");
        cameraNode.addComponent(this._camera);
        cameraNode.addComponent(new bg.scene.Transform());
        let oc = new bg.manipulation.OrbitCameraController();
        cameraNode.addComponent(oc);
        oc.maxPitch = 90;
        oc.minPitch = -90;
        oc.maxDistance = 0;
        oc.minDistace = 0;

        this._root.addChild(cameraNode);
      }

      init() {
        bg.Engine.Set(new bg.webgl1.Engine(this.gl));
        this.buildScene();
        this._renderer = bg.render.Renderer.Create(this.gl, bg.render.RenderPath.FORWARD);
        this._inputVisitor = new bg.scene.InputVisitor();
      }

      frame(delta) {
        if (this.texture) {
          this.texture.update();
        }

        this._renderer.frame(this._root, delta);
      }

      display() {
        this._renderer.display(this._root, this._camera);
      }

      reshape(width, height) {
        this._camera.viewport = new bg.Viewport(0, 0, width, height);

        this._camera.projection.perspective(60, this._camera.viewport.aspectRatio, 0.1, 100);
      } // Pass the input events to the scene


      mouseDown(evt) {
        this._inputVisitor.mouseDown(this._root, evt);
      }

      mouseDrag(evt) {
        this._inputVisitor.mouseDrag(this._root, evt);

        this.postRedisplay();
      }

      mouseWheel(evt) {
        this._inputVisitor.mouseWheel(this._root, evt);

        this.postRedisplay();
      }

      touchStart(evt) {
        this._inputVisitor.touchStart(this._root, evt);
      }

      touchMove(evt) {
        this._inputVisitor.touchMove(this._root, evt);

        this.postRedisplay();
      } // You may pass also the following events, but they aren't used by the camera controller


      mouseUp(evt) {
        this._inputVisitor.mouseUp(this._root, evt);
      }

      mouseMove(evt) {
        this._inputVisitor.mouseMove(this._root, evt);
      }

      mouseOut(evt) {
        this._inputVisitor.mouseOut(this._root, evt);
      }

      touchEnd(evt) {
        this._inputVisitor.touchEnd(this._root, evt);
      }

    }

    let controller = new Video360ThetaCanvas(stream);
    let mainLoop = bg.app.MainLoop.singleton;
    mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
    mainLoop.canvas = canvas;
    mainLoop.run(controller);
    return controller.loaded();
  }

  class Video360Theta extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height, streamName) {
      super(id, stream, 'canvas', 0, 0, 1280, 720);
      this._posterFrame = null;
      this._currentQuality = null;
      this._autoplay = false;
      this._streamName = null;
      this._streamName = streamName || 'video360theta';
      var This = this;
      paella.player.videoContainer.disablePlayOnClick();

      if (this._stream.sources[this._streamName]) {
        this._stream.sources[this._streamName].sort(function (a, b) {
          return a.res.h - b.res.h;
        });
      }

      this.video = null;

      function onProgress(event) {
        if (!This._ready && This.video.readyState == 4) {
          This._ready = true;

          if (This._initialCurrentTipe !== undefined) {
            This.video.currentTime = This._initialCurrentTime;
            delete This._initialCurrentTime;
          }

          This._callReadyEvent();
        }
      }

      function evtCallback(event) {
        onProgress.apply(This, event);
      }

      function onUpdateSize() {
        if (This.canvasController) {
          let canvas = This.canvasController.canvas.domElement; //This.canvasController.reshape($(canvas).width(),$(canvas).height());
        }
      }

      let timer = new paella.Timer(function (timer) {
        onUpdateSize();
      }, 500);
      timer.repeat = true;
    }

    defaultProfile() {
      return 'chroma';
    }

    _setVideoElem(video) {
      $(this.video).bind('progress', evtCallback);
      $(this.video).bind('loadstart', evtCallback);
      $(this.video).bind('loadedmetadata', evtCallback);
      $(this.video).bind('canplay', evtCallback);
      $(this.video).bind('oncanplay', evtCallback);
    }

    _loadDeps() {
      return new Promise((resolve, reject) => {
        if (!window.$paella_bg2e) {
          paella.require(paella.baseUrl + 'javascript/bg2e-es2015.js').then(() => {
            window.$paella_bg2e = bg;
            resolve(window.$paella_bg2e);
          }).catch(err => {
            console.error(err.message);
            reject();
          });
        } else {
          defer.resolve(window.$paella_bg2e);
        }
      });
    }

    _deferredAction(action) {
      return new Promise((resolve, reject) => {
        if (this.video) {
          resolve(action());
        } else {
          $(this.video).bind('canplay', () => {
            this._ready = true;
            resolve(action());
          });
        }
      });
    }

    _getQualityObject(index, s) {
      return {
        index: index,
        res: s.res,
        src: s.src,
        toString: function () {
          return this.res.w + "x" + this.res.h;
        },
        shortLabel: function () {
          return this.res.h + "p";
        },
        compare: function (q2) {
          return this.res.w * this.res.h - q2.res.w * q2.res.h;
        }
      };
    } // Initialization functions


    allowZoom() {
      return false;
    }

    getVideoData() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._deferredAction(() => {
          resolve({
            duration: This.video.duration,
            currentTime: This.video.currentTime,
            volume: This.video.volume,
            paused: This.video.paused,
            ended: This.video.ended,
            res: {
              w: This.video.videoWidth,
              h: This.video.videoHeight
            }
          });
        });
      });
    }

    setPosterFrame(url) {
      this._posterFrame = url;
    }

    setAutoplay(auto) {
      this._autoplay = auto;

      if (auto && this.video) {
        this.video.setAttribute("autoplay", auto);
      }
    }

    load() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._loadDeps().then(() => {
          var sources = this._stream.sources[this._streamName];

          if (this._currentQuality === null && this._videoQualityStrategy) {
            this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
          }

          var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
          this.video = null;

          if (stream) {
            this.canvasController = null;
            buildVideo360ThetaCanvas(stream, this.domElement).then(canvasController => {
              this.canvasController = canvasController;
              this.video = canvasController.video;
              this.video.pause();
              this.disableEventCapture();
              resolve(stream);
            });
          } else {
            reject(new Error("Could not load video: invalid quality stream index"));
          }
        });
      });
    }

    getQualities() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = [];
          var sources = this._stream.sources[this._streamName];
          var index = -1;
          sources.forEach(s => {
            index++;
            result.push(this._getQualityObject(index, s));
          });
          resolve(result);
        }, 10);
      });
    }

    setQuality(index) {
      return new Promise(resolve => {
        var paused = this.video.paused;
        var sources = this._stream.sources[this._streamName];
        this._currentQuality = index < sources.length ? index : 0;
        var currentTime = this.video.currentTime;
        this.freeze().then(() => {
          this._ready = false;
          return this.load();
        }).then(() => {
          if (!paused) {
            this.play();
          }

          $(this.video).on('seeked', () => {
            this.unFreeze();
            resolve();
            $(this.video).off('seeked');
          });
          this.video.currentTime = currentTime;
        });
      });
    }

    getCurrentQuality() {
      return new Promise(resolve => {
        resolve(this._getQualityObject(this._currentQuality, this._stream.sources[this._streamName][this._currentQuality]));
      });
    }

    play() {
      return this._deferredAction(() => {
        bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.AUTO;
        this.video.play();
      });
    }

    pause() {
      return this._deferredAction(() => {
        bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.MANUAL;
        this.video.pause();
      });
    }

    isPaused() {
      return this._deferredAction(() => {
        return this.video.paused;
      });
    }

    duration() {
      return this._deferredAction(() => {
        return this.video.duration;
      });
    }

    setCurrentTime(time) {
      return this._deferredAction(() => {
        this.video.currentTime = time;
        $(this.video).on('seeked', () => {
          this.canvasController.postRedisplay();
          $(this.video).off('seeked');
        });
      });
    }

    currentTime() {
      return this._deferredAction(() => {
        return this.video.currentTime;
      });
    }

    setVolume(volume) {
      return this._deferredAction(() => {
        this.video.volume = volume;
      });
    }

    volume() {
      return this._deferredAction(() => {
        return this.video.volume;
      });
    }

    setPlaybackRate(rate) {
      return this._deferredAction(() => {
        this.video.playbackRate = rate;
      });
    }

    playbackRate() {
      return this._deferredAction(() => {
        return this.video.playbackRate;
      });
    }

    goFullScreen() {
      return this._deferredAction(() => {
        var elem = this.video;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      });
    }

    unFreeze() {
      return this._deferredAction(() => {
        var c = document.getElementById(this.video.className + "canvas");
        $(c).remove();
      });
    }

    freeze() {
      var This = this;
      return this._deferredAction(function () {});
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.Video360Theta = Video360Theta;

  class Video360ThetaFactory extends paella.VideoFactory {
    isStreamCompatible(streamData) {
      try {
        if (paella.ChromaVideo._loaded) {
          return false;
        }

        if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
          return false;
        }

        for (var key in streamData.sources) {
          if (key == 'video360theta') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      paella.ChromaVideo._loaded = true;
      ++paella.videoFactories.Html5VideoFactory.s_instances;
      return new paella.Video360Theta(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.Video360ThetaFactory = Video360ThetaFactory;
})();
paella.addDataDelegate('metadata', () => {
  return class VideoManifestMetadataDataDelegate extends paella.DataDelegate {
    read(context, params, onSuccess) {
      let metadata = paella.player.videoLoader.getMetadata();
      onSuccess(metadata[params], true);
    }

    write(context, params, value, onSuccess) {
      onSuccess({}, true);
    }

    remove(context, params, onSuccess) {
      onSuccess({}, true);
    }

  };
});
paella.addPlugin(function () {
  return class VideoDataPlugin extends paella.VideoOverlayButtonPlugin {
    getIndex() {
      return 10;
    }

    getSubclass() {
      return "videoData";
    }

    getAlignment() {
      return 'left';
    }

    getDefaultToolTip() {
      return "";
    }

    checkEnabled(onSuccess) {
      // Check if enabled
      let plugin = paella.player.config.plugins.list["es.upv.paella.videoDataPlugin"];
      let exclude = plugin && plugin.excludeLocations || [];
      let excludeParent = plugin && plugin.excludeParentLocations || [];
      let excluded = exclude.some(url => {
        let re = RegExp(url, "i");
        return re.test(location.href);
      });

      if (window != window.parent) {
        excluded = excluded || excludeParent.some(url => {
          let re = RegExp(url, "i");

          try {
            return re.test(parent.location.href);
          } catch (e) {
            // Cross domain error
            return false;
          }
        });
      }

      onSuccess(!excluded);
    }

    setup() {
      let title = document.createElement("h1");
      title.innerText = "";
      title.className = "videoTitle";
      this.button.appendChild(title);
      paella.data.read("metadata", "title", function (data) {
        title.innerText = data;
      });
    }

    action(button) {}

    getName() {
      return "es.upv.paella.videoDataPlugin";
    }

  };
});
paella.addPlugin(function () {
  let g_canvasWidth = 320;
  let g_canvasHeight = 180;

  function getThumbnailContainer(videoIndex) {
    let container = document.createElement('canvas');
    container.width = g_canvasWidth;
    container.height = g_canvasHeight;
    container.className = "zoom-thumbnail";
    container.id = "zoomContainer" + videoIndex;
    return container;
  }

  function getZoomRect() {
    let zoomRect = document.createElement('div');
    zoomRect.className = "zoom-rect";
    return zoomRect;
  }

  function updateThumbnail(thumbElem) {
    let player = thumbElem.player;
    let canvas = thumbElem.canvas;
    player.captureFrame().then(frameData => {
      let ctx = canvas.getContext("2d");
      ctx.drawImage(frameData.source, 0, 0, g_canvasWidth, g_canvasHeight);
    });
  }

  function setupButtons(videoPlayer) {
    let wrapper = videoPlayer.parent;
    let wrapperDom = wrapper.domElement;
    let zoomButton = document.createElement('div');
    wrapperDom.appendChild(zoomButton);
    zoomButton.className = "videoZoomButton btn zoomIn";
    zoomButton.innerHTML = '<i class="glyphicon glyphicon-zoom-in"></i>';
    $(zoomButton).on('mousedown', () => {
      paella.player.videoContainer.disablePlayOnClick();
      videoPlayer.zoomIn();
    });
    $(zoomButton).on('mouseup', () => {
      setTimeout(() => paella.player.videoContainer.enablePlayOnClick(), 10);
    });
    zoomButton = document.createElement('div');
    wrapperDom.appendChild(zoomButton);
    zoomButton.className = "videoZoomButton btn zoomOut";
    zoomButton.innerHTML = '<i class="glyphicon glyphicon-zoom-out"></i>';
    $(zoomButton).on('mousedown', () => {
      paella.player.videoContainer.disablePlayOnClick();
      videoPlayer.zoomOut();
    });
    $(zoomButton).on('mouseup', () => {
      setTimeout(() => paella.player.videoContainer.enablePlayOnClick(), 10);
    });
  }

  return class VideoZoomPlugin extends paella.VideoOverlayButtonPlugin {
    getIndex() {
      return 10;
    }

    getSubclass() {
      return "videoZoom";
    }

    getAlignment() {
      return 'right';
    }

    getDefaultToolTip() {
      return "";
    }

    checkEnabled(onSuccess) {
      onSuccess(true);
    }

    setup() {
      var thisClass = this;
      this._thumbnails = [];
      this._visible = false;
      this._available = false;

      function checkVisibility() {
        let buttons = $('.videoZoomButton');
        let thumbs = $('.videoZoom');

        if (this._visible && this._available) {
          buttons.show();
          thumbs.show();
        } else {
          buttons.hide();
          thumbs.hide();
        }
      }

      let players = paella.player.videoContainer.streamProvider.videoPlayers;
      players.forEach((player, index) => {
        if (player.allowZoom()) {
          this._available = player.zoomAvailable();
          this._visible = this._available;
          setupButtons.apply(this, [player]);
          player.supportsCaptureFrame().then(supports => {
            if (supports) {
              let thumbContainer = document.createElement('div');
              thumbContainer.className = "zoom-container";
              let thumb = getThumbnailContainer.apply(this, [index]);
              let zoomRect = getZoomRect.apply(this);
              this.button.appendChild(thumbContainer);
              thumbContainer.appendChild(thumb);
              thumbContainer.appendChild(zoomRect);
              $(thumbContainer).hide();

              this._thumbnails.push({
                player: player,
                thumbContainer: thumbContainer,
                zoomRect: zoomRect,
                canvas: thumb
              });

              checkVisibility.apply(this);
            }
          });
        }
      });
      let update = false;
      paella.events.bind(paella.events.play, evt => {
        let updateThumbs = () => {
          this._thumbnails.forEach(item => {
            updateThumbnail(item);
          });

          if (update) {
            setTimeout(() => {
              updateThumbs();
            }, 2000);
          }
        };

        update = true;
        updateThumbs();
      });
      paella.events.bind(paella.events.pause, evt => {
        update = false;
      });
      paella.events.bind(paella.events.videoZoomChanged, (evt, target) => {
        this._thumbnails.some(thumb => {
          if (thumb.player == target.video) {
            if (thumb.player.zoom > 100) {
              $(thumb.thumbContainer).show();
              let x = target.video.zoomOffset.x * 100 / target.video.zoom;
              let y = target.video.zoomOffset.y * 100 / target.video.zoom;
              let zoomRect = thumb.zoomRect;
              $(zoomRect).css({
                left: x + '%',
                top: y + '%',
                width: 10000 / target.video.zoom + '%',
                height: 10000 / target.video.zoom + '%'
              });
            } else {
              $(thumb.thumbContainer).hide();
            }

            return true;
          }
        });
      });
      paella.events.bind(paella.events.zoomAvailabilityChanged, (evt, target) => {
        this._available = target.available;
        this._visible = target.available;
        checkVisibility.apply(this);
      });
      paella.events.bind(paella.events.controlBarDidHide, () => {
        this._visible = false;
        checkVisibility.apply(this);
      });
      paella.events.bind(paella.events.controlBarDidShow, () => {
        this._visible = true;
        checkVisibility.apply(this);
      });
    }

    action(button) {//paella.messageBox.showMessage(base.dictionary.translate("Live streaming mode: This is a live video, so, some capabilities of the player are disabled"));
    }

    getName() {
      return "es.upv.paella.videoZoomPlugin";
    }

  };
});
paella.addPlugin(function () {
  return class VideoZoomToolbarPlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "videoZoomToolbar";
    }

    getIconClass() {
      return 'icon-screen';
    }

    getIndex() {
      return 2030;
    }

    getName() {
      return "es.upv.paella.videoZoomToolbarPlugin";
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Set video zoom");
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    checkEnabled(onSuccess) {
      let players = paella.player.videoContainer.streamProvider.videoPlayers;
      let pluginData = paella.player.config.plugins.list["es.upv.paella.videoZoomToolbarPlugin"];
      let playerIndex = pluginData.targetStreamIndex;
      this.targetPlayer = players.length > playerIndex ? players[playerIndex] : null;
      onSuccess(paella.player.config.player.videoZoom.enabled && this.targetPlayer && this.targetPlayer.allowZoom());
    }

    buildContent(domElement) {
      paella.events.bind(paella.events.videoZoomChanged, (evt, target) => {
        this.setText(Math.round(target.video.zoom) + "%");
      });
      this.setText("100%");

      function getZoomButton(className, onClick) {
        let btn = document.createElement('div');
        btn.className = `videoZoomToolbarItem ${className}`;
        btn.innerHTML = `<i class="glyphicon glyphicon-${className}"></i>`;
        $(btn).click(onClick);
        return btn;
      }

      domElement.appendChild(getZoomButton('zoom-in', evt => {
        this.targetPlayer.zoomIn();
      }));
      domElement.appendChild(getZoomButton('zoom-out', evt => {
        this.targetPlayer.zoomOut();
      }));
    }

  };
});
paella.addPlugin(function () {
  return class ViewModePlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'right';
    }

    getSubclass() {
      return "showViewModeButton";
    }

    getIconClass() {
      return 'icon-presentation-mode';
    }

    getIndex() {
      return 540;
    }

    getName() {
      return "es.upv.paella.viewModePlugin";
    }

    getButtonType() {
      return paella.ButtonPlugin.type.popUpButton;
    }

    getDefaultToolTip() {
      return base.dictionary.translate("Change video layout");
    }

    checkEnabled(onSuccess) {
      this.buttonItems = null;
      this.buttons = [];
      this.selected_button = null;
      this.active_profiles = null;
      this.active_profiles = this.config.activeProfiles;
      onSuccess(!paella.player.videoContainer.isMonostream);
    }

    closeOnMouseOut() {
      return true;
    }

    setup() {
      var thisClass = this;
      var Keys = {
        Tab: 9,
        Return: 13,
        Esc: 27,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40
      };
      paella.events.bind(paella.events.setProfile, function (event, params) {
        thisClass.onProfileChange(params.profileName);
      });
      $(this.button).keyup(function (event) {
        if (thisClass.isPopUpOpen()) {
          if (event.keyCode == Keys.Up) {
            if (thisClass.selected_button > 0) {
              if (thisClass.selected_button < thisClass.buttons.length) thisClass.buttons[thisClass.selected_button].className = 'viewModeItemButton ' + thisClass.buttons[thisClass.selected_button].data.profile;
              thisClass.selected_button--;
              thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
            }
          } else if (event.keyCode == Keys.Down) {
            if (thisClass.selected_button < thisClass.buttons.length - 1) {
              if (thisClass.selected_button >= 0) thisClass.buttons[thisClass.selected_button].className = 'viewModeItemButton ' + thisClass.buttons[thisClass.selected_button].data.profile;
              thisClass.selected_button++;
              thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
            }
          } else if (event.keyCode == Keys.Return) {
            thisClass.onItemClick(thisClass.buttons[thisClass.selected_button], thisClass.buttons[thisClass.selected_button].data.profile, thisClass.buttons[thisClass.selected_button].data.profile);
          }
        }
      });
    }

    rebuildProfileList() {
      this.buttonItems = {};
      this.domElement.innerText = "";
      paella.profiles.profileList.forEach(profileData => {
        if (profileData.hidden) return;

        if (this.active_profiles) {
          var active = false;
          this.active_profiles.forEach(function (ap) {
            if (ap == profile) {
              active = true;
            }
          });

          if (active == false) {
            return;
          }
        }

        var buttonItem = this.getProfileItemButton(profileData.id, profileData);
        this.buttonItems[profileData.id] = buttonItem;
        this.domElement.appendChild(buttonItem);
        this.buttons.push(buttonItem);

        if (paella.player.selectedProfile == profileData.id) {
          this.buttonItems[profileData.id].className = this.getButtonItemClass(profileData.id, true);
        }
      });
      this.selected_button = this.buttons.length;
    }

    buildContent(domElement) {
      var thisClass = this;
      this.domElement = domElement;
      this.rebuildProfileList();
      paella.events.bind(paella.events.profileListChanged, () => {
        this.rebuildProfileList();
      });
    }

    getProfileItemButton(profile, profileData) {
      var elem = document.createElement('div');
      elem.className = this.getButtonItemClass(profile, false);
      let url = this.getButtonItemIcon(profileData);
      url = url.replace(/\\/ig, '/');
      elem.style.backgroundImage = `url(${url})`;
      elem.id = profile + '_button';
      elem.data = {
        profile: profile,
        profileData: profileData,
        plugin: this
      };
      $(elem).click(function (event) {
        this.data.plugin.onItemClick(this, this.data.profile, this.data.profileData);
      });
      return elem;
    }

    onProfileChange(profileName) {
      var thisClass = this;
      var ButtonItem = this.buttonItems[profileName];
      var n = this.buttonItems;
      var arr = Object.keys(n);
      arr.forEach(function (i) {
        thisClass.buttonItems[i].className = thisClass.getButtonItemClass(i, false);
      });

      if (ButtonItem) {
        ButtonItem.className = thisClass.getButtonItemClass(profileName, true);
      }
    }

    onItemClick(button, profile, profileData) {
      var ButtonItem = this.buttonItems[profile];

      if (ButtonItem) {
        paella.player.setProfile(profile);
      }

      paella.player.controls.hidePopUp(this.getName());
    }

    getButtonItemClass(profileName, selected) {
      return 'viewModeItemButton ' + profileName + (selected ? ' selected' : '');
    }

    getButtonItemIcon(profileData) {
      return `${paella.baseUrl}resources/style/${profileData.icon}`;
    }

  };
});
paella.addPlugin(function () {
  return class VolumeRangePlugin extends paella.ButtonPlugin {
    getAlignment() {
      return 'left';
    }

    getSubclass() {
      return 'volumeRangeButton';
    }

    getIconClass() {
      return 'icon-volume-high';
    }

    getName() {
      return "es.upv.paella.volumeRangePlugin";
    } //getButtonType() { return paella.ButtonPlugin.type.popUpButton; }


    getDefaultToolTip() {
      return base.dictionary.translate("Volume");
    }

    getIndex() {
      return 220;
    } //#DCE OPC-374 allow the expand in-line but mitigate impact by only pushing scrub bar


    getAriaLabel() {
      return base.dictionary.translate("Volume");
    } //#DCE OPC-374 keep arial label, button element added to DCE CS50 flex style
    //closeOnMouseOut() { return true; }


    checkEnabled(onSuccess) {
      this._tempMasterVolume = 0;
      this._inputMaster = null;
      this._control_NotMyselfEvent = true;
      this._storedValue = false;
      var enabled = !base.userAgent.browser.IsMobileVersion;
      onSuccess(enabled);
    }

    setup() {
      var self = this; //STORE VALUES

      paella.events.bind(paella.events.videoUnloaded, function (event, params) {
        self.storeVolume();
      }); //RECOVER VALUES

      paella.events.bind(paella.events.singleVideoReady, function (event, params) {
        self.loadStoredVolume(params);
      });
      paella.events.bind(paella.events.setVolume, function (evt, par) {
        self.updateVolumeOnEvent(par);
      });
      this._preMutedVolume = 1;
    }

    updateVolumeOnEvent(volume) {
      var thisClass = this;

      if (thisClass._control_NotMyselfEvent) {
        thisClass._inputMaster = volume.master;
      } else {
        thisClass._control_NotMyselfEvent = true;
      }
    }

    storeVolume() {
      var This = this;
      paella.player.videoContainer.streamProvider.mainAudioPlayer.volume().then(function (v) {
        This._tempMasterVolume = v;
        This._storedValue = true;
      });
    }

    loadStoredVolume(params) {
      if (this._storedValue == false) {
        this.storeVolume();
      }

      if (this._tempMasterVolume) {
        paella.player.videoContainer.setVolume(this._tempMasterVolume);
      }

      this._storedValue = false;
    }

    action(button) {
      paella.player.videoContainer.volume().then(v => {
        if (v == 0) {
          paella.player.videoContainer.setVolume(this._preMutedVolume);
        } else {
          this._preMutedVolume = v;
          paella.player.videoContainer.setVolume(0);
        }
      });
    }

    getExpandableContent() {
      var rangeInput = document.createElement('input');
      this._inputMaster = rangeInput;
      rangeInput.type = "range";
      rangeInput.min = 0;
      rangeInput.max = 1;
      rangeInput.step = 0.01;
      paella.player.videoContainer.audioPlayer.volume().then(vol => {
        rangeInput.value = vol;
      });

      let updateMasterVolume = () => {
        var masterVolume = $(rangeInput).val();
        var slaveVolume = 0;
        this._control_NotMyselfEvent = false;
        paella.player.videoContainer.setVolume(masterVolume);
      };

      $(rangeInput).bind('input', function (e) {
        updateMasterVolume();
      });
      $(rangeInput).change(function () {
        updateMasterVolume();
      });
      paella.events.bind(paella.events.setVolume, (event, params) => {
        rangeInput.value = params.master;
        this.updateClass();
      });
      return rangeInput;
    }

    updateClass() {
      var selected = '';
      var self = this;
      paella.player.videoContainer.volume().then(volume => {
        if (volume === undefined) {
          selected = 'icon-volume-mid';
        } else if (volume == 0) {
          selected = 'icon-volume-mute';
        } else if (volume < 0.33) {
          selected = 'icon-volume-low';
        } else if (volume < 0.66) {
          selected = 'icon-volume-mid';
        } else {
          selected = 'icon-volume-high';
        }

        this.changeIconClass(selected);
      });
    }

  };
});
(() => {
  class WebmVideoFactory extends paella.VideoFactory {
    webmCapable() {
      var testEl = document.createElement("video");

      if (testEl.canPlayType) {
        return "" !== testEl.canPlayType('video/webm; codecs="vp8, vorbis"');
      } else {
        return false;
      }
    }

    isStreamCompatible(streamData) {
      try {
        if (!this.webmCapable()) return false;

        for (var key in streamData.sources) {
          if (key == 'webm') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      return new paella.Html5Video(id, streamData, rect.x, rect.y, rect.w, rect.h, 'webm');
    }

  }

  paella.videoFactories.WebmVideoFactory = WebmVideoFactory;
})();
paella.addPlugin(function () {
  return class WindowTitlePlugin extends paella.EventDrivenPlugin {
    getName() {
      return "es.upv.paella.windowTitlePlugin";
    }

    checkEnabled(onSuccess) {
      this._initDone = false;
      paella.player.videoContainer.masterVideo().duration().then(d => {
        this.loadTitle();
      });
      onSuccess(true);
    }

    loadTitle() {
      var title = paella.player.videoLoader.getMetadata() && paella.player.videoLoader.getMetadata().title;
      document.title = title || document.title;
      this._initDone = true;
    }

  };
});
(() => {
  class YoutubeVideo extends paella.VideoElementBase {
    constructor(id, stream, left, top, width, height) {
      super(id, stream, 'div', left, top, width, height);
      this._posterFrame = null;
      this._currentQuality = null;
      this._autoplay = false;
      this._readyPromise = null;
      this._readyPromise = $.Deferred();
    }

    get video() {
      return this._youtubePlayer;
    }

    _deferredAction(action) {
      return new Promise((resolve, reject) => {
        this._readyPromise.then(function () {
          resolve(action());
        }, function () {
          reject();
        });
      });
    }

    _getQualityObject(index, s) {
      var level = 0;

      switch (s) {
        case 'small':
          level = 1;
          break;

        case 'medium':
          level = 2;
          break;

        case 'large':
          level = 3;
          break;

        case 'hd720':
          level = 4;
          break;

        case 'hd1080':
          level = 5;
          break;

        case 'highres':
          level = 6;
          break;
      }

      return {
        index: index,
        res: {
          w: null,
          h: null
        },
        src: null,
        label: s,
        level: level,
        bitrate: level,
        toString: function () {
          return this.label;
        },
        shortLabel: function () {
          return this.label;
        },
        compare: function (q2) {
          return this.level - q2.level;
        }
      };
    }

    _onStateChanged(e) {
      console.log("On state changed");
    } // Initialization functions


    getVideoData() {
      var This = this;
      return new Promise((resolve, reject) => {
        var stream = this._stream.sources.youtube[0];

        this._deferredAction(() => {
          var videoData = {
            duration: This.video.getDuration(),
            currentTime: This.video.getCurrentTime(),
            volume: This.video.getVolume(),
            paused: !This._playing,
            ended: This.video.ended,
            res: {
              w: stream.res.w,
              h: stream.res.h
            }
          };
          resolve(videoData);
        });
      });
    }

    setPosterFrame(url) {
      this._posterFrame = url;
    }

    setAutoplay(auto) {
      this._autoplay = auto;
    }

    setRect(rect, animate) {
      this._rect = JSON.parse(JSON.stringify(rect));
      var relativeSize = new paella.RelativeVideoSize();
      var percentTop = relativeSize.percentVSize(rect.top) + '%';
      var percentLeft = relativeSize.percentWSize(rect.left) + '%';
      var percentWidth = relativeSize.percentWSize(rect.width) + '%';
      var percentHeight = relativeSize.percentVSize(rect.height) + '%';
      var style = {
        top: percentTop,
        left: percentLeft,
        width: percentWidth,
        height: percentHeight,
        position: 'absolute'
      };

      if (animate) {
        this.disableClassName();
        var thisClass = this;
        $('#' + this.identifier).animate(style, 400, function () {
          thisClass.enableClassName();
          paella.events.trigger(paella.events.setComposition, {
            video: thisClass
          });
        });
        this.enableClassNameAfter(400);
      } else {
        $('#' + this.identifier).css(style);
        paella.events.trigger(paella.events.setComposition, {
          video: this
        });
      }
    }

    setVisible(visible, animate) {
      if (visible == "true" && animate) {
        $('#' + this.identifier).show();
        $('#' + this.identifier).animate({
          opacity: 1.0
        }, 300);
      } else if (visible == "true" && !animate) {
        $('#' + this.identifier).show();
      } else if (visible == "false" && animate) {
        $('#' + this.identifier).animate({
          opacity: 0.0
        }, 300);
      } else if (visible == "false" && !animate) {
        $('#' + this.identifier).hide();
      }
    }

    setLayer(layer) {
      $('#' + this.identifier).css({
        zIndex: layer
      });
    }

    load() {
      var This = this;
      return new Promise((resolve, reject) => {
        this._qualityListReadyPromise = $.Deferred();
        paella.youtubePlayerVars.apiReadyPromise.then(() => {
          var stream = this._stream.sources.youtube[0];

          if (stream) {
            // TODO: poster frame
            this._youtubePlayer = new YT.Player(This.identifier, {
              height: '390',
              width: '640',
              videoId: stream.id,
              playerVars: {
                controls: 0,
                disablekb: 1
              },
              events: {
                onReady: function (e) {
                  This._readyPromise.resolve();
                },
                onStateChanged: function (e) {
                  console.log("state changed");
                },
                onPlayerStateChange: function (e) {
                  console.log("state changed");
                }
              }
            });
            resolve();
          } else {
            reject(new Error("Could not load video: invalid quality stream index"));
          }
        });
      });
    }

    getQualities() {
      let This = this;
      return new Promise((resolve, reject) => {
        This._qualityListReadyPromise.then(function (q) {
          var result = [];
          var index = -1;
          This._qualities = {};
          q.forEach(item => {
            index++;
            This._qualities[item] = This._getQualityObject(index, item);
            result.push(This._qualities[item]);
          });
          resolve(result);
        });
      });
    }

    setQuality(index) {
      return new Promise((resolve, reject) => {
        this._qualityListReadyPromise.then(q => {
          for (var key in this._qualities) {
            var searchQ = this._qualities[key];

            if (typeof searchQ == "object" && searchQ.index == index) {
              this.video.setPlaybackQuality(searchQ.label);
              break;
            }
          }

          resolve();
        });
      });
    }

    getCurrentQuality() {
      return new Promise((resolve, reject) => {
        this._qualityListReadyPromise.then(q => {
          resolve(this._qualities[this.video.getPlaybackQuality()]);
        });
      });
    }

    play() {
      let This = this;
      return new Promise((resolve, reject) => {
        This._playing = true;
        This.video.playVideo();
        new base.Timer(timer => {
          var q = this.video.getAvailableQualityLevels();

          if (q.length) {
            timer.repeat = false;

            this._qualityListReadyPromise.resolve(q);

            resolve();
          } else {
            timer.repeat = true;
          }
        }, 500);
      });
    }

    pause() {
      return this._deferredAction(() => {
        this._playing = false;
        this.video.pauseVideo();
      });
    }

    isPaused() {
      return this._deferredAction(() => {
        return !this._playing;
      });
    }

    duration() {
      return this._deferredAction(() => {
        return this.video.getDuration();
      });
    }

    setCurrentTime(time) {
      return this._deferredAction(() => {
        this.video.seekTo(time);
      });
    }

    currentTime() {
      return this._deferredAction(() => {
        return this.video.getCurrentTime();
      });
    }

    setVolume(volume) {
      return this._deferredAction(() => {
        this.video.setVolume && this.video.setVolume(volume * 100);
      });
    }

    volume() {
      return this._deferredAction(() => {
        return this.video.getVolume() / 100;
      });
    }

    setPlaybackRate(rate) {
      return this._deferredAction(() => {
        this.video.playbackRate = rate;
      });
    }

    playbackRate() {
      return this._deferredAction(() => {
        return this.video.playbackRate;
      });
    }

    goFullScreen() {
      return this._deferredAction(() => {
        var elem = this.video;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      });
    }

    unFreeze() {
      return this._deferredAction(() => {
        var c = document.getElementById(this.video.className + "canvas");
        $(c).remove();
      });
    }

    freeze() {
      return this._deferredAction(() => {
        var canvas = document.createElement("canvas");
        canvas.id = this.video.className + "canvas";
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        canvas.style.cssText = this.video.style.cssText;
        canvas.style.zIndex = 2;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.video, 0, 0, Math.ceil(canvas.width / 16) * 16, Math.ceil(canvas.height / 16) * 16); //Draw image

        this.video.parentElement.appendChild(canvas);
      });
    }

    unload() {
      this._callUnloadEvent();

      return paella_DeferredNotImplemented();
    }

    getDimensions() {
      return paella_DeferredNotImplemented();
    }

  }

  paella.YoutubeVideo = YoutubeVideo;

  class YoutubeVideoFactory extends paella.VideoFactory {
    initYoutubeApi() {
      if (!this._initialized) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        paella.youtubePlayerVars = {
          apiReadyPromise: new $.Deferred()
        };
        this._initialized = true;
      }
    }

    isStreamCompatible(streamData) {
      try {
        for (var key in streamData.sources) {
          if (key == 'youtube') return true;
        }
      } catch (e) {}

      return false;
    }

    getVideoObject(id, streamData, rect) {
      this.initYoutubeApi();
      return new paella.YoutubeVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
    }

  }

  paella.videoFactories.YoutubeVideoFactory = YoutubeVideoFactory; //paella.youtubePlayerVars = {
  //	apiReadyPromise: $.Promise()
  //};
})();

function onYouTubeIframeAPIReady() {
  //	console.log("Youtube iframe API ready");
  paella.youtubePlayerVars.apiReadyPromise.resolve();
}
paella.addPlugin(function () {
  return class MatomoTracking extends paella.userTracking.SaverPlugIn {
    getName() {
      return "org.opencast.usertracking.MatomoSaverPlugIn";
    }

    checkEnabled(onSuccess) {
      var site_id = this.config.site_id,
          server = this.config.server,
          heartbeat = this.config.heartbeat,
          thisClass = this;

      if (server && site_id) {
        if (server.substr(-1) != '/') server += '/';

        require([server + "piwik.js"], function (matomo) {
          base.log.debug("Matomo Analytics Enabled");
          paella.userTracking.matomotracker = Piwik.getAsyncTracker(server + "piwik.php", site_id);
          paella.userTracking.matomotracker.client_id = thisClass.config.client_id;
          if (heartbeat && heartbeat > 0) paella.userTracking.matomotracker.enableHeartBeatTimer(heartbeat);

          if (Piwik && Piwik.MediaAnalytics) {
            paella.events.bind(paella.events.videoReady, () => {
              Piwik.MediaAnalytics.scanForMedia();
            });
          }

          thisClass.registerVisit();
        });

        onSuccess(true);
      } else {
        base.log.debug("No Matomo Site ID found in config file. Disabling Matomo Analytics PlugIn");
        onSuccess(false);
      }
    }

    registerVisit() {
      var title, event_id, series_title, series_id, presenter, view_mode;

      if (paella.opencast && paella.opencast._episode) {
        title = paella.opencast._episode.dcTitle;
        event_id = paella.opencast._episode.id;
        presenter = paella.opencast._episode.dcCreator;
        paella.userTracking.matomotracker.setCustomVariable(5, "client", paella.userTracking.matomotracker.client_id || "Paella Opencast");
      } else {
        paella.userTracking.matomotracker.setCustomVariable(5, "client", paella.userTracking.matomotracker.client_id || "Paella Standalone");
      }

      if (paella.opencast && paella.opencast._episode && paella.opencast._episode.mediapackage) {
        series_id = paella.opencast._episode.mediapackage.series;
        series_title = paella.opencast._episode.mediapackage.seriestitle;
      }

      if (title) paella.userTracking.matomotracker.setCustomVariable(1, "event", title + " (" + event_id + ")", "page");
      if (series_title) paella.userTracking.matomotracker.setCustomVariable(2, "series", series_title + " (" + series_id + ")", "page");
      if (presenter) paella.userTracking.matomotracker.setCustomVariable(3, "presenter", presenter, "page");
      paella.userTracking.matomotracker.setCustomVariable(4, "view_mode", view_mode, "page");

      if (title && presenter) {
        paella.userTracking.matomotracker.setDocumentTitle(title + " - " + (presenter || "Unknown"));
        paella.userTracking.matomotracker.trackPageView(title + " - " + (presenter || "Unknown"));
      } else {
        paella.userTracking.matomotracker.trackPageView();
      }
    }

    log(event, params) {
      if (paella.userTracking.matomotracker === undefined) {
        base.log.debug("Matomo Tracker is missing");
        return;
      }

      if (this.config.category === undefined || this.config.category === true) {
        var value = "";

        try {
          value = JSON.stringify(params);
        } catch (e) {}

        switch (event) {
          case paella.events.play:
            paella.userTracking.matomotracker.trackEvent("Player.Controls", "Play");
            break;

          case paella.events.pause:
            paella.userTracking.matomotracker.trackEvent("Player.Controls", "Pause");
            break;

          case paella.events.endVideo:
            paella.userTracking.matomotracker.trackEvent("Player.Status", "Ended");
            break;

          case paella.events.showEditor:
            paella.userTracking.matomotracker.trackEvent("Player.Editor", "Show");
            break;

          case paella.events.hideEditor:
            paella.userTracking.matomotracker.trackEvent("Player.Editor", "Hide");
            break;

          case paella.events.enterFullscreen:
            paella.userTracking.matomotracker.trackEvent("Player.View", "Fullscreen");
            break;

          case paella.events.exitFullscreen:
            paella.userTracking.matomotracker.trackEvent("Player.View", "ExitFullscreen");
            break;

          case paella.events.loadComplete:
            paella.userTracking.matomotracker.trackEvent("Player.Status", "LoadComplete");
            break;

          case paella.events.showPopUp:
            paella.userTracking.matomotracker.trackEvent("Player.PopUp", "Show", value);
            break;

          case paella.events.hidePopUp:
            paella.userTracking.matomotracker.trackEvent("Player.PopUp", "Hide", value);
            break;

          case paella.events.captionsEnabled:
            paella.userTracking.matomotracker.trackEvent("Player.Captions", "Enabled", value);
            break;

          case paella.events.captionsDisabled:
            paella.userTracking.matomotracker.trackEvent("Player.Captions", "Disabled", value);
            break;

          case paella.events.setProfile:
            paella.userTracking.matomotracker.trackEvent("Player.View", "Profile", value);
            break;

          case paella.events.seekTo:
          case paella.events.seekToTime:
            paella.userTracking.matomotracker.trackEvent("Player.Controls", "Seek", value);
            break;

          case paella.events.setVolume:
            paella.userTracking.matomotracker.trackEvent("Player.Settings", "Volume", value);
            break;

          case paella.events.resize:
            paella.userTracking.matomotracker.trackEvent("Player.View", "resize", value);
            break;

          case paella.events.setPlaybackRate:
            paella.userTracking.matomotracker.trackEvent("Player.Controls", "PlaybackRate", value);
            break;
        }
      }
    }

  };
});
paella.addPlugin(function () {
  var self = this;
  return class X5gonTracking extends paella.userTracking.SaverPlugIn {
    getName() {
      return "org.opencast.usertracking.x5gonSaverPlugIn";
    }

    checkEnabled(onSuccess) {
      var urlCookieconsentJS = "https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js",
          token = this.config.token,
          translations = [],
          path,
          testingEnvironment = this.config.testing_environment,
          trackingPermission,
          tracked;

      function trackX5gon() {
        base.log.debug("X5GON: trackX5gon permission check [trackingPermission " + trackingPermission + "] [tracked " + tracked + "]");

        if (isTrackingPermission() && !tracked) {
          if (!token) {
            base.log.debug("X5GON: token missing! Disabling X5gon PlugIn");
            onSuccess(false);
          } else {
            // load x5gon lib from remote server
            base.log.debug("X5GON: trackX5gon loading x5gon-snippet, token: " + token);

            require(["https://platform.x5gon.org/api/v1/snippet/latest/x5gon-log.min.js"], function (x5gon) {
              base.log.debug("X5GON: external x5gon snippet loaded");

              if (typeof x5gonActivityTracker !== 'undefined') {
                x5gonActivityTracker(token, testingEnvironment);
                base.log.debug("X5GON: send data to X5gon servers");
                tracked = true;
              }
            });
          }

          onSuccess(true);
        } else {
          onSuccess(false);
        }
      }

      function initCookieNotification() {
        // load cookieconsent lib from remote server
        require([urlCookieconsentJS], function (cookieconsent) {
          base.log.debug("X5GON: external cookie consent lib loaded");
          window.cookieconsent.initialise({
            "palette": {
              "popup": {
                "background": "#1d8a8a"
              },
              "button": {
                "background": "#62ffaa"
              }
            },
            "type": "opt-in",
            "position": "top",
            "content": {
              "message": translate('x5_message', "On this site the X5gon service can be included, to provide personalized Open Educational Ressources."),
              "allow": translate('x5_accept', "Accept"),
              "deny": translate('x5_deny', "Deny"),
              "link": translate('x5_more_info', "More information"),
              "policy": translate('x5_policy', "Cookie Policy"),
              // link to the X5GON platform privacy policy - describing what are we collecting
              // through the platform
              "href": "https://platform.x5gon.org/privacy-policy"
            },
            onInitialise: function (status) {
              var type = this.options.type;
              var didConsent = this.hasConsented(); // enable cookies - send user data to the platform
              // only if the user enabled cookies

              if (type == 'opt-in' && didConsent) {
                setTrackingPermission(true);
              } else {
                setTrackingPermission(false);
              }
            },
            onStatusChange: function (status, chosenBefore) {
              var type = this.options.type;
              var didConsent = this.hasConsented(); // enable cookies - send user data to the platform
              // only if the user enabled cookies

              if (type == 'opt-in' && didConsent) {
                setTrackingPermission(true);
              } else {
                setTrackingPermission(false);
              }
            },
            onRevokeChoice: function () {
              var type = this.options.type;
              var didConsent = this.hasConsented(); // disable cookies - set what to do when
              // the user revokes cookie usage

              if (type == 'opt-in' && didConsent) {
                setTrackingPermission(true);
              } else {
                setTrackingPermission(false);
              }
            }
          });
        });
      }

      function initTranslate(language, funcSuccess, funcError) {
        base.log.debug('X5GON: selecting language ' + language.slice(0, 2));
        var jsonstr = window.location.origin + '/player/localization/paella_' + language.slice(0, 2) + '.json';
        $.ajax({
          url: jsonstr,
          dataType: 'json',
          success: function (data) {
            if (data) {
              data.value_locale = language;
              translations = data;

              if (funcSuccess) {
                funcSuccess(translations);
              }
            } else if (funcError) {
              funcError();
            }
          },
          error: function () {
            if (funcError) {
              funcError();
            }
          }
        });
      }

      function translate(str, strIfNotFound) {
        return translations[str] != undefined ? translations[str] : strIfNotFound;
      }

      function isTrackingPermission() {
        if (checkDoNotTrackStatus() || !trackingPermission) {
          return false;
        } else {
          return true;
        }
      }

      function checkDoNotTrackStatus() {
        if (window.navigator.doNotTrack == 1 || window.navigator.msDoNotTrack == 1) {
          base.log.debug("X5GON: Browser DoNotTrack: true");
          return true;
        }

        base.log.debug("X5GON: Browser DoNotTrack: false");
        return false;
      }

      function setTrackingPermission(permissionStatus) {
        trackingPermission = permissionStatus;
        base.log.debug("X5GON: trackingPermissions: " + permissionStatus);
        trackX5gon();
      }

      ;
      initTranslate(navigator.language, function () {
        base.log.debug('X5GON: Successfully translated.');
        initCookieNotification();
      }, function () {
        base.log.debug('X5gon: Error translating.');
        initCookieNotification();
      });
      trackX5gon();
      onSuccess(true);
    }

    log(event, params) {
      if (this.config.category === undefined || this.config.category === true) {
        var category = this.config.category || "PaellaPlayer";
        var action = event;
        var label = "";

        try {
          label = JSON.stringify(params);
        } catch (e) {}
      }
    }

  };
});