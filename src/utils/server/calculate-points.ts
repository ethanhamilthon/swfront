export function CalculatePoints(plan: string | null | undefined) {
  switch (plan) {
    case "free":
      return 50;
    case "premium":
      return 700;
    default:
      return 50;
  }
}
