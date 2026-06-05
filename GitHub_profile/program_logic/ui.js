/**
 * Модуль для управления интерфейсом (DOM).
 */

/**
 * Создает HTML-элемент карточки пользователя GitHub и вставляет его в контейнер.
 * @param {HTMLElement} container - Родительский контейнер для карточки
 * @param {Object} userData - Данные пользователя от GitHub API
 */
export function renderUserCard(container, userData) {
    // Очищаем контейнер перед выводом новой карточки
    container.innerHTML = '';

    // Подготовка данных с дефолтными значениями на случай их отсутствия
    const avatarUrl = userData.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150';
    const name = userData.name || userData.login || 'Имя не указано';
    const followers = userData.followers !== undefined ? userData.followers : 0;
    const following = userData.following !== undefined ? userData.following : 0;
    const publicRepos = userData.public_repos !== undefined ? userData.public_repos : 0;
    const bio = userData.bio || 'Биография отсутствует.';

    // Создаем элемент карточки
    const card = document.createElement('div');
    card.className = 'user-card';

    // Заполняем структуру карточки согласно требованиям
    card.innerHTML = `
        <img src="${avatarUrl}" alt="Аватар ${name}" class="user-avatar">
        <h2 class="user-name">${name}</h2>
        <div class="user-stats">Подписчиков: ${followers} &nbsp;&nbsp; Подписок: ${following}</div>
        <div class="user-repos">Публичных репозиториев: ${publicRepos}</div>
        <div class="user-bio"><strong>Биография:</strong> ${bio}</div>
    `;

    // Добавляем карточку в контейнер
    container.appendChild(card);
}

/**
 * Показывает состояние загрузки в контейнере.
 * @param {HTMLElement} container - Родительский контейнер
 */
export function showLoading(container) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <span>Поиск пользователя...</span>
        </div>
    `;
}

/**
 * Показывает ошибку в контейнере.
 * @param {HTMLElement} container - Родительский контейнер
 * @param {string} message - Текст ошибки
 */
export function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
        </div>
    `;
}

/**
 * Очищает контейнер.
 * @param {HTMLElement} container - Родительский контейнер
 */
export function clearContainer(container) {
    container.innerHTML = '';
}
