export const classBuilder: (
    classes: { [key: string]: string }, 
    conditions: (string | { [key: string] : boolean | undefined } | undefined)[],
    rest?: string
) => string = (classes, conditions, rest) => {

    const matching = conditions.filter(condition => {
        if (typeof condition === 'object') return !!condition[Object.keys(condition)[0]]
        else return !!condition
    }) as (string | { [key: string] : boolean })[]
    
    const classNames = matching.map(condition => {
        if (typeof condition === "object") return Object.keys(condition)[0]
        else return condition
    })

    const result = classNames.map(className => classes[className] || null).filter(v => v !== null) as string[]
    if (rest) result.push(rest)

    return result.join(' ')
}

export const classJoiner: (...classes: (string | undefined)[]) => string = (...classes) => {
    return classes.filter(c => c != undefined).join(' ')
}