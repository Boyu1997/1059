const proxy = "https://us-central1-boyu-io.cloudfunctions.net/cors-proxy"
const api = "https://seminar.minerva.kgi.edu/api/v1"

const headers = {
  'Accept': '*',
}

export const getUserId = (token) =>
  fetch(`${proxy}?url=${api}/outcome-index-item?hc-item=3634&token=Token ${token}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'text/html'
    }
  }).then(res => res.json())


  export const getUserInfo = (id, token) =>
    fetch(`${proxy}?url=${api}/users/${id}&token=Token ${token}`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'text/html'
      }
    }).then(res => res.json())
