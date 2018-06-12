export async function requestNotifyPermissions() {

  return new Promise(resolve => {

    if (window.Notification) {
      Notification.requestPermission(permission => {
        resolve(permission === "granted");
      });
    } else {
      resolve(false);
    }
  });
}

export function notifyEnabled() {
  if (window.Notification) {
    return Notification.permission === "granted";
  } else {
    return false;
  }
}

export function getNotifyPermission() {
  if (window.Notification) {
    return Notification.permission;
  } else {
    return "denied";
  }
}

export function sendNotification(title, options = {}) {
  if (window.Notification) {
    new Notification(title, {
      ...options,
    });
  }
}
