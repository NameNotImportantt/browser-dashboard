export function weatherCodeToEmoji(code: number) {
    if (code === 0) {return '☀';}

    if (code <= 3) {return '⛅';}

    if (code <= 48) {return '🌫';}

    if (code <= 67) {return '🌧';}

    if (code <= 77) {return '❄';}

    if (code <= 82) {return '🌧';}

    if (code <= 99) {return '⛈';}

    return '🌡';
}
