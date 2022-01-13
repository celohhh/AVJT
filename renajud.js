function renajud(){
	
	let erro = selecionar('.ui-messages-error-detail')

	if(erro){
		window.location = LINK.renajud.raiz
		return
	}
	
	if(JANELA.includes('login'))
		return

	if(!JANELA.includes('restricoes-insercao.jsf'))
		return

	let documento	= obterParametroDeUrl('documento')
	let campo			= ''
	let conteudo	= ''

	if(documento){
		campo			= selecionar('[id$="campo-cpf-cnpj"]')
		conteudo	= documento
	}

	alterarValorDeCampo(campo,conteudo)

	clicar('[id$="botao-pesquisar"]')

	esforcosPoupados(3,3,contarCaracteres(conteudo))

}


function renajudInserirRestricao(consulta = {}){

	if(vazio(consulta))
		return

	let campo			= Object.keys(consulta)[0]
	let conteudo	= consulta[campo]

	let url = LINK.renajud.inserir + '?' + campo + '=' + conteudo

	let janela			= CONFIGURACAO?.janela?.renajud || ''

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