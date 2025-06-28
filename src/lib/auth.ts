// This file is no longer used in the static version of the site.
// It is kept to prevent breaking any potential imports.
export async function getAuthCredentials(): Promise<{username: string, password: string}> {
  return { username: '', password: '' };
}

export async function saveAuthCredentials(credentials: {username: string, password: string}) {
  // No-op
}
