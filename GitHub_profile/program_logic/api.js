/**
 * Модуль для работы с GitHub API.
 */

const BASE_URL = 'https://api.github.com/users';

/**
 * Получает информацию о пользователе GitHub по его имени.
 * @param {string} username - Юзернейм на GitHub
 * @returns {Promise<Object>} Данные пользователя
 * @throws {Error} Ошибка при получении данных
 */
export async function fetchGitHubUser(username) {
    if (!username || username.trim() === '') {
        throw new Error('Пожалуйста, введите имя пользователя');
    }

    const response = await fetch(`${BASE_URL}/${username.trim()}`);

    if (response.status === 404) {
        throw new Error(`Пользователь "${username}" не найден`);
    }

    if (!response.ok) {
        throw new Error('Произошла ошибка при получении данных. Попробуйте позже.');
    }

    return await response.json();
}

/**
 * Получает последние 5 репозиториев пользователя GitHub.
 * @param {string} username - Юзернейм на GitHub
 * @returns {Promise<Array>} Массив репозиториев
 * @throws {Error} Ошибка при получении данных
 */
export async function fetchGitHubUserRepos(username) {
    if (!username || username.trim() === '') {
        throw new Error('Пожалуйста, введите имя пользователя для поиска репозиториев');
    }

    const response = await fetch(`${BASE_URL}/${username.trim()}/repos?sort=created&direction=desc&per_page=5`);

    if (!response.ok) {
        throw new Error('Произошла ошибка при получении репозиториев. Попробуйте позже.');
    }

    return await response.json();
}
