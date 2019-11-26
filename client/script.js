$(document).ready(() => buildTable());

async function buildTable() {
  try {
    const res = await API.get('events');

    if (res && res.data) {
      const table = document.getElementById('events-table');
      const header = document.getElementById('header');
      table.innerHTML = '';
      table.appendChild(header);

      if (table) {
        res.data.forEach(item => {
          const tr = document.createElement('tr');
          const name = document.createElement('td');
          const description = document.createElement('td');
          const dateEvent = document.createElement('td');
          const buttonContainer = document.createElement('td');
          const button = document.createElement('button');

          name.innerHTML = item.name;
          description.innerHTML = item.description;
          dateEvent.innerHTML = formatDate(new Date(item.dt_event));
          button.innerHTML = 'Inscrever';

          button.addEventListener('click', () => {
            register(item);
          });

          buttonContainer.appendChild(button);

          tr.appendChild(name);
          tr.appendChild(description);
          tr.appendChild(dateEvent);
          tr.appendChild(buttonContainer);

          table.appendChild(tr);
        });
      }
    }
  } catch (err) {
    if (err.isAxiosError) {
      let message = 'Não foi possivel buscar os eventos';

      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }

      alert(message);
    }
  }
}

async function register(event) {
  const res = await API.post('register/' + event.id);

  if (res && res.data) {
    buildTable();
    alert('Inscrição no evento ' + event.name + ' realizada com sucesso!');
  } else {
    alert('Falha na inscrição!');
  }
}

function goToRegistrations() {
  window.location.href = '/registration';
}
