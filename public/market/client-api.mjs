const unavailable = 'The marketplace service is unavailable. You can still use the provider search links.';

// Keep browsing usable if the account service is slow. Never retry a write
// automatically: it may have completed on the server before the response failed.
export async function requestMarketplace(action, data, {send = fetch, timeoutMs = 12000} = {}) {
  try {
    const response = await send('/api/' + action, {
      method: data ? 'POST' : 'GET',
      credentials: 'same-origin',
      headers: data ? {'Content-Type': 'application/json'} : {},
      body: data ? JSON.stringify(data) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    });
    let result;
    try {
      result = await response.json();
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') throw error;
      throw Error(unavailable);
    }
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw Error(unavailable);
    if (!response.ok) throw Error(typeof result.error === 'string' ? result.error : unavailable);
    return result;
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw Error(data
        ? 'The request took too long. Check Your account before trying again; your change may have been saved.'
        : 'The service took too long to respond. Try again or use the provider search links.');
    }
    if (error instanceof TypeError) throw Error(unavailable);
    throw error;
  }
}
