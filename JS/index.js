
import { Todos } from "./class/Todos.js"

// index.js
const BACKEND_ROOT_URL = 'http://localhost:3001'; // Ensure this matches your backend URL
const todos = new Todos(BACKEND_ROOT_URL)
const list = document.querySelector('ul');
const input = document.querySelector('input');

input.disabled = true;

const renderTask = (task) => {
    const li = document.createElement('li');
    const span = li.appendChild(document.createElement('span'));
    span.textContent = task.description
    li.setAttribute('class', 'list-group-item');
    li.setAttribute('data-key', task.id.toString());
    
    const deleteButton = li.appendChild(document.createElement('button'));
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.setAttribute('style', 'float:right')
    deleteButton.addEventListener('click', () => {
        todos.removeTask(task.id).then((removed_id) => {
            const li_to_remove = document.querySelector(`[data-key='${removed_id}']`);
            if (li_to_remove) {
                list.removeChild(li_to_remove);
            }
        }).catch((error) => {
            console.error(error); // Log errors properly
            alert(error.message);
        });
    });
    
    


    list.appendChild(li);
};

const getTasks = () => {
    fetch(`${BACKEND_ROOT_URL}`)
    .then(response => response.json())
    .then(tasks => {
        tasks.forEach(task => {
            renderTask(task);
        });
        input.disabled = false;
    })
    .catch(error => {
        console.error(error); // Log errors properly
        alert(error);
    });
};

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            saveTask(task);
            input.value = ''; // Reset input value after successful task addition
        }
    }
});

const saveTask = async (task) => {
    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: task })
        });
        if (!response.ok) {
            throw new Error('Failed to save task');
        }
        const data = await response.json();
        renderTask(data);
    } catch (error) {
        console.error(error); // Log errors properly
        alert(error);
    }
};

getTasks(); 
