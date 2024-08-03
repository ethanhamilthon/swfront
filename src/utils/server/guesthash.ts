export function addLetters(input: string): string {
  if (input.length < 2) {
    throw new Error(
      "Input string is too short to add letters at specified indices."
    );
  }

  const firstPart = input.slice(0, 2) + "h";
  const secondPart = input.slice(2, 5) + "3";
  const thirdPart = input.slice(5);

  return firstPart + secondPart + thirdPart;
}

export function removeLetters(input: string): string {
  if (input.length < 7) {
    throw new Error(
      "Input string is too short to remove letters from specified indices."
    );
  }

  const firstPart = input.slice(0, 2);
  const secondPart = input.slice(3, 5);
  const thirdPart = input.slice(6);

  return firstPart + secondPart + thirdPart;
}
