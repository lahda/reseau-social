self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      icon: data.icon,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      body: data.message,
      data: data
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    openUrl('https://fbequipement-social.herokuapp.com/')
  )
})

async function openUrl (url) {
  const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  for(let i in windowClients){
    const client = windowClients[i];
    if(client.url === url && 'focus' in client){
      return client.focus()
    }
    if(self.clients.openWindow){
      return self.clients.openWindow(url)
    }
    return null
  }
}