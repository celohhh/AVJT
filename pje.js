//publicas/pje.js

function pje(){

	if(!JANELA.includes(LINK.pje.dominio))
		return

	pjeRedirecionarPaginaAcessoNegado()
	pjeOtimizarPainelGlobal()
	pjeOtimizarPerfilUsuario()
	pjeOtimizarPerfilOficialDeJustica()

}


function pjeRedirecionarPaginaAcessoNegado(){

	esperar('pje-acesso-negado').then(redirecionar)

	function redirecionar(){
		window.location = LINK.pje.raiz
	}

}


function pjeOtimizarPainelGlobal(){

	pjePesquisarProcesso()

	function pjePesquisarProcesso(){

		let processo =  obterParametroDeUrl('processo')
		if(!processo)
			return

		esperar('#inputNumeroProcesso',true).then(
			campo => {

				alterarValorDeCampo(campo,processo)
				campo.click()

			}

		)

	}

}

async function pjeOtimizarPerfilUsuario(){

	let id	= pjeObterProcessoId()

	if(id){

		PROCESSO = await pjeObterDadosDoProcesso(id)
		console.debug('PROCESSO',PROCESSO)

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
	pjeCriarBotaoFixoConfigurarDimensoesDaJanela()

}


function pjeCriarBotaoFixoConfigurarDimensoesDaJanela(){

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

			abrirPagina(caminho(`navegador/link/link.htm?editar=${editar}&descricao=${descricao}`),800,500,0,0,'link','popup')
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

			abrirPagina(caminho('navegador/processo/processo.htm')+'?processo='+encodeURIComponent(JSON.stringify(dados)),450,700,0,0,'processo','popup')
		}
	)

}


function pjeCriarBotaoFixo(
	id				= '',
	legenda		= '',
	aoClicar	= ''
){
	criarBotao('avjt-'+id,'avjt-botao-fixo informacoes','','',legenda,aoClicar)
}