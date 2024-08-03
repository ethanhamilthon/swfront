export function formatDate(isoDateString: string): string {
  // Создаем объект Date из строки в формате ISO 8601
  const date = new Date(isoDateString);

  // Получаем часы и минуты
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Получаем день
  const day = date.getUTCDate();

  // Массив с названиями месяцев
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Получаем название месяца
  const month = monthNames[date.getUTCMonth()];

  // Получаем год
  const year = date.getUTCFullYear();

  // Форматируем строку в требуемом формате
  return `${hours}:${minutes} ${day} ${month} ${year}`;
}

export function extractPath(url: string): string {
  // Используем URL-конструктор для разбора строки URL
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
  } catch (e) {
    // Если строка не является валидным URL, выбрасываем ошибку
    throw new Error("Invalid URL");
  }
}

export function countPath(paths: string[]) {
  const result: {
    [key: string]: number;
  } = {};
  for (let i = 0; i < paths.length; i++) {
    const currentpath = extractPath(paths[i]);
    if (currentpath in result) {
      result[currentpath]++;
    } else {
      result[currentpath] = 1;
    }
  }

  return Object.entries(result)
    .map((c) => {
      return {
        path: c[0],
        count: c[1],
      };
    })
    .sort((a, b) => b.count - a.count);
}
