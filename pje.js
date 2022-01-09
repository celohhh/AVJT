//publicas/pje.js

function pje(){

	if(!JANELA.includes(LINK.pje.dominio))
		return

	PROCESSO.id	= pjeObterProcessoId()

	if(PROCESSO.id){

		pjeObterDadosDoProcesso(PROCESSO.id).then(
			
			() => {

				console.debug('PROCESSO:',PROCESSO)
				pjeOtimizarDetalhesDoProcesso()
				
			}
			
		)

	}
	
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
	
	return ''

}

async function pjeObterDadosDoProcesso(){

	const id = PROCESSO.id

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

	function pjeCriarBotaoFixo(
		tag				= '',
		legenda		= '',
		aoClicar	= ''
	){
	
		let botao = criar(tag,'avjt'+tag,'avjt-botao-fixo')
		botao.setAttribute('aria-label',legenda)
		botao.addEventListener('click',aoClicar)

	}


}