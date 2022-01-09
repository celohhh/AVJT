window.addEventListener('load',criarMenuDaBarraDeFerramentasDoNavegador)


function criarMenuDaBarraDeFerramentasDoNavegador(){

	browser.storage.local.get(
		null,
		armazenamento => {

			EXTENSAO.ativada	= armazenamento.ativada
			CONFIGURACAO			= armazenamento

			if(!CONFIGURACAO?.instituicao?.tribunal)
				abrirPaginaConfiguracaoDoTribunal()

			setInterval(contarEsforcosRepetitivosPoupados,100)

			definicoesGlobais()
			criarCabecalhoDePaginaDaExtensao()
			definirEstadoDaExtensao()
			criarRodapeDePaginaDaExtensao()
			criarLinksUteis()
			inserirLegendaNosLinksDoYoutube()

			criarBotaoFixo(
				'script',
				'Script de Usuário (se você possui conhecimento em JavaScript, poderá executar códigos nas páginas em que desejar)',
				abrirPaginaScriptDeUsuario
			)
			criarBotaoFixo(
				'desenvolvimento',
				'Sente falta de alguma funcionalidade? Clique neste botão e fale com o Desenvolvedor desta Extensão',
				abrirPaginaDesenvolvimento
			)
			criarBotaoFixo(
				'recarregar',
				'Recarregar Extensão',
				evento => {
					evento.target.classList.toggle('recarregar')
					setTimeout(recarregar,500)
				}
			)
		
			obterConfiguracoesDaExtensao()

			window.addEventListener('input',salvarConfiguracoesDaExtensao)

			window.addEventListener(
				'click',
				evento => {

					let tag	= evento.target.tagName
					let id	= evento.target.id

					if(id === 'ativador')
						return

					if(tag.includes('INPUT'))
						salvarConfiguracoesDaExtensao()

				}
			)

		}
	)

	function criarBotaoFixo(
		id				= '',
		legenda		= '',
		aoClicar	= ''
	){
		let botao = criar('botao-fixo',id)
		botao.setAttribute('aria-label',legenda)
		botao.addEventListener('click',aoClicar)
	}

	function inserirLegendaNosLinksDoYoutube(){

		let informacoes = document.querySelectorAll('.youtube')
		informacoes.forEach(
			youtube => {
				youtube.setAttribute('aria-label',"Acesse vídeo(s) sobre esta seção no Canal do Youtube do " + EXTENSAO.name)
			}
		)

	}

	function criarLinksUteis(){

		let secao = selecionar('#links-uteis')
		if(!secao)
			return

		document.addEventListener(
			'click',
			fecharMenu
		)

		criarBotaoDoMenu(
			'pje-instancia-1',
			'PJe - Painel -  1º Grau',
			() => criarJanela(LINK.pje.primeirograu,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje1',
			'PJe - Painel - Versão 1.x',
			() => criarJanela(LINK.pje.versao1,'pje1')
		)
		criarBotaoDoMenu(
			'pje-instancia-2',
			'PJe - Painel - 2º Grau',
			() => criarJanela(LINK.pje.segundograu,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje-painel-global',
			'PJe - Painel Global - Todos os Processos',
			() => criarJanela(LINK.pje.painel.global,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje-painel-gigs',
			'PJe - Painel - Relatórios GIGS',
			() => criarJanela(LINK.pje.painel.gigs,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje-consulta-processos',
			'PJe - Painel - Consultar Processos',
			() => criarJanela(LINK.pje.consulta.processos,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje-consulta-pessoa',
			'PJe - Painel - Consutar Pessoa',
			() => criarJanela(LINK.pje.consulta.pessoa,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje-consulta-advogado',
			'PJe - Painel - Consutar Advogado(a)',
			() => criarJanela(LINK.pje.consulta.advogado,'pjePainel')
		)
		criarBotaoDoMenu(
			'pje-modelos-de-documentos',
			'PJe - Painel - Modelos de Documentos',
			() => criarJanela(LINK.pje.modelos,'pjePainel')
		)
		criarBotaoDoMenu(
			'garimpo',
			'Sistema Garimpo',
			() => criarJanela(LINK.garimpo,'garimpo')
		)
		criarBotaoDoMenu(
			'intranet',
			'Intranet',
			() => criarJanela(LINK.intranet,'intranet')
		)
		criarBotaoDoMenu(
			'zoom',
			'Zoom',
			() => criarJanela(LINK.zoom,''),
			false
		)
		criarBotaoDoMenu(
			'meet',
			'Meet',
			() => criarJanela(LINK.google.meet,''),
			false
		)
		criarBotaoDoMenu(
			'drive',
			'Drive',
			() => criarJanela(LINK.google.drive,''),
			false
		)
		criarBotaoDoMenu(
			'agenda',
			'Agenda',
			() => criarJanela(LINK.google.agenda,''),
			false
		)
		criarBotaoDoMenu(
			'webmail',
			'Webmail',
			() => criarJanela(LINK.webmail,'')
		)
		criarBotaoDoMenu(
			'chamado',
			'Abertura de Chamado',
			() => criarJanela(LINK.chamado,'chamado')
		)
		criarBotaoDoMenu(
			'balcao',
			'Balcão Virtual',
			() => criarJanela(LINK.balcao,'balcao')
		)
		criarBotaoDoMenu(
			'planilha',
			'Planilha de Trabalho',
			() => criarJanela(LINK.planilha,'planilha')
		)
		criarBotaoDoMenu(
			'eCarta',
			'Sistema E-Carta',
			() => criarJanela(LINK.eCarta),
			false
		)
		criarBotaoDoMenu(
			'malote',
			'Malote Digital',
			() => criarJanela(LINK.maloteDigital),
			false
		)
		criarBotaoDoMenu(
			'sigeo',
			'SIGEO',
			() => criarJanela(LINK.sigeo,'sigeo')
		)
		criarBotaoDoMenu(
			'tst',
			'TST - Trubunal Superior do Trabalho',
			() => criarJanela(LINK.tst),
			false
		)
		criarBotaoDoMenu(
			'wikivt',
			'WikiVT',
			() => criarJanela(LINK.wikivt),
			false
		)
		criarBotaoDoMenu(
			'egestao',
			'E-Gestão',
			() => criarJanela(LINK.egestao),
			false
		)
		criarBotaoDoMenu(
			'sisbajud',
			'SISBAJUD',
			() => criarJanela(LINK.sisbajud,'sisbajud')
		)
		criarBotaoDoMenu(
			'infojud',
			'INFOJUD',
			() => criarJanela(LINK.infojud,'infojud')
		)
		criarBotaoDoMenu(
			'siscondj',
			'SISCONDJ-JT',
			() => criarJanela(LINK.siscondj,'siscondj')
		)
		criarBotaoDoMenu(
			'bb',
			'BB - Depósitos Judiciais',
			() => criarJanela(LINK.bb.depositos.magistrados,'bb')
		)
		criarBotaoDoMenu(
			'cefRecursais',
			'CEF - Depósitos Recursais',
			() => criarJanela(LINK.cef.depositos.recursais,'cefRecursais')
		)
		criarBotaoDoMenu(
			'cefJudiciais',
			'CEF - Depósitos Judiciais',
			() => criarJanela(LINK.cef.depositos.judiciais,'cefJudiciais')
		)
		criarBotaoDoMenu(
			'renajud',
			'RENAJUD',
			() => criarJanela(LINK.renajud,'renajud')
		)
		criarBotaoDoMenu(
			'pjeCalc',
			'PJe Calc',
			() => criarJanela(LINK.pje.calc,'pjeCalc')
		)

		function fecharMenu(){
			remover('menu-de-contexto')
		}

		function criarBotaoDoMenu(
			id				= '',
			titulo		= '',
			aoClicar	= '',
			editavel		= true
		){

			let botao			= criar('button',id,'link legenda',secao)
			let editar		= id

			if(id)
				botao.id = id

			if(titulo)
				botao.setAttribute('aria-label',titulo)

			if(aoClicar)
				botao.addEventListener(
					'click',
					() => {
						aoClicar()
						esforcosPoupados(1)
					}
				)

			if(editavel){
				if(titulo.includes('PJe - Painel'))
					editar = 'pjePainel'
				botao.dataset.editar = editar
			}

			criarMenuDeContexto()

			function criarMenuDeContexto(){

				botao.addEventListener('contextmenu',elemento => criarMenu(elemento))

				function criarMenu(referencia){

					referencia.preventDefault()

					let posicao = referencia.target.getBoundingClientRect()
					let menu = criar('nav','menu-de-contexto')

					menu.style.left	= (posicao.left - 45) + 'px'
					menu.style.top	= (posicao.top + 55) + 'px'

					menu.addEventListener(
						'click',
						evento => evento.stopPropagation()
					)

					let botaoEditar = criar(
						'input',
						'menu-de-contexto-botao-editar',
						'menu-de-contexto-botao',
						menu
					)

					botaoEditar.type = 'button'
					botaoEditar.value = 'Editar Opções'

					if(!editavel){
						botaoEditar.remove()
						let texto = criar('p','','',menu)
						texto.innerText = 'Sem opções'
						return
					}

					let editar		= referencia.target.dataset.editar || ''
					let descricao	= referencia.target.getAttribute('aria-label') || ''

					botaoEditar.addEventListener(
						'click',
						() => {
							abrirPaginaConfiguracaoDeLink(
								editar,
								descricao
							)
						}
					)

				}

			}

		}

	}

}