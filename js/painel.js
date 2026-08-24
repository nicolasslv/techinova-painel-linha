const TABELA = document.querySelector('#sensores tbody');
const LISTA_ALERTAS = document.querySelector('#lista-alertas');

const LIMITE_CRITICO_PADRAO_F = 90;
const LIMITE_CAMARA_FRIA_F = 45;

function obterLimite(sensor) {
  if (sensor.codigo === 'S-104') {
    return LIMITE_CAMARA_FRIA_F;
  }
  return LIMITE_CRITICO_PADRAO_F;
}

async function carregarSensores() {
  try {
    const resposta = await fetch('dados/sensores.json');
    if (!resposta.ok) {
      throw new Error('Falha ao buscar sensores: ' + resposta.status);
    }
    const sensores = await resposta.json();
    sensores.forEach(function (sensor) {
      desenharLinha(sensor);
      verificarAlerta(sensor);
    });
  } catch (erro) {
    console.error('Erro ao carregar sensores:', erro);
    TABELA.innerHTML = '<tr><td colspan="4">Erro ao carregar dados dos sensores.</td></tr>';
  }
}

function converterTemperatura(leitura) {
  return leitura * 9 / 5 + 32;
}

function desenharLinha(sensor) {
  const celsius = converterTemperatura(sensor.valor).toFixed(1);
  const limite = obterLimite(sensor);
  const status = sensor.valor > limite ? 'critico' : 'ok';
  const tr = document.createElement('tr');
  tr.innerHTML =
    '<td>' + sensor.codigo + '</td>' +
    '<td>' + sensor.descricao + '</td>' +
    '<td>' + celsius + ' C</td>' +
    '<td>' + status + '</td>';
  TABELA.appendChild(tr);
}

function verificarAlerta(sensor) {
  const limite = obterLimite(sensor);
  if (sensor.valor > limite) {
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
