//18.218.30.148
const customGetter = async (idToken: string, reqPath: string, queryString: string) => {
    return fetch(`http://18.218.30.148:3001/${reqPath}?${queryString}`, {
        // return fetch(`http://localhost:3001/${reqPath}?${queryString}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
    })
        .then(async (jsonData) => {
            const data = await jsonData.json();
            return data.rows
        })
}

const customPoster = async (idToken: string, reqPath: string, body: object) => {
    return fetch(`http://18.218.30.148:3001/${reqPath}`, {
        // return fetch(`http://localhost:3001/${reqPath}`, {

        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(body),
    })
}

const customFilterOnEvent = (toFilter: any, filterBy: any, event: any) => {
    return toFilter.filter((element: any) => element[filterBy].toLowerCase().includes(event.target.value?.toLowerCase()))
}

export { customGetter, customPoster, customFilterOnEvent };