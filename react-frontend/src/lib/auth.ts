export function getAccessToken(): string | null {
  // Get token from cookie
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function setAccessToken(token: string): void {
  // Set token in cookie
  document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=86400`; // 24 hours
}

export function removeAccessToken(): void {
  // Remove token from cookie
  document.cookie = 'accessToken=; path=/; max-age=0';
}

export function getAuthHeaders(): { Authorization: string } | {} {
  const token = getAccessToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

