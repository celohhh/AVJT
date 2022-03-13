function email(){
	return
}

function emailEscreverBaixarDocumentoAtivo(
	email='',
	assunto='',
	texto=''
){

	let pje = pjeObterContexto()

	if(pje){

		let processo = PROCESSO?.numero || ''
		let textoPadrao = CONFIGURACAO?.texto?.emailDocumentos || ''
		let assinatura = CONFIGURACAO?.texto?.assinatura || ''
		let documentoTitulo = pjeObterDocumentoTitulo()
		let documentoLink = pjeObterDocumentoLink()
		let link = ''
		let titulo = ''

		if(documentoLink)
			link = 'Link:\n' + documentoLink

		if(documentoTitulo)
			titulo = 'Documento:\n' + documentoTitulo

		assunto = 'Processo ' + processo

		texto =	'Referente ao ' + assunto + '\n\n' +
			titulo + '\n\n' +
			link + '\n\n' +
			textoPadrao + '\n\n' +
			assinatura

		setTimeout(
			() => clicar('[aria-label="Baixar documento com capa (sem assinatura)"]'),
			1000
		)

	}

	let url = 'mailto:'+encodeURI(minusculas(email)+'?subject='+assunto+'&body='+texto)

	abrirPagina(url,'','','','','webmail')

	esforcosPoupados(3,3,contarCaracteres(texto))

}