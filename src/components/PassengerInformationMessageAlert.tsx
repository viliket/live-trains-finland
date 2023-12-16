import { Alert, ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  getPassengerInformationMessageForLanguage,
  PassengerInformationMessage,
} from '../utils/passengerInformationMessages';

type PassengerInformationMessageAlertProps = {
  onClick: () => void;
  passengerInformationMessages: PassengerInformationMessage[];
};

const PassengerInformationMessageAlert = ({
  onClick,
  passengerInformationMessages,
}: PassengerInformationMessageAlertProps) => {
  const { i18n } = useTranslation();

  if (passengerInformationMessages.length === 0) return null;

  const firstMessage = passengerInformationMessages[0];

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        '&:focus-visible': {
          outline: 'auto 1px',
        },
      }}
    >
      <Alert severity="info" sx={{ width: '100%' }}>
        {getPassengerInformationMessageForLanguage(
          firstMessage,
          i18n.resolvedLanguage ?? i18n.language
        )}
        {passengerInformationMessages.length > 1 && (
          <strong> + {passengerInformationMessages.length - 1}</strong>
        )}
      </Alert>
    </ButtonBase>
  );
};

export default PassengerInformationMessageAlert;
