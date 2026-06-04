-- ═══════════════════════════════════════════════════════════
--  Library Management System — Database Schema
--  MySQL / MariaDB compatible
--  Database: library_db  (matches DBConnect.java)
-- ═══════════════════════════════════════════════════════════

-- 1. Create and select the database
-- ─────────────────────────────────
CREATE DATABASE IF NOT EXISTS library_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE library_db;


-- ═══════════════════════════════════════════════════════════
--  TABLE: users
--  Stores login credentials for librarians / admins.
--  Used by LoginForm.java and SignupForm.java
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  user_id    INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,           -- store hashed in production!
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════
--  TABLE: books
--  Catalog of all library books.
--  Used by AddBook.java, ViewBooks.java, UpdateBook.java,
--          DeleteBook.java, BooksManagement.java
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS books (
  book_id        INT          NOT NULL AUTO_INCREMENT,
  title          VARCHAR(255) NOT NULL,
  author         VARCHAR(150) NOT NULL,
  genre          VARCHAR(100)     NULL,
  published_year YEAR             NULL,
  available      TINYINT(1)   NOT NULL DEFAULT 1,  -- 1 = available, 0 = borrowed

  PRIMARY KEY (book_id)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════
--  TABLE: students
--  Students who can borrow books.
--  Used by StudentForm.java
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS students (
  student_id        INT          NOT NULL AUTO_INCREMENT,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(150) NOT NULL UNIQUE,
  phone             VARCHAR(20)      NULL,
  course            VARCHAR(100)     NULL,
  department        VARCHAR(100)     NULL,
  registration_date DATE             NULL DEFAULT (CURDATE()),

  PRIMARY KEY (student_id)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════
--  TABLE: staff
--  Library staff members.
--  Used by StaffManagement.java
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS staff (
  staff_id   INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  phone      VARCHAR(20)      NULL,
  position   VARCHAR(100)     NULL,
  department VARCHAR(100)     NULL,

  PRIMARY KEY (staff_id)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════
--  TABLE: borrowings
--  Tracks every book borrow / return transaction.
--  Used by BorrowingManagement.java
--  Foreign keys reference books and students with cascade
--  delete (mirrors the transaction behaviour in DeleteBook.java)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS borrowings (
  borrow_id   INT           NOT NULL AUTO_INCREMENT,
  student_id  INT           NOT NULL,
  book_id     INT           NOT NULL,
  borrow_date DATE          NOT NULL,
  return_date DATE              NULL,
  status      ENUM('Borrowed','Returned') NOT NULL DEFAULT 'Borrowed',
  fine_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  fine_status ENUM('Paid','Unpaid')       NOT NULL DEFAULT 'Unpaid',

  PRIMARY KEY (borrow_id),

  CONSTRAINT fk_borrowings_student
    FOREIGN KEY (student_id) REFERENCES students (student_id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_borrowings_book
    FOREIGN KEY (book_id) REFERENCES books (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Default admin user
-- ═══════════════════════════════════════════════════════════
INSERT IGNORE INTO users (name, email, password)
VALUES ('Admin', 'admin@library.com', 'admin');
-- ⚠ Replace plain-text password with a bcrypt hash in production.


-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Sample books
-- ═══════════════════════════════════════════════════════════
INSERT IGNORE INTO books (book_id, title, author, genre, published_year, available) VALUES
  (1, 'To Kill a Mockingbird', 'Harper Lee',           'Fiction',     1960, 1),
  (2, '1984',                  'George Orwell',         'Dystopian',   1949, 0),
  (3, 'The Great Gatsby',      'F. Scott Fitzgerald',   'Classic',     1925, 1),
  (4, 'Sapiens',               'Yuval Noah Harari',     'Non-Fiction', 2011, 1),
  (5, 'Clean Code',            'Robert C. Martin',      'Technology',  2008, 0);


-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Sample students
-- ═══════════════════════════════════════════════════════════
INSERT IGNORE INTO students (student_id, name, email, phone, course, department, registration_date) VALUES
  (1, 'Aisha Khan',  'aisha@uni.edu', '03001234567', 'CS',   'Engineering', '2024-09-01'),
  (2, 'Bilal Ahmed', 'bilal@uni.edu', '03111234567', 'BBA',  'Business',    '2024-09-03'),
  (3, 'Sara Malik',  'sara@uni.edu',  '03211234567', 'MBBS', 'Medical',     '2024-09-05');


-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Sample staff
-- ═══════════════════════════════════════════════════════════
INSERT IGNORE INTO staff (staff_id, name, email, phone, position, department) VALUES
  (1, 'Dr. Naveed Akhtar', 'naveed@library.com', '03001111111', 'Head Librarian', 'Administration'),
  (2, 'Farah Siddiqui',    'farah@library.com',  '03002222222', 'Cataloguer',     'Technical Services');


-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Sample borrowing records
-- ═══════════════════════════════════════════════════════════
INSERT IGNORE INTO borrowings (borrow_id, student_id, book_id, borrow_date, return_date, status, fine_amount, fine_status) VALUES
  (1, 1, 2, '2025-02-10', '2025-02-25', 'Borrowed', 0.00,  'Unpaid'),
  (2, 2, 5, '2025-01-20', '2025-02-05', 'Returned', 50.00, 'Paid'),
  (3, 3, 1, '2025-02-15', '2025-03-01', 'Borrowed', 0.00,  'Unpaid');


-- ═══════════════════════════════════════════════════════════
--  USEFUL VIEWS (optional helpers)
-- ═══════════════════════════════════════════════════════════

-- Active borrows with student and book names
CREATE OR REPLACE VIEW v_active_borrows AS
SELECT
  br.borrow_id,
  st.name         AS student_name,
  bk.title        AS book_title,
  br.borrow_date,
  br.return_date,
  br.status,
  br.fine_amount,
  br.fine_status
FROM borrowings br
JOIN students st ON br.student_id = st.student_id
JOIN books    bk ON br.book_id    = bk.book_id
WHERE br.status = 'Borrowed';

-- Books currently available
CREATE OR REPLACE VIEW v_available_books AS
SELECT book_id, title, author, genre, published_year
FROM books
WHERE available = 1;

-- Students with unpaid fines
CREATE OR REPLACE VIEW v_unpaid_fines AS
SELECT
  br.borrow_id,
  st.name        AS student_name,
  bk.title       AS book_title,
  br.fine_amount,
  br.borrow_date
FROM borrowings br
JOIN students st ON br.student_id = st.student_id
JOIN books    bk ON br.book_id    = bk.book_id
WHERE br.fine_status = 'Unpaid'
  AND br.fine_amount  > 0;
