/**
 * Library Management System — script.js
 * All application logic: data, auth, CRUD, rendering, UI helpers.
 */

/* ═══════════════════════════════════════════════
   DATABASE (localStorage — mirrors MySQL schema)
   ═══════════════════════════════════════════════ */

const DB = {
  users:      JSON.parse(localStorage.getItem('lms_users')      || '[]'),
  books:      JSON.parse(localStorage.getItem('lms_books')      || '[]'),
  students:   JSON.parse(localStorage.getItem('lms_students')   || '[]'),
  staff:      JSON.parse(localStorage.getItem('lms_staff')      || '[]'),
  borrowings: JSON.parse(localStorage.getItem('lms_borrowings') || '[]'),
  nextId:     JSON.parse(localStorage.getItem('lms_nextId')     ||
              '{"books":1,"students":1,"staff":1,"borrowings":1,"users":1}'),
  session:    JSON.parse(localStorage.getItem('lms_session')    || 'null'),
};

/** Persist a table back to localStorage */
function save(key) {
  localStorage.setItem('lms_' + key, JSON.stringify(DB[key]));
}

/* ── Seed demo data (first run only) ── */
(function seedDemoData() {
  if (!DB.books.length) {
    DB.books = [
      { id:1, title:'To Kill a Mockingbird', author:'Harper Lee',          genre:'Fiction',     year:1960, available:true  },
      { id:2, title:'1984',                  author:'George Orwell',        genre:'Dystopian',   year:1949, available:false },
      { id:3, title:'The Great Gatsby',      author:'F. Scott Fitzgerald',  genre:'Classic',     year:1925, available:true  },
      { id:4, title:'Sapiens',               author:'Yuval Noah Harari',    genre:'Non-Fiction', year:2011, available:true  },
      { id:5, title:'Clean Code',            author:'Robert C. Martin',     genre:'Technology',  year:2008, available:false },
    ];
    DB.nextId.books = 6;
    save('books');
  }

  if (!DB.students.length) {
    DB.students = [
      { id:1, name:'Aisha Khan',  email:'aisha@uni.edu',  phone:'03001234567', course:'CS',   dept:'Engineering', date:'2024-09-01' },
      { id:2, name:'Bilal Ahmed', email:'bilal@uni.edu',  phone:'03111234567', course:'BBA',  dept:'Business',    date:'2024-09-03' },
      { id:3, name:'Sara Malik',  email:'sara@uni.edu',   phone:'03211234567', course:'MBBS', dept:'Medical',     date:'2024-09-05' },
    ];
    DB.nextId.students = 4;
    save('students');
  }

  if (!DB.staff.length) {
    DB.staff = [
      { id:1, name:'Dr. Naveed Akhtar', email:'naveed@library.com', phone:'03001111111', position:'Head Librarian', dept:'Administration'    },
      { id:2, name:'Farah Siddiqui',    email:'farah@library.com',  phone:'03002222222', position:'Cataloguer',     dept:'Technical Services' },
    ];
    DB.nextId.staff = 3;
    save('staff');
  }

  if (!DB.borrowings.length) {
    DB.borrowings = [
      { id:1, studentId:1, bookId:2, borrowDate:'2025-02-10', returnDate:'2025-02-25', status:'Borrowed',  fine:0,  fineStatus:'Unpaid' },
      { id:2, studentId:2, bookId:5, borrowDate:'2025-01-20', returnDate:'2025-02-05', status:'Returned',  fine:50, fineStatus:'Paid'   },
      { id:3, studentId:3, bookId:1, borrowDate:'2025-02-15', returnDate:'2025-03-01', status:'Borrowed',  fine:0,  fineStatus:'Unpaid' },
    ];
    DB.nextId.borrowings = 4;
    save('borrowings');
  }

  save('nextId');
})();


/* ═══════════════════════════════════════════════
   AUTHENTICATION
   ═══════════════════════════════════════════════ */

function doLogin() {
  const email = val('loginEmail');
  const pass  = val('loginPassword');

  if (!email || !pass) return toast('Please fill all fields', 'error');

  // Check against registered users or default admin
  let user = DB.users.find(u => u.email === email && u.password === pass);
  if (!user && email === 'admin@library.com' && pass === 'admin') {
    user = { id: 0, name: 'Admin', email };
  }

  if (!user) return toast('Invalid email or password', 'error');

  DB.session = user;
  localStorage.setItem('lms_session', JSON.stringify(user));
  enterApp(user);
}

function doSignup() {
  const name  = val('signupName');
  const email = val('signupEmail');
  const pass  = val('signupPassword');
  const conf  = val('signupConfirm');

  if (!name || !email || !pass) return toast('All fields are required', 'error');
  if (pass !== conf)            return toast('Passwords do not match', 'error');
  if (DB.users.find(u => u.email === email)) return toast('Email already registered', 'error');

  const user = { id: DB.nextId.users++, name, email, password: pass };
  DB.users.push(user);
  save('users');
  save('nextId');

  DB.session = user;
  localStorage.setItem('lms_session', JSON.stringify(user));
  enterApp(user);
}

function enterApp(user) {
  document.getElementById('userNameDisplay').textContent = user.name;
  document.getElementById('userAvatar').textContent = user.name[0].toUpperCase();
  showScreen('appScreen');
  updateStats();
  renderRecentBorrowings();
  renderBooks();
  renderStudents();
  renderStaff();
  renderBorrowings();
}

function doLogout() {
  DB.session = null;
  localStorage.removeItem('lms_session');
  showScreen('loginScreen');
}

// Auto-login if session exists
if (DB.session) enterApp(DB.session);


/* ═══════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════ */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showSection(name, el) {
  const sectionId = 'section' + name.charAt(0).toUpperCase() + name.slice(1);
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  closeSidebar();
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}


/* ═══════════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════════ */

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal when clicking the backdrop
document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});


/* ═══════════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════════ */

function updateStats() {
  document.getElementById('statBooks').textContent     = DB.books.length;
  document.getElementById('statStudents').textContent  = DB.students.length;
  document.getElementById('statAvailable').textContent = DB.books.filter(b => b.available).length;
  document.getElementById('statBorrowed').textContent  = DB.borrowings.filter(b => b.status === 'Borrowed').length;
}


/* ═══════════════════════════════════════════════
   BOOKS
   ═══════════════════════════════════════════════ */

function saveBook() {
  const id     = val('editBookId');
  const title  = val('bookTitle');
  const author = val('bookAuthor');

  if (!title || !author) return toast('Title and Author are required', 'error');

  const year = parseInt(val('bookYear')) || null;
  if (year && (year < 1000 || year > 9999)) return toast('Invalid year', 'error');

  const bookData = {
    title,
    author,
    genre:     val('bookGenre'),
    year,
    available: document.getElementById('bookAvailable').checked,
  };

  if (id) {
    const book = DB.books.find(b => b.id == id);
    if (book) Object.assign(book, bookData);
    toast('Book updated successfully!');
  } else {
    DB.books.push({ id: DB.nextId.books++, ...bookData });
    toast('Book added successfully!');
  }

  save('books');
  save('nextId');
  closeModal('addBookModal');
  clearBookForm();
  renderBooks();
  updateStats();
}

function editBook(id) {
  const b = DB.books.find(x => x.id === id);
  if (!b) return;

  document.getElementById('editBookId').value      = id;
  document.getElementById('bookTitle').value        = b.title;
  document.getElementById('bookAuthor').value       = b.author;
  document.getElementById('bookGenre').value        = b.genre || '';
  document.getElementById('bookYear').value         = b.year  || '';
  document.getElementById('bookAvailable').checked  = b.available;
  document.getElementById('addBookModalTitle').textContent = 'Edit Book';
  openModal('addBookModal');
}

function deleteBook(id) {
  document.getElementById('deleteMessage').textContent =
    'Are you sure you want to delete this book? Any related borrowing records will also be removed.';
  document.getElementById('deleteConfirmBtn').onclick = () => {
    DB.books      = DB.books.filter(b => b.id !== id);
    DB.borrowings = DB.borrowings.filter(b => b.bookId !== id);
    save('books');
    save('borrowings');
    renderBooks();
    renderBorrowings();
    updateStats();
    closeModal('deleteModal');
    toast('Book deleted', 'warning');
  };
  openModal('deleteModal');
}

function clearBookForm() {
  ['editBookId', 'bookTitle', 'bookAuthor', 'bookGenre', 'bookYear'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('bookAvailable').checked = true;
  document.getElementById('addBookModalTitle').textContent = 'Add New Book';
}

function renderBooks() {
  const query      = val('bookSearch').toLowerCase();
  const availFilter = val('bookFilterAvail');

  const list = DB.books.filter(b => {
    const matchText  = b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
    const matchAvail = availFilter === 'yes' ? b.available
                     : availFilter === 'no'  ? !b.available
                     : true;
    return matchText && matchAvail;
  });

  const tbody = document.getElementById('booksTable');

  if (!list.length) {
    tbody.innerHTML = emptyRow(7, '📚', 'No books found');
    return;
  }

  tbody.innerHTML = list.map(b => `
    <tr>
      <td class="id-cell">#${b.id}</td>
      <td><strong>${esc(b.title)}</strong></td>
      <td>${esc(b.author)}</td>
      <td>${esc(b.genre || '—')}</td>
      <td>${b.year || '—'}</td>
      <td><span class="badge ${b.available ? 'badge-green' : 'badge-red'}">${b.available ? 'Available' : 'Borrowed'}</span></td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="editBook(${b.id})" title="Edit">✏️</button>
        <button class="btn btn-danger btn-sm btn-icon"    onclick="deleteBook(${b.id})" title="Delete">🗑</button>
      </td>
    </tr>`).join('');
}


/* ═══════════════════════════════════════════════
   STUDENTS
   ═══════════════════════════════════════════════ */

function saveStudent() {
  const id    = val('editStudentId');
  const name  = val('studentName');
  const email = val('studentEmail');

  if (!name || !email)              return toast('Name and Email are required', 'error');
  if (!isValidEmail(email))         return toast('Invalid email address', 'error');

  const studentData = {
    name,
    email,
    phone:  val('studentPhone'),
    course: val('studentCourse'),
    dept:   val('studentDept'),
  };

  if (id) {
    const s = DB.students.find(x => x.id == id);
    if (s) Object.assign(s, studentData);
    toast('Student updated successfully!');
  } else {
    DB.students.push({ id: DB.nextId.students++, ...studentData, date: today() });
    toast('Student registered successfully!');
  }

  save('students');
  save('nextId');
  closeModal('addStudentModal');
  clearStudentForm();
  renderStudents();
  updateStats();
}

function editStudent(id) {
  const s = DB.students.find(x => x.id === id);
  if (!s) return;

  document.getElementById('editStudentId').value  = id;
  document.getElementById('studentName').value    = s.name;
  document.getElementById('studentEmail').value   = s.email;
  document.getElementById('studentPhone').value   = s.phone  || '';
  document.getElementById('studentCourse').value  = s.course || '';
  document.getElementById('studentDept').value    = s.dept   || '';
  document.getElementById('addStudentModalTitle').textContent = 'Edit Student';
  openModal('addStudentModal');
}

function deleteStudent(id) {
  document.getElementById('deleteMessage').textContent =
    'Delete this student? Their borrowing history will also be removed.';
  document.getElementById('deleteConfirmBtn').onclick = () => {
    DB.students   = DB.students.filter(s => s.id !== id);
    DB.borrowings = DB.borrowings.filter(b => b.studentId !== id);
    save('students');
    save('borrowings');
    renderStudents();
    renderBorrowings();
    updateStats();
    closeModal('deleteModal');
    toast('Student deleted', 'warning');
  };
  openModal('deleteModal');
}

function clearStudentForm() {
  ['editStudentId', 'studentName', 'studentEmail', 'studentPhone', 'studentCourse', 'studentDept'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('addStudentModalTitle').textContent = 'Add Student';
}

function renderStudents() {
  const query = val('studentSearch').toLowerCase();
  const list  = DB.students.filter(s =>
    s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query)
  );

  const tbody = document.getElementById('studentsTable');

  if (!list.length) {
    tbody.innerHTML = emptyRow(8, '🎓', 'No students found');
    return;
  }

  tbody.innerHTML = list.map(s => `
    <tr>
      <td class="id-cell">#${s.id}</td>
      <td><strong>${esc(s.name)}</strong></td>
      <td>${esc(s.email)}</td>
      <td>${esc(s.phone  || '—')}</td>
      <td><span class="badge badge-blue">${esc(s.course || '—')}</span></td>
      <td>${esc(s.dept   || '—')}</td>
      <td class="id-cell">${s.date || '—'}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="editStudent(${s.id})" title="Edit">✏️</button>
        <button class="btn btn-danger btn-sm btn-icon"    onclick="deleteStudent(${s.id})" title="Delete">🗑</button>
      </td>
    </tr>`).join('');
}


/* ═══════════════════════════════════════════════
   STAFF
   ═══════════════════════════════════════════════ */

function saveStaff() {
  const id    = val('editStaffId');
  const name  = val('staffName');
  const email = val('staffEmail');

  if (!name || !email)      return toast('Name and Email are required', 'error');
  if (!isValidEmail(email)) return toast('Invalid email address', 'error');

  const staffData = {
    name,
    email,
    phone:    val('staffPhone'),
    position: val('staffPosition'),
    dept:     val('staffDept'),
  };

  if (id) {
    const s = DB.staff.find(x => x.id == id);
    if (s) Object.assign(s, staffData);
    toast('Staff member updated!');
  } else {
    DB.staff.push({ id: DB.nextId.staff++, ...staffData });
    toast('Staff member added!');
  }

  save('staff');
  save('nextId');
  closeModal('addStaffModal');
  clearStaffForm();
  renderStaff();
}

function editStaff(id) {
  const s = DB.staff.find(x => x.id === id);
  if (!s) return;

  document.getElementById('editStaffId').value      = id;
  document.getElementById('staffName').value        = s.name;
  document.getElementById('staffEmail').value       = s.email;
  document.getElementById('staffPhone').value       = s.phone    || '';
  document.getElementById('staffPosition').value    = s.position || '';
  document.getElementById('staffDept').value        = s.dept     || '';
  document.getElementById('addStaffModalTitle').textContent = 'Edit Staff';
  openModal('addStaffModal');
}

function deleteStaff(id) {
  document.getElementById('deleteMessage').textContent =
    'Are you sure you want to delete this staff member?';
  document.getElementById('deleteConfirmBtn').onclick = () => {
    DB.staff = DB.staff.filter(s => s.id !== id);
    save('staff');
    renderStaff();
    closeModal('deleteModal');
    toast('Staff member deleted', 'warning');
  };
  openModal('deleteModal');
}

function clearStaffForm() {
  ['editStaffId', 'staffName', 'staffEmail', 'staffPhone', 'staffPosition', 'staffDept'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('addStaffModalTitle').textContent = 'Add Staff Member';
}

function renderStaff() {
  const query = val('staffSearch').toLowerCase();
  const list  = DB.staff.filter(s =>
    s.name.toLowerCase().includes(query) || (s.dept || '').toLowerCase().includes(query)
  );

  const tbody = document.getElementById('staffTable');

  if (!list.length) {
    tbody.innerHTML = emptyRow(7, '👤', 'No staff found');
    return;
  }

  tbody.innerHTML = list.map(s => `
    <tr>
      <td class="id-cell">#${s.id}</td>
      <td><strong>${esc(s.name)}</strong></td>
      <td>${esc(s.email)}</td>
      <td>${esc(s.phone    || '—')}</td>
      <td><span class="badge badge-gold">${esc(s.position || '—')}</span></td>
      <td>${esc(s.dept     || '—')}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="editStaff(${s.id})" title="Edit">✏️</button>
        <button class="btn btn-danger btn-sm btn-icon"    onclick="deleteStaff(${s.id})" title="Delete">🗑</button>
      </td>
    </tr>`).join('');
}


/* ═══════════════════════════════════════════════
   BORROWINGS
   ═══════════════════════════════════════════════ */

function saveBorrowing() {
  const id         = val('editBorrowId');
  const studentId  = parseInt(val('borrowStudentId'));
  const bookId     = parseInt(val('borrowBookId'));
  const borrowDate = val('borrowDate');
  const returnDate = val('returnDate');
  const status     = document.getElementById('borrowStatus').value;
  const fine       = parseFloat(val('fineAmount')) || 0;
  const fineStatus = document.getElementById('fineStatus').value;

  if (!studentId || !bookId || !borrowDate)
    return toast('Student ID, Book ID and Borrow Date are required', 'error');

  if (id) {
    // Update existing record
    const rec = DB.borrowings.find(x => x.id == id);
    if (rec) {
      // Update book availability if status changed
      const book = DB.books.find(b => b.id === rec.bookId);
      if (book) book.available = (status === 'Returned');
      Object.assign(rec, { studentId, bookId, borrowDate, returnDate, status, fine, fineStatus });
      save('books');
    }
    toast('Borrowing record updated!');
  } else {
    // New record
    const book = DB.books.find(b => b.id === bookId);
    if (!book)                               return toast('Book ID not found', 'error');
    if (!book.available && status === 'Borrowed') return toast('This book is not currently available', 'error');

    DB.borrowings.push({ id: DB.nextId.borrowings++, studentId, bookId, borrowDate, returnDate, status, fine, fineStatus });

    if (status === 'Borrowed') {
      book.available = false;
      save('books');
    }
    toast('Borrowing recorded successfully!');
  }

  save('borrowings');
  save('nextId');
  closeModal('addBorrowModal');
  clearBorrowForm();
  renderBorrowings();
  renderBooks();
  updateStats();
}

function editBorrowing(id) {
  const r = DB.borrowings.find(x => x.id === id);
  if (!r) return;

  document.getElementById('editBorrowId').value    = id;
  document.getElementById('borrowStudentId').value = r.studentId;
  document.getElementById('borrowBookId').value    = r.bookId;
  document.getElementById('borrowDate').value      = r.borrowDate;
  document.getElementById('returnDate').value      = r.returnDate || '';
  document.getElementById('borrowStatus').value    = r.status;
  document.getElementById('fineAmount').value      = r.fine;
  document.getElementById('fineStatus').value      = r.fineStatus;
  document.getElementById('addBorrowModalTitle').textContent = 'Edit Borrowing';
  openModal('addBorrowModal');
}

function deleteBorrowing(id) {
  document.getElementById('deleteMessage').textContent =
    'Delete this borrowing record? The book will be marked as available again.';
  document.getElementById('deleteConfirmBtn').onclick = () => {
    const rec = DB.borrowings.find(x => x.id === id);
    if (rec) {
      const book = DB.books.find(b => b.id === rec.bookId);
      if (book && rec.status === 'Borrowed') {
        book.available = true;
        save('books');
      }
    }
    DB.borrowings = DB.borrowings.filter(x => x.id !== id);
    save('borrowings');
    renderBorrowings();
    renderBooks();
    updateStats();
    closeModal('deleteModal');
    toast('Borrowing record deleted', 'warning');
  };
  openModal('deleteModal');
}

function clearBorrowForm() {
  ['editBorrowId', 'borrowStudentId', 'borrowBookId', 'borrowDate', 'returnDate'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('fineAmount').value       = '0';
  document.getElementById('borrowStatus').value     = 'Borrowed';
  document.getElementById('fineStatus').value       = 'Unpaid';
  document.getElementById('borrowDate').value       = today();
  document.getElementById('addBorrowModalTitle').textContent = 'Record Borrowing';
}

function renderBorrowings() {
  const query       = val('borrowSearch').toLowerCase();
  const statusFilter = val('borrowFilter');

  const list = DB.borrowings.filter(b => {
    const matchText   = String(b.studentId).includes(query) || String(b.bookId).includes(query);
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    return matchText && matchStatus;
  });

  const tbody = document.getElementById('borrowingsTable');

  if (!list.length) {
    tbody.innerHTML = emptyRow(9, '🔄', 'No borrowing records found');
    return;
  }

  tbody.innerHTML = list.map(b => `
    <tr>
      <td class="id-cell">#${b.id}</td>
      <td>${b.studentId}</td>
      <td>${b.bookId}</td>
      <td>${b.borrowDate}</td>
      <td>${b.returnDate || '—'}</td>
      <td><span class="badge ${b.status === 'Returned' ? 'badge-green' : 'badge-red'}">${b.status}</span></td>
      <td>${b.fine > 0 ? `<span class="fine-text">Rs.${b.fine}</span>` : '—'}</td>
      <td><span class="badge ${b.fineStatus === 'Paid' ? 'badge-green' : 'badge-gold'}">${b.fineStatus}</span></td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="editBorrowing(${b.id})" title="Edit">✏️</button>
        <button class="btn btn-danger btn-sm btn-icon"    onclick="deleteBorrowing(${b.id})" title="Delete">🗑</button>
      </td>
    </tr>`).join('');
}

function renderRecentBorrowings() {
  const recent = [...DB.borrowings].reverse().slice(0, 5);
  const tbody  = document.getElementById('recentBorrowings');

  if (!recent.length) {
    tbody.innerHTML = emptyRow(5, '🔄', 'No borrowing records yet');
    return;
  }

  tbody.innerHTML = recent.map(b => {
    const student = DB.students.find(s => s.id === b.studentId);
    const book    = DB.books.find(bk => bk.id === b.bookId);
    return `
      <tr>
        <td>${student ? esc(student.name) : `Student #${b.studentId}`}</td>
        <td>${book    ? esc(book.title)   : `Book #${b.bookId}`}</td>
        <td>${b.borrowDate}</td>
        <td>${b.returnDate || '—'}</td>
        <td><span class="badge ${b.status === 'Returned' ? 'badge-green' : 'badge-red'}">${b.status}</span></td>
      </tr>`;
  }).join('');
}


/* ═══════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════ */

/** Toggle password field visibility */
function togglePw(inputId, btn) {
  const field = document.getElementById(inputId);
  field.type  = field.type === 'password' ? 'text' : 'password';
  btn.textContent = field.type === 'password' ? '👁' : '🙈';
}

/** Show a toast notification */
function toast(message, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const el = document.createElement('div');
  el.className = `toast${type !== 'success' ? ' ' + type : ''}`;
  el.innerHTML = `<span>${icons[type] || '✅'}</span> ${message}`;
  document.getElementById('toastWrap').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/** Generate an empty-state table row */
function emptyRow(cols, icon, text) {
  return `<tr><td colspan="${cols}">
    <div class="empty-state"><div class="icon">${icon}</div><p>${text}</p></div>
  </td></tr>`;
}

/** Safely escape HTML to prevent XSS */
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Get trimmed value from an input by ID */
function val(id) {
  return document.getElementById(id).value.trim();
}

/** Return today's date as YYYY-MM-DD */
function today() {
  return new Date().toISOString().split('T')[0];
}

/** Basic email format validation */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Set default borrow date to today ── */
document.getElementById('borrowDate').value = today();
