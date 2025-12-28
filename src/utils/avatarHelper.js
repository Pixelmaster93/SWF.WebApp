export const getAvatarUrl = (code) => {
    // Se l'avatar è null, undefined o vuoto, ritorna quello di default
    if (!code) return '/avatars/POOP_1.png';
    return `/avatars/${code}.png`;
};
