const symbols = ['🐶', '🐱', '🐭', '🦊', '🐻', '🐼', '🐨', '🐯'];

export const generateCards = () => {
    const duplicated = [...symbols, ...symbols]; // två av varje
    return duplicated
        .map((symbol) => ({ id: Math.random(), symbol, matched: false }))
        .sort(() => Math.random() - 0.5); // blanda
};
