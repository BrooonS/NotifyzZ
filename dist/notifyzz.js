'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * NotifyzZ v1.0.1: Plugin for notifications
 *
 * Contribute: https://github.com/BrooonS/NotifyzZ
 * Released under the MIT license: http://opensource.org/licenses/MIT
 */

(function () {
  var NotifyzZ = function () {
    function NotifyzZ() {
      var userSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, NotifyzZ);

      this.isNotifyRemoved = false;
      this.settings = _extends({
        title: '',
        content: '',
        duration: 5000,
        extraClass: '',
        position: '',
        isClosingOnClick: true,
        isClosingOnSwipe: true,
        beforeCreate: function beforeCreate() {},
        beforeOpen: function beforeOpen() {},
        beforeClose: function beforeClose() {},
        beforeDestroy: function beforeDestroy() {},
        beforeContainerDestroy: function beforeContainerDestroy() {}
      }, userSettings);

      this.setNotify();
    }

    _createClass(NotifyzZ, [{
      key: 'setNotify',
      value: function setNotify() {
        var _settings = this.settings,
            title = _settings.title,
            content = _settings.content;

        var doesContainerExist = document.querySelector('.notifyzz-container') !== null;

        if (title === '' && content === '') {
          throw new Error('Title or content in Notify is not found.');
        }

        if (!doesContainerExist) {
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
            beforeCreate = _settings2.beforeCreate;


        var container = document.querySelector('.notifyzz-container');

        /**
         * Create elements.
         */
        var notify = document.createElement('div');
        var notifyTitle = document.createElement('div');
        var notifyContent = document.createElement('div');

        /**
         * User callback on create notify.
         */
        if (typeof beforeCreate === 'function') {
          beforeCreate();
        }

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
            isClosingOnClick = _settings3.isClosingOnClick,
            isClosingOnSwipe = _settings3.isClosingOnSwipe,
            beforeOpen = _settings3.beforeOpen;


        var showAnimationHandler = function showAnimationHandler(event) {
          if (event.animationName === 'openAnimation') {
            notify.classList.remove('notifyzz--open-animation');
            notify.classList.add('notifyzz--open');

            /**
             * User callback on open notify.
             */
            if (typeof beforeOpen === 'function') {
              beforeOpen();
            }

            notify.removeEventListener('animationend', showAnimationHandler);
          }
        };

        /**
         * For user callback on open notify.
         */
        notify.addEventListener('animationend', showAnimationHandler, false);

        /**
         * Bind close event after opening notify.
         */
        if (isClosingOnClick) {
          notify.addEventListener('click', function () {
            _this.removeNotify();
          });
        }

        /**
         * Bind touch events.
         */
        if (isClosingOnSwipe) {
          this.bindTouchEvents();
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
            beforeClose = _settings4.beforeClose;

        var timeoutToClose = new this.Timer(function () {
          /**
           * User callback on close notify.
           */
          if (typeof beforeClose === 'function') {
            beforeClose();
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
      key: 'bindTouchEvents',
      value: function bindTouchEvents() {
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
        var beforeDestroy = this.settings.beforeDestroy;

        var container = document.querySelector('.notifyzz-container');

        if (!this.isNotifyRemoved) {
          /**
           * Slide notify.
           */
          notify.style.bottom = notify.offsetHeight + 'px';
          notify.style.marginTop = '-' + notify.offsetHeight + 'px';

          /**
           * Close animation.
           */
          notify.classList.remove('notifyzz--open');
          notify.classList.add('notifyzz--close-animation');

          notify.addEventListener('animationend', function () {
            /**
             * User callback on destroy notify.
             */
            if (typeof beforeDestroy === 'function') {
              beforeDestroy();
            }

            /**
             * Remove notification.
             */
            notify.remove();

            /**
             * If notifications does not exist.
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
        var position = this.settings.position;

        var container = document.createElement('div');
        var positionArray = position.split(' ');

        container.classList.add('notifyzz-container');

        positionArray.forEach(function (className) {
          container.classList.add('notifyzz-container--' + className);
        });

        document.body.appendChild(container);
      }
    }, {
      key: 'removeContainer',
      value: function removeContainer() {
        var beforeContainerDestroy = this.settings.beforeContainerDestroy;

        /**
         * User callback on destroy notify container.
         */

        if (typeof beforeContainerDestroy === 'function') {
          beforeContainerDestroy();
        }

        document.querySelector('.notifyzz-container').remove();
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
          timerId = window.setTimeout(callback, remaining);
        };

        this.resume();
      }
    }]);

    return NotifyzZ;
  }();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = NotifyzZ;
  } else {
    window.NotifyzZ = NotifyzZ;
  }
})();