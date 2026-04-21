// Configurações de contato — edite aqui para trocar WhatsApp, endereço etc.
window.SITE_CONFIG = {
  // Coloque apenas dígitos no whatsappNumber (55 + DDD + número)
  whatsappNumber: "5543999999999", // TODO: substituir pelo WhatsApp real da Dra. Vanessa
  whatsappDisplay: "(43) 99999-9999",
  whatsappMessage: "Olá! Gostaria de agendar uma avaliação com a Dra. Vanessa Dias.",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      this.whatsappMessage
    )}`;
  },

  instagram: "https://www.instagram.com/dentistavanessadias/",
  threads: "https://www.threads.com/@dentistavanessadias",

  email: "contato@dravanessadias.com.br", // TODO: substituir se necessário

  addressLine1: "Apucarana — PR",
  addressLine2: "Agende sua avaliação pelo WhatsApp",
  mapQuery: "Apucarana, PR, Brasil",
};
