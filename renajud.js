function renajud(){

	if(JANELA.includes('login'))
		return

	if(!JANELA.includes('restricoes-insercao.jsf'))
		return

	let chassi		= obterParametroDeUrl('chassi')
	let documento	= obterParametroDeUrl('documento')
	let placa			= obterParametroDeUrl('placa')
	let campo			= ''
	let conteudo	= ''

	if(chassi){
		campo			= selecionar('[id$="campo-chassi"]')
		conteudo	= chassi
	}

	if(documento){
		campo			= selecionar('[id$="campo-cpf-cnpj"]')
		conteudo	= documento
	}

	if(placa){
		campo			= selecionar('[id$="campo-placa"]')
		conteudo	= placa
	}

	if(conteudo){
		alterarValorDeCampo(campo,conteudo)
		clicar('[id$="botao-pesquisar"]')
		esforcosPoupados(3,3,contarCaracteres(conteudo))
	}

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