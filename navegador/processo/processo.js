window.addEventListener('load',criarMenuDePartesDoProcesso)

function criarMenuDePartesDoProcesso(){

	setInterval(contarEsforcosRepetitivosPoupados,100)

	let processo = obterParametroDeURL('processo')

	PROCESSO = JSON.parse(processo)
	
	definicoesGlobais()
	criarCabecalhoDePaginaDaExtensao()
	selecionar('h1').innerText = 'DADOS DO PROCESSO'

	listarDadosDoProcesso()
	listarPartes()

	function listarDadosDoProcesso(){

		let base = selecionar('processo')
		
		criarTitulo('Processo',base)

		if(PROCESSO?.numero){
			let secao = criar('numero','','subsecao',base)
			criarCampo('Número:','processo',PROCESSO.numero,secao)
			criarCampo('Número sem separadores:','processo',numeros(PROCESSO.numero),secao)
		}

		if(PROCESSO?.valor?.causa){
			let secao = criar('valor','','subsecao',base)
			criarCampo('Valor da Causa:','valor',PROCESSO.valor.causa,secao)
		}


	}

	function listarPartes(){

		let base = selecionar('partes')

		if(PROCESSO?.partes?.ATIVO){
			let polo = PROCESSO.partes.ATIVO
			let secao = criar('polo-ativo','','subsecao',base)
			criarTitulo('Polo Ativo ' + `(${polo.length})`,secao)
			criarCampos(polo,secao)
		}

		if(PROCESSO?.partes?.PASSIVO){
			let polo = PROCESSO.partes.PASSIVO
			let secao = criar('polo-passivo','','subsecao',base)
			criarTitulo('Polo Passivo ' + `(${polo.length})`,secao)
			criarCampos(polo,secao)
		}

		function criarCampos(polo,secao){		
			
			polo.forEach(
				parte => {
					let subsecao = criar('parte','','',secao)

					if(!parte?.nome)
						return
					criarCampo('Nome:','largura100',parte.nome,subsecao)

					let classe = 'largura49'

					if(parte?.documento){
						let cnpj = obterCNPJ(parte.documento)
						if(cnpj)
							classe = 'largura32'
						criarCampo('Documento:',classe,parte.documento,subsecao)
						if(cnpj)
							criarCampo('Raiz do CNPJ:',classe,obterRaizCNPJ(parte.documento),subsecao)
						criarCampo('Sem separadores:',classe,numeros(parte.documento),subsecao)									
					}
					
				}
			)

		}

	}
	
	function criarTitulo(
		texto			= '',
		ancestral	= ''
	){
		let titulo = criar('h2','','',ancestral)
		titulo.innerText = texto
	}

	function criarCampo(
		titulo		= '',
		classe		= '',
		texto			= '',
		ancestral	= ''
	){

		let rotulo	= criar('rotulo','',classe,ancestral)
		rotulo.setAttribute('aria-label',titulo)

		let campo		= criar('input','','',rotulo)
		campo.type	= 'text'
		campo.value	= texto

		campo.addEventListener(
			'click',
			copiarConteudo
		)

		return campo

	}

}