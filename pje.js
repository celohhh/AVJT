//publicas/pje.js

function pje(){

	if(!JANELA.includes(LINK.pje.dominio))
		return

	pjeOtimizarPerfilUsuario()
	pjeOtimizarPerfilOficialDeJustica()
	
}

async function pjeOtimizarPerfilUsuario(){

	let id	= pjeObterProcessoId()

	if(id){

		PROCESSO = await pjeObterDadosDoProcesso(id)
		pjeOtimizarDetalhesDoProcesso()

	}

}


async function pjeOtimizarPerfilOficialDeJustica(){

	let id	= pjeObterMandadoId()

	if(id){

		mandado = await pjeApiCentralDeMandadosObterMandadoDadosPrimarios(id)
		if(!mandado?.idProcessoExterno)
			return

		PROCESSO = await pjeObterDadosDoProcesso(mandado.idProcessoExterno)

		pjeOtimizarDetalhesDoMandado()

	}

}


function pjeOtimizarDetalhesDoMandado(){

	let contexto	= pjeObterContexto()

	if(!contexto.includes('mandados'))
		return

	pjeCriarBotaoFixoDestacarDadosDoProcesso()

}


function pjeOtimizarDetalhesDoProcesso(){

	let contexto	= pjeObterContexto()
	if(!contexto.includes('detalhes'))
		return
	
	pjeRedimensionarJanela()
	pjeCriarBotoesFixos()

	function pjeRedimensionarJanela(){

		if(!CONFIGURACAO?.aoAbrirDetalhesDoProcesso?.redimensionar)
			return

		let janela			= CONFIGURACAO?.janela?.pjeDetalhes || ''

		let largura			=	janela?.largura			|| 1200
		let altura			= janela?.altura			|| 900
		let horizontal	= janela?.horizontal	|| 0
		let vertical		= janela?.vertical		|| 0

		destacarJanela(
			CONFIGURACAO.aoAbrirDetalhesDoProcesso.redimensionar,
			'separarAbaDetalhesDoProcesso',
			largura,
			altura,
			horizontal,
			vertical
		)

	}

}


function pjeObterContexto(){

	if(JANELA.match(/processo[/]\d+[/]detalhe/i))
		return 'detalhes'
	
	if(JANELA.match(/centralmandados[/]mandados[/]\d+$/i))
		return 'mandados'
	
	return ''

}


async function pjeObterDadosDoProcesso(id){

	PROCESSO = await pjeApiObterProcessoDadosPrimarios(id)

	Object.assign(
		PROCESSO,
		obterDadosDoNumeroDoProcesso(PROCESSO.numero)
	)

	PROCESSO.data		= {}
	PROCESSO.valor	= pjeObterValoresDoProcesso()
	PROCESSO.tarefa = await pjeApiObterProcessoTarefa(id)
	PROCESSO.partes = await pjeApiObterProcessoPartes(id)
	
	pjeSalvarDadosDoProcesso()

	return PROCESSO
	
}


function pjeObterValoresDoProcesso(){

	let valor = {}

	if(PROCESSO?.valorDaCausa)
		valor.causa = Number(PROCESSO.valorDaCausa).toLocaleString('pt-BR',{minimumFractionDigits:2}) || ''

	return valor

}


function pjeCriarBotoesFixos(){

	pjeCriarBotaoFixoDestacarDadosDoProcesso()

	pjeCriarBotaoFixo(
		'botao-dimensoes',
		'Definir dimensões padrão para a janela',
		() => {
			let descricao	= ''
			let editar		= ''	
			let contexto	= pjeObterContexto()
			if(contexto.includes('detalhes')){
				descricao	= 'Detalhes do Processo'
				editar		= 'pjeDetalhes'
			}

			abrirPagina(caminho(`navegador/link/link.htm?editar=${editar}&descricao=${descricao}`),'link',800,500,0,0,'popup')
		}
	)

}


function pjeCriarBotaoFixoDestacarDadosDoProcesso(){

	pjeCriarBotaoFixo(
		'botao-dados-do-processo',
		'Destacar dados do processo em uma nova janela',
		() => {
			let dados = {}
			dados.id			= PROCESSO.id
			dados.numero	= PROCESSO.numero
			dados.partes	= PROCESSO.partes	
			dados.valor		= PROCESSO.valor
		
			abrirPagina(caminho('navegador/processo/processo.htm')+'?processo='+encodeURIComponent(JSON.stringify(dados)),'processo',450,700,0,0,'popup')
		}
	)

}


function pjeCriarBotaoFixo(
	tag				= '',
	legenda		= '',
	aoClicar	= ''
){

	let botao = criar(tag,'avjt'+tag,'avjt-botao-fixo')
	botao.setAttribute('aria-label',legenda)
	botao.addEventListener('click',aoClicar)

}