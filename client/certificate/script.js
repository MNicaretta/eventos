$(document).ready(function() {
  $('#validate-button').click(async function() {
    try {
      const code = $('#container-input').val();
      const res = await API.get('validate/' + code);

      if (res && res.data) {
        const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Certificado inválido!');
      }
    } catch (err) {
      if (err.isAxiosError) {
        let message = 'Não foi possivel validar o certificado';

        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        }

        alert(message);
      }
    }
  });
});
