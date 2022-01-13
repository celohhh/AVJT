function planilha(){

	return
	/*
	console.debug('p')
	
	criarBotao(
		'pje-consultar-processo',
		'',
		'',
		'Consultar Processo no PJe',
		'',
		() => {
			return
		},
		`
			position:fixed;
			left:0;
			top:0;
			z-index:10;
		`
	)
*/

	


/*
return
	let menuSuperior = htmlCriarElemento(
		'',
		'nav',
		'avjt-menu-superior',
		`
			height:auto;
			left:0;
			margin:0;
			padding:0;
			position:fixed;
			text-align:center;
			top:0;
			width:auto;
			z-index:1000000;
		`
	)

	let botaoConsultarPJe = criarBotao(
		'avjt-menu-superior',
		'Consultar no PJe [F8]',
		pjeConsultarDetalhesDoProcesso,
		'Marque uma célula que contenha o número do processo que deseja consultar e pressione este botão.',
		'0,0,0',
		'255,255,255'
	)

	document.onkeyup = tecla => {
		if(tecla.which == 119)
			pjeConsultarDetalhesDoProcesso()
	}

	function criarBotao(
		pai,
		titulo,
		funcao,
		legenda='',
		corDeFundoRGB='0,0,0',
		corDeTextoRGB='255,255,255'
	){

		let id = removerAcentuacao(minusculas(titulo.replace(/\s\[.*?\]/gi,'').replace(/\s/gi,'-')))
		let teclaDeAtalho = titulo.match(/\[.*?\]/gi,'') || ''
		if(teclaDeAtalho)
			teclaDeAtalho = "\n" + 'Atalho: ' + teclaDeAtalho.join().replace(/\[|\]/gi,'')

		let botao = htmlCriarElemento(
			pai,
			'input',
			'avjt-botao-consultar-pje',
			`
				background:linear-gradient(to bottom,rgba(${corDeFundoRGB},1) 0%,rgba(${corDeFundoRGB},1) 100%);
				border:rgba(${corDeFundoRGB},0.75) solid 2px;
				border-radius:0 0 5px 5px;
				border-top:none;
				color:rgba(${corDeTextoRGB},1);
				display:block;
				float:left;
				font-size:10px;
				font-weight:bold;
				height:auto;
				line-height:10px;
				margin:0 1px 0 0;
				padding:0 5px;
				text-align:center;
				width:auto;
			`
		)

		botao.id = 'avjt-'+id
		botao.type = 'button'
		botao.value = titulo
		botao.title = legenda + teclaDeAtalho
		botao.addEventListener('click',funcao)

		return botao

	}
*/
}