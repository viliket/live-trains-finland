import useServiceWorkerStore from '../hooks/useServiceWorkerStore';

export const onRegister = (registration: ServiceWorkerRegistration) => {
  const hasController = !!navigator.serviceWorker.controller;
  let refreshing = false;
  // Detect controller change and refresh the page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Is it the first install?
    if (!hasController) {
      return;
    }

    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Check for updates periodically
  const intervalMS = 60 * 60 * 1000;
  window.setInterval(() => {
    registration.update();
  }, intervalMS);

  useServiceWorkerStore
    .getState()
    .setRegistrationAndUpdateAvailable(registration, !!registration.waiting);
};

export const onSuccess = (registration: ServiceWorkerRegistration) =>
  useServiceWorkerStore.getState().setRegistration(registration);

export const onUpdate = (registration: ServiceWorkerRegistration) =>
  useServiceWorkerStore
    .getState()
    .setRegistrationAndUpdateAvailable(registration, true);
