export function newVisitEvent(path: string, userfp: string) {
  return fetch("/api/events/visit", {
    method: "POST",
    body: JSON.stringify({ path: path, user: userfp }),
  });
}

export function newErrorEvent(from: string, cause: string) {
  return fetch("/api/events/error", {
    method: "POST",
    body: JSON.stringify({ from: from, cause: cause }),
  });
}
