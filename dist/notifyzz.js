'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * NotifyzZ v1.0.0: Plugin for notifications
 *
 * Contribute: https://github.com/BrooonS/NotifyzZ
 * Released under the MIT license: http://opensource.org/licenses/MIT
 */

var NotifyzZ = function () {
  // eslint-disable-line no-unused-vars
  function NotifyzZ() {
    var userOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, NotifyzZ);

    this.isNotifyRemoved = false;
    this.settings = _extends({
      title: '',
      content: '',
      duration: 5000,
      extraClass: '',
      isCloseOnClick: true,
      isCloseOnSwipe: true,
      onCreate: function onCreate() {},
      onOpen: function onOpen() {},
      onClose: function onClose() {},
      onDestroy: function onDestroy() {},
      onContainerDestroy: function onContainerDestroy() {}
    }, userOptions);

    this.setNotify();
  }

  _createClass(NotifyzZ, [{
    key: 'setNotify',
    value: function setNotify() {
      var _settings = this.settings,
          title = _settings.title,
          content = _settings.content;

      var isContainerExist = document.querySelector('.notifyzz-container') !== null;

      if (title === '' && content === '') {
        throw new Error('Title or content in notify not found.');
      }

      if (!isContainerExist) {
        this.createContainer();
      }

      this.createNotify();
    }
  }, {
    key: 'createNotify',
    value: function createNotify() {
      var _settings2 = this.settings,
          title = _settings2.title,
          content = _settings2.content,
          extraClass = _settings2.extraClass,
          onCreate = _settings2.onCreate;


      var container = document.querySelector('.notifyzz-container');

      /**
       * Create elements.
       */
      var notify = document.createElement('div');
      var notifyTitle = document.createElement('div');
      var notifyContent = document.createElement('div');

      notify.classList.add('notifyzz');

      if (extraClass !== '') {
        notify.classList.add(extraClass);
      }

      if (title !== '') {
        notifyTitle.classList.add('notifyzz__title');
        notifyTitle.innerHTML = title;
        notify.appendChild(notifyTitle);
      }

      if (content !== '') {
        notifyContent.classList.add('notifyzz__content');
        notifyContent.innerHTML = content;
        notify.appendChild(notifyContent);
      }

      /**
       * User callback on create notify.
       */
      if (typeof onCreate === 'function') {
        onCreate();
      }

      /**
       * Set notify to class variables.
       */
      this.notify = notify;

      container.appendChild(notify);

      this.setFunctions();
    }
  }, {
    key: 'setFunctions',
    value: function setFunctions() {
      var _this = this;

      var notify = this.notify;
      var _settings3 = this.settings,
          duration = _settings3.duration,
          isCloseOnClick = _settings3.isCloseOnClick,
          isCloseOnSwipe = _settings3.isCloseOnSwipe,
          onOpen = _settings3.onOpen;


      var showAnimationHandler = function showAnimationHandler(event) {
        if (event.animationName === 'openAnimation') {
          notify.classList.remove('notifyzz--open-animation');
          notify.classList.add('notifyzz--open');

          /**
           * User callback on open notify.
           */
          if (typeof onOpen === 'function') {
            onOpen();
          }

          notify.removeEventListener('animationend', showAnimationHandler);
        }
      };

      /**
       * For user callback on open notify.
       */
      notify.addEventListener('animationend', showAnimationHandler, false);

      /**
       * Bind close event after open notify.
       */
      if (isCloseOnClick) {
        notify.addEventListener('click', function () {
          _this.removeNotify();
        });
      }

      /**
       * Touch events.
       */
      if (isCloseOnSwipe) {
        this.touchEvents();
      }

      /**
       * Show notify.
       */
      notify.classList.add('notifyzz--open-animation');

      if (duration !== 0) {
        this.setTimeout();
      }
    }

    /**
     * Create timeout to destroy.
     */

  }, {
    key: 'setTimeout',
    value: function setTimeout() {
      var _this2 = this;

      var notify = this.notify;
      var _settings4 = this.settings,
          duration = _settings4.duration,
          onClose = _settings4.onClose;

      var timeoutToClose = new this.Timer(function () {
        /**
         * User callback on close notify.
         */
        if (typeof onClose === 'function') {
          onClose();
        }

        _this2.removeNotify();
      }, duration);

      var stopTimer = function stopTimer() {
        return timeoutToClose.pause();
      };
      var startTimer = function startTimer() {
        return timeoutToClose.resume();
      };

      notify.addEventListener('touchstart', stopTimer);
      notify.addEventListener('mousedown', stopTimer);

      notify.addEventListener('touchend', startTimer);
      notify.addEventListener('mouseout', startTimer);
    }
  }, {
    key: 'touchEvents',
    value: function touchEvents() {
      var _this3 = this;

      var notify = this.notify;

      var startingPosition = null;
      var isCloseAfterSwipe = false;

      notify.addEventListener('touchstart', function (event) {
        startingPosition = event.targetTouches[0].clientX;
      });

      notify.addEventListener('touchmove', function (event) {
        var distance = startingPosition - event.targetTouches[0].clientX;

        isCloseAfterSwipe = Math.abs(distance) > notify.offsetWidth / 2;

        notify.style.right = distance + 'px';
        notify.style.transition = 'none';
        notify.style.opacity = (1 - Math.abs(distance * -1 / (notify.offsetWidth * 0.8))).toFixed(2);
      });

      notify.addEventListener('touchend', function (event) {
        notify.style.transition = null;

        if (isCloseAfterSwipe) {
          _this3.removeNotify();
        } else {
          notify.style.opacity = null;
          notify.style.right = 0;
        }
      });
    }
  }, {
    key: 'removeNotify',
    value: function removeNotify() {
      var _this4 = this;

      var notify = this.notify;
      var onDestroy = this.settings.onDestroy;

      var container = document.querySelector('.notifyzz-container');

      if (!this.isNotifyRemoved) {
        /**
         * Slide notify.
         */
        notify.style.bottom = notify.offsetHeight + 'px';
        notify.style['margin-top'] = '-' + notify.offsetHeight + 'px';

        /**
         * Close animation.
         */
        notify.classList.remove('notifyzz--open');
        notify.classList.add('notifyzz--close-animation');

        notify.addEventListener('animationend', function () {
          /**
           * User callback on destroy notify.
           */
          if (typeof onDestroy === 'function') {
            onDestroy();
          }

          /**
           * Remove notification.
           */
          notify.remove();

          /**
           * If notifications is not exist.
           */
          if (container.querySelector('.notifyzz') === null) {
            _this4.removeContainer();
          }
        }, false);

        this.isNotifyRemoved = true;
      }
    }
  }, {
    key: 'createContainer',
    value: function createContainer() {
      var container = document.createElement('div');

      container.classList.add('notifyzz-container');
      document.body.appendChild(container);
    }
  }, {
    key: 'removeContainer',
    value: function removeContainer() {
      var onContainerDestroy = this.settings.onContainerDestroy;


      document.querySelector('.notifyzz-container').remove();

      /**
       * User callback on destroy notify container.
       */
      if (typeof onContainerDestroy === 'function') {
        onContainerDestroy();
      }
    }
  }, {
    key: 'Timer',
    value: function Timer(callback, delay) {
      var remaining = delay;
      var timerId = null;
      var start = '';

      this.pause = function () {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
      };

      this.resume = function () {
        start = new Date();

        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
      };

      this.resume();
    }
  }]);

  return NotifyzZ;
}();