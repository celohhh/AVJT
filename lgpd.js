function lgpd(){

	
	remover('avjt-lgpd')

 	if(!CONFIGURACAO?.lgpd?.ativado)
 		return

	let elementos = [
		'.cabecalho-esquerda mat-card-subtitle',
		'.container-html *',
		'.info-usuario',
		'pje-data-table .sobrescrito',
		'pje-data-table .texto-sigilo',
		'pje-data-table[nametabela="Tabela de Processos"] tr > td:nth-child(5)',
		'pje-data-table[nametabela="Tabela de Processos"] tr > td:nth-child(7)',
		'pje-data-table[nametabela="Tabela de Processos"] tr > td:nth-child(8)',
		'pje-data-table[nametabela="Tabela de Processos"] tr > td:nth-child(9)',
		'pje-data-table[nametabela="Tabela de Atividades"] tr > td:nth-child(5)',
		'pje-data-table[nametabela="Tabela de Atividades"] tr > td:nth-child(8)',
		'pje-data-table[nametabela="Tabela de Expedientes"] tr > td:nth-child(4) span',
		'pje-data-table[nametabela="Tabela de Expedientes"] tr > td:nth-child(7) span',
		'pje-data-table[nametabela="Tabela de Expedientes"] .texto-vermelho',
		'pje-gigs-menu-relatorio pje-data-table[nametabela="Tabela de Atividades"] tr > td:nth-child(3)',
		'pje-gigs-menu-relatorio pje-data-table[nametabela="Tabela de Atividades"] tr > td:nth-child(6)',
		'pje-gigs-menu-relatorio pje-data-table[nametabela="Tabela de Comentários"] tr > td:nth-child(3)',
		'pje-gigs-menu-relatorio pje-data-table[nametabela="Tabela de Comentários"] tr > td:nth-child(4)',
		'pje-gigs-menu-relatorio pje-data-table[nametabela="Tabela de Comentários"] tr > td:nth-child(5)',
		'pje-data-table[nametabela="Tabela Petições"] tr > td:nth-child(10)',
		'pje-data-table[nametabela="Tabela de Perícias"] tr > td:nth-child(5)',
		'.mat-tooltip',
		'.rodape-post-it *',
		'.partes-corpo',
		'.partes-representante span',
		'pje-responsaveis-audiencia',
		'.post-it-conteudo',
		'section.partes'
	]

	let seletores = CONFIGURACAO?.lgpd?.seletores?.trim().replace(/[,]$/gi,'') || ''

	if(seletores)
		seletores += ','

	elementos.forEach(
		elemento => {
			seletores += elemento+','+elemento+'::selection,'
		}
	)

	seletores = seletores.replace(/[,]$/gi,'')

	estilizar(
		'',
		`
		:root {
			--extesao-desfoque:1px 1px 12px rgba(0,153,255,1);
		}

		${seletores}
		{
			color:rgba(0,0,0,0) !important;
			text-shadow:var(--extesao-desfoque) !important;
						
		}

		.canvasWrapper{
			opacity:0 !important;
		}
					
		`,
		'avjt-lgpd'
	)

}