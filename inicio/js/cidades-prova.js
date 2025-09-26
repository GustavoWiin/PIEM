// Cidades de aplicação para o concurso PM SP 2025
window.CIDADES_PROVA = {
  "SP": [
    "ANDRADINA",
    "ARAÇATUBA", 
    "ARARAQUARA",
    "AVARÉ",
    "BAURU",
    "BRAGANÇA PAULISTA",
    "CAMPINAS",
    "CARAGUATATUBA",
    "CATANDUVA",
    "COTIA",
    "DRACENA",
    "FRANCA",
    "FRANCO DA ROCHA",
    "GUARULHOS",
    "ITAPETININGA",
    "JUNDIAÍ",
    "MARÍLIA",
    "MOGI DAS CRUZES",
    "MONGAGUÁ",
    "OSASCO",
    "OURINHOS",
    "PIRACICABA",
    "PIRASSUNUNGA",
    "PRAIA GRANDE",
    "PRESIDENTE PRUDENTE",
    "PRESIDENTE VENCESLAU",
    "REGISTRO",
    "RIBEIRÃO PRETO",
    "RIO CLARO",
    "SANTOS",
    "SÃO BERNARDO DO CAMPO",
    "SÃO JOSÉ DO RIO PRETO",
    "SÃO JOSÉ DOS CAMPOS",
    "SÃO PAULO",
    "SOROCABA",
    "TAUBATÉ",
    "VOTUPORANGA"
  ],
  "AM": [
    "MANAUS"
  ],
  "BA": [
    "SALVADOR"
  ],
  "CE": [
    "FORTALEZA"
  ],
  "DF": [
    "BRASÍLIA"
  ],
  "ES": [
    "VITÓRIA"
  ],
  "GO": [
    "GOIÂNIA"
  ],
  "MG": [
    "BELO HORIZONTE"
  ],
  "MS": [
    "CAMPO GRANDE"
  ],
  "MT": [
    "CUIABÁ"
  ],
  "PE": [
    "RECIFE"
  ],
  "PR": [
    "CURITIBA"
  ],
  "RJ": [
    "RIO DE JANEIRO"
  ],
  "RS": [
    "PORTO ALEGRE"
  ],
  "SC": [
    "FLORIANÓPOLIS"
  ]
};

// Utility functions para trabalhar com as cidades
window.CIDADE_UTILS = {
  // Buscar cidades disponíveis por estado
  buscarCidadesPorEstado: function(uf) {
    return window.CIDADES_PROVA[uf] || [];
  },

  // Verificar se uma cidade está disponível no estado
  cidadeDisponivelNoEstado: function(cidade, uf) {
    const cidades = this.buscarCidadesPorEstado(uf);
    return cidades.some(c =>
      this.normalizarTexto(c) === this.normalizarTexto(cidade)
    );
  },

  // Encontrar cidade mais próxima disponível no estado
  encontrarCidadeMaisProxima: function(cidade, uf) {
    const cidades = this.buscarCidadesPorEstado(uf);
    const cidadeNormalizada = this.normalizarTexto(cidade);

    // Primeiro tenta encontrar correspondência exata
    for (let cidadeDisponivel of cidades) {
      if (this.normalizarTexto(cidadeDisponivel) === cidadeNormalizada) {
        return cidadeDisponivel;
      }
    }

    // Se não encontrar, tenta correspondência parcial
    for (let cidadeDisponivel of cidades) {
      if (this.normalizarTexto(cidadeDisponivel).includes(cidadeNormalizada) ||
          cidadeNormalizada.includes(this.normalizarTexto(cidadeDisponivel))) {
        return cidadeDisponivel;
      }
    }

    // Se não encontrar nenhuma correspondência, retorna a primeira cidade do estado
    return cidades[0] || null;
  },

  // Normalizar texto para comparação (remove acentos e converte para minúsculo)
  normalizarTexto: function(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  },

  // Determinar cidade de prova baseada no endereço do candidato
  determinarCidadeProva: function(cidadeEndereco, uf) {
    if (!cidadeEndereco || !uf) {
      return null;
    }

    // Verificar se a cidade do endereço está na lista de cidades de prova
    if (this.cidadeDisponivelNoEstado(cidadeEndereco, uf)) {
      return cidadeEndereco.toUpperCase();
    }

    // Se não estiver, encontrar a mais próxima
    return this.encontrarCidadeMaisProxima(cidadeEndereco, uf);
  }
};

console.log('✅ Sistema de cidades de prova PM SP 2025 carregado');
