// Obtener referencias a elementos del DOM
const form = document.getElementById('noteForm');
const noteInput = document.getElementById('noteInput');
const notesContainer = document.getElementById('notesContainer');
const notification = document.getElementById('notification');
const editModal = document.getElementById('editModal');
const editTextarea = document.getElementById('editTextarea');
const saveEditBtn = document.getElementById('saveEdit');
const cancelEditBtn = document.getElementById('cancelEdit');

const colors = ['bg-yellow', 'bg-pink', 'bg-green', 'bg-blue', 'bg-orange'];

// Variable para almacenar el elemento actual que se está editando
let currentNoteElement = null;

// Evento para agregar una nota nueva
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = noteInput.value.trim();
  if (text !== '') {
    addNote(text);
    noteInput.value = '';
    showNotification('Nota agregada');
  }
});

// Función para agregar una nota al contenedor
function addNote(text) {
  const note = document.createElement('div');
  note.classList.add('note', colors[Math.floor(Math.random() * colors.length)]);

  // Contenido HTML de la nota
  note.innerHTML = `
    <div class="actions">
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    </div>
    <div class="content">${text}</div>
  `;

  // Agrega eventos a los botones después de crear la nota
  const editBtn = note.querySelector('.edit-btn');
  const deleteBtn = note.querySelector('.delete-btn');

  editBtn.addEventListener('click', () => openEditModal(note));
  deleteBtn.addEventListener('click', () => deleteNote(note));

  // Añadir la nota al contenedor
  notesContainer.appendChild(note);
}

// Función para mostrar notificación flotante
function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 2000);
}

// Función para eliminar una nota
function deleteNote(noteElement) {
  noteElement.remove();
  showNotification('Nota eliminada');
}

// Función para abrir el modal y editar una nota
function openEditModal(noteElement) {
  const contentDiv = noteElement.querySelector('.content');

  // Guardamos el elemento que será editado
  currentNoteElement = contentDiv;

  // Colocamos su texto actual en el textarea
  editTextarea.value = contentDiv.textContent;

  // Mostramos el modal
  editModal.classList.remove('hidden');
}

// Guardar cambios desde el modal
saveEditBtn.addEventListener('click', () => {
  const newText = editTextarea.value.trim();

  if (currentNoteElement && newText !== '') {
    currentNoteElement.textContent = newText;
    showNotification('Nota editada');
  }

  closeModal();
});

// Cancelar edición desde el modal
cancelEditBtn.addEventListener('click', () => {
  closeModal();
});

// Función para cerrar el modal
function closeModal() {
  editModal.classList.add('hidden');
  currentNoteElement = null;
}

// MODO OSCURO CON GUARDADO EN LOCALSTORAGE

// Activar modo oscuro si estaba guardado antes
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Función del botón para cambiar entre claro y oscuro
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark-mode') ? 'dark' : 'light'
  );
}
