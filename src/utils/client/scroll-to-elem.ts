export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const offset = 100; // Отступ в пикселях
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
