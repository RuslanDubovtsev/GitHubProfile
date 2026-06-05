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
    container.innerHTML = ""; // Очищаем только в начале отрисовки новой пары карточек

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
 * Создает HTML-элемент карточки репозиториев и вставляет его в контейнер.
 * @param {HTMLElement} container - Родительский контейнер для карточки
 * @param {Array} reposData - Массив данных репозиториев от GitHub API
 */
export function renderRepoCard(container, reposData) {
    if (!reposData || reposData.length === 0) {
        // Если репозиториев нет, можно показать соответствующее сообщение или ничего не делать
        // container.innerHTML += `<div class="info-state">Нет публичных репозиториев.</div>`;
        return;
    }

    const repoCard = document.createElement("div");
    repoCard.className = "repo-card user-card"; // Используем те же стили, что и для user-card

    let reposHtml = reposData.map(repo => `
        <div class="repo-item">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
            <p class="repo-description">${repo.description || "Без описания"}</p>
        </div>
    `).join("");

    repoCard.innerHTML = `
        <h3 class="repo-card-title">Последние 5 репозиториев</h3>
        ${reposHtml}
    `;

    container.appendChild(repoCard);
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
    container.innerHTML = "";
}
