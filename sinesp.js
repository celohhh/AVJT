function sinesp(){

	if(!JANELA.includes(LINK.sinesp.dominio))
		return

	autenticacao()

	function autenticacao(){

		if(!JANELA.includes('sinesp-seguranca/login.jsf'))
			return

		let cpf	= CONFIGURACAO?.usuario?.cpf || ''

		let campoUsuario	= selecionar('[id$="identificacao"]')
		if(
			!campoUsuario
			||
			!cpf
		)
			return

		alterarValorDeCampo(campoUsuario,cpf)

	}

}


function infosegPesquisarDocumento(documento=''){

	if(!documento)
		return

	let url = LINK.sinesp.infoseg + encodeURI(documento)

	let janela			= CONFIGURACAO?.janela?.infoseg || ''

	let largura			=	janela?.largura			|| 1200
	let altura			= janela?.altura			|| 900
	let horizontal	= janela?.horizontal	|| 0
	let vertical		= janela?.vertical		|| 0

	abrirPagina(
		url,
		largura,
		altura,
		horizontal,
		vertical
	)

	esforcosPoupados(1,1,contarCaracteres(documento))

}