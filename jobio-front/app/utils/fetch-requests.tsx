//18.218.30.148
const customGetter = async (idToken: string, reqPath: string, queryString: string): Promise<any> => {
    return fetch(`http://18.218.30.148:3001/${reqPath}?${queryString}`, {
        // return fetch(`http://localhost:3001/${reqPath}?${queryString}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
    })
        .then(async (jsonData) => {
            if (!jsonData.ok) {
                const data = await jsonData.json();
                throw new Error(data.message);
            } else {
                const data = await jsonData.json();
                return data.rows

            }
        })
        .catch(error => {
            console.log(`GET request to ${reqPath} failed with an error: `, error)
        })
}

const customPoster = async (idToken: string, reqPath: string, body: object): Promise<any> => {
    return fetch(`http://18.218.30.148:3001/${reqPath}`, {
        // return fetch(`http://localhost:3001/${reqPath}`, {

        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(body),
    })
        .then(async (jsonData) => {
            if (!jsonData.ok) {
                const data = await jsonData.json();
                throw new Error(data.message);
            } else {
                const data = await jsonData.json();
                return data
            }
        })
        .catch(error => {
            console.log(`POST request to ${reqPath} failed with an error: `, error)
        })
}

const customDeleter = async (idToken: string, reqPath: string, queryString: string): Promise<any> => {
    return fetch(`http://18.218.30.148:3001/${reqPath}?${queryString}`, {
        // return fetch(`http://localhost:3001/${reqPath}?${queryString}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        }
    })
        .then(async (jsonData) => {
            if (!jsonData.ok) {
                const data = await jsonData.json();
                throw new Error(data.message);
            } else {
                const data = await jsonData.json();
                return data
            }
        })
        .catch(error => {
            console.log(`DELETE request to ${reqPath} failed with an error: `, error)
        })
}

const customFilterOnEvent = (toFilter: any, filterBy: any, event: any): Array<any> => {
    return toFilter.filter((element: any) => element[filterBy].toLowerCase().includes(event.target.value?.toLowerCase()))
}

export { customGetter, customPoster, customFilterOnEvent, customDeleter };