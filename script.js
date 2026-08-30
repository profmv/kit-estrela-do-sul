const root = document.body;
const menuButton = document.querySelector('#menuButton');
const nav = document.querySelector('#mainNav');
const themeButton = document.querySelector('#themeButton');
const readingBar = document.querySelector('#readingBar');
const toast = document.querySelector('#toast');
const savedTheme = localStorage.getItem('estrela-theme');

if (savedTheme === 'dark') root.classList.add('dark');

themeButton?.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.setItem('estrela-theme', root.classList.contains('dark') ? 'dark' : 'light');
});

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('scroll', () => {
  if (!readingBar) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  readingBar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}, { passive: true });

let toastTimer;
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy || '');
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  });
});

const glossaryEntries = [
  { aliases: ['bilhetagem'], slug: 'bilhetagem', tip: 'Conjunto de registros de compra e emissão de passagens; é a origem central da análise da Estrela do Sul.' },
  { aliases: ['transação', 'transações'], slug: 'transacao', tip: 'Uma compra que pode conter um ou vários bilhetes; não deve ser contada pelo número de linhas de bilhetes.' },
  { aliases: ['bilhete', 'bilhetes'], slug: 'bilhete', tip: 'Direito de um passageiro ocupar um assento em uma viagem; é o grão da principal tabela fato.' },
  { aliases: ['comprador', 'compradores'], slug: 'comprador', tip: 'Pessoa que realiza e paga a transação; pode comprar para si ou para outros passageiros.' },
  { aliases: ['passageiro', 'passageiros'], slug: 'passageiro', tip: 'Pessoa que efetivamente ocupa o assento e realiza a viagem.' },
  { aliases: ['viagem', 'viagens'], slug: 'viagem', tip: 'Uma saída programada, com data, horário, trecho, veículo e capacidade definidos.' },
  { aliases: ['trecho', 'trechos'], slug: 'trecho', tip: 'Par origem-destino atendido pela empresa; permite comparar demanda e receita entre rotas.' },
  { aliases: ['canal de venda', 'canais'], slug: 'canal-venda', tip: 'Meio usado para comprar: Site, App, Guichê, Televendas ou Parceiros/Agências.' },
  { aliases: ['classe de assento', 'classes'], slug: 'classe-assento', tip: 'Nível de conforto: Convencional, Executivo, Semi-Leito, Leito ou Leito-Cama.' },
  { aliases: ['tarifa', 'tarifa bruta'], slug: 'tarifa', tip: 'Preço original da passagem antes do desconto concedido ao passageiro.' },
  { aliases: ['desconto', 'descontos'], slug: 'desconto', tip: 'Valor abatido da tarifa conforme a categoria da passagem.' },
  { aliases: ['categoria de passagem', 'categorias de passagem'], slug: 'categoria-passagem', tip: 'Regra aplicada ao bilhete, como Inteira, Meia-Estudante, PCD ou Gratuidade-Idoso.' },
  { aliases: ['antecedência', 'antecedência de compra'], slug: 'antecedencia-compra', tip: 'Quantidade de dias entre a compra e a viagem; ajuda a entender planejamento e demanda.' },
  { aliases: ['capacidade ofertada'], slug: 'capacidade-ofertada', tip: 'Total de assentos disponibilizados, contando a capacidade uma vez por viagem.' },
  { aliases: ['ocupação'], slug: 'ocupacao', tip: 'Percentual da capacidade ofertada convertido em bilhetes vendidos.' },
  { aliases: ['bagagem extra'], slug: 'bagagem-extra', tip: 'Indicador de bilhete com serviço adicional de bagagem.' },
  { aliases: ['frota'], slug: 'frota', tip: 'Conjunto de ônibus da empresa, com prefixo, capacidade, idade, modelo e opcionais.' },
  { aliases: ['prefixo do ônibus', 'prefixo'], slug: 'prefixo-onibus', tip: 'Identificador operacional único do veículo; liga veículos às viagens.' },
  { aliases: ['PCD'], slug: 'pcd', tip: 'PCD (Pessoa com Deficiência): categoria usada para analisar inclusão e necessidades especiais.' },
  { aliases: ['grão', 'grãos'], slug: 'grao', tip: 'O que exatamente uma linha representa: compra, bilhete, viagem ou veículo.' },
  { aliases: ['PK'], slug: 'pk', tip: 'PK (Primary Key / chave primária): coluna que identifica cada linha sem repetição.' },
  { aliases: ['FK', 'FKs'], slug: 'fk', tip: 'FK (Foreign Key / chave estrangeira): coluna que aponta para a chave primária de outra tabela.' },
  { aliases: ['1:N', 'relações 1:N'], slug: 'relacao-1-n', tip: 'Relação um-para-muitos: uma linha no lado 1 se relaciona a várias no lado N.' },
  { aliases: ['dimensão', 'dimensões'], slug: 'dimensao', tip: 'Tabela descritiva usada para filtrar e agrupar, como Passageiros, Compradores e Veículos.' },
  { aliases: ['fato', 'tabela fato'], slug: 'fato', tip: 'Tabela de eventos mensuráveis, como Bilhetes, Transações e Viagens.' },
  { aliases: ['modelo normalizado'], slug: 'modelo-normalizado', tip: 'Dados separados por assunto para reduzir repetição e manter chaves consistentes.' },
  { aliases: ['esquema estrela'], slug: 'esquema-estrela', tip: 'Modelo analítico com fatos no centro e dimensões ao redor.' },
  { aliases: ['cardinalidade'], slug: 'cardinalidade', tip: 'Regra que informa quantas linhas de uma tabela podem se relacionar com a outra.' },
  { aliases: ['Power Query'], slug: 'power-query', tip: 'Área usada para importar, limpar, tipar e documentar as transformações.' },
  { aliases: ['ETL'], slug: 'etl', tip: 'ETL (Extract, Transform, Load): extrair, transformar e carregar os dados.' },
  { aliases: ['DAX'], slug: 'dax', tip: 'DAX (Data Analysis Expressions): linguagem de fórmulas usada para criar medidas.' },
  { aliases: ['medida', 'medidas'], slug: 'medida', tip: 'Cálculo dinâmico que responde aos filtros aplicados ao relatório.' },
  { aliases: ['KPI', 'KPIs'], slug: 'kpi', tip: 'KPI (Key Performance Indicator): indicador-chave para acompanhar desempenho e apoiar decisões.' },
  { aliases: ['semi-aditiva'], slug: 'semi-aditiva', tip: 'Métrica que não pode ser somada em qualquer dimensão; capacidade conta uma vez por viagem.' },
  { aliases: ['ticket médio'], slug: 'ticket-medio', tip: 'Receita média por bilhete vendido; permite comparar classes, canais e trechos.' },
  { aliases: ['recorrência'], slug: 'recorrencia', tip: 'Frequência com que o mesmo comprador realiza novas transações.' },
  { aliases: ['sazonalidade'], slug: 'sazonalidade', tip: 'Padrão de alta e baixa demanda que se repete no calendário.' },
  { aliases: ['segmentação'], slug: 'segmentacao', tip: 'Divisão da análise por grupos, como canal, classe, motivo, trecho ou perfil.' },
  { aliases: ['insight', 'insights'], slug: 'insight', tip: 'Conclusão relevante que explica um comportamento e orienta uma ação.' },
  { aliases: ['benchmark'], slug: 'benchmark', tip: 'Referência para interpretar um número, como período anterior, média ou melhor trecho.' },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addGlossaryLinks() {
  if (root.dataset.page === 'glossary') return;
  const main = document.querySelector('main');
  if (!main) return;
  const aliasMap = new Map();
  glossaryEntries.forEach(entry => entry.aliases.forEach(alias => aliasMap.set(alias.toLocaleLowerCase('pt-BR'), entry)));
  const aliases = [...aliasMap.keys()].sort((a, b) => b.length - a.length).map(escapeRegex);
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(${aliases.join('|')})(?![\\p{L}\\p{N}_])`, 'giu');
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('a, code, pre, button, input, summary, .term-tooltip')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const linked = new Set();

  nodes.forEach(node => {
    pattern.lastIndex = 0;
    const text = node.nodeValue;
    let cursor = 0;
    let match;
    const fragment = document.createDocumentFragment();
    let changed = false;
    while ((match = pattern.exec(text))) {
      const entry = aliasMap.get(match[0].toLocaleLowerCase('pt-BR'));
      const section = node.parentElement?.closest('section')?.id || 'main';
      const linkKey = `${section}:${entry.slug}`;
      if (linked.has(linkKey)) continue;
      fragment.append(text.slice(cursor, match.index));
      const link = document.createElement('a');
      link.className = 'term-link';
      link.href = `glossario.html#${entry.slug}`;
      link.dataset.tip = entry.tip;
      link.textContent = match[0];
      link.setAttribute('aria-label', `${match[0]} — ${entry.tip}`);
      fragment.append(link);
      cursor = match.index + match[0].length;
      linked.add(linkKey);
      changed = true;
    }
    if (changed) {
      fragment.append(text.slice(cursor));
      node.replaceWith(fragment);
    }
  });
}

function enableTooltips() {
  const links = document.querySelectorAll('.term-link');
  if (!links.length) return;
  const tooltip = document.createElement('div');
  tooltip.className = 'term-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  document.body.append(tooltip);

  const show = link => {
    tooltip.textContent = link.dataset.tip;
    tooltip.classList.add('visible');
    const rect = link.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const left = Math.min(innerWidth - tipRect.width - 12, Math.max(12, rect.left + rect.width / 2 - tipRect.width / 2));
    const above = rect.top - tipRect.height - 10;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${above > 8 ? above : rect.bottom + 10}px`;
  };
  const hide = () => tooltip.classList.remove('visible');
  links.forEach(link => {
    link.addEventListener('pointerenter', () => show(link));
    link.addEventListener('pointerleave', hide);
    link.addEventListener('focus', () => show(link));
    link.addEventListener('blur', hide);
  });
}

addGlossaryLinks();
enableTooltips();

if (root.dataset.page === 'glossary') {
  const openTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target?.tagName === 'DETAILS') target.open = true;
  };
  openTarget();
  window.addEventListener('hashchange', openTarget);

  const search = document.querySelector('#glossarySearch');
  const cards = [...document.querySelectorAll('.glossary-card')];
  const empty = document.querySelector('#glossaryEmpty');
  search?.addEventListener('input', () => {
    const query = search.value.toLocaleLowerCase('pt-BR').trim();
    let visible = 0;
    cards.forEach(card => {
      const matches = !query || card.textContent.toLocaleLowerCase('pt-BR').includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    document.querySelectorAll('.glossary-group').forEach(group => {
      group.hidden = ![...group.querySelectorAll('.glossary-card')].some(card => !card.hidden);
    });
    if (empty) empty.hidden = visible !== 0;
  });
}

const tasks = [...document.querySelectorAll('#checklist input')];
const progressValue = document.querySelector('#progressValue');
const taskProgress = document.querySelector('#taskProgress');
const progressMessage = document.querySelector('#progressMessage');

function updateProgress() {
  if (!tasks.length) return;
  const completed = tasks.filter(task => task.checked).length;
  const percent = Math.round(completed / tasks.length * 100);
  progressValue.textContent = `${percent}%`;
  taskProgress.style.width = `${percent}%`;
  progressMessage.textContent = percent === 100 ? 'Pronto para a defesa executiva.' : percent >= 50 ? 'A estrutura está tomando forma.' : 'Comece pelo diagnóstico da base.';
}

tasks.forEach(task => {
  task.checked = localStorage.getItem(`estrela-task-${task.dataset.task}`) === 'true';
  task.addEventListener('change', () => {
    localStorage.setItem(`estrela-task-${task.dataset.task}`, String(task.checked));
    updateProgress();
  });
});
updateProgress();
