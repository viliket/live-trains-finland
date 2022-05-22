import { useReactiveVar } from '@apollo/client';
import { Snackbar, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { serviceWorkerRegistrationVar } from '../utils/serviceWorker';

const ServiceWorkerUpdatePrompt = () => {
  const { t } = useTranslation();
  const { registration, updateAvailable } = useReactiveVar(
    serviceWorkerRegistrationVar
  );

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
