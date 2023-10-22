import {
  alpha,
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

type OptionListProps<T> = {
  items: T[] | null | undefined;
  keyExtractor: (item: T) => string;
  getAvatarContent: (item: T) => React.ReactNode;
  getPrimaryText: (item: T) => string;
  getSecondaryText?: (item: T) => string;
  navigateTo: (item: T) => void;
};

function OptionList<T>({
  items,
  keyExtractor,
  getAvatarContent,
  getPrimaryText,
  getSecondaryText,
  navigateTo,
}: OptionListProps<T>) {
  if (!items) return null;

  return (
    <List>
      {items.map((item) => {
        return (
          <ListItemButton
            key={keyExtractor(item)}
            onClick={() => navigateTo(item)}
          >
            <ListItemAvatar>
              <Avatar
                sx={(theme) => ({
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  color: 'text.primary',
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  ),
                })}
              >
                {getAvatarContent(item)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={getPrimaryText(item)}
              secondary={getSecondaryText ? getSecondaryText(item) : undefined}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}

export default OptionList;
