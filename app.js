//  Book class: Reprensents a book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: Handelling the UI

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addToBookList(book));
  }

  static addToBookList(book) {
    const list = document.querySelector(".book-list");
    const row = document.createElement("tr");

    row.innerHTML = `<th scope="col">${book.title}</th>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteItem(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector(".title").value = "";
    document.querySelector(".author").value = "";
    document.querySelector(".isbn").value = "";
  }

  static showAlert(messege, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(messege));
    const container = document.querySelector(".form-container");
    const form = document.querySelector(".form");
    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

// Store class: Handle Local Storage

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBooks(book) {
    const books = this.getBooks();

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBooks(isbn) {
    const books = this.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Book

window.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a book

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();

  //  Getting the values
  const title = document.querySelector(".title").value;
  const author = document.querySelector(".author").value;
  const isbn = document.querySelector(".isbn").value;

  // isntantiating new object

  const book = new Book(title, author, isbn);

  // validation

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in the fields", "danger");
  } else {
    // adding the book to the UI

    UI.addToBookList(book);

    // adding book to the localstorage

    Store.addBooks(book);

    // showing the succeess alert

    UI.showAlert("Book added", "success");

    // clearing the fields
    UI.clearFields();
  }
});

// Event: Remove a book

document.querySelector(".book-list").addEventListener("click", (e) => {
  UI.deleteItem(e.target);

  // removig from the local storage

  Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
  console.log(e.target.parentElement.previousElementSibling.textContent);

  // showing alert

  UI.showAlert("Book removed", "success");
});
