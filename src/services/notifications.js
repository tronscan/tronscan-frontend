export async function requestNotifyPermissions() {

  return new Promise(resolve => {
    Notification.requestPermission(permission => {
      resolve(permission === "granted");
    });
  });
}

export function notifyEnabled() {
  return Notification.permission === "granted";
}

export function getNotifyPermission() {
  return Notification.permission;
}

export function sendNotification(title, options = {}) {
  new Notification(title, {
    ...options,
  });
}
