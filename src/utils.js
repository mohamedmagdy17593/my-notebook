import firebase from './firebase'

async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()
  try {
    return await firebase.auth().signInWithPopup(provider)
  } catch (error) {
    alert(error.message)
  }
}

function formatEditorDocument(value) {
  if (/<br>/.test(value)) {
    return value
  }

  const tagsReg = /<(\w|\/|><)*>/gm
  const valueString = value.replace(tagsReg, '\n').trim()
  const [header, text, ...list] = valueString.split('\n')

  let formatedDoc = ''

  if (header) {
    formatedDoc += `<h1>${header}</h1>`
  }

  if (text) {
    formatedDoc += `<p>${text}</p>`
  }

  if (list.length > 0) {
    formatedDoc += `<ul>${list.map(s => `<li>${s}</li>`).join('')}</ul>`
  }

  return formatedDoc
}

function myDateFormat(dateArg) {
  const date =
    dateArg instanceof Date
      ? dateArg
      : new Date(`${dateArg.year}-${dateArg.month}-${dateArg.day}`)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return {
    day,
    month,
    year,
    date,
    string: `${day}/${month}/${year}`,
  }
}

export {formatEditorDocument, loginWithGoogle, myDateFormat}
