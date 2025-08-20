import { useState, useCallback } from 'react';
import { cardService } from '../services/productService';
import { cardUtils } from '../utils/cardUtils';

/**
 * Custom hook para manejar el estado de tarjetas del menú
 * @param {Array} initialCards - Array inicial de tarjetas
 * @returns {Object} - Estado y funciones para manejar las tarjetas
 */
const useCard = (initialCards = []) => {
  const [cards, setCards] = useState(initialCards);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para agregar una nueva tarjeta
  const addCard = useCallback((newCard) => {
    const cardWithId = cardUtils.createCardWithDefaults(newCard);
    setCards(prevCards => [...prevCards, cardWithId]);
    return cardWithId;
  }, []);

  // Función para actualizar una tarjeta existente
  const updateCard = useCallback((id, updates) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id 
          ? cardUtils.updateCardData(card, updates)
          : card
      )
    );
  }, []);

  // Función para eliminar una tarjeta
  const removeCard = useCallback((id) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
    if (selectedCard?.id === id) {
      setSelectedCard(null);
    }
  }, [selectedCard]);

  // Función para seleccionar una tarjeta
  const selectCard = useCallback((card) => {
    setSelectedCard(card);
  }, []);

  // Función para deseleccionar tarjeta
  const deselectCard = useCallback(() => {
    setSelectedCard(null);
  }, []);

  // Función para buscar tarjetas
  const searchCards = useCallback((searchTerm, searchField = 'name') => {
    return cardUtils.searchCards(cards, searchTerm, searchField);
  }, [cards]);

  // Función para filtrar tarjetas por categoría
  const filterByCategory = useCallback((category) => {
    return cardUtils.filterByCategory(cards, category);
  }, [cards]);

  // Función para ordenar tarjetas
  const sortCards = useCallback((sortBy = 'name', order = 'asc') => {
    return cardUtils.sortCards(cards, sortBy, order);
  }, [cards]);

  // Función para obtener estadísticas
  const getCardStats = useCallback(() => {
    return cardUtils.getCardStats(cards);
  }, [cards]);

  // Función para resetear todas las tarjetas
  const resetCards = useCallback(() => {
    setCards(initialCards);
    setSelectedCard(null);
    setError(null);
  }, [initialCards]);

  // Función para cargar tarjetas desde API
  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await cardService.getAllCards();
      setCards(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para guardar una tarjeta en la API
  const saveCard = useCallback(async (card) => {
    setLoading(true);
    setError(null);
    
    try {
      const savedCard = card.id 
        ? await cardService.updateCard(card.id, card)
        : await cardService.createCard(card);
      
      if (card.id) {
        updateCard(card.id, savedCard);
      } else {
        addCard(savedCard);
      }
      
      return savedCard;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addCard, updateCard]);

  // Función para eliminar tarjeta de la API
  const deleteCard = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await cardService.deleteCard(id);
      removeCard(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [removeCard]);

  return {
    // Estado
    cards,
    selectedCard,
    loading,
    error,
    
    // Operaciones CRUD
    addCard,
    updateCard,
    removeCard,
    saveCard,
    deleteCard,
    
    // Selección
    selectCard,
    deselectCard,
    
    // Búsqueda y filtrado
    searchCards,
    filterByCategory,
    sortCards,
    
    // Utilidades
    getCardStats,
    resetCards,
    loadCards,
    
    // Estado derivado
    isEmpty: cards.length === 0,
    hasSelection: selectedCard !== null,
    cardCount: cards.length
  };
};

export default useCard;