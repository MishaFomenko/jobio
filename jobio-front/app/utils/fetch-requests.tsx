//18.218.30.148
const customGetter = async (reqPath: string, queryString: string) => {
    return fetch(`http://18.218.30.148:3001/${reqPath}?${queryString}`, {
        // return fetch(`http://localhost:3001/${reqPath}?${queryString}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (jsonData) => {
            const data = await jsonData.json();
            return data.rows
        })
}

const customPoster = async (reqPath: string, body: object) => {
    return fetch(`http://18.218.30.148:3001/${reqPath}`, {
        // return fetch(`http://localhost:3001/${reqPath}`, {

        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}

export { customGetter, customPoster };