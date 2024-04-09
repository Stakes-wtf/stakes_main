

function defaultFormat (number: number) {
    return new Intl.NumberFormat("en-US")
        .format(Math.round(number))
        .replace(/\,/g, ' ')
        .replace(/\./g, ', ')
}

function shortFormat (number: number, minCroppedValue: number = 999_999) {
    if (number > minCroppedValue) return new Intl.NumberFormat("en-US", { notation: 'compact', maximumFractionDigits: 1 })
        .format(number)
        .replace(/\./g, ',')
    return new Intl.NumberFormat("en-US")
        .format(Math.round(number))
        .replace(/\,/g, ' ')
        .replace(/\./g, ', ')
}


type ReturnT<T extends number | null | undefined> = T extends number ? string : T extends null | undefined ? null : (null | string)

export class NumberFormatter {
    public static format <T extends number | null | undefined> (number: T, format: "short" | "default" = "default", minCroppedValue?: number) {
        if (number === undefined || number === null) return null as ReturnT<T>
        
        if (format === "short") return shortFormat(number, minCroppedValue) as ReturnT<T>
        return defaultFormat(number) as ReturnT<T>
    }
}