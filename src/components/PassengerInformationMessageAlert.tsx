import { Alert, ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { PassengerInformationMessage } from '../hooks/usePassengerInformationMessages';

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

  const getTextForCurrentLanguage = (text?: Record<string, string>) => {
    if (!text) {
      return '';
    }
    if (i18n.resolvedLanguage in text) {
      return text[i18n.resolvedLanguage];
    }
    return text.fi;
  };

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
        {getTextForCurrentLanguage(
          (firstMessage.video ?? firstMessage.audio)?.text
        )}
        {passengerInformationMessages.length > 1 && (
          <strong> + {passengerInformationMessages.length - 1}</strong>
        )}
      </Alert>
    </ButtonBase>
  );
};

export default PassengerInformationMessageAlert;
