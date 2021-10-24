
export function getUsers () {
  return fetch('/api/users')
    .then(response => {return response.json()})
    .then(data => {return data.users})
    .catch(() => console.log('error'))
}
