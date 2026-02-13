
export function simulateApiCall<T>(data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    const delay = 800 + Math.random() * 1200;

    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error("Server error: Failed to save changes. Please try again."));
      } else {
        resolve(data);
      }
    }, delay);
  });
}
