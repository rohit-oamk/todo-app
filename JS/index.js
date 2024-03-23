const BACKEND_ROOT_URL = 'http://localhost:3001'

const list = document.querySelector('ul');
const input = document.querySelector('input');

input.disabled = true
const renderTask = (description) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    li.innerHTML = description
    list.append(li)
}

const getTasks = async () => {
    try {
        const response = await fetch(BACKEND_ROOT_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch tasks: ' + response.statusText);
        }

        const json = await response.json();

        if (!Array.isArray(json)) {
            throw new Error('Response is not an array');
        }

        json.forEach(task => {
            renderTask(task.description);
        });

        input.disabled = false;
    } catch (error) {
        console.error("Error retrieving tasks: ", error);
        alert("Error retrieving tasks: " + error.message);
    }
};

const saveTask = async (task) => {
    try {
    const json = JSON.stringify({description: task})
    const response = await fetch (BACKEND_ROOT_URL + '/new',{
    method: 'post',
    headers: {
    'Content-Type':'application/json'
    },
    body: json
    })
    return response.json()
    } catch (error) {
    alert("Error saving task " + error.message)
    }
    }

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            saveTask(task).then((json)=> {

                renderTask(task)
                input.value = '';

            })
        }
    }
})

getTasks();