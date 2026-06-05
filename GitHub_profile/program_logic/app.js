import { fetchGitHubUser, fetchGitHubUserRepos, fetchGitHubUserLanguages } from './api.js';
import { renderUserCard, renderRepoCard, renderLanguagesCard, showLoading, showError } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const usernameInput = document.getElementById('username-input');
    const cardsContainer = document.getElementById('cards-container');
    const languagesContainer = document.getElementById('languages-container');

    if (!searchForm || !usernameInput || !cardsContainer || !languagesContainer) {
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
            // Очищаем правую колонку
            languagesContainer.innerHTML = "";
            
            // Параллельно загружаем данные пользователя, репозитории и языки
            const [userData, reposData, languagesData] = await Promise.all([
                fetchGitHubUser(username),
                fetchGitHubUserRepos(username),
                fetchGitHubUserLanguages(username)
            ]);
            
            renderUserCard(cardsContainer, userData);
            renderRepoCard(cardsContainer, reposData);
            renderLanguagesCard(languagesContainer, languagesData);

        } catch (error) {
            showError(cardsContainer, error.message || 'Произошла непредвиденная ошибка');
            // Очищаем правую колонку при ошибке
            languagesContainer.innerHTML = "";
        }
    });
});
