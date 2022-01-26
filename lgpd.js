function lgpd(){

	remover('avjt-lgpd')

 	if(!CONFIGURACAO?.lgpd?.ativado)
 		return

 	let seletores = CONFIGURACAO?.lgpd?.seletores?.trim().replace(/[,]$/gi,'') || ''

	if(seletores)
		seletores += ','

	estilizar(
		'',
		`
		:root {
			--extesao-desfoque:1px 1px 12px rgba(0,153,255,1);
		}

		${seletores}
		.partes-representante span,
		.partes-representante span::selection,
		.mat-tooltip,
		.partes-corpo,
		.partes-corpo span::selection,
		section.partes,
		section.partes::selection
		{
			color:transparent;
			text-shadow:var(--extesao-desfoque);
						
		}
					
		`,
		'avjt-lgpd'
	)

}