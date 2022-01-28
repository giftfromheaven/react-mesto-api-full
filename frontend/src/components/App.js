import { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import * as auth from '../utils/auth';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { ImagePopup } from './ImagePopup';
import { DeleteConfirmPopup } from './DeleteConfirmPopup';
import { MenuMobile } from './MenuMobile';
import { Login } from './Login';
import { Register } from './Register';
import { InfoToolTip } from './InfoTooltip';

function App() {
  // USER & CARDS
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    id_: '',
  });
  // POPUPS
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setDeleteConfirmPopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // buttons
  const [infoToolTipData, setInfoToolTipData] = useState({
    title: '',
    icon: '',
  });
  // CARDS
  const [selectedCard, setSelectedCard] = useState({
    name: '',
    link: '',
  });
  const [deletedCard, setDeletedCard] = useState({
    name: '',
    link: '',
  });
  // AUTH
  const [loggedIn, setLoggedIn] = useState(false);
  const [isDataSet, setIsDataSet] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
  });

  // GET User and Cards
  useEffect(() => {
    api
      .getAllneededData()
      .then((res) => {
        const [cards, userInfo] = res;
        setCards(cards);
        setCurrentUser(userInfo);
      })
      .catch((err) => console.log(err));
  }, []);

  // CLOSE popup by Esc
  useEffect(() => {
    const closeByEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };
    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  // CHECK token
  // useEffect(() => {
  //   tokenCheck();
  // }, []);

  // START page
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [history, loggedIn]);

  // CARD
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (card) => {
    setIsLoading(true);
    api
      .setDelete(card._id)
      .then((res) => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCardDeleteClick = (card) => {
    setDeletedCard(card);
    setDeleteConfirmPopupOpen(true);
  };

  // POPUPs
  const onEditProfile = () => {
    setIsEditProfilePopupOpen(true);
  };
  const onAddPlace = () => {
    setIsAddPlacePopupOpen(true);
  };
  const onEditAvatar = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: '', link: '' });
    setDeletedCard({ name: '', link: '' });
    setIsInfoToolTipOpen(false);
    setDeleteConfirmPopupOpen(false);
  };

  const handleUpdateUser = (data) => {
    setIsLoading(true);
    api
      .setUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateAvatar = (data) => {
    setIsLoading(true);
    api
      .setAvatar(data)
      .then((res) => {
        setIsDataSet(true);
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
        setIsDataSet(false);
      });
  };

  const handleAddPlaceSubmit = (data) => {
    setIsLoading(true);
    api
      .setCard(data)
      .then((res) => {
        setIsDataSet(true);
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
        setIsDataSet(false);
      });
  };

  const closeByOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  };

  const toggleMenu = () => {
    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
  };

  const handleInfoToolTip = () => {
    setIsInfoToolTipOpen(true);
  };

  // AUTH
  const handleLogin = (email, password) => {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          setUserData({ email: email });
          setLoggedIn(true);
          setIsMenuOpen(false);
          history.push('/');
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRegister = (password, email) => {
    auth
      .register(password, email)
      .then((res) => {
        setIsDataSet(true);
        history.push('/sign-in');
        setInfoToolTipData({
          icon: true,
          title: 'Вы успешно зарегистрировались!',
        });
        handleInfoToolTip();
      })
      .catch(() => {
        setIsDataSet(false);
        setInfoToolTipData({
          icon: false,
          title: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
        handleInfoToolTip();
      })
      .finally(() => {
        setIsDataSet(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData({ email: '' });
    setLoggedIn(false);
  };

  // const tokenCheck = () => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     auth
  //       .getContent(token)
  //       .then((res) => {
  //         if (res) {
  //           setUserData({ email: res.data.email });
  //           setLoggedIn(true);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        {loggedIn && (
          <MenuMobile email={userData.email} handleLogout={handleLogout} isMenuOpen={isMenuOpen} />
        )}

        <Header
          handleLogout={handleLogout}
          email={userData.email}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />

        <Switch>
          <ProtectedRoute
            exact
            path='/'
            loggedIn={loggedIn}
            handleEditProfileClick={onEditProfile}
            handleAddPlaceClick={onAddPlace}
            handleEditAvatarClick={onEditAvatar}
            handleCardClick={handleCardClick}
            handleCardDeleteClick={handleCardDeleteClick}
            cards={cards}
            onCardLike={handleCardLike}
            component={Main}
          />

          <Route path='/sign-in'>
            <Login handleLogin={handleLogin} />
          </Route>

          <Route path='/sign-up'>
            <Register handleRegister={handleRegister} isDataSet={isDataSet} />
          </Route>

          <Route>{loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}</Route>
        </Switch>

        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onCloseOverlay={closeByOverlayClick}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onCloseOverlay={closeByOverlayClick}
          isDataSet={isDataSet}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onCloseOverlay={closeByOverlayClick}
          isDataSet={isDataSet}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onCloseOverlay={closeByOverlayClick}
        />
        <DeleteConfirmPopup
          isOpen={isDeleteConfirmPopupOpen}
          card={deletedCard}
          onClose={closeAllPopups}
          onCloseOverlay={closeByOverlayClick}
          onCardDelete={() => handleCardDelete(deletedCard)}
          isLoading={isLoading}
        />
        <InfoToolTip
          onCloseOverlay={closeByOverlayClick}
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          title={infoToolTipData.title}
          icon={infoToolTipData.icon}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
