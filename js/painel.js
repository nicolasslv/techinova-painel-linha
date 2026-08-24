const TABELA = document.querySelector('#sensores tbody');
const LIMITE_CRITICO_F = 90;
const LISTA_ALERTAS = document.querySelector('#lista-alertas');
async function carregarSensores() {
  const resposta = await fetch('dados/sensores.json');
  const sensores = await resposta.json();
  sensores.forEach(function (sensor) {
    desenharLinha(sensor);
    verificarAlerta(sensor);
  });
}
function converterTemperatura(leitura) {
  return leitura * 9 / 5 + 32;
}
function desenharLinha(sensor) {
  const celsius = converterTemperatura(sensor.valor).toFixed(1);
  const tr = document.createElement('tr');
  tr.innerHTML =
    '<td>' + sensor.codigo + '</td>' +
    '<td>' + sensor.descricao + '</td>' +
    '<td>' + celsius + ' C</td>' +
    '<td>ok</td>';
  TABELA.appendChild(tr);
}
function verificarAlerta(sensor) {
  if (sensor.valor > LIMITE_CRITICO_F) {
    const li = document.createElement('li');
    li.textContent = sensor.codigo + ' - ' + sensor.descricao + ': ' + sensor.valor.toFixed(1) + ' F (critico)';
    LISTA_ALERTAS.appendChild(li);
  }
}
function marcarAtualizacao() {
  document.querySelector('#atualizado').textContent = new Date().toLocaleString('pt-BR');
}
carregarSensores();
marcarAtualizacao();
