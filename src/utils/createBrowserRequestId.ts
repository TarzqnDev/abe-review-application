let fallbackRequestIdCounter = 0;

const tryCreateRequestId = (createRequestId: () => string) => {
  try {
    return createRequestId();
  } catch {
    return null;
  }
};

const formatUuid = (randomBytes: Uint8Array) => {
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

  const hexadecimalBytes = Array.from(randomBytes, (randomByte) =>
    randomByte.toString(16).padStart(2, "0"),
  );

  return [
    hexadecimalBytes.slice(0, 4).join(""),
    hexadecimalBytes.slice(4, 6).join(""),
    hexadecimalBytes.slice(6, 8).join(""),
    hexadecimalBytes.slice(8, 10).join(""),
    hexadecimalBytes.slice(10, 16).join(""),
  ].join("-");
};

export const createBrowserRequestId = () => {
  const browserCrypto =
    typeof window === "undefined" ? undefined : window.crypto;

  if (typeof browserCrypto?.randomUUID === "function") {
    const randomUuid = tryCreateRequestId(() => browserCrypto.randomUUID());

    if (randomUuid) return randomUuid;
  }

  if (typeof browserCrypto?.getRandomValues === "function") {
    const randomValuesUuid = tryCreateRequestId(() =>
      formatUuid(browserCrypto.getRandomValues(new Uint8Array(16))),
    );

    if (randomValuesUuid) return randomValuesUuid;
  }

  fallbackRequestIdCounter += 1;

  const highResolutionTime =
    typeof performance === "undefined"
      ? 0
      : Math.round(performance.now() * 1000);

  return [
    Date.now().toString(36),
    highResolutionTime.toString(36),
    fallbackRequestIdCounter.toString(36),
    Math.random().toString(36).slice(2),
  ].join("-");
};
