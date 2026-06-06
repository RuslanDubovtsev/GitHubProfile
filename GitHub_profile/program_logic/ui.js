/**
 * Модуль для управления интерфейсом (DOM).
 */

import { getLanguageColor } from './languageColors.js';

/**
 * Создает HTML-элемент карточки пользователя GitHub и вставляет его в контейнер.
 * @param {HTMLElement} container - Родительский контейнер для карточки
 * @param {Object} userData - Данные пользователя от GitHub API
 */
export function renderUserCard(container, userData) {
    // Подготовка данных с дефолтными значениями на случай их отсутствия
    const avatarUrl = userData.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150';
    const name = userData.name || userData.login || 'Имя не указано';
    const followers = userData.followers !== undefined ? userData.followers : 0;
    const following = userData.following !== undefined ? userData.following : 0;
    const publicRepos = userData.public_repos !== undefined ? userData.public_repos : 0;
    const bio = userData.bio || 'Биография отсутствует.';

    // Создаем элемент карточки
    const card = document.createElement('div');
    card.className = 'user-card card-animate';

    // Вычисляем задержку анимации на основе количества уже существующих карточек
    const existingCards = container.querySelectorAll('.user-card');
    const delay = existingCards.length * 0.15;
    card.style.animationDelay = `${delay}s`;

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
        return;
    }

    const repoCard = document.createElement("div");
    repoCard.className = "repo-card user-card card-animate";

    // Вычисляем задержку анимации на основе количества уже существующих карточек
    const existingCards = container.querySelectorAll('.user-card');
    const delay = existingCards.length * 0.15;
    repoCard.style.animationDelay = `${delay}s`;

    let reposHtml = reposData.map(repo => {
        const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : 0;
        return `
            <div class="repo-item">
                <div class="repo-name-row">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
                    <span class="repo-stars">⭐ ${stars}</span>
                </div>
                <p class="repo-description">${repo.description || "Без описания"}</p>
            </div>
        `;
    }).join("");

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

/**
 * Показывает уведомление в верхней части страницы.
 * @param {string} message - Текст уведомления
 * @param {"success" | "error"} type - Тип уведомления (для стилизации)
 * @param {number} duration - Длительность показа уведомления в миллисекундах (по умолчанию 5000)
 */
export function showNotification(message, type, duration = 5000) {
    const notificationContainer = document.getElementById("notification-container");
    if (!notificationContainer) {
        console.error("Контейнер для уведомлений #notification-container не найден.");
        return;
    }

    const notificationEl = document.createElement("div");
    notificationEl.className = `notification ${type}`;
    notificationEl.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close-btn">&times;</button>
    `;

    notificationContainer.appendChild(notificationEl);

    // Закрытие по кнопке
    notificationEl.querySelector(".notification-close-btn").addEventListener("click", () => {
        notificationEl.remove();
    });

    // Автоматическое закрытие через duration
    setTimeout(() => {
        if (notificationEl.parentNode) {
            notificationEl.remove();
        }
    }, duration);
}

/**
 * Создает и отрисовывает карточку с круговой диаграммой (пирогом) 
 * самых используемых языков программирования пользователя.
 * Каждый сегмент рисуется со смещением, образуя единый круг.
 * @param {HTMLElement} container - Родительский контейнер для карточки
 * @param {Object} languagesData - Объект { languageName: totalBytes, ... }
 */
export function renderLanguagesCard(container, languagesData) {
    // Проверяем, есть ли данные о языках
    const entries = Object.entries(languagesData);
    if (!entries || entries.length === 0) {
        const card = document.createElement("div");
        card.className = "lang-card";
        card.innerHTML = `
            <h3 class="lang-card-title">Топ используемых языков</h3>
            <div class="lang-empty">Нет данных о языках</div>
        `;
        container.appendChild(card);
        return;
    }

    // Сортируем языки по убыванию байтов и берем топ-8, остальное в "Прочее"
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 8);
    const other = sorted.slice(8);
    
    let chartData = top.map(([name, bytes]) => ({ name, bytes }));
    
    // Если есть "прочие" языки, суммируем их
    if (other.length > 0) {
        const otherBytes = other.reduce((sum, [, bytes]) => sum + bytes, 0);
        chartData.push({ name: "Прочее", bytes: otherBytes });
    }

    // Считаем общее количество байтов
    const totalBytes = chartData.reduce((sum, item) => sum + item.bytes, 0);

    // Параметры SVG
    const size = 220;
    const center = size / 2;
    const radius = 90;
    const strokeWidth = 30;
    const total = chartData.length;
    const circumference = 2 * Math.PI * radius;

    // Строим сегменты: каждый сегмент имеет длину своей доли,
    // а начало следующего сдвинуто на сумму длин предыдущих
    let accumulatedLength = 0;
    let svgSlices = "";

    chartData.forEach((item, index) => {
        const percent = (item.bytes / totalBytes) * 100;
        const color = getLanguageColor(item.name);
        const segmentLength = (percent / 100) * circumference;

        // Сегмент: рисуем только свою дугу (dasharray = segmentLength, остальное — пробел)
        // Смещение: отрицательное, чтобы сдвинуть начало по часовой стрелке
        const dashArray = `${segmentLength} ${circumference - segmentLength}`;
        const dashOffset = -accumulatedLength;

        // Анимация: начальное состояние (невидим) — offset = dashOffset + segmentLength
        const initialOffset = dashOffset + segmentLength;
        // Финальное состояние — offset = dashOffset
        const animationDelay = index * 0.15; // задержка 0.15с на каждый сегмент

        svgSlices += `
            <circle
                class="lang-segment"
                cx="${center}"
                cy="${center}"
                r="${radius}"
                fill="none"
                stroke="${color}"
                stroke-width="${strokeWidth}"
                stroke-dasharray="${dashArray}"
                stroke-dashoffset="${initialOffset}"
                stroke-linecap="butt"
                data-final-offset="${dashOffset}"
                style="transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${animationDelay}s;"
            />
        `;
        
        accumulatedLength += segmentLength;
    });

    // Сортируем легенду по убыванию процентов
    const legendSorted = [...chartData].sort((a, b) => b.bytes - a.bytes);
    console.log("legendSorted:", legendSorted)

    let legendItems = legendSorted.map((item, index) => {
        const percent = ((item.bytes / totalBytes) * 100).toFixed(1);
        const color = getLanguageColor(item.name);
        const animationDelay = index * 0.15;
        return `
            <div class="lang-legend-item" style="opacity: 0; animation: fadeInLegend 0.4s ease forwards ${animationDelay + 0.6}s;">
                <span class="lang-legend-color" style="background-color: ${color};"></span>
                <span class="lang-legend-name">${item.name}</span>
                <span class="lang-legend-percent">${percent}%</span>
            </div>
        `;
    }).join("");

    // Собираем всю карточку
    const card = document.createElement("div");
    card.className = "lang-card";
    card.innerHTML = `
        <h3 class="lang-card-title">Топ используемых языков</h3>
        <div class="lang-chart-wrapper">
            <svg viewBox="0 0 ${size} ${size}">
                ${svgSlices}
            </svg>
            
        </div>
        <div class="lang-legend">
            ${legendItems}
        </div>
    `;

    container.appendChild(card);

    // Запускаем анимацию сегментов в следующем кадре
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const segments = card.querySelectorAll('.lang-segment');
            segments.forEach(seg => {
                seg.style.strokeDashoffset = seg.dataset.finalOffset;
            });
        });
    });
}
