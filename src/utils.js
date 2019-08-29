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

export {formatEditorDocument, loginWithGoogle}
