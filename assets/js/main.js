/* Matheus Vieira — portfólio.
   Duas coisas, ambas opcionais: o ano do rodapé e os números dos repositórios.
   A página inteira funciona sem JS; os números já vêm escritos no HTML. */
(function () {
  'use strict';

  /* --- ano do rodapé ----------------------------------------------------- */
  var ano = document.getElementById('ano');
  if (ano) { ano.textContent = new Date().getFullYear(); }

  /* --- números dos repositórios, direto do GitHub ------------------------
     Melhoria progressiva: os valores já estão no HTML e continuam lá se a
     API não responder (ela limita requisições por IP). Para desligar isto,
     é só apagar deste comentário até o fim do arquivo. */
  if (!('fetch' in window)) { return; }

  var plural = function (n, um, muitos) {
    return n + ' ' + (n === 1 ? um : muitos);
  };

  Array.prototype.forEach.call(
    document.querySelectorAll('[data-repo]'),
    function (bloco) {
      fetch('https://api.github.com/repos/' + bloco.dataset.repo, {
        headers: { Accept: 'application/vnd.github+json' }
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (dados) {
          var estrelas = bloco.querySelector('[data-gh="stars"]');
          var forks = bloco.querySelector('[data-gh="forks"]');
          // contador zerado não vira texto: some, em vez de anunciar zero
          if (estrelas && typeof dados.stargazers_count === 'number') {
            if (dados.stargazers_count > 0) {
              estrelas.textContent = plural(dados.stargazers_count, 'estrela', 'estrelas');
            } else {
              estrelas.remove();
            }
          }
          if (forks && typeof dados.forks_count === 'number') {
            if (dados.forks_count > 0) {
              forks.textContent = plural(dados.forks_count, 'fork', 'forks');
            } else {
              forks.remove();
            }
          }
        })
        .catch(function () { /* mantém o que já está escrito no HTML */ });
    }
  );
})();
