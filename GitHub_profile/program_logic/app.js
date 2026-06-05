import { fetchGitHubUser } from './api.js';
import { renderUserCard, showLoading, showError } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const usernameInput = document.getElementById('username-input');
    const cardsContainer = document.getElementById('cards-container');

    if (!searchForm || !usernameInput || !cardsContainer) {
        console.error('Не удалось найти необходимые элементы интерфейса на странице.');
        return;
    }

    // Обработчик отправки формы поиска
    searchForm.addEventListener('submit', async (event) => {
        // Отменяем стандартную перезагрузку страницы
        event.preventDefault();

        const username = usernameInput.value.trim();

        if (!username) {
            showError(cardsContainer, 'Пожалуйста, введите имя пользователя');
            return;
        }

        try {
            showLoading(cardsContainer);
            const userData = await fetchGitHubUser(username);
            renderUserCard(cardsContainer, userData);
        } catch (error) {
            showError(cardsContainer, error.message || 'Произошла непредвиденная ошибка');
        }
    });
});
