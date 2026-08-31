# Guia de apoio — Estrela do Sul

Use este material como orientação, não como solução pronta. Registre as decisões tomadas durante o trabalho.

## 1. Comece pela base desnormalizada

A **V1 é a base obrigatória da atividade**. Cada linha representa um bilhete e
repete dados de comprador, transação, passageiro, viagem e veículo. Identificar
esses grupos, criar consultas de referência e separar as entidades faz parte da
entrega. A V2 deve ser usada somente como checkpoint opcional, depois que você
construir sua proposta.

Ao normalizar a V1, o modelo-alvo terá assuntos com grãos diferentes:

| Tabela | Uma linha representa | Chave esperada |
|---|---|---|
| `compradores` | uma pessoa que realizou compras | `Comprador_Documento_CPF` |
| `transacoes` | uma compra, que pode conter vários bilhetes | `Transacao_ID` |
| `passageiros` | uma pessoa que viajou | `Passageiro_CPF` |
| `bilhetes` | um assento vendido para uma viagem | `Bilhete_ID` |
| `viagens` | uma saída programada em um trecho e horário | `Viagem_ID` |
| `veiculos` | um ônibus identificado pelo prefixo | `Onibus_Prefixo` |

Antes de limpar, responda:

1. quais chaves deveriam ser únicas?
2. quais colunas ligam as tabelas?
3. quais valores precisam ser números, datas ou textos?
4. quais problemas podem duplicar receita ou capacidade?
5. a mesma transação aparece em quantos bilhetes?

## 2. Limpeza sugerida no Power Query

Crie etapas com nomes que expliquem a regra aplicada.

### Textos

- remover espaços no início e no fim;
- aplicar limpeza de caracteres não imprimíveis;
- padronizar maiúsculas e minúsculas;
- revisar `Canal_Venda`, `Tipo_Venda`, `Classe_Assento` e campos Sim/Não;
- não substituir valores diferentes apenas porque parecem semelhantes.

### Chaves

- validar unicidade no lado `1`;
- remover duplicatas somente depois de definir o grão;
- aparar espaços em PKs e FKs;
- verificar chaves sem correspondência antes de criar relações.

### Datas

- converter `Data_Compra`, `Data_Viagem` e datas de nascimento com localidade Português (Brasil);
- separar data e hora somente quando isso ajudar a análise;
- confirmar que nenhuma compra ocorre depois da respectiva viagem.

### Valores

- remover `R$`, pontos de milhar e espaços antes de converter moeda;
- usar tipo Moeda decimal fixa para valores financeiros;
- conferir a regra `Valor_Total_Passagem = Valor_Tarifa - Valor_Desconto`.

### Evidência da limpeza

Mantenha uma pequena tabela de decisões:

| Problema | Evidência | Regra aplicada | Resultado |
|---|---|---|---|
| canal com espaços | `" SITE "` | aparar + capitalizar | `Site` |
| valor como texto | `R$ 1.234,56` | remover símbolos + localidade pt-BR | `1234,56` |
| FK com espaço | `VGM-00000001 ` | aparar | `VGM-00000001` |

## 3. Modelo sugerido

Relações principais:

```text
compradores  1 ─── N  transacoes  1 ─── N  bilhetes  N ─── 1  passageiros
                                      │
                                      N
                                      │
                                      1
                                   viagens  N ─── 1  veiculos
```

No Power BI, a apresentação pode ser organizada como esquema estrela, desde que o grão e os resultados sejam preservados.

Direções recomendadas:

- `compradores` filtra `transacoes`;
- `transacoes` filtra `bilhetes`;
- `passageiros` filtra `bilhetes`;
- `veiculos` filtra `viagens`;
- `viagens` filtra `bilhetes`.

Evite relações bidirecionais sem justificativa. Elas podem criar caminhos ambíguos.

## 4. Calendário

Crie uma dimensão calendário contínua. A atividade possui dois papéis de data:

- data da compra, para analisar comportamento comercial;
- data da viagem, para analisar operação e demanda.

Você pode usar duas dimensões calendário ou uma relação ativa com a data principal e uma relação inativa acionada em medidas específicas. Documente a escolha.

## 5. Medidas iniciais

Adapte nomes de tabelas e tipos conforme o seu modelo.

```DAX
Receita Passagens =
SUM(bilhetes[Valor_Total_Passagem])

Tarifa Bruta =
SUM(bilhetes[Valor_Tarifa])

Descontos Concedidos =
SUM(bilhetes[Valor_Desconto])

Bilhetes Vendidos =
DISTINCTCOUNT(bilhetes[Bilhete_ID])

Transações =
DISTINCTCOUNT(transacoes[Transacao_ID])

Ticket Médio =
DIVIDE([Receita Passagens], [Bilhetes Vendidos])

% Desconto =
DIVIDE([Descontos Concedidos], [Tarifa Bruta])

Capacidade Ofertada =
SUM(viagens[Capacidade_Total_Veiculo])

% Ocupação =
DIVIDE([Bilhetes Vendidos], [Capacidade Ofertada])

Antecedência Média =
AVERAGE(transacoes[Antecedencia_Compra_Dias])
```

### Atenção à capacidade

Na tabela desnormalizada, a capacidade do ônibus se repete para cada bilhete. Somá-la nessa tabela cria uma capacidade fictícia. A capacidade deve ser considerada uma vez por viagem.

## 6. Perguntas que o dashboard deve responder

### Visão executiva

- quanto a rede faturou?
- quantos bilhetes, transações e viagens ocorreram?
- qual foi a ocupação da capacidade ofertada?
- quais indicadores mudaram em relação ao período anterior?

### Rotas e demanda

- quais trechos concentram receita, bilhetes e capacidade?
- existem viagens com ocupação baixa e alto custo de oportunidade?
- quais dias, meses e horários concentram demanda?
- quais classes funcionam melhor em cada trecho?

### Vendas e clientes

- quais canais geram mais transações e receita?
- canais digitais têm comportamento diferente do guichê?
- qual é a antecedência de compra por motivo de viagem?
- quais compradores retornam e com que frequência?

### Frota, conforto e inclusão

- quais veículos e classes sustentam mais receita?
- idade, Wi-Fi, WC e USB se relacionam com escolha de classe ou ocupação?
- qual é o peso dos benefícios e gratuidades na operação?
- como atender pessoas com necessidades especiais sem perder eficiência?

## 7. Entrega

O arquivo `.pbix` deve conter:

- consultas organizadas;
- modelo sem ambiguidade;
- calendário documentado;
- tabela exclusiva de medidas;
- quatro páginas executivas;
- pelo menos três insights;
- pelo menos três recomendações;
- fontes, limitações e data de atualização visíveis.

Os dados são inteiramente sintéticos. CPFs, RGs, nomes, telefones e e-mails não representam pessoas reais.
