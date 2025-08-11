import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export const getTakeUntilDestroyed = () => {
    const destroyRef = inject(DestroyRef);
    return <T>() => takeUntilDestroyed<T>(destroyRef);
}

export const shuffleArray = (arr: string[]): string[] => {
    const mewArr = [...arr];
    for (let i = mewArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mewArr[i], mewArr[j]] = [mewArr[j], mewArr[i]];
    }
    return mewArr;
}