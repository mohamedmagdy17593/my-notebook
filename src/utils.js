import firebase, {db} from './firebase'

/**
 * firebase
 */

async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()
  try {
    return await firebase.auth().signInWithPopup(provider)
  } catch (error) {
    alert(error.message)
  }
}

function getNotes({uid, currentDate}) {
  return db
    .doc(`users/${uid}/notes/${currentDate.string}`)
    .get()
    .then(formatDoc)
}

function updateNotes({uid, currentDate, notes}) {
  notes = notes.map(normlizeNote)
  return db.doc(`users/${uid}/notes/${currentDate.string}`).set(
    {
      date: currentDate.date,
      notes,
    },
    {merge: true},
  )
}

/**
 * if document exist:
 *    update the existed array using firebase update
 * else:
 *    create new one with the our note
 */
async function MoveNoteTo({uid, toDate, note}) {
  note = normlizeNote(note)
  const {notes} = await getNotes({uid, currentDate: toDate})
  if (notes) {
    // append to the existed array
    return db
      .doc(`users/${uid}/notes/${toDate.string}`)
      .update({notes: firebase.firestore.FieldValue.arrayUnion(note)})
  } else {
    return updateNotes({uid, currentDate: toDate, notes: [note]})
  }
}

function normlizeNote({id, text, color = null}) {
  return {id, text, color}
}

function formatDoc(doc) {
  return {
    id: doc.id,
    ...doc.data(),
  }
}

/**
 * helpers
 */

function arrayMove(array, from, to) {
  array = [...array]
  array.splice(to, 0, array.splice(from, 1)[0])
  return array
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

export {
  arrayMove,
  formatEditorDocument,
  getNotes,
  loginWithGoogle,
  myDateFormat,
  updateNotes,
  MoveNoteTo,
}
