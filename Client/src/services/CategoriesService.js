export function getCategories () {
  return fetch('/api/catgeories')
    .then(response => {return response.json()})
    .then(data => {return data.categories})
    .catch(() => getCategories())
}

export function getSetsByCategoryName (name) {
  const headers = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name: name.replace(/-/g, ' ') })
  }

  return fetch('/api/category/sets', headers)
    .then(response => { return response.json() })
    .then(data => { return data.sets })
    .catch(() => getSetsByCategoryName(name))
}
