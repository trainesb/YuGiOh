export function getCardsBySetCode (code) {
  return fetch('/api/set/cards/' + code)
    .then(response => {return response.json()})
    .then(data => {return data.cards})
    .catch(() => getSetByCode())
}

export function getSetByCode (code) {
  return fetch('/api/set/' + code)
    .then(response => {return response.json()})
    .then(data => {return data.set})
    .catch(() => getSetByCode())
}
