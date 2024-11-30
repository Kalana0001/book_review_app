# Book Review API

This is a simple API built using **Express.js** and **MySQL** for managing users, books, and reviews. The API allows users to sign up, sign in, view books, add reviews, and interact with book-related data.

## Features
- **User Registration** and **Login** functionality.
- Ability to **view books** and their details.
- **Submit reviews** for books.
- Each review includes a **rating** and **comment**.

## Table Structure

The following tables are used in the MySQL database:

1. **Users Table** (`users`):
   - `id`: INT (auto-increment, primary key)
   - `username`: VARCHAR(255) (unique, not null)
   - `email`: VARCHAR(255) (unique, not null)
   - `password`: VARCHAR(255) (not null)
   - `created_at`: TIMESTAMP (default: current timestamp)

2. **Books Table** (`books`):
   - `id`: INT (auto-increment, primary key)
   - `title`: VARCHAR(255) (not null)
   - `author`: VARCHAR(255)
   - `genre`: VARCHAR(100)
   - `image`: VARCHAR(255) (not null)
   - `published_date`: DATE
   - `description`: TEXT

3. **Reviews Table** (`reviews`):
   - `id`: INT (auto-increment, primary key)
   - `book_id`: INT (foreign key referencing `books(id)`)
   - `user_id`: INT (foreign key referencing `users(id)`)
   - `rating`: INT (1-5)
   - `comment`: TEXT
   - `created_at`: TIMESTAMP (default: current timestamp)

## Setup and Installation

### Prerequisites
- **Node.js** installed (v16 or higher recommended).
- **MySQL** installed and running.

### Steps to run the project:

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install dependencies:**

   Inside the project directory, run:

   ```bash
   npm install
   ```

3. **Set up the database:**

   Create a MySQL database named `book_app` and execute the following SQL queries to create the necessary tables:

   ```sql
   CREATE TABLE books (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255),
       author VARCHAR(255),
       genre VARCHAR(100),
       image VARCHAR(255) NOT NULL,
       published_date DATE,
       description TEXT
   );

   CREATE TABLE reviews (
     id INT AUTO_INCREMENT PRIMARY KEY,
     book_id INT,
     user_id INT,
     rating INT,
     comment TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (book_id) REFERENCES books(id),
     FOREIGN KEY (user_id) REFERENCES users(id) 
   );

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Configure MySQL connection:**

   Update the `db` configuration in the `server.js` file to match your MySQL credentials:

   ```js
   const db = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "your_mysql_password",
     database: "book_app",
   });
   ```

5. **Run the server:**

   Once everything is set up, start the server:

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:4000`.

## API Endpoints

### 1. **POST** `/api/signup`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

### 2. **POST** `/api/signin`
- **Description**: Sign in an existing user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

### 3. **GET** `/api/books`
- **Description**: Retrieve a list of all books.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Book Title",
      "author": "Author Name",
      "genre": "Genre",
      "image": "book_image_url",
      "published_date": "2024-01-01",
      "description": "Description of the book."
    }
  ]
  ```

### 4. **GET** `/api/reviews`
- **Description**: Get all reviews for books.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Book Title",
      "comment": "Great book!",
      "rating": 5
    }
  ]
  ```

### 5. **POST** `/api/review`
- **Description**: Add a review for a book.
- **Request Body**:
  ```json
  {
    "book_id": 1,
    "user_id": 1,
    "rating": 5,
    "comment": "Excellent book!"
  }
  ```

## Testing

You can use tools like **Postman** or **cURL** to test the API endpoints.

---

## Notes
- Ensure that the MySQL database is running before starting the server.
- Passwords are stored as plain text. In a real-world application, you should hash passwords before storing them (e.g., using **bcrypt**).
  
