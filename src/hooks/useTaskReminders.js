import { useEffect, useRef } from 'react';
import { differenceInMinutes } from 'date-fns';
import NotificationService from '../utils/NotificationService';
import { useSettings } from '../context/SettingsContext';

/**
 * useTaskReminders - Custom hook to monitor task deadlines and trigger notifications
 * @param {Array} tasks - Array of task objects
 */
const useTaskReminders = (tasks) => {
  const { playNotificationSound } = useSettings();
  const notifiedTasksRef = useRef(new Set());

  useEffect(() => {
    // Don't run if no tasks or notifications not supported
    if (!tasks || tasks.length === 0 || !NotificationService.isSupported()) {
      return;
    }

    // Check for due tasks every minute
    const checkInterval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        // Skip completed tasks or tasks without due dates
        if (task.completed || !task.dueDate) {
          return;
        }

        try {
          const dueDate = new Date(task.dueDate);
          const minutesUntilDue = differenceInMinutes(dueDate, now);

          // Trigger notifications at 60 min, 30 min, and 0 min (due now)
          const notificationTimes = [60, 30, 0];

          notificationTimes.forEach((time) => {
            // Create unique key for this notification
            const notificationKey = `${task._id || task.id}-${time}`;

            // Check if we should notify at this time
            if (minutesUntilDue <= time && minutesUntilDue > time - 1) {
              // Check if we haven't already notified for this time
              if (!notifiedTasksRef.current.has(notificationKey)) {
                // Show notification
                NotificationService.showTaskReminder(task, time);

                // Play sound
                playNotificationSound();

                // Mark as notified
                notifiedTasksRef.current.add(notificationKey);

                console.log(`Notification sent for task: ${task.title} (${time} min)`);
              }
            }
          });

          // Clean up old notifications for completed or past tasks
          if (minutesUntilDue < -60) {
            // Remove notifications for tasks that are more than 1 hour overdue
            notificationTimes.forEach((time) => {
              const notificationKey = `${task._id || task.id}-${time}`;
              notifiedTasksRef.current.delete(notificationKey);
            });
          }
        } catch (error) {
          console.error('Error processing task reminder:', error);
        }
      });
    }, 60000); // Check every 60 seconds

    // Also check immediately on mount
    const checkNow = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.completed || !task.dueDate) return;

        try {
          const dueDate = new Date(task.dueDate);
          const minutesUntilDue = differenceInMinutes(dueDate, now);

          [60, 30, 0].forEach((time) => {
            const notificationKey = `${task._id || task.id}-${time}`;
            if (minutesUntilDue <= time && minutesUntilDue > time - 1) {
              if (!notifiedTasksRef.current.has(notificationKey)) {
                NotificationService.showTaskReminder(task, time);
                playNotificationSound();
                notifiedTasksRef.current.add(notificationKey);
              }
            }
          });
        } catch (error) {
          console.error('Error in immediate check:', error);
        }
      });
    };

    checkNow();

    return () => {
      clearInterval(checkInterval);
    };
  }, [tasks, playNotificationSound]);

  return null;
};

export default useTaskReminders;
