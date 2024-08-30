
export const randData = () => {
    const id = 0;
    const temp = Math.floor(Math.random() * 40) + 1;
    const prec = Math.floor(Math.random() * 100) + 1;
    const light = Math.floor(Math.random() * 100) + 1;
    const now = new Date();
    const time = now.toLocaleTimeString();
    return { temp, prec, light, time };
}

