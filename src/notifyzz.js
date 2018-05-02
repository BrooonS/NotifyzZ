/*!
 * NotifyzZ v1.0.0: Plugin for notifications
 *
 * Contribute: https://github.com/BrooonS/NotifyzZ
 * Released under the MIT license: http://opensource.org/licenses/MIT
 */

(() => {
  class NotifyzZ {
    constructor(userSettings = {}) {
      this.isNotifyRemoved = false;
      this.settings = {
        title: '',
        content: '',
        duration: 5000,
        extraClass: '',
        position: '',
        isClosingOnClick: true,
        isClosingOnSwipe: true,
        beforeCreate() {},
        beforeOpen() {},
        beforeClose() {},
        beforeDestroy() {},
        beforeContainerDestroy() {},
        ...userSettings,
      };

      this.setNotify();
    }

    setNotify() {
      const { title, content } = this.settings;
      const doesContainerExist = document.querySelector('.notifyzz-container') !== null;

      if (title === '' && content === '') {
        throw new Error('Title or content in Notify is not found.');
      }

      if (!doesContainerExist) {
        this.createContainer();
      }

      this.createNotify();
    }

    createNotify() {
      const {
        title,
        content,
        extraClass,
        beforeCreate,
      } = this.settings;

      const container = document.querySelector('.notifyzz-container');

      /**
       * Create elements.
       */
      const notify = document.createElement('div');
      const notifyTitle = document.createElement('div');
      const notifyContent = document.createElement('div');
      
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

    setFunctions() {
      const { notify } = this;
      const {
        duration,
        isClosingOnClick,
        isClosingOnSwipe,
        beforeOpen,
      } = this.settings;

      const showAnimationHandler = (event) => {
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
       * Bind close event after open notify.
       */
      if (isClosingOnClick) {
        notify.addEventListener('click', () => {
          this.removeNotify();
        });
      }

      /**
       * Touch events.
       */
      if (isClosingOnSwipe) {
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
    setTimeout() {
      const { notify } = this;
      const { duration, beforeClose } = this.settings;
      const timeoutToClose = new this.Timer(() => {
        /**
         * User callback on close notify.
         */
        if (typeof beforeClose === 'function') {
          beforeClose();
        }

        this.removeNotify();
      }, duration);
      
      const stopTimer = () => timeoutToClose.pause();
      const startTimer = () => timeoutToClose.resume();

      notify.addEventListener('touchstart', stopTimer);
      notify.addEventListener('mousedown', stopTimer);

      notify.addEventListener('touchend', startTimer);
      notify.addEventListener('mouseout', startTimer);
    }

    touchEvents() {
      const { notify } = this;
      let startingPosition = null;
      let isCloseAfterSwipe = false;

      notify.addEventListener('touchstart', (event) => {
        startingPosition = event.targetTouches[0].clientX;
      });

      notify.addEventListener('touchmove', (event) => {
        const distance = startingPosition - event.targetTouches[0].clientX;

        isCloseAfterSwipe = Math.abs(distance) > (notify.offsetWidth / 2);
        
        notify.style.right = `${distance}px`;
        notify.style.transition = 'none';
        notify.style.opacity = (1 - Math.abs((distance * -1) / (notify.offsetWidth * 0.8))).toFixed(2);
      });

      notify.addEventListener('touchend', (event) => {
        notify.style.transition = null;

        if (isCloseAfterSwipe) {
          this.removeNotify();
        } else {
          notify.style.opacity = null;
          notify.style.right = 0;
        }
      });
    }

    removeNotify() {
      const { notify } = this;
      const { beforeDestroy } = this.settings;
      const container = document.querySelector('.notifyzz-container');
    
      if (!this.isNotifyRemoved) {
        /**
         * Slide notify.
         */
        notify.style.bottom = `${notify.offsetHeight}px`;
        notify.style.marginTop = `-${notify.offsetHeight}px`;

        /**
         * Close animation.
         */
        notify.classList.remove('notifyzz--open');
        notify.classList.add('notifyzz--close-animation');

        notify.addEventListener('animationend', () => {
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
            this.removeContainer();
          }
        }, false);

        this.isNotifyRemoved = true;
      }
    }

    createContainer() {
      const { position } = this.settings;
      const container = document.createElement('div');
      const positionArray = position.split(' ');

      container.classList.add('notifyzz-container');

      positionArray.forEach((className) => {
        container.classList.add(`notifyzz-container--${className}`);
      });

      document.body.appendChild(container);
    }

    removeContainer() {
      const { beforeContainerDestroy } = this.settings;

      /**
       * User callback on destroy notify container.
       */
      if (typeof beforeContainerDestroy === 'function') {
        beforeContainerDestroy();
      }

      document.querySelector('.notifyzz-container').remove();
    }

    Timer(callback, delay) {
      let remaining = delay;
      let timerId = null;
      let start = '';

      this.pause = () => {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
      };

      this.resume = () => {
        start = new Date();
        timerId = window.setTimeout(callback, remaining);
      };

      this.resume();
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = NotifyzZ;
  } else {
    window.NotifyzZ = NotifyzZ;
  }
})();
