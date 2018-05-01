/*!
 * NotifyzZ v1.0.0: Plugin for notifications
 *
 * Contribute: https://github.com/BrooonS/NotifyzZ
 * Released under the MIT license: http://opensource.org/licenses/MIT
 */

class NotifyzZ { // eslint-disable-line no-unused-vars
  constructor(userOptions = {}) {
    this.isNotifyRemoved = false;
    this.settings = {
      title: '',
      content: '',
      duration: 5000,
      extraClass: '',
      isCloseOnClick: true,
      isCloseOnSwipe: true,
      onCreate() {},
      onOpen() {},
      onClose() {},
      onDestroy() {},
      onContainerDestroy() {},
      ...userOptions,
    };

    this.setNotify();
  }

  setNotify() {
    const { title, content } = this.settings;
    const isContainerExist = document.querySelector('.notifyzz-container') !== null;

    if (title === '' && content === '') {
      throw new Error('Title or content in notify not found.');
    }

    if (!isContainerExist) {
      this.createContainer();
    }

    this.createNotify();
  }

  createNotify() {
    const {
      title,
      content,
      extraClass,
      onCreate,
    } = this.settings;

    const container = document.querySelector('.notifyzz-container');

    /**
     * Create elements.
     */
    const notify = document.createElement('div');
    const notifyTitle = document.createElement('div');
    const notifyContent = document.createElement('div');
    
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

  setFunctions() {
    const { notify } = this;
    const {
      duration,
      isCloseOnClick,
      isCloseOnSwipe,
      onOpen,
    } = this.settings;

    const showAnimationHandler = (event) => {
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
      notify.addEventListener('click', () => {
        this.removeNotify();
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
  setTimeout() {
    const { notify } = this;
    const { duration, onClose } = this.settings;
    const timeoutToClose = new this.Timer(() => {
      /**
       * User callback on close notify.
       */
      if (typeof onClose === 'function') {
        onClose();
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
    const { onDestroy } = this.settings;
    const container = document.querySelector('.notifyzz-container');
  
    if (!this.isNotifyRemoved) {
      /**
       * Slide notify.
       */
      notify.style.bottom = `${notify.offsetHeight}px`;
      notify.style['margin-top'] = `-${notify.offsetHeight}px`;

      /**
       * Close animation.
       */
      notify.classList.remove('notifyzz--open');
      notify.classList.add('notifyzz--close-animation');

      notify.addEventListener('animationend', () => {
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
          this.removeContainer();
        }
      }, false);

      this.isNotifyRemoved = true;
    }
  }

  createContainer() {
    const container = document.createElement('div');

    container.classList.add('notifyzz-container');
    document.body.appendChild(container);
  }

  removeContainer() {
    const { onContainerDestroy } = this.settings;

    document.querySelector('.notifyzz-container').remove();

    /**
     * User callback on destroy notify container.
     */
    if (typeof onContainerDestroy === 'function') {
      onContainerDestroy();
    }
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

      window.clearTimeout(timerId);
      timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
  }
}
