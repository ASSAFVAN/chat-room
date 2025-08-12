export const shuffleArray = (arr: string[]): string[] => {
    const mewArr = [...arr];
    for (let i = mewArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mewArr[i], mewArr[j]] = [mewArr[j], mewArr[i]];
    }
    return mewArr;
}