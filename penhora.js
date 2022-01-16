function penhora(){

	if(!JANELA.includes(LINK.penhora.dominio))
		return

	solicitar()

	function solicitar(){

		if(!JANELA.includes(LINK.penhora.solicitar))
			return

		let mandadoId		= obterParametroDeUrl('mandadoId')
		let mandadoData	= obterParametroDeUrl('mandadoData')
		let campoId			= selecionar('#txtFolhas')
		let campoData		= selecionar('#txtDataDecisao')

		if(campoData && mandadoData)
			alterarValorDeCampo(campoData,mandadoData)

		if(campoId && mandadoId)
			alterarValorDeCampo(campoId,'Id ' + mandadoId)

		focar('#btnProsseguir')

	}

}

function penhoraOnlineRegistrar(consulta = {}){

	if(vazio(consulta))
		return

	let valor				= consulta?.valor					|| ''
	let mandadoId		= consulta?.mandado?.id		|| ''
	let mandadoData = consulta?.mandado?.data	|| ''

	let url = LINK.penhora.solicitar + encodeURI('?' + 'valor=' + valor + '&mandadoId=' + mandadoId + '&mandadoData=' + mandadoData)

	let janela			= CONFIGURACAO?.janela?.penhora || ''

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

}