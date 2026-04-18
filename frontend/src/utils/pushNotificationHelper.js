import API_BASE_URL from '../config';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPushNotifications = async (user) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications are not supported in this browser.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered with scope:', registration.scope);

    // Get VAPID public key from backend
    const keyRes = await fetch(`${API_BASE_URL}/api/auth/vapid-key`);
    const { publicKey } = await keyRes.json();

    if (!publicKey) return;

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Prompt user for permission
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    // Send subscription to backend
    await fetch(`${API_BASE_URL}/api/auth/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ subscription })
    });

    console.log('User is subscribed to Push Notifications.');
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
};
