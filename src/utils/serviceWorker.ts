import { makeVar } from '@apollo/client';

export const serviceWorkerRegistrationVar = makeVar<{
  registration: ServiceWorkerRegistration | null;
  updateAvailable?: boolean;
}>({ registration: null });

export const onRegister = (registration: ServiceWorkerRegistration) => {
  let refreshing = false;
  // Detect controller change and refresh the page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });

  // Check for updates periodically
  const intervalMS = 60 * 60 * 1000;
  window.setInterval(() => {
    registration.update();
  }, intervalMS);

  serviceWorkerRegistrationVar({
    registration,
    updateAvailable: !!registration.waiting,
  });
};

export const onSuccess = (registration: ServiceWorkerRegistration) =>
  serviceWorkerRegistrationVar({
    registration,
  });

export const onUpdate = (registration: ServiceWorkerRegistration) =>
  serviceWorkerRegistrationVar({
    registration,
    updateAvailable: true,
  });
