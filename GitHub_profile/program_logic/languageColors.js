/**
 * Цвета языков программирования в соответствии с палитрой GitHub Linguist.
 * Для языков, не указанных в списке, используется серый цвет по умолчанию.
 */
const LANGUAGE_COLORS = {
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "Python": "#3572a5",
    "Java": "#b07219",
    "Go": "#00add8",
    "Rust": "#dea584",
    "C": "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    "Ruby": "#701516",
    "PHP": "#4f5d95",
    "Swift": "#f05138",
    "Kotlin": "#a97bff",
    "Scala": "#c22d40",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "SCSS": "#c6538c",
    "Sass": "#a53b70",
    "Less": "#1d365d",
    "Vue": "#41b883",
    "Shell": "#89e051",
    "PowerShell": "#012456",
    "Dockerfile": "#384d54",
    "Makefile": "#427819",
    "Lua": "#000080",
    "Perl": "#0298c3",
    "R": "#198ce7",
    "Dart": "#00b4ab",
    "Elixir": "#6e4a7e",
    "Erlang": "#b83998",
    "Haskell": "#5e5086",
    "Clojure": "#db5855",
    "Objective-C": "#438eff",
    "Objective-C++": "#6866fb",
    "Assembly": "#6e4c13",
    "TeX": "#3d6117",
    "Vim script": "#199f4b",
    "Emacs Lisp": "#c065db",
    "Jupyter Notebook": "#da5b0b",
    "Markdown": "#083fa1",
    "YAML": "#cb171e",
    "JSON": "#292929",
    "XML": "#0060ac",
    "Dockerfile": "#384d54",
    "Nix": "#7e7eff",
    "Zig": "#ec915c",
    "Solidity": "#aa6746",
    "Groovy": "#4298b8",
    "Julia": "#a270ba",
    "CoffeeScript": "#244776",
    "Reason": "#ff5847",
    "GraphQL": "#e10098",
    "Verilog": "#b2b7f8",
    "VHDL": "#adb2cb",
    "Fortran": "#4d41b1",
    "COBOL": "#0073c6",
    "HCL": "#844fba",
    "Puppet": "#302b6d",
    "PureScript": "#1d222d",
    "F#": "#b845fc",
    "Ocaml": "#3be133",
    "Crystal": "#000100",
    "Nim": "#37775b"
};

/**
 * Возвращает цвет для языка программирования.
 * Если язык не найден в маппинге, возвращает серый цвет.
 * @param {string} language - Название языка программирования
 * @returns {string} HEX-цвет (например, "#f1e05a")
 */
export function getLanguageColor(language) {
    return LANGUAGE_COLORS[language] || "#8b949e";
}

/**
 * Возвращает массив цветов для массива языков, сохраняя порядок.
 * @param {string[]} languages - Массив названий языков
 * @returns {string[]} Массив HEX-цветов
 */
export function getLanguagesColors(languages) {
    return languages.map(lang => getLanguageColor(lang));
}
