export const FreeRoutes = [
    "/api/auth/refresh",
    "/api/auth/ex/tokens",
    "/api/google/auth/code/to/tokens",
    "/ping",
    "/api/hubspot/redirect",
    "/api/zoom/redirect",
    "/api/zoom/dev/redirect",
    "/api/zoom/deauthorize",
    "/api/campaign/update_sequence_messages",
    "/api/campaign/email_open",
];

export const isFreeRoute = (path) => {
    if (!path) return false;
    for (let i = 0; i < FreeRoutes.length; i++) {
        if (path.startsWith(FreeRoutes[i])) {
            return true;
        }
    }
};
