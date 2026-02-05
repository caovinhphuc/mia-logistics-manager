import { Button } from '@mui/material';

// ActionButton Component
export const ActionButton = ({
  children,
  variant: customVariant,
  color: customColor,
  size = 'medium',
  onClick,
  disabled = false,
  ...props
}) => {
  // Map custom variants to MUI variants
  const variant =
    customVariant === 'secondary' || customVariant === 'primary'
      ? 'contained'
      : customVariant || 'contained';
  const color = customVariant === 'secondary' ? 'secondary' : customColor || 'primary';

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
