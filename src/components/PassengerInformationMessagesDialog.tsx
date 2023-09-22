import { Alert, DialogActions, DialogContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

import {
  getPassengerInformationMessageForLanguage,
  PassengerInformationMessage,
} from '../utils/passengerInformationMessages';

type PassengerInformationMessagesDialogProps = {
  onClose: () => void;
  open: boolean;
  passengerInformationMessages:
    | PassengerInformationMessage[]
    | null
    | undefined;
};

const PassengerInformationMessagesDialog = (
  props: PassengerInformationMessagesDialogProps
) => {
  const { onClose, open, passengerInformationMessages } = props;
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t('alerts')}</DialogTitle>
      <DialogContent>
        {passengerInformationMessages?.map((m) => (
          <Alert key={m.id} severity="info" sx={{ mb: 1 }}>
            {getPassengerInformationMessageForLanguage(
              m,
              i18n.resolvedLanguage
            )}
          </Alert>
        ))}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-evenly' }}></DialogActions>
    </Dialog>
  );
};

export default PassengerInformationMessagesDialog;
