export function getRandomNumber(from: number, to: number) {
    return Math.floor(from + Math.random() * (to - from));
}

export function getRandomChunks(data: string): string[] {
    const arr: string[] = [];
    while (data) {
        const chunk = getRandomNumber(20, 50);
        if (chunk > data.length) {
            arr.push(data);
            return arr;
        }
        arr.push(data.slice(0, chunk));
        data = data.slice(chunk);
    }
    return arr;    
}