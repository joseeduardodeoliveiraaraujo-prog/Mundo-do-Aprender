/**
 * dialog.js — abre diálogos <dialog> a partir de botões com
 * data-dialog-open="id-do-dialogo". Ao fechar, o foco volta ao botão que abriu.
 *
 * Os diálogos fecham pelo botão do formulário (method="dialog") ou pela tecla Esc.
 */

export function connectDialogs(root = document) {
  root.querySelectorAll('[data-dialog-open]').forEach((opener) => {
    const dialog = document.getElementById(opener.dataset.dialogOpen);
    if (!(dialog instanceof HTMLDialogElement)) {
      console.warn(`[dialog] Diálogo "${opener.dataset.dialogOpen}" não encontrado.`);
      return;
    }

    opener.addEventListener('click', () => {
      dialog.showModal();
      dialog.addEventListener('close', () => opener.focus(), { once: true });
    });
  });
}
