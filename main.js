// membuat variabel
const books = [];
const RENDER_EVENT = 'render-bookself';
const SAVE_EVENT = 'saved-bookself';
const STORAGE_EVENT = 'BOOKSELF-APPS';

// menjalankan perintah
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    inputSection();
  });
  loadDataStorage();
});
// fungsi untuk save localstorage
function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_EVENT, parsed);
  document.dispatchEvent(new Event(SAVE_EVENT));
}
// fungsi untuk load data
function loadDataStorage() {
  const sambungData = localStorage.getItem(STORAGE_EVENT);
  let data = JSON.parse(sambungData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
// fungsi untuk menambhakan buku
function inputSection() {
  const judulBook = document.getElementById('inputBookTitle').value;
  const penulisBook = document.getElementById('inputBookAuthor').value;
  const tahunBook = document.getElementById('inputBookYear').value;
  const isCompleted = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookSelfObject = generateBookObject(generatedID, judulBook, penulisBook, tahunBook, isCompleted);
  books.push(bookSelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}
// fungsi mendapatkan id buku
function generateId() {
  return +new Date();
}
// fungsi untuk menampung elemen
function generateBookObject(id, judulBook, penulisBook, tahunBook, isCompleted) {
  return {
    id,
    judulBook,
    penulisBook,
    tahunBook,
    isCompleted,
  };
}

// membuat fungsi untuk belum selesai dibaca
function makeBook(bookSelfObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookSelfObject.judulBook;
  const textPenulis = document.createElement('p');
  textPenulis.innerText = 'Penulis : ' + ' ' + bookSelfObject.penulisBook;
  const textTahun = document.createElement('p');
  textTahun.innerText = 'Tahun' + ' ' + bookSelfObject.tahunBook;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textPenulis, textTahun);

  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(textContainer);
  container.setAttribute('id', 'book-${bookSelfObject.id}');

  if (bookSelfObject.isCompleted) {
    const notComplete = document.createElement('button');
    notComplete.classList.add('green');
    notComplete.innerText = 'Belum Selesai Dibaca';
    notComplete.addEventListener('click', function () {
      undoTaskFromComplete(bookSelfObject.id);
    });

    const deleteBuku = document.createElement('button');
    deleteBuku.classList.add('red');
    deleteBuku.innerText = 'Hapus Buku';
    deleteBuku.addEventListener('click', function () {
      removeTaskFromComplete(bookSelfObject.id);
    });

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(notComplete, deleteBuku);

    container.append(action);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.innerText = 'Selesai Dibaca';
    checkButton.addEventListener('click', function () {
      addTaskToComplete(bookSelfObject.id);
    });
    const deleteBuku = document.createElement('button');
    deleteBuku.classList.add('red');
    deleteBuku.innerText = 'Hapus Buku';
    deleteBuku.addEventListener('click', function () {
      removeTaskFromComplete(bookSelfObject.id);
    });
    const action = document.createElement('div');
    action.classList.add('action');
    action.append(checkButton, deleteBuku);

    container.append(action);
  }

  return container;
}

// membuat fungsi untuk button
function addTaskToComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// membuat fungsi mencaari id
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
// membuat fungsi untuk menghapus buku
function removeTaskFromComplete(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// membuat fungsi untuk belum selesai
function undoTaskFromComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// membuat fungsi findbox index
function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

// untuk save data
document.addEventListener(SAVE_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_EVENT));
});
// untuk render
document.addEventListener(RENDER_EVENT, function () {
  // console.log(incompleteBookshelfList);
  const uncompletedBook = document.getElementById('incompleteBookshelfList');
  uncompletedBook.innerHTML = '';
  const completedBook = document.getElementById('completeBookshelfList');
  completedBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    // uncompletedBook.append(bookElement);
    if (bookItem.isCompleted == true) {
      completedBook.append(bookElement);
    } else {
      uncompletedBook.append(bookElement);
    }
  }
});
