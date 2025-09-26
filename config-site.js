/**
 * 🔧 Configuração Individual do Site
 * CADA SITE tem seu próprio Google Ads ID
 * Evita rastreamento cruzado entre contas
 */

// ⚠️ CONFIGURAR PARA CADA SITE INDIVIDUALMENTE
window.SITE_CONFIG = {
  // 🌐 API Backend (mesma para todos os sites)
  API_URL: 'https://app.deliciasdonamaria.com/api/concurso2ups',
  
  // 🎯 Google Ads (ÚNICO para ESTE site)
  GOOGLE_ADS: {
    enabled: true,
    id: 'AW-17558615378',  // ID para concurso-pmsp.com
    conversion_id: 'AW-17558615378/PyemCJi1i5wbENLqzLRB',  // Conversion ID para concurso-pmsp.com
  },
  
  // 🎭 Produto mascarado (mesmo para todos)
  PRODUCT: {
    name: 'Curso On 25 – Aprenda no Seu Ritmo',
    category: 'education',
    vendor: 'Educação Br – Aprendizado',
    value: 85.00,
    currency: 'BRL'
  }
};

// 📊 Função para enviar conversão (executada no frontend)
window.trackConversion = function(eventType, data) {
  if (!window.SITE_CONFIG.GOOGLE_ADS.enabled) {
    console.log('⚠️ Google Ads desabilitado para este site');
    return;
  }
  
  if (typeof gtag === 'undefined') {
    console.log('⚠️ Google Tag Manager não carregado');
    return;
  }
  
  // Dados da conversão (produto mascarado)
  const conversionData = {
    send_to: window.SITE_CONFIG.GOOGLE_ADS.conversion_id,
    value: data.value || window.SITE_CONFIG.PRODUCT.value,
    currency: window.SITE_CONFIG.PRODUCT.currency,
    transaction_id: data.transaction_id || data.payment_code,
    items: [{
      id: data.payment_code || 'PREP_' + Date.now(),
      name: window.SITE_CONFIG.PRODUCT.name,
      category: window.SITE_CONFIG.PRODUCT.category,
      quantity: 1,
      price: data.value || window.SITE_CONFIG.PRODUCT.value
    }]
  };
  
  console.log('📊 Enviando conversão para ESTA conta:', {
    event: eventType,
    account: window.SITE_CONFIG.GOOGLE_ADS.id,
    product: window.SITE_CONFIG.PRODUCT.name,
    value: conversionData.value
  });
  
  // Enviar conversão para Google Ads DESTE site
  gtag('event', eventType, conversionData);
  
  // Evento adicional para purchase
  if (eventType === 'purchase' || eventType === 'conversion') {
    gtag('event', 'conversion', {
      send_to: window.SITE_CONFIG.GOOGLE_ADS.conversion_id,
      value: conversionData.value,
      currency: conversionData.currency,
      transaction_id: conversionData.transaction_id
    });
  }
};

// 🔍 Função para verificar pagamento e enviar conversão
window.checkPaymentAndTrack = async function(paymentCode) {
  try {
    const response = await fetch(window.SITE_CONFIG.API_URL + '/api/check-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payment_code: paymentCode })
    });
    
    const data = await response.json();
    
    if (data.success && data.should_track_conversion) {
      console.log('✅ Pagamento aprovado! Enviando conversão...');
      
      // Enviar conversão para ESTA conta Google Ads
      window.trackConversion('purchase', {
        payment_code: paymentCode,
        value: window.SITE_CONFIG.PRODUCT.value
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro ao verificar pagamento:', error);
    return false;
  }
};

// 📢 Log de configuração ao carregar
console.log('🔧 Site configurado:', {
  api: window.SITE_CONFIG.API_URL,
  google_ads_account: window.SITE_CONFIG.GOOGLE_ADS.id,
  product: window.SITE_CONFIG.PRODUCT.name,
  nota: 'Cada site tem sua própria conta Google Ads'
});