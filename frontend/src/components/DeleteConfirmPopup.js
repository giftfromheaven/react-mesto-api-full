import { PopupWithForm } from './PopupWithForm';

export const DeleteConfirmPopup = ({
  isOpen,
  onClose,
  onCloseOverlay,
  onCardDelete,
  isLoading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCardDelete();
  };

  return (
    <PopupWithForm
      name='delete-card'
      title={'Удалить карточку'}
      buttonText={isLoading ? 'Удаление...' : 'Удалить'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onCloseOverlay={onCloseOverlay}
    />
  );
};
