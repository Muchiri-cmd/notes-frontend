import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}
const create = newObject => {
    const req = axios.post(baseUrl,newObject)
    return req.then(res => res.data)
}

const update = (id,newObject) => {
    const req = axios.put(`${baseUrl}/${id}`,newObject)
    return req.then(res=> res.data)
}

export default { getAll,create,update}