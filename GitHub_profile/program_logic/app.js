import { fetchGitHubUser, fetchGitHubUserRepos, fetchGitHubUserLanguages } from './api.js';
import { renderUserCard, renderRepoCard, renderLanguagesCard, showNotification } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const usernameInput = document.getElementById('username-input');
    const cardsContainer = document.getElementById('cards-container');
    const resetBtn = document.getElementById('reset-btn');

    if (!searchForm || !usernameInput || !cardsContainer || !resetBtn) {
        console.error('Не удалось найти необходимые элементы интерфейса на странице.');
        return;
    }

    // Кнопка "Сброс" — перезагрузка страницы
    resetBtn.addEventListener('click', () => {
        location.reload();
    });

    // Обработчик отправки формы поиска
    searchForm.addEventListener('submit', async (event) => {
        // Отменяем стандартную перезагрузку страницы
        event.preventDefault();

        const username = usernameInput.value.trim();

        if (!username) {
            const errorEl = document.createElement('div');
            errorEl.className = 'error-state';
            errorEl.innerHTML = '<span class="error-icon">⚠️</span><span class="error-message">Пожалуйста, введите имя пользователя</span>';
            cardsContainer.appendChild(errorEl);
            return;
        }

        // Создаём группу для нового пользователя с индикатором загрузки
        const userGroup = document.createElement('div');
        userGroup.className = 'user-group';

        // Если это не первый пользователь, добавляем разделитель hr
        if (cardsContainer.children.length > 0) {
            const separator = document.createElement('hr');
            separator.className = 'user-separator';
            cardsContainer.appendChild(separator); // Добавляем разделитель перед userGroup
        }

        // Создаём колонки для нового пользователя
        const leftColumn = document.createElement('div');
        leftColumn.className = 'user-section';

        const rightColumn = document.createElement('div');
        rightColumn.className = 'user-lang-section';

        // Показываем спиннер в левой части
        leftColumn.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <span>Поиск пользователя...</span>
            </div>
        `;

        userGroup.appendChild(leftColumn);
        userGroup.appendChild(rightColumn);
        cardsContainer.appendChild(userGroup);

        try {
            // Параллельно загружаем данные пользователя, репозитории и языки
            const [userData, reposData, languagesData] = await Promise.all([
                fetchGitHubUser(username),
                fetchGitHubUserRepos(username),
                fetchGitHubUserLanguages(username)
            ]);

            // Очищаем индикатор загрузки
            leftColumn.innerHTML = '';

            // Отрисовываем карточки внутри левой колонки
            renderUserCard(leftColumn, userData);
            renderRepoCard(leftColumn, reposData);

            // Добавляем карточку языков в правую колонку этой группы
            renderLanguagesCard(rightColumn, languagesData);

            // Показываем уведомление об успешном добавлении пользователя
            showNotification(`Пользователь @${username} добавлен!`, 'success');

        } catch (error) {
            leftColumn.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">⚠️</span>
                    <span class="error-message">${error.message || 'Произошла непредвиденная ошибка'}</span>
                </div>
            `;
            // Показываем уведомление об ошибке
            showNotification(`Ошибка: ${error.message || 'Произошла непредвиденная ошибка'}`, 'error');
        }
    });
});
