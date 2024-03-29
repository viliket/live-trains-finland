import { useEffect } from 'react';

import { Snackbar, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import useServiceWorkerStore from '../hooks/useServiceWorkerStore';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import { onRegister, onSuccess, onUpdate } from '../utils/serviceWorker';

const ServiceWorkerUpdatePrompt = () => {
  const { t } = useTranslation();
  const [registration, updateAvailable] = useServiceWorkerStore(
    useShallow((state) => [state.registration, state.updateAvailable])
  );

  useEffect(() => {
    serviceWorkerRegistration.register({
      onRegister,
      onSuccess,
      onUpdate,
    });
  }, []);

  const reloadPage = () => {
    const waitingServiceWorker = registration?.waiting;
    if (waitingServiceWorker) {
      // Tell waiting Service Worker to become active
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return (
    <Snackbar
      open={updateAvailable}
      message={t('update_available')}
      onClick={reloadPage}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={
        <Button color="inherit" size="small" onClick={reloadPage}>
          {t('reload')}
        </Button>
      }
    />
  );
};

export default ServiceWorkerUpdatePrompt;
