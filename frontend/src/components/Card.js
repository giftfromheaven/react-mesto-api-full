import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = ({ card, onCardClick, onCardLike, onCardDelete }) => {
  //!
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };
  //!

  const handleClick = () => {
    onCardClick(card);
  };

  return (
    <li className='element'>
      <button
        onClick={handleDeleteClick}
        className='button element__delete-button'
        style={isOwn ? { display: 'block' } : { display: 'none' }}
        aria-label='Удалить'
        type='button'></button>
      <img className='element__image' onClick={handleClick} src={card.link} alt={card.title} />
      <div className='element__info'>
        <h2 className='element__title'>{card.name}</h2>
        <div className='element__like'>
          <button
            onClick={handleLikeClick}
            className={
              isLiked
                ? 'button element__like-button element__like-button_active'
                : 'button element__like-button'
            }
            aria-label='Понравилось'
            type='button'></button>
          <span className='element__like-counter'>{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
};

export default Card;
