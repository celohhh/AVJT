function whatsappEscreverMensagem(
  telefone  = '',
  texto     = ''
){

  let url	=	LINK.whatsapp.protocolo + numeros(telefone) + '&text=' + encodeURI(texto)
  window.location.href = url

}