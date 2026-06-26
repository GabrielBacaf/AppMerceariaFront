import Swal from 'sweetalert2';

export const showAlert = {
  success(message: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: message,
      confirmButtonColor: '#3b82f6',
    });
  },
  error(error: any) {
    let message = 'Ocorreu um erro na requisição.';
    let html = '';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error.message) {
      message = error.message;
    }

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      html = '<ul style="text-align: left; margin-top: 10px; color: #ef4444;">';
      for (const key in errors) {
        errors[key].forEach((err: string) => {
          html += `<li>- ${err}</li>`;
        });
      }
      html += '</ul>';
    }

    return Swal.fire({
      icon: 'error',
      title: 'Ops...',
      text: message,
      html: html ? `<div>${message}</div>${html}` : undefined,
      confirmButtonColor: '#3b82f6',
    });
  },
  confirm(title: string, text: string) {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });
  }
};
