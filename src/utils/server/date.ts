export function Is30Days(dateStr: string) {
  const dateUTC = new Date(dateStr);

  // Получаем текущее время в UTC
  const nowUTC = new Date(new Date().toISOString());
  // Вычисляем разницу в миллисекундах между текущей датой и указанной датой
  const diffMilliseconds = nowUTC.getTime() - dateUTC.getTime();

  // Переводим разницу из миллисекунд в дни
  const daysDiff = diffMilliseconds / (1000 * 60 * 60 * 24);

  return daysDiff > 30;
}
