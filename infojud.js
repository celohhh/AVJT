function infojud(){

	if(!JANELA.includes(LINK.infojud.dominio))
		return

	solicitar()

	function solicitar(){

		if(!JANELA.includes(LINK.infojud.solicitar))
			return

		selecionarOpcao('#tipoProcesso','Ação Trabalhista')
	
		let vara = CONFIGURACAO?.usuario?.unidade || ''
		if(!vara)
			return

		selecionarOpcao('#siglavara',vara)

	}

}

function infojudRegistrarSolicitacao(consulta = {}){

	if(vazio(consulta))
		return

	let processo			= consulta?.processo	|| ''
	let documento			= consulta?.documento	|| ''
	let justificativa	= 'Cumprimento de Mandado de Penhora'


	let url = LINK.infojud.solicitar + encodeURI('?' + 'processo=' + numeros(processo) + '&novocpfcnpj=' + numeros(documento) + '&justificativa=' + justificativa)

	let janela			= CONFIGURACAO?.janela?.infojud || ''

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

	esforcosPoupados(3,3,contarCaracteres(processo + documento + justificativa))

}