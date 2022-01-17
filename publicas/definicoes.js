/**
 * VARIÁVEIS GLOBAIS, DISPONÍVEIS PARA TODAS AS FUNÇÕES:
 */
var
	CONFIGURACAO	= {},
	DATA					= definirDatas(),
	ESFORCOS			= {},
	EXPRESSAO			= definirExpressoesRegulares(),
	EXTENSAO			= browser.runtime.getManifest(),
	JANELA				= window.location.href || '',
	LINK					= {},
	MODO					= definirModo(),
	PROCESSO			= {}


function definicoesGlobais(){

	ESFORCOS			= definirEsforcosRepetitivos()
	LINK					= definirLinks()

	removerChavesDaMemoria(
		[
			''
		]
	)

	definirChavesPrimariasDoArmazenamento()

	//MODO.relatar = true
	relatar('CONFIGURACAO:',CONFIGURACAO)
	MODO.relatar = false
	relatar('DATA:',DATA)
	relatar('ESFORCOS:',ESFORCOS)
	relatar('EXTENSAO:',EXTENSAO)
	relatar('LINK:',LINK)
	relatar('MODO:', MODO)

	function definirChavesPrimariasDoArmazenamento(){

		if(!CONFIGURACAO?.janela)
			browser.storage.local.set({janela:{}})

		if(!CONFIGURACAO?.diagnostico)
			browser.storage.local.set({diagnosticar:false})

	}

}


function definirModo(){

	let modo = {}

	modo.relatar = false

	return modo

}


function definirDatas(){

	let agora					= new Date()
	let data					= {}
	data.hoje					= {}
	data.mesAnterior	= {}


	data.hoje.curta								= agora.toLocaleDateString()
	data.hoje.dia									= agora.getDate()
	data.hoje.ano									= agora.getFullYear()
	data.hoje.mes									= Number(agora.getMonth()) + 1
	data.hoje.mais30dias					= somarDias(agora,30)
	data.mesAnterior.primeiroDia	= mesAnteriorPrimeiroDia(agora)
	data.mesAnterior.ultimoDia		= mesAnteriorUltimoDia(agora)

	return data

	function somarDias(data,dias){

		let resultado = new Date(data)
		resultado.setDate(resultado.getDate() + dias)

		return resultado?.toLocaleDateString() || ''

	}


	function mesAnteriorPrimeiroDia(data=''){

		if(!data)
			data = new Date()

		let resultado = new Date(data)

		resultado.setDate(0)
		resultado.setDate(1)

		return resultado?.toLocaleDateString() || ''

	}


	function mesAnteriorUltimoDia(data=''){

		if(!data)
			data = new Date()

		let resultado = new Date(data)

		resultado.setDate(0)

		return resultado?.toLocaleDateString() || ''

	}


}


function definirEsforcosRepetitivos(){

	let esforcos = {}

	esforcos.cliques		= Number(0)
	esforcos.movimentos	= Number(0)
	esforcos.teclas			= Number(0)

	browser.storage.local.get(
		['esforcos'],
		armazenamento => {
			if(vazio(armazenamento)){
				esforcos.data = DATA.hoje.curta
				browser.storage.local.set({esforcos})
			}
		}
	)

	return esforcos

}


function definirExpressoesRegulares(){

	let expressao = {}

	expressao.chassi										= new RegExp(/(?![IOQ])[A-Za-z0-9]{17}/g)
	expressao.cnpj											= new RegExp(/\d{2}[.]\d{3}[.]\d{3}[/]\d{4}[-]\d{2}/g)
	expressao.cpf												= new RegExp(/\d{3}[.]\d{3}[.]\d{3}[-]\d{2}/g)
	expressao.data											= new RegExp(/\d{2}\D\d{2}\D\d{4}/g)
	expressao.hora											= new RegExp(/\d{2}[:]\d{2}/g)
	expressao.correios									= new RegExp(/[A-Za-z]{2}\d{9}[A-Za-z]{2}/gi)
	expressao.pje												= new RegExp(/pje[.].*?[.]jus[.]br/gi)
	expressao.prazo											= new RegExp(/(prazo).*?(de).*?((dia|hora)(s))/gi)
	expressao.processoNumero						= new RegExp(/\d{7}\D\d{2}\D\d{4}\D\d{1}\D\d{2}\D\d{4}/)
	expressao.processoNumeroParcial			= new RegExp(/\d{1,7}\D\d{2}\D\d{4}/)
	expressao.processoNumeroSemDigitos	= new RegExp(/\d{20}/g)
	expressao.quebraDeLinha							= new RegExp(/(\r\n|\n|\r)/gi)
	expressao.valorMonetario						= new RegExp(/\d.*?[,]\d{2}/gi)

	return expressao

}


function definirLinks(){

	let link = {}

	link.extensao				= 'https://addons.mozilla.org/pt-BR/firefox/addon/assistentevirtual-justrabalho'
	link.github					= EXTENSAO.homepage_url

	link.egestao				= 'https://novoegestao.tst.jus.br'
	link.maloteDigital	= 'https://malotedigital.jt.jus.br'
	link.roadmap				= 'https://docs.google.com/spreadsheets/d/1dfHbdPGj2RxxtJJZnQiiZKTZw5HHRJPxvTSz_2vUPFM/'
	link.sigeo					= 'https://portal.sigeo.jt.jus.br'
	link.sisbajud				= 'https://sisbajud.cnj.jus.br'
	link.telegram				= 'https://t.me/AssistenteVirtualPJeTrabalhista'
	link.tst						= 'https://tst.jus.br'
	link.wikivt					= 'https://fluxonacional.jt.jus.br'
	link.youtube				= 'https://www.youtube.com/channel/UCG0r5f3lk6AqDsEaZqzFzxQ'
	link.zoom						= 'https://zoom.us'

	link.bb							= obterLinkBancoDoBasil()
	link.cef						= obterLinkCaixaEconomicaFederal()
	link.google					= obterLinkGoogle()
	link.infojud				= obterLinkInfojud()
	link.renajud				= obterLinkRenajud()
	link.penhora				= obterLinkPenhoraOnline()
	link.sinesp					= obterLinkSinesp()
	link.whatsapp				= obterLinkWhatsapp()

	link.balcao					= CONFIGURACAO?.janela?.balcao?.url		|| obterLinkDaMemoria('balcao',		'https://meet.google.com')
	link.planilha				= CONFIGURACAO?.janela?.planilha?.url	|| obterLinkDaMemoria('planilha',	'https://docs.google.com/spreadsheets')
	link.webmail				= CONFIGURACAO?.janela?.webmail?.url	|| obterLinkDaMemoria('webmail',	'https://mail.google.com')

	let dominioTribunal = obterDominioTribunal()

	if(dominioTribunal){

		link.chamado	= CONFIGURACAO?.janela?.chamado?.url	|| obterLinkDaMemoria('chamado',	'https://assyst.'			+ dominioTribunal + '/assystnet')
		link.eCarta		= CONFIGURACAO?.janela?.eCarta?.url		|| obterLinkDaMemoria('eCarta',		'https://ecarta.'			+ dominioTribunal)
		link.garimpo	= CONFIGURACAO?.janela?.garimpo?.url	|| obterLinkDaMemoria('garimpo',	'https://deposito.'		+ dominioTribunal)
		link.intranet	= CONFIGURACAO?.janela?.intranet?.url	|| obterLinkDaMemoria('intranet',	'https://satelites.'	+ dominioTribunal + '/aplicacoesExtranet')
		link.siscondj	= CONFIGURACAO?.janela?.siscondj?.url	|| obterLinkDaMemoria('siscondj',	'https://siscondj.'		+ dominioTribunal)
		link.tribunal	= dominioTribunal
		link.pje			= obterLinkPje()

	}

	return link


	function obterLinkTribunal(){

		let tribunal = {}
		tribunal.dominio	= obterDominioTribunal()
		tribunal.portal		= 'https://' + tribunal.dominio

		return tribunal

	}

	function montarUrl(
		url					= '',
		subdominio	= '',
		caminho			= ''
	){
		if(!subdominio)
			return 'https://' + url.dominio + '/' + caminho
		return 'https://' + subdominio + '.' + url.dominio + '/' + caminho
	}


	function obterLinkWhatsapp(){

		let url				= {}
		url.protocolo	= 'whatsapp://send?phone='
		url.dominio		= 'whatsapp.com'
		url.raiz			= montarUrl(url)
		url.api				= montarUrl(url,'api')
		url.chat			= montarUrl(url,'chat')
		url.grupo			= montarUrl(url,'chat')

		if(CONFIGURACAO?.instituicao?.tribunal?.includes('15'))
			url.grupo += 'DKcc9eecyAXBwzfgxOe1AI'
		else
			url.grupo += 'FSBJFsBEX8y2YmGGIqM35A'

		return url


	}


	function obterLinkGoogle(){

		let url				= {}
		url.dominio		= 'google.com'
		url.raiz			= montarUrl(url)
		url.agenda		= montarUrl(url,'calendar')
		url.drive			= montarUrl(url,'drive')
		url.mail			= montarUrl(url,'mail')
		url.meet 			= montarUrl(url,'meet')
		url.planilhas	= montarUrl(url,'docs','spreadsheets')
		url.tradutor	= montarUrl(url,'translate','?sl=en&tl=pt&text=')

		return url

	}

	function obterLinkPenhoraOnline(){

		let url				= {}
		url.dominio		= 'penhoraonline.org.br'
		url.raiz			= montarUrl(url)
		url.solicitar	= montarUrl(url,'','frmHomeSolicitarCertidoes.aspx')

		return url

	}

	function obterLinkSinesp(){

		let url				= {}
		url.dominio		= 'sinesp.gov.br'
		url.raiz			= montarUrl(url)
		url.infoseg		= montarUrl(url,'infoseg','infoseg2/?q=')
		url.seguranca	= montarUrl(url,'seguranca')

		return url

	}


	function obterLinkDaMemoria(
		chave	= '',
		url		= ''
	){

		if(!chave)
			return ''

		browser.storage.local.get(
			'janela',
			armazenamento => {

				let objeto	= armazenamento?.janela[chave] || {}
				let valor		= objeto?.url || ''
				let link		= valor || url

				if(!valor){
					let janela		= armazenamento.janela
					janela[chave]	= {url:link}
					browser.storage.local.set({janela})
					setTimeout(definicoesGlobais,100)
				}

			}
		)

	}


	function obterLinkInfojud(){

		let url				= {}
		url.dominio		= 'cav.receita.fazenda.gov.br'
		url.raiz			= montarUrl(url)
		url.servicos	= montarUrl(url,'','ecac/Aplicacao.aspx?id=5032')
		url.solicitar	= montarUrl(url,'','Servicos/ATSDR/Decjuiz/solicitacao.asp')
		return url

	}


	function obterLinkRenajud(){

		let url			= {}
		url.dominio	= 'renajud.denatran.serpro.gov.br'
		url.raiz		= montarUrl(url)
		url.inserir	= montarUrl(url,'','renajud/restrito/restricoes-insercao.jsf')

		return url

	}


	function obterLinkBancoDoBasil(){

		let bb										= {}
		bb.depositos							= {}
		bb.depositos.magistrados	= 'https://www63.bb.com.br/portalbb/djo/login.bbx'

		return bb

	}

	function obterLinkCaixaEconomicaFederal(){

		let cef										= {}
		cef.depositos							= {}
		cef.depositos.judiciais		= 'https://depositojudicial.caixa.gov.br/sigsj_internet/acesso-restrito/contas/consulta/consulta-avancada/?'
		cef.depositos.recursais		= 'https://conectividade.caixa.gov.br'

		return cef

	}


	function obterLinkPje(){

		if(!CONFIGURACAO?.instituicao?.tribunal)
			return ''

		let pje									= {}
		pje.api									= {}
		pje.consulta						= {}
		pje.painel							= {}

		pje.dominio							= 'pje.' + obterDominioTribunal()
		pje.raiz								= 'https://' + pje.dominio + '/'
		pje.kz									= pje.raiz + 'pjekz/'

		pje.calc								= pje.raiz + 'pjecalc'

		pje.primeirograu				= pje.raiz + 'primeirograu/'
		pje.segundograu					= pje.raiz + 'segundograu/'

		pje.consulta.advogado		= pje.primeirograu + 'PessoaAdvogado/ConfirmarCadastro/listView.seam'
		pje.consulta.pessoa			= pje.primeirograu + 'ConsultaPessoa/listView.seam'
		pje.consulta.processos	= pje.raiz + 'administracao/consulta/processo/index'
		pje.painel.gigs					= pje.kz + 'gigs/relatorios/atividades'
		pje.painel.global				= pje.kz + 'painel/global/todos/lista-processos/'
		pje.versao1							= pje.primeirograu + 'Painel/painel_usuario/list.seam'
		pje.modelos							= pje.kz + 'configuracao/modelos-documentos'
		pje.processo						= pje.kz + 'processo/'

		pje.api.comum						= pje.raiz + 'pje-comum-api/api/'
		pje.api.consulta				= pje.raiz + 'pje-consulta-api/api/'
		pje.api.mandados				= pje.raiz + 'pje-centralmandados-api/api/'

		return pje

	}


}


/**
 * REMOVE CHAVES ESPECÍFICAS DO ${browser.storage.local}, QUE ESTEJAM PRESENTES NA GLOBAL ${CONFIGURACAO}:
 * @param {Array}	chaves
 */
 function removerChavesDaMemoria(chaves = []){

	chaves.forEach(
		chave => {
			if(chave in CONFIGURACAO)
				browser.storage.local.remove(chave).then(
					() => aoFuncionar(chave),
					aoFalhar
				)
		}
	)

	function aoFuncionar(chave){
		relatar('Chave removida: ',chave)
	}

	function aoFalhar(erro){
		relatar('Erro:',erro)
	}

}


function obterDominioTribunal(){

	if(CONFIGURACAO?.instituicao?.tribunal == undefined)
		return ''

	let sigla = obterSiglaTribunal()

	return minusculas(sigla) + '.jus.br'

}


function obterSiglaTribunal(){

	if(CONFIGURACAO?.instituicao?.tribunal == undefined)
		return ''

	let sigla = 'T'

	if(CONFIGURACAO.instituicao?.tribunal == '0')
		sigla += 'ST'
	else
		sigla += 'RT' + CONFIGURACAO.instituicao?.tribunal

	return sigla

}

