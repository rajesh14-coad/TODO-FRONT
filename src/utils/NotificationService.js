/**
 * NotificationService - Web Notifications API wrapper
 * Handles browser notification permissions and display
 */

export const NotificationService = {
  /**
   * Check if notifications are supported in the browser
   */
  isSupported() {
    return 'Notification' in window;
  },

  /**
   * Get current notification permission status
   * @returns {'granted' | 'denied' | 'default'}
   */
  getPermissionStatus() {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  /**
   * Request notification permissions from the user
   * @returns {Promise<boolean>} true if granted, false otherwise
   */
  async requestPermission() {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  /**
   * Show a browser notification
   * @param {string} title - Notification title
   * @param {object} options - Notification options
   * @returns {Notification | null}
   */
  showNotification(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  },

  /**
   * Show a task reminder notification
   * @param {object} task - Task object
   * @param {number} minutesUntilDue - Minutes until task is due
   */
  showTaskReminder(task, minutesUntilDue) {
    let body;
    if (minutesUntilDue === 0) {
      body = `This task is due now!`;
    } else if (minutesUntilDue === 30) {
      body = `Due in 30 minutes`;
    } else if (minutesUntilDue === 60) {
      body = `Due in 1 hour`;
    } else {
      body = `Due in ${minutesUntilDue} minutes`;
    }

    return this.showNotification(`📋 ${task.title}`, {
      body,
      tag: `task-${task._id || task.id}-${minutesUntilDue}`,
      data: { taskId: task._id || task.id },
    });
  },
};

export default NotificationService;
