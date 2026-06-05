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

    if (response.status === 403) {
        throw new Error(`Превышен лимит запросов к GitHub API`);
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
    
    if (response.status === 403) {
        throw new Error(`Превышен лимит запросов к GitHub API`);
    }

    if (!response.ok) {
        throw new Error('Произошла ошибка при получении репозиториев. Попробуйте позже.');
    }

    return await response.json();
}

/**
 * Получает агрегированные данные о языках, используемых пользователем.
 * Собирает все репозитории и суммирует байты по каждому языку.
 * @param {string} username - Юзернейм на GitHub
 * @returns {Promise<Object>} Объект { languageName: totalBytes, ... }
 * @throws {Error} Ошибка при получении данных
 */
export async function fetchGitHubUserLanguages(username) {
    if (!username || username.trim() === '') {
        throw new Error('Пожалуйста, введите имя пользователя');
    }

    // Получаем ВСЕ репозитории через пагинацию (по 100 за страницу)
    const languageMap = {};
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        const reposResponse = await fetch(
            `${BASE_URL}/${username.trim()}/repos?per_page=100&sort=updated&page=${page}`
        );

        if (reposResponse.status === 403) {
            throw new Error(`Превышен лимит запросов к GitHub API`);
        }

        if (!reposResponse.ok) {
            throw new Error('Произошла ошибка при получении данных о репозиториях. Попробуйте позже.');
        }

        const repos = await reposResponse.json();

        if (!repos || repos.length === 0) {
            break; // Нет больше репозиториев
        }

        // Собираем языки по каждому репозиторию (параллельно, но батчами по 5, чтобы избежать rate limiting)
        for (let i = 0; i < repos.length; i += 5) {
            const batch = repos.slice(i, i + 5);

            const results = await Promise.allSettled(
                batch.map(repo =>
                    fetch(repo.languages_url).then(res => {
                        if (!res.ok) throw new Error(`Ошибка получения языков для ${repo.name}`);
                        return res.json();
                    })
                )
            );

            for (const result of results) {
                if (result.status === 'fulfilled') {
                    const repoLanguages = result.value;
                    for (const [lang, bytes] of Object.entries(repoLanguages)) {
                        languageMap[lang] = (languageMap[lang] || 0) + bytes;
                    }
                }
                // Если запрос не удался — просто пропускаем этот репозиторий
            }
        }

        // Если пришло меньше 100 репозиториев — это последняя страница
        if (repos.length < 100) {
            hasMorePages = false;
        } else {
            page++;
        }
    }

    return languageMap;
}
