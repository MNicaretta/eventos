$(document).ready(() => buildTable());

async function buildTable() {
  try {
    const res = await API.get('registrations');

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
          const dateRegister = document.createElement('td');
          const buttonContainer = document.createElement('td');
          const button = document.createElement('button');

          const state = item.state;

          name.innerHTML = item.name;
          description.innerHTML = item.description;
          dateEvent.innerHTML = formatDate(new Date(item.dt_event));
          dateRegister.innerHTML = formatDate(new Date(item.dt_registration));
          button.innerHTML = state == 1 ? 'Cancelar' : 'Gerar certificado';

          button.addEventListener('click', () => {
            if (state == 1) {
              cancel(item);
            } else {
              certificate(item);
            }
          });

          buttonContainer.appendChild(button);

          tr.appendChild(name);
          tr.appendChild(description);
          tr.appendChild(dateEvent);
          tr.appendChild(dateRegister);
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

async function cancel(event) {
  const res = await API.delete('cancel/' + event.id);

  if (res && res.data) {
    buildTable();
    alert('Cancelamento do evento ' + event.name + ' realizada com sucesso!');
  } else {
    alert('Falha na inscrição!');
  }
}

async function certificate(event) {
  const res = await API.get('certificate/' + event.id);

  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf;charset=UTF-8', encoding: 'UTF-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'file.pdf'); //or any other extension
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function goToEvents() {
  window.location.href = '../';
}
