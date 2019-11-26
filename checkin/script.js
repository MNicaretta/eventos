$(document).ready(() => {
  $('#email-button').on('click', function() {
    const email = $('#email-input').val();
    const emails = localStorage.getItem('emails') ? JSON.parse(localStorage.getItem('emails')) : [];

    if (!emails.filter(e => e.email === email).length) {
      emails.push({
        email: email,
        synched: false
      });
    }

    localStorage.setItem('emails', JSON.stringify(emails));
    $('#email-input').val('');
  });
  $('#synch-button').on('click', async function() {
    const emails = localStorage.getItem('emails') ? JSON.parse(localStorage.getItem('emails')) : [];

    const data = [];
    emails.forEach(e => {
      if (!e.synched) {
        data.push(e.email);
      }
    });

    try {
      const res = await API.post('checkin/' + localStorage.getItem('eventId'), data);

      if (res) {
        emails.forEach(e => {
          e.synched = true;
        });
        localStorage.setItem('emails', JSON.stringify(emails));
      }
    } catch (err) {
      if (err.isAxiosError) {
        let message = 'Não foi possivel realizar a sincronização';

        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        }

        alert(message);
      } else {
        console.error(err);
      }
    }
  });
  refresh();
});

function refresh() {
  const eventId = localStorage.getItem('eventId');

  if (eventId) {
    $('#events-table').hide();
    $('#email-container').show();
  } else {
    buildTable();
    $('#events-table').show();
    $('#email-container').hide();
  }
}

async function buildTable() {
  try {
    //const res = await API.get('Allevents');
    const res = {
      data: [
        {
          id: 1,
          name: 'Evento 1',
          dt_event: '2019-11-25'
        },
        {
          id: 2,
          name: 'Evento 2',
          dt_event: '2019-11-25'
        },
        {
          id: 3,
          name: 'Evento 3',
          dt_event: '2019-11-25'
        },
        {
          id: 4,
          name: 'Evento 4',
          dt_event: '2019-11-25'
        }
      ]
    };
    if (res && res.data) {
      const table = document.getElementById('events-table');
      const header = document.getElementById('header');
      table.innerHTML = '';
      table.appendChild(header);

      if (table) {
        res.data.forEach(item => {
          const tr = document.createElement('tr');
          const name = document.createElement('td');
          const dateEvent = document.createElement('td');
          const buttonContainer = document.createElement('td');
          const button = document.createElement('button');

          name.innerHTML = item.name;
          dateEvent.innerHTML = formatDate(new Date(item.dt_event));
          button.innerHTML = 'Selecionar';

          button.addEventListener('click', () => {
            selectEvent(item);
          });

          buttonContainer.appendChild(button);

          tr.appendChild(name);
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
    } else {
      console.error(err);
    }
  }
}

function selectEvent(event) {
  localStorage.setItem('eventId', event.id);
  refresh();
}
